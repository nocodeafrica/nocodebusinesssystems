'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  FileText,
  Building2,
  Calendar,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Info,
  XCircle,
  Clock,
  Target,
  BarChart3,
  Eye,
  Users,
  TrendingDown,
  AlertOctagon
} from 'lucide-react'

interface ComplianceMonitoringMobileProps {
  onBack?: () => void
}

// Compliance areas (from desktop component)
const complianceAreas = [
  {
    id: 1,
    name: 'POPIA Compliance',
    description: 'Protection of Personal Information Act',
    status: 'compliant',
    score: 92,
    lastAudit: '2024-01-10',
    nextAudit: '2024-02-10',
    items: 45,
    issues: 2,
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    trend: 'up',
    change: 5
  },
  {
    id: 2,
    name: 'Financial Services',
    description: 'FSCA Regulations',
    status: 'warning',
    score: 78,
    lastAudit: '2024-01-05',
    nextAudit: '2024-02-05',
    items: 38,
    issues: 8,
    icon: Building2,
    color: 'from-yellow-500 to-amber-500',
    trend: 'stable',
    change: 0
  },
  {
    id: 3,
    name: 'Labour Law',
    description: 'BCEA & LRA Compliance',
    status: 'compliant',
    score: 88,
    lastAudit: '2024-01-15',
    nextAudit: '2024-02-15',
    items: 52,
    issues: 4,
    icon: Users,
    color: 'from-blue-500 to-indigo-500',
    trend: 'up',
    change: 3
  },
  {
    id: 4,
    name: 'Tax Compliance',
    description: 'SARS Requirements',
    status: 'critical',
    score: 65,
    lastAudit: '2023-12-20',
    nextAudit: '2024-01-25',
    items: 28,
    issues: 12,
    icon: FileText,
    color: 'from-red-500 to-rose-500',
    trend: 'down',
    change: -8
  }
]

// Recent activities
const recentActivities = [
  { id: 1, type: 'update', message: 'POPIA policy updated', time: '2 hours ago', status: 'success', icon: CheckCircle },
  { id: 2, type: 'alert', message: 'Tax filing deadline approaching', time: '5 hours ago', status: 'warning', icon: AlertTriangle },
  { id: 3, type: 'audit', message: 'Quarterly compliance audit completed', time: '1 day ago', status: 'info', icon: FileText },
  { id: 4, type: 'violation', message: 'Minor BCEA violation detected', time: '2 days ago', status: 'error', icon: XCircle }
]

// Risk matrix data
const riskMatrix = [
  { area: 'Data Protection', likelihood: 'low', impact: 'high', score: 6 },
  { area: 'Financial Reporting', likelihood: 'medium', impact: 'high', score: 8 },
  { area: 'Employment Practices', likelihood: 'low', impact: 'medium', score: 4 },
  { area: 'Tax Compliance', likelihood: 'high', impact: 'high', score: 9 },
  { area: 'Environmental', likelihood: 'low', impact: 'low', score: 2 }
]

// Upcoming deadlines
const upcomingDeadlines = [
  { id: 1, title: 'Annual Tax Return', date: '2024-02-28', daysLeft: 45, priority: 'high' },
  { id: 2, title: 'POPIA Data Audit', date: '2024-02-10', daysLeft: 27, priority: 'medium' },
  { id: 3, title: 'Employment Equity Report', date: '2024-03-15', daysLeft: 61, priority: 'medium' },
  { id: 4, title: 'FSCA Quarterly Report', date: '2024-01-31', daysLeft: 17, priority: 'high' }
]

