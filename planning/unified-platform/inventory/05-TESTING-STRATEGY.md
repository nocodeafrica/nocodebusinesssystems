# Inventory Module - Testing Strategy

**Module:** Inventory Management
**Platform:** Horizon Systems Unified Platform
**Version:** 1.0
**Last Updated:** October 20, 2025

---

## Table of Contents
1. [Testing Infrastructure](#testing-infrastructure)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [E2E Testing](#e2e-testing)
5. [Multi-Tenancy Testing](#multi-tenancy-testing)
6. [Performance Testing](#performance-testing)
7. [Mobile Testing](#mobile-testing)
8. [Regression Testing](#regression-testing)
9. [Test Data Management](#test-data-management)
10. [CI/CD Integration](#cicd-integration)

---

## 1. Testing Infrastructure

### Test Database Setup
```typescript
// tests/setup/database.ts
import { createClient } from '@supabase/supabase-js'

const TEST_SUPABASE_URL = process.env.TEST_SUPABASE_URL!
const TEST_SUPABASE_KEY = process.env.TEST_SUPABASE_ANON_KEY!

export const testSupabase = createClient(
  TEST_SUPABASE_URL,
  TEST_SUPABASE_KEY
)

export async function setupTestDatabase() {
  // Run migrations
  await runMigrations(testSupabase)

  // Seed core schema (organizations, users)
  await seedCoreData()

  // Seed inventory schema
  await seedInventoryData()
}

export async function teardownTestDatabase() {
  // Clean up test data
  await testSupabase.from('inventory.stock_levels').delete().neq('id', '')
  await testSupabase.from('inventory.products').delete().neq('id', '')
  await testSupabase.from('core.organizations').delete().neq('id', '')
}
```

### Test Organizations
```typescript
// tests/fixtures/organizations.ts
export const TEST_ORGS = {
  org1: {
    id: 'test-org-1',
    name: 'Test Organization 1',
    subscriptions: ['inventory', 'analytics']
  },
  org2: {
    id: 'test-org-2',
    name: 'Test Organization 2',
    subscriptions: ['inventory']
  },
  orgWithoutInventory: {
    id: 'test-org-3',
    name: 'Test Organization 3',
    subscriptions: ['analytics'] // No inventory module
  }
}
```

### Shared Test Utilities
```typescript
// tests/utils/api.ts
export async function apiRequest(
  method: string,
  path: string,
  options: {
    body?: any
    organizationId?: string
    userId?: string
  } = {}
) {
  const token = await generateTestToken({
    organizationId: options.organizationId || TEST_ORGS.org1.id,
    userId: options.userId || 'test-user-1'
  })

  return fetch(`http://localhost:3000${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  })
}
```

---

## 2. Unit Testing

### API Route Tests
```typescript
// app/api/v1/inventory/products/route.test.ts
import { GET, POST } from './route'
import { NextRequest } from 'next/server'

describe('Products API', () => {
  beforeEach(async () => {
    await setupTestDatabase()
  })

  afterEach(async () => {
    await teardownTestDatabase()
  })

  describe('GET /api/v1/inventory/products', () => {
    it('returns products for authenticated organization', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/inventory/products')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeInstanceOf(Array)
    })

    it('returns 401 for unauthenticated requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/inventory/products')
      // Don't set auth token
      const response = await GET(request)

      expect(response.status).toBe(401)
    })

    it('returns 403 for organization without inventory subscription', async () => {
      const token = await generateTestToken({
        organizationId: TEST_ORGS.orgWithoutInventory.id
      })

      const request = new NextRequest('http://localhost:3000/api/v1/inventory/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const response = await GET(request)

      expect(response.status).toBe(403)
      expect(response.json()).resolves.toMatchObject({
        error: expect.objectContaining({
          code: 'INVENTORY_MODULE_NOT_SUBSCRIBED'
        })
      })
    })

    it('filters products by search query', async () => {
      await createTestProduct({ name: 'Widget A', organizationId: TEST_ORGS.org1.id })
      await createTestProduct({ name: 'Gadget B', organizationId: TEST_ORGS.org1.id })

      const request = new NextRequest(
        'http://localhost:3000/api/v1/inventory/products?search=Widget'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe('Widget A')
    })
  })

  describe('POST /api/v1/inventory/products', () => {
    it('creates a new product', async () => {
      const productData = {
        name: 'Test Product',
        sku: 'TEST-001',
        unitPrice: 99.99,
        trackInventory: true
      }

      const request = new NextRequest('http://localhost:3000/api/v1/inventory/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.data).toMatchObject(productData)
    })

    it('validates required fields', async () => {
      const invalidData = {
        unitPrice: 99.99
        // Missing required 'name' and 'sku'
      }

      const request = new NextRequest('http://localhost:3000/api/v1/inventory/products', {
        method: 'POST',
        body: JSON.stringify(invalidData)
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('prevents duplicate SKUs', async () => {
      await createTestProduct({ sku: 'DUP-001', organizationId: TEST_ORGS.org1.id })

      const request = new NextRequest('http://localhost:3000/api/v1/inventory/products', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Duplicate Product',
          sku: 'DUP-001',
          unitPrice: 50
        })
      })

      const response = await POST(request)

      expect(response.status).toBe(409)
      expect(response.json()).resolves.toMatchObject({
        error: expect.objectContaining({
          code: 'INVENTORY_PRODUCT_SKU_EXISTS'
        })
      })
    })
  })
})
```

### Component Tests
```typescript
// app/inventory/components/StockBadge.test.tsx
import { render, screen } from '@testing-library/react'
import { StockBadge } from './StockBadge'

describe('StockBadge', () => {
  it('shows sufficient status when stock is above reorder point', () => {
    render(<StockBadge quantity={100} reorderPoint={50} />)

    const badge = screen.getByText('100 units')
    expect(badge).toHaveClass('bg-green-100')
  })

  it('shows low status when stock is at or below reorder point', () => {
    render(<StockBadge quantity={30} reorderPoint={50} />)

    const badge = screen.getByText('30 units')
    expect(badge).toHaveClass('bg-yellow-100')
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument() // Alert icon
  })

  it('shows out of stock status when quantity is 0', () => {
    render(<StockBadge quantity={0} reorderPoint={50} />)

    const badge = screen.getByText('0 units')
    expect(badge).toHaveClass('bg-red-100')
  })
})
```

### Database Function Tests
```typescript
// tests/database/functions.test.ts
describe('Database Functions', () => {
  describe('adjust_stock', () => {
    it('adjusts stock level and creates movement', async () => {
      const product = await createTestProduct()
      const warehouse = await createTestWarehouse()
      await createStockLevel(product.id, warehouse.id, 100)

      await testSupabase.rpc('adjust_stock', {
        p_product_id: product.id,
        p_warehouse_id: warehouse.id,
        p_quantity: -20,
        p_reason: 'sale',
        p_user_id: 'test-user-1'
      })

      // Check stock level updated
      const { data: stockLevel } = await testSupabase
        .from('inventory.stock_levels')
        .select('quantity_on_hand')
        .eq('product_id', product.id)
        .eq('warehouse_id', warehouse.id)
        .single()

      expect(stockLevel.quantity_on_hand).toBe(80)

      // Check movement created
      const { data: movements } = await testSupabase
        .from('inventory.stock_movements')
        .select('*')
        .eq('product_id', product.id)

      expect(movements).toHaveLength(1)
      expect(movements[0].quantity).toBe(-20)
      expect(movements[0].reason).toBe('sale')
    })
  })
})
```

---

## 3. Integration Testing

### Cross-Schema Queries
```typescript
// tests/integration/cross-schema.test.ts
describe('Cross-Schema Integration', () => {
  it('queries products with user information', async () => {
    const user = await createTestUser({ name: 'John Doe' })
    const product = await createTestProduct({
      createdBy: user.id,
      name: 'Test Product'
    })

    const { data } = await testSupabase
      .from('inventory.products')
      .select(`
        *,
        creator:core.users!created_by(id, name)
      `)
      .eq('id', product.id)
      .single()

    expect(data.creator.name).toBe('John Doe')
  })

  it('enforces RLS across schemas', async () => {
    const org1Product = await createTestProduct({
      organizationId: TEST_ORGS.org1.id
    })

    // Try to access with org2 token
    const { data, error } = await testSupabase
      .from('inventory.products')
      .select('*')
      .eq('id', org1Product.id)
      .single()

    expect(error).toBeTruthy()
    expect(data).toBeNull()
  })
})
```

### Cross-Module API Calls
```typescript
// tests/integration/cross-module.test.ts
describe('Cross-Module Integration', () => {
  it('publishes event to analytics when stock depleted', async () => {
    const eventSpy = jest.spyOn(eventBus, 'publish')

    await apiRequest('POST', '/api/v1/inventory/stock/adjust', {
      body: {
        productId: 'prod-123',
        warehouseId: 'wh-1',
        quantity: -100, // Depletes stock below reorder point
        reason: 'sale'
      }
    })

    expect(eventSpy).toHaveBeenCalledWith(
      'inventory.stock.depleted',
      expect.objectContaining({
        productId: 'prod-123',
        warehouseId: 'wh-1'
      })
    )
  })

  it('retrieves staff assignment from people module', async () => {
    const order = await createTestOrder()

    const response = await apiRequest(
      'POST',
      `/api/v1/inventory/orders/${order.id}/assign-picker`,
      {
        body: {
          role: 'warehouse_picker',
          warehouseId: order.warehouseId
        }
      }
    )

    const data = await response.json()

    expect(data.data.assignedStaff).toBeDefined()
    expect(data.data.assignedStaff.role).toBe('warehouse_picker')
  })
})
```

---

## 4. E2E Testing

### Playwright E2E Tests
```typescript
// e2e/inventory/product-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
    await loginAsTestUser(page, TEST_ORGS.org1)
  })

  test('complete product lifecycle', async ({ page }) => {
    // Navigate to inventory module
    await page.click('[data-testid="module-switcher"]')
    await page.click('text=Inventory')

    // Create new product
    await page.click('text=Products')
    await page.click('text=Add Product')

    await page.fill('[name="name"]', 'E2E Test Widget')
    await page.fill('[name="sku"]', 'E2E-001')
    await page.fill('[name="unitPrice"]', '99.99')
    await page.click('text=Create Product')

    await expect(page.locator('text=Product created successfully')).toBeVisible()

    // Add stock to warehouse
    await page.click('text=Stock Levels')
    await page.click('text=Adjust Stock')

    await page.fill('[name="search"]', 'E2E Test Widget')
    await page.click('text=E2E Test Widget')
    await page.selectOption('[name="warehouse"]', { label: 'Main Warehouse' })
    await page.fill('[name="quantity"]', '100')
    await page.selectOption('[name="reason"]', 'received')
    await page.click('button:has-text("Submit Adjustment")')

    await expect(page.locator('text=Stock adjusted successfully')).toBeVisible()

    // Verify stock level
    const stockBadge = page.locator('[data-product-sku="E2E-001"] [data-testid="stock-badge"]')
    await expect(stockBadge).toContainText('100 units')

    // Create sales order
    await page.click('text=Orders')
    await page.click('text=New Sales Order')

    await page.fill('[name="customerName"]', 'Test Customer')
    await page.click('text=Add Item')
    await page.fill('[name="items[0].product"]', 'E2E Test Widget')
    await page.click('text=E2E Test Widget') // From dropdown
    await page.fill('[name="items[0].quantity"]', '10')
    await page.click('button:has-text("Create Order")')

    await expect(page.locator('text=Order created successfully')).toBeVisible()

    // Fulfill order
    await page.click('text=Fulfill Order')
    await page.click('button:has-text("Confirm Fulfillment")')

    await expect(page.locator('text=Order fulfilled successfully')).toBeVisible()

    // Verify stock reduced
    await page.click('text=Products')
    const updatedStockBadge = page.locator('[data-product-sku="E2E-001"] [data-testid="stock-badge"]')
    await expect(updatedStockBadge).toContainText('90 units')
  })

  test('barcode scanning workflow', async ({ page, context }) => {
    await context.grantPermissions(['camera'])

    await page.click('text=Stock Levels')
    await page.click('button:has-text("Scan Barcode")')

    // Wait for camera to load
    await page.waitForSelector('video')

    // Simulate barcode scan (in real test, use QR code image)
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('barcode-detected', {
        detail: { code: '1234567890' }
      }))
    })

    await expect(page.locator('text=Product: Widget A')).toBeVisible()
  })
})
```

### User Workflows
```typescript
test('receiving goods workflow', async ({ page }) => {
  // 1. Create purchase order
  await page.goto('/inventory/orders/purchase/new')
  await fillPurchaseOrderForm(page, {
    supplier: 'Test Supplier',
    items: [
      { product: 'Widget A', quantity: 100, unitCost: 50 }
    ]
  })
  await page.click('button:has-text("Create PO")')

  const orderId = await page.locator('[data-testid="order-id"]').textContent()

  // 2. Receive goods
  await page.goto(`/inventory/orders/${orderId}/receive`)
  await page.fill('[name="items[0].quantityReceived"]', '100')
  await page.click('button:has-text("Receive All")')

  // 3. Verify stock updated
  await page.goto('/inventory/stock')
  await page.fill('[name="search"]', 'Widget A')

  await expect(page.locator('[data-product="Widget A"] [data-testid="stock-badge"]'))
    .toContainText('100 units')

  // 4. Verify PO status
  await page.goto(`/inventory/orders/${orderId}`)
  await expect(page.locator('[data-testid="order-status"]'))
    .toHaveText('Received')
})
```

---

## 5. Multi-Tenancy Testing

### Data Isolation Tests
```typescript
// tests/multi-tenancy/isolation.test.ts
describe('Multi-Tenancy Data Isolation', () => {
  it('prevents cross-organization data access', async () => {
    const org1Product = await createTestProduct({
      organizationId: TEST_ORGS.org1.id,
      name: 'Org 1 Product'
    })

    const org2Product = await createTestProduct({
      organizationId: TEST_ORGS.org2.id,
      name: 'Org 2 Product'
    })

    // Org 1 should only see their products
    const org1Response = await apiRequest('GET', '/api/v1/inventory/products', {
      organizationId: TEST_ORGS.org1.id
    })
    const org1Data = await org1Response.json()

    expect(org1Data.data).toHaveLength(1)
    expect(org1Data.data[0].id).toBe(org1Product.id)

    // Org 2 should only see their products
    const org2Response = await apiRequest('GET', '/api/v1/inventory/products', {
      organizationId: TEST_ORGS.org2.id
    })
    const org2Data = await org2Response.json()

    expect(org2Data.data).toHaveLength(1)
    expect(org2Data.data[0].id).toBe(org2Product.id)
  })

  it('enforces RLS on direct database queries', async () => {
    const org1Product = await createTestProduct({
      organizationId: TEST_ORGS.org1.id
    })

    // Create authenticated client for org2
    const org2Client = createSupabaseClient(TEST_ORGS.org2.id)

    const { data, error } = await org2Client
      .from('inventory.products')
      .select('*')
      .eq('id', org1Product.id)
      .single()

    expect(error).toBeTruthy()
    expect(data).toBeNull()
  })

  it('prevents cross-org stock movements', async () => {
    const org1Product = await createTestProduct({
      organizationId: TEST_ORGS.org1.id
    })
    const org2Warehouse = await createTestWarehouse({
      organizationId: TEST_ORGS.org2.id
    })

    const response = await apiRequest('POST', '/api/v1/inventory/stock/adjust', {
      organizationId: TEST_ORGS.org2.id,
      body: {
        productId: org1Product.id,
        warehouseId: org2Warehouse.id,
        quantity: 100,
        reason: 'received'
      }
    })

    expect(response.status).toBe(404) // Product not found (for org2)
  })
})
```

### Module Subscription Tests
```typescript
describe('Module Subscription Enforcement', () => {
  it('blocks access when module not subscribed', async () => {
    const response = await apiRequest('GET', '/api/v1/inventory/products', {
      organizationId: TEST_ORGS.orgWithoutInventory.id
    })

    expect(response.status).toBe(403)
    expect(response.json()).resolves.toMatchObject({
      error: expect.objectContaining({
        code: 'INVENTORY_MODULE_NOT_SUBSCRIBED'
      })
    })
  })

  it('shows upgrade prompt in UI', async ({ page }) => {
    await loginAsTestUser(page, TEST_ORGS.orgWithoutInventory)
    await page.goto('/inventory')

    await expect(page.locator('text=Upgrade to access Inventory')).toBeVisible()
    await expect(page.locator('a:has-text("View Plans")')).toHaveAttribute(
      'href',
      '/marketplace?module=inventory'
    )
  })
})
```

---

## 6. Performance Testing

### Load Testing with K6
```javascript
// tests/performance/inventory-api.k6.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],   // <1% error rate
  },
}

export default function () {
  const token = 'test-token'

  // List products
  const listResponse = http.get(
    'http://localhost:3000/api/v1/inventory/products',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  check(listResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })

  sleep(1)

  // Get product details
  const productId = listResponse.json().data[0]?.id
  if (productId) {
    const detailResponse = http.get(
      `http://localhost:3000/api/v1/inventory/products/${productId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    check(detailResponse, {
      'product detail status is 200': (r) => r.status === 200,
    })
  }

  sleep(1)
}
```

### Database Query Performance
```typescript
// tests/performance/query-performance.test.ts
describe('Query Performance', () => {
  beforeAll(async () => {
    // Seed large dataset
    await seedLargeDataset({
      products: 10000,
      warehouses: 50,
      stockLevels: 50000,
      movements: 100000
    })
  })

  it('lists products within performance threshold', async () => {
    const start = Date.now()

    await testSupabase
      .from('inventory.products')
      .select('*')
      .limit(50)

    const duration = Date.now() - start

    expect(duration).toBeLessThan(200) // < 200ms
  })

  it('aggregates stock levels efficiently', async () => {
    const start = Date.now()

    await testSupabase
      .from('inventory.stock_levels')
      .select('warehouse_id, sum(quantity_on_hand)')
      .groupBy('warehouse_id')

    const duration = Date.now() - start

    expect(duration).toBeLessThan(500) // < 500ms
  })

  it('full-text search performs well', async () => {
    const start = Date.now()

    await testSupabase
      .from('inventory.products')
      .select('*')
      .textSearch('name', 'widget')
      .limit(50)

    const duration = Date.now() - start

    expect(duration).toBeLessThan(300) // < 300ms
  })
})
```

---

## 7. Mobile Testing

### Detox E2E Tests (React Native)
```typescript
// mobile/e2e/inventory.e2e.ts
import { device, element, by, expect as detoxExpect } from 'detox'

describe('Inventory Module - Mobile', () => {
  beforeAll(async () => {
    await device.launchApp()
    await loginAsTestUser()
    await navigateToModule('inventory')
  })

  it('scans barcode and shows product', async () => {
    await element(by.text('Stock Levels')).tap()
    await element(by.text('Scan Barcode')).tap()

    // Wait for camera permission
    await device.launchApp({ permissions: { camera: 'YES' } })

    // Simulate barcode scan
    await element(by.id('barcode-scanner')).tap()
    await device.sendUserNotification({
      trigger: {
        type: 'push'
      },
      title: 'Barcode Detected',
      body: '1234567890'
    })

    // Verify product details shown
    await detoxExpect(element(by.text('Widget A'))).toBeVisible()
    await detoxExpect(element(by.id('stock-quantity'))).toHaveText('150 units')
  })

  it('adjusts stock offline', async () => {
    // Go offline
    await device.setURLBlacklist(['*'])

    await element(by.text('Adjust Stock')).tap()
    await element(by.id('product-search')).typeText('Widget A')
    await element(by.text('Widget A')).tap()
    await element(by.id('quantity-input')).typeText('50')
    await element(by.text('Submit')).tap()

    // Verify queued for sync
    await detoxExpect(element(by.text('Queued for sync'))).toBeVisible()

    // Go online
    await device.setURLBlacklist([])

    // Wait for sync
    await waitFor(element(by.text('Synced')))
      .toBeVisible()
      .withTimeout(5000)
  })

  it('works across module switches', async () => {
    await element(by.id('module-switcher')).tap()
    await element(by.text('Analytics')).tap()

    // Should be in analytics
    await detoxExpect(element(by.text('Analytics Dashboard'))).toBeVisible()

    // Switch back to inventory
    await element(by.id('module-switcher')).tap()
    await element(by.text('Inventory')).tap()

    // Should restore inventory state
    await detoxExpect(element(by.text('Inventory Dashboard'))).toBeVisible()
  })
})
```

---

## 8. Regression Testing

### Preventing Breaking Changes
```typescript
// tests/regression/api-contracts.test.ts
describe('API Contract Tests', () => {
  it('maintains products API response structure', async () => {
    const response = await apiRequest('GET', '/api/v1/inventory/products')
    const data = await response.json()

    expect(data).toMatchSnapshot({
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          sku: expect.any(String),
          unitPrice: expect.any(Number),
          createdAt: expect.any(String)
        })
      ])
    })
  })

  it('maintains database schema', async () => {
    const { data: columns } = await testSupabase
      .rpc('get_table_columns', {
        schema_name: 'inventory',
        table_name: 'products'
      })

    expect(columns).toMatchSnapshot()
  })
})
```

### Visual Regression Testing
```typescript
// e2e/visual-regression/inventory.spec.ts
import { test } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('inventory dashboard looks correct', async ({ page }) => {
    await page.goto('/inventory')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('inventory-dashboard.png')
  })

  test('product list looks correct', async ({ page }) => {
    await page.goto('/inventory/products')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('product-list.png')
  })
})
```

---

## 9. Test Data Management

### Test Data Factory
```typescript
// tests/factories/index.ts
import { faker } from '@faker-js/faker'

export const ProductFactory = {
  build: (overrides = {}) => ({
    id: faker.string.uuid(),
    organizationId: TEST_ORGS.org1.id,
    name: faker.commerce.productName(),
    sku: faker.string.alphanumeric(10).toUpperCase(),
    description: faker.commerce.productDescription(),
    unitPrice: parseFloat(faker.commerce.price()),
    costPrice: parseFloat(faker.commerce.price({ min: 20, max: 80 })),
    trackInventory: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    ...overrides
  }),

  create: async (overrides = {}) => {
    const product = ProductFactory.build(overrides)
    const { data } = await testSupabase
      .from('inventory.products')
      .insert(product)
      .select()
      .single()
    return data
  },

  createMany: async (count: number, overrides = {}) => {
    const products = Array.from({ length: count }, () =>
      ProductFactory.build(overrides)
    )
    const { data } = await testSupabase
      .from('inventory.products')
      .insert(products)
      .select()
    return data
  }
}
```

### Data Seeding
```typescript
// tests/seeds/inventory.ts
export async function seedInventoryData() {
  // Create products
  const products = await ProductFactory.createMany(50)

  // Create warehouses
  const warehouses = [
    await WarehouseFactory.create({ name: 'Main Warehouse', code: 'MAIN' }),
    await WarehouseFactory.create({ name: 'Secondary Warehouse', code: 'SEC' })
  ]

  // Create stock levels
  for (const product of products) {
    for (const warehouse of warehouses) {
      await StockLevelFactory.create({
        productId: product.id,
        warehouseId: warehouse.id,
        quantityOnHand: faker.number.int({ min: 0, max: 1000 })
      })
    }
  }

  // Create orders
  await OrderFactory.createMany(20, { status: 'pending' })
  await OrderFactory.createMany(10, { status: 'fulfilled' })
}
```

---

## 10. CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test-inventory.yml
name: Inventory Module Tests

on:
  push:
    branches: [main, develop]
    paths:
      - 'app/inventory/**'
      - 'app/api/v1/inventory/**'
      - 'tests/inventory/**'
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit:inventory
      - uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: supabase/postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run db:setup:test
      - run: npm run test:integration:inventory

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: microsoft/playwright-github-action@v1
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e:inventory
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  mobile-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: cd mobile && npm ci
      - run: npx detox build --configuration ios.sim.release
      - run: npx detox test --configuration ios.sim.release
```

### Test Scripts
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:unit:inventory": "jest --testPathPattern=tests/unit/inventory",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:integration:inventory": "jest --testPathPattern=tests/integration/inventory",
    "test:e2e": "playwright test",
    "test:e2e:inventory": "playwright test e2e/inventory",
    "test:mobile": "detox test",
    "test:performance": "k6 run tests/performance/*.k6.js",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

---

## Summary

This testing strategy provides:

✅ **Comprehensive Coverage**: Unit, integration, E2E, mobile, performance tests
✅ **Multi-Tenancy Validation**: Ensures data isolation between organizations
✅ **Module Isolation**: Tests inventory module within unified platform
✅ **Cross-Module Integration**: Validates communication with other modules
✅ **Performance Benchmarks**: Load testing and query optimization
✅ **CI/CD Integration**: Automated testing on every commit
✅ **Test Data Management**: Factories and seeds for consistent test data
✅ **Regression Prevention**: Visual and contract tests
✅ **Mobile Testing**: Both web and native mobile app testing

**Testing Pyramid:**
- 60% Unit Tests (fast, isolated)
- 30% Integration Tests (cross-schema, cross-module)
- 10% E2E Tests (full user workflows)

**Coverage Goals:**
- API Endpoints: 100%
- Business Logic: 95%+
- UI Components: 80%+
- Mobile Components: 75%+

This ensures the Inventory Module is production-ready, reliable, and maintains quality as the unified platform grows.
