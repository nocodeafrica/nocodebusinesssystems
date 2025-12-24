'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Clock,
  DollarSign,
  Users,
  Target,
  Award,
  Calendar,
  Filter,
  Download,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Briefcase,
  UserCheck,
  UserX,
  Globe,
  Zap,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Layers,
  Brain,
  Heart
} from 'lucide-react'

// Key metrics data
const keyMetrics = [
  {
    label: 'Time to Hire',
    value: '23',
    unit: 'days',
    change: -15,
    trend: 'down',
    target: 30,
    color: 'from-green-500 to-emerald-500'
  },
  {
    label: 'Cost per Hire',
    value: '$3,450',
    unit: '',
    change: -8,
    trend: 'down',
    target: 4000,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    label: 'Quality of Hire',
    value: '87',
    unit: '%',
    change: 5,
    trend: 'up',
    target: 85,
    color: 'from-purple-500 to-violet-500'
  },
  {
    label: 'Offer Acceptance',
    value: '92',
    unit: '%',
    change: 3,
    trend: 'up',
    target: 90,
    color: 'from-orange-500 to-amber-500'
  }
]

// Hiring funnel data
const hiringFunnel = [
  { stage: 'Applications', count: 1847, conversion: 100, color: 'bg-blue-500' },
  { stage: 'Screened', count: 892, conversion: 48, color: 'bg-indigo-500' },
  { stage: 'Phone Interview', count: 356, conversion: 40, color: 'bg-purple-500' },
  { stage: 'Technical Interview', count: 142, conversion: 40, color: 'bg-violet-500' },
  { stage: 'Final Interview', count: 48, conversion: 34, color: 'bg-pink-500' },
  { stage: 'Offer', count: 28, conversion: 58, color: 'bg-orange-500' },
  { stage: 'Hired', count: 24, conversion: 86, color: 'bg-green-500' }
]

// Source effectiveness
const sourceEffectiveness = [
  { source: 'LinkedIn', applications: 456, hires: 8, quality: 89, cost: 1200, roi: 4.2 },
  { source: 'Company Website', applications: 324, hires: 6, quality: 92, cost: 0, roi: 0 },
  { source: 'Employee Referrals', applications: 189, hires: 7, quality: 95, cost: 500, roi: 8.5 },
  { source: 'Indeed', applications: 412, hires: 3, quality: 78, cost: 800, roi: 2.1 },
  { source: 'AngelList', applications: 267, hires: 4, quality: 85, cost: 600, roi: 3.8 }
]

// Department hiring data
const departmentHiring = [
  { department: 'Engineering', openRoles: 12, filled: 8, avgTime: 28, budget: 450000 },
  { department: 'Sales', openRoles: 8, filled: 6, avgTime: 21, budget: 280000 },
  { department: 'Marketing', openRoles: 5, filled: 4, avgTime: 25, budget: 180000 },
  { department: 'Product', openRoles: 4, filled: 3, avgTime: 32, budget: 240000 },
  { department: 'Operations', openRoles: 3, filled: 3, avgTime: 19, budget: 140000 }
]

// Monthly trends
const monthlyTrends = [
  { month: 'Jul', applications: 245, interviews: 48, hires: 3 },
  { month: 'Aug', applications: 312, interviews: 62, hires: 4 },
  { month: 'Sep', applications: 289, interviews: 55, hires: 5 },
  { month: 'Oct', applications: 368, interviews: 71, hires: 6 },
  { month: 'Nov', applications: 412, interviews: 82, hires: 4 },
  { month: 'Dec', applications: 221, interviews: 38, hires: 2 }
]

// Diversity metrics
const diversityMetrics = [
  { category: 'Gender', groups: [
    { name: 'Male', percentage: 52, color: 'bg-blue-500' },
    { name: 'Female', percentage: 45, color: 'bg-pink-500' },
    { name: 'Non-binary', percentage: 3, color: 'bg-purple-500' }
  ]},
  { category: 'Ethnicity', groups: [
    { name: 'White', percentage: 45, color: 'bg-gray-400' },
    { name: 'Asian', percentage: 28, color: 'bg-yellow-500' },
    { name: 'Hispanic', percentage: 15, color: 'bg-orange-500' },
    { name: 'Black', percentage: 10, color: 'bg-green-500' },
    { name: 'Other', percentage: 2, color: 'bg-indigo-500' }
  ]}
]

const RecruitmentAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('quarter')
  const [selectedMetric, setSelectedMetric] = useState('overview')

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up' || change > 0) return <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
    if (trend === 'down' || change < 0) return <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />
    return null
  }

  const getTrendColor = (trend: string, change: number, isPositive: boolean = true) => {
    if (trend === 'up' || change > 0) return isPositive ? 'text-green-600' : 'text-red-600'
    if (trend === 'down' || change < 0) return isPositive ? 'text-red-600' : 'text-green-600'
    return 'text-gray-600'
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recruitment Analytics</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Track and analyze your hiring performance</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        {keyMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${metric.color} rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white`}
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
              <div className={`flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-medium ${
                metric.trend === 'down' && metric.label.includes('Time') ? 'text-white' : 'text-white'
              }`}>
                {getTrendIcon(metric.trend, metric.change)}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {metric.value}<span className="text-xs sm:text-sm opacity-80">{metric.unit}</span>
            </p>
            <p className="text-xs sm:text-sm text-white/80 mt-1 truncate">{metric.label}</p>
            <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/60 rounded-full"
                style={{ width: `${(parseInt(metric.value.replace(/[^0-9]/g, '')) / metric.target) * 100}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          {/* Hiring Funnel */}
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Hiring Funnel</h3>
            <div className="space-y-2 sm:space-y-3">
              {hiringFunnel.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{stage.stage}</span>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">{formatNumber(stage.count)}</span>
                      {index > 0 && (
                        <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                          stage.conversion >= 50 ? 'bg-green-100 text-green-600' :
                          stage.conversion >= 30 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {stage.conversion}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative h-6 sm:h-8 bg-gray-200 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / hiringFunnel[0].count) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`absolute left-0 top-0 h-full ${stage.color} rounded-lg`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Effectiveness - Mobile optimized table */}
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Source Effectiveness</h3>
            
            {/* Mobile view - Cards */}
            <div className="block lg:hidden space-y-3">
              {sourceEffectiveness.map((source) => (
                <div key={source.source} className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{source.source}</span>
                    <span className={`text-sm font-bold ${source.roi > 5 ? 'text-green-600' : source.roi > 3 ? 'text-blue-600' : 'text-gray-600'}`}>
                      {source.roi > 0 ? `${source.roi}x ROI` : 'Free'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">Applications</p>
                      <p className="font-medium text-gray-900">{source.applications}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Hires</p>
                      <p className="font-medium text-green-600">{source.hires}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Quality</p>
                      <p className="font-medium text-gray-900">{source.quality}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view - Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-200">
                    <th className="text-left pb-2">Source</th>
                    <th className="text-center pb-2">Applications</th>
                    <th className="text-center pb-2">Hires</th>
                    <th className="text-center pb-2">Quality</th>
                    <th className="text-center pb-2">Cost</th>
                    <th className="text-right pb-2">ROI</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {sourceEffectiveness.map((source) => (
                    <tr key={source.source} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-900">{source.source}</td>
                      <td className="py-3 text-center text-gray-600">{source.applications}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                          {source.hires}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-full max-w-[60px] h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${source.quality}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{source.quality}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-gray-600">${source.cost}</td>
                      <td className="py-3 text-right">
                        <span className={`font-bold ${source.roi > 5 ? 'text-green-600' : source.roi > 3 ? 'text-blue-600' : 'text-gray-600'}`}>
                          {source.roi > 0 ? `${source.roi}x` : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Monthly Trends</h3>
            <div className="flex items-end justify-between gap-1 sm:gap-2 h-32 sm:h-48">
              {monthlyTrends.map((month, index) => (
                <div key={month.month} className="flex-1 flex flex-col items-center justify-end gap-1 sm:gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.applications / 450) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-full bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-lg relative group"
                  >
                    <div className="hidden sm:block absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {month.applications} apps
                      </div>
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-600">{month.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          {/* Department Hiring */}
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Department Hiring</h3>
            <div className="space-y-3">
              {departmentHiring.map((dept) => (
                <div key={dept.department} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                    <span className="text-xs text-gray-500">{dept.avgTime} days avg</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Open Roles</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">{dept.openRoles}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Filled</p>
                      <div className="flex items-center gap-2">
                        <p className="text-base sm:text-lg font-bold text-green-600">{dept.filled}</p>
                        <span className="text-xs text-gray-500">({Math.round((dept.filled / dept.openRoles) * 100)}%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${(dept.filled / dept.openRoles) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diversity Metrics */}
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Diversity Metrics</h3>
            {diversityMetrics.map((metric) => (
              <div key={metric.category} className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">{metric.category}</h4>
                <div className="space-y-2">
                  {metric.groups.map((group) => (
                    <div key={group.name} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 min-w-[80px]">{group.name}</span>
                      <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${group.percentage}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full ${group.color} rounded-full`}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{group.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg hover:shadow-md transition-shadow text-xs sm:text-sm font-medium text-gray-700">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Custom Report</span>
                <span className="sm:hidden">Report</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg hover:shadow-md transition-shadow text-xs sm:text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="hidden sm:inline">Schedule Review</span>
                <span className="sm:hidden">Review</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg hover:shadow-md transition-shadow text-xs sm:text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 text-green-600" />
                <span className="hidden sm:inline">Team Metrics</span>
                <span className="sm:hidden">Team</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg hover:shadow-md transition-shadow text-xs sm:text-sm font-medium text-gray-700">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="hidden sm:inline">Set Goals</span>
                <span className="sm:hidden">Goals</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecruitmentAnalytics