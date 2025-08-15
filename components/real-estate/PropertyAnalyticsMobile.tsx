'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Home,
  Users,
  Calendar,
  MapPin,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Eye,
  Heart,
  Clock,
  AlertCircle,
  CheckCircle,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  Activity,
  Percent,
  Info
} from 'lucide-react'

interface PropertyAnalyticsMobileProps {
  onBack?: () => void
}

// Portfolio overview data (from desktop component)
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

// Property performance by type (from desktop component)
const propertyTypes = [
  { type: 'Residential', count: 15, value: 85000000, revenue: 380000, occupancy: 92 },
  { type: 'Commercial', count: 6, value: 45000000, revenue: 220000, occupancy: 83 },
  { type: 'Industrial', count: 3, value: 15500000, revenue: 80000, occupancy: 78 }
]

// Geographic distribution (SA provinces) (from desktop component)
const geographicData = [
  { location: 'Gauteng', properties: 10, percentage: 42, value: 65000000, growth: 14.2 },
  { location: 'Western Cape', properties: 8, percentage: 33, value: 55000000, growth: 11.8 },
  { location: 'KwaZulu-Natal', properties: 4, percentage: 17, value: 18000000, growth: 9.5 },
  { location: 'Eastern Cape', properties: 2, percentage: 8, value: 7500000, growth: 7.2 }
]

// Monthly revenue trend (from desktop component)
const revenueData = [
  { month: 'Aug', revenue: 620000, expenses: 180000 },
  { month: 'Sep', revenue: 635000, expenses: 175000 },
  { month: 'Oct', revenue: 648000, expenses: 182000 },
  { month: 'Nov', revenue: 655000, expenses: 178000 },
  { month: 'Dec', revenue: 670000, expenses: 190000 },
  { month: 'Jan', revenue: 680000, expenses: 185000 }
]

// Top performing properties (from desktop component)
const topProperties = [
  { 
    id: 1,
    address: 'Sandton Office Tower, Sandton',
    type: 'Commercial',
    value: 25000000,
    revenue: 125000,
    roi: 18.5,
    occupancy: 95
  },
  {
    id: 2,
    address: 'Waterkloof Residential Complex, Pretoria',
    type: 'Residential',
    value: 18000000,
    revenue: 85000,
    roi: 16.2,
    occupancy: 100
  },
  {
    id: 3,
    address: 'Sea Point Apartments, Cape Town',
    type: 'Residential',
    value: 22000000,
    revenue: 98000,
    roi: 15.8,
    occupancy: 92
  },
  {
    id: 4,
    address: 'Umhlanga Retail Space, Durban',
    type: 'Commercial',
    value: 15000000,
    revenue: 72000,
    roi: 14.5,
    occupancy: 88
  }
]

// Market insights (from desktop component)
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

// Expense breakdown (from desktop component)
const expenseCategories = [
  { category: 'Maintenance', amount: 45000, percentage: 24.3 },
  { category: 'Property Tax', amount: 35000, percentage: 18.9 },
  { category: 'Insurance', amount: 28000, percentage: 15.1 },
  { category: 'Management Fees', amount: 32000, percentage: 17.3 },
  { category: 'Utilities', amount: 25000, percentage: 13.5 },
  { category: 'Other', amount: 20000, percentage: 10.8 }
]

