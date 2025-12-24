# Inventory Module - Backend API Architecture

**Module:** Inventory Management
**Platform:** Horizon Systems Unified Platform
**Version:** 1.0
**Last Updated:** October 20, 2025

---

## Table of Contents
1. [API Structure](#api-structure)
2. [Authentication & Authorization](#authentication--authorization)
3. [Core API Endpoints](#core-api-endpoints)
4. [Real-time Updates](#real-time-updates)
5. [Background Jobs](#background-jobs)
6. [Cross-Module Integration](#cross-module-integration)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [Testing](#testing)

---

## 1. API Structure

### API Namespace
All inventory endpoints are under `/api/v1/inventory/*`

```
/api/v1/inventory/products
/api/v1/inventory/warehouses
/api/v1/inventory/stock
/api/v1/inventory/orders
/api/v1/inventory/movements
/api/v1/inventory/suppliers
/api/v1/inventory/barcodes
/api/v1/inventory/reports
```

### Shared Platform Middleware Stack
```typescript
// app/api/v1/inventory/[...route]/route.ts
export const middleware = [
  platformAuth,        // From core platform
  organizationContext, // Sets req.organization
  moduleSubscription,  // Validates inventory module access
  rateLimiter,        // Shared rate limiting
  auditLogger         // Shared audit log
]
```

### Request/Response Format
```typescript
// Standard success response
{
  success: true,
  data: { /* resource */ },
  meta: {
    timestamp: "2025-10-20T10:30:00Z",
    organizationId: "org_123",
    moduleVersion: "1.0.0"
  }
}

// Standard error response
{
  success: false,
  error: {
    code: "INVENTORY_STOCK_INSUFFICIENT",
    message: "Not enough stock for this operation",
    details: { available: 10, required: 15 }
  }
}
```

---

## 2. Authentication & Authorization

### Authentication Flow
```typescript
// Uses platform auth service
import { getPlatformSession } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getPlatformSession(request)
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify module subscription
  const hasInventoryAccess = await checkModuleAccess(
    session.organizationId,
    'inventory'
  )

  if (!hasInventoryAccess) {
    return Response.json({
      error: 'Module not subscribed'
    }, { status: 403 })
  }

  // Continue with request...
}
```

### Permission Levels
```typescript
enum InventoryPermission {
  VIEW_PRODUCTS = 'inventory.products.view',
  MANAGE_PRODUCTS = 'inventory.products.manage',
  VIEW_STOCK = 'inventory.stock.view',
  ADJUST_STOCK = 'inventory.stock.adjust',
  MANAGE_WAREHOUSES = 'inventory.warehouses.manage',
  VIEW_ORDERS = 'inventory.orders.view',
  MANAGE_ORDERS = 'inventory.orders.manage',
  VIEW_REPORTS = 'inventory.reports.view',
  ADMIN_ALL = 'inventory.admin'
}
```

---

## 3. Core API Endpoints

### Products API

#### GET /api/v1/inventory/products
List all products

```typescript
// Query params
{
  page?: number;          // Default: 1
  limit?: number;         // Default: 50, Max: 100
  search?: string;        // Full-text search
  category?: string;      // Filter by category
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'sku' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

// Response
{
  data: Product[],
  pagination: {
    page: 1,
    limit: 50,
    total: 250,
    pages: 5
  }
}
```

#### POST /api/v1/inventory/products
Create product

```typescript
// Request body
{
  name: string;
  sku: string;
  description?: string;
  category?: string;
  unitPrice: number;
  costPrice?: number;
  trackInventory: boolean;
  barcodes?: string[];
  customFields?: Record<string, any>;
}

// Emits event: 'inventory.product.created'
```

#### GET /api/v1/inventory/products/:id
Get product details

#### PATCH /api/v1/inventory/products/:id
Update product

#### DELETE /api/v1/inventory/products/:id
Soft delete product

---

### Warehouses API

#### GET /api/v1/inventory/warehouses
List warehouses

#### POST /api/v1/inventory/warehouses
Create warehouse

```typescript
{
  name: string;
  code: string;
  address: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  zones?: {
    name: string;
    code: string;
    capacity?: number;
  }[];
}
```

#### GET /api/v1/inventory/warehouses/:id/locations
Get warehouse zones/bins/racks

---

### Stock Management API

#### GET /api/v1/inventory/stock
Get stock levels across all warehouses

```typescript
// Query params
{
  productId?: string;
  warehouseId?: string;
  lowStockOnly?: boolean;
  belowReorderPoint?: boolean;
}

// Response includes real-time stock levels
{
  data: [
    {
      productId: "prod_123",
      productName: "Widget A",
      warehouseId: "wh_1",
      warehouseName: "Main Warehouse",
      quantityOnHand: 150,
      quantityReserved: 20,
      quantityAvailable: 130,
      reorderPoint: 50,
      reorderQuantity: 100,
      status: "sufficient" | "low" | "out_of_stock"
    }
  ]
}
```

#### POST /api/v1/inventory/stock/adjust
Adjust stock levels

```typescript
{
  productId: string;
  warehouseId: string;
  quantity: number;      // Positive or negative
  reason: 'received' | 'damaged' | 'lost' | 'found' | 'correction';
  notes?: string;
  referenceNumber?: string;
}

// This creates a stock_movement record automatically
// Emits event: 'inventory.stock.adjusted'
```

#### POST /api/v1/inventory/stock/transfer
Transfer stock between warehouses

```typescript
{
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  notes?: string;
}

// Creates two movements (out from source, in to destination)
// Emits event: 'inventory.stock.transferred'
```

---

### Orders API

#### POST /api/v1/inventory/orders/purchase
Create purchase order

```typescript
{
  supplierId: string;
  warehouseId: string;
  expectedDate?: string;
  items: [
    {
      productId: string;
      quantity: number;
      unitCost: number;
    }
  ],
  notes?: string;
}
```

#### POST /api/v1/inventory/orders/sales
Create sales order

```typescript
{
  customerName: string;
  customerEmail?: string;
  warehouseId: string;
  items: [
    {
      productId: string;
      quantity: number;
      unitPrice: number;
    }
  ],
  shippingAddress?: Address;
}

// Automatically reserves stock
// Emits event: 'inventory.order.created'
```

#### POST /api/v1/inventory/orders/:id/fulfill
Fulfill order

```typescript
{
  items: [
    {
      orderItemId: string;
      quantityFulfilled: number;
      binLocation?: string;
    }
  ],
  notes?: string;
}

// Updates stock, creates movements
// Emits event: 'inventory.order.fulfilled'
```

---

### Barcode API

#### GET /api/v1/inventory/barcodes/:code
Lookup product by barcode

```typescript
// Response
{
  product: Product,
  stockLevels: StockLevel[]
}
```

#### POST /api/v1/inventory/barcodes/scan
Process barcode scan with context

```typescript
{
  barcode: string;
  context: 'receiving' | 'picking' | 'adjustment' | 'lookup';
  warehouseId?: string;
  orderId?: string;
}

// Returns context-appropriate data
// For 'receiving': product details + expected PO
// For 'picking': product + pick location + order details
```

---

### Reports API

#### GET /api/v1/inventory/reports/low-stock
Low stock report

#### GET /api/v1/inventory/reports/stock-valuation
Stock valuation report

#### GET /api/v1/inventory/reports/movement-history
Stock movement history

```typescript
{
  startDate: string;
  endDate: string;
  productId?: string;
  warehouseId?: string;
  movementType?: string;
}
```

#### POST /api/v1/inventory/reports/generate
Generate custom report (async)

```typescript
{
  reportType: 'inventory_snapshot' | 'abc_analysis' | 'aging';
  parameters: Record<string, any>;
  format: 'pdf' | 'excel' | 'csv';
}

// Returns job ID for polling
// Emits event when ready: 'inventory.report.ready'
```

---

## 4. Real-time Updates

### WebSocket Events
```typescript
// Using Supabase Realtime
import { supabase } from '@/lib/supabase'

// Subscribe to stock level changes
supabase
  .channel('inventory:stock')
  .on('postgres_changes', {
    event: '*',
    schema: 'inventory',
    table: 'stock_levels',
    filter: `organization_id=eq.${orgId}`
  }, (payload) => {
    // Update UI with new stock level
  })
  .subscribe()

// Subscribe to order updates
supabase
  .channel('inventory:orders')
  .on('postgres_changes', {
    event: '*',
    schema: 'inventory',
    table: 'sales_orders',
    filter: `organization_id=eq.${orgId}`
  }, (payload) => {
    // Update order status in UI
  })
  .subscribe()
```

### Server-Sent Events (Alternative)
```typescript
// GET /api/v1/inventory/stream/stock
export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      // Set up database listener
      const subscription = setupStockListener((change) => {
        controller.enqueue(`data: ${JSON.stringify(change)}\n\n`)
      })

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        subscription.unsubscribe()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}
```

---

## 5. Background Jobs

### Job Queue Architecture
```typescript
// Using BullMQ with Redis
import { Queue } from 'bullmq'

const inventoryQueue = new Queue('inventory', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 1000,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  }
})
```

### Job Types

#### 1. Reorder Point Calculation
```typescript
// Runs daily to check stock levels
await inventoryQueue.add('calculate-reorder-points', {
  organizationId: 'org_123'
}, {
  repeat: { cron: '0 2 * * *' } // 2 AM daily
})
```

#### 2. Stock Level Sync
```typescript
// Recalculates stock levels from movements
await inventoryQueue.add('sync-stock-levels', {
  productId: 'prod_123',
  warehouseId: 'wh_1'
})
```

#### 3. Report Generation
```typescript
await inventoryQueue.add('generate-report', {
  reportType: 'inventory-snapshot',
  parameters: { warehouseId: 'wh_1' },
  format: 'pdf',
  userId: 'user_123'
})
```

#### 4. Low Stock Alerts
```typescript
await inventoryQueue.add('check-low-stock', {
  organizationId: 'org_123'
}, {
  repeat: { cron: '0 */4 * * *' } // Every 4 hours
})
```

---

## 6. Cross-Module Integration

### Event Bus Architecture
```typescript
// Shared event bus from platform
import { eventBus } from '@/lib/platform/events'

// Publish inventory events
eventBus.publish('inventory.stock.depleted', {
  productId: 'prod_123',
  warehouseId: 'wh_1',
  currentStock: 5,
  reorderPoint: 50
})

// Other modules can subscribe:
// - Analytics module tracks inventory metrics
// - Notifications module sends alerts
// - People module assigns restocking tasks
```

### Calling Other Module APIs

#### Example: Get Analytics for Stock
```typescript
// From inventory API
import { callModuleAPI } from '@/lib/platform/modules'

const stockMetrics = await callModuleAPI('analytics', {
  endpoint: '/api/v1/analytics/metrics/inventory',
  params: {
    productId: 'prod_123',
    period: '30d'
  }
})
```

#### Example: Assign Staff to Order
```typescript
// Integrate with People Management module
const assignment = await callModuleAPI('people', {
  endpoint: '/api/v1/people/tasks/assign',
  body: {
    taskType: 'inventory.picking',
    taskId: orderId,
    assignToRole: 'warehouse_picker',
    warehouseId: 'wh_1'
  }
})
```

---

## 7. Error Handling

### Error Codes
```typescript
enum InventoryErrorCode {
  // Product errors
  PRODUCT_NOT_FOUND = 'INVENTORY_PRODUCT_NOT_FOUND',
  PRODUCT_SKU_EXISTS = 'INVENTORY_PRODUCT_SKU_EXISTS',

  // Stock errors
  INSUFFICIENT_STOCK = 'INVENTORY_INSUFFICIENT_STOCK',
  STOCK_RESERVED = 'INVENTORY_STOCK_RESERVED',
  NEGATIVE_STOCK_NOT_ALLOWED = 'INVENTORY_NEGATIVE_STOCK',

  // Warehouse errors
  WAREHOUSE_NOT_FOUND = 'INVENTORY_WAREHOUSE_NOT_FOUND',
  WAREHOUSE_CAPACITY_EXCEEDED = 'INVENTORY_CAPACITY_EXCEEDED',

  // Order errors
  ORDER_NOT_FOUND = 'INVENTORY_ORDER_NOT_FOUND',
  ORDER_ALREADY_FULFILLED = 'INVENTORY_ORDER_FULFILLED',
  ORDER_CANCELLED = 'INVENTORY_ORDER_CANCELLED',

  // Permission errors
  INSUFFICIENT_PERMISSIONS = 'INVENTORY_INSUFFICIENT_PERMISSIONS',
  MODULE_NOT_SUBSCRIBED = 'INVENTORY_MODULE_NOT_SUBSCRIBED'
}
```

### Error Response Handler
```typescript
export class InventoryError extends Error {
  constructor(
    public code: InventoryErrorCode,
    public message: string,
    public details?: any
  ) {
    super(message)
  }
}

export function handleInventoryError(error: unknown) {
  if (error instanceof InventoryError) {
    return Response.json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    }, { status: getStatusCode(error.code) })
  }

  // Log unexpected errors
  console.error('Unexpected inventory error:', error)

  return Response.json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  }, { status: 500 })
}
```

---

## 8. Rate Limiting

### Rate Limit Strategy
```typescript
// Shared with platform
import { rateLimit } from '@/lib/platform/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
})

export async function GET(request: Request) {
  const { organizationId } = await getPlatformSession(request)

  try {
    await limiter.check(request, 100, organizationId) // 100 req/min
  } catch {
    return Response.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }

  // Continue...
}
```

### Tier-based Limits
```typescript
const RATE_LIMITS = {
  free: { requestsPerMinute: 60, requestsPerDay: 1000 },
  pro: { requestsPerMinute: 300, requestsPerDay: 10000 },
  enterprise: { requestsPerMinute: 1000, requestsPerDay: 100000 }
}
```

---

## 9. Testing

### API Testing Structure
```typescript
// __tests__/api/inventory/products.test.ts
describe('Inventory Products API', () => {
  beforeEach(async () => {
    await setupTestDatabase()
    await createTestOrganization()
    await subscribeToInventoryModule()
  })

  describe('GET /api/v1/inventory/products', () => {
    it('returns products for authenticated user', async () => {
      const response = await request(app)
        .get('/api/v1/inventory/products')
        .set('Authorization', `Bearer ${testToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data).toBeInstanceOf(Array)
    })

    it('enforces multi-tenancy', async () => {
      const org1Product = await createProduct({ orgId: 'org1' })
      const org2Token = await getTokenForOrg('org2')

      const response = await request(app)
        .get(`/api/v1/inventory/products/${org1Product.id}`)
        .set('Authorization', `Bearer ${org2Token}`)

      expect(response.status).toBe(404) // Should not see other org's data
    })
  })
})
```

### Integration Testing
```typescript
// Test cross-module integration
describe('Cross-module Integration', () => {
  it('publishes event when stock depleted', async () => {
    const eventSpy = jest.spyOn(eventBus, 'publish')

    await request(app)
      .post('/api/v1/inventory/stock/adjust')
      .send({
        productId: 'prod_123',
        warehouseId: 'wh_1',
        quantity: -100, // Brings stock below reorder point
        reason: 'sale'
      })

    expect(eventSpy).toHaveBeenCalledWith(
      'inventory.stock.depleted',
      expect.objectContaining({
        productId: 'prod_123'
      })
    )
  })
})
```

---

## Summary

This backend API architecture:

✅ Integrates seamlessly with the unified Horizon Systems platform
✅ Shares authentication, rate limiting, and audit logging
✅ Uses consistent API patterns across all modules
✅ Supports real-time updates via WebSockets
✅ Implements robust error handling and validation
✅ Enables cross-module communication via event bus
✅ Includes background job processing for async operations
✅ Follows REST best practices with clear documentation
✅ Comprehensive testing strategy included

**Next Steps:**
1. Implement core endpoints (Products, Warehouses, Stock)
2. Set up background job workers
3. Configure event bus subscriptions
4. Add comprehensive API tests
5. Document API with OpenAPI/Swagger
