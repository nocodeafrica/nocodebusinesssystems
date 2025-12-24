-- =====================================================
-- Migration: 00001_create_core_schema.sql
-- Description: Core platform schema for multi-tenant architecture
-- Author: Horizon Systems
-- Date: 2025-10-20
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- SCHEMA: core
-- Purpose: Core platform tables for organizations, users, and module management
-- =====================================================

CREATE SCHEMA IF NOT EXISTS core;

-- =====================================================
-- TABLE: core.modules
-- Description: Available modules in the platform
-- =====================================================

CREATE TABLE IF NOT EXISTS core.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL CHECK (code ~ '^[a-z_]+$'),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'operations',
        'sales',
        'hr',
        'finance',
        'collaboration',
        'analytics'
    )),
    is_active BOOLEAN NOT NULL DEFAULT true,
    requires_modules TEXT[] DEFAULT '{}', -- Array of module codes this module depends on
    base_price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
    base_price_annual DECIMAL(10, 2) NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments for modules table
COMMENT ON TABLE core.modules IS 'Available system modules that organizations can subscribe to';
COMMENT ON COLUMN core.modules.code IS 'Unique module identifier used in code (e.g., inventory, crm, recruitment)';
COMMENT ON COLUMN core.modules.requires_modules IS 'Array of module codes that must be enabled before this module';

-- =====================================================
-- TABLE: core.organizations
-- Description: Multi-tenant organizations
-- =====================================================

CREATE TABLE IF NOT EXISTS core.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 200),
    slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$' AND char_length(slug) >= 2),
    industry TEXT,
    size TEXT CHECK (size IN ('startup', 'small', 'medium', 'large', 'enterprise')),

    -- Contact information
    email TEXT CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    phone TEXT,
    website TEXT,

    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    country TEXT NOT NULL DEFAULT 'South Africa',
    postal_code TEXT,

    -- Business details
    registration_number TEXT,
    tax_number TEXT,

    -- Subscription status
    subscription_status TEXT NOT NULL DEFAULT 'trial' CHECK (subscription_status IN (
        'trial',
        'active',
        'suspended',
        'cancelled',
        'expired'
    )),
    trial_ends_at TIMESTAMPTZ,
    subscription_starts_at TIMESTAMPTZ,
    subscription_ends_at TIMESTAMPTZ,

    -- Billing
    billing_email TEXT CHECK (billing_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')),

    -- Settings and metadata
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',

    -- Flags
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT false,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Add comments for organizations table
COMMENT ON TABLE core.organizations IS 'Multi-tenant organizations (companies) using the platform';
COMMENT ON COLUMN core.organizations.slug IS 'URL-friendly unique identifier for the organization';
COMMENT ON COLUMN core.organizations.subscription_status IS 'Current subscription state of the organization';

-- =====================================================
-- TABLE: core.users
-- Description: Extended user profiles (extends auth.users)
-- =====================================================

CREATE TABLE IF NOT EXISTS core.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Personal information
    first_name TEXT NOT NULL CHECK (char_length(first_name) >= 1 AND char_length(first_name) <= 100),
    last_name TEXT NOT NULL CHECK (char_length(last_name) >= 1 AND char_length(last_name) <= 100),
    display_name TEXT,
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    phone TEXT,
    avatar_url TEXT,

    -- Job information
    job_title TEXT,
    department TEXT,
    employee_id TEXT,

    -- Role and permissions
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN (
        'super_admin',     -- Platform administrator
        'org_admin',       -- Organization administrator
        'manager',         -- Department/team manager
        'user',            -- Standard user
        'viewer'           -- Read-only user
    )),
    permissions JSONB DEFAULT '{}', -- Module-specific permissions

    -- Settings
    settings JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',

    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active',
        'inactive',
        'suspended',
        'invited'
    )),

    -- Activity tracking
    last_login_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ,

    -- Audit fields
    invited_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    invited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT unique_email_per_org UNIQUE (organization_id, email)
);

-- Add comments for users table
COMMENT ON TABLE core.users IS 'Extended user profiles linked to auth.users';
COMMENT ON COLUMN core.users.role IS 'Organization-level role for access control';
COMMENT ON COLUMN core.users.permissions IS 'Module-specific permission overrides';

-- =====================================================
-- TABLE: core.subscriptions
-- Description: Organization module subscriptions
-- =====================================================

CREATE TABLE IF NOT EXISTS core.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES core.modules(id) ON DELETE RESTRICT,

    -- Subscription details
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'trial',
        'active',
        'suspended',
        'cancelled',
        'expired'
    )),

    -- Pricing
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
    price_per_cycle DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ZAR',

    -- Usage limits
    user_limit INTEGER,
    storage_limit_gb INTEGER,
    api_calls_limit INTEGER,
    custom_limits JSONB DEFAULT '{}',

    -- Subscription timeline
    trial_ends_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_org_module UNIQUE (organization_id, module_id),
    CONSTRAINT valid_trial_period CHECK (
        (status != 'trial') OR (trial_ends_at IS NOT NULL)
    ),
    CONSTRAINT valid_price CHECK (price_per_cycle >= 0)
);

-- Add comments for subscriptions table
COMMENT ON TABLE core.subscriptions IS 'Organization subscriptions to specific modules';
COMMENT ON COLUMN core.subscriptions.custom_limits IS 'Module-specific usage limits and quotas';

-- =====================================================
-- TABLE: core.invitations
-- Description: Pending user invitations
-- =====================================================

CREATE TABLE IF NOT EXISTS core.invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    role TEXT NOT NULL CHECK (role IN ('org_admin', 'manager', 'user', 'viewer')),

    -- Invitation details
    token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64'),
    invited_by UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,

    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'accepted',
        'expired',
        'revoked'
    )),

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Timeline
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_pending_invitation UNIQUE (organization_id, email, status)
        WHERE status = 'pending'
);

-- Add comments for invitations table
COMMENT ON TABLE core.invitations IS 'Pending user invitations to organizations';
COMMENT ON COLUMN core.invitations.token IS 'Secure token for accepting invitation';

-- =====================================================
-- TABLE: core.audit_logs
-- Description: System-wide audit trail
-- =====================================================

CREATE TABLE IF NOT EXISTS core.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES core.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,

    -- Action details
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,

    -- Changes
    old_values JSONB,
    new_values JSONB,

    -- Context
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',

    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments for audit_logs table
COMMENT ON TABLE core.audit_logs IS 'System-wide audit trail for all critical actions';
COMMENT ON COLUMN core.audit_logs.action IS 'Action performed (e.g., create, update, delete)';

-- =====================================================
-- INDEXES
-- =====================================================

-- Organizations indexes
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON core.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON core.organizations(subscription_status)
    WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_organizations_trial ON core.organizations(trial_ends_at)
    WHERE subscription_status = 'trial';

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_organization ON core.users(organization_id)
    WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_email ON core.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON core.users(organization_id, role)
    WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_status ON core.users(status)
    WHERE deleted_at IS NULL;

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_organization ON core.subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_module ON core.subscriptions(module_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON core.subscriptions(status, ends_at);

-- Invitations indexes
CREATE INDEX IF NOT EXISTS idx_invitations_organization ON core.invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON core.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON core.invitations(token)
    WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_invitations_status ON core.invitations(status, expires_at);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization ON core.audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON core.audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON core.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON core.audit_logs(created_at DESC);

-- Modules indexes
CREATE INDEX IF NOT EXISTS idx_modules_category ON core.modules(category) WHERE is_active = true;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION core.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Check module dependencies
CREATE OR REPLACE FUNCTION core.check_module_dependencies()
RETURNS TRIGGER AS $$
DECLARE
    required_module TEXT;
    has_subscription BOOLEAN;
BEGIN
    -- Get required modules for this subscription
    FOR required_module IN
        SELECT unnest(requires_modules)
        FROM core.modules
        WHERE id = NEW.module_id
    LOOP
        -- Check if organization has subscription to required module
        SELECT EXISTS(
            SELECT 1
            FROM core.subscriptions s
            JOIN core.modules m ON s.module_id = m.id
            WHERE s.organization_id = NEW.organization_id
            AND m.code = required_module
            AND s.status IN ('trial', 'active')
        ) INTO has_subscription;

        IF NOT has_subscription THEN
            RAISE EXCEPTION 'Missing required module: %. Please subscribe to % first.',
                required_module, required_module;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-expire invitations
CREATE OR REPLACE FUNCTION core.expire_old_invitations()
RETURNS void AS $$
BEGIN
    UPDATE core.invitations
    SET status = 'expired'
    WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function: Get organization active modules
CREATE OR REPLACE FUNCTION core.get_organization_modules(org_id UUID)
RETURNS TABLE(
    module_code TEXT,
    module_name TEXT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.code,
        m.name,
        s.status
    FROM core.subscriptions s
    JOIN core.modules m ON s.module_id = m.id
    WHERE s.organization_id = org_id
    AND s.status IN ('trial', 'active')
    ORDER BY m.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user has module access
CREATE OR REPLACE FUNCTION core.has_module_access(
    p_user_id UUID,
    p_module_code TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    has_access BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM core.users u
        JOIN core.subscriptions s ON s.organization_id = u.organization_id
        JOIN core.modules m ON m.id = s.module_id
        WHERE u.id = p_user_id
        AND m.code = p_module_code
        AND s.status IN ('trial', 'active')
        AND u.status = 'active'
        AND u.deleted_at IS NULL
    ) INTO has_access;

    RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON core.organizations
    FOR EACH ROW
    EXECUTE FUNCTION core.update_updated_at();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON core.users
    FOR EACH ROW
    EXECUTE FUNCTION core.update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON core.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION core.update_updated_at();

CREATE TRIGGER update_modules_updated_at
    BEFORE UPDATE ON core.modules
    FOR EACH ROW
    EXECUTE FUNCTION core.update_updated_at();

-- Check module dependencies on subscription
CREATE TRIGGER check_subscription_dependencies
    BEFORE INSERT ON core.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION core.check_module_dependencies();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all core tables
ALTER TABLE core.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: core.organizations
-- =====================================================

-- Super admins can see all organizations
CREATE POLICY "super_admins_all_organizations"
    ON core.organizations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM core.users
            WHERE users.id = auth.uid()
            AND users.role = 'super_admin'
            AND users.deleted_at IS NULL
        )
    );

