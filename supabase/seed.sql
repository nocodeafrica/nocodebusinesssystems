-- =====================================================
-- Seed Data for Horizon Systems
-- Description: Sample data for development and testing
-- Author: Horizon Systems
-- Date: 2025-10-20
-- =====================================================

-- =====================================================
-- CORE SCHEMA SEED DATA
-- =====================================================

-- Insert system modules
INSERT INTO core.modules (code, name, description, category, base_price_monthly, base_price_annual, metadata) VALUES
('inventory', 'Inventory Management', 'Complete inventory tracking, stock management, and warehouse operations', 'operations', 499.00, 4990.00, '{"features": ["Multi-warehouse", "Stock tracking", "Purchase orders", "Low stock alerts"]}'),
('crm', 'Customer Relationship Management', 'Manage customers, leads, and sales pipeline', 'sales', 699.00, 6990.00, '{"features": ["Contact management", "Deal tracking", "Email integration", "Reports"]}'),
('recruitment', 'Recruitment & Hiring', 'Applicant tracking, job postings, and hiring workflows', 'hr', 599.00, 5990.00, '{"features": ["Job postings", "Applicant tracking", "Interview scheduling", "Onboarding"]}'),
('pos', 'Point of Sale', 'Retail and restaurant POS system with inventory integration', 'sales', 399.00, 3990.00, '{"features": ["Quick checkout", "Payment processing", "Receipt printing", "Inventory sync"], "requires_modules": ["inventory"]}'),
('accounting', 'Accounting & Finance', 'Financial management, invoicing, and reporting', 'finance', 799.00, 7990.00, '{"features": ["Invoicing", "Expense tracking", "Financial reports", "Bank reconciliation"]}'),
('hrms', 'Human Resource Management', 'Employee management, payroll, and performance tracking', 'hr', 599.00, 5990.00, '{"features": ["Employee records", "Payroll", "Leave management", "Performance reviews"]}'),
('project', 'Project Management', 'Task tracking, project planning, and team collaboration', 'collaboration', 499.00, 4990.00, '{"features": ["Task management", "Gantt charts", "Time tracking", "Team collaboration"]}'),
('analytics', 'Business Analytics', 'Advanced reporting and business intelligence', 'analytics', 899.00, 8990.00, '{"features": ["Custom dashboards", "Data visualization", "Predictive analytics", "Export reports"]}')
ON CONFLICT (code) DO NOTHING;

-- Insert sample organizations
INSERT INTO core.organizations (
    id,
    name,
    slug,
    industry,
    size,
    email,
    phone,
    address_line1,
    city,
    state,
    country,
    postal_code,
    subscription_status,
    trial_ends_at,
    billing_cycle,
    is_active,
    is_verified
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Demo Company Ltd',
    'demo-company',
    'Retail',
    'medium',
    'info@democompany.co.za',
    '+27 11 123 4567',
    '123 Business Street',
    'Johannesburg',
    'Gauteng',
    'South Africa',
    '2001',
    'trial',
    NOW() + INTERVAL '14 days',
    'monthly',
    true,
    true
),
(
    '00000000-0000-0000-0000-000000000002',
    'Tech Solutions SA',
    'tech-solutions',
    'Technology',
    'small',
    'hello@techsolutions.co.za',
    '+27 21 987 6543',
    '456 Innovation Drive',
    'Cape Town',
    'Western Cape',
    'South Africa',
    '8001',
    'active',
    NULL,
    'annual',
    true,
    true
)
ON CONFLICT (id) DO NOTHING;

-- Note: Users must be created through Supabase Auth first
-- After auth.users are created, you can insert into core.users like this:

-- Example user insert (requires existing auth.users record):
-- INSERT INTO core.users (
--     id,
--     organization_id,
--     first_name,
--     last_name,
--     email,
--     role,
--     status,
--     job_title,
--     department
-- ) VALUES
-- (
--     '[auth_user_id_here]',
--     '00000000-0000-0000-0000-000000000001',
--     'John',
--     'Admin',
--     'john@democompany.co.za',
--     'org_admin',
--     'active',
--     'System Administrator',
--     'IT'
-- );

-- Insert module subscriptions for demo organizations
INSERT INTO core.subscriptions (
    organization_id,
    module_id,
    status,
    billing_cycle,
    price_per_cycle,
    currency,
    trial_ends_at,
    started_at
) VALUES
-- Demo Company subscriptions (trial)
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM core.modules WHERE code = 'inventory'),
    'trial',
    'monthly',
    499.00,
    'ZAR',
    NOW() + INTERVAL '14 days',
    NOW()
),
(
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM core.modules WHERE code = 'crm'),
    'trial',
    'monthly',
    699.00,
    'ZAR',
    NOW() + INTERVAL '14 days',
    NOW()
),
-- Tech Solutions subscriptions (active)
(
    '00000000-0000-0000-0000-000000000002',
    (SELECT id FROM core.modules WHERE code = 'inventory'),
    'active',
    'annual',
    4990.00,
    'ZAR',
    NULL,
    NOW() - INTERVAL '30 days'
),
(
    '00000000-0000-0000-0000-000000000002',
    (SELECT id FROM core.modules WHERE code = 'accounting'),
    'active',
    'annual',
    7990.00,
    'ZAR',
    NULL,
    NOW() - INTERVAL '30 days'
)
ON CONFLICT (organization_id, module_id) DO NOTHING;

-- =====================================================
-- INVENTORY SCHEMA SEED DATA
-- =====================================================

-- Insert standard units of measurement
INSERT INTO inventory.units (organization_id, name, abbreviation, type) VALUES
('00000000-0000-0000-0000-000000000001', 'Each', 'ea', 'quantity'),
('00000000-0000-0000-0000-000000000001', 'Piece', 'pc', 'quantity'),
('00000000-0000-0000-0000-000000000001', 'Box', 'box', 'quantity'),
('00000000-0000-0000-0000-000000000001', 'Kilogram', 'kg', 'weight'),
('00000000-0000-0000-0000-000000000001', 'Gram', 'g', 'weight'),
('00000000-0000-0000-0000-000000000001', 'Liter', 'L', 'volume'),
('00000000-0000-0000-0000-000000000001', 'Milliliter', 'ml', 'volume'),
('00000000-0000-0000-0000-000000000001', 'Meter', 'm', 'length'),
('00000000-0000-0000-0000-000000000001', 'Centimeter', 'cm', 'length')
ON CONFLICT (organization_id, abbreviation) DO NOTHING;

-- Set up unit conversions
UPDATE inventory.units SET
    base_unit_id = (SELECT id FROM inventory.units WHERE abbreviation = 'kg' AND organization_id = '00000000-0000-0000-0000-000000000001'),
    conversion_factor = 0.001
WHERE abbreviation = 'g' AND organization_id = '00000000-0000-0000-0000-000000000001';

UPDATE inventory.units SET
    base_unit_id = (SELECT id FROM inventory.units WHERE abbreviation = 'L' AND organization_id = '00000000-0000-0000-0000-000000000001'),
    conversion_factor = 0.001
WHERE abbreviation = 'ml' AND organization_id = '00000000-0000-0000-0000-000000000001';

UPDATE inventory.units SET
    base_unit_id = (SELECT id FROM inventory.units WHERE abbreviation = 'm' AND organization_id = '00000000-0000-0000-0000-000000000001'),
    conversion_factor = 0.01
WHERE abbreviation = 'cm' AND organization_id = '00000000-0000-0000-0000-000000000001';

-- Insert product categories
INSERT INTO inventory.categories (organization_id, name, slug, description, level, sort_order) VALUES
('00000000-0000-0000-0000-000000000001', 'Electronics', 'electronics', 'Electronic devices and accessories', 0, 1),
('00000000-0000-0000-0000-000000000001', 'Office Supplies', 'office-supplies', 'Office furniture and stationery', 0, 2),
('00000000-0000-0000-0000-000000000001', 'Food & Beverages', 'food-beverages', 'Food items and drinks', 0, 3),
('00000000-0000-0000-0000-000000000001', 'Clothing', 'clothing', 'Apparel and accessories', 0, 4),
('00000000-0000-0000-0000-000000000001', 'Hardware', 'hardware', 'Tools and hardware supplies', 0, 5)
ON CONFLICT (organization_id, slug) DO NOTHING;

-- Insert sub-categories
DO $$
DECLARE
    electronics_id UUID;
    office_id UUID;
BEGIN
    SELECT id INTO electronics_id FROM inventory.categories WHERE slug = 'electronics' AND organization_id = '00000000-0000-0000-0000-000000000001';
    SELECT id INTO office_id FROM inventory.categories WHERE slug = 'office-supplies' AND organization_id = '00000000-0000-0000-0000-000000000001';

    INSERT INTO inventory.categories (organization_id, name, slug, parent_id, level, sort_order) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Laptops', 'laptops', electronics_id, 1, 1),
    ('00000000-0000-0000-0000-000000000001', 'Phones', 'phones', electronics_id, 1, 2),
    ('00000000-0000-0000-0000-000000000001', 'Accessories', 'accessories', electronics_id, 1, 3),
    ('00000000-0000-0000-0000-000000000001', 'Furniture', 'furniture', office_id, 1, 1),
    ('00000000-0000-0000-0000-000000000001', 'Stationery', 'stationery', office_id, 1, 2)
    ON CONFLICT (organization_id, slug) DO NOTHING;
END $$;

-- Insert brands
INSERT INTO inventory.brands (organization_id, name, slug, description, website) VALUES
('00000000-0000-0000-0000-000000000001', 'Samsung', 'samsung', 'Electronics manufacturer', 'https://www.samsung.com'),
('00000000-0000-0000-0000-000000000001', 'Apple', 'apple', 'Technology company', 'https://www.apple.com'),
('00000000-0000-0000-0000-000000000001', 'HP', 'hp', 'Computer and printer manufacturer', 'https://www.hp.com'),
('00000000-0000-0000-0000-000000000001', 'Dell', 'dell', 'Computer technology company', 'https://www.dell.com'),
('00000000-0000-0000-0000-000000000001', 'Generic', 'generic', 'Generic brand products', NULL)
ON CONFLICT (organization_id, slug) DO NOTHING;

-- Insert warehouses
INSERT INTO inventory.warehouses (
    id,
    organization_id,
    name,
    code,
    type,
    email,
    phone,
    address_line1,
    city,
    state,
    postal_code,
    latitude,
    longitude
) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Main Warehouse',
    'WH-001',
    'main',
    'warehouse@democompany.co.za',
    '+27 11 123 4567',
    '789 Industrial Road',
    'Johannesburg',
    'Gauteng',
    '2000',
    -26.2041,
    28.0473
),
(
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Cape Town Branch',
    'WH-002',
    'branch',
    'ct-warehouse@democompany.co.za',
    '+27 21 555 1234',
    '321 Warehouse Lane',
    'Cape Town',
    'Western Cape',
    '8000',
    -33.9249,
    18.4241
),
(
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Retail Store - Sandton',
    'RT-001',
    'retail',
    'sandton@democompany.co.za',
    '+27 11 888 9999',
    '100 Shopping Centre',
    'Sandton',
    'Gauteng',
    '2196',
    -26.1076,
    28.0567
)
ON CONFLICT (organization_id, code) DO NOTHING;

-- Insert suppliers
INSERT INTO inventory.suppliers (
    organization_id,
    name,
    code,
    email,
    phone,
    contact_person,
    contact_email,
    address_line1,
    city,
    country,
    payment_terms,
    currency
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Tech Distributors SA',
    'SUP-001',
    'sales@techdist.co.za',
    '+27 11 456 7890',
    'Michael Johnson',
    'michael@techdist.co.za',
    '456 Distribution Drive',
    'Johannesburg',
    'South Africa',
    'Net 30',
    'ZAR'
),
(
    '00000000-0000-0000-0000-000000000001',
    'Office Suppliers Pro',
    'SUP-002',
    'orders@officesuppliers.co.za',
    '+27 21 789 0123',
    'Sarah Williams',
    'sarah@officesuppliers.co.za',
    '789 Supply Street',
    'Cape Town',
    'South Africa',
    'Net 14',
    'ZAR'
),
(
    '00000000-0000-0000-0000-000000000001',
    'Global Electronics Import',
    'SUP-003',
    'info@globalelec.co.za',
    '+27 31 234 5678',
    'David Chen',
    'david@globalelec.co.za',
    '321 Import Avenue',
    'Durban',
    'South Africa',
    'Net 60',
    'ZAR'
)
ON CONFLICT (organization_id, code) DO NOTHING;

-- Insert sample products
DO $$
DECLARE
    electronics_cat_id UUID;
    laptops_cat_id UUID;
    phones_cat_id UUID;
    office_cat_id UUID;
    samsung_brand_id UUID;
    apple_brand_id UUID;
    hp_brand_id UUID;
    generic_brand_id UUID;
    unit_ea_id UUID;
    unit_box_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO electronics_cat_id FROM inventory.categories WHERE slug = 'electronics' AND organization_id = '00000000-0000-0000-0000-000000000001';
    SELECT id INTO laptops_cat_id FROM inventory.categories WHERE slug = 'laptops' AND organization_id = '00000000-0000-0000-0000-000000000001';
    SELECT id INTO phones_cat_id FROM inventory.categories WHERE slug = 'phones' AND organization_id = '00000000-0000-0000-0000-000000000001';
    SELECT id INTO office_cat_id FROM inventory.categories WHERE slug = 'office-supplies' AND organization_id = '00000000-0000-0000-0000-000000000001';

    -- Get brand IDs
    SELECT id INTO samsung_brand_id FROM inventory.brands WHERE slug = 'samsung' AND organization_id = '00000000-0000-0000-0000-000000000001';
    SELECT id INTO apple_brand_id FROM inventory.brands WHERE slug = 'apple' AND organization_id = '00000000-0000-0000-0000-000000000001';
    SELECT id INTO hp_brand_id FROM inventory.brands WHERE slug = 'hp' AND organization_id = '00000000-0000-0000-0000-000000000001';
    SELECT id INTO generic_brand_id FROM inventory.brands WHERE slug = 'generic' AND organization_id = '00000000-0000-0000-0000-000000000001';

    -- Get unit IDs
    SELECT id INTO unit_ea_id FROM inventory.units WHERE abbreviation = 'ea' AND organization_id = '00000000-0000-0000-0000-000000000001';
    SELECT id INTO unit_box_id FROM inventory.units WHERE abbreviation = 'box' AND organization_id = '00000000-0000-0000-0000-000000000001';

    -- Insert products
    INSERT INTO inventory.products (
        organization_id,
        sku,
        name,
        slug,
        description,
        category_id,
        brand_id,
        unit_id,
        type,
        cost_price,
        selling_price,
        currency,
        tax_rate,
        weight,
        weight_unit,
        track_inventory,
        reorder_point,
        reorder_quantity,
        min_stock_level,
        max_stock_level
    ) VALUES
    (
        '00000000-0000-0000-0000-000000000001',
        'LAP-HP-001',
        'HP EliteBook 840 G8',
        'hp-elitebook-840-g8',
        '14-inch business laptop with Intel Core i7, 16GB RAM, 512GB SSD',
        laptops_cat_id,
        hp_brand_id,
        unit_ea_id,
        'simple',
        15000.00,
        22999.00,
        'ZAR',
        15.00,
        1.5,
        'kg',
        true,
        5,
        10,
        3,
        50
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        'PHN-SAM-001',
        'Samsung Galaxy S23',
        'samsung-galaxy-s23',
        'Latest Samsung flagship smartphone with 256GB storage',
        phones_cat_id,
        samsung_brand_id,
        unit_ea_id,
        'variable',
        12000.00,
        18999.00,
        'ZAR',
        15.00,
        0.168,
        'kg',
        true,
        10,
        20,
        5,
        100
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        'PHN-APL-001',
        'Apple iPhone 15 Pro',
        'apple-iphone-15-pro',
        'Premium iPhone with A17 Pro chip, 256GB storage',
        phones_cat_id,
        apple_brand_id,
        unit_ea_id,
        'variable',
        18000.00,
        26999.00,
        'ZAR',
        15.00,
        0.187,
        'kg',
        true,
        8,
        15,
        5,
        80
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        'OFF-PEN-001',
        'Ballpoint Pens - Blue (Box of 50)',
        'ballpoint-pens-blue',
        'High-quality ballpoint pens, box of 50 units',
        office_cat_id,
        generic_brand_id,
        unit_box_id,
        'simple',
        50.00,
        129.99,
        'ZAR',
        15.00,
        0.5,
        'kg',
        true,
        20,
        50,
        10,
        200
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        'OFF-PAD-001',
        'A4 Writing Pad',
        'a4-writing-pad',
        'Ruled writing pad, 100 sheets',
        office_cat_id,
        generic_brand_id,
        unit_ea_id,
        'simple',
        15.00,
        34.99,
        'ZAR',
        15.00,
        0.3,
        'kg',
        true,
        50,
        100,
        20,
        500
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        'ELC-MOU-001',
        'Wireless Mouse',
        'wireless-mouse',
        'Ergonomic wireless mouse with USB receiver',
        electronics_cat_id,
        generic_brand_id,
        unit_ea_id,
        'simple',
        80.00,
        199.00,
        'ZAR',
        15.00,
        0.1,
        'kg',
        true,
        30,
        50,
        15,
        150
    )
    ON CONFLICT (organization_id, sku) DO NOTHING;
END $$;

-- Insert product variants for Samsung Galaxy S23
DO $$
DECLARE
    samsung_s23_id UUID;
BEGIN
    SELECT id INTO samsung_s23_id FROM inventory.products WHERE sku = 'PHN-SAM-001' AND organization_id = '00000000-0000-0000-0000-000000000001';

    IF samsung_s23_id IS NOT NULL THEN
        INSERT INTO inventory.product_variants (
            organization_id,
            product_id,
            sku,
            name,
            attributes,
            cost_price,
            selling_price
        ) VALUES
        (
            '00000000-0000-0000-0000-000000000001',
            samsung_s23_id,
            'PHN-SAM-001-BLK',
            'Samsung Galaxy S23 - Black',
            '{"color": "Black", "storage": "256GB"}',
            12000.00,
            18999.00
        ),
        (
            '00000000-0000-0000-0000-000000000001',
            samsung_s23_id,
            'PHN-SAM-001-WHT',
            'Samsung Galaxy S23 - White',
            '{"color": "White", "storage": "256GB"}',
            12000.00,
            18999.00
        ),
        (
            '00000000-0000-0000-0000-000000000001',
            samsung_s23_id,
            'PHN-SAM-001-GRN',
            'Samsung Galaxy S23 - Green',
            '{"color": "Green", "storage": "256GB"}',
            12000.00,
            19499.00
        )
        ON CONFLICT (organization_id, sku) DO NOTHING;
    END IF;
END $$;

-- Insert initial stock levels
DO $$
DECLARE
    main_wh_id UUID := '10000000-0000-0000-0000-000000000001';
    ct_wh_id UUID := '10000000-0000-0000-0000-000000000002';
    retail_wh_id UUID := '10000000-0000-0000-0000-000000000003';
    org_id UUID := '00000000-0000-0000-0000-000000000001';
    product_rec RECORD;
