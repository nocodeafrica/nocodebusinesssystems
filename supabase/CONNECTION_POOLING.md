# Database Connection Pooling Guide

Configuration guide for connection pooling and database optimization for production deployments.

## 🎯 Overview

Connection pooling is essential for production applications to:
- Reduce connection overhead
- Handle high concurrent user loads
- Prevent connection exhaustion
- Improve response times

## 🔧 Supabase Built-in Pooling

Supabase provides **PgBouncer** connection pooling out of the box.

### Connection Strings

```bash
# Direct connection (for migrations, admin tasks)
postgresql://postgres:[password]@db.sjbvvrjxsbqrgtpgdxwr.supabase.co:5432/postgres

# Pooled connection (for application) - Transaction mode
postgresql://postgres:[password]@db.sjbvvrjxsbqrgtpgdxwr.supabase.co:6543/postgres

# Pooled connection - Session mode
postgresql://postgres:[password]@db.sjbvvrjxsbqrgtpgdxwr.supabase.co:5432/postgres?pgbouncer=true
```

### When to Use Each Mode

**Direct Connection (Port 5432)**
- Database migrations
- Schema changes
- Bulk data imports
- Administrative tasks
- Long-running analytics queries

**Transaction Mode (Port 6543)**
- Web applications (Next.js, React)
- API endpoints
- Short-lived queries
- High concurrency scenarios
- Most production use cases

**Session Mode**
- When you need prepared statements
- Connection-level settings
- Temporary tables within session

## 📝 Next.js Configuration

### Environment Variables

```env
# .env.local

# For Supabase client (browser & API routes)
NEXT_PUBLIC_SUPABASE_URL=https://sjbvvrjxsbqrgtpgdxwr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

# For server-side direct database access (use pooler)
DATABASE_URL=postgresql://postgres:[password]@db.sjbvvrjxsbqrgtpgdxwr.supabase.co:6543/postgres

# For migrations (use direct connection)
DIRECT_DATABASE_URL=postgresql://postgres:[password]@db.sjbvvrjxsbqrgtpgdxwr.supabase.co:5432/postgres
```

### Supabase Client Setup

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

// Client-side and server-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'horizon-systems'
    }
  }
})

// Server-only client with service role (admin access)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

### Direct Database Connection (Optional)

For complex queries or when you need direct PostgreSQL access:

```typescript
// lib/db.ts
import { Pool } from 'pg'

// Use connection pooling for production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start

  console.log('Executed query', { text, duration, rows: res.rowCount })
  return res
}

export default pool
```

## ⚙️ Connection Pool Settings

### Recommended Settings by Environment

**Development**
```javascript
{
  max: 5,                    // Max connections
  min: 1,                    // Min idle connections
  idleTimeoutMillis: 30000,  // 30 seconds
  connectionTimeoutMillis: 2000
}
```

**Staging**
```javascript
{
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
}
```

**Production**
```javascript
{
  max: 100,                  // Adjust based on your plan
  min: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  allowExitOnIdle: false
}
```

### Calculating Pool Size

Formula: `connections = ((core_count * 2) + effective_spindle_count)`

For most web apps:
- **Small**: 20-50 connections
- **Medium**: 50-100 connections
- **Large**: 100-200 connections

Check your Supabase plan limits!

## 🚀 Performance Best Practices

### 1. Use Prepared Statements

```typescript
// Bad - SQL injection risk, no caching
await pool.query(`SELECT * FROM products WHERE id = ${productId}`)

// Good - Safe and cacheable
await pool.query('SELECT * FROM products WHERE id = $1', [productId])
```

### 2. Connection Reuse

```typescript
// Bad - Opens new connection each time
async function getUser(id: string) {
  const client = await pool.connect()
  const result = await client.query('SELECT * FROM users WHERE id = $1', [id])
  client.release()
  return result.rows[0]
}

// Good - Use pool directly for simple queries
async function getUser(id: string) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return result.rows[0]
}

// Best for transactions - Explicit client checkout
async function createOrder(orderData: any) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const orderResult = await client.query(
      'INSERT INTO orders (...) VALUES (...) RETURNING id',
      [orderData]
    )

    await client.query(
      'INSERT INTO order_items (...) VALUES (...)',
      [orderResult.rows[0].id, ...]
    )

    await client.query('COMMIT')
    return orderResult.rows[0]
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
```

### 3. Batch Operations

```typescript
// Bad - Multiple round trips
for (const product of products) {
  await pool.query('INSERT INTO products VALUES (...)', [product])
}

// Good - Single batch insert
const values = products.map((p, i) =>
  `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`
).join(',')

await pool.query(
  `INSERT INTO products (name, price, sku) VALUES ${values}`,
  products.flatMap(p => [p.name, p.price, p.sku])
)
```

### 4. Use Indexes Effectively

```sql
-- Check for missing indexes
SELECT
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname IN ('core', 'inventory')
AND n_distinct > 100
ORDER BY abs(correlation) ASC;

-- Create indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_products_organization_sku
ON inventory.products(organization_id, sku);

CREATE INDEX CONCURRENTLY idx_stock_warehouse_product
ON inventory.stock(warehouse_id, product_id)
INCLUDE (available_quantity);
```

## 📊 Monitoring Connection Pool

### Pool Stats Query

```sql
SELECT
    datname,
    numbackends as connections,
    xact_commit as transactions,
    xact_rollback as rollbacks,
    blks_read,
    blks_hit,
    tup_returned,
    tup_fetched,
    tup_inserted,
    tup_updated,
    tup_deleted
FROM pg_stat_database
WHERE datname = 'postgres';
```

### Active Connections

```sql
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query,
    state_change
FROM pg_stat_activity
WHERE datname = 'postgres'
ORDER BY state_change DESC;
```

### Connection Pool Usage

```sql
SELECT
    state,
    COUNT(*) as count
FROM pg_stat_activity
WHERE datname = 'postgres'
GROUP BY state;
```

### Identify Long-Running Queries

```sql
SELECT
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state,
    wait_event_type,
    wait_event
FROM pg_stat_activity
WHERE state = 'active'
AND now() - pg_stat_activity.query_start > interval '1 minute'
ORDER BY duration DESC;
```

## 🔧 Troubleshooting

### Issue: Too Many Connections

**Symptoms:**
- `FATAL: sorry, too many clients already`
- Slow response times
- Connection timeouts

**Solutions:**

1. **Use connection pooling** (PgBouncer via port 6543)
2. **Reduce max pool size** in application
3. **Close idle connections**:
```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'postgres'
AND state = 'idle'
AND state_change < now() - interval '5 minutes';
```
4. **Upgrade Supabase plan** for more connections

### Issue: Slow Queries

**Solutions:**

1. **Enable query logging**:
```sql
ALTER DATABASE postgres SET log_min_duration_statement = 1000;
```

2. **Analyze query plan**:
```sql
EXPLAIN ANALYZE
SELECT * FROM inventory.products
WHERE organization_id = 'uuid'
AND deleted_at IS NULL;
```

3. **Add missing indexes** (see recommendations above)

### Issue: Connection Leaks

**Detection:**
```typescript
// Monitor pool
pool.on('connect', () => {
  console.log('Connection established')
})

pool.on('remove', () => {
  console.log('Connection removed')
})

pool.on('error', (err) => {
  console.error('Pool error:', err)
})
```

**Prevention:**
- Always use `try/finally` with `client.release()`
- Set `idleTimeoutMillis` to automatically close idle connections
- Use monitoring to track connection count

## 🏗️ Production Checklist

- [ ] Use pooled connection string (port 6543)
- [ ] Set appropriate max connections for your plan
- [ ] Enable connection timeouts
- [ ] Implement query timeout handling
- [ ] Add database monitoring/alerting
- [ ] Set up query performance monitoring
- [ ] Configure automatic failover (if available)
- [ ] Document RTO/RPO requirements
- [ ] Test connection pool under load
- [ ] Plan for scaling (vertical and horizontal)

## 📈 Scaling Strategies

### Vertical Scaling
- Upgrade Supabase plan for more resources
- Increase connection limits
- Add more CPU/RAM to database

### Horizontal Scaling
- Read replicas for read-heavy workloads
- Caching layer (Redis) for frequently accessed data
- CDN for static content
- Load balancer for API servers

### Application-Level Optimizations
```typescript
// 1. Implement caching
import { LRUCache } from 'lru-cache'

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
})

async function getProduct(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const result = await pool.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  )
  cache.set(id, result.rows[0])
  return result.rows[0]
}

// 2. Debounce expensive operations
import { debounce } from 'lodash'

const checkLowStock = debounce(async () => {
  await pool.query('SELECT inventory.check_low_stock()')
}, 60000) // Run at most once per minute

// 3. Use data pagination
async function getProducts(page = 1, limit = 50) {
  const offset = (page - 1) * limit
  return pool.query(
    'SELECT * FROM products LIMIT $1 OFFSET $2',
    [limit, offset]
  )
}
```

## 🔐 Security Considerations

- Never commit connection strings to version control
- Use environment variables for all credentials
- Rotate database passwords regularly
- Use SSL/TLS for all connections
- Implement IP whitelisting if possible
- Use Supabase RLS policies for data access
- Audit database access logs regularly
- Set up alerts for unusual connection patterns

## 📞 Support Resources

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [PgBouncer Documentation](https://www.pgbouncer.org/usage.html)
- [PostgreSQL Connection Pool Tuning](https://wiki.postgresql.org/wiki/Number_Of_Database_Connections)

---

**Last Updated:** 2025-10-20
**Maintained By:** Horizon Systems DevOps Team