export default function ComplianceMonitoringMobile({ onBack }: ComplianceMonitoringMobileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'areas' | 'activities' | 'deadlines'>('overview')
  const [selectedArea, setSelectedArea] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-700'
      case 'warning': return 'bg-yellow-100 text-yellow-700'
      case 'critical': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-600'
      case 'warning': return 'bg-yellow-100 text-yellow-600'
      case 'error': return 'bg-red-100 text-red-600'
      default: return 'bg-blue-100 text-blue-600'
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'bg-red-500'
    if (score >= 5) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Activity className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
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
                <h1 className="text-xl font-bold text-gray-900">Compliance Monitor</h1>
                <p className="text-sm text-gray-600">Real-time regulation tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Compliance Score */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm opacity-90">Overall Compliance Score</p>
              <p className="text-3xl font-bold">81%</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold">2</p>
              <p className="text-xs opacity-80">Critical</p>
            </div>
            <div>
              <p className="text-lg font-bold">8</p>
              <p className="text-xs opacity-80">Warnings</p>
            </div>
            <div>
              <p className="text-lg font-bold">135</p>
              <p className="text-xs opacity-80">Compliant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[60px] z-10">
        <div className="px-4">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'areas', label: 'Areas', icon: Shield },
              { id: 'activities', label: 'Activity', icon: Activity },
              { id: 'deadlines', label: 'Deadlines', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-600'
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

      {/* Tab Content */}
      <div className="px-4 py-6 pb-20">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Risk Heat Map */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Risk Heat Map</h3>
              <div className="space-y-2">
                {riskMatrix.map((risk, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{risk.area}</span>
                        <span className="text-xs text-gray-500">{risk.score}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={getRiskColor(risk.score)}
                          initial={{ width: 0 }}
                          animate={{ width: `${risk.score * 10}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs text-green-600 font-medium">+5%</span>
                </div>
                <p className="text-xl font-bold text-gray-900">145</p>
                <p className="text-xs text-gray-600">Total Requirements</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-xs text-yellow-600 font-medium">4 soon</span>
                </div>
                <p className="text-xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-600">Pending Actions</p>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Critical Alert</h4>
                  <p className="text-sm text-red-800 mb-2">
                    Tax compliance score below threshold. Immediate action required to avoid penalties.
                  </p>
                  <button className="text-sm font-medium text-red-600 underline">
                    View Action Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Areas Tab */}
        {activeTab === 'areas' && (
          <div className="space-y-3">
            {complianceAreas.map((area) => {
              const Icon = area.icon
              return (
                <motion.div
                  key={area.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
                  className="bg-white rounded-xl shadow-sm p-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-900">{area.name}</h3>
                          <p className="text-xs text-gray-600">{area.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(area.status)}`}>
                          {area.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            {getTrendIcon(area.trend, area.change)}
                            <span className={`text-sm font-medium ${
                              area.change > 0 ? 'text-green-600' : 
                              area.change < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {area.change > 0 ? '+' : ''}{area.change}%
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-bold text-gray-900">{area.score}%</span>
                            <span className="text-gray-500"> score</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                          selectedArea === area.id ? 'rotate-90' : ''
                        }`} />
                      </div>

                      {selectedArea === area.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-gray-200"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500">Requirements</p>
                              <p className="text-sm font-semibold text-gray-900">{area.items} items</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Issues</p>
                              <p className="text-sm font-semibold text-red-600">{area.issues} pending</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Last Audit</p>
                              <p className="text-sm font-semibold text-gray-900">{area.lastAudit}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Next Audit</p>
                              <p className="text-sm font-semibold text-gray-900">{area.nextAudit}</p>
                            </div>
                          </div>
                          <button className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">
                            View Details
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const Icon = activity.icon
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-sm p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.status)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
            
            <button className="w-full py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
              Load More Activities
            </button>
          </div>
        )}

        {/* Deadlines Tab */}
        {activeTab === 'deadlines' && (
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <motion.div
                key={deadline.id}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{deadline.title}</h4>
                    <p className="text-sm text-gray-600">Due: {deadline.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    deadline.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {deadline.priority} priority
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{deadline.daysLeft} days left</span>
                  </div>
                  <button className="text-sm font-medium text-emerald-600">
                    Set Reminder
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}