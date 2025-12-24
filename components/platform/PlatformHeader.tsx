'use client'

import * as React from "react"
import Link from "next/link"
import { Bell, Search, Settings, User, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn, getInitials } from "@/lib/utils"

export interface UserProfile {
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  type?: "info" | "warning" | "error" | "success"
}

export interface PlatformHeaderProps {
  /**
   * User profile information
   */
  user?: UserProfile
  /**
   * Notifications
   */
  notifications?: Notification[]
  /**
   * Show search bar
   */
  showSearch?: boolean
  /**
   * Search placeholder
   */
  searchPlaceholder?: string
  /**
   * Search callback
   */
  onSearch?: (query: string) => void
  /**
   * Mobile menu toggle callback
   */
  onMenuToggle?: () => void
  /**
   * Logout callback
   */
  onLogout?: () => void
  /**
   * Custom logo component
   */
  logo?: React.ReactNode
  /**
   * Additional header content
   */
  children?: React.ReactNode
  /**
   * Additional class names
   */
  className?: string
}

/**
 * Platform header component with user profile, notifications, and search
 *
 * @example
 * ```tsx
 * <PlatformHeader
 *   user={{
 *     name: "John Doe",
 *     email: "john@example.com",
 *     role: "Admin"
 *   }}
 *   notifications={notifications}
 *   showSearch
 *   onSearch={(query) => console.log('Search:', query)}
 *   onLogout={() => console.log('Logout')}
 * />
 * ```
 */
export function PlatformHeader({
  user,
  notifications = [],
  showSearch = true,
  searchPlaceholder = "Search...",
  onSearch,
  onMenuToggle,
  onLogout,
  logo,
  children,
  className,
}: PlatformHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [showUserMenu, setShowUserMenu] = React.useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          {logo || (
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HS</span>
              </div>
              <span className="hidden sm:inline-block font-semibold text-lg">
                Horizon Systems
              </span>
            </Link>
          )}
        </div>

        {/* Search */}
        {showSearch && (
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
                aria-label="Search"
              />
            </div>
          </form>
        )}

        {/* Custom content */}
        {children && <div className="flex-1">{children}</div>}

        {/* Spacer */}
        {!showSearch && !children && <div className="flex-1" />}

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-background border rounded-lg shadow-lg p-4 space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 rounded-md border text-sm space-y-1",
                          !notification.read && "bg-muted/50"
                        )}
                      >
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {notification.message}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Settings"
          >
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>

          {/* User menu */}
          {user && (
            <div className="relative">
              <Button
                variant="ghost"
                className="gap-2 px-2"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  {user.role && (
                    <span className="text-xs text-muted-foreground">
                      {user.role}
                    </span>
                  )}
                </div>
              </Button>

              {/* User dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-56 bg-background border rounded-lg shadow-lg p-2">
                  <div className="px-3 py-2 border-b mb-2">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    asChild
                  >
                    <Link href="/profile">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    asChild
                  >
                    <Link href="/settings">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                  {onLogout && (
                    <>
                      <div className="border-t my-2" />
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                        onClick={onLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
