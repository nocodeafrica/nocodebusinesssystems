"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Boxes, TrendingUp, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  badge?: string
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/inventory",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/inventory/products",
    icon: Package,
  },
  {
    name: "Stock Levels",
    href: "/inventory/stock",
    icon: Boxes,
  },
  {
    name: "Analytics",
    href: "/inventory/analytics",
    icon: TrendingUp,
  },
  {
    name: "Settings",
    href: "/inventory/settings",
    icon: Settings,
  },
]

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:bg-white">
        <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
          <div className="px-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Inventory</h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage products and stock
            </p>
          </div>

          <nav className="flex-1 px-3 space-y-1" aria-label="Inventory navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/inventory" && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Navigation (Tabs) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t bg-white">
        <nav className="flex justify-around" aria-label="Mobile inventory navigation">
          {navigation.slice(0, 4).map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/inventory" && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors min-h-touch-target",
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:overflow-y-auto pb-16 lg:pb-0">
        {children}
      </div>
    </div>
  )
}