BEGIN
    -- Add stock for laptops
    FOR product_rec IN
        SELECT id FROM inventory.products
        WHERE organization_id = org_id
        AND sku = 'LAP-HP-001'
    LOOP
        INSERT INTO inventory.stock (organization_id, warehouse_id, product_id, quantity, available_quantity, bin_location)
        VALUES
            (org_id, main_wh_id, product_rec.id, 25, 25, 'A-1-01'),
            (org_id, ct_wh_id, product_rec.id, 15, 15, 'B-2-05'),
            (org_id, retail_wh_id, product_rec.id, 5, 5, 'FLOOR-01')
        ON CONFLICT (warehouse_id, product_id, variant_id) DO NOTHING;
    END LOOP;

    -- Add stock for office supplies
    FOR product_rec IN
        SELECT id FROM inventory.products
        WHERE organization_id = org_id
        AND sku IN ('OFF-PEN-001', 'OFF-PAD-001', 'ELC-MOU-001')
    LOOP
        INSERT INTO inventory.stock (organization_id, warehouse_id, product_id, quantity, available_quantity)
        VALUES
            (org_id, main_wh_id, product_rec.id, 100, 100),
            (org_id, ct_wh_id, product_rec.id, 50, 50),
            (org_id, retail_wh_id, product_rec.id, 30, 30)
        ON CONFLICT (warehouse_id, product_id, variant_id) DO NOTHING;
    END LOOP;
END $$;

-- Insert stock for Samsung Galaxy variants
DO $$
DECLARE
    main_wh_id UUID := '10000000-0000-0000-0000-000000000001';
    ct_wh_id UUID := '10000000-0000-0000-0000-000000000002';
    org_id UUID := '00000000-0000-0000-0000-000000000001';
    samsung_s23_id UUID;
    variant_rec RECORD;
BEGIN
    SELECT id INTO samsung_s23_id FROM inventory.products WHERE sku = 'PHN-SAM-001' AND organization_id = org_id;

    IF samsung_s23_id IS NOT NULL THEN
        FOR variant_rec IN
            SELECT id FROM inventory.product_variants
            WHERE product_id = samsung_s23_id
        LOOP
            INSERT INTO inventory.stock (organization_id, warehouse_id, product_id, variant_id, quantity, available_quantity)
            VALUES
                (org_id, main_wh_id, samsung_s23_id, variant_rec.id, 20, 20),
                (org_id, ct_wh_id, samsung_s23_id, variant_rec.id, 10, 10)
            ON CONFLICT (warehouse_id, product_id, variant_id) DO NOTHING;
        END LOOP;
    END IF;
END $$;

-- Insert sample purchase order
DO $$
DECLARE
    org_id UUID := '00000000-0000-0000-0000-000000000001';
    main_wh_id UUID := '10000000-0000-0000-0000-000000000001';
    supplier_id UUID;
    po_id UUID;
    laptop_id UUID;
    mouse_id UUID;
BEGIN
    SELECT id INTO supplier_id FROM inventory.suppliers WHERE code = 'SUP-001' AND organization_id = org_id;
    SELECT id INTO laptop_id FROM inventory.products WHERE sku = 'LAP-HP-001' AND organization_id = org_id;
    SELECT id INTO mouse_id FROM inventory.products WHERE sku = 'ELC-MOU-001' AND organization_id = org_id;

    IF supplier_id IS NOT NULL THEN
        INSERT INTO inventory.purchase_orders (
            id,
            organization_id,
            po_number,
            supplier_id,
            warehouse_id,
            status,
            order_date,
            expected_date,
            subtotal,
            tax_amount,
            total_amount,
            currency,
            payment_terms,
            notes
        ) VALUES (
            '20000000-0000-0000-0000-000000000001',
            org_id,
            'PO-2025-001',
            supplier_id,
            main_wh_id,
            'pending',
            CURRENT_DATE,
            CURRENT_DATE + INTERVAL '7 days',
            156000.00,
            23400.00,
            179400.00,
            'ZAR',
            'Net 30',
            'Quarterly stock replenishment'
        )
        ON CONFLICT (organization_id, po_number) DO NOTHING
        RETURNING id INTO po_id;

        -- Insert PO line items
        IF po_id IS NOT NULL THEN
            INSERT INTO inventory.purchase_order_items (
                organization_id,
                purchase_order_id,
                product_id,
                quantity,
                unit_cost,
                tax_rate,
                line_total
            ) VALUES
            (org_id, po_id, laptop_id, 10, 15000.00, 15.00, 150000.00),
            (org_id, po_id, mouse_id, 50, 80.00, 15.00, 4000.00)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- Insert sample stock movements (initial stock entry)
