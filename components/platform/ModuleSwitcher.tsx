'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface Module {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
}

const DEFAULT_MODULES: Module[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Overview and analytics",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-blue-500",
  },
  {
    id: "inventory",
    name: "Inventory",
    description: "Product and stock management",
    icon: Package,
    href: "/inventory",
    color: "text-purple-500",
  },
  {
    id: "sales",
    name: "Sales",
    description: "Orders and transactions",
    icon: DollarSign,
    href: "/sales",
    color: "text-green-500",
  },
  {
    id: "customers",
    name: "Customers",
    description: "Customer relationship management",
    icon: Users,
    href: "/customers",
    color: "text-orange-500",
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Business intelligence and reports",
    icon: TrendingUp,
    href: "/analytics",
    color: "text-pink-500",
  },
  {
    id: "settings",
    name: "Settings",
    description: "System configuration",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
]

export interface ModuleSwitcherProps {
  /**
   * Currently active module ID
   */
  currentModule?: string
  /**
   * Custom modules (overrides default)
   */
  modules?: Module[]
  /**
   * Callback when module changes
   */
  onModuleChange?: (moduleId: string) => void
  /**
   * Display variant
   */
  variant?: "dropdown" | "compact"
  /**
   * Additional class names
   */
  className?: string
}

/**
 * Module switcher component for navigating between platform modules
 *
 * @example
 * ```tsx
 * // Dropdown variant
 * <ModuleSwitcher
 *   currentModule="inventory"
 *   variant="dropdown"
 *   onModuleChange={(id) => console.log('Switched to:', id)}
 * />
 *
 * // Compact variant
 * <ModuleSwitcher
 *   currentModule="inventory"
 *   variant="compact"
 * />
 * ```
 */
export function ModuleSwitcher({
  currentModule,
  modules = DEFAULT_MODULES,
  onModuleChange,
  variant = "dropdown",
  className,
}: ModuleSwitcherProps) {
  const router = useRouter()
  const [selectedModule, setSelectedModule] = React.useState(currentModule)

  const activeModule = modules.find((m) => m.id === selectedModule) || modules[0]

  const handleModuleChange = (moduleId: string) => {
    setSelectedModule(moduleId)
    const module = modules.find((m) => m.id === moduleId)

    if (module) {
      // Navigate to module
      router.push(module.href)

      // Call callback if provided
      onModuleChange?.(moduleId)
    }
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50",
          className
        )}
      >
        <activeModule.icon className={cn("h-5 w-5", activeModule.color)} />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{activeModule.name}</span>
          <span className="text-xs text-muted-foreground">
            {activeModule.description}
          </span>
        </div>
      </div>
    )
  }

  return (
    <Select value={selectedModule} onValueChange={handleModuleChange}>
      <SelectTrigger
        className={cn("w-[280px] h-auto py-2", className)}
        aria-label="Select module"
      >
        <div className="flex items-center gap-3 w-full">
          <activeModule.icon className={cn("h-5 w-5 shrink-0", activeModule.color)} />
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-semibold">{activeModule.name}</span>
            <span className="text-xs text-muted-foreground">
              {activeModule.description}
            </span>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent>
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <SelectItem
              key={module.id}
              value={module.id}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 py-1">
                <Icon className={cn("h-5 w-5 shrink-0", module.color)} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{module.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {module.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
