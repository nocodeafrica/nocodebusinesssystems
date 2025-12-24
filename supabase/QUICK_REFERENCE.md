# Database Quick Reference Guide

Fast reference for common database operations in Horizon Systems.

## 🔗 Connection Info

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://sjbvvrjxsbqrgtpgdxwr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key_here
SUPABASE_SECRET_KEY=your_secret_key_here
```

## 📋 Common Queries

### Organization Queries

```sql
-- Get organization with all details
SELECT * FROM core.organizations WHERE slug = 'your-company';

-- List all active organizations
SELECT id, name, subscription_status, trial_ends_at
FROM core.organizations
WHERE is_active = true AND deleted_at IS NULL;

-- Get organization's subscribed modules
SELECT m.code, m.name, s.status, s.ends_at
FROM core.subscriptions s
JOIN core.modules m ON m.id = s.module_id
WHERE s.organization_id = 'org-uuid'
AND s.status IN ('trial', 'active');

-- Count users per organization
SELECT o.name, COUNT(u.id) as user_count
FROM core.organizations o
LEFT JOIN core.users u ON u.organization_id = o.id AND u.deleted_at IS NULL
GROUP BY o.id, o.name;
```

### User Queries

```sql
-- Get user with organization
SELECT u.*, o.name as organization_name
FROM core.users u
JOIN core.organizations o ON o.id = u.organization_id
WHERE u.email = 'user@example.com';

-- List organization users with roles
SELECT
    u.display_name || ' (' || u.email || ')' as user,
    u.role,
    u.status,
    u.last_login_at
FROM core.users u
WHERE u.organization_id = 'org-uuid'
AND u.deleted_at IS NULL
ORDER BY u.role, u.display_name;

-- Check if user has module access
SELECT core.has_module_access('user-uuid', 'inventory');
```

### Inventory Queries

```sql
-- Get product with category and brand
SELECT
    p.sku,
    p.name,
    c.name as category,
    b.name as brand,
    p.selling_price,
    u.abbreviation as unit
FROM inventory.products p
LEFT JOIN inventory.categories c ON c.id = p.category_id
LEFT JOIN inventory.brands b ON b.id = p.brand_id
JOIN inventory.units u ON u.id = p.unit_id
WHERE p.organization_id = 'org-uuid'
AND p.deleted_at IS NULL;

-- Get total stock for product across all warehouses
SELECT
    p.name,
    SUM(s.quantity) as total_qty,
    SUM(s.available_quantity) as available_qty,
    SUM(s.reserved_quantity) as reserved_qty
FROM inventory.products p
LEFT JOIN inventory.stock s ON s.product_id = p.id
WHERE p.organization_id = 'org-uuid'
GROUP BY p.id, p.name;

-- Get stock by warehouse
SELECT
    w.name as warehouse,
    p.name as product,
    s.quantity,
    s.available_quantity,
    s.bin_location
FROM inventory.stock s
JOIN inventory.warehouses w ON w.id = s.warehouse_id
JOIN inventory.products p ON p.id = s.product_id
WHERE s.organization_id = 'org-uuid'
ORDER BY w.name, p.name;

-- Get low stock products
SELECT
    p.sku,
    p.name,
    SUM(s.available_quantity) as total_available,
    p.reorder_point,
    p.reorder_quantity
FROM inventory.products p
LEFT JOIN inventory.stock s ON s.product_id = p.id
WHERE p.organization_id = 'org-uuid'
AND p.track_inventory = true
GROUP BY p.id
HAVING SUM(s.available_quantity) <= p.reorder_point;

-- Recent stock movements
SELECT
    sm.created_at,
    p.name as product,
    w.name as warehouse,
    sm.type,
    sm.quantity,
    sm.balance_after,
    u.display_name as performed_by
FROM inventory.stock_movements sm
JOIN inventory.products p ON p.id = sm.product_id
JOIN inventory.warehouses w ON w.id = sm.warehouse_id
LEFT JOIN core.users u ON u.id = sm.performed_by
WHERE sm.organization_id = 'org-uuid'
ORDER BY sm.created_at DESC
LIMIT 20;

-- Purchase orders summary
SELECT
    po.po_number,
    s.name as supplier,
    po.status,
    po.order_date,
    po.total_amount,
    COUNT(poi.id) as line_items
FROM inventory.purchase_orders po
JOIN inventory.suppliers s ON s.id = po.supplier_id
LEFT JOIN inventory.purchase_order_items poi ON poi.purchase_order_id = po.id
WHERE po.organization_id = 'org-uuid'
GROUP BY po.id, s.name
ORDER BY po.order_date DESC;
```

## 🔧 Common Operations

### Create Organization

```sql
INSERT INTO core.organizations (
    name,
    slug,
    email,
    subscription_status,
    trial_ends_at
) VALUES (
    'New Company',
    'new-company',
    'contact@newcompany.com',
    'trial',
    NOW() + INTERVAL '14 days'
)
RETURNING id;
```

### Subscribe Organization to Module

```sql
INSERT INTO core.subscriptions (
    organization_id,
    module_id,
    status,
    billing_cycle,
    price_per_cycle,
    trial_ends_at
)
SELECT
    'org-uuid',
    id,
    'trial',
    'monthly',
    base_price_monthly,
    NOW() + INTERVAL '14 days'
FROM core.modules
WHERE code = 'inventory';
```

### Create User (after Supabase Auth)

```sql
INSERT INTO core.users (
    id,
    organization_id,
    first_name,
    last_name,
    email,
    role,
    status
) VALUES (
    'auth-user-uuid',
    'org-uuid',
    'Jane',
    'Smith',
    'jane@example.com',
    'user',
    'active'
);
```

### Add Product

```sql
INSERT INTO inventory.products (
    organization_id,
    sku,
    name,
    slug,
    category_id,
    unit_id,
    cost_price,
    selling_price,
    reorder_point,
    reorder_quantity
) VALUES (
    'org-uuid',
    'PROD-001',
    'Sample Product',
    'sample-product',
    'category-uuid',
    'unit-uuid',
    100.00,
    150.00,
    10,
    20
)
RETURNING id;
```

### Adjust Stock

```sql
-- Use the helper function
SELECT inventory.adjust_stock(
    p_organization_id := 'org-uuid',
    p_warehouse_id := 'warehouse-uuid',
    p_product_id := 'product-uuid',
    p_variant_id := NULL,
    p_quantity := 50,              -- Positive = add, negative = remove
    p_movement_type := 'purchase',
    p_reference_type := 'purchase_order',
    p_reference_id := 'po-uuid',
    p_reference_number := 'PO-001',
    p_unit_cost := 100.00,
    p_notes := 'Received from supplier',
    p_performed_by := 'user-uuid'
);
```

### Create Purchase Order

```sql
-- Insert PO
INSERT INTO inventory.purchase_orders (
    organization_id,
    po_number,
    supplier_id,
    warehouse_id,
    status,
    order_date,
    expected_date,
    subtotal,
    total_amount
) VALUES (
    'org-uuid',
    'PO-2025-001',
    'supplier-uuid',
    'warehouse-uuid',
    'pending',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '7 days',
    1000.00,
    1150.00
)
RETURNING id;

-- Insert PO items
INSERT INTO inventory.purchase_order_items (
    organization_id,
    purchase_order_id,
    product_id,
    quantity,
    unit_cost,
    line_total
) VALUES
('org-uuid', 'po-uuid', 'product-uuid', 10, 100.00, 1000.00);
```

### Transfer Stock Between Warehouses

```sql
-- Create transfer
INSERT INTO inventory.stock_transfers (
    organization_id,
    transfer_number,
    from_warehouse_id,
    to_warehouse_id,
    status,
    transfer_date
) VALUES (
    'org-uuid',
    'TR-001',
    'from-warehouse-uuid',
    'to-warehouse-uuid',
    'pending',
    CURRENT_DATE
)
RETURNING id;

-- Add items
INSERT INTO inventory.stock_transfer_items (
    organization_id,
    stock_transfer_id,
    product_id,
    quantity
) VALUES
('org-uuid', 'transfer-uuid', 'product-uuid', 5);

-- Process transfer (adjust stock at both warehouses)
SELECT inventory.adjust_stock(
    'org-uuid', 'from-warehouse-uuid', 'product-uuid', NULL,
    -5, 'transfer_out', 'stock_transfer', 'transfer-uuid', 'TR-001',
    NULL, 'Transfer to other warehouse', 'user-uuid'
);

