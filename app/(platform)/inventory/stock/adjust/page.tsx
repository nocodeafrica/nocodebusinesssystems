"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Search, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatNumber } from "@/lib/utils"

// Mock product data for selection
interface Product {
  id: string
  name: string
  sku: string
  currentStock: number
  unit: string
}

const mockProducts: Product[] = [
  { id: "1", name: "Office Chair Pro", sku: "OCP-001", currentStock: 45, unit: "units" },
  { id: "2", name: "Wireless Mouse", sku: "WM-002", currentStock: 120, unit: "units" },
  { id: "3", name: "Laptop Stand", sku: "LST-003", currentStock: 8, unit: "units" },
  { id: "4", name: "USB-C Cable", sku: "USC-004", currentStock: 0, unit: "units" },
  { id: "5", name: "Desk Lamp", sku: "DL-005", currentStock: 3, unit: "units" },
  { id: "6", name: "Wireless Keyboard", sku: "WKB-006", currentStock: 15, unit: "units" },
  { id: "7", name: "Monitor 27\"", sku: "MON-007", currentStock: 22, unit: "units" },
  { id: "8", name: "HDMI Cable", sku: "HDM-008", currentStock: 200, unit: "units" },
]

const adjustmentTypes = [
  { value: "adjustment", label: "Manual Adjustment", description: "General stock count correction" },
  { value: "purchase", label: "Purchase/Delivery", description: "Stock received from supplier" },
  { value: "sale", label: "Sale/Order", description: "Stock sold to customer" },
  { value: "return", label: "Return", description: "Stock returned by customer" },
  { value: "damaged", label: "Damaged/Lost", description: "Stock damaged or lost" },
  { value: "transfer", label: "Transfer", description: "Stock transferred to another location" },
]

interface FormData {
  productId: string
  adjustmentType: string
  quantity: string
  reason: string
}

export default function StockAdjustmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [formData, setFormData] = useState<FormData>({
    productId: "",
    adjustmentType: "",
    quantity: "",
    reason: "",
  })

  useEffect(() => {
    // Filter products based on search
    if (searchQuery) {
      const filtered = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(mockProducts)
    }
  }, [searchQuery])

  const handleProductSelect = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId)
    setSelectedProduct(product || null)
    setFormData((prev) => ({ ...prev, productId }))
    if (errors.productId) {
      setErrors((prev) => ({ ...prev, productId: "" }))
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleQuickAdjust = (amount: number) => {
    const currentQty = parseInt(formData.quantity) || 0
    const newQty = currentQty + amount
    setFormData((prev) => ({ ...prev, quantity: newQty.toString() }))
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.productId) {
      newErrors.productId = "Please select a product"
    }

    if (!formData.adjustmentType) {
      newErrors.adjustmentType = "Please select an adjustment type"
    }

    if (!formData.quantity || parseInt(formData.quantity) === 0) {
      newErrors.quantity = "Quantity cannot be zero"
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Please provide a reason for this adjustment"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // TODO: Replace with actual API call
      console.log("Stock adjustment:", formData)

      // Redirect to stock page
      router.push("/inventory/stock")
    } catch (error) {
      console.error("Error adjusting stock:", error)
      // TODO: Show error message to user
    } finally {
      setLoading(false)
    }
  }

  const newStock = selectedProduct
    ? selectedProduct.currentStock + parseInt(formData.quantity || "0")
    : 0

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="border-b bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/inventory/stock">
            <Button variant="ghost" size="icon" aria-label="Back to stock levels">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Adjust Stock</h1>
            <p className="mt-1 text-sm text-slate-500">
              Update inventory stock levels
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search by product name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  aria-label="Search products"
                />
              </div>

              {/* Product List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductSelect(product.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                      formData.productId === product.id
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">
                          {formatNumber(product.currentStock)} {product.unit}
                        </p>
                        <p className="text-xs text-slate-500">Current stock</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {errors.productId && (
                <p className="text-sm text-red-600">{errors.productId}</p>
              )}
            </CardContent>
          </Card>

          {/* Adjustment Details */}
          {selectedProduct && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Adjustment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Adjustment Type */}
                  <div className="space-y-2">
                    <Label htmlFor="adjustmentType">
                      Adjustment Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.adjustmentType}
                      onValueChange={(value) => handleChange("adjustmentType", value)}
                    >
                      <SelectTrigger id="adjustmentType" aria-invalid={!!errors.adjustmentType}>
                        <SelectValue placeholder="Select adjustment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {adjustmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <p className="font-medium">{type.label}</p>
                              <p className="text-xs text-slate-500">{type.description}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.adjustmentType && (
                      <p className="text-sm text-red-600">{errors.adjustmentType}</p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Quantity Change <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuickAdjust(-10)}
                        aria-label="Decrease by 10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuickAdjust(-1)}
                        aria-label="Decrease by 1"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleChange("quantity", e.target.value)}
                        placeholder="0"
                        className="text-center"
                        aria-invalid={!!errors.quantity}
                        aria-describedby={errors.quantity ? "quantity-error" : undefined}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuickAdjust(1)}
                        aria-label="Increase by 1"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuickAdjust(10)}
                        aria-label="Increase by 10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Use negative numbers to decrease stock, positive to increase
                    </p>
                    {errors.quantity && (
                      <p id="quantity-error" className="text-sm text-red-600">
                        {errors.quantity}
                      </p>
                    )}
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label htmlFor="reason">
                      Reason <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => handleChange("reason", e.target.value)}
                      placeholder="Enter reason for stock adjustment..."
                      rows={3}
                      aria-invalid={!!errors.reason}
                      aria-describedby={errors.reason ? "reason-error" : undefined}
                    />
                    {errors.reason && (
                      <p id="reason-error" className="text-sm text-red-600">
                        {errors.reason}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <span className="text-sm text-slate-600">Product</span>
                      <span className="text-sm font-medium text-slate-900">
                        {selectedProduct.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b">
                      <span className="text-sm text-slate-600">Current Stock</span>
                      <span className="text-sm font-medium text-slate-900">
                        {formatNumber(selectedProduct.currentStock)} {selectedProduct.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b">
                      <span className="text-sm text-slate-600">Adjustment</span>
                      <span
                        className={`text-sm font-medium ${
                          parseInt(formData.quantity || "0") > 0
                            ? "text-green-600"
                            : parseInt(formData.quantity || "0") < 0
                            ? "text-red-600"
                            : "text-slate-900"
                        }`}
                      >
                        {parseInt(formData.quantity || "0") > 0 ? "+" : ""}
                        {formData.quantity || "0"} {selectedProduct.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <span className="text-base font-medium text-slate-900">New Stock</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900">
                          {formatNumber(newStock)} {selectedProduct.unit}
                        </span>
                        {newStock < 0 && (
                          <Badge variant="destructive">Invalid</Badge>
                        )}
                        {newStock === 0 && (
                          <Badge variant="warning">Empty</Badge>
                        )}
                      </div>
                    </div>

                    {newStock < 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          Warning: This adjustment would result in negative stock. Please adjust the quantity.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            <Link href="/inventory/stock">
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading || !selectedProduct || newStock < 0}
              className="gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Adjustment
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
