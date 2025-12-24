"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Module {
  id: string
  name: string
  icon: React.ElementType
  href: string
  color: string
}

const modules: Module[] = [
  {
    id: "inventory",
    name: "Inventory",
    icon: Package,
    href: "/inventory",
    color: "text-blue-600",
  },
  {
    id: "hr",
    name: "HR & Payroll",
    icon: Users,
    href: "/hr",
    color: "text-purple-600",
  },
  {
    id: "accounting",
    name: "Accounting",
    icon: FileText,
    href: "/accounting",
    color: "text-green-600",
  },
]

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [moduleDropdownOpen, setModuleDropdownOpen] = useState(false)
  const pathname = usePathname()

  // Determine current module from pathname
  const currentModule = modules.find((module) =>
    pathname.startsWith(`/(platform)${module.href}`) || pathname.startsWith(module.href)
  ) || modules[0]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo + Module Switcher */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-slate-900" />
              <span className="hidden sm:inline-block text-xl font-bold text-slate-900">
                Horizon Systems
              </span>
            </Link>

            {/* Module Switcher (Desktop) */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setModuleDropdownOpen(!moduleDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
                aria-expanded={moduleDropdownOpen}
                aria-haspopup="true"
              >
                <currentModule.icon className={cn("h-4 w-4", currentModule.color)} />
                <span>{currentModule.name}</span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>

              {moduleDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg">
                  <div className="p-2">
                    {modules.map((module) => (
                      <Link
                        key={module.id}
                        href={module.href}
                        onClick={() => setModuleDropdownOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          pathname.startsWith(module.href)
                            ? "bg-slate-100 font-medium"
                            : "hover:bg-slate-50"
                        )}
                      >
                        <module.icon className={cn("h-4 w-4", module.color)} />
                        <span>{module.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="gap-2" aria-label="Logout">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Module Switcher Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Module Switcher Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 transform border-r bg-white transition-transform duration-200 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <span className="text-lg font-semibold">Modules</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-1">
          {modules.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                pathname.startsWith(module.href)
                  ? "bg-slate-100 font-medium"
                  : "hover:bg-slate-50"
              )}
            >
              <module.icon className={cn("h-5 w-5", module.color)} />
              <span>{module.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-full">{children}</main>
    </div>
  )
}