SELECT inventory.adjust_stock(
    'org-uuid', 'to-warehouse-uuid', 'product-uuid', NULL,
    5, 'transfer_in', 'stock_transfer', 'transfer-uuid', 'TR-001',
    NULL, 'Received from other warehouse', 'user-uuid'
);
```

## 📊 Reporting Queries

### Sales Value Report

```sql
SELECT
    p.name,
    SUM(s.quantity) as total_units,
    p.selling_price,
    SUM(s.quantity * p.selling_price) as total_value
FROM inventory.products p
LEFT JOIN inventory.stock s ON s.product_id = p.id
WHERE p.organization_id = 'org-uuid'
GROUP BY p.id
ORDER BY total_value DESC;
```

### Inventory Valuation

```sql
SELECT
    SUM(s.quantity * p.cost_price) as cost_value,
    SUM(s.quantity * p.selling_price) as retail_value,
    SUM(s.quantity * (p.selling_price - p.cost_price)) as potential_profit
FROM inventory.stock s
JOIN inventory.products p ON p.id = s.product_id
WHERE s.organization_id = 'org-uuid';
```

### Movement Analysis (Last 30 Days)

```sql
SELECT
    DATE(created_at) as date,
    type,
    COUNT(*) as movement_count,
    SUM(quantity) as total_quantity
FROM inventory.stock_movements
WHERE organization_id = 'org-uuid'
AND created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), type
ORDER BY date DESC, type;
```

### Top Products by Movement

```sql
SELECT
    p.name,
    COUNT(sm.id) as movement_count,
    SUM(ABS(sm.quantity)) as total_quantity_moved
FROM inventory.products p
JOIN inventory.stock_movements sm ON sm.product_id = p.id
WHERE p.organization_id = 'org-uuid'
AND sm.created_at > NOW() - INTERVAL '30 days'
GROUP BY p.id
ORDER BY total_quantity_moved DESC
LIMIT 10;
```

## 🔐 Security Checks

### Test RLS for User

```sql
-- Set user context
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-uuid-here"}';

-- Test queries (should only return user's organization data)
SELECT * FROM core.organizations;
SELECT * FROM inventory.products;

-- Reset
RESET role;
RESET request.jwt.claims;
```

### Check User Permissions

```sql
SELECT
    u.email,
    u.role,
    o.name as organization,
    m.code as module,
    s.status as subscription_status
FROM core.users u
JOIN core.organizations o ON o.id = u.organization_id
LEFT JOIN core.subscriptions s ON s.organization_id = u.organization_id
LEFT JOIN core.modules m ON m.id = s.module_id
WHERE u.id = 'user-uuid';
```

## 🐛 Troubleshooting

### Check Why Query Returns No Results

```sql
-- Check if user exists and is active
SELECT * FROM core.users WHERE id = auth.uid();

-- Check organization status
SELECT o.* FROM core.organizations o
JOIN core.users u ON u.organization_id = o.id
WHERE u.id = auth.uid();

-- Check module subscription
SELECT s.* FROM core.subscriptions s
JOIN core.users u ON u.organization_id = s.organization_id
JOIN core.modules m ON m.id = s.module_id
WHERE u.id = auth.uid() AND m.code = 'inventory';
```

### Check Stock Discrepancies

```sql
-- Compare system stock with last movement balance
SELECT
    p.name,
    s.quantity as system_quantity,
    (
        SELECT balance_after
        FROM inventory.stock_movements sm
        WHERE sm.product_id = s.product_id
        AND sm.warehouse_id = s.warehouse_id
        AND (sm.variant_id = s.variant_id OR (sm.variant_id IS NULL AND s.variant_id IS NULL))
        ORDER BY sm.created_at DESC
        LIMIT 1
    ) as last_movement_balance
FROM inventory.stock s
JOIN inventory.products p ON p.id = s.product_id
WHERE s.organization_id = 'org-uuid'
HAVING system_quantity != last_movement_balance;
```

## 📞 Support

For issues or questions:
- Check `/Users/mac/Desktop/Billion/horizon-systems/supabase/README.md`
- Run `/Users/mac/Desktop/Billion/horizon-systems/supabase/maintenance.sql`
- Review Supabase logs in dashboard

## 🔄 Quick Commands

```bash
# Apply migrations
supabase db push

# Run seed data
supabase db execute --file supabase/seed.sql

# Run maintenance
supabase db execute --file supabase/maintenance.sql

# Backup database
supabase db dump -f backup.sql

# Rollback (DANGER!)
supabase db execute --file supabase/rollback.sql
```
