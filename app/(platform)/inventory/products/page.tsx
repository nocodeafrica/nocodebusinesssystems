"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Filter, MoreVertical, Edit, Eye, Trash2, Package } from "lucide-react"
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
import { formatCurrency } from "@/lib/utils"

// Mock product data
interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: "in_stock" | "low_stock" | "out_of_stock"
  lastUpdated: string
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Office Chair Pro",
    sku: "OCP-001",
    category: "Furniture",
    price: 2499.99,
    stock: 45,
    status: "in_stock",
    lastUpdated: "2025-10-15",
  },
  {
    id: "2",
    name: "Wireless Mouse",
    sku: "WM-002",
    category: "Electronics",
    price: 299.99,
    stock: 120,
    status: "in_stock",
    lastUpdated: "2025-10-18",
  },
  {
    id: "3",
    name: "Laptop Stand",
    sku: "LST-003",
    category: "Accessories",
    price: 499.99,
    stock: 8,
    status: "low_stock",
    lastUpdated: "2025-10-19",
  },
  {
    id: "4",
    name: "USB-C Cable",
    sku: "USC-004",
    category: "Electronics",
    price: 149.99,
    stock: 0,
    status: "out_of_stock",
    lastUpdated: "2025-10-10",
  },
  {
    id: "5",
    name: "Desk Lamp",
    sku: "DL-005",
    category: "Lighting",
    price: 799.99,
    stock: 3,
    status: "low_stock",
    lastUpdated: "2025-10-17",
  },
  {
    id: "6",
    name: "Wireless Keyboard",
    sku: "WK-006",
    category: "Electronics",
    price: 899.99,
    stock: 65,
    status: "in_stock",
    lastUpdated: "2025-10-16",
  },
  {
    id: "7",
    name: "Monitor 27\"",
    sku: "MON-007",
    category: "Electronics",
    price: 5499.99,
    stock: 22,
    status: "in_stock",
    lastUpdated: "2025-10-14",
  },
  {
    id: "8",
    name: "HDMI Cable",
    sku: "HDM-008",
    category: "Cables",
    price: 99.99,
    stock: 200,
    status: "in_stock",
    lastUpdated: "2025-10-13",
  },
]

const categories = ["All", "Furniture", "Electronics", "Accessories", "Lighting", "Cables"]

function getStatusBadge(status: Product["status"]) {
  switch (status) {
    case "in_stock":
      return <Badge variant="success">In Stock</Badge>
    case "low_stock":
      return <Badge variant="warning">Low Stock</Badge>
    case "out_of_stock":
      return <Badge variant="destructive">Out of Stock</Badge>
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter products based on search and category
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, products])

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <div className="border-b bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Products</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your product catalog
            </p>
          </div>
          <Link href="/inventory/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
          </Link>
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
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Search products"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filter by category">
              <Filter className="h-4 w-4 mr-2" />
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

      {/* Products Table */}
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Package className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">
                No products found
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Try adjusting your search or filters
              </p>
              <Link href="/inventory/products/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
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
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-slate-500">{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell className="text-right">{product.stock}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/inventory/products/${product.id}`}>
                              <Button variant="ghost" size="icon" aria-label="View product">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/inventory/products/${product.id}/edit`}>
                              <Button variant="ghost" size="icon" aria-label="Edit product">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Delete product"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-200">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-slate-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                      </div>
                      {getStatusBadge(product.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-xs text-slate-500">Category</p>
                        <p className="font-medium">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="font-medium">{formatCurrency(product.price)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Stock</p>
                        <p className="font-medium">{product.stock}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/inventory/products/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/inventory/products/${product.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination - Placeholder */}
        {!loading && filteredProducts.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-slate-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
