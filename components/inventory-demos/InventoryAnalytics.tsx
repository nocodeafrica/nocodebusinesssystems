'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Package,
  AlertTriangle,
  Calendar,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw,
  Clock,
  Layers,
  ShoppingCart,
  Eye,
  ChevronRight
} from 'lucide-react'

// ABC Analysis data
const abcAnalysis = [
  { category: 'A', items: 45, percentage: 15, revenue: 70, color: 'from-cyan-500 to-teal-500' },
  { category: 'B', items: 90, percentage: 30, revenue: 20, color: 'from-blue-500 to-indigo-500' },
  { category: 'C', items: 165, percentage: 55, revenue: 10, color: 'from-purple-500 to-violet-500' }
]

// Top performing products
const topProducts = [
  { rank: 1, name: 'Wireless Headphones', sku: 'SKU-001', turnover: 12.5, revenue: 45600, trend: 'up', change: 15 },
  { rank: 2, name: 'Smart Watch Pro', sku: 'SKU-004', turnover: 10.2, revenue: 38900, trend: 'up', change: 8 },
  { rank: 3, name: 'Yoga Mat Premium', sku: 'SKU-003', turnover: 9.8, revenue: 32100, trend: 'stable', change: 0 },
  { rank: 4, name: 'Water Bottle Steel', sku: 'SKU-005', turnover: 8.5, revenue: 28700, trend: 'down', change: -5 },
  { rank: 5, name: 'Laptop Stand', sku: 'SKU-002', turnover: 7.2, revenue: 24300, trend: 'up', change: 12 }
]

// Turnover metrics
const turnoverData = [
  { month: 'Jul', rate: 8.2, target: 8.0 },
  { month: 'Aug', rate: 8.5, target: 8.0 },
  { month: 'Sep', rate: 9.1, target: 8.5 },
  { month: 'Oct', rate: 9.8, target: 9.0 },
  { month: 'Nov', rate: 10.2, target: 9.5 },
  { month: 'Dec', rate: 11.5, target: 10.0 }
]

// Demand forecast
const demandForecast = [
  { product: 'Wireless Headphones', current: 145, predicted: 220, confidence: 92, trend: 'high' },
  { product: 'Smart Watch Pro', current: 25, predicted: 85, confidence: 88, trend: 'high' },
  { product: 'Coffee Beans 1kg', current: 28, predicted: 150, confidence: 85, trend: 'medium' },
  { product: 'Leather Wallet', current: 89, predicted: 95, confidence: 78, trend: 'low' }
]

// Stock aging
const stockAging = [
  { range: '0-30 days', value: 145000, percentage: 65, items: 1250 },
  { range: '31-60 days', value: 45000, percentage: 20, items: 380 },
  { range: '61-90 days', value: 22000, percentage: 10, items: 156 },
  { range: '90+ days', value: 11000, percentage: 5, items: 89 }
]

const InventoryAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [selectedMetric, setSelectedMetric] = useState('turnover')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up' || change > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />
    if (trend === 'down' || change < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />
    return <div className="w-4 h-4 bg-gray-300 rounded-full" />
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100'
    if (confidence >= 80) return 'text-blue-600 bg-blue-100'
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Advanced insights and forecasting</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <select 
            className="px-3 sm:px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 flex-1 sm:flex-initial"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700 flex-1 sm:flex-initial justify-center">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-4 border border-cyan-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-cyan-600" />
            <span className="text-xs text-green-600 font-medium">+12%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">10.2x</p>
          <p className="text-xs text-gray-500">Avg Turnover Rate</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">+8%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$223K</p>
          <p className="text-xs text-gray-500">Inventory Value</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-xs text-red-600 font-medium">-3d</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">28 days</p>
          <p className="text-xs text-gray-500">Avg Stock Age</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-green-600 font-medium">92%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">94%</p>
          <p className="text-xs text-gray-500">Stock Accuracy</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          {/* ABC Analysis */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">ABC Analysis</h3>
              <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                Configure →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {abcAnalysis.map((category) => (
                <div key={category.category} className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                      <span className="text-lg font-bold text-white">{category.category}</span>
                    </div>
                    <Layers className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{category.items}</p>
                  <p className="text-xs text-gray-500 mb-2">items ({category.percentage}%)</p>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{category.revenue}%</p>
                    <p className="text-xs text-gray-500">of revenue</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2">Category Distribution</p>
              <div className="flex h-8 rounded-lg overflow-hidden">
                {abcAnalysis.map((category) => (
                  <div
                    key={category.category}
                    className={`bg-gradient-to-r ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {abcAnalysis.map((category) => (
                  <span key={category.category} className="text-xs text-gray-500">
                    {category.category}: {category.percentage}%
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Turnover Trends */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inventory Turnover Trend</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full" />
                  <span className="text-xs text-gray-600">Actual</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  <span className="text-xs text-gray-600">Target</span>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between gap-2 h-48">
              {turnoverData.map((data, index) => (
                <div key={data.month} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <div className="relative w-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.rate / 12) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-teal-400 rounded-t-lg"
                      style={{ height: `${(data.rate / 12) * 192}px` }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 border-2 border-gray-400 border-dashed rounded-t-lg"
                      style={{ height: `${(data.target / 12) * 192}px` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                  <p className="text-xs font-semibold text-gray-900">{data.rate}x</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Products */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div key={product.rank} className="bg-white rounded-xl p-3 sm:p-4">
                  <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-cyan-600">#{product.rank}</span>
                      </div>
                      <div className="flex-1 sm:flex-initial">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-bold text-gray-900">{product.turnover}x</p>
                        <p className="text-xs text-gray-500">turnover</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
                        <p className="text-xs text-gray-500">revenue</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(product.trend, product.change)}
                        <span className={`text-xs font-medium ${
                          product.change > 0 ? 'text-green-600' : 
                          product.change < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {Math.abs(product.change)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          {/* Demand Forecast */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Demand Forecast</h3>
              <span className="text-xs text-gray-500">Next 30 days</span>
            </div>
            <div className="space-y-3">
              {demandForecast.map((item) => (
                <div key={item.product} className="bg-white rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">{item.product}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                          {item.confidence}%
                        </span>
                        <div className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                          item.trend === 'high' ? 'bg-red-100' :
                          item.trend === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <Zap className={`w-3 h-3 ${
                            item.trend === 'high' ? 'text-red-600' :
                            item.trend === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                          <span className={`text-xs font-medium ${
                            item.trend === 'high' ? 'text-red-600' :
                            item.trend === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {item.trend} demand
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500 mb-1">Current Stock</p>
                      <p className="text-lg font-bold text-gray-900">{item.current}</p>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-2">
                      <p className="text-xs text-cyan-600 mb-1">Predicted Need</p>
                      <p className="text-lg font-bold text-cyan-700">{item.predicted}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Reorder in</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.ceil((item.predicted - item.current) / 10)} days
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-700">
              Generate Purchase Orders
            </button>
          </div>

          {/* Stock Aging */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Stock Aging Analysis</h3>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-3">
              {stockAging.map((range) => (
                <div key={range.range}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{range.range}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{formatCurrency(range.value)}</span>
                      <span className="text-xs text-gray-500">({range.items} items)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        range.range === '0-30 days' ? 'bg-green-500' :
                        range.range === '31-60 days' ? 'bg-yellow-500' :
                        range.range === '61-90 days' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${range.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-yellow-900">Aging Alert</p>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    {stockAging[3].items} items over 90 days old ({formatCurrency(stockAging[3].value)} value)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-left hover:bg-white/30 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5" />
                  <span className="font-medium">Run ABC Analysis</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-left hover:bg-white/30 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Set Reorder Points</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-left hover:bg-white/30 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">View Insights</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryAnalytics