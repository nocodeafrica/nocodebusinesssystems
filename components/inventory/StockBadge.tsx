import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

const stockBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      status: {
        "in-stock": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        "low-stock": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        "out-of-stock": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        "discontinued": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      },
    },
    defaultVariants: {
      status: "in-stock",
    },
  }
)

export interface StockBadgeProps extends VariantProps<typeof stockBadgeVariants> {
  /**
   * Current stock quantity
   */
  stock: number
  /**
   * Low stock threshold
   */
  lowStockThreshold?: number
  /**
   * Show icon
   */
  showIcon?: boolean
  /**
   * Show stock count
   */
  showCount?: boolean
  /**
   * Custom status (overrides auto-detection)
   */
  status?: "in-stock" | "low-stock" | "out-of-stock" | "discontinued"
  /**
   * Additional class names
   */
  className?: string
}

/**
 * Stock level badge component with color-coded status
 *
 * @example
 * ```tsx
 * // Auto-detect status
 * <StockBadge stock={150} lowStockThreshold={50} showIcon showCount />
 *
 * // Low stock
 * <StockBadge stock={25} lowStockThreshold={50} showIcon />
 *
 * // Out of stock
 * <StockBadge stock={0} showIcon />
 *
 * // Manual status
 * <StockBadge stock={0} status="discontinued" />
 * ```
 */
export function StockBadge({
  stock,
  lowStockThreshold = 20,
  showIcon = false,
  showCount = false,
  status,
  className,
}: StockBadgeProps) {
  // Auto-detect status if not provided
  const autoStatus = React.useMemo(() => {
    if (status) return status

    if (stock === 0) return "out-of-stock"
    if (stock <= lowStockThreshold) return "low-stock"
    return "in-stock"
  }, [stock, lowStockThreshold, status])

  const statusConfig = {
    "in-stock": {
      label: "In Stock",
      icon: CheckCircle2,
    },
    "low-stock": {
      label: "Low Stock",
      icon: AlertTriangle,
    },
    "out-of-stock": {
      label: "Out of Stock",
      icon: XCircle,
    },
    "discontinued": {
      label: "Discontinued",
      icon: AlertCircle,
    },
  }

  const config = statusConfig[autoStatus]
  const Icon = config.icon

  return (
    <span
      className={cn(stockBadgeVariants({ status: autoStatus }), className)}
      role="status"
      aria-label={`${config.label}${showCount ? `: ${stock} units` : ""}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>{config.label}</span>
      {showCount && stock > 0 && (
        <span className="font-mono">({stock})</span>
      )}
    </span>
  )
}

/**
 * Simple numeric stock indicator
 *
 * @example
 * ```tsx
 * <StockCount stock={150} />
 * <StockCount stock={25} lowStockThreshold={50} />
 * ```
 */
export interface StockCountProps {
  stock: number
  lowStockThreshold?: number
  className?: string
}

export function StockCount({
  stock,
  lowStockThreshold = 20,
  className,
}: StockCountProps) {
  const isLowStock = stock > 0 && stock <= lowStockThreshold
  const isOutOfStock = stock === 0

  return (
    <span
      className={cn(
        "font-mono text-sm font-medium",
        isOutOfStock && "text-red-600",
        isLowStock && "text-yellow-600",
        !isOutOfStock && !isLowStock && "text-green-600",
        className
      )}
      aria-label={`${stock} units in stock`}
    >
      {stock.toLocaleString()}
    </span>
  )
}

/**
 * Stock progress bar
 *
 * @example
 * ```tsx
 * <StockProgressBar
 *   current={75}
 *   max={200}
 *   lowStockThreshold={50}
 * />
 * ```
 */
export interface StockProgressBarProps {
  /**
   * Current stock level
   */
  current: number
  /**
   * Maximum stock capacity
   */
  max: number
  /**
   * Low stock threshold
   */
  lowStockThreshold?: number
  /**
   * Show labels
   */
  showLabels?: boolean
  /**
   * Additional class names
   */
  className?: string
}

export function StockProgressBar({
  current,
  max,
  lowStockThreshold = 20,
  showLabels = true,
  className,
}: StockProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100)
  const lowStockPercentage = (lowStockThreshold / max) * 100

  const getColor = () => {
    if (current === 0) return "bg-red-500"
    if (percentage <= lowStockPercentage) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className={cn("w-full space-y-1", className)}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Stock Level</span>
          <span className="font-mono">
            {current.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-300", getColor())}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`Stock level: ${current} of ${max} units`}
        />
      </div>
    </div>
  )
}
