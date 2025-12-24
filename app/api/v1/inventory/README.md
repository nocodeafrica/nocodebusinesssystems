# Inventory Management API Documentation

Production-ready REST API for the Inventory Management module in Horizon Systems.

## Overview

This API provides complete inventory management capabilities including:
- Product management (CRUD operations)
- Warehouse management (CRUD operations)
- Stock level tracking and monitoring
- Stock adjustments (purchases, sales, damages, etc.)
- Inter-warehouse stock transfers

## Base URL

```
https://your-domain.com/api/v1/inventory
```

## Authentication

All endpoints require authentication via Bearer token.

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Obtaining Access Token

Users authenticate through Supabase Auth and receive a JWT token. Include this token in all API requests.

```typescript
// Client-side authentication
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

const accessToken = data.session.access_token
```

## Authorization

Access is controlled via:
1. **Module subscription**: Organization must have 'inventory' module enabled
2. **Role-based access**: Different endpoints require different roles
   - `admin`: Full access (create, read, update, delete)
   - `manager`: Create, read, update
   - `staff`: Read, stock adjustments
   - `viewer`: Read-only access

## API Endpoints

### Products

#### List Products
```http
GET /api/v1/inventory/products
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `search` (string) - Search in name, SKU, description
- `category` (string) - Filter by category
- `is_active` (boolean) - Filter by active status
- `low_stock` (boolean) - Show products below reorder point
- `sort_by` (string, default: 'created_at') - Sort field
- `sort_order` ('asc' | 'desc', default: 'asc') - Sort direction

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "organization_id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "sku": "SKU-001",
      "barcode": "1234567890",
      "category": "Electronics",
      "unit_price": 99.99,
      "cost_price": 50.00,
      "reorder_point": 10,
      "reorder_quantity": 50,
      "unit_of_measure": "unit",
      "is_active": true,
      "current_stock": 150,
      "created_at": "2025-01-20T10:00:00Z",
      "updated_at": "2025-01-20T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

#### Create Product
```http
POST /api/v1/inventory/products
```

**Required Role:** `admin`, `manager`

**Request Body:**
```json
{
  "name": "Product Name",
  "sku": "SKU-001",
  "description": "Product description",
  "category": "Electronics",
  "unit_price": 99.99,
  "cost_price": 50.00,
  "reorder_point": 10,
  "reorder_quantity": 50,
  "unit_of_measure": "unit",
  "is_active": true,
  "metadata": {}
}
```

**Response:** `201 Created`

#### Get Product
```http
GET /api/v1/inventory/products/:id
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "stock_levels": [
      {
        "warehouse_id": "uuid",
        "warehouses": {
          "id": "uuid",
          "name": "Main Warehouse",
          "code": "WH-001"
        },
        "quantity": 100
      }
    ],
    "total_stock": 250,
    ...
  }
}
```

#### Update Product
```http
PATCH /api/v1/inventory/products/:id
```

**Required Role:** `admin`, `manager`

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "unit_price": 109.99,
  "is_active": false
}
```

#### Delete Product
```http
DELETE /api/v1/inventory/products/:id
```

**Required Role:** `admin`

Soft deletes the product (sets `is_active` to false). Cannot delete products with existing stock.

---

### Warehouses

#### List Warehouses
```http
GET /api/v1/inventory/warehouses
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `search` (string) - Search in name, code, address
- `city` (string) - Filter by city
- `state` (string) - Filter by state/province
- `is_active` (boolean) - Filter by active status
- `sort_by` (string, default: 'created_at')
- `sort_order` ('asc' | 'desc', default: 'asc')

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Main Warehouse",
      "code": "WH-001",
      "address": "123 Main St",
      "city": "Johannesburg",
      "state": "Gauteng",
      "postal_code": "2000",
      "country": "ZA",
      "latitude": -26.2041,
      "longitude": 28.0473,
      "manager_name": "John Doe",
      "manager_email": "john@example.com",
      "total_products": 150,
      "total_stock_value": 125000.50,
      "is_active": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "total_pages": 1
  }
}
```

#### Create Warehouse
```http
POST /api/v1/inventory/warehouses
```

**Required Role:** `admin`, `manager`

**Request Body:**
```json
{
  "name": "Main Warehouse",
  "code": "WH-001",
  "address": "123 Main St",
  "city": "Johannesburg",
  "state": "Gauteng",
  "postal_code": "2000",
  "country": "ZA",
  "latitude": -26.2041,
  "longitude": 28.0473,
  "manager_name": "John Doe",
  "manager_email": "john@example.com",
  "manager_phone": "+27123456789",
  "capacity_sqm": 5000,
  "is_active": true
}
```

#### Get Warehouse
```http
GET /api/v1/inventory/warehouses/:id
```

Returns warehouse with stock summary and top products.

#### Update Warehouse
```http
PATCH /api/v1/inventory/warehouses/:id
```

**Required Role:** `admin`, `manager`

#### Delete Warehouse
```http
DELETE /api/v1/inventory/warehouses/:id
```

**Required Role:** `admin`

Cannot delete warehouses with existing stock.

---

### Stock Levels

#### List Stock
```http
GET /api/v1/inventory/stock
```

**Query Parameters:**
- `page`, `limit`, `search`, `sort_by`, `sort_order` (same as above)
- `product_id` (uuid) - Filter by specific product
- `warehouse_id` (uuid) - Filter by specific warehouse
- `low_stock` (boolean) - Show items below reorder point
- `out_of_stock` (boolean) - Show items with zero quantity

**Response:**
```json
{
  "data": [
    {
      "product_id": "uuid",
      "product_name": "Product A",
      "product_sku": "SKU-001",
      "warehouse_id": "uuid",
      "warehouse_name": "Main Warehouse",
      "warehouse_code": "WH-001",
      "quantity": 100,
      "reorder_point": 50,
      "unit_price": 99.99,
      "total_value": 9999.00,
      "is_low_stock": false,
      "is_out_of_stock": false,
      "last_updated": "2025-01-20T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "total_pages": 25,
    "summary": {
      "total_products": 150,
      "total_warehouses": 5,
      "low_stock_count": 12,
      "out_of_stock_count": 3
    }
  }
}
```

#### Adjust Stock
```http
POST /api/v1/inventory/stock/adjust
```

**Required Role:** `admin`, `manager`, `staff`

Add or remove inventory with audit logging.

**Request Body:**
```json
{
  "product_id": "uuid",
  "warehouse_id": "uuid",
  "quantity_change": -10,
  "reason": "damage",
  "notes": "Damaged goods removed from inventory",
  "reference_number": "ADJ-2025-001"
}
```

**Reasons:**
- `purchase` - New stock received
- `sale` - Sold to customer
- `return` - Customer return
- `damage` - Damaged goods
- `loss` - Lost/stolen inventory
- `found` - Found inventory
- `adjustment` - Manual correction
- `transfer` - Inter-warehouse transfer

**Response:**
```json
{
  "data": {
    "adjustment_id": "uuid",
    "product_id": "uuid",
    "warehouse_id": "uuid",
    "previous_quantity": 100,
    "quantity_change": -10,
    "new_quantity": 90,
    "reason": "damage",
    "adjusted_at": "2025-01-20T10:00:00Z",
    "adjusted_by": "user_id"
  }
}
```

#### Transfer Stock
```http
POST /api/v1/inventory/stock/transfer
```

**Required Role:** `admin`, `manager`

Transfer stock between warehouses with full audit trail.

**Request Body:**
```json
{
  "product_id": "uuid",
  "from_warehouse_id": "uuid",
  "to_warehouse_id": "uuid",
  "quantity": 50,
  "notes": "Monthly stock rebalancing",
  "scheduled_date": "2025-01-25T10:00:00Z"
}
```

**Response:**
```json
{
  "data": {
    "transfer_id": "uuid",
    "product_id": "uuid",
    "product_name": "Product A",
    "from_warehouse": {
      "id": "uuid",
      "name": "Main Warehouse",
      "previous_quantity": 150,
      "new_quantity": 100
    },
    "to_warehouse": {
      "id": "uuid",
      "name": "Branch Warehouse",
      "previous_quantity": 20,
      "new_quantity": 70
    },
    "quantity": 50,
    "status": "completed",
    "transferred_at": "2025-01-20T10:00:00Z"
  }
}
```

---

## Error Responses

All errors follow a standard format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {},
    "timestamp": "2025-01-20T10:00:00Z",
    "path": "/api/v1/inventory/products"
  }
}
```

### Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | `BAD_REQUEST` | Invalid request format |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource conflict (duplicate) |
| 422 | `VALIDATION_ERROR` | Validation failed |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Rate Limiting

- **Default:** 100 requests per minute per user
- Rate limit headers included in response:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Database Schema Requirements

The API expects the following Supabase tables:

### `products`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100) NOT NULL,
  barcode VARCHAR(100),
  category VARCHAR(100),
  unit_price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2),
  reorder_point INTEGER DEFAULT 10,
  reorder_quantity INTEGER DEFAULT 50,
  unit_of_measure VARCHAR(50) DEFAULT 'unit',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, sku)
);
```

### `warehouses`
```sql
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
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
  metadata JSONB,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(organization_id, code)
);
```

### `stock_levels`
```sql
CREATE TABLE stock_levels (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (product_id, warehouse_id)
);
```

### `stock_adjustments`
```sql
CREATE TABLE stock_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  previous_quantity INTEGER NOT NULL,
  quantity_change INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason VARCHAR(50) NOT NULL,
  notes TEXT,
  reference_number VARCHAR(100),
  adjusted_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `stock_transfers`
```sql
CREATE TABLE stock_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  product_id UUID NOT NULL REFERENCES products(id),
  from_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  to_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  quantity INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  notes TEXT,
  scheduled_date TIMESTAMPTZ,
  transferred_by UUID NOT NULL REFERENCES auth.users(id),
  transferred_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Example Usage

### JavaScript/TypeScript Client

```typescript
import { supabase } from '@/lib/supabase'

// Get access token
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

// List products
const response = await fetch('/api/v1/inventory/products?page=1&limit=20', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

const { data, meta } = await response.json()

// Create product
const newProduct = await fetch('/api/v1/inventory/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Product',
    sku: 'SKU-001',
    unit_price: 99.99,
    reorder_point: 10
  })
})

// Adjust stock
await fetch('/api/v1/inventory/stock/adjust', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    product_id: 'uuid',
    warehouse_id: 'uuid',
    quantity_change: -5,
    reason: 'sale',
    notes: 'Order #12345'
  })
})
```

---

## Testing

Use the provided test collection or cURL commands:

```bash
# List products
curl -X GET "https://your-domain.com/api/v1/inventory/products" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create product
curl -X POST "https://your-domain.com/api/v1/inventory/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "sku": "TEST-001",
    "unit_price": 99.99
  }'
```

---

## Support

For issues or questions:
- GitHub Issues: [horizon-systems/issues](https://github.com/your-org/horizon-systems/issues)
- Documentation: [docs.horizon-systems.com](https://docs.horizon-systems.com)
- Email: support@horizon-systems.com
