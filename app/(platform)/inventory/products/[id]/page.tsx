"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2, Package, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"

// Mock product data
interface Product {
  id: string
  name: string
  sku: string
  category: string
  description: string
  price: number
  cost: number
  stock: number
  minStock: number
  unit: string
  barcode: string
  status: "in_stock" | "low_stock" | "out_of_stock"
  createdAt: string
  lastUpdated: string
}

interface StockHistory {
  id: string
  date: string
  type: "adjustment" | "sale" | "purchase" | "return"
  quantity: number
  reason: string
  user: string
}

const mockProduct: Product = {
  id: "1",
  name: "Office Chair Pro",
  sku: "OCP-001",
  category: "Furniture",
  description: "Premium ergonomic office chair with lumbar support and adjustable armrests. Perfect for long working hours.",
  price: 2499.99,
  cost: 1800.00,
  stock: 45,
  minStock: 20,
  unit: "units",
  barcode: "1234567890123",
  status: "in_stock",
  createdAt: "2025-09-15T10:30:00Z",
  lastUpdated: "2025-10-15T14:22:00Z",
}

const mockStockHistory: StockHistory[] = [
  {
    id: "1",
    date: "2025-10-15T14:22:00Z",
    type: "adjustment",
    quantity: 10,
    reason: "Inventory count correction",
    user: "John Doe",
  },
  {
    id: "2",
    date: "2025-10-10T09:15:00Z",
    type: "sale",
    quantity: -5,
    reason: "Customer order #1234",
    user: "System",
  },
  {
    id: "3",
    date: "2025-10-05T16:45:00Z",
    type: "purchase",
    quantity: 50,
    reason: "New stock delivery",
    user: "Jane Smith",
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [stockHistory, setStockHistory] = useState<StockHistory[]>(mockStockHistory)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProduct(mockProduct)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    try {
      // TODO: Replace with actual API call
      console.log("Deleting product:", params.id)
      router.push("/inventory/products")
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "in_stock":
        return <Badge variant="success">In Stock</Badge>
      case "low_stock":
        return <Badge variant="warning">Low Stock</Badge>
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>
    }
  }

  const getHistoryIcon = (type: StockHistory["type"]) => {
    switch (type) {
      case "adjustment":
        return <Package className="h-4 w-4" />
      case "sale":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "purchase":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "return":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Package className="h-16 w-16 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-4">The product you're looking for doesn't exist.</p>
        <Link href="/inventory/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    )
  }

  const profitMargin = product.price - product.cost
  const profitPercentage = (profitMargin / product.price) * 100
  const totalValue = product.stock * product.price

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="border-b bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <Link href="/inventory/products">
              <Button variant="ghost" size="icon" aria-label="Back to products">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900 truncate">
                  {product.name}
                </h1>
                {getStatusBadge(product.status)}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>SKU: {product.sku}</span>
                <span>•</span>
                <span>{product.category}</span>
                <span>•</span>
                <span>Last updated: {formatDate(product.lastUpdated, "short")}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link href={`/inventory/products/${product.id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Current Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-900">
                  {product.stock} {product.unit}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Min: {product.minStock} {product.unit}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Selling Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Cost: {formatCurrency(product.cost)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Profit Margin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(profitMargin)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {profitPercentage.toFixed(1)}% margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(totalValue)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {product.stock} × {formatCurrency(product.price)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Product Details & Stock History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.description && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-1">Description</h3>
                    <p className="text-sm text-slate-600">{product.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-1">Category</h3>
                    <p className="text-sm text-slate-900">{product.category}</p>
                  </div>

                  {product.barcode && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-700 mb-1">Barcode</h3>
                      <p className="text-sm text-slate-900">{product.barcode}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-1">Unit</h3>
                    <p className="text-sm text-slate-900 capitalize">{product.unit}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-1">Created</h3>
                    <p className="text-sm text-slate-900">
                      {formatDate(product.createdAt, "short")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock History */}
            <Card>
              <CardHeader>
                <CardTitle>Stock History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        {getHistoryIcon(entry.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-slate-900 capitalize">
                            {entry.type}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              entry.quantity > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {entry.quantity > 0 ? "+" : ""}
                            {entry.quantity}
                          </p>
                        </div>
                        <p className="text-xs text-slate-600">{entry.reason}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-slate-500">
                            {formatDate(entry.date, "short")}
                          </p>
                          <span className="text-xs text-slate-400">•</span>
                          <p className="text-xs text-slate-500">{entry.user}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/inventory/stock/adjust" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                    <Package className="h-4 w-4" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Adjust Stock</p>
                      <p className="text-xs text-slate-500">Update quantities</p>
                    </div>
                  </Button>
                </Link>

                <Link href={`/inventory/products/${product.id}/edit`} className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                    <Edit className="h-4 w-4" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Edit Product</p>
                      <p className="text-xs text-slate-500">Update details</p>
                    </div>
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Delete Product</p>
                    <p className="text-xs text-slate-500">Remove from inventory</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
