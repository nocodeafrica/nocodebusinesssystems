-- =====================================================
-- Database Maintenance Script
-- Description: Routine maintenance tasks and health checks
-- Author: Horizon Systems
-- Date: 2025-10-20
-- =====================================================

-- Run this script periodically to maintain database health

-- =====================================================
-- VACUUM AND ANALYZE
-- =====================================================

-- Vacuum all tables to reclaim space and update statistics
VACUUM ANALYZE;

-- Vacuum specific schemas
VACUUM ANALYZE core.organizations;
VACUUM ANALYZE core.users;
VACUUM ANALYZE core.subscriptions;
VACUUM ANALYZE inventory.products;
VACUUM ANALYZE inventory.stock;
VACUUM ANALYZE inventory.stock_movements;

-- =====================================================
-- REINDEX
-- =====================================================

-- Reindex to improve query performance
-- Run during low-traffic periods

-- REINDEX SCHEMA core;
-- REINDEX SCHEMA inventory;

-- =====================================================
-- EXPIRE OLD INVITATIONS
-- =====================================================

SELECT core.expire_old_invitations();

-- =====================================================
-- CHECK LOW STOCK ALERTS
-- =====================================================

SELECT inventory.check_low_stock();

-- =====================================================
-- CLEAN UP OLD AUDIT LOGS
-- =====================================================

-- Archive or delete audit logs older than 1 year
-- Uncomment to enable (be careful!)

-- DELETE FROM core.audit_logs
-- WHERE created_at < NOW() - INTERVAL '1 year';

-- Better approach: Archive to separate table
-- CREATE TABLE IF NOT EXISTS core.audit_logs_archive (LIKE core.audit_logs INCLUDING ALL);
-- INSERT INTO core.audit_logs_archive
-- SELECT * FROM core.audit_logs WHERE created_at < NOW() - INTERVAL '1 year';
-- DELETE FROM core.audit_logs WHERE created_at < NOW() - INTERVAL '1 year';

-- =====================================================
-- RESOLVE EXPIRED STOCK ALERTS
-- =====================================================

-- Auto-resolve alerts for products that are no longer low stock
UPDATE inventory.stock_alerts a
SET status = 'resolved',
    resolved_at = NOW(),
    resolution_notes = 'Auto-resolved: Stock level restored'
FROM inventory.stock s
WHERE a.product_id = s.product_id
AND (a.variant_id = s.variant_id OR (a.variant_id IS NULL AND s.variant_id IS NULL))
AND a.warehouse_id = s.warehouse_id
AND a.status = 'active'
AND s.available_quantity > a.threshold_quantity;

-- =====================================================
-- UPDATE TRIAL STATUS
-- =====================================================

-- Update expired trials to expired status
UPDATE core.organizations
SET subscription_status = 'expired'
WHERE subscription_status = 'trial'
AND trial_ends_at < NOW();

UPDATE core.subscriptions
SET status = 'expired'
WHERE status = 'trial'
AND trial_ends_at < NOW();

-- =====================================================
-- CLEAN UP SOFT-DELETED RECORDS
-- =====================================================

-- Hard delete soft-deleted records older than 90 days
-- Uncomment to enable

-- DELETE FROM core.users WHERE deleted_at < NOW() - INTERVAL '90 days';
-- DELETE FROM inventory.products WHERE deleted_at < NOW() - INTERVAL '90 days';
-- DELETE FROM inventory.categories WHERE deleted_at < NOW() - INTERVAL '90 days';
-- DELETE FROM inventory.brands WHERE deleted_at < NOW() - INTERVAL '90 days';
-- DELETE FROM inventory.warehouses WHERE deleted_at < NOW() - INTERVAL '90 days';
-- DELETE FROM inventory.suppliers WHERE deleted_at < NOW() - INTERVAL '90 days';

-- =====================================================
-- DATABASE HEALTH CHECKS
-- =====================================================

-- Check for bloated tables
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_live_tup,
    n_dead_tup,
    ROUND(100 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_percentage
FROM pg_stat_user_tables
WHERE schemaname IN ('core', 'inventory')
AND n_dead_tup > 1000
ORDER BY n_dead_tup DESC;

-- Check for missing indexes on foreign keys
SELECT
    c.conrelid::regclass AS table,
    a.attname AS column,
    'CREATE INDEX ON ' || c.conrelid::regclass || '(' || a.attname || ');' AS suggestion
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
AND c.connamespace::regnamespace::text IN ('core', 'inventory')
AND NOT EXISTS (
    SELECT 1
    FROM pg_index i
    WHERE i.indrelid = c.conrelid
    AND a.attnum = ANY(i.indkey)
    AND i.indisprimary = false
);

-- Check for unused indexes
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE schemaname IN ('core', 'inventory')
AND idx_scan = 0
AND indexrelname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Check for long-running queries
SELECT
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state
FROM pg_stat_activity
WHERE state != 'idle'
AND now() - pg_stat_activity.query_start > INTERVAL '5 minutes'
ORDER BY duration DESC;

-- Check for locked tables
SELECT
    t.schemaname,
    t.relname AS table_name,
    l.locktype,
    l.mode,
    l.granted,
    a.usename,
    a.query,
    a.query_start
FROM pg_locks l
JOIN pg_stat_all_tables t ON l.relation = t.relid
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE t.schemaname IN ('core', 'inventory')
AND NOT l.granted
ORDER BY a.query_start;

-- =====================================================
-- PERFORMANCE STATISTICS
-- =====================================================

-- Table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname IN ('core', 'inventory')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Most active tables
SELECT
    schemaname,
    relname,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch,
    n_tup_ins AS inserts,
    n_tup_upd AS updates,
    n_tup_del AS deletes
FROM pg_stat_user_tables
WHERE schemaname IN ('core', 'inventory')
ORDER BY (n_tup_ins + n_tup_upd + n_tup_del) DESC;

-- Cache hit ratio (should be > 99%)
SELECT
    schemaname,
    relname,
    heap_blks_read + heap_blks_hit AS total_reads,
    ROUND(100.0 * heap_blks_hit / NULLIF(heap_blks_read + heap_blks_hit, 0), 2) AS cache_hit_ratio
FROM pg_statio_user_tables
WHERE schemaname IN ('core', 'inventory')
AND (heap_blks_read + heap_blks_hit) > 0
ORDER BY cache_hit_ratio ASC;

-- =====================================================
-- BUSINESS METRICS
-- =====================================================

-- Active organizations summary
SELECT
    subscription_status,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE is_verified = true) as verified_count
FROM core.organizations
WHERE is_active = true
AND deleted_at IS NULL
GROUP BY subscription_status;

-- Module adoption
SELECT
    m.name as module,
    COUNT(DISTINCT s.organization_id) as organizations_using,
    COUNT(*) FILTER (WHERE s.status = 'trial') as trial_count,
    COUNT(*) FILTER (WHERE s.status = 'active') as active_count
FROM core.modules m
LEFT JOIN core.subscriptions s ON s.module_id = m.id
WHERE m.is_active = true
GROUP BY m.id, m.name
ORDER BY organizations_using DESC;

-- Inventory health (requires inventory module)
SELECT
    'Total Products' as metric,
    COUNT(*) as value
FROM inventory.products
WHERE deleted_at IS NULL
UNION ALL
SELECT
    'Active Warehouses',
    COUNT(*)
FROM inventory.warehouses
WHERE is_active = true AND deleted_at IS NULL
UNION ALL
SELECT
    'Total Stock Value (ZAR)',
    ROUND(SUM(s.quantity * p.cost_price)::numeric, 2)
FROM inventory.stock s
JOIN inventory.products p ON p.id = s.product_id
UNION ALL
SELECT
    'Low Stock Products',
    COUNT(DISTINCT product_id)
FROM inventory.stock_alerts
WHERE status = 'active'
UNION ALL
SELECT
    'Stock Movements (Last 7 Days)',
    COUNT(*)
FROM inventory.stock_movements
WHERE created_at > NOW() - INTERVAL '7 days'
UNION ALL
SELECT
    'Pending Purchase Orders',
    COUNT(*)
FROM inventory.purchase_orders
WHERE status IN ('pending', 'approved', 'ordered');

-- =====================================================
-- ALERT SUMMARY
-- =====================================================

-- Critical issues that need attention
DO $$
DECLARE
    expired_trials INTEGER;
    low_stock_count INTEGER;
    pending_invitations INTEGER;
    locked_tables INTEGER;
BEGIN
    -- Count expired trials
    SELECT COUNT(*) INTO expired_trials
    FROM core.organizations
    WHERE subscription_status = 'trial'
    AND trial_ends_at < NOW();

    -- Count low stock alerts
    SELECT COUNT(*) INTO low_stock_count
    FROM inventory.stock_alerts
    WHERE status = 'active';

    -- Count pending invitations
    SELECT COUNT(*) INTO pending_invitations
    FROM core.invitations
    WHERE status = 'pending'
    AND expires_at > NOW();

    -- Count locked tables
    SELECT COUNT(*) INTO locked_tables
    FROM pg_locks l
    JOIN pg_stat_all_tables t ON l.relation = t.relid
    WHERE t.schemaname IN ('core', 'inventory')
    AND NOT l.granted;

    -- Report
    RAISE NOTICE '====================================';
    RAISE NOTICE 'MAINTENANCE SUMMARY';
    RAISE NOTICE '====================================';
    RAISE NOTICE 'Expired Trials: %', expired_trials;
    RAISE NOTICE 'Low Stock Alerts: %', low_stock_count;
    RAISE NOTICE 'Pending Invitations: %', pending_invitations;
    RAISE NOTICE 'Locked Tables: %', locked_tables;
    RAISE NOTICE '====================================';

    IF expired_trials > 0 THEN
        RAISE WARNING 'Action required: % expired trial(s) need attention', expired_trials;
    END IF;

    IF locked_tables > 0 THEN
        RAISE WARNING 'Performance issue: % locked table(s) detected', locked_tables;
    END IF;
END $$;

-- =====================================================
-- COMPLETION
-- =====================================================

SELECT 'Maintenance tasks completed at ' || NOW()::text as status;
