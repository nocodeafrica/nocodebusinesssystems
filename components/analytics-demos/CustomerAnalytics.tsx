'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users,
  TrendingUp,
  Heart,
  Star,
  ShoppingBag,
  Clock,
  DollarSign,
  UserCheck,
  Award,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Funnel,
  FunnelChart,
  LabelList
} from 'recharts'

// Customer journey funnel
const funnelData = [
  { name: 'Visitors', value: 100000, fill: '#8b5cf6' },
  { name: 'Sign Ups', value: 45000, fill: '#6366f1' },
  { name: 'Active Users', value: 28000, fill: '#3b82f6' },
  { name: 'Purchasers', value: 12000, fill: '#10b981' },
  { name: 'Repeat Buyers', value: 5400, fill: '#f59e0b' },
  { name: 'Advocates', value: 2100, fill: '#ef4444' }
]

// Customer segments
const segmentData = [
  { name: 'VIP', value: 1250, revenue: 2800000, avgOrderValue: 2240, color: '#8b5cf6' },
  { name: 'Regular', value: 8430, revenue: 3450000, avgOrderValue: 409, color: '#6366f1' },
  { name: 'Occasional', value: 15620, revenue: 2180000, avgOrderValue: 140, color: '#3b82f6' },
  { name: 'New', value: 4200, revenue: 420000, avgOrderValue: 100, color: '#10b981' },
  { name: 'At Risk', value: 2890, revenue: 578000, avgOrderValue: 200, color: '#f59e0b' },
  { name: 'Lost', value: 1450, revenue: 145000, avgOrderValue: 100, color: '#ef4444' }
]

// Cohort retention data
const cohortData = [
  { month: 'Jan', month0: 100, month1: 68, month2: 52, month3: 45, month4: 42, month5: 40 },
  { month: 'Feb', month0: 100, month1: 72, month2: 58, month3: 49, month4: 46, month5: 44 },
  { month: 'Mar', month0: 100, month1: 70, month2: 56, month3: 48, month4: 45, month5: 43 },
  { month: 'Apr', month0: 100, month1: 74, month2: 61, month3: 53, month4: 50, month5: 48 },
  { month: 'May', month0: 100, month1: 76, month2: 63, month3: 55, month4: 52, month5: 50 },
  { month: 'Jun', month0: 100, month1: 78, month2: 65, month3: 57, month4: 54, month5: null }
]

// Customer lifetime value distribution
const clvData = [
  { range: 'R0-R1K', customers: 3420 },
  { range: 'R1K-R5K', customers: 5150 },
  { range: 'R5K-R10K', customers: 3280 },
  { range: 'R10K-R50K', customers: 1620 },
  { range: 'R50K-R100K', customers: 580 },
  { range: 'R100K+', customers: 180 }
]

// NPS data
const npsScore = 72
const npsData = [
  { type: 'Promoters', value: 58, color: '#10b981' },
  { type: 'Passives', value: 28, color: '#f59e0b' },
  { type: 'Detractors', value: 14, color: '#ef4444' }
]

// Customer activity heatmap
const activityData = [
  { day: 'Mon', hour: 'Morning', value: 45 },
  { day: 'Mon', hour: 'Afternoon', value: 78 },
  { day: 'Mon', hour: 'Evening', value: 92 },
  { day: 'Tue', hour: 'Morning', value: 48 },
  { day: 'Tue', hour: 'Afternoon', value: 82 },
  { day: 'Tue', hour: 'Evening', value: 88 },
  { day: 'Wed', hour: 'Morning', value: 52 },
  { day: 'Wed', hour: 'Afternoon', value: 85 },
  { day: 'Wed', hour: 'Evening', value: 90 },
  { day: 'Thu', hour: 'Morning', value: 50 },
  { day: 'Thu', hour: 'Afternoon', value: 88 },
  { day: 'Thu', hour: 'Evening', value: 95 },
  { day: 'Fri', hour: 'Morning', value: 55 },
  { day: 'Fri', hour: 'Afternoon', value: 92 },
  { day: 'Fri', hour: 'Evening', value: 98 },
  { day: 'Sat', hour: 'Morning', value: 35 },
  { day: 'Sat', hour: 'Afternoon', value: 65 },
  { day: 'Sat', hour: 'Evening', value: 82 },
  { day: 'Sun', hour: 'Morning', value: 28 },
  { day: 'Sun', hour: 'Afternoon', value: 58 },
  { day: 'Sun', hour: 'Evening', value: 75 }
]

