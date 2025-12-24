-- =====================================================
-- Migration: 00002_create_inventory_schema.sql
-- Description: Complete inventory management module schema
-- Author: Horizon Systems
-- Date: 2025-10-20
-- Dependencies: 00001_create_core_schema.sql
-- =====================================================

-- =====================================================
-- SCHEMA: inventory
-- Purpose: Inventory management module tables
-- =====================================================

CREATE SCHEMA IF NOT EXISTS inventory;

-- =====================================================
-- TABLE: inventory.categories
-- Description: Product categories with hierarchical structure
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Category details
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 200),
    slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
    description TEXT,
    code TEXT, -- Optional category code (e.g., CAT-001)

    -- Hierarchy
    parent_id UUID REFERENCES inventory.categories(id) ON DELETE SET NULL,
    level INTEGER NOT NULL DEFAULT 0 CHECK (level >= 0 AND level <= 5),
    path TEXT, -- Materialized path for efficient queries (e.g., '/electronics/phones/')

    -- Display
    icon TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0,

    -- Flags
    is_active BOOLEAN NOT NULL DEFAULT true,

    -- Audit fields
    created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT unique_category_slug UNIQUE (organization_id, slug),
    CONSTRAINT no_self_reference CHECK (id != parent_id)
);

COMMENT ON TABLE inventory.categories IS 'Product categories with hierarchical structure';
COMMENT ON COLUMN inventory.categories.path IS 'Materialized path for efficient ancestor/descendant queries';

-- =====================================================
-- TABLE: inventory.brands
-- Description: Product brands/manufacturers
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Brand details
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 200),
    slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
    code TEXT,
    description TEXT,

    -- Contact information
    website TEXT,
    email TEXT CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    phone TEXT,

    -- Display
    logo_url TEXT,

    -- Flags
    is_active BOOLEAN NOT NULL DEFAULT true,

    -- Audit fields
    created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT unique_brand_slug UNIQUE (organization_id, slug)
);

COMMENT ON TABLE inventory.brands IS 'Product brands and manufacturers';

-- =====================================================
-- TABLE: inventory.units
-- Description: Units of measurement
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Unit details
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    abbreviation TEXT NOT NULL CHECK (char_length(abbreviation) >= 1 AND char_length(abbreviation) <= 20),
    type TEXT NOT NULL CHECK (type IN (
        'quantity',    -- Each, piece, unit
        'weight',      -- Kg, g, lb, oz
        'volume',      -- L, ml, gal
        'length',      -- m, cm, ft, in
        'area',        -- sqm, sqft
        'time'         -- hours, days
    )),

    -- Conversion
    base_unit_id UUID REFERENCES inventory.units(id) ON DELETE SET NULL,
    conversion_factor DECIMAL(20, 8), -- How many base units equal 1 of this unit

    -- Flags
    is_active BOOLEAN NOT NULL DEFAULT true,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_unit_abbreviation UNIQUE (organization_id, abbreviation),
    CONSTRAINT valid_conversion CHECK (
        (base_unit_id IS NULL AND conversion_factor IS NULL) OR
        (base_unit_id IS NOT NULL AND conversion_factor > 0)
    )
);

COMMENT ON TABLE inventory.units IS 'Units of measurement with conversion factors';
COMMENT ON COLUMN inventory.units.conversion_factor IS 'Multiplier to convert to base unit';

-- =====================================================
-- TABLE: inventory.products
-- Description: Core products/items catalog
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Product identification
    sku TEXT NOT NULL CHECK (char_length(sku) >= 1 AND char_length(sku) <= 100),
    barcode TEXT,
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 500),
    slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
    description TEXT,

    -- Classification
    category_id UUID REFERENCES inventory.categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES inventory.brands(id) ON DELETE SET NULL,
    unit_id UUID NOT NULL REFERENCES inventory.units(id) ON DELETE RESTRICT,

    -- Product type
    type TEXT NOT NULL DEFAULT 'simple' CHECK (type IN (
        'simple',      -- Single product
        'variable',    -- Product with variants (size, color, etc.)
        'bundle',      -- Bundle of multiple products
        'service'      -- Service/non-physical item
    )),

    -- Pricing
    cost_price DECIMAL(15, 2) CHECK (cost_price >= 0),
    selling_price DECIMAL(15, 2) CHECK (selling_price >= 0),
    currency TEXT NOT NULL DEFAULT 'ZAR',
    tax_rate DECIMAL(5, 2) DEFAULT 0 CHECK (tax_rate >= 0 AND tax_rate <= 100),

    -- Physical attributes
    weight DECIMAL(10, 3),
    weight_unit TEXT,
    dimensions JSONB, -- {length, width, height, unit}

    -- Inventory tracking
    track_inventory BOOLEAN NOT NULL DEFAULT true,
    reorder_point INTEGER DEFAULT 0 CHECK (reorder_point >= 0),
    reorder_quantity INTEGER DEFAULT 0 CHECK (reorder_quantity >= 0),
    min_stock_level INTEGER DEFAULT 0 CHECK (min_stock_level >= 0),
    max_stock_level INTEGER CHECK (max_stock_level IS NULL OR max_stock_level >= min_stock_level),

    -- Stock management
    allow_backorder BOOLEAN NOT NULL DEFAULT false,
    allow_negative_stock BOOLEAN NOT NULL DEFAULT false,

    -- Media
    image_url TEXT,
    images JSONB DEFAULT '[]', -- Array of image URLs
    attachments JSONB DEFAULT '[]', -- Array of document URLs

    -- Metadata
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',

    -- Flags
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,

    -- Audit fields
    created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT unique_product_sku UNIQUE (organization_id, sku),
    CONSTRAINT unique_product_slug UNIQUE (organization_id, slug),
    CONSTRAINT valid_pricing CHECK (
        cost_price IS NULL OR selling_price IS NULL OR selling_price >= cost_price
    )
);

COMMENT ON TABLE inventory.products IS 'Core product catalog with pricing and inventory rules';
COMMENT ON COLUMN inventory.products.track_inventory IS 'Whether to track stock levels for this product';
COMMENT ON COLUMN inventory.products.reorder_point IS 'Stock level that triggers reorder alert';

-- =====================================================
-- TABLE: inventory.product_variants
-- Description: Product variations (size, color, etc.)
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES inventory.products(id) ON DELETE CASCADE,

    -- Variant identification
    sku TEXT NOT NULL CHECK (char_length(sku) >= 1 AND char_length(sku) <= 100),
    barcode TEXT,
    name TEXT NOT NULL,

    -- Variant attributes
    attributes JSONB NOT NULL DEFAULT '{}', -- {size: "Large", color: "Red"}

    -- Pricing override
    cost_price DECIMAL(15, 2) CHECK (cost_price >= 0),
    selling_price DECIMAL(15, 2) CHECK (selling_price >= 0),

    -- Physical attributes override
    weight DECIMAL(10, 3),
    dimensions JSONB,

    -- Media
    image_url TEXT,

    -- Flags
    is_active BOOLEAN NOT NULL DEFAULT true,

    -- Audit fields
    created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT unique_variant_sku UNIQUE (organization_id, sku)
);

COMMENT ON TABLE inventory.product_variants IS 'Product variations (e.g., different sizes or colors)';

-- =====================================================
-- TABLE: inventory.warehouses
-- Description: Storage locations/warehouses
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Warehouse details
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 200),
    code TEXT NOT NULL CHECK (char_length(code) >= 1 AND char_length(code) <= 50),
    type TEXT NOT NULL CHECK (type IN (
        'main',
        'branch',
        'retail',
        'transit',
        'virtual'
    )),

    -- Contact
    email TEXT CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    phone TEXT,

    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'South Africa',
    postal_code TEXT,

    -- Geolocation
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Manager
    manager_id UUID REFERENCES core.users(id) ON DELETE SET NULL,

    -- Settings
    settings JSONB DEFAULT '{}',

    -- Flags
    is_active BOOLEAN NOT NULL DEFAULT true,

    -- Audit fields
    created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT unique_warehouse_code UNIQUE (organization_id, code)
);

COMMENT ON TABLE inventory.warehouses IS 'Warehouse and storage location management';

-- =====================================================
-- TABLE: inventory.stock
-- Description: Current stock levels per warehouse
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Stock location
    warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES inventory.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES inventory.product_variants(id) ON DELETE CASCADE,

    -- Stock levels
    quantity DECIMAL(15, 3) NOT NULL DEFAULT 0,
    available_quantity DECIMAL(15, 3) NOT NULL DEFAULT 0, -- quantity - reserved
    reserved_quantity DECIMAL(15, 3) NOT NULL DEFAULT 0,

    -- Bin location (optional)
    bin_location TEXT,
    aisle TEXT,
    rack TEXT,
    shelf TEXT,

    -- Audit fields
    last_counted_at TIMESTAMPTZ,
    last_counted_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_stock_location UNIQUE (warehouse_id, product_id, variant_id),
    CONSTRAINT valid_quantities CHECK (
        quantity >= 0 AND
        reserved_quantity >= 0 AND
        available_quantity = (quantity - reserved_quantity)
    )
);

COMMENT ON TABLE inventory.stock IS 'Current stock levels per product per warehouse';
COMMENT ON COLUMN inventory.stock.available_quantity IS 'Quantity available for new orders (quantity - reserved)';

-- =====================================================
-- TABLE: inventory.stock_movements
-- Description: All stock movement transactions
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Movement details
    warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES inventory.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES inventory.product_variants(id) ON DELETE CASCADE,

    -- Movement type
    type TEXT NOT NULL CHECK (type IN (
        'purchase',         -- Stock received from supplier
        'sale',            -- Stock sold to customer
        'adjustment',      -- Manual adjustment
        'transfer_out',    -- Transfer to another warehouse
        'transfer_in',     -- Received from another warehouse
        'return',          -- Customer return
        'damage',          -- Damaged/lost stock
        'production',      -- Used in production
        'stocktake'        -- Stocktake adjustment
    )),

    -- Quantity
    quantity DECIMAL(15, 3) NOT NULL,
    unit_cost DECIMAL(15, 2),
    total_cost DECIMAL(15, 2),

    -- Reference
    reference_type TEXT, -- 'purchase_order', 'sales_order', 'transfer', etc.
    reference_id UUID,
    reference_number TEXT,

    -- Transfer details (for transfers)
    from_warehouse_id UUID REFERENCES inventory.warehouses(id) ON DELETE SET NULL,
    to_warehouse_id UUID REFERENCES inventory.warehouses(id) ON DELETE SET NULL,

    -- Balance after movement
    balance_after DECIMAL(15, 3) NOT NULL,

    -- Notes
    notes TEXT,
    reason TEXT,

    -- Audit fields
    performed_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_transfer CHECK (
        (type NOT IN ('transfer_out', 'transfer_in')) OR
        (from_warehouse_id IS NOT NULL OR to_warehouse_id IS NOT NULL)
    )
);

COMMENT ON TABLE inventory.stock_movements IS 'Complete audit trail of all stock movements';
COMMENT ON COLUMN inventory.stock_movements.balance_after IS 'Stock balance after this movement';

-- =====================================================
-- TABLE: inventory.suppliers
-- Description: Supplier/vendor management
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Supplier details
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 200),
    code TEXT NOT NULL CHECK (char_length(code) >= 1 AND char_length(code) <= 50),
    email TEXT CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    phone TEXT,
    website TEXT,

    -- Contact person
    contact_person TEXT,
    contact_email TEXT CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    contact_phone TEXT,

    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'South Africa',
    postal_code TEXT,

    -- Business details
    tax_number TEXT,
    registration_number TEXT,

    -- Payment terms
    payment_terms TEXT,
    credit_limit DECIMAL(15, 2),
    currency TEXT DEFAULT 'ZAR',

    -- Rating
    rating DECIMAL(3, 2) CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),

    -- Notes
    notes TEXT,

    -- Flags
    is_active BOOLEAN NOT NULL DEFAULT true,

    -- Audit fields
    created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT unique_supplier_code UNIQUE (organization_id, code)
);

COMMENT ON TABLE inventory.suppliers IS 'Supplier and vendor management';

-- =====================================================
-- TABLE: inventory.purchase_orders
-- Description: Purchase orders to suppliers
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Order details
    po_number TEXT NOT NULL,
    supplier_id UUID NOT NULL REFERENCES inventory.suppliers(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id) ON DELETE RESTRICT,

    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft',
        'pending',
        'approved',
        'ordered',
        'partial',      -- Partially received
        'received',
        'cancelled'
    )),

    -- Dates
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_date DATE,
    received_date DATE,

    -- Financial
    subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    shipping_cost DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'ZAR',

    -- Payment
    payment_terms TEXT,
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN (
        'unpaid',
        'partial',
        'paid'
    )),

    -- Notes
    notes TEXT,
    internal_notes TEXT,

    -- Audit fields
    created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_po_number UNIQUE (organization_id, po_number),
    CONSTRAINT valid_total CHECK (total_amount = (subtotal + tax_amount + shipping_cost - discount_amount))
);

COMMENT ON TABLE inventory.purchase_orders IS 'Purchase orders to suppliers';

-- =====================================================
-- TABLE: inventory.purchase_order_items
-- Description: Line items in purchase orders
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,
    purchase_order_id UUID NOT NULL REFERENCES inventory.purchase_orders(id) ON DELETE CASCADE,

    -- Product details
    product_id UUID NOT NULL REFERENCES inventory.products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES inventory.product_variants(id) ON DELETE RESTRICT,

    -- Quantities
    quantity DECIMAL(15, 3) NOT NULL CHECK (quantity > 0),
    received_quantity DECIMAL(15, 3) NOT NULL DEFAULT 0 CHECK (received_quantity >= 0),

    -- Pricing
    unit_cost DECIMAL(15, 2) NOT NULL CHECK (unit_cost >= 0),
    tax_rate DECIMAL(5, 2) DEFAULT 0 CHECK (tax_rate >= 0),
    discount_percent DECIMAL(5, 2) DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    line_total DECIMAL(15, 2) NOT NULL,

    -- Notes
    notes TEXT,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_received_quantity CHECK (received_quantity <= quantity)
);

COMMENT ON TABLE inventory.purchase_order_items IS 'Line items in purchase orders';

-- =====================================================
-- TABLE: inventory.stock_adjustments
-- Description: Manual stock adjustments and stocktakes
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.stock_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Adjustment details
    adjustment_number TEXT NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id) ON DELETE CASCADE,

    -- Type
    type TEXT NOT NULL CHECK (type IN (
        'adjustment',   -- General adjustment
        'stocktake',   -- Physical count
        'damage',      -- Damaged goods
        'loss',        -- Lost/stolen goods
        'found',       -- Found goods
        'write_off'    -- Write off
    )),

    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft',
        'pending',
        'approved',
        'completed',
        'cancelled'
    )),

    -- Dates
    adjustment_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Notes
    reason TEXT NOT NULL,
    notes TEXT,

    -- Audit fields
    created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_adjustment_number UNIQUE (organization_id, adjustment_number)
);

COMMENT ON TABLE inventory.stock_adjustments IS 'Manual stock adjustments and stocktakes';

-- =====================================================
-- TABLE: inventory.stock_adjustment_items
-- Description: Line items in stock adjustments
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.stock_adjustment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,
    stock_adjustment_id UUID NOT NULL REFERENCES inventory.stock_adjustments(id) ON DELETE CASCADE,

    -- Product details
    product_id UUID NOT NULL REFERENCES inventory.products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES inventory.product_variants(id) ON DELETE RESTRICT,

    -- Quantities
    system_quantity DECIMAL(15, 3) NOT NULL, -- Current system quantity
    actual_quantity DECIMAL(15, 3) NOT NULL, -- Actual counted/adjusted quantity
    difference DECIMAL(15, 3) NOT NULL,      -- Difference (actual - system)

    -- Cost
    unit_cost DECIMAL(15, 2),
    total_cost DECIMAL(15, 2),

    -- Notes
    notes TEXT,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE inventory.stock_adjustment_items IS 'Line items in stock adjustments';

-- =====================================================
-- TABLE: inventory.stock_alerts
-- Description: Low stock and reorder alerts
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.stock_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Alert details
    product_id UUID NOT NULL REFERENCES inventory.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES inventory.product_variants(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id) ON DELETE CASCADE,

    -- Alert type
    alert_type TEXT NOT NULL CHECK (alert_type IN (
        'low_stock',
        'out_of_stock',
        'reorder_point',
        'overstock'
    )),

    -- Quantities
    current_quantity DECIMAL(15, 3) NOT NULL,
    threshold_quantity DECIMAL(15, 3),

    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active',
        'acknowledged',
        'resolved',
        'dismissed'
    )),

    -- Resolution
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    resolution_notes TEXT,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE inventory.stock_alerts IS 'Low stock and reorder point alerts';

-- =====================================================
-- TABLE: inventory.stock_transfers
-- Description: Stock transfers between warehouses
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.stock_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,

    -- Transfer details
    transfer_number TEXT NOT NULL,
    from_warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id) ON DELETE RESTRICT,
    to_warehouse_id UUID NOT NULL REFERENCES inventory.warehouses(id) ON DELETE RESTRICT,

    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft',
        'pending',
        'in_transit',
        'completed',
        'cancelled'
    )),

    -- Dates
    transfer_date DATE NOT NULL DEFAULT CURRENT_DATE,
    shipped_date DATE,
    received_date DATE,

    -- Notes
    notes TEXT,
    shipping_notes TEXT,

    -- Audit fields
    created_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    shipped_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    received_by UUID REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_transfer_number UNIQUE (organization_id, transfer_number),
    CONSTRAINT different_warehouses CHECK (from_warehouse_id != to_warehouse_id)
);

COMMENT ON TABLE inventory.stock_transfers IS 'Stock transfers between warehouses';

-- =====================================================
-- TABLE: inventory.stock_transfer_items
-- Description: Line items in stock transfers
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory.stock_transfer_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES core.organizations(id) ON DELETE CASCADE,
    stock_transfer_id UUID NOT NULL REFERENCES inventory.stock_transfers(id) ON DELETE CASCADE,

    -- Product details
    product_id UUID NOT NULL REFERENCES inventory.products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES inventory.product_variants(id) ON DELETE RESTRICT,

    -- Quantities
    quantity DECIMAL(15, 3) NOT NULL CHECK (quantity > 0),
    received_quantity DECIMAL(15, 3) NOT NULL DEFAULT 0,

    -- Notes
    notes TEXT,

    -- Audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_received_transfer_quantity CHECK (received_quantity <= quantity)
);

COMMENT ON TABLE inventory.stock_transfer_items IS 'Line items in stock transfers';

