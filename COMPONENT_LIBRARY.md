# Horizon Systems Component Library

Production-ready React component library for the unified Horizon Systems platform.

## 📦 Installation

### Required Dependencies

```bash
npm install @radix-ui/react-select @radix-ui/react-label @radix-ui/react-slot @radix-ui/react-popover @radix-ui/react-dropdown-menu
npm install @tanstack/react-table
npm install class-variance-authority clsx tailwind-merge
npm install react-hook-form
```

### Optional Dependencies (Recommended)

```bash
npm install date-fns # For date formatting
npm install zod # For form validation
```

## 📁 Component Structure

```
components/
├── ui/                          # Base UI Components (shadcn/ui based)
│   ├── button.tsx              # Button with variants
│   ├── card.tsx                # Card container components
│   ├── input.tsx               # Input field with label/error
│   ├── select.tsx              # Select dropdown with SimpleSelect helper
│   ├── form.tsx                # Form components with react-hook-form
│   └── data-table.tsx          # Data table with sorting/filtering
│
├── platform/                    # Platform-Level Components
│   ├── ModuleSwitcher.tsx      # Module navigation dropdown
│   ├── PlatformHeader.tsx      # App header with user menu
│   └── PlatformNav.tsx         # Sidebar navigation
│
└── inventory/                   # Inventory Module Components
    ├── StockBadge.tsx          # Stock level indicators
    ├── ProductCombobox.tsx     # Product search/select
    └── ProductTable.tsx        # Products data table
```

## 🎨 Core Components

### UI Components

#### Button
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Primary</Button>
<Button variant="outline" size="sm">Secondary</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
```

**Variants:** `default | destructive | outline | secondary | ghost | link`
**Sizes:** `default | sm | lg | icon`

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

#### Input
```tsx
import { Input } from "@/components/ui/input"

<Input
  type="text"
  placeholder="Enter name"
  label="Full Name"
  error="Name is required"
  required
/>
```

#### Select
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Simple Select Helper:**
```tsx
import { SimpleSelect } from "@/components/ui/select"

<SimpleSelect
  label="Category"
  options={[
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' }
  ]}
  value={category}
  onValueChange={setCategory}
  error="Category is required"
  required
/>
```

#### Form (react-hook-form integration)
```tsx
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const form = useForm()

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

#### DataTable
```tsx
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatCurrency(row.getValue("price")),
  },
]

<DataTable
  columns={columns}
  data={products}
  searchable
  searchKey="name"
  paginated
  defaultPageSize={10}
/>
```

### Platform Components

#### ModuleSwitcher
```tsx
import { ModuleSwitcher } from "@/components/platform/ModuleSwitcher"

<ModuleSwitcher
  currentModule="inventory"
  variant="dropdown"
  onModuleChange={(id) => console.log('Switched to:', id)}
/>
```

**Props:**
- `currentModule` - Active module ID
- `modules` - Custom module list (optional)
- `variant` - "dropdown" | "compact"
- `onModuleChange` - Callback function

#### PlatformHeader
```tsx
import { PlatformHeader } from "@/components/platform/PlatformHeader"

<PlatformHeader
  user={{
    name: "John Doe",
    email: "john@example.com",
    role: "Admin"
  }}
  notifications={notifications}
  showSearch
  onSearch={(query) => handleSearch(query)}
  onLogout={() => handleLogout()}
/>
```

**Props:**
- `user` - User profile (name, email, avatar, role)
- `notifications` - Notification array
- `showSearch` - Show search bar
- `onMenuToggle` - Mobile menu callback
- `onLogout` - Logout callback

#### PlatformNav & PlatformSidebar
```tsx
import { PlatformNav, PlatformSidebar } from "@/components/platform/PlatformNav"

<PlatformSidebar open={sidebarOpen} onOpenChange={setSidebarOpen}>
  <PlatformNav
    items={navItems}
    collapsed={false}
    mobile={false}
    onMobileClose={() => setSidebarOpen(false)}
  />
</PlatformSidebar>
```

**NavItem Interface:**
```typescript
interface NavItem {
  id: string
  label: string
  href: string
  icon?: LucideIcon
  badge?: string | number
  children?: NavItem[]
}
```

### Inventory Components

#### StockBadge
```tsx
import { StockBadge, StockCount, StockProgressBar } from "@/components/inventory/StockBadge"

// Badge
<StockBadge stock={150} lowStockThreshold={50} showIcon showCount />

// Count only
<StockCount stock={75} lowStockThreshold={50} />

// Progress bar
<StockProgressBar current={75} max={200} lowStockThreshold={50} showLabels />
```

**Status Types:** `in-stock | low-stock | out-of-stock | discontinued`

#### ProductCombobox
```tsx
import { ProductCombobox, ProductMultiCombobox } from "@/components/inventory/ProductCombobox"

// Single select
<ProductCombobox
  products={products}
  value={selectedProduct}
  onValueChange={setSelectedProduct}
  placeholder="Search products..."
  showDetails
  clearable
/>

// Multi-select
<ProductMultiCombobox
  products={products}
  value={selectedProducts}
  onValueChange={setSelectedProducts}
  maxSelections={5}
/>
```

#### ProductTable
```tsx
import { ProductTable, ProductTableCompact } from "@/components/inventory/ProductTable"

// Full table
<ProductTable
  products={products}
  searchable
  paginated
  onView={(product) => viewProduct(product)}
  onEdit={(product) => editProduct(product)}
  onDelete={(product) => deleteProduct(product)}
/>

// Compact mobile variant
<ProductTableCompact
  products={products}
  onView={(product) => viewProduct(product)}
/>
```

## 🛠️ Utility Functions

### lib/utils.ts

```typescript
import { cn, formatCurrency, formatNumber, formatDate, truncate, getInitials, debounce, calculatePercentage } from "@/lib/utils"

// Merge Tailwind classes
cn("text-base", "text-lg") // "text-lg"

// Format currency (South African Rand)
formatCurrency(1299.99) // "R1,299.99"

// Format numbers
formatNumber(1000000) // "1,000,000"

// Format dates
formatDate(new Date(), 'long') // "20 October 2025"

// Truncate text
truncate("Long text here", 20) // "Long text here..."

// Get initials
getInitials("John Doe") // "JD"

// Debounce function
const debouncedSearch = debounce(searchFunction, 300)

// Calculate percentage
calculatePercentage(75, 200) // 37.5
```

## 🎨 Tailwind Configuration

Add these to your `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
}
```

Add CSS variables to your `globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
```

## 📝 TypeScript Types

Common types exported from components:

```typescript
// Platform types
import type { Module, UserProfile, Notification, NavItem } from '@/components/platform/*'

// Inventory types
import type { Product } from '@/components/inventory/*'

// Table types
import type { ColumnDef } from '@tanstack/react-table'
```

## ✅ Accessibility Checklist

All components follow WCAG 2.1 Level AA standards:

- ✅ Keyboard navigation support
- ✅ ARIA labels and roles
- ✅ Focus management
- ✅ Screen reader compatible
- ✅ Color contrast ratios
- ✅ Touch target sizes (min 44px)

## 🚀 Usage Example: Complete Dashboard Layout

```tsx
'use client'

import { useState } from 'react'
import { PlatformHeader } from '@/components/platform/PlatformHeader'
import { PlatformSidebar, PlatformNav } from '@/components/platform/PlatformNav'
import { ModuleSwitcher } from '@/components/platform/ModuleSwitcher'
import { ProductTable } from '@/components/inventory/ProductTable'

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <PlatformHeader
        user={{
          name: "John Doe",
          email: "john@example.com",
          role: "Admin"
        }}
        showSearch
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <PlatformSidebar open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <div className="p-4">
            <ModuleSwitcher currentModule="inventory" variant="dropdown" />
          </div>
          <PlatformNav
            mobile={false}
            onMobileClose={() => setSidebarOpen(false)}
          />
        </PlatformSidebar>

        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
          <ProductTable
            products={products}
            searchable
            paginated
            onEdit={(product) => console.log('Edit', product)}
          />
        </main>
      </div>
    </div>
  )
}
```

## 📚 Additional Resources

- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)
- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)

## 🐛 Troubleshooting

### "Module not found" errors
Ensure all dependencies are installed:
```bash
npm install
```

### TypeScript errors
Check that `tsconfig.json` has path alias configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Styling issues
Verify Tailwind is configured properly in `tailwind.config.js` and CSS variables are added to `globals.css`.

---

**Built with:** React 18, TypeScript, Tailwind CSS, Radix UI, TanStack Table
**License:** Proprietary - Horizon Systems Platform
