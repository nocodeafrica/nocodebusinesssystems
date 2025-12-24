# Component Library Quick Reference

## 🎯 Installation
```bash
bash scripts/install-components.sh
```

## 📦 Import Cheatsheet

### UI Components
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SimpleSelect } from '@/components/ui/select'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { DataTable, DataTableColumnHeader } from '@/components/ui/data-table'
```

### Platform Components
```typescript
import { ModuleSwitcher } from '@/components/platform/ModuleSwitcher'
import { PlatformHeader } from '@/components/platform/PlatformHeader'
import { PlatformNav, PlatformSidebar } from '@/components/platform/PlatformNav'
```

### Inventory Components
```typescript
import { StockBadge, StockCount, StockProgressBar } from '@/components/inventory/StockBadge'
import { ProductCombobox, ProductMultiCombobox } from '@/components/inventory/ProductCombobox'
import { ProductTable, ProductTableCompact } from '@/components/inventory/ProductTable'
```

### Utilities
```typescript
import { cn, formatCurrency, formatDate, debounce } from '@/lib/utils'
import { supabase, auth, db } from '@/lib/supabase'
```

## ⚡ Common Patterns

### Form with Validation
```tsx
const form = useForm()

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField control={form.control} name="name" render={({ field }) => (
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl><Input {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
  </form>
</Form>
```

### Data Table
```tsx
const columns: ColumnDef<Product>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "price", header: "Price", cell: ({ row }) => formatCurrency(row.getValue("price")) }
]

<DataTable columns={columns} data={products} searchable paginated />
```

### Product Search
```tsx
<ProductCombobox
  products={products}
  value={selected}
  onValueChange={setSelected}
  showDetails
  clearable
/>
```

### Stock Status
```tsx
<StockBadge stock={product.stock} lowStockThreshold={20} showIcon showCount />
```

## 🎨 Component Variants

### Button
`default` `destructive` `outline` `secondary` `ghost` `link`

### StockBadge
`in-stock` `low-stock` `out-of-stock` `discontinued`

### ModuleSwitcher
`dropdown` `compact`

## 🔧 Required Config

### tsconfig.json
```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
```

### tailwind.config.js
Add color tokens (see COMPONENT_LIBRARY.md)

### globals.css
Add CSS variables (see COMPONENT_LIBRARY.md)

## 📝 TypeScript Interfaces

```typescript
interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  lowStockThreshold?: number
  image?: string
}

interface NavItem {
  id: string
  label: string
  href: string
  icon?: LucideIcon
  badge?: string | number
  children?: NavItem[]
}

interface UserProfile {
  name: string
  email: string
  avatar?: string
  role?: string
}
```

## 🚀 Full Layout Example

```tsx
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <PlatformHeader
        user={user}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex">
        <PlatformSidebar open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <ModuleSwitcher currentModule="inventory" />
          <PlatformNav onMobileClose={() => setSidebarOpen(false)} />
        </PlatformSidebar>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  )
}
```

## 📚 Full Documentation
See `COMPONENT_LIBRARY.md` for complete API documentation.