export default function PropertyAnalyticsMobile({ onBack }: PropertyAnalyticsMobileProps) {
  const [view, setView] = useState<'overview' | 'properties' | 'trends' | 'expenses'>('overview')
  const [timeframe, setTimeframe] = useState('6months')

  const formatCurrency = (amount: number) => {
    return `R ${(amount / 1000000).toFixed(1)}M`
  }

  const formatRevenue = (amount: number) => {
    return `R ${amount.toLocaleString()}`
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">Property Analytics</h1>
                <p className="text-sm text-gray-600">Portfolio performance insights</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="px-4">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'properties', label: 'Properties', icon: Home },
              { id: 'trends', label: 'Trends', icon: LineChart },
              { id: 'expenses', label: 'Expenses', icon: PieChart }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id as any)}
                  className={`py-3 px-1 border-b-2 transition-colors ${
                    view === tab.id
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5 inline mr-1" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Overview */}
        {view === 'overview' && (
          <div className="space-y-4">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Home className="w-6 h-6 opacity-80" />
                  <TrendingUp className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">R{(portfolioData.totalValue / 1000000).toFixed(1)}M</p>
                <p className="text-indigo-100 text-sm">Portfolio Value</p>
                <p className="text-xs text-indigo-200 mt-1">+{portfolioData.yearOverYearGrowth}% YoY</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-6 h-6 opacity-80" />
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">R{(portfolioData.monthlyRevenue / 1000).toFixed(0)}k</p>
                <p className="text-green-100 text-sm">Monthly Revenue</p>
                <p className="text-xs text-green-200 mt-1">+8.5% vs last month</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 opacity-80" />
                  <Activity className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">{portfolioData.occupancyRate}%</p>
                <p className="text-blue-100 text-sm">Occupancy Rate</p>
                <p className="text-xs text-blue-200 mt-1">-2% from target</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-6 h-6 opacity-80" />
                  <Percent className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">{portfolioData.roi}%</p>
                <p className="text-orange-100 text-sm">ROI</p>
                <p className="text-xs text-orange-200 mt-1">Above average</p>
              </div>
            </div>

            {/* Property Types */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Property Portfolio</h3>
              <div className="space-y-3">
                {propertyTypes.map((property) => (
                  <div key={property.type} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{property.type}</p>
                      <p className="text-xs text-gray-500">{property.count} properties • {property.occupancy}% occupied</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">R{(property.value / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-gray-500">R{(property.revenue / 1000).toFixed(0)}k/mo</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Geographic Distribution</h3>
              <div className="space-y-3">
                {geographicData.map((location) => (
                  <div key={location.location} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{location.location}</p>
                      <p className="text-xs text-gray-500">{location.properties} properties</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">R{(location.value / 1000000).toFixed(1)}M</p>
                      <p className={`text-xs font-medium ${location.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        +{location.growth}% growth
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Market Insights</h3>
              <div className="space-y-3">
                {marketInsights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-1 rounded-full ${
                      insight.type === 'positive' ? 'bg-green-100' :
                      insight.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      {insight.type === 'positive' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : insight.type === 'warning' ? (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{insight.title}</p>
                      <p className="text-xs text-gray-600">{insight.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{insight.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Properties Performance */}
        {view === 'properties' && (
          <div className="space-y-3">
            {/* Filter */}
            <div className="flex items-center gap-3 mb-4">
              <select className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500">
                <option>All Properties</option>
                <option>High Performance</option>
                <option>Low Performance</option>
                <option>Vacant Units</option>
              </select>
              <button className="p-2 bg-white border border-gray-200 rounded-lg">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Property Cards */}
            {topProperties.map((property) => (
              <motion.div
                key={property.id}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{property.address}</h3>
                    <span className="inline-flex px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium mt-1">
                      {property.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">R{(property.value / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-gray-500">Value</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">R{(property.revenue / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-gray-600">Revenue</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{property.occupancy}%</p>
                    <p className="text-xs text-gray-600">Occupied</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{property.roi}%</p>
                    <p className="text-xs text-gray-600">ROI</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Market Trends */}
        {view === 'trends' && (
          <div className="space-y-4">
            {/* Timeframe Selector */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex gap-1">
                {['3months', '6months', '1year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      timeframe === period
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {period === '3months' ? '3M' : period === '6months' ? '6M' : '1Y'}
                  </button>
                ))}
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Revenue Trend (6 Months)</h3>
              <div className="space-y-2">
                {revenueData.map((data, index) => (
                  <div key={data.month} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-8">{data.month}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.revenue / 700000) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-16">
                      R{(data.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Net Operating Income */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Net Operating Income</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Revenue</span>
                  <span className="text-lg font-bold text-green-600">R{(portfolioData.monthlyRevenue / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Expenses</span>
                  <span className="text-lg font-bold text-red-600">R185k</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-medium">Net Operating Income</span>
                    <span className="text-xl font-bold text-gray-900">R495k</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600 text-sm">NOI Margin</span>
                    <span className="text-lg font-bold text-green-600">72.8%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Performance Insights</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Strong Growth Trend</p>
                    <p className="text-xs text-gray-600">Portfolio has grown {portfolioData.yearOverYearGrowth}% YoY, with consistent revenue increases</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">High ROI Performance</p>
                    <p className="text-xs text-gray-600">{portfolioData.roi}% ROI exceeds industry average of 12%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Occupancy Opportunity</p>
                    <p className="text-xs text-gray-600">Current {portfolioData.occupancyRate}% occupancy - target 90%+ for optimal performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses */}
        {view === 'expenses' && (
          <div className="space-y-4">
            {/* Total Expenses */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Monthly Expenses</h3>
              <p className="text-2xl font-bold text-gray-900 mb-4">
                R {expenseCategories.reduce((sum, cat) => sum + cat.amount, 0).toLocaleString()}
              </p>
              
              {/* Expense Breakdown */}
              <div className="space-y-3">
                {expenseCategories.map((category) => (
                  <div key={category.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{category.category}</span>
                      <span className="text-sm text-gray-600">R {category.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${category.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{category.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Alerts */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Expense Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">High Maintenance Costs</p>
                    <p className="text-xs text-red-600">Maintenance expenses 15% above budget this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Insurance Savings</p>
                    <p className="text-xs text-green-600">New policy saved R5,000 this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Upcoming Renewal</p>
                    <p className="text-xs text-yellow-600">Property management contract expires in 30 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost per Property */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Average Cost per Property</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">R10,600</p>
                  <p className="text-xs text-gray-600">Monthly Average</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">R127,200</p>
                  <p className="text-xs text-gray-600">Annual Average</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}