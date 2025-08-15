'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  BarChart3,
  ArrowUp,
  ArrowDown,
  MapPin,
  Boxes,
  CheckCircle,
  AlertCircle,
  Clock,
  MoreVertical,
  ChevronRight,
  RefreshCw,
  Truck
} from 'lucide-react'

// Stock data
const stockItems = [
  {
    id: 'SKU-001',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    currentStock: 145,
    minStock: 50,
    maxStock: 500,
    location: 'Warehouse A',
    value: 7250,
    status: 'optimal',
    trend: 'up',
    lastRestocked: '2 days ago'
  },
  {
    id: 'SKU-002',
    name: 'Organic Coffee Beans 1kg',
    category: 'Food & Beverage',
    currentStock: 28,
    minStock: 100,
    maxStock: 1000,
    location: 'Warehouse B',
    value: 560,
    status: 'low',
    trend: 'down',
    lastRestocked: '1 week ago'
  },
  {
    id: 'SKU-003',
    name: 'Premium Leather Wallet',
    category: 'Accessories',
    currentStock: 89,
    minStock: 30,
    maxStock: 200,
    location: 'Store Front',
    value: 4450,
    status: 'optimal',
    trend: 'stable',
    lastRestocked: '3 days ago'
  },
  {
    id: 'SKU-004',
    name: 'Smart Watch Pro',
    category: 'Electronics',
    currentStock: 12,
    minStock: 25,
    maxStock: 100,
    location: 'Warehouse A',
    value: 3600,
    status: 'critical',
    trend: 'down',
    lastRestocked: '2 weeks ago'
  },
  {
    id: 'SKU-005',
    name: 'Yoga Mat Premium',
    category: 'Sports & Fitness',
    currentStock: 234,
    minStock: 50,
    maxStock: 300,
    location: 'Warehouse C',
    value: 7020,
    status: 'optimal',
    trend: 'up',
    lastRestocked: '1 day ago'
  },
  {
    id: 'SKU-006',
    name: 'Stainless Steel Water Bottle',
    category: 'Home & Living',
    currentStock: 456,
    minStock: 100,
    maxStock: 500,
    location: 'All Locations',
    value: 6840,
    status: 'overstock',
    trend: 'stable',
    lastRestocked: '5 days ago'
  }
]

// Categories with stock levels
const categories = [
  { name: 'Electronics', items: 324, value: 48600, color: 'from-blue-500 to-indigo-500' },
  { name: 'Food & Beverage', items: 892, value: 26700, color: 'from-green-500 to-emerald-500' },
  { name: 'Accessories', items: 156, value: 18900, color: 'from-purple-500 to-violet-500' },
  { name: 'Sports & Fitness', items: 445, value: 22250, color: 'from-orange-500 to-amber-500' },
  { name: 'Home & Living', items: 678, value: 33900, color: 'from-pink-500 to-rose-500' }
]

// Warehouse locations
const warehouses = [
  { id: 1, name: 'Warehouse A', capacity: 10000, used: 6800, percentage: 68 },
  { id: 2, name: 'Warehouse B', capacity: 8000, used: 7200, percentage: 90 },
  { id: 3, name: 'Warehouse C', capacity: 5000, used: 2500, percentage: 50 },
  { id: 4, name: 'Store Front', capacity: 2000, used: 1400, percentage: 70 }
]

const StockOverview = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'optimal': return 'text-green-600 bg-green-100'
      case 'low': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      case 'overstock': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return <div className="w-4 h-4 bg-gray-300 rounded-full" />
    }
  }

  const getStockPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100)
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time stock levels and inventory tracking</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1 sm:flex-initial justify-center">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 flex-1 sm:flex-initial justify-center">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-green-600 font-medium">+12%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">2,495</p>
          <p className="text-xs text-gray-500">Total Items</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">+8%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">R1.8M</p>
          <p className="text-xs text-gray-500">Total Value</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-100"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-xs text-red-600 font-medium">12</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">28</p>
          <p className="text-xs text-gray-500">Low Stock Items</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">15</p>
          <p className="text-xs text-gray-500">Orders in Transit</p>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 w-full bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 flex-1 sm:flex-initial">
            <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          </button>
          <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 flex-1 sm:flex-initial">
            <Download className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stock Items Table */}
      <div className="bg-gray-50 rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Stock Level</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Value</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Trend</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map((item, index) => (
              <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-white transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.id} • {item.category}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">{item.currentStock}</span>
                          <span className="text-xs text-gray-500">/ {item.maxStock}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.status === 'critical' ? 'bg-red-500' :
                              item.status === 'low' ? 'bg-yellow-500' :
                              item.status === 'overstock' ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${getStockPercentage(item.currentStock, item.maxStock)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-semibold text-gray-900">R{item.value.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getTrendIcon(item.trend)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="p-1 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Section - Categories and Warehouse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {/* Categories */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                    <Boxes className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.items} items</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">R{(category.value / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse Capacity */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Warehouse Capacity</h3>
          <div className="space-y-3">
            {warehouses.map((warehouse) => (
              <div key={warehouse.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{warehouse.name}</span>
                  </div>
                  <span className="text-xs text-gray-600">{warehouse.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      warehouse.percentage >= 90 ? 'bg-red-500' :
                      warehouse.percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${warehouse.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{warehouse.used.toLocaleString()} / {warehouse.capacity.toLocaleString()} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowDown className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Stock received</p>
                <p className="text-xs text-gray-500">150 units of SKU-001 • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <ArrowUp className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Stock shipped</p>
                <p className="text-xs text-gray-500">25 units of SKU-004 • 3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Low stock alert</p>
                <p className="text-xs text-gray-500">SKU-002 below minimum • 5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockOverview