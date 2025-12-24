-- =====================================================
-- Rollback Script for Horizon Systems Database
-- Description: Safely removes all schemas and data
-- Author: Horizon Systems
-- Date: 2025-10-20
-- =====================================================

-- WARNING: This will delete all data!
-- Only run this if you want to completely reset the database

BEGIN;

-- =====================================================
-- CONFIRMATION CHECK
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '====================================';
    RAISE NOTICE 'DANGER: Database Rollback Started';
    RAISE NOTICE '====================================';
    RAISE NOTICE 'This will DELETE ALL DATA!';
    RAISE NOTICE 'Press Ctrl+C now to cancel...';
    RAISE NOTICE 'Waiting 5 seconds...';
    RAISE NOTICE '====================================';
    PERFORM pg_sleep(5);
END $$;

-- =====================================================
-- DROP INVENTORY SCHEMA
-- =====================================================

RAISE NOTICE 'Dropping inventory schema...';

-- Drop RLS policies
DROP POLICY IF EXISTS "users_access_own_org_categories" ON inventory.categories;
DROP POLICY IF EXISTS "users_access_own_org_brands" ON inventory.brands;
DROP POLICY IF EXISTS "users_access_units" ON inventory.units;
DROP POLICY IF EXISTS "users_access_own_org_products" ON inventory.products;
DROP POLICY IF EXISTS "users_access_own_org_product_variants" ON inventory.product_variants;
DROP POLICY IF EXISTS "users_access_own_org_warehouses" ON inventory.warehouses;
DROP POLICY IF EXISTS "users_access_own_org_stock" ON inventory.stock;
DROP POLICY IF EXISTS "users_access_own_org_stock_movements" ON inventory.stock_movements;
DROP POLICY IF EXISTS "users_access_own_org_suppliers" ON inventory.suppliers;
DROP POLICY IF EXISTS "users_access_own_org_purchase_orders" ON inventory.purchase_orders;
DROP POLICY IF EXISTS "users_access_own_org_purchase_order_items" ON inventory.purchase_order_items;
DROP POLICY IF EXISTS "users_access_own_org_stock_adjustments" ON inventory.stock_adjustments;
DROP POLICY IF EXISTS "users_access_own_org_stock_adjustment_items" ON inventory.stock_adjustment_items;
DROP POLICY IF EXISTS "users_access_own_org_stock_alerts" ON inventory.stock_alerts;
DROP POLICY IF EXISTS "users_access_own_org_stock_transfers" ON inventory.stock_transfers;
DROP POLICY IF EXISTS "users_access_own_org_stock_transfer_items" ON inventory.stock_transfer_items;

-- Drop functions
DROP FUNCTION IF EXISTS inventory.has_inventory_access();
DROP FUNCTION IF EXISTS inventory.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS inventory.update_category_path() CASCADE;
DROP FUNCTION IF EXISTS inventory.adjust_stock(UUID, UUID, UUID, UUID, DECIMAL, TEXT, TEXT, UUID, TEXT, DECIMAL, TEXT, UUID);
DROP FUNCTION IF EXISTS inventory.check_low_stock();
DROP FUNCTION IF EXISTS inventory.get_product_total_stock(UUID, UUID);
DROP FUNCTION IF EXISTS inventory.reserve_stock(UUID, UUID, UUID, DECIMAL);
DROP FUNCTION IF EXISTS inventory.release_stock(UUID, UUID, UUID, DECIMAL);

-- Drop tables (in reverse order of dependencies)
DROP TABLE IF EXISTS inventory.stock_transfer_items CASCADE;
DROP TABLE IF EXISTS inventory.stock_transfers CASCADE;
DROP TABLE IF EXISTS inventory.stock_alerts CASCADE;
DROP TABLE IF EXISTS inventory.stock_adjustment_items CASCADE;
DROP TABLE IF EXISTS inventory.stock_adjustments CASCADE;
DROP TABLE IF EXISTS inventory.purchase_order_items CASCADE;
DROP TABLE IF EXISTS inventory.purchase_orders CASCADE;
DROP TABLE IF EXISTS inventory.suppliers CASCADE;
DROP TABLE IF EXISTS inventory.stock_movements CASCADE;
DROP TABLE IF EXISTS inventory.stock CASCADE;
DROP TABLE IF EXISTS inventory.warehouses CASCADE;
DROP TABLE IF EXISTS inventory.product_variants CASCADE;
DROP TABLE IF EXISTS inventory.products CASCADE;
DROP TABLE IF EXISTS inventory.units CASCADE;
DROP TABLE IF EXISTS inventory.brands CASCADE;
DROP TABLE IF EXISTS inventory.categories CASCADE;

-- Drop schema
DROP SCHEMA IF EXISTS inventory CASCADE;

RAISE NOTICE 'Inventory schema dropped successfully';

-- =====================================================
-- DROP CORE SCHEMA
-- =====================================================

RAISE NOTICE 'Dropping core schema...';

-- Drop RLS policies
DROP POLICY IF EXISTS "super_admins_all_organizations" ON core.organizations;
DROP POLICY IF EXISTS "users_own_organization" ON core.organizations;
DROP POLICY IF EXISTS "org_admins_update_organization" ON core.organizations;

DROP POLICY IF EXISTS "users_own_organization_users" ON core.users;
DROP POLICY IF EXISTS "users_update_own_profile" ON core.users;
DROP POLICY IF EXISTS "org_admins_manage_users" ON core.users;

DROP POLICY IF EXISTS "users_view_org_subscriptions" ON core.subscriptions;
DROP POLICY IF EXISTS "org_admins_manage_subscriptions" ON core.subscriptions;
DROP POLICY IF EXISTS "super_admins_all_subscriptions" ON core.subscriptions;

DROP POLICY IF EXISTS "authenticated_view_modules" ON core.modules;
DROP POLICY IF EXISTS "super_admins_manage_modules" ON core.modules;

DROP POLICY IF EXISTS "users_view_org_invitations" ON core.invitations;
DROP POLICY IF EXISTS "admins_manage_invitations" ON core.invitations;

DROP POLICY IF EXISTS "users_view_own_audit_logs" ON core.audit_logs;
DROP POLICY IF EXISTS "org_admins_view_org_audit_logs" ON core.audit_logs;
DROP POLICY IF EXISTS "super_admins_view_all_audit_logs" ON core.audit_logs;
DROP POLICY IF EXISTS "system_insert_audit_logs" ON core.audit_logs;

-- Drop functions
DROP FUNCTION IF EXISTS core.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS core.check_module_dependencies() CASCADE;
DROP FUNCTION IF EXISTS core.expire_old_invitations();
DROP FUNCTION IF EXISTS core.get_organization_modules(UUID);
DROP FUNCTION IF EXISTS core.has_module_access(UUID, TEXT);

-- Drop tables (in reverse order of dependencies)
DROP TABLE IF EXISTS core.audit_logs CASCADE;
DROP TABLE IF EXISTS core.invitations CASCADE;
DROP TABLE IF EXISTS core.subscriptions CASCADE;
DROP TABLE IF EXISTS core.users CASCADE;
DROP TABLE IF EXISTS core.organizations CASCADE;
DROP TABLE IF EXISTS core.modules CASCADE;

-- Drop schema
DROP SCHEMA IF EXISTS core CASCADE;

RAISE NOTICE 'Core schema dropped successfully';

-- =====================================================
-- CLEANUP
-- =====================================================

-- Note: We don't drop auth schema as it's managed by Supabase
-- Note: We don't drop extensions as they might be used by other schemas

RAISE NOTICE '====================================';
RAISE NOTICE 'Rollback completed successfully!';
RAISE NOTICE '====================================';
RAISE NOTICE 'All schemas and data have been removed.';
RAISE NOTICE 'To restore, run the migration scripts again.';
RAISE NOTICE '====================================';

COMMIT;

-- =====================================================
-- POST-ROLLBACK VERIFICATION
-- =====================================================

-- Verify schemas are gone
DO $$
DECLARE
    schema_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO schema_count
    FROM information_schema.schemata
    WHERE schema_name IN ('core', 'inventory');

    IF schema_count > 0 THEN
        RAISE WARNING 'Some schemas still exist. Manual cleanup may be required.';
    ELSE
        RAISE NOTICE 'Verification: All schemas successfully removed.';
    END IF;
END $$;
