-- =====================================================
-- Inventory Management Module - Database Schema
-- =====================================================
-- This migration creates all required tables, indexes,
-- RLS policies, and helper functions for the Inventory
-- Management API.
--
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Organizations table (if not exists)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization members (if not exists)
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Organization subscriptions (if not exists)
CREATE TABLE IF NOT EXISTS organization_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL DEFAULT 'free',
  enabled_modules TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100) NOT NULL,
  barcode VARCHAR(100),
  category VARCHAR(100),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  cost_price DECIMAL(10, 2) CHECK (cost_price >= 0),
  reorder_point INTEGER DEFAULT 10 CHECK (reorder_point >= 0),
  reorder_quantity INTEGER DEFAULT 50 CHECK (reorder_quantity >= 1),
  unit_of_measure VARCHAR(50) DEFAULT 'unit',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT products_org_sku_unique UNIQUE(organization_id, sku)
);

-- Warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(2) DEFAULT 'ZA',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  manager_name VARCHAR(255),
  manager_email VARCHAR(255),
  manager_phone VARCHAR(50),
  capacity_sqm DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT warehouses_org_code_unique UNIQUE(organization_id, code)
);

-- Stock levels table
CREATE TABLE IF NOT EXISTS stock_levels (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (product_id, warehouse_id)
);

-- Stock adjustments audit log
CREATE TABLE IF NOT EXISTS stock_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  previous_quantity INTEGER NOT NULL,
  quantity_change INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL CHECK (new_quantity >= 0),
  reason VARCHAR(50) NOT NULL CHECK (reason IN (
    'purchase', 'sale', 'return', 'damage', 'loss', 'found', 'adjustment', 'transfer'
  )),
  notes TEXT,
  reference_number VARCHAR(100),
  adjusted_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock transfers table
CREATE TABLE IF NOT EXISTS stock_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  from_warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
  to_warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  scheduled_date TIMESTAMPTZ,
  transferred_by UUID NOT NULL REFERENCES auth.users(id),
  transferred_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_warehouses CHECK (from_warehouse_id != to_warehouse_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_org ON products(organization_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);

-- Warehouses indexes
CREATE INDEX IF NOT EXISTS idx_warehouses_org ON warehouses(organization_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_code ON warehouses(code);
CREATE INDEX IF NOT EXISTS idx_warehouses_city ON warehouses(city);
CREATE INDEX IF NOT EXISTS idx_warehouses_active ON warehouses(is_active);

-- Stock levels indexes
CREATE INDEX IF NOT EXISTS idx_stock_product ON stock_levels(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_warehouse ON stock_levels(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_quantity ON stock_levels(quantity);

-- Stock adjustments indexes
CREATE INDEX IF NOT EXISTS idx_adjustments_org ON stock_adjustments(organization_id);
CREATE INDEX IF NOT EXISTS idx_adjustments_product ON stock_adjustments(product_id);
CREATE INDEX IF NOT EXISTS idx_adjustments_warehouse ON stock_adjustments(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_adjustments_created ON stock_adjustments(created_at DESC);

-- Stock transfers indexes
CREATE INDEX IF NOT EXISTS idx_transfers_org ON stock_transfers(organization_id);
CREATE INDEX IF NOT EXISTS idx_transfers_product ON stock_transfers(product_id);
CREATE INDEX IF NOT EXISTS idx_transfers_from ON stock_transfers(from_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to ON stock_transfers(to_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON stock_transfers(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;

-- Products RLS policies
CREATE POLICY "Users can view products in their organization"
  ON products FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can create products"
  ON products FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update products"
  ON products FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Warehouses RLS policies (similar structure)
CREATE POLICY "Users can view warehouses in their organization"
  ON warehouses FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can create warehouses"
  ON warehouses FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update warehouses"
  ON warehouses FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can delete warehouses"
  ON warehouses FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Stock levels RLS policies
CREATE POLICY "Users can view stock in their organization"
  ON stock_levels FOR SELECT
  USING (
    product_id IN (
      SELECT id FROM products
      WHERE organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Staff can modify stock levels"
  ON stock_levels FOR ALL
  USING (
    product_id IN (
      SELECT id FROM products
      WHERE organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'staff')
      )
    )
  );

-- Stock adjustments RLS (read-only for audit trail)
CREATE POLICY "Users can view adjustments in their organization"
  ON stock_adjustments FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can create adjustment records"
  ON stock_adjustments FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'staff')
    )
  );

-- Stock transfers RLS
CREATE POLICY "Users can view transfers in their organization"
  ON stock_transfers FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can create transfers"
  ON stock_transfers FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Calculate warehouse stock value
CREATE OR REPLACE FUNCTION calculate_warehouse_stock_value(warehouse_id_param UUID)
RETURNS TABLE(total_value DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(SUM(sl.quantity * p.unit_price), 0) as total_value
  FROM stock_levels sl
  JOIN products p ON sl.product_id = p.id
  WHERE sl.warehouse_id = warehouse_id_param;
END;
$$ LANGUAGE plpgsql;

-- Get warehouse stock summary
CREATE OR REPLACE FUNCTION get_warehouse_stock_summary(warehouse_id_param UUID)
RETURNS TABLE(
  total_products BIGINT,
  total_items BIGINT,
  total_value DECIMAL,
  low_stock_products BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT sl.product_id)::BIGINT as total_products,
    COALESCE(SUM(sl.quantity), 0)::BIGINT as total_items,
    COALESCE(SUM(sl.quantity * p.unit_price), 0) as total_value,
    COUNT(DISTINCT CASE WHEN sl.quantity < p.reorder_point THEN sl.product_id END)::BIGINT as low_stock_products
  FROM stock_levels sl
  JOIN products p ON sl.product_id = p.id
  WHERE sl.warehouse_id = warehouse_id_param;
END;
$$ LANGUAGE plpgsql;

-- Get organization stock summary
CREATE OR REPLACE FUNCTION get_stock_summary(org_id_param UUID)
RETURNS TABLE(
  total_products BIGINT,
  total_warehouses BIGINT,
  low_stock_count BIGINT,
  out_of_stock_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(DISTINCT id) FROM products WHERE organization_id = org_id_param AND is_active = true)::BIGINT as total_products,
    (SELECT COUNT(DISTINCT id) FROM warehouses WHERE organization_id = org_id_param AND is_active = true)::BIGINT as total_warehouses,
    (SELECT COUNT(DISTINCT sl.product_id)
     FROM stock_levels sl
     JOIN products p ON sl.product_id = p.id
     WHERE p.organization_id = org_id_param AND sl.quantity < p.reorder_point)::BIGINT as low_stock_count,
    (SELECT COUNT(DISTINCT sl.product_id)
     FROM stock_levels sl
     JOIN products p ON sl.product_id = p.id
     WHERE p.organization_id = org_id_param AND sl.quantity = 0)::BIGINT as out_of_stock_count;
END;
$$ LANGUAGE plpgsql;

-- Adjust stock level (atomic transaction)
CREATE OR REPLACE FUNCTION adjust_stock_level(
  p_product_id UUID,
  p_warehouse_id UUID,
  p_quantity_change INTEGER,
  p_reason VARCHAR,
  p_notes TEXT,
  p_reference_number VARCHAR,
  p_adjusted_by UUID,
  p_organization_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_previous_quantity INTEGER;
  v_new_quantity INTEGER;
  v_adjustment_id UUID;
BEGIN
  -- Get current quantity
  SELECT COALESCE(quantity, 0) INTO v_previous_quantity
  FROM stock_levels
  WHERE product_id = p_product_id AND warehouse_id = p_warehouse_id;

  -- Calculate new quantity
  v_new_quantity := v_previous_quantity + p_quantity_change;

  -- Prevent negative stock
  IF v_new_quantity < 0 THEN
    RAISE EXCEPTION 'Insufficient stock. Current: %, Change: %', v_previous_quantity, p_quantity_change;
  END IF;

  -- Update or insert stock level
  INSERT INTO stock_levels (product_id, warehouse_id, quantity, updated_at)
  VALUES (p_product_id, p_warehouse_id, v_new_quantity, NOW())
  ON CONFLICT (product_id, warehouse_id)
  DO UPDATE SET quantity = v_new_quantity, updated_at = NOW();

  -- Create audit record
  INSERT INTO stock_adjustments (
    organization_id, product_id, warehouse_id,
    previous_quantity, quantity_change, new_quantity,
    reason, notes, reference_number, adjusted_by
  )
  VALUES (
    p_organization_id, p_product_id, p_warehouse_id,
    v_previous_quantity, p_quantity_change, v_new_quantity,
    p_reason, p_notes, p_reference_number, p_adjusted_by
  )
  RETURNING id INTO v_adjustment_id;

  -- Return result
  RETURN json_build_object(
    'adjustment_id', v_adjustment_id,
    'product_id', p_product_id,
    'warehouse_id', p_warehouse_id,
    'previous_quantity', v_previous_quantity,
    'quantity_change', p_quantity_change,
    'new_quantity', v_new_quantity,
    'adjusted_at', NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Transfer stock between warehouses (atomic transaction)
CREATE OR REPLACE FUNCTION transfer_stock(
  p_product_id UUID,
  p_from_warehouse_id UUID,
  p_to_warehouse_id UUID,
  p_quantity INTEGER,
  p_notes TEXT,
  p_scheduled_date TIMESTAMPTZ,
  p_transferred_by UUID,
  p_organization_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_from_quantity INTEGER;
  v_to_quantity INTEGER;
  v_transfer_id UUID;
BEGIN
  -- Prevent same warehouse transfer
  IF p_from_warehouse_id = p_to_warehouse_id THEN
    RAISE EXCEPTION 'Cannot transfer to the same warehouse';
  END IF;

  -- Get source quantity
  SELECT COALESCE(quantity, 0) INTO v_from_quantity
  FROM stock_levels
  WHERE product_id = p_product_id AND warehouse_id = p_from_warehouse_id;

  -- Check sufficient stock
  IF v_from_quantity < p_quantity THEN
    RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', v_from_quantity, p_quantity;
  END IF;

  -- Get destination quantity
  SELECT COALESCE(quantity, 0) INTO v_to_quantity
  FROM stock_levels
  WHERE product_id = p_product_id AND warehouse_id = p_to_warehouse_id;

  -- Update source warehouse
  INSERT INTO stock_levels (product_id, warehouse_id, quantity, updated_at)
  VALUES (p_product_id, p_from_warehouse_id, v_from_quantity - p_quantity, NOW())
  ON CONFLICT (product_id, warehouse_id)
  DO UPDATE SET quantity = v_from_quantity - p_quantity, updated_at = NOW();

  -- Update destination warehouse
  INSERT INTO stock_levels (product_id, warehouse_id, quantity, updated_at)
  VALUES (p_product_id, p_to_warehouse_id, v_to_quantity + p_quantity, NOW())
  ON CONFLICT (product_id, warehouse_id)
  DO UPDATE SET quantity = v_to_quantity + p_quantity, updated_at = NOW();

  -- Create transfer record
  INSERT INTO stock_transfers (
    organization_id, product_id, from_warehouse_id, to_warehouse_id,
    quantity, status, notes, scheduled_date, transferred_by, transferred_at
  )
  VALUES (
    p_organization_id, p_product_id, p_from_warehouse_id, p_to_warehouse_id,
    p_quantity,
    CASE WHEN p_scheduled_date IS NULL THEN 'completed' ELSE 'scheduled' END,
    p_notes, p_scheduled_date, p_transferred_by,
    CASE WHEN p_scheduled_date IS NULL THEN NOW() ELSE NULL END
  )
  RETURNING id INTO v_transfer_id;

  -- Create audit records
  INSERT INTO stock_adjustments (
    organization_id, product_id, warehouse_id,
    previous_quantity, quantity_change, new_quantity,
    reason, reference_number, adjusted_by
  )
  VALUES
    (p_organization_id, p_product_id, p_from_warehouse_id,
     v_from_quantity, -p_quantity, v_from_quantity - p_quantity,
     'transfer', 'TRANSFER-' || v_transfer_id, p_transferred_by),
    (p_organization_id, p_product_id, p_to_warehouse_id,
     v_to_quantity, p_quantity, v_to_quantity + p_quantity,
     'transfer', 'TRANSFER-' || v_transfer_id, p_transferred_by);

  -- Return result
  RETURN json_build_object(
    'transfer_id', v_transfer_id,
    'from_previous_quantity', v_from_quantity,
    'from_new_quantity', v_from_quantity - p_quantity,
    'to_previous_quantity', v_to_quantity,
    'to_new_quantity', v_to_quantity + p_quantity,
    'transferred_at', NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_levels_updated_at BEFORE UPDATE ON stock_levels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment to insert sample data
/*
-- Sample organization
INSERT INTO organizations (name, slug)
VALUES ('Demo Company', 'demo-company')
ON CONFLICT (slug) DO NOTHING;

-- Sample subscription
INSERT INTO organization_subscriptions (organization_id, tier, enabled_modules)
SELECT id, 'professional', ARRAY['inventory', 'recruitment']
FROM organizations WHERE slug = 'demo-company'
ON CONFLICT DO NOTHING;
*/
