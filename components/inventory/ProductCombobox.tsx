'use client'

import * as React from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as Popover from "@radix-ui/react-popover"

export interface Product {
  id: string
  name: string
  sku?: string
  category?: string
  price?: number
  stock?: number
  image?: string
}

export interface ProductComboboxProps {
  /**
   * Available products
   */
  products: Product[]
  /**
   * Selected product
   */
  value?: Product
  /**
   * Selection change callback
   */
  onValueChange?: (product: Product | undefined) => void
  /**
   * Placeholder text
   */
  placeholder?: string
  /**
   * Empty state text
   */
  emptyText?: string
  /**
   * Allow clearing selection
   */
  clearable?: boolean
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Show product details
   */
  showDetails?: boolean
  /**
   * Additional class names
   */
  className?: string
}

/**
 * Product search and select combobox component
 *
 * @example
 * ```tsx
 * const [selectedProduct, setSelectedProduct] = useState<Product>()
 *
 * <ProductCombobox
 *   products={products}
 *   value={selectedProduct}
 *   onValueChange={setSelectedProduct}
 *   placeholder="Search products..."
 *   showDetails
 *   clearable
 * />
 * ```
 */
export function ProductCombobox({
  products,
  value,
  onValueChange,
  placeholder = "Select product...",
  emptyText = "No products found.",
  clearable = false,
  disabled = false,
  showDetails = true,
  className,
}: ProductComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredProducts = React.useMemo(() => {
    if (!search) return products

    const searchLower = search.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower)
    )
  }, [products, search])

  const handleSelect = (product: Product) => {
    if (value?.id === product.id && clearable) {
      onValueChange?.(undefined)
    } else {
      onValueChange?.(product)
    }
    setOpen(false)
    setSearch("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange?.(undefined)
    setSearch("")
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select product"
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {value ? (
              <>
                {value.image && (
                  <img
                    src={value.image}
                    alt={value.name}
                    className="h-6 w-6 rounded object-cover shrink-0"
                  />
                )}
                <div className="flex flex-col items-start min-w-0">
                  <span className="truncate text-sm font-medium">
                    {value.name}
                  </span>
                  {showDetails && value.sku && (
                    <span className="text-xs text-muted-foreground truncate">
                      SKU: {value.sku}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {clearable && value && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-background border rounded-md shadow-md z-50"
          align="start"
          sideOffset={4}
        >
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredProducts.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer transition-colors text-left",
                      value?.id === product.id && "bg-accent"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-8 w-8 rounded object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {product.name}
                        </div>
                        {showDetails && (
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            {product.sku && <span>SKU: {product.sku}</span>}
                            {product.category && (
                              <span className="px-1.5 py-0.5 bg-muted rounded">
                                {product.category}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {showDetails && product.price !== undefined && (
                      <div className="text-sm font-medium shrink-0">
                        R{product.price.toFixed(2)}
                      </div>
                    )}
                    {value?.id === product.id && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

/**
 * Multi-product combobox for selecting multiple products
 *
 * @example
 * ```tsx
 * const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
 *
 * <ProductMultiCombobox
 *   products={products}
 *   value={selectedProducts}
 *   onValueChange={setSelectedProducts}
 * />
 * ```
 */
export interface ProductMultiComboboxProps {
  products: Product[]
  value?: Product[]
  onValueChange?: (products: Product[]) => void
  placeholder?: string
  maxSelections?: number
  className?: string
}

export function ProductMultiCombobox({
  products,
  value = [],
  onValueChange,
  placeholder = "Select products...",
  maxSelections,
  className,
}: ProductMultiComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredProducts = React.useMemo(() => {
    if (!search) return products

    const searchLower = search.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower)
    )
  }, [products, search])

  const handleSelect = (product: Product) => {
    const isSelected = value.some((p) => p.id === product.id)

    if (isSelected) {
      onValueChange?.(value.filter((p) => p.id !== product.id))
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return
      }
      onValueChange?.([...value, product])
    }
  }

  const handleRemove = (productId: string) => {
    onValueChange?.(value.filter((p) => p.id !== productId))
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {value.length > 0
                ? `${value.length} product${value.length > 1 ? "s" : ""} selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-[var(--radix-popover-trigger-width)] p-0 bg-background border rounded-md shadow-md z-50"
            align="start"
            sideOffset={4}
          >
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredProducts.map((product) => {
                const isSelected = value.some((p) => p.id === product.id)
                return (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer transition-colors",
                      isSelected && "bg-accent"
                    )}
                  >
                    <div className="flex-1 text-left">
                      <div className="font-medium">{product.name}</div>
                      {product.sku && (
                        <div className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                )
              })}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Selected products */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((product) => (
            <div
              key={product.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent rounded-md text-sm"
            >
              <span className="truncate max-w-[150px]">{product.name}</span>
              <button
                onClick={() => handleRemove(product.id)}
                className="hover:bg-accent-foreground/10 rounded p-0.5"
                aria-label={`Remove ${product.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
