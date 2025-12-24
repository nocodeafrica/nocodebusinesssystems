'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  DollarSign,
  Home,
  Users,
  Calendar,
  MapPin,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Eye,
  Clock,
  Target,
  Zap,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Minus,
  Plus,
  Star,
  Map,
  Layers,
  Globe
} from 'lucide-react'

// Portfolio overview data
const portfolioData = {
  totalProperties: 24,
  totalValue: 145500000,
  monthlyRevenue: 680000,
  occupancyRate: 87,
  avgPropertyValue: 6062500,
  yearOverYearGrowth: 12.5,
  capRate: 8.2,
  roi: 15.3
}

// Property performance by type
const propertyTypes = [
  { type: 'Residential', count: 15, value: 85000000, revenue: 380000, occupancy: 92 },
  { type: 'Commercial', count: 6, value: 45000000, revenue: 220000, occupancy: 83 },
  { type: 'Industrial', count: 3, value: 15500000, revenue: 80000, occupancy: 78 }
]

// Geographic distribution (SA provinces)
const geographicData = [
  { province: 'Gauteng', properties: 10, value: 65000000, growth: 14.2 },
  { province: 'Western Cape', properties: 8, value: 55000000, growth: 11.8 },
  { province: 'KwaZulu-Natal', properties: 4, value: 18000000, growth: 9.5 },
  { province: 'Eastern Cape', properties: 2, value: 7500000, growth: 7.2 }
]

// Monthly revenue trend
const revenueData = [
  { month: 'Aug', revenue: 620000, expenses: 180000 },
  { month: 'Sep', revenue: 635000, expenses: 175000 },
  { month: 'Oct', revenue: 648000, expenses: 182000 },
  { month: 'Nov', revenue: 655000, expenses: 178000 },
  { month: 'Dec', revenue: 670000, expenses: 190000 },
  { month: 'Jan', revenue: 680000, expenses: 185000 }
]

// Top performing properties
const topProperties = [
  { 
    name: 'Sandton Office Tower',
    location: 'Sandton, Johannesburg',
    type: 'Commercial',
    value: 25000000,
    revenue: 125000,
    roi: 18.5,
    occupancy: 95
  },
  {
    name: 'Waterkloof Residential Complex',
    location: 'Waterkloof, Pretoria',
    type: 'Residential',
    value: 18000000,
    revenue: 85000,
    roi: 16.2,
    occupancy: 100
  },
  {
    name: 'Sea Point Apartments',
    location: 'Sea Point, Cape Town',
    type: 'Residential',
    value: 22000000,
    revenue: 98000,
    roi: 15.8,
    occupancy: 92
  },
  {
    name: 'Umhlanga Retail Space',
    location: 'Umhlanga, Durban',
    type: 'Commercial',
    value: 15000000,
    revenue: 72000,
    roi: 14.5,
    occupancy: 88
  }
]

// Market insights
const marketInsights = [
  {
    type: 'positive',
    title: 'Strong Rental Demand',
    description: 'Gauteng residential rentals up 8% YoY',
    impact: '+R45,000/month potential'
  },
  {
    type: 'warning',
    title: 'Interest Rate Risk',
    description: 'Prime rate expected to increase',
    impact: 'Monitor refinancing opportunities'
  },
  {
    type: 'positive',
    title: 'Cape Town Growth',
    description: 'Property values increasing 12% annually',
    impact: '+R6.6M portfolio value'
  },
  {
    type: 'info',
    title: 'New Development Zone',
    description: 'Waterfall City expansion announced',
    impact: 'Investment opportunity'
  }
]

// Expense breakdown
const expenseCategories = [
  { category: 'Maintenance', amount: 45000, percentage: 24.3 },
  { category: 'Property Tax', amount: 35000, percentage: 18.9 },
  { category: 'Insurance', amount: 28000, percentage: 15.1 },
  { category: 'Management Fees', amount: 32000, percentage: 17.3 },
  { category: 'Utilities', amount: 25000, percentage: 13.5 },
  { category: 'Other', amount: 20000, percentage: 10.8 }
]

const PropertyAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month')
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'occupancy' | 'value'>('revenue')
  const [expandedProperty, setExpandedProperty] = useState<number | null>(null)
  const [showComparison, setShowComparison] = useState(false)

  const getInsightIcon = (type: string) => {
    switch(type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      default: return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 min-h-[700px] border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Property Analytics</h2>
          <p className="text-gray-600">Real-time insights into your property portfolio</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Home className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">R{(portfolioData.totalValue / 1000000).toFixed(1)}M</p>
          <p className="text-indigo-100 text-sm">Portfolio Value</p>
          <p className="text-xs text-indigo-200 mt-1">+{portfolioData.yearOverYearGrowth}% YoY</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">R{(portfolioData.monthlyRevenue / 1000).toFixed(0)}k</p>
          <p className="text-green-100 text-sm">Monthly Revenue</p>
          <p className="text-xs text-green-200 mt-1">+8.5% vs last month</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <Activity className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{portfolioData.occupancyRate}%</p>
          <p className="text-blue-100 text-sm">Occupancy Rate</p>
          <p className="text-xs text-blue-200 mt-1">-2% from target</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 opacity-80" />
            <Percent className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{portfolioData.roi}%</p>
          <p className="text-orange-100 text-sm">ROI</p>
          <p className="text-xs text-orange-200 mt-1">Cap Rate: {portfolioData.capRate}%</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Revenue & Expenses Chart */}
        <div className="col-span-2 bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Revenue & Expenses Trend</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-600">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.revenue / 700000) * 180}px` }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      R{(data.revenue / 1000).toFixed(0)}k
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.expenses / 700000) * 180}px` }}
                    transition={{ delay: index * 0.1 + 0.05 }}
                    className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      R{(data.expenses / 1000).toFixed(0)}k
                    </div>
                  </motion.div>
                </div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Operating Income</p>
                <p className="text-2xl font-bold text-gray-900">R495,000</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">NOI Margin</p>
                <p className="text-2xl font-bold text-green-600">72.8%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Market Insights</h3>
          <div className="space-y-3">
            {marketInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                    <p className="text-xs text-indigo-600 font-medium mt-2">{insight.impact}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Property Type Distribution */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Portfolio Distribution</h3>
          <div className="space-y-4">
            {propertyTypes.map((type) => (
              <div key={type.type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{type.type}</span>
                  <span className="text-sm text-gray-600">{type.count} properties</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(type.value / portfolioData.totalValue) * 100}%` }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full h-2"
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">R{(type.value / 1000000).toFixed(1)}M</span>
                  <span className="text-xs text-gray-500">{type.occupancy}% occupied</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Performance */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Geographic Performance</h3>
          <div className="space-y-3">
            {geographicData.map((region) => (
              <div key={region.province} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{region.province}</p>
                    <p className="text-xs text-gray-500">{region.properties} properties</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">R{(region.value / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-green-600">+{region.growth}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="space-y-3">
            {expenseCategories.map((expense) => (
              <div key={expense.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{expense.category}</span>
                  <span className="text-sm font-medium text-gray-900">R{expense.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${expense.percentage}%` }}
                    className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full h-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Expenses</span>
              <span className="text-lg font-bold text-gray-900">R185,000</span>
            </div>
          </div>
        </div>

        {/* Top Performing Properties */}
        <div className="col-span-3 bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Performing Properties</h3>
          <div className="grid grid-cols-2 gap-4">
            {topProperties.map((property, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{property.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {property.location}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium">
                    {property.type}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Value</p>
                    <p className="text-sm font-semibold text-gray-900">R{(property.value / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-sm font-semibold text-gray-900">R{(property.revenue / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ROI</p>
                    <p className="text-sm font-semibold text-green-600">{property.roi}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Occupancy</p>
                    <p className="text-sm font-semibold text-gray-900">{property.occupancy}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyAnalytics