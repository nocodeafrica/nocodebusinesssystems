'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  LucideIcon,
  Home,
  Package,
  Users,
  DollarSign,
  BarChart3,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface NavItem {
  id: string
  label: string
  href: string
  icon?: LucideIcon
  badge?: string | number
  children?: NavItem[]
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    id: "inventory",
    label: "Inventory",
    href: "/inventory",
    icon: Package,
    children: [
      { id: "products", label: "Products", href: "/inventory/products" },
      { id: "categories", label: "Categories", href: "/inventory/categories" },
      { id: "suppliers", label: "Suppliers", href: "/inventory/suppliers" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    href: "/sales",
    icon: DollarSign,
    children: [
      { id: "orders", label: "Orders", href: "/sales/orders" },
      { id: "invoices", label: "Invoices", href: "/sales/invoices" },
      { id: "payments", label: "Payments", href: "/sales/payments" },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export interface PlatformNavProps {
  /**
   * Navigation items (overrides default)
   */
  items?: NavItem[]
  /**
   * Show in collapsed state
   */
  collapsed?: boolean
  /**
   * Callback when collapse state changes
   */
  onCollapsedChange?: (collapsed: boolean) => void
  /**
   * Mobile mode
   */
  mobile?: boolean
  /**
   * Callback when mobile nav closes
   */
  onMobileClose?: () => void
  /**
   * Additional class names
   */
  className?: string
}

/**
 * Platform navigation sidebar
 *
 * @example
 * ```tsx
 * <PlatformNav
 *   items={navItems}
 *   collapsed={false}
 *   onCollapsedChange={setCollapsed}
 * />
 * ```
 */
export function PlatformNav({
  items = DEFAULT_NAV_ITEMS,
  collapsed = false,
  onCollapsedChange,
  mobile = false,
  onMobileClose,
  className,
}: PlatformNavProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  const hasActiveChild = (item: NavItem) => {
    return item.children?.some((child) => isActive(child.href)) || false
  }

  React.useEffect(() => {
    // Auto-expand parent items with active children
    items.forEach((item) => {
      if (item.children && hasActiveChild(item)) {
        setExpandedItems((prev) =>
          prev.includes(item.id) ? prev : [...prev, item.id]
        )
      }
    })
  }, [pathname, items])

  const NavLink = ({
    item,
    depth = 0,
  }: {
    item: NavItem
    depth?: number
  }) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const active = isActive(item.href)
    const Icon = item.icon

    const handleClick = (e: React.MouseEvent) => {
      if (hasChildren) {
        e.preventDefault()
        toggleExpanded(item.id)
      } else if (mobile) {
        onMobileClose?.()
      }
    }

    return (
      <div>
        <Link
          href={item.href}
          onClick={handleClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
            active && "bg-accent text-accent-foreground",
            depth > 0 && "ml-4",
            collapsed && "justify-center"
          )}
          title={collapsed ? item.label : undefined}
        >
          {Icon && (
            <Icon
              className={cn(
                "h-5 w-5 shrink-0",
                active && "text-primary"
              )}
            />
          )}
          {!collapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              )}
            </>
          )}
        </Link>

        {/* Child items */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavLink key={child.id} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav
      className={cn(
        "flex flex-col gap-2 p-4",
        mobile && "h-full overflow-y-auto",
        className
      )}
      aria-label="Platform navigation"
    >
      {items.map((item) => (
        <NavLink key={item.id} item={item} />
      ))}

      {/* Collapse toggle (desktop only) */}
      {!mobile && onCollapsedChange && (
        <div className="mt-auto pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => onCollapsedChange(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed ? "-rotate-90" : "rotate-90"
              )}
            />
            {!collapsed && <span>Collapse</span>}
          </Button>
        </div>
      )}
    </nav>
  )
}

/**
 * Platform sidebar wrapper with responsive behavior
 *
 * @example
 * ```tsx
 * <PlatformSidebar
 *   open={sidebarOpen}
 *   onOpenChange={setSidebarOpen}
 * >
 *   <PlatformNav items={navItems} />
 * </PlatformSidebar>
 * ```
 */
export interface PlatformSidebarProps {
  /**
   * Sidebar content
   */
  children: React.ReactNode
  /**
   * Open state (mobile)
   */
  open?: boolean
  /**
   * Open state change callback
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Additional class names
   */
  className?: string
}

export function PlatformSidebar({
  children,
  open = false,
  onOpenChange,
  className,
}: PlatformSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => onOpenChange?.(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:sticky lg:top-16",
          className
        )}
        aria-label="Sidebar"
      >
        {children}
      </aside>
    </>
  )
}
