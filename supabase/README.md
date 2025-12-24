# Horizon Systems - Database Schema

Complete database schema for the Horizon Systems unified platform with multi-tenant architecture.

## 📁 File Structure

```
supabase/
├── migrations/
│   ├── 00001_create_core_schema.sql      # Core platform tables
│   └── 00002_create_inventory_schema.sql  # Inventory module
├── seed.sql                                # Sample data for development
└── README.md                               # This file
```

## 🚀 Quick Start

### Prerequisites

- Supabase project (Project ID: sjbvvrjxsbqrgtpgdxwr)
- Supabase CLI installed (`npm install -g supabase`)
- PostgreSQL 15+ (included with Supabase)

### Option 1: Using Supabase Dashboard (Recommended for First Setup)

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Navigate to your project: sjbvvrjxsbqrgtpgdxwr

2. **Run Core Schema Migration**
   - Go to SQL Editor
   - Copy contents of `migrations/00001_create_core_schema.sql`
   - Paste and click "Run"

3. **Run Inventory Schema Migration**
   - Copy contents of `migrations/00002_create_inventory_schema.sql`
   - Paste and click "Run"

4. **Load Seed Data (Optional)**
   - Copy contents of `seed.sql`
   - Paste and click "Run"

### Option 2: Using Supabase CLI

```bash
# Initialize Supabase in project (first time only)
supabase init

# Link to your project
supabase link --project-ref sjbvvrjxsbqrgtpgdxwr

# Apply migrations
supabase db push

# Or apply manually
supabase db execute --file supabase/migrations/00001_create_core_schema.sql
supabase db execute --file supabase/migrations/00002_create_inventory_schema.sql

# Load seed data
supabase db execute --file supabase/seed.sql
```

### Option 3: Using psql

```bash
# Connect to your database
psql "postgresql://postgres:[password]@db.sjbvvrjxsbqrgtpgdxwr.supabase.co:5432/postgres"

# Run migrations
\i supabase/migrations/00001_create_core_schema.sql
\i supabase/migrations/00002_create_inventory_schema.sql
\i supabase/seed.sql
```

## 📊 Schema Overview

### Core Schema (`core`)

**Purpose:** Multi-tenant foundation with organizations, users, and module management

**Tables:**
- `core.modules` - Available system modules
- `core.organizations` - Multi-tenant organizations
- `core.users` - Extended user profiles (links to auth.users)
- `core.subscriptions` - Organization module subscriptions
- `core.invitations` - User invitation management
- `core.audit_logs` - System-wide audit trail

**Key Features:**
- Multi-tenant architecture with RLS
- Module-based subscription system
- Role-based access control (super_admin, org_admin, manager, user, viewer)
- Comprehensive audit logging

### Inventory Schema (`inventory`)

**Purpose:** Complete inventory management system

**Tables:**
- `inventory.categories` - Hierarchical product categories
- `inventory.brands` - Product brands/manufacturers
- `inventory.units` - Units of measurement with conversions
- `inventory.products` - Product catalog
- `inventory.product_variants` - Product variations (size, color, etc.)
- `inventory.warehouses` - Storage locations
- `inventory.stock` - Current stock levels
- `inventory.stock_movements` - Complete movement audit trail
- `inventory.suppliers` - Supplier management
- `inventory.purchase_orders` - Purchase orders
- `inventory.purchase_order_items` - PO line items
- `inventory.stock_adjustments` - Manual adjustments/stocktakes
- `inventory.stock_adjustment_items` - Adjustment line items
- `inventory.stock_alerts` - Low stock alerts
- `inventory.stock_transfers` - Inter-warehouse transfers
- `inventory.stock_transfer_items` - Transfer line items

**Key Features:**
- Multi-warehouse support
- Product variants (sizes, colors)
- Automatic stock movement tracking
- Low stock alerts
- Purchase order management
- Stock transfers between warehouses
- Comprehensive RLS policies

## 🔐 Security & RLS

### Row Level Security (RLS)

All tables have RLS enabled with policies for:

1. **Organization Isolation**
   - Users can only access data for their organization
   - Enforced via `organization_id` matching

2. **Module Access**
   - Users must have active subscription to module
   - Checked via `core.has_module_access()` function

3. **Role-Based Permissions**
   - `super_admin` - Full system access
   - `org_admin` - Full organization access
   - `manager` - Department/team management
   - `user` - Standard user access
   - `viewer` - Read-only access

### Testing RLS Policies

```sql
-- Set user context for testing
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-uuid-here"}';

-- Test queries
SELECT * FROM core.organizations;
SELECT * FROM inventory.products;
```

## 🔧 Useful Functions

### Core Functions

```sql
-- Get organization's active modules
SELECT * FROM core.get_organization_modules('org-uuid');

-- Check if user has module access
SELECT core.has_module_access('user-uuid', 'inventory');
```

### Inventory Functions

```sql
-- Adjust stock and create movement record
SELECT inventory.adjust_stock(
    p_organization_id := 'org-uuid',
    p_warehouse_id := 'warehouse-uuid',
    p_product_id := 'product-uuid',
    p_variant_id := NULL,
    p_quantity := 10,
    p_movement_type := 'purchase',
    p_unit_cost := 100.00,
    p_notes := 'Stock received from supplier'
);

-- Get total stock for product across all warehouses
SELECT inventory.get_product_total_stock('product-uuid');

-- Check for low stock and create alerts
SELECT inventory.check_low_stock();

-- Reserve stock for order
SELECT inventory.reserve_stock(
    'warehouse-uuid',
    'product-uuid',
    NULL,
    5
);

-- Release reserved stock
SELECT inventory.release_stock(
    'warehouse-uuid',
    'product-uuid',
    NULL,
    5
);
```

## 📈 Monitoring Queries

### Check Database Size

```sql
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname IN ('core', 'inventory')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### View Active Organizations

```sql
SELECT
    o.name,
    o.subscription_status,
    COUNT(DISTINCT u.id) as user_count,
    COUNT(DISTINCT s.id) as module_count
FROM core.organizations o
LEFT JOIN core.users u ON u.organization_id = o.id AND u.deleted_at IS NULL
LEFT JOIN core.subscriptions s ON s.organization_id = o.id AND s.status IN ('trial', 'active')
WHERE o.is_active = true
GROUP BY o.id, o.name, o.subscription_status;
```

### Stock Summary

```sql
SELECT
    w.name as warehouse,
    COUNT(DISTINCT s.product_id) as product_count,
    SUM(s.quantity) as total_units,
    SUM(s.available_quantity) as available_units,
    SUM(s.reserved_quantity) as reserved_units
FROM inventory.stock s
JOIN inventory.warehouses w ON w.id = s.warehouse_id
WHERE s.organization_id = 'your-org-uuid'
GROUP BY w.id, w.name
ORDER BY w.name;
```

### Low Stock Products

```sql
SELECT
    p.sku,
    p.name,
    w.name as warehouse,
    s.available_quantity,
    p.reorder_point,
    p.reorder_quantity
FROM inventory.stock s
JOIN inventory.products p ON p.id = s.product_id
JOIN inventory.warehouses w ON w.id = s.warehouse_id
WHERE p.organization_id = 'your-org-uuid'
AND s.available_quantity <= p.reorder_point
ORDER BY s.available_quantity ASC;
```

### Recent Stock Movements

```sql
SELECT
    sm.created_at,
    sm.type,
    p.name as product,
    w.name as warehouse,
    sm.quantity,
    sm.balance_after,
    u.display_name as performed_by
FROM inventory.stock_movements sm
JOIN inventory.products p ON p.id = sm.product_id
JOIN inventory.warehouses w ON w.id = sm.warehouse_id
LEFT JOIN core.users u ON u.id = sm.performed_by
WHERE sm.organization_id = 'your-org-uuid'
ORDER BY sm.created_at DESC
LIMIT 50;
```

## 🧪 Testing the Schema

### 1. Create Test Organization

```sql
INSERT INTO core.organizations (name, slug, email, subscription_status)
VALUES ('Test Company', 'test-company', 'test@example.com', 'trial')
RETURNING id;
```

### 2. Subscribe to Inventory Module

```sql
INSERT INTO core.subscriptions (organization_id, module_id, status, billing_cycle, price_per_cycle)
SELECT
    'org-uuid',
    id,
    'trial',
    'monthly',
    499.00
FROM core.modules
WHERE code = 'inventory';
```

### 3. Create Test User (after Supabase Auth signup)

```sql
INSERT INTO core.users (id, organization_id, first_name, last_name, email, role, status)
VALUES (
    'auth-user-uuid',
    'org-uuid',
    'John',
    'Doe',
    'john@example.com',
    'org_admin',
    'active'
);
```

### 4. Add Test Product

```sql
-- First, add a unit and category
INSERT INTO inventory.units (organization_id, name, abbreviation, type)
VALUES ('org-uuid', 'Each', 'ea', 'quantity')
RETURNING id;

INSERT INTO inventory.categories (organization_id, name, slug, level)
VALUES ('org-uuid', 'Electronics', 'electronics', 0)
RETURNING id;

-- Then add product
INSERT INTO inventory.products (
    organization_id,
    sku,
    name,
    slug,
    category_id,
    unit_id,
    cost_price,
    selling_price,
    reorder_point
) VALUES (
    'org-uuid',
    'TEST-001',
    'Test Product',
    'test-product',
    'category-uuid',
    'unit-uuid',
    100.00,
    150.00,
    10
);
```

## 🔄 Backup & Restore

### Backup Database

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or using pg_dump
pg_dump "postgresql://postgres:[password]@db.sjbvvrjxsbqrgtpgdxwr.supabase.co:5432/postgres" > backup.sql
```

### Restore Database

```bash
# Using Supabase CLI
supabase db reset

# Or using psql
psql "postgresql://postgres:[password]@db.sjbvvrjxsbqrgtpgdxwr.supabase.co:5432/postgres" < backup.sql
```

## 🐛 Troubleshooting

### Issue: RLS denies access

**Solution:** Ensure user has:
1. Active record in `core.users`
2. Organization subscription to module
3. User status is 'active'

```sql
-- Check user setup
SELECT
    u.*,
    o.subscription_status,
    s.status as module_status
FROM core.users u
JOIN core.organizations o ON o.id = u.organization_id
LEFT JOIN core.subscriptions s ON s.organization_id = u.organization_id
WHERE u.id = 'user-uuid';
```

### Issue: Module dependencies not satisfied

**Solution:** Install required modules first

```sql
-- Check module dependencies
SELECT code, requires_modules
FROM core.modules
WHERE is_active = true;
```

### Issue: Stock adjustments not working

**Solution:** Use the `inventory.adjust_stock()` function instead of direct inserts

```sql
-- Correct way to adjust stock
SELECT inventory.adjust_stock(
    p_organization_id := 'org-uuid',
    p_warehouse_id := 'warehouse-uuid',
    p_product_id := 'product-uuid',
    p_variant_id := NULL,
    p_quantity := 10,
    p_movement_type := 'adjustment',
    p_notes := 'Manual adjustment'
);
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🤝 Contributing

When making schema changes:

1. Create new migration file with sequential number
2. Test migration on local instance
3. Document changes in this README
4. Update seed data if needed
5. Test RLS policies thoroughly

## 📝 License

Copyright © 2025 Horizon Systems. All rights reserved.
