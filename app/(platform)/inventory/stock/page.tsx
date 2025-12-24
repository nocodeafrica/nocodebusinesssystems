"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter, AlertTriangle, Package, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"

// Mock stock data
interface StockItem {
  id: string
  productName: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  status: "critical" | "low" | "optimal" | "overstocked"
  daysUntilStockout?: number
}

const mockStockData: StockItem[] = [
  {
    id: "1",
    productName: "Laptop Stand",
    sku: "LST-001",
    category: "Accessories",
    currentStock: 8,
    minStock: 20,
    maxStock: 100,
    unit: "units",
    status: "critical",
    daysUntilStockout: 3,
  },
  {
    id: "2",
    productName: "Desk Lamp",
    sku: "DL-002",
    category: "Lighting",
    currentStock: 3,
    minStock: 15,
    maxStock: 50,
    unit: "units",
    status: "critical",
    daysUntilStockout: 1,
  },
  {
    id: "3",
    productName: "Wireless Keyboard",
    sku: "WK-003",
    category: "Electronics",
    currentStock: 15,
    minStock: 30,
    maxStock: 150,
    unit: "units",
    status: "low",
    daysUntilStockout: 7,
  },
  {
    id: "4",
    productName: "HDMI Cable",
    sku: "HDM-004",
    category: "Cables",
    currentStock: 22,
    minStock: 50,
    maxStock: 200,
    unit: "units",
    status: "low",
    daysUntilStockout: 10,
  },
  {
    id: "5",
    productName: "Office Chair Pro",
    sku: "OCP-005",
    category: "Furniture",
    currentStock: 45,
    minStock: 20,
    maxStock: 80,
    unit: "units",
    status: "optimal",
  },
  {
    id: "6",
    productName: "Wireless Mouse",
    sku: "WM-006",
    category: "Electronics",
    currentStock: 120,
    minStock: 50,
    maxStock: 100,
    unit: "units",
    status: "overstocked",
  },
  {
    id: "7",
    productName: "USB-C Cable",
    sku: "USC-007",
    category: "Cables",
    currentStock: 0,
    minStock: 30,
    maxStock: 150,
    unit: "units",
    status: "critical",
    daysUntilStockout: 0,
  },
  {
    id: "8",
    productName: "Monitor 27\"",
    sku: "MON-008",
    category: "Electronics",
    currentStock: 22,
    minStock: 10,
    maxStock: 40,
    unit: "units",
    status: "optimal",
  },
]

const statusFilters = ["All", "Critical", "Low", "Optimal", "Overstocked"]
const categories = ["All", "Furniture", "Electronics", "Accessories", "Lighting", "Cables"]

function getStatusBadge(status: StockItem["status"]) {
  switch (status) {
    case "critical":
      return <Badge variant="destructive">Critical</Badge>
    case "low":
      return <Badge variant="warning">Low Stock</Badge>
    case "optimal":
      return <Badge variant="success">Optimal</Badge>
    case "overstocked":
      return <Badge variant="secondary">Overstocked</Badge>
  }
}

function getStockPercentage(current: number, min: number, max: number): number {
  return Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100))
}

export default function StockLevelsPage() {
  const [stockData, setStockData] = useState<StockItem[]>(mockStockData)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredStock, setFilteredStock] = useState<StockItem[]>(mockStockData)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter stock based on search, status, and category
    let filtered = stockData

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === selectedStatus.toLowerCase()
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // Sort by status priority (critical first)
    filtered.sort((a, b) => {
      const statusPriority = { critical: 0, low: 1, optimal: 2, overstocked: 3 }
      return statusPriority[a.status] - statusPriority[b.status]
    })

    setFilteredStock(filtered)
  }, [searchQuery, selectedStatus, selectedCategory, stockData])

  const stats = {
    critical: stockData.filter((item) => item.status === "critical").length,
    low: stockData.filter((item) => item.status === "low").length,
    optimal: stockData.filter((item) => item.status === "optimal").length,
    overstocked: stockData.filter((item) => item.status === "overstocked").length,
  }

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="border-b bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Stock Levels</h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor and manage inventory stock levels
            </p>
          </div>
          <Link href="/inventory/stock/adjust">
            <Button className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Adjust Stock</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="border-b bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">
                Critical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{stats.critical}</p>
              <p className="text-xs text-slate-500 mt-1">Needs immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">
                Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{stats.low}</p>
              <p className="text-xs text-slate-500 mt-1">Below minimum levels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">
                Optimal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{stats.optimal}</p>
              <p className="text-xs text-slate-500 mt-1">Healthy stock levels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Overstocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{stats.overstocked}</p>
              <p className="text-xs text-slate-500 mt-1">Above maximum levels</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Search stock items"
            />
          </div>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by status">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by category">
              <Package className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
            </div>
          ) : filteredStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Package className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">
                No stock items found
              </h3>
              <p className="text-sm text-slate-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">Min / Max</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStock.map((item) => {
                      const percentage = getStockPercentage(
                        item.currentStock,
                        item.minStock,
                        item.maxStock
                      )

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.productName}
                          </TableCell>
                          <TableCell className="text-slate-500">{item.sku}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">
                            {formatNumber(item.currentStock)} {item.unit}
                          </TableCell>
                          <TableCell className="text-right text-slate-500">
                            {formatNumber(item.minStock)} / {formatNumber(item.maxStock)}
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  item.status === "critical"
                                    ? "bg-red-600"
                                    : item.status === "low"
                                    ? "bg-yellow-600"
                                    : item.status === "optimal"
                                    ? "bg-green-600"
                                    : "bg-slate-600"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(item.status)}
                              {item.daysUntilStockout !== undefined &&
                                item.daysUntilStockout <= 7 && (
                                  <span className="text-xs text-red-600">
                                    {item.daysUntilStockout === 0
                                      ? "Out of stock"
                                      : `${item.daysUntilStockout}d left`}
                                  </span>
                                )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href="/inventory/stock/adjust">
                              <Button variant="outline" size="sm">
                                Adjust
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-200">
                {filteredStock.map((item) => {
                  const percentage = getStockPercentage(
                    item.currentStock,
                    item.minStock,
                    item.maxStock
                  )

                  return (
                    <div key={item.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-slate-900 truncate">
                            {item.productName}
                          </h3>
                          <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Current Stock</span>
                          <span className="font-medium">
                            {formatNumber(item.currentStock)} {item.unit}
                          </span>
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.status === "critical"
                                ? "bg-red-600"
                                : item.status === "low"
                                ? "bg-yellow-600"
                                : item.status === "optimal"
                                ? "bg-green-600"
                                : "bg-slate-600"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Min: {formatNumber(item.minStock)}</span>
                          <span>Max: {formatNumber(item.maxStock)}</span>
                        </div>

                        {item.daysUntilStockout !== undefined &&
                          item.daysUntilStockout <= 7 && (
                            <div className="flex items-center gap-1 text-xs text-red-600">
                              <AlertTriangle className="h-3 w-3" />
                              <span>
                                {item.daysUntilStockout === 0
                                  ? "Out of stock"
                                  : `${item.daysUntilStockout} days until stockout`}
                              </span>
                            </div>
                          )}

                        <Link href="/inventory/stock/adjust" className="block">
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            Adjust Stock
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