-- =====================================================
-- INDEXES
-- =====================================================

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_organization ON inventory.categories(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_categories_parent ON inventory.categories(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_categories_path ON inventory.categories USING gin(string_to_array(path, '/'));

-- Brands indexes
CREATE INDEX IF NOT EXISTS idx_brands_organization ON inventory.brands(organization_id) WHERE deleted_at IS NULL;

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_organization ON inventory.products(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_sku ON inventory.products(organization_id, sku) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_category ON inventory.products(category_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_brand ON inventory.products(brand_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_active ON inventory.products(organization_id, is_active) WHERE deleted_at IS NULL;

-- Product variants indexes
CREATE INDEX IF NOT EXISTS idx_variants_product ON inventory.product_variants(product_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_variants_sku ON inventory.product_variants(organization_id, sku) WHERE deleted_at IS NULL;

-- Warehouses indexes
CREATE INDEX IF NOT EXISTS idx_warehouses_organization ON inventory.warehouses(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_warehouses_code ON inventory.warehouses(organization_id, code) WHERE deleted_at IS NULL;

-- Stock indexes
CREATE INDEX IF NOT EXISTS idx_stock_organization ON inventory.stock(organization_id);
CREATE INDEX IF NOT EXISTS idx_stock_warehouse ON inventory.stock(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_product ON inventory.stock(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_location ON inventory.stock(warehouse_id, product_id, variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_low_stock ON inventory.stock(warehouse_id) WHERE available_quantity <= 0;

-- Stock movements indexes
CREATE INDEX IF NOT EXISTS idx_movements_organization ON inventory.stock_movements(organization_id);
CREATE INDEX IF NOT EXISTS idx_movements_warehouse ON inventory.stock_movements(warehouse_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movements_product ON inventory.stock_movements(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movements_type ON inventory.stock_movements(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movements_reference ON inventory.stock_movements(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_movements_created ON inventory.stock_movements(created_at DESC);

-- Suppliers indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_organization ON inventory.suppliers(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON inventory.suppliers(organization_id, code) WHERE deleted_at IS NULL;

-- Purchase orders indexes
CREATE INDEX IF NOT EXISTS idx_po_organization ON inventory.purchase_orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_po_number ON inventory.purchase_orders(organization_id, po_number);
CREATE INDEX IF NOT EXISTS idx_po_supplier ON inventory.purchase_orders(supplier_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_po_warehouse ON inventory.purchase_orders(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON inventory.purchase_orders(status, order_date DESC);

-- Stock adjustments indexes
CREATE INDEX IF NOT EXISTS idx_adjustments_organization ON inventory.stock_adjustments(organization_id);
CREATE INDEX IF NOT EXISTS idx_adjustments_warehouse ON inventory.stock_adjustments(warehouse_id, adjustment_date DESC);
CREATE INDEX IF NOT EXISTS idx_adjustments_status ON inventory.stock_adjustments(status);

-- Stock alerts indexes
CREATE INDEX IF NOT EXISTS idx_alerts_organization ON inventory.stock_alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_alerts_product ON inventory.stock_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_alerts_warehouse ON inventory.stock_alerts(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON inventory.stock_alerts(status, alert_type);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON inventory.stock_alerts(organization_id, status) WHERE status = 'active';

-- Stock transfers indexes
CREATE INDEX IF NOT EXISTS idx_transfers_organization ON inventory.stock_transfers(organization_id);
CREATE INDEX IF NOT EXISTS idx_transfers_from_warehouse ON inventory.stock_transfers(from_warehouse_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transfers_to_warehouse ON inventory.stock_transfers(to_warehouse_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON inventory.stock_transfers(status, transfer_date DESC);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION inventory.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate category path
CREATE OR REPLACE FUNCTION inventory.update_category_path()
RETURNS TRIGGER AS $$
DECLARE
    parent_path TEXT;
BEGIN
    IF NEW.parent_id IS NULL THEN
        NEW.path := '/' || NEW.slug || '/';
        NEW.level := 0;
    ELSE
        SELECT path, level INTO parent_path, NEW.level
        FROM inventory.categories
        WHERE id = NEW.parent_id;

        NEW.path := parent_path || NEW.slug || '/';
        NEW.level := NEW.level + 1;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Adjust stock quantity
CREATE OR REPLACE FUNCTION inventory.adjust_stock(
    p_organization_id UUID,
    p_warehouse_id UUID,
    p_product_id UUID,
    p_variant_id UUID,
    p_quantity DECIMAL,
    p_movement_type TEXT,
    p_reference_type TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_reference_number TEXT DEFAULT NULL,
    p_unit_cost DECIMAL DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_performed_by UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_stock_id UUID;
    v_current_quantity DECIMAL;
    v_new_quantity DECIMAL;
    v_movement_id UUID;
BEGIN
    -- Get or create stock record
    SELECT id, quantity INTO v_stock_id, v_current_quantity
    FROM inventory.stock
    WHERE warehouse_id = p_warehouse_id
    AND product_id = p_product_id
    AND (variant_id = p_variant_id OR (variant_id IS NULL AND p_variant_id IS NULL));

    IF v_stock_id IS NULL THEN
        -- Create new stock record
        INSERT INTO inventory.stock (
            organization_id,
            warehouse_id,
            product_id,
            variant_id,
            quantity,
            available_quantity
        ) VALUES (
            p_organization_id,
            p_warehouse_id,
            p_product_id,
            p_variant_id,
            GREATEST(p_quantity, 0),
            GREATEST(p_quantity, 0)
        )
        RETURNING id, quantity INTO v_stock_id, v_current_quantity;

        v_new_quantity := v_current_quantity;
    ELSE
        -- Update existing stock
        v_new_quantity := v_current_quantity + p_quantity;

        UPDATE inventory.stock
        SET quantity = v_new_quantity,
            available_quantity = v_new_quantity - reserved_quantity,
            updated_at = NOW()
        WHERE id = v_stock_id;
    END IF;

    -- Create stock movement record
    INSERT INTO inventory.stock_movements (
        organization_id,
        warehouse_id,
        product_id,
        variant_id,
        type,
        quantity,
        unit_cost,
        total_cost,
        reference_type,
        reference_id,
        reference_number,
        balance_after,
        notes,
        performed_by
    ) VALUES (
        p_organization_id,
        p_warehouse_id,
        p_product_id,
        p_variant_id,
        p_movement_type,
        p_quantity,
        p_unit_cost,
        CASE WHEN p_unit_cost IS NOT NULL THEN p_quantity * p_unit_cost ELSE NULL END,
        p_reference_type,
        p_reference_id,
        p_reference_number,
        v_new_quantity,
        p_notes,
        p_performed_by
    )
    RETURNING id INTO v_movement_id;

    RETURN v_movement_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION inventory.adjust_stock IS 'Adjust stock quantity and create movement record';

-- Function: Check low stock and create alerts
CREATE OR REPLACE FUNCTION inventory.check_low_stock()
RETURNS void AS $$
BEGIN
    -- Create alerts for low stock
    INSERT INTO inventory.stock_alerts (
        organization_id,
        product_id,
        variant_id,
        warehouse_id,
        alert_type,
        current_quantity,
        threshold_quantity,
        status
    )
    SELECT DISTINCT
        s.organization_id,
        s.product_id,
        s.variant_id,
        s.warehouse_id,
        CASE
            WHEN s.available_quantity = 0 THEN 'out_of_stock'
            WHEN s.available_quantity <= p.reorder_point THEN 'reorder_point'
            ELSE 'low_stock'
        END as alert_type,
        s.available_quantity,
        p.reorder_point,
        'active'
    FROM inventory.stock s
    JOIN inventory.products p ON s.product_id = p.id
    WHERE p.track_inventory = true
    AND s.available_quantity <= p.reorder_point
    AND NOT EXISTS (
        SELECT 1 FROM inventory.stock_alerts a
        WHERE a.product_id = s.product_id
        AND (a.variant_id = s.variant_id OR (a.variant_id IS NULL AND s.variant_id IS NULL))
        AND a.warehouse_id = s.warehouse_id
        AND a.status = 'active'
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION inventory.check_low_stock IS 'Check for low stock and create alerts';

-- Function: Get product total stock
CREATE OR REPLACE FUNCTION inventory.get_product_total_stock(
    p_product_id UUID,
    p_variant_id UUID DEFAULT NULL
)
RETURNS DECIMAL AS $$
DECLARE
    total_stock DECIMAL;
BEGIN
    SELECT COALESCE(SUM(available_quantity), 0)
    INTO total_stock
    FROM inventory.stock
    WHERE product_id = p_product_id
    AND (variant_id = p_variant_id OR (variant_id IS NULL AND p_variant_id IS NULL));

    RETURN total_stock;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION inventory.get_product_total_stock IS 'Get total available stock for a product across all warehouses';

-- Function: Reserve stock
CREATE OR REPLACE FUNCTION inventory.reserve_stock(
    p_warehouse_id UUID,
    p_product_id UUID,
    p_variant_id UUID,
    p_quantity DECIMAL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_available DECIMAL;
BEGIN
    -- Check available quantity
    SELECT available_quantity INTO v_available
    FROM inventory.stock
    WHERE warehouse_id = p_warehouse_id
    AND product_id = p_product_id
    AND (variant_id = p_variant_id OR (variant_id IS NULL AND p_variant_id IS NULL))
    FOR UPDATE;

    IF v_available IS NULL OR v_available < p_quantity THEN
        RETURN false;
    END IF;

    -- Reserve stock
    UPDATE inventory.stock
    SET reserved_quantity = reserved_quantity + p_quantity,
        available_quantity = available_quantity - p_quantity,
        updated_at = NOW()
    WHERE warehouse_id = p_warehouse_id
    AND product_id = p_product_id
    AND (variant_id = p_variant_id OR (variant_id IS NULL AND p_variant_id IS NULL));

    RETURN true;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION inventory.reserve_stock IS 'Reserve stock for orders';

-- Function: Release stock reservation
CREATE OR REPLACE FUNCTION inventory.release_stock(
    p_warehouse_id UUID,
    p_product_id UUID,
    p_variant_id UUID,
    p_quantity DECIMAL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE inventory.stock
    SET reserved_quantity = GREATEST(0, reserved_quantity - p_quantity),
        available_quantity = quantity - GREATEST(0, reserved_quantity - p_quantity),
        updated_at = NOW()
    WHERE warehouse_id = p_warehouse_id
    AND product_id = p_product_id
    AND (variant_id = p_variant_id OR (variant_id IS NULL AND p_variant_id IS NULL));

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION inventory.release_stock IS 'Release reserved stock';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON inventory.categories
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON inventory.brands
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON inventory.units
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON inventory.products
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON inventory.product_variants
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON inventory.warehouses
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_stock_updated_at BEFORE UPDATE ON inventory.stock
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON inventory.suppliers
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON inventory.purchase_orders
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_purchase_order_items_updated_at BEFORE UPDATE ON inventory.purchase_order_items
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_stock_adjustments_updated_at BEFORE UPDATE ON inventory.stock_adjustments
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_stock_adjustment_items_updated_at BEFORE UPDATE ON inventory.stock_adjustment_items
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_stock_alerts_updated_at BEFORE UPDATE ON inventory.stock_alerts
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_stock_transfers_updated_at BEFORE UPDATE ON inventory.stock_transfers
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

CREATE TRIGGER update_stock_transfer_items_updated_at BEFORE UPDATE ON inventory.stock_transfer_items
    FOR EACH ROW EXECUTE FUNCTION inventory.update_updated_at();

-- Category path trigger
CREATE TRIGGER update_category_path_trigger
    BEFORE INSERT OR UPDATE OF parent_id, slug ON inventory.categories
    FOR EACH ROW
    EXECUTE FUNCTION inventory.update_category_path();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all inventory tables
ALTER TABLE inventory.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.stock_adjustment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.stock_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.stock_transfer_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: Organization-level access
-- =====================================================

-- Helper function for organization access
CREATE OR REPLACE FUNCTION inventory.has_inventory_access()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT u.organization_id
        FROM core.users u
        JOIN core.subscriptions s ON s.organization_id = u.organization_id
        JOIN core.modules m ON m.id = s.module_id
        WHERE u.id = auth.uid()
        AND m.code = 'inventory'
        AND s.status IN ('trial', 'active')
        AND u.status = 'active'
        AND u.deleted_at IS NULL
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generic policy for all inventory tables
DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN
        SELECT t.tablename
        FROM pg_tables t
        WHERE t.schemaname = 'inventory'
        AND t.tablename NOT IN ('units') -- Units have different rules
    LOOP
        EXECUTE format('
            CREATE POLICY "users_access_own_org_%s"
                ON inventory.%I
                FOR ALL
                USING (organization_id = inventory.has_inventory_access())
                WITH CHECK (organization_id = inventory.has_inventory_access())
        ', table_name, table_name);
    END LOOP;
END $$;

-- Special policy for units (shared across organizations)
CREATE POLICY "users_access_units"
    ON inventory.units
    FOR ALL
    USING (
        organization_id = inventory.has_inventory_access()
        OR organization_id IS NULL -- System-wide units
    )
    WITH CHECK (organization_id = inventory.has_inventory_access());

-- =====================================================
-- GRANTS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA inventory TO authenticated;
GRANT USAGE ON SCHEMA inventory TO service_role;

-- Grant access to tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA inventory TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA inventory TO service_role;

-- Grant access to functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA inventory TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA inventory TO service_role;

-- =====================================================
-- COMPLETION
-- =====================================================

COMMENT ON SCHEMA inventory IS 'Inventory management module - Migration 00002 - Created 2025-10-20';