const CustomerAnalytics = () => {
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [timeRange, setTimeRange] = useState('30d')

  const getRetentionColor = (value: number) => {
    if (value >= 70) return '#10b981'
    if (value >= 50) return '#3b82f6'
    if (value >= 30) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Customer Analytics</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Comprehensive customer insights and behavior analysis</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors min-h-[44px]">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs md:text-sm font-medium hover:bg-orange-700 transition-colors min-h-[44px]">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl p-3 md:p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-orange-600" />
            <span className="flex items-center text-xs font-medium text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              12%
            </span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900">33,840</p>
          <p className="text-xs text-gray-500">Total Customers</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-3 md:p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="flex items-center text-xs font-medium text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              8%
            </span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900">R18,425</p>
          <p className="text-xs text-gray-500">Avg CLV</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-3 md:p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-5 h-5 text-green-600" />
            <span className="flex items-center text-xs font-medium text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              3%
            </span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900">68%</p>
          <p className="text-xs text-gray-500">Retention Rate</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-3 md:p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-purple-600" />
            <span className="flex items-center text-xs font-medium text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              5
            </span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900">{npsScore}</p>
          <p className="text-xs text-gray-500">NPS Score</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-xl p-3 md:p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <span className="flex items-center text-xs font-medium text-red-600">
              <ArrowDownRight className="w-3 h-3" />
              0.8%
            </span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900">5.2%</p>
          <p className="text-xs text-gray-500">Churn Rate</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-6">
        {/* Customer Journey Funnel */}
        <div className="lg:col-span-4 bg-gray-50 rounded-2xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Customer Journey</h3>
          <div className="space-y-3">
            {funnelData.map((stage, index) => {
              const percentage = (stage.value / funnelData[0].value) * 100
              const conversionRate = index > 0 ? ((stage.value / funnelData[index - 1].value) * 100).toFixed(1) : '100'
              
              return (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs md:text-sm font-medium text-gray-700">{stage.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{stage.value.toLocaleString()}</span>
                      {index > 0 && (
                        <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full">
                          {conversionRate}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="h-full rounded-lg transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: stage.fill
                      }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Customer Segments */}
        <div className="lg:col-span-4 bg-gray-50 rounded-2xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
          <div className="overflow-x-auto"><ResponsiveContainer width="100%" height={180} minWidth={200}>
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {segmentData.map((segment) => (
              <button
                key={segment.name}
                onClick={() => setSelectedSegment(segment.name)}
                className={`flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                  selectedSegment === segment.name ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: segment.color }} />
                  <span className="font-medium text-gray-700">{segment.name}</span>
                </div>
                <span className="text-gray-500">{segment.value.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* NPS Score */}
        <div className="lg:col-span-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 md:p-6 text-white">
          <h3 className="text-base md:text-lg font-semibold mb-4">Net Promoter Score</h3>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2">{npsScore}</div>
            <div className="text-sm opacity-90">Excellent Score</div>
          </div>
          <div className="space-y-3">
            {npsData.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.type}</span>
                </div>
                <span className="text-sm font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-90">Total Responses</span>
              <span className="font-medium">2,847</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Retention Analysis */}
      <div className="bg-gray-50 rounded-2xl p-4 md:p-6 mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Cohort Retention Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Cohort</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Month 0</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Month 1</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Month 2</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Month 3</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Month 4</th>
                <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase">Month 5</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((cohort, index) => (
                <tr key={cohort.month} className="border-b border-gray-100">
                  <td className="py-3 text-xs md:text-sm font-medium text-gray-700">{cohort.month}</td>
                  {['month0', 'month1', 'month2', 'month3', 'month4', 'month5'].map((key) => {
                    const value = cohort[key as keyof typeof cohort]
                    return (
                      <td key={key} className="py-3 text-center">
                        {value !== null ? (
                          <div 
                            className="inline-block px-3 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: getRetentionColor(value as number) }}
                          >
                            {value}%
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* CLV Distribution */}
        <div className="lg:col-span-7 bg-gray-50 rounded-2xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Customer Lifetime Value Distribution</h3>
          <div className="overflow-x-auto"><ResponsiveContainer width="100%" height={200} minWidth={400}>
            <BarChart data={clvData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="customers" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer></div>
        </div>

        {/* Top Customer Segments by Revenue */}
        <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Revenue by Segment</h3>
          <div className="space-y-3">
            {segmentData.slice(0, 5).map((segment, index) => (
              <motion.div
                key={segment.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${segment.color}20` }}>
                    <span className="text-xs font-bold" style={{ color: segment.color }}>
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-900">{segment.name}</p>
                    <p className="text-xs text-gray-500">{segment.value.toLocaleString()} customers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm font-bold text-gray-900">R{(segment.revenue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-gray-500">AOV: R{segment.avgOrderValue}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerAnalytics