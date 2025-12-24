'use client'

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2, Eye, Package } from "lucide-react"
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { StockBadge, StockCount } from "@/components/inventory/StockBadge"
import { formatCurrency } from "@/lib/utils"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  cost?: number
  stock: number
  lowStockThreshold?: number
  image?: string
  description?: string
  supplier?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ProductTableProps {
  /**
   * Products to display
   */
  products: Product[]
  /**
   * Enable search
   */
  searchable?: boolean
  /**
   * Enable pagination
   */
  paginated?: boolean
  /**
   * Action callbacks
   */
  onView?: (product: Product) => void
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  /**
   * Loading state
   */
  loading?: boolean
  /**
   * Additional class names
   */
  className?: string
}

/**
 * Product data table with actions
 *
 * @example
 * ```tsx
 * <ProductTable
 *   products={products}
 *   searchable
 *   paginated
 *   onView={(product) => console.log('View:', product)}
 *   onEdit={(product) => console.log('Edit:', product)}
 *   onDelete={(product) => console.log('Delete:', product)}
 * />
 * ```
 */
export function ProductTable({
  products,
  searchable = true,
  paginated = true,
  onView,
  onEdit,
  onDelete,
  loading = false,
  className,
}: ProductTableProps) {
  const columns: ColumnDef<Product>[] = React.useMemo(
    () => [
      {
        accessorKey: "image",
        header: "",
        cell: ({ row }) => {
          const product = row.original
          return product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-10 w-10 rounded object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          )
        },
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Product" />
        ),
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex flex-col">
              <span className="font-medium">{product.name}</span>
              <span className="text-xs text-muted-foreground">
                SKU: {product.sku}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ row }) => (
          <span className="px-2 py-1 bg-muted rounded-md text-sm">
            {row.getValue("category")}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => {
          const price = row.getValue("price") as number
          return (
            <span className="font-mono font-medium">
              {formatCurrency(price)}
            </span>
          )
        },
      },
      {
        accessorKey: "stock",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Stock" />
        ),
        cell: ({ row }) => {
          const product = row.original
          return (
            <div className="flex flex-col gap-1">
              <StockCount
                stock={product.stock}
                lowStockThreshold={product.lowStockThreshold}
              />
              <StockBadge
                stock={product.stock}
                lowStockThreshold={product.lowStockThreshold}
                showIcon
              />
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const product = row.original
          return (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Open menu"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[160px] bg-background border rounded-md shadow-md p-1 z-50"
                  align="end"
                >
                  {onView && (
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer outline-none"
                      onSelect={() => onView(product)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </DropdownMenu.Item>
                  )}
                  {onEdit && (
                    <DropdownMenu.Item
                      className="flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer outline-none"
                      onSelect={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit Product
                    </DropdownMenu.Item>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenu.Separator className="h-px bg-border my-1" />
                      <DropdownMenu.Item
                        className="flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer outline-none text-destructive focus:text-destructive"
                        onSelect={() => onDelete(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Product
                      </DropdownMenu.Item>
                    </>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )
        },
        enableSorting: false,
      },
    ],
    [onView, onEdit, onDelete]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={products}
      searchable={searchable}
      searchKey="name"
      searchPlaceholder="Search products..."
      paginated={paginated}
      defaultPageSize={10}
      pageSizeOptions={[10, 20, 50, 100]}
      emptyState={
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Get started by adding your first product.
          </p>
        </div>
      }
      className={className}
    />
  )
}

/**
 * Compact product table variant for smaller displays
 */
export function ProductTableCompact({
  products,
  onView,
  className,
}: Pick<ProductTableProps, "products" | "onView" | "className">) {
  return (
    <div className={className}>
      <div className="divide-y border rounded-md">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="p-4 hover:bg-muted/50 cursor-pointer"
              onClick={() => onView?.(product)}
            >
              <div className="flex items-start gap-3">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded object-cover shrink-0"
                  />
                ) : (
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{product.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    SKU: {product.sku}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono text-sm font-medium">
                      {formatCurrency(product.price)}
                    </span>
                    <StockBadge
                      stock={product.stock}
                      lowStockThreshold={product.lowStockThreshold}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
