'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Revenue trend data - 12 months
const revenueData = [
  { month: 'Jan', revenue: 124500, orders: 1245, avgOrder: 100 },
  { month: 'Feb', revenue: 145200, orders: 1389, avgOrder: 105 },
  { month: 'Mar', revenue: 162300, orders: 1502, avgOrder: 108 },
  { month: 'Apr', revenue: 178900, orders: 1634, avgOrder: 109 },
  { month: 'May', revenue: 195400, orders: 1756, avgOrder: 111 },
  { month: 'Jun', revenue: 208700, orders: 1845, avgOrder: 113 },
  { month: 'Jul', revenue: 224300, orders: 1934, avgOrder: 116 },
  { month: 'Aug', revenue: 241200, orders: 2045, avgOrder: 118 },
  { month: 'Sep', revenue: 256800, orders: 2134, avgOrder: 120 },
  { month: 'Oct', revenue: 273400, orders: 2256, avgOrder: 121 },
  { month: 'Nov', revenue: 289600, orders: 2367, avgOrder: 122 },
  { month: 'Dec', revenue: 312400, orders: 2489, avgOrder: 125 }
]

// Product categories
const categoryData = [
  { name: 'Electronics', value: 32, revenue: 'R892K', growth: 12 },
  { name: 'Clothing', value: 28, revenue: 'R756K', growth: 8 },
  { name: 'Home & Garden', value: 18, revenue: 'R512K', growth: 15 },
  { name: 'Sports', value: 12, revenue: 'R334K', growth: -3 },
  { name: 'Books', value: 10, revenue: 'R278K', growth: 5 }
]

// Top products
const topProducts = [
  { name: 'MacBook Pro 16"', sales: 342, revenue: 'R1.2M', change: 12 },
  { name: 'iPhone 15 Pro', sales: 892, revenue: 'R892K', change: 24 },
  { name: 'AirPods Pro', sales: 1234, revenue: 'R432K', change: -5 },
  { name: 'Nike Air Max', sales: 567, revenue: 'R234K', change: 18 },
  { name: 'Samsung TV 65"', sales: 234, revenue: 'R198K', change: 7 }
]

// Geographic data
const geoData = [
  { country: 'Gauteng', value: 42, revenue: 'R1.2M' },
  { country: 'Western Cape', value: 18, revenue: 'R512K' },
  { country: 'KwaZulu-Natal', value: 15, revenue: 'R428K' },
  { country: 'Eastern Cape', value: 12, revenue: 'R342K' },
  { country: 'Mpumalanga', value: 8, revenue: 'R228K' },
  { country: 'Other', value: 5, revenue: 'R142K' }
]

const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6b7280']

const BusinessIntelligence = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Business Overview</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Real-time business metrics and insights</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors min-h-[44px]">
            <Calendar className="w-4 h-4" />
            Last 12 Months
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors min-h-[44px]">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs md:text-sm font-medium hover:bg-purple-700 transition-colors min-h-[44px]">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              24%
            </span>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">R2.8M</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Total Revenue</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              18%
            </span>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">21,549</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Total Orders</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              12%
            </span>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">48,292</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Active Customers</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-red-600">
              <ArrowDownRight className="w-4 h-4" />
              3%
            </span>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">R118</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Avg Order Value</p>
        </motion.div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-6 md:mb-8">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-8 bg-white rounded-2xl p-4 md:p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-xs md:text-sm text-gray-500">Monthly revenue over the last year</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="overflow-x-auto"><ResponsiveContainer width="100%" height={250} minWidth={400}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `R${value/1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: any) => [`R${(value/1000).toFixed(1)}k`, 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer></div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-4 bg-white rounded-2xl p-4 md:p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Sales by Category</h3>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="overflow-x-auto"><ResponsiveContainer width="100%" height={200} minWidth={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer></div>
          <div className="mt-6 space-y-3">
            {categoryData.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="text-xs md:text-sm text-gray-700">{category.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs md:text-sm font-medium text-gray-900">{category.revenue}</span>
                  <span className={`text-xs font-medium ${
                    category.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {category.growth > 0 ? '+' : ''}{category.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Top Products Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-7 bg-white rounded-2xl p-4 md:p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Top Products</h3>
            <button className="text-xs md:text-sm text-purple-600 font-medium hover:text-purple-700">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">#{index + 1}</span>
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-xs md:text-sm text-gray-700">{product.sales.toLocaleString()}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-xs md:text-sm font-medium text-gray-900">{product.revenue}</span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center text-xs md:text-sm font-medium ${
                        product.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.change > 0 ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(product.change)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-5 bg-white rounded-2xl p-4 md:p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Geographic Distribution</h3>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="space-y-4">
            {geoData.map((country, index) => (
              <div key={country.country}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm font-medium text-gray-700">{country.country}</span>
                  <span className="text-xs md:text-sm text-gray-900 font-medium">{country.revenue}</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${country.value}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: colors[index] }}
                    />
                  </div>
                  <span className="absolute right-0 -top-0.5 text-xs text-gray-500">
                    {country.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BusinessIntelligence