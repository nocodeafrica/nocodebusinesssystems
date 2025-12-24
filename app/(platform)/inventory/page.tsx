"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatNumber } from "@/lib/utils"

// Mock data - replace with real API calls
const mockMetrics = {
  totalProducts: 1248,
  totalValue: 458920,
  lowStock: 23,
  outOfStock: 5,
  trends: {
    products: 12,
    value: 8.5,
    lowStock: -15,
    outOfStock: -40,
  }
}

const mockRecentActivity = [
  { id: 1, product: "Office Chair Pro", action: "Stock adjusted", quantity: 50, time: "2 hours ago" },
  { id: 2, product: "Wireless Mouse", action: "New product added", quantity: 100, time: "4 hours ago" },
  { id: 3, product: "Laptop Stand", action: "Low stock alert", quantity: 8, time: "5 hours ago" },
  { id: 4, product: "USB-C Cable", action: "Stock adjusted", quantity: -25, time: "1 day ago" },
  { id: 5, product: "Monitor 27\"", action: "Price updated", quantity: 0, time: "1 day ago" },
]

const mockLowStockProducts = [
  { id: 1, name: "Laptop Stand", sku: "LST-001", current: 8, minimum: 20, status: "critical" },
  { id: 2, name: "Wireless Keyboard", sku: "WKB-002", current: 15, minimum: 30, status: "warning" },
  { id: 3, name: "HDMI Cable", sku: "HMC-003", current: 22, minimum: 50, status: "warning" },
  { id: 4, name: "Desk Lamp", sku: "DLP-004", current: 3, minimum: 15, status: "critical" },
]

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  loading?: boolean
}

function MetricCard({ title, value, icon: Icon, trend, trendLabel, loading }: MetricCardProps) {
  const isPositive = trend ? trend > 0 : false
  const isNegative = trend ? trend < 0 : false

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-slate-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-24 bg-slate-200 animate-pulse rounded" />
        ) : (
          <>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                {isPositive && <ArrowUpRight className="h-4 w-4 text-green-600" />}
                {isNegative && <ArrowDownRight className="h-4 w-4 text-red-600" />}
                <span
                  className={`text-xs font-medium ${
                    isPositive
                      ? "text-green-600"
                      : isNegative
                      ? "text-red-600"
                      : "text-slate-600"
                  }`}
                >
                  {isPositive ? "+" : ""}{trend}%
                </span>
                {trendLabel && (
                  <span className="text-xs text-slate-500 ml-1">{trendLabel}</span>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function InventoryDashboard() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(mockMetrics)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="border-b bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Inventory Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Overview of your inventory status and recent activity
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/inventory/stock/adjust">
              <Button variant="outline" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Adjust Stock</span>
              </Button>
            </Link>
            <Link href="/inventory/products/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Total Products"
            value={formatNumber(metrics.totalProducts)}
            icon={Package}
            trend={metrics.trends.products}
            trendLabel="vs last month"
            loading={loading}
          />
          <MetricCard
            title="Total Value"
            value={formatCurrency(metrics.totalValue)}
            icon={DollarSign}
            trend={metrics.trends.value}
            trendLabel="vs last month"
            loading={loading}
          />
          <MetricCard
            title="Low Stock Items"
            value={metrics.lowStock}
            icon={AlertTriangle}
            trend={metrics.trends.lowStock}
            trendLabel="vs last month"
            loading={loading}
          />
          <MetricCard
            title="Out of Stock"
            value={metrics.outOfStock}
            icon={Package}
            trend={metrics.trends.outOfStock}
            trendLabel="vs last month"
            loading={loading}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Low Stock Alerts</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Products that need restocking
                </p>
              </div>
              <Link href="/inventory/stock">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">
                          {product.current} / {product.minimum}
                        </p>
                        <p className="text-xs text-slate-500">Current / Min</p>
                      </div>
                      <Badge
                        variant={product.status === "critical" ? "destructive" : "warning"}
                      >
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Latest inventory updates
                </p>
              </div>
              <Button variant="ghost" size="icon" aria-label="More options">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Package className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {activity.product}
                      </p>
                      <p className="text-xs text-slate-500">{activity.action}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {activity.quantity !== 0 && (
                        <p
                          className={`text-sm font-medium ${
                            activity.quantity > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {activity.quantity > 0 ? "+" : ""}
                          {activity.quantity}
                        </p>
                      )}
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/inventory/products/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <Plus className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Add Product</p>
                    <p className="text-xs text-slate-500">Create new item</p>
                  </div>
                </Button>
              </Link>
              <Link href="/inventory/stock/adjust">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <TrendingUp className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Adjust Stock</p>
                    <p className="text-xs text-slate-500">Update quantities</p>
                  </div>
                </Button>
              </Link>
              <Link href="/inventory/products">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <Package className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-sm font-medium">View Products</p>
                    <p className="text-xs text-slate-500">Browse inventory</p>
                  </div>
                </Button>
              </Link>
              <Link href="/inventory/analytics">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <TrendingUp className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Analytics</p>
                    <p className="text-xs text-slate-500">View reports</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
