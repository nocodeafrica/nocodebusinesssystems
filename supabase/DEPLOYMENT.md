# Database Deployment Guide

Step-by-step guide for deploying the Horizon Systems database to production.

## 📋 Prerequisites

- Supabase account with active project
- Supabase CLI installed (`npm install -g supabase`)
- Database credentials and access
- Backup of any existing data

## 🚀 Deployment Steps

### Step 1: Prepare Environment

```bash
# Navigate to project directory
cd /Users/mac/Desktop/Billion/horizon-systems

# Verify Supabase CLI installation
supabase --version

# Login to Supabase
supabase login
```

### Step 2: Link to Project

```bash
# Link to your Supabase project
supabase link --project-ref sjbvvrjxsbqrgtpgdxwr

# Verify connection
supabase db remote --linked
```

### Step 3: Review Migrations

```bash
# List migration files
ls -l supabase/migrations/

# Expected files:
# 00001_create_core_schema.sql
# 00002_create_inventory_schema.sql
```

### Step 4: Apply Migrations (PRODUCTION)

**Option A: Using Supabase Dashboard (Recommended for First Deploy)**

1. Login to https://supabase.com/dashboard
2. Navigate to your project (sjbvvrjxsbqrgtpgdxwr)
3. Go to SQL Editor
4. Open and run `00001_create_core_schema.sql`
5. Wait for completion (check for errors)
6. Open and run `00002_create_inventory_schema.sql`
7. Wait for completion
8. Verify tables in Table Editor

**Option B: Using Supabase CLI**

```bash
# Apply all migrations
supabase db push

# Or apply individually
supabase db execute --file supabase/migrations/00001_create_core_schema.sql
supabase db execute --file supabase/migrations/00002_create_inventory_schema.sql
```

**Option C: Using psql**

```bash
# Connect to database
psql "postgresql://postgres:[password]@db.sjbvvrjxsbqrgtpgdxwr.supabase.co:5432/postgres"

# Run migrations
\i supabase/migrations/00001_create_core_schema.sql
\i supabase/migrations/00002_create_inventory_schema.sql

# Verify
\dn  -- List schemas
\dt core.*  -- List core tables
\dt inventory.*  -- List inventory tables
```

### Step 5: Load Seed Data (Optional - Development Only)

⚠️ **WARNING:** Only run seed data in development/staging environments!

```bash
# Load sample data
supabase db execute --file supabase/seed.sql

# Or via psql
psql "..." < supabase/seed.sql
```

### Step 6: Verify Deployment

```sql
-- Run verification queries in SQL Editor

-- 1. Check schemas exist
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name IN ('core', 'inventory');

-- 2. Count tables
SELECT
    schemaname,
    COUNT(*) as table_count
FROM pg_tables
WHERE schemaname IN ('core', 'inventory')
GROUP BY schemaname;

-- 3. Verify RLS is enabled
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname IN ('core', 'inventory')
ORDER BY schemaname, tablename;

-- 4. Check functions exist
SELECT
    n.nspname as schema,
    p.proname as function_name
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname IN ('core', 'inventory')
ORDER BY schema, function_name;

-- 5. Verify indexes
SELECT
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname IN ('core', 'inventory')
ORDER BY schemaname, tablename;
```

### Step 7: Configure Application

```bash
# Update .env.production
NEXT_PUBLIC_SUPABASE_URL=https://sjbvvrjxsbqrgtpgdxwr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key

# Use pooled connection for application
DATABASE_URL=postgresql://postgres:[password]@db.sjbvvrjxsbqrgtpgdxwr.supabase.co:6543/postgres
```

### Step 8: Create Initial Organization

```sql
-- In Supabase SQL Editor
INSERT INTO core.organizations (
    name,
    slug,
    email,
    industry,
    size,
    subscription_status,
    trial_ends_at,
    billing_cycle,
    is_active,
    is_verified
) VALUES (
    'Your Company Name',
    'your-company',
    'admin@yourcompany.com',
    'Technology',
    'small',
    'trial',
    NOW() + INTERVAL '14 days',
    'monthly',
    true,
    true
)
RETURNING id;
```

### Step 9: Subscribe to Modules

```sql
-- Subscribe to inventory module
INSERT INTO core.subscriptions (
    organization_id,
    module_id,
    status,
    billing_cycle,
    price_per_cycle,
    currency,
    trial_ends_at,
    started_at
)
SELECT
    '[your-org-id]',
    id,
    'trial',
    'monthly',
    base_price_monthly,
    'ZAR',
    NOW() + INTERVAL '14 days',
    NOW()
FROM core.modules
WHERE code = 'inventory';
```

### Step 10: Create Admin User

```bash
# 1. Sign up via Supabase Auth UI or API
# 2. Get the auth user UUID
# 3. Create user record
```

```sql
INSERT INTO core.users (
    id,
    organization_id,
    first_name,
    last_name,
    email,
    role,
    status,
    job_title
) VALUES (
    '[auth-user-uuid]',
    '[your-org-id]',
    'Admin',
    'User',
    'admin@yourcompany.com',
    'org_admin',
    'active',
    'System Administrator'
);
```

## ✅ Post-Deployment Checklist

- [ ] All schemas created successfully
- [ ] All tables exist with correct columns
- [ ] RLS policies enabled on all tables
- [ ] Functions and triggers working
- [ ] Indexes created
- [ ] Initial organization created
- [ ] Admin user created and can login
- [ ] Test queries return expected results
- [ ] Connection pooling configured
- [ ] Environment variables set
- [ ] Backup schedule configured
- [ ] Monitoring enabled
- [ ] Alert rules configured

## 🔍 Testing RLS Policies

```sql
-- Set user context
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "[user-uuid]"}';

-- Test queries (should only return user's org data)
SELECT * FROM core.organizations;
SELECT * FROM inventory.products;
SELECT * FROM inventory.stock;

-- Reset
RESET role;
RESET request.jwt.claims;
```

## 📊 Set Up Monitoring

### Enable Query Logging

```sql
-- Log slow queries (> 1 second)
ALTER DATABASE postgres SET log_min_duration_statement = 1000;

-- Log all DDL statements
ALTER DATABASE postgres SET log_statement = 'ddl';
```

### Create Monitoring Views

```sql
-- Active connections monitor
CREATE OR REPLACE VIEW monitoring.active_connections AS
SELECT
    datname,
    usename,
    application_name,
    state,
    COUNT(*) as connection_count
FROM pg_stat_activity
WHERE datname = 'postgres'
GROUP BY datname, usename, application_name, state;

-- Table size monitor
CREATE OR REPLACE VIEW monitoring.table_sizes AS
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_total_relation_size(schemaname||'.'||tablename) AS total_bytes
FROM pg_tables
WHERE schemaname IN ('core', 'inventory')
ORDER BY total_bytes DESC;
```

### Set Up Alerts (via Supabase Dashboard)

1. **Database CPU > 80%** for 5 minutes
2. **Connection count > 80%** of limit
3. **Disk usage > 85%**
4. **Slow query detected** (> 5 seconds)

## 🔄 Backup Strategy

### Automated Backups

Supabase provides automatic daily backups. Verify:

1. Go to Project Settings > Database
2. Check "Database Backups" section
3. Verify daily backups enabled
4. Note retention period (7 days for free tier)

### Manual Backup

```bash
# Backup entire database
supabase db dump -f backup-$(date +%Y%m%d).sql

# Backup specific schema
pg_dump -h db.sjbvvrjxsbqrgtpgdxwr.supabase.co \
  -U postgres \
  -n core \
  -n inventory \
  -f schemas-backup-$(date +%Y%m%d).sql
```

### Restore from Backup

```bash
# Reset database (DANGER!)
supabase db reset

# Or restore specific backup
psql "..." < backup-20251020.sql
```

## 🚨 Rollback Procedure

If deployment fails:

```bash
# Option 1: Using rollback script
supabase db execute --file supabase/rollback.sql

# Option 2: Restore from backup
supabase db reset
# Then restore from backup file

# Option 3: Point-in-time recovery (paid plans)
# Contact Supabase support
```

## 📈 Performance Optimization

```sql
-- Run after initial deployment
ANALYZE;

-- Create additional indexes if needed
CREATE INDEX CONCURRENTLY idx_custom_field
ON inventory.products(organization_id, (custom_fields->>'field_name'));

-- Vacuum to reclaim space
VACUUM ANALYZE;
```

## 🔐 Security Hardening

```sql
-- Revoke public access
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- Ensure RLS is enforced
SELECT tablename
FROM pg_tables
WHERE schemaname IN ('core', 'inventory')
AND rowsecurity = false;

-- Should return no rows

-- Audit user permissions
SELECT
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema IN ('core', 'inventory')
ORDER BY grantee, table_schema, table_name;
```

## 📞 Troubleshooting

### Common Issues

**Issue: Migration fails with "schema already exists"**
```sql
-- Drop schema and retry
DROP SCHEMA IF EXISTS core CASCADE;
DROP SCHEMA IF EXISTS inventory CASCADE;
-- Then re-run migrations
```

**Issue: RLS blocks all queries**
```sql
-- Temporarily disable RLS for debugging
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
-- Debug queries
-- Re-enable when done
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

**Issue: Connection timeout**
- Check Supabase project is active (not paused)
- Verify connection string is correct
- Check IP whitelist settings
- Use pooled connection (port 6543)

## 📚 Additional Resources

- [supabase/README.md](./README.md) - Complete schema documentation
- [supabase/QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Common queries
- [supabase/CONNECTION_POOLING.md](./CONNECTION_POOLING.md) - Pooling guide
- [supabase/maintenance.sql](./maintenance.sql) - Maintenance tasks

## 🎉 Success!

Your database is now deployed and ready for production use!

Next steps:
1. Connect your Next.js application
2. Test user signup and authentication
3. Test core functionality
4. Monitor performance
5. Set up CI/CD for future migrations

---

**Deployment Date:** [Fill in]
**Deployed By:** [Fill in]
**Environment:** Production
**Project:** Horizon Systems
