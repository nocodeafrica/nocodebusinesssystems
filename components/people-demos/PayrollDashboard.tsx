'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Download,
  CreditCard,
  PieChart,
  Receipt,
  Shield,
  Gift,
  Calculator,
  FileText,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Clock,
  AlertCircle,
  CheckCircle,
  Wallet,
  Building,
  Heart,
  Car,
  Home,
  Briefcase,
  Filter
} from 'lucide-react'

// Payroll summary data
const payrollSummary = {
  currentPeriod: 'November 2023',
  totalPayroll: 10709400,
  employeesPaid: 156,
  avgSalary: 68652,
  nextPayDate: 'Nov 30, 2023',
  taxWithheld: 2141880,
  benefitsCost: 1491600,
  netPay: 7075920
}

// Employee compensation data
const topEarners = [
  { id: 1, name: 'Lerato Ndlovu', role: 'Head of Engineering', avatar: 'https://i.pravatar.cc/150?img=1', baseSalary: 2220000, bonus: 336000, total: 2556000, change: +12 },
  { id: 2, name: 'Fatima Abrahams', role: 'HR Director', avatar: 'https://i.pravatar.cc/150?img=9', baseSalary: 1980000, bonus: 264000, total: 2244000, change: +8 },
  { id: 3, name: 'Mpho Khumalo', role: 'Product Manager', avatar: 'https://i.pravatar.cc/150?img=3', baseSalary: 1740000, bonus: 216000, total: 1956000, change: +15 },
  { id: 4, name: 'Nalini Pillay', role: 'Marketing Manager', avatar: 'https://i.pravatar.cc/150?img=5', baseSalary: 1620000, bonus: 192000, total: 1812000, change: +10 },
  { id: 5, name: 'Pieter van Wyk', role: 'Senior Developer', avatar: 'https://i.pravatar.cc/150?img=11', baseSalary: 1500000, bonus: 180000, total: 1680000, change: +5 }
]

// Benefits breakdown
const benefitsData = [
  { category: 'Medical Aid', amount: 547200, percentage: 36.7, icon: Heart, color: 'from-red-500 to-pink-500' },
  { category: 'Pension Fund', amount: 458400, percentage: 30.7, icon: Building, color: 'from-blue-500 to-indigo-500' },
  { category: 'Life Insurance', amount: 12400, percentage: 10.0, icon: Shield, color: 'from-green-500 to-emerald-500' },
  { category: 'Transportation', amount: 15300, percentage: 12.3, icon: Car, color: 'from-purple-500 to-violet-500' },
  { category: 'Other Benefits', amount: 12800, percentage: 10.3, icon: Gift, color: 'from-orange-500 to-amber-500' }
]

// Payroll history
const payrollHistory = [
  { month: 'Jul', gross: 10140000, net: 6756000, tax: 2028000, benefits: 1356000 },
  { month: 'Aug', gross: 10344000, net: 6888000, tax: 2064000, benefits: 1392000 },
  { month: 'Sep', gross: 10536000, net: 7020000, tax: 2112000, benefits: 1404000 },
  { month: 'Oct', gross: 10620000, net: 7068000, tax: 2124000, benefits: 1428000 },
  { month: 'Nov', gross: 10709400, net: 7075920, tax: 2141880, benefits: 1491600 }
]

// Department costs
const departmentCosts = [
  { name: 'Engineering', employees: 45, totalCost: 412000, avgCost: 9155, trend: 'up' },
  { name: 'Sales', employees: 31, totalCost: 186000, avgCost: 6000, trend: 'up' },
  { name: 'Marketing', employees: 22, totalCost: 132000, avgCost: 6000, trend: 'stable' },
  { name: 'Operations', employees: 28, totalCost: 112000, avgCost: 4000, trend: 'down' },
  { name: 'HR & Admin', employees: 18, totalCost: 81000, avgCost: 4500, trend: 'stable' }
]

// Pending actions
const pendingActions = [
  { id: 1, type: 'approval', title: 'Overtime Approval', employee: 'Michael Chen', amount: 2400, date: 'Nov 25' },
  { id: 2, type: 'adjustment', title: 'Salary Adjustment', employee: 'Emily Rodriguez', amount: 5000, date: 'Dec 1' },
  { id: 3, type: 'bonus', title: 'Performance Bonus', employee: 'David Kim', amount: 8000, date: 'Nov 30' }
]

const PayrollDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [viewMode, setViewMode] = useState<'summary' | 'details'>('summary')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <ChevronDown className="w-4 h-4 text-red-500" />
    return null
  }

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll & Compensation</h2>
          <p className="text-sm text-gray-500 mt-1">Manage salaries, benefits, and tax compliance</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('summary')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'summary' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setViewMode('details')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'details' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Details
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white border border-gray-200 rounded-xl text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">{payrollSummary.currentPeriod}</span>
            <span className="sm:hidden">Nov 2023</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white rounded-xl text-xs md:text-sm font-medium hover:bg-green-700">
            <CreditCard className="w-3 h-3 md:w-4 md:h-4" />
            Run Payroll
          </button>
        </div>
      </div>

      {/* Key Metrics - Show in both modes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 lg:mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">+3.2%</span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{formatCurrency(payrollSummary.totalPayroll)}</p>
          <p className="text-xs text-gray-500">Total Payroll</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-600">Active</span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{payrollSummary.employeesPaid}</p>
          <p className="text-xs text-gray-500">Employees Paid</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Receipt className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-red-600 font-medium">20%</span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-gray-900">{formatCurrency(payrollSummary.taxWithheld)}</p>
          <p className="text-xs text-gray-500">Tax Withheld</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-gray-600">Due</span>
          </div>
          <p className="text-sm md:text-lg font-bold text-gray-900">{payrollSummary.nextPayDate}</p>
          <p className="text-xs text-gray-500">Next Pay Date</p>
        </motion.div>
      </div>

      {/* Summary Mode Content */}
      {viewMode === 'summary' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left Column - Compensation & Benefits */}
        <div className="lg:col-span-8 space-y-4 lg:space-y-6">
          {/* Top Earners */}
          <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Employee Compensation</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {topEarners.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-3 md:p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getChangeIcon(employee.change)}
                      <span className={`text-xs font-medium ${
                        employee.change > 0 ? 'text-green-600' : employee.change < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {Math.abs(employee.change)}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Base</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-700">{formatCurrency(employee.baseSalary)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Bonus</p>
                      <p className="text-xs sm:text-sm font-medium text-green-600">{formatCurrency(employee.bonus)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-sm sm:text-lg font-bold text-gray-900">{formatCurrency(employee.total)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Payroll Breakdown Chart */}
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Payroll Breakdown</h3>
            <div className="flex items-end justify-between gap-1 sm:gap-2 md:gap-4 mb-4 md:mb-6 overflow-x-auto pb-2">
              {payrollHistory.map((month, index) => (
                <div key={month.month} className="flex-shrink-0 min-w-[60px] sm:min-w-[80px] md:flex-1">
                  <div className="space-y-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: '100px' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative"
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg"
                        style={{ height: `${(month.net / month.gross) * 100}px` }}
                      />
                      <div
                        className="absolute left-0 right-0 bg-gradient-to-t from-red-500 to-orange-400 rounded-t-lg"
                        style={{ 
                          bottom: `${(month.net / month.gross) * 100}px`,
                          height: `${(month.tax / month.gross) * 100}px`
                        }}
                      />
                      <div
                        className="absolute left-0 right-0 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-lg"
                        style={{ 
                          bottom: `${((month.net + month.tax) / month.gross) * 100}px`,
                          height: `${(month.benefits / month.gross) * 100}px`
                        }}
                      />
                    </motion.div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-600 text-center mt-2">{month.month}</p>
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-900 text-center hidden sm:block">{formatCurrency(month.gross)}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gradient-to-t from-green-500 to-emerald-400 rounded" />
                <span className="text-[10px] sm:text-xs text-gray-600">Net Pay</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gradient-to-t from-red-500 to-orange-400 rounded" />
                <span className="text-[10px] sm:text-xs text-gray-600">Tax</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gradient-to-t from-blue-500 to-indigo-400 rounded" />
                <span className="text-[10px] sm:text-xs text-gray-600">Benefits</span>
              </div>
            </div>
          </div>

          {/* Department Costs */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Costs</h3>
            <div className="space-y-3">
              {departmentCosts.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{dept.name}</p>
                      <p className="text-xs text-gray-500">{dept.employees} employees</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(dept.totalCost)}</p>
                      <p className="text-xs text-gray-500">Avg: {formatCurrency(dept.avgCost)}</p>
                    </div>
                    <div className="flex items-center">
                      {dept.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                      {dept.trend === 'down' && <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />}
                      {dept.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Benefits & Actions */}
        <div className="lg:col-span-4 space-y-4 lg:space-y-6">
          {/* Benefits Breakdown */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits Distribution</h3>
            <div className="space-y-3">
              {benefitsData.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div key={benefit.category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${benefit.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{benefit.category}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(benefit.amount)}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{benefit.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${benefit.percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full bg-gradient-to-r ${benefit.color} rounded-full`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Benefits</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(payrollSummary.benefitsCost)}</span>
              </div>
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Actions</h3>
              <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                3 Items
              </span>
            </div>
            <div className="space-y-3">
              {pendingActions.map((action) => (
                <div key={action.id} className="bg-white rounded-xl p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        action.type === 'approval' ? 'bg-yellow-100' :
                        action.type === 'adjustment' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {action.type === 'approval' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                        {action.type === 'adjustment' && <Calculator className="w-4 h-4 text-blue-600" />}
                        {action.type === 'bonus' && <Gift className="w-4 h-4 text-green-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{action.employee}</p>
                        <p className="text-xs text-gray-400 mt-1">Due: {action.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(action.amount)}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
              Review All Actions
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-left hover:bg-white/30 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Generate Pay Stubs</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-left hover:bg-white/30 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Export Reports</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-left hover:bg-white/30 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5" />
                  <span className="font-medium">Tax Calculator</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Details Mode Content */}
      {viewMode === 'details' && (
        <div className="space-y-6">
          {/* Detailed Employee Payroll */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Employee Payroll Details</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-3 mb-4">
              {topEarners.concat([
                { id: 6, name: 'John Smith', role: 'Developer', avatar: 'https://i.pravatar.cc/150?img=12', baseSalary: 95000, bonus: 5000, total: 100000, change: +3 },
                { id: 7, name: 'Anna Lee', role: 'Designer', avatar: 'https://i.pravatar.cc/150?img=16', baseSalary: 85000, bonus: 8000, total: 93000, change: +7 },
                { id: 8, name: 'Robert Chen', role: 'Analyst', avatar: 'https://i.pravatar.cc/150?img=18', baseSalary: 75000, bonus: 3000, total: 78000, change: 0 }
              ]).slice(0, 5).map((employee) => {
                const overtime = Math.floor(employee.baseSalary * 0.08)
                const deductions = Math.floor(employee.baseSalary * 0.05)
                const tax = Math.floor((employee.baseSalary + employee.bonus + overtime) * 0.22)
                const benefits = Math.floor(employee.baseSalary * 0.15)
                const netPay = employee.baseSalary + employee.bonus + overtime - deductions - tax - benefits
                
                return (
                  <div key={employee.id} className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.role}</p>
                      </div>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Paid</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Base</p>
                        <p className="text-sm font-medium">{formatCurrency(employee.baseSalary)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Bonus</p>
                        <p className="text-sm font-medium text-green-600">{formatCurrency(employee.bonus)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Tax</p>
                        <p className="text-sm font-medium text-orange-600">{formatCurrency(tax)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Benefits</p>
                        <p className="text-sm font-medium text-blue-600">{formatCurrency(benefits)}</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Net Pay</span>
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(netPay)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Employee</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Base Salary</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Overtime</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Bonuses</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Deductions</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Tax</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Benefits</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Net Pay</th>
                    <th className="text-center py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topEarners.concat([
                    { id: 6, name: 'John Smith', role: 'Developer', avatar: 'https://i.pravatar.cc/150?img=12', baseSalary: 95000, bonus: 5000, total: 100000, change: +3 },
                    { id: 7, name: 'Anna Lee', role: 'Designer', avatar: 'https://i.pravatar.cc/150?img=16', baseSalary: 85000, bonus: 8000, total: 93000, change: +7 },
                    { id: 8, name: 'Robert Chen', role: 'Analyst', avatar: 'https://i.pravatar.cc/150?img=18', baseSalary: 75000, bonus: 3000, total: 78000, change: 0 }
                  ]).map((employee) => {
                    const overtime = Math.floor(employee.baseSalary * 0.08)
                    const deductions = Math.floor(employee.baseSalary * 0.05)
                    const tax = Math.floor((employee.baseSalary + employee.bonus + overtime) * 0.22)
                    const benefits = Math.floor(employee.baseSalary * 0.15)
                    const netPay = employee.baseSalary + employee.bonus + overtime - deductions - tax - benefits
                    
                    return (
                      <tr key={employee.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={employee.avatar} alt={employee.name} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                              <p className="text-xs text-gray-500">{employee.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-gray-900">{formatCurrency(employee.baseSalary)}</td>
                        <td className="py-3 px-4 text-right text-sm text-gray-900">{formatCurrency(overtime)}</td>
                        <td className="py-3 px-4 text-right text-sm text-green-600 font-medium">{formatCurrency(employee.bonus)}</td>
                        <td className="py-3 px-4 text-right text-sm text-red-600">{formatCurrency(deductions)}</td>
                        <td className="py-3 px-4 text-right text-sm text-orange-600">{formatCurrency(tax)}</td>
                        <td className="py-3 px-4 text-right text-sm text-blue-600">{formatCurrency(benefits)}</td>
                        <td className="py-3 px-4 text-right text-sm font-bold text-gray-900">{formatCurrency(netPay)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Paid</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
              <p className="text-xs sm:text-sm text-gray-500">Showing 1-8 of 156 employees</p>
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50">←</button>
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-medium">1</button>
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50">2</button>
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50">3</button>
                <span className="px-1 text-xs text-gray-400">...</span>
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50">20</button>
                <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50">→</button>
              </div>
            </div>
          </div>

          {/* Tax & Compliance Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Federal Income Tax</p>
                    <p className="text-xs text-gray-500">22% rate</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(98450)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">State Income Tax</p>
                    <p className="text-xs text-gray-500">6.5% rate</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(42300)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Social Security</p>
                    <p className="text-xs text-gray-500">6.2% rate</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(28940)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Medicare</p>
                    <p className="text-xs text-gray-500">1.45% rate</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(8800)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Total Tax Withheld</p>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(178490)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Form 941</p>
                      <p className="text-xs text-gray-500">Quarterly Tax Return</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Filed Oct 31</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">W-2 Forms</p>
                      <p className="text-xs text-gray-500">Employee Tax Forms</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Ready</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">State Tax Payment</p>
                      <p className="text-xs text-gray-500">Monthly Payment</p>
                    </div>
                  </div>
                  <span className="text-xs text-yellow-600 font-medium">Due Nov 30</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">FICA Deposits</p>
                      <p className="text-xs text-gray-500">Semi-weekly</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Current</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
                View Compliance Calendar
              </button>
            </div>
          </div>

          {/* Payroll History Chart */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">12-Month Payroll Trend</h3>
            <div className="grid grid-cols-12 gap-1 md:gap-2 items-end h-32 md:h-48 overflow-x-auto">
              {[
                { month: 'Jan', amount: 825000 },
                { month: 'Feb', amount: 830000 },
                { month: 'Mar', amount: 835000 },
                { month: 'Apr', amount: 842000 },
                { month: 'May', amount: 848000 },
                { month: 'Jun', amount: 855000 },
                { month: 'Jul', amount: 845000 },
                { month: 'Aug', amount: 862000 },
                { month: 'Sep', amount: 878000 },
                { month: 'Oct', amount: 885000 },
                { month: 'Nov', amount: 892450 },
                { month: 'Dec', amount: 905000 }
              ].map((data, index) => (
                <div key={data.month} className="flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.amount / 905000) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg hover:from-green-600 hover:to-emerald-500 transition-colors cursor-pointer relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(data.amount)}
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PayrollDashboard