DO $$
DECLARE
    org_id UUID := '00000000-0000-0000-0000-000000000001';
    main_wh_id UUID := '10000000-0000-0000-0000-000000000001';
    product_rec RECORD;
BEGIN
    FOR product_rec IN
        SELECT p.id as product_id, s.quantity
        FROM inventory.products p
        JOIN inventory.stock s ON s.product_id = p.id
        WHERE p.organization_id = org_id
        AND s.warehouse_id = main_wh_id
        AND s.variant_id IS NULL
        LIMIT 5
    LOOP
        INSERT INTO inventory.stock_movements (
            organization_id,
            warehouse_id,
            product_id,
            type,
            quantity,
            balance_after,
            notes,
            created_at
        ) VALUES (
            org_id,
            main_wh_id,
            product_rec.product_id,
            'adjustment',
            product_rec.quantity,
            product_rec.quantity,
            'Initial stock entry',
            NOW() - INTERVAL '7 days'
        );
    END LOOP;
END $$;

-- Trigger low stock check
SELECT inventory.check_low_stock();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Uncomment to verify seed data:

-- SELECT 'Modules' as table_name, COUNT(*) as record_count FROM core.modules
-- UNION ALL
-- SELECT 'Organizations', COUNT(*) FROM core.organizations
-- UNION ALL
-- SELECT 'Subscriptions', COUNT(*) FROM core.subscriptions
-- UNION ALL
-- SELECT 'Categories', COUNT(*) FROM inventory.categories WHERE organization_id = '00000000-0000-0000-0000-000000000001'
-- UNION ALL
-- SELECT 'Brands', COUNT(*) FROM inventory.brands WHERE organization_id = '00000000-0000-0000-0000-000000000001'
-- UNION ALL
-- SELECT 'Products', COUNT(*) FROM inventory.products WHERE organization_id = '00000000-0000-0000-0000-000000000001'
-- UNION ALL
-- SELECT 'Warehouses', COUNT(*) FROM inventory.warehouses WHERE organization_id = '00000000-0000-0000-0000-000000000001'
-- UNION ALL
-- SELECT 'Stock Records', COUNT(*) FROM inventory.stock WHERE organization_id = '00000000-0000-0000-0000-000000000001'
-- UNION ALL
-- SELECT 'Suppliers', COUNT(*) FROM inventory.suppliers WHERE organization_id = '00000000-0000-0000-0000-000000000001'
-- UNION ALL
-- SELECT 'Purchase Orders', COUNT(*) FROM inventory.purchase_orders WHERE organization_id = '00000000-0000-0000-0000-000000000001';

-- View total stock by product
-- SELECT
--     p.sku,
--     p.name,
--     SUM(s.available_quantity) as total_available,
--     p.reorder_point,
--     CASE
--         WHEN SUM(s.available_quantity) <= p.reorder_point THEN 'LOW STOCK'
--         ELSE 'OK'
--     END as status
-- FROM inventory.products p
-- LEFT JOIN inventory.stock s ON s.product_id = p.id
-- WHERE p.organization_id = '00000000-0000-0000-0000-000000000001'
-- AND p.deleted_at IS NULL
-- GROUP BY p.id, p.sku, p.name, p.reorder_point
-- ORDER BY p.name;

-- =====================================================
-- COMPLETION
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '====================================';
    RAISE NOTICE 'Seed data loaded successfully!';
    RAISE NOTICE '====================================';
    RAISE NOTICE 'Organizations: 2 demo companies';
    RAISE NOTICE 'Modules: 8 system modules';
    RAISE NOTICE 'Products: 6+ sample products';
    RAISE NOTICE 'Warehouses: 3 locations';
    RAISE NOTICE 'Stock: Multiple warehouse stock records';
    RAISE NOTICE '====================================';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Create users via Supabase Auth';
    RAISE NOTICE '2. Insert user records in core.users';
    RAISE NOTICE '3. Test RLS policies';
    RAISE NOTICE '4. Customize data for your needs';
    RAISE NOTICE '====================================';
END $$;
