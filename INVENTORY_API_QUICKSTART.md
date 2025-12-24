# Inventory Management API - Quick Start Guide

Get the Inventory Management API running in 5 minutes.

## Step 1: Database Setup (2 minutes)

### Option A: Using Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project (`sjbvvrjxsbqrgtpgdxwr`)
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy and paste the contents of `/lib/api/database-migration.sql`
6. Click **Run**

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Run migration
supabase db push --project-ref sjbvvrjxsbqrgtpgdxwr
```

## Step 2: Install Dependencies (30 seconds)

```bash
cd /Users/mac/Desktop/Billion/horizon-systems

# Install Zod for validation
npm install zod

# Verify existing dependencies
npm list @supabase/supabase-js  # Should be installed already
```

## Step 3: Environment Variables (1 minute)

Verify your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sjbvvrjxsbqrgtpgdxwr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
SUPABASE_SECRET_KEY=your_secret_key_here
```

## Step 4: Test the API (1 minute)

### Start Development Server

```bash
npm run dev
```

### Test Authentication

```typescript
// In browser console or Node.js
import { supabase } from '@/lib/supabase'

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'your-email@example.com',
  password: 'your-password'
})

console.log('Access Token:', data.session.access_token)
```

### Test API Endpoint

```bash
# Replace YOUR_TOKEN with the access token from above
curl -X GET "http://localhost:3000/api/v1/inventory/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "total_pages": 0
  }
}
```

## Step 5: Create Sample Data (30 seconds)

### Create a Product

```bash
curl -X POST "http://localhost:3000/api/v1/inventory/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Product",
    "sku": "SAMPLE-001",
    "description": "A sample product for testing",
    "category": "Electronics",
    "unit_price": 99.99,
    "cost_price": 50.00,
    "reorder_point": 10,
    "reorder_quantity": 50
  }'
```

### Create a Warehouse

```bash
curl -X POST "http://localhost:3000/api/v1/inventory/warehouses" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Warehouse",
    "code": "WH-001",
    "city": "Johannesburg",
    "address": "123 Main Street",
    "country": "ZA"
  }'
```

## Common Operations

### List Products with Filters

```typescript
import { listProducts } from '@/lib/api/example-usage'

const { data, meta } = await listProducts({
  page: 1,
  limit: 20,
  search: 'laptop',
  category: 'Electronics',
  lowStock: true
})
```

### Adjust Stock

```typescript
import { receiveInventory } from '@/lib/api/example-usage'

await receiveInventory(
  'product-uuid',
  'warehouse-uuid',
  100,  // quantity
  'PO-2025-001'  // reference number
)
```

### Transfer Stock

```typescript
import { transferStock } from '@/lib/api/example-usage'

await transferStock(
  'product-uuid',
  'from-warehouse-uuid',
  'to-warehouse-uuid',
  50,  // quantity
  'Monthly rebalancing'  // notes
)
```

## React Component Example

```typescript
'use client'

import { useState, useEffect } from 'react'
import { listProducts } from '@/lib/api/example-usage'

export function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await listProducts({ page: 1, limit: 20 })
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div>Loading products...</div>

  return (
    <div className="grid gap-4">
      {products.map(product => (
        <div key={product.id} className="p-4 border rounded">
          <h3 className="font-bold">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.sku}</p>
          <p className="text-lg">${product.unit_price}</p>
          <p className="text-sm">Stock: {product.current_stock}</p>
        </div>
      ))}
    </div>
  )
}
```

## Troubleshooting

### Error: "Missing or invalid authorization header"

**Solution**: Include the Bearer token in your request:
```bash
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Error: "User not associated with any organization"

**Solution**: Create organization membership in Supabase:
```sql
INSERT INTO organization_members (organization_id, user_id, role)
VALUES ('your-org-id', 'your-user-id', 'admin');
```

### Error: "Organization does not have access to inventory module"

**Solution**: Enable the inventory module:
```sql
INSERT INTO organization_subscriptions (organization_id, tier, enabled_modules, is_active)
VALUES ('your-org-id', 'professional', ARRAY['inventory'], true);
```

### Error: "Product with this SKU already exists"

**Solution**: SKUs must be unique within an organization. Use a different SKU or update the existing product.

### Error: "Cannot delete product with existing stock"

**Solution**: Products with stock cannot be deleted. Either:
- Adjust stock to zero first
- Or use soft delete (sets `is_active` to false)

## API Endpoints Quick Reference

| Endpoint | Method | Description | Role Required |
|----------|--------|-------------|---------------|
| `/api/v1/inventory/products` | GET | List products | Any |
| `/api/v1/inventory/products` | POST | Create product | admin, manager |
| `/api/v1/inventory/products/:id` | GET | Get product | Any |
| `/api/v1/inventory/products/:id` | PATCH | Update product | admin, manager |
| `/api/v1/inventory/products/:id` | DELETE | Delete product | admin |
| `/api/v1/inventory/warehouses` | GET | List warehouses | Any |
| `/api/v1/inventory/warehouses` | POST | Create warehouse | admin, manager |
| `/api/v1/inventory/warehouses/:id` | GET | Get warehouse | Any |
| `/api/v1/inventory/warehouses/:id` | PATCH | Update warehouse | admin, manager |
| `/api/v1/inventory/warehouses/:id` | DELETE | Delete warehouse | admin |
| `/api/v1/inventory/stock` | GET | List stock levels | Any |
| `/api/v1/inventory/stock/adjust` | POST | Adjust stock | admin, manager, staff |
| `/api/v1/inventory/stock/transfer` | POST | Transfer stock | admin, manager |

## Next Steps

1. **Read Full Documentation**: See `/app/api/v1/inventory/README.md`
2. **Review Examples**: See `/lib/api/example-usage.ts`
3. **Check Database Schema**: See `/lib/api/database-migration.sql`
4. **Build Frontend**: Create pages that consume these APIs
5. **Add Monitoring**: Implement logging and error tracking

## Need Help?

- Full API Documentation: `/app/api/v1/inventory/README.md`
- Code Examples: `/lib/api/example-usage.ts`
- Architecture Summary: `/INVENTORY_API_SUMMARY.md`
- Supabase Dashboard: https://supabase.com/dashboard/project/sjbvvrjxsbqrgtpgdxwr

---

**You're all set!** The Inventory Management API is now ready to use. 🚀
