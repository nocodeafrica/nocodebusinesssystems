# Inventory Module - Frontend UI Architecture

**Module:** Inventory Management
**Platform:** Horizon Systems Unified Platform
**Version:** 1.0
**Last Updated:** October 20, 2025

---

## Table of Contents
1. [Routing Structure](#routing-structure)
2. [Shared Platform Components](#shared-platform-components)
3. [Inventory-Specific Pages](#inventory-specific-pages)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Module Switcher](#module-switcher)
7. [Responsive Design](#responsive-design)
8. [Cross-Module Integration](#cross-module-integration)
9. [Performance Optimization](#performance-optimization)

---

## 1. Routing Structure

### Route Hierarchy
```
/inventory                    # Module dashboard
/inventory/products           # Product catalog
/inventory/products/new       # Create product
/inventory/products/:id       # Product details
/inventory/products/:id/edit  # Edit product

/inventory/warehouses         # Warehouse list
/inventory/warehouses/new     # Create warehouse
/inventory/warehouses/:id     # Warehouse details
/inventory/warehouses/:id/map # Warehouse visual map

/inventory/stock              # Stock levels overview
/inventory/stock/adjust       # Adjust stock
/inventory/stock/transfer     # Transfer between warehouses
/inventory/stock/count        # Cycle counting

/inventory/orders             # Orders list (PO + SO)
/inventory/orders/purchase    # Purchase orders
/inventory/orders/sales       # Sales orders
/inventory/orders/:id         # Order details
/inventory/orders/:id/fulfill # Fulfill order

/inventory/suppliers          # Supplier management
/inventory/suppliers/:id      # Supplier details

/inventory/reports            # Reports dashboard
/inventory/reports/low-stock  # Low stock report
/inventory/reports/valuation  # Stock valuation
/inventory/reports/movements  # Movement history

/inventory/settings           # Module settings
```

### Route Protection
```typescript
// app/inventory/layout.tsx
import { checkModuleAccess } from '@/lib/platform/modules'
import { redirect } from 'next/navigation'

export default async function InventoryLayout({ children }) {
  const hasAccess = await checkModuleAccess('inventory')

  if (!hasAccess) {
    redirect('/marketplace?module=inventory') // Redirect to upgrade page
  }

  return (
    <div className="inventory-module">
      <InventoryNav />
      {children}
    </div>
  )
}
```

---

## 2. Shared Platform Components

### Top Navigation Bar (Shared)
```typescript
// Used by ALL modules
<PlatformHeader>
  <Logo />
  <ModuleSwitcher /> {/* Dropdown to switch between modules */}
  <Search />          {/* Global search across modules */}
  <Notifications />   {/* Unified notification center */}
  <UserMenu />        {/* Profile, settings, logout */}
</PlatformHeader>
```

### Sidebar Navigation (Module-Specific)
```typescript
// app/inventory/components/InventoryNav.tsx
export function InventoryNav() {
  return (
    <Sidebar>
      <NavSection title="Overview">
        <NavItem href="/inventory" icon={<LayoutDashboard />}>
          Dashboard
        </NavItem>
      </NavSection>

      <NavSection title="Catalog">
        <NavItem href="/inventory/products" icon={<Package />}>
          Products
        </NavItem>
        <NavItem href="/inventory/suppliers" icon={<Building2 />}>
          Suppliers
        </NavItem>
      </NavSection>

      <NavSection title="Operations">
        <NavItem href="/inventory/warehouses" icon={<Warehouse />}>
          Warehouses
        </NavItem>
        <NavItem href="/inventory/stock" icon={<Archive />}>
          Stock Levels
        </NavItem>
        <NavItem href="/inventory/orders" icon={<ShoppingCart />}>
          Orders
        </NavItem>
      </NavSection>

      <NavSection title="Insights">
        <NavItem href="/inventory/reports" icon={<BarChart />}>
          Reports
        </NavItem>
      </NavSection>

      <NavSection title="Settings">
        <NavItem href="/inventory/settings" icon={<Settings />}>
          Module Settings
        </NavItem>
      </NavSection>
    </Sidebar>
  )
}
```

### Shared UI Components (Platform Library)
```typescript
// From @/components/ui (shadcn/ui based)
import {
  Button,
  Card,
  Table,
  Form,
  Input,
  Select,
  Dialog,
  Sheet,
  Badge,
  Avatar,
  Tabs,
  Accordion,
  DataTable,
  // ... many more
} from '@/components/ui'
```

---

## 3. Inventory-Specific Pages

### Dashboard Page
```typescript
// app/inventory/page.tsx
export default function InventoryDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Dashboard" />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Products"
          value="1,247"
          change="+12%"
          icon={<Package />}
        />
        <MetricCard
          title="Stock Value"
          value="$428,950"
          change="+8%"
          icon={<DollarSign />}
        />
        <MetricCard
          title="Low Stock Items"
          value="23"
          change="-5"
          trend="down"
          icon={<AlertTriangle />}
        />
        <MetricCard
          title="Pending Orders"
          value="15"
          icon={<ShoppingCart />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels by Warehouse</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={warehouseStockData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Movements (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={movementData} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction
              icon={<Plus />}
              label="Add Product"
              href="/inventory/products/new"
            />
            <QuickAction
              icon={<TrendingDown />}
              label="Adjust Stock"
              href="/inventory/stock/adjust"
            />
            <QuickAction
              icon={<FileText />}
              label="Create PO"
              href="/inventory/orders/purchase/new"
            />
            <QuickAction
              icon={<Scan />}
              label="Scan Barcode"
              onClick={openBarcodeScanner}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
        </CardHeader>
        <CardContent>
          <StockMovementsList limit={10} />
        </CardContent>
      </Card>
    </div>
  )
}
```

### Products Catalog Page
```typescript
// app/inventory/products/page.tsx
export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        action={
          <Button asChild>
            <Link href="/inventory/products/new">
              <Plus className="mr-2" /> Add Product
            </Link>
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search products..."
              icon={<Search />}
              onChange={handleSearch}
            />
            <Select
              placeholder="Category"
              options={categories}
              onChange={handleCategoryFilter}
            />
            <Select
              placeholder="Status"
              options={[
                { label: 'All', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <DataTable
          columns={productColumns}
          data={products}
          pagination
          sorting
          actions={[
            {
              label: 'Edit',
              icon: <Edit />,
              href: (row) => `/inventory/products/${row.id}/edit`
            },
            {
              label: 'View Stock',
              icon: <Eye />,
              onClick: (row) => openStockModal(row.id)
            },
            {
              label: 'Delete',
              icon: <Trash />,
              onClick: (row) => confirmDelete(row.id),
              variant: 'destructive'
            }
          ]}
        />
      </Card>
    </div>
  )
}

const productColumns = [
  {
    accessorKey: 'image',
    header: '',
    cell: ({ row }) => (
      <Avatar src={row.original.imageUrl} fallback={row.original.name[0]} />
    )
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
    sortable: true
  },
  {
    accessorKey: 'name',
    header: 'Product Name',
    sortable: true
  },
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    accessorKey: 'stockLevel',
    header: 'Stock',
    cell: ({ row }) => (
      <StockBadge
        quantity={row.original.totalStock}
        reorderPoint={row.original.reorderPoint}
      />
    )
  },
  {
    accessorKey: 'unitPrice',
    header: 'Price',
    cell: ({ row }) => formatCurrency(row.original.unitPrice)
  }
]
```

### Warehouse Visual Map
```typescript
// app/inventory/warehouses/[id]/map/page.tsx
export default function WarehouseMap({ params }) {
  return (
    <div className="h-screen">
      <PageHeader
        title="Warehouse Layout"
        backButton
      />

      <div className="relative h-full">
        {/* Interactive warehouse map */}
        <WarehouseCanvas
          warehouseId={params.id}
          zones={zones}
          onZoneClick={handleZoneClick}
        />

        {/* Location details panel */}
        <Sheet open={selectedZone !== null}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{selectedZone?.name}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              <div>
                <Label>Capacity</Label>
                <Progress value={selectedZone?.utilizationPercent} />
                <p className="text-sm text-muted-foreground">
                  {selectedZone?.currentStock} / {selectedZone?.capacity} units
                </p>
              </div>

              <div>
                <Label>Products in this zone</Label>
                <ProductList products={selectedZone?.products} compact />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
```

### Stock Adjustment Page
```typescript
// app/inventory/stock/adjust/page.tsx
export default function StockAdjustPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Adjust Stock"
        backButton
      />

      <Card>
        <CardContent className="pt-6">
          <Form onSubmit={handleAdjustment}>
            <FormField
              label="Product"
              required
            >
              <ProductCombobox
                value={selectedProduct}
                onChange={setSelectedProduct}
                placeholder="Search products..."
              />
            </FormField>

            <FormField
              label="Warehouse"
              required
            >
              <Select
                options={warehouses}
                value={selectedWarehouse}
                onChange={setSelectedWarehouse}
              />
            </FormField>

            {/* Show current stock */}
            {selectedProduct && selectedWarehouse && (
              <Alert>
                <AlertTitle>Current Stock</AlertTitle>
                <AlertDescription>
                  <span className="font-semibold text-2xl">
                    {currentStock}
                  </span> units available
                </AlertDescription>
              </Alert>
            )}

            <FormField
              label="Adjustment"
              required
              description="Enter positive number to add, negative to remove"
            >
              <Input
                type="number"
                placeholder="e.g., +50 or -20"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </FormField>

            <FormField
              label="Reason"
              required
            >
              <Select
                options={[
                  { label: 'Received', value: 'received' },
                  { label: 'Damaged', value: 'damaged' },
                  { label: 'Lost', value: 'lost' },
                  { label: 'Found', value: 'found' },
                  { label: 'Correction', value: 'correction' }
                ]}
                value={reason}
                onChange={setReason}
              />
            </FormField>

            <FormField
              label="Notes"
            >
              <Textarea
                placeholder="Optional notes about this adjustment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </FormField>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Submit Adjustment
              </Button>
              <Button type="button" variant="outline" onClick={reset}>
                Reset
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 4. Component Architecture

### Inventory-Specific Components

```
/app/inventory/components/
├── BarcodeScannerDialog.tsx
├── ProductCombobox.tsx
├── WarehouseSelector.tsx
├── StockBadge.tsx
├── StockLevelIndicator.tsx
├── OrderStatusBadge.tsx
├── WarehouseCanvas.tsx
├── BinLocationPicker.tsx
├── StockMovementsList.tsx
├── LowStockAlert.tsx
└── ProductImageUpload.tsx
```

### Component Examples

#### StockBadge Component
```typescript
interface StockBadgeProps {
  quantity: number
  reorderPoint?: number
  className?: string
}

export function StockBadge({ quantity, reorderPoint, className }: StockBadgeProps) {
  const status = useMemo(() => {
    if (quantity === 0) return 'out-of-stock'
    if (reorderPoint && quantity <= reorderPoint) return 'low'
    return 'sufficient'
  }, [quantity, reorderPoint])

  const variants = {
    'out-of-stock': 'bg-red-100 text-red-800',
    'low': 'bg-yellow-100 text-yellow-800',
    'sufficient': 'bg-green-100 text-green-800'
  }

  return (
    <Badge className={cn(variants[status], className)}>
      {quantity} units
      {status === 'low' && <AlertTriangle className="ml-1 h-3 w-3" />}
      {status === 'out-of-stock' && <XCircle className="ml-1 h-3 w-3" />}
    </Badge>
  )
}
```

#### BarcodeScannerDialog Component
```typescript
export function BarcodeScannerDialog({ open, onClose, onScan }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
          <DialogDescription>
            Position barcode within the frame
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <BarcodeScanner
            onDetected={onScan}
            onError={(error) => toast.error(error.message)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 5. State Management

### Global State (Platform-Wide)
```typescript
// Using Zustand
import { create } from 'zustand'

// Shared across ALL modules
interface PlatformStore {
  user: User | null
  organization: Organization | null
  subscriptions: ModuleSubscription[]
  theme: 'light' | 'dark'
  setUser: (user: User) => void
  setOrganization: (org: Organization) => void
}

export const usePlatformStore = create<PlatformStore>((set) => ({
  user: null,
  organization: null,
  subscriptions: [],
  theme: 'light',
  setUser: (user) => set({ user }),
  setOrganization: (organization) => set({ organization })
}))
```

### Module State (Inventory-Specific)
```typescript
// app/inventory/store/index.ts
interface InventoryStore {
  products: Product[]
  warehouses: Warehouse[]
  filters: {
    search: string
    category: string | null
    status: 'all' | 'active' | 'inactive'
  }
  setProducts: (products: Product[]) => void
  setFilters: (filters: Partial<InventoryStore['filters']>) => void
  // ... more actions
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  products: [],
  warehouses: [],
  filters: { search: '', category: null, status: 'all' },
  setProducts: (products) => set({ products }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  }))
}))
```

### Server State (React Query)
```typescript
// app/inventory/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useProducts() {
  return useQuery({
    queryKey: ['inventory', 'products'],
    queryFn: () => fetchProducts()
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductInput) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'products'] })
      toast.success('Product created successfully')
    }
  })
}
```

---

## 6. Module Switcher

### Module Switcher Component
```typescript
// components/platform/ModuleSwitcher.tsx
export function ModuleSwitcher() {
  const { subscriptions } = usePlatformStore()
  const currentModule = useCurrentModule()

  const modules = [
    { id: 'inventory', name: 'Inventory', icon: <Package />, href: '/inventory' },
    { id: 'analytics', name: 'Analytics', icon: <BarChart />, href: '/analytics' },
    { id: 'people', name: 'People', icon: <Users />, href: '/people' },
    // ... other modules
  ]

  const subscribedModules = modules.filter(m =>
    subscriptions.some(s => s.moduleId === m.id && s.status === 'active')
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          {currentModule?.icon}
          {currentModule?.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[300px]">
        <DropdownMenuLabel>Switch Module</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {subscribedModules.map((module) => (
          <DropdownMenuItem key={module.id} asChild>
            <Link href={module.href}>
              {module.icon}
              <span className="ml-2">{module.name}</span>
              {currentModule?.id === module.id && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/marketplace">
            <Plus className="mr-2 h-4 w-4" />
            Browse More Modules
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 7. Responsive Design

### Breakpoints (Tailwind)
```typescript
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}
```

### Mobile Adaptations
```typescript
// Example: Products page on mobile
export function ProductsPageMobile() {
  return (
    <div className="p-4 space-y-4">
      {/* Search bar */}
      <Input placeholder="Search products..." icon={<Search />} />

      {/* Filter sheet (bottom drawer) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <Filter className="mr-2" /> Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          {/* Filter options */}
        </SheetContent>
      </Sheet>

      {/* Product cards (instead of table) */}
      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar src={product.imageUrl} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StockBadge quantity={product.stock} />
                    <span className="font-semibold">
                      {formatCurrency(product.unitPrice)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating action button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg"
        asChild
      >
        <Link href="/inventory/products/new">
          <Plus />
        </Link>
      </Button>
    </div>
  )
}
```

---

## 8. Cross-Module Integration

### Embedding Analytics Widgets
```typescript
// On inventory dashboard, embed analytics from Analytics module
import { AnalyticsWidget } from '@/modules/analytics/components/AnalyticsWidget'

export function InventoryDashboard() {
  return (
    <div>
      {/* Inventory content */}

      {/* Embedded analytics widget */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsWidget
            module="inventory"
            metrics={['stock-turnover', 'days-on-hand', 'fill-rate']}
            period="30d"
          />
        </CardContent>
      </Card>
    </div>
  )
}
```

### Staff Assignment from People Module
```typescript
// When fulfilling an order, assign picker from People module
import { StaffPicker } from '@/modules/people/components/StaffPicker'

export function FulfillOrderForm() {
  return (
    <Form>
      {/* Order details */}

      <FormField label="Assign Picker">
        <StaffPicker
          role="warehouse_picker"
          warehouseId={order.warehouseId}
          onSelect={handleStaffAssignment}
        />
      </FormField>
    </Form>
  )
}
```

---

## 9. Performance Optimization

### Code Splitting
```typescript
// Lazy load heavy components
const WarehouseCanvas = dynamic(
  () => import('./components/WarehouseCanvas'),
  {
    loading: () => <Skeleton className="h-[600px]" />,
    ssr: false
  }
)

const BarcodeScanner = dynamic(
  () => import('./components/BarcodeScanner'),
  {
    loading: () => <div>Loading scanner...</div>,
    ssr: false
  }
)
```

### Image Optimization
```typescript
import Image from 'next/image'

<Image
  src={product.imageUrl}
  alt={product.name}
  width={200}
  height={200}
  placeholder="blur"
  blurDataURL={product.imagePlaceholder}
/>
```

### Virtual Scrolling for Large Lists
```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function ProductVirtualList({ products }) {
  const parentRef = useRef(null)

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72
  })

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            <ProductRow product={products[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Summary

This frontend architecture:

✅ Integrates seamlessly with unified Horizon Systems platform
✅ Shares navigation, auth UI, and design system
✅ Provides intuitive module-specific pages
✅ Enables smooth switching between modules
✅ Responsive design for mobile/tablet/desktop
✅ Cross-module component embedding
✅ Optimized performance with code splitting
✅ Consistent UX patterns across the platform
✅ Scalable state management

**Next Steps:**
1. Set up shared component library
2. Implement core inventory pages
3. Build module switcher UI
4. Add responsive mobile layouts
5. Integrate with Analytics module widgets
6. Performance testing and optimization