-- Users can see their own organization
CREATE POLICY "users_own_organization"
    ON core.organizations
    FOR SELECT
    USING (
        id IN (
            SELECT organization_id FROM core.users
            WHERE users.id = auth.uid()
            AND users.deleted_at IS NULL
        )
    );

-- Org admins can update their organization
CREATE POLICY "org_admins_update_organization"
    ON core.organizations
    FOR UPDATE
    USING (
        id IN (
            SELECT organization_id FROM core.users
            WHERE users.id = auth.uid()
            AND users.role = 'org_admin'
            AND users.deleted_at IS NULL
        )
    );

-- =====================================================
-- RLS POLICIES: core.users
-- =====================================================

-- Users can see users in their organization
CREATE POLICY "users_own_organization_users"
    ON core.users
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM core.users
            WHERE users.id = auth.uid()
            AND users.deleted_at IS NULL
        )
    );

-- Users can update their own profile
CREATE POLICY "users_update_own_profile"
    ON core.users
    FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Org admins can manage users in their organization
CREATE POLICY "org_admins_manage_users"
    ON core.users
    FOR ALL
    USING (
        organization_id IN (
            SELECT organization_id FROM core.users
            WHERE users.id = auth.uid()
            AND users.role = 'org_admin'
            AND users.deleted_at IS NULL
        )
    );

-- =====================================================
-- RLS POLICIES: core.subscriptions
-- =====================================================

-- Users can view their organization's subscriptions
CREATE POLICY "users_view_org_subscriptions"
    ON core.subscriptions
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM core.users
            WHERE users.id = auth.uid()
            AND users.deleted_at IS NULL
        )
    );

-- Org admins can manage subscriptions
CREATE POLICY "org_admins_manage_subscriptions"
    ON core.subscriptions
    FOR ALL
    USING (
        organization_id IN (
            SELECT organization_id FROM core.users
            WHERE users.id = auth.uid()
            AND users.role = 'org_admin'
            AND users.deleted_at IS NULL
        )
    );

-- Super admins can manage all subscriptions
CREATE POLICY "super_admins_all_subscriptions"
    ON core.subscriptions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM core.users
            WHERE users.id = auth.uid()
            AND users.role = 'super_admin'
        )
    );

-- =====================================================
-- RLS POLICIES: core.modules
-- =====================================================

-- All authenticated users can view active modules
CREATE POLICY "authenticated_view_modules"
    ON core.modules
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL
        AND is_active = true
    );

-- Super admins can manage modules
CREATE POLICY "super_admins_manage_modules"
    ON core.modules
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM core.users
            WHERE users.id = auth.uid()
            AND users.role = 'super_admin'
        )
    );

-- =====================================================
-- RLS POLICIES: core.invitations
-- =====================================================

-- Users can view invitations for their organization
CREATE POLICY "users_view_org_invitations"
    ON core.invitations
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM core.users
            WHERE users.id = auth.uid()
            AND users.deleted_at IS NULL
        )
    );

-- Org admins and managers can manage invitations
CREATE POLICY "admins_manage_invitations"
    ON core.invitations
    FOR ALL
    USING (
        organization_id IN (
            SELECT organization_id FROM core.users
            WHERE users.id = auth.uid()
            AND users.role IN ('org_admin', 'manager')
            AND users.deleted_at IS NULL
        )
    );

-- =====================================================
-- RLS POLICIES: core.audit_logs
-- =====================================================

-- Users can view their own audit logs
CREATE POLICY "users_view_own_audit_logs"
    ON core.audit_logs
    FOR SELECT
    USING (user_id = auth.uid());

-- Org admins can view their organization's audit logs
CREATE POLICY "org_admins_view_org_audit_logs"
    ON core.audit_logs
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM core.users
            WHERE users.id = auth.uid()
            AND users.role = 'org_admin'
            AND users.deleted_at IS NULL
        )
    );

-- Super admins can view all audit logs
CREATE POLICY "super_admins_view_all_audit_logs"
    ON core.audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM core.users
            WHERE users.id = auth.uid()
            AND users.role = 'super_admin'
        )
    );

-- System can insert audit logs
CREATE POLICY "system_insert_audit_logs"
    ON core.audit_logs
    FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- GRANTS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA core TO authenticated;
GRANT USAGE ON SCHEMA core TO service_role;

-- Grant access to tables
GRANT SELECT ON ALL TABLES IN SCHEMA core TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA core TO service_role;

-- Grant access to functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA core TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA core TO service_role;

-- =====================================================
-- COMPLETION
-- =====================================================

-- Add migration tracking
COMMENT ON SCHEMA core IS 'Core platform schema - Migration 00001 - Created 2025-10-20';
