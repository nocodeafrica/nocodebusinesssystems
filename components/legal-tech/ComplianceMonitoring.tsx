'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
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
  Users
} from 'lucide-react'

// Compliance data
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
    color: 'from-green-500 to-emerald-500'
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
    color: 'from-yellow-500 to-amber-500'
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
    color: 'from-blue-500 to-indigo-500'
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
    color: 'from-red-500 to-rose-500'
  }
]

// Recent activities
const recentActivities = [
  { id: 1, type: 'update', message: 'POPIA policy updated', time: '2 hours ago', status: 'success' },
  { id: 2, type: 'alert', message: 'Tax filing deadline approaching', time: '5 hours ago', status: 'warning' },
  { id: 3, type: 'audit', message: 'Quarterly compliance audit completed', time: '1 day ago', status: 'info' },
  { id: 4, type: 'violation', message: 'Minor BCEA violation detected', time: '2 days ago', status: 'error' }
]

// Risk matrix data
const riskMatrix = [
  { area: 'Data Protection', likelihood: 'low', impact: 'high', score: 6 },
  { area: 'Financial Reporting', likelihood: 'medium', impact: 'high', score: 8 },
  { area: 'Employment Practices', likelihood: 'low', impact: 'medium', score: 4 },
  { area: 'Tax Compliance', likelihood: 'high', impact: 'high', score: 9 },
  { area: 'Environmental', likelihood: 'low', impact: 'low', score: 2 }
]

const ComplianceMonitoring = () => {
  const [selectedArea, setSelectedArea] = useState(complianceAreas[0])
  const [viewMode, setViewMode] = useState<'dashboard' | 'details' | 'matrix'>('dashboard')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshCounter, setRefreshCounter] = useState(0)

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setRefreshCounter(prev => prev + 1)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'compliant': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'bg-green-500'
    if (score <= 6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white rounded-3xl p-8 min-h-[700px] border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Compliance Monitoring</h2>
          <p className="text-gray-600">Real-time regulatory compliance tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Live' : 'Paused'}
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-medium shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </motion.button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {['dashboard', 'details', 'matrix'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === mode
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {viewMode === 'dashboard' && (
        <div>
          {/* Overall Status */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-white/80" />
                <span className="text-2xl font-bold">85%</span>
              </div>
              <p className="text-xs text-white/80">Overall Compliance</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl p-4 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-white/80" />
                <span className="text-2xl font-bold">12</span>
              </div>
              <p className="text-xs text-white/80">Active Warnings</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl p-4 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-5 h-5 text-white/80" />
                <span className="text-2xl font-bold">3</span>
              </div>
              <p className="text-xs text-white/80">Critical Issues</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-4 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-white/80" />
                <span className="text-2xl font-bold">Live</span>
              </div>
              <p className="text-xs text-white/80">Monitoring Status</p>
            </motion.div>
          </div>

          {/* Compliance Areas Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {complianceAreas.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedArea(area)}
                className={`p-6 bg-white border rounded-2xl cursor-pointer transition-all hover:shadow-lg ${
                  selectedArea.id === area.id ? 'border-indigo-500 shadow-lg' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 bg-gradient-to-r ${area.color} rounded-xl`}>
                      <area.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{area.name}</h3>
                      <p className="text-sm text-gray-500">{area.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(area.status)}`}>
                    {area.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Compliance Score</span>
                    <span className="text-sm font-bold text-gray-900">{area.score}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${area.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${area.score}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="text-lg font-semibold text-gray-900">{area.items}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Issues</p>
                    <p className="text-lg font-semibold text-red-600">{area.issues}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Next Audit</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(area.nextAudit).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Activities */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    {activity.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {activity.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                    {activity.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                    {activity.status === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'details' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Selected Area Details */}
          <div className="col-span-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 bg-gradient-to-r ${selectedArea.color} rounded-xl`}>
                  <selectedArea.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedArea.name}</h3>
                  <p className="text-gray-600">{selectedArea.description}</p>
                </div>
                <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedArea.status)}`}>
                  {selectedArea.status}
                </span>
              </div>

              {/* Compliance Items */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Compliance Requirements</h4>
                <div className="space-y-3">
                  {['Data encryption at rest', 'User consent mechanisms', 'Data breach notification', 'Right to deletion', 'Access controls'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                      <span className="text-sm text-gray-500">Compliant</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues & Actions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Outstanding Issues</h4>
                <div className="space-y-3">
                  {selectedArea.issues > 0 ? (
                    <>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">Data retention policy update required</p>
                            <p className="text-sm text-gray-600 mt-1">Policy needs to be updated to comply with new regulations</p>
                            <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">View Details →</button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">Missing privacy impact assessment</p>
                            <p className="text-sm text-gray-600 mt-1">Required assessment not completed for new data processing</p>
                            <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">Take Action →</button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-gray-700">No outstanding issues</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Audit History */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Audit History</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Q4 2023 Audit</p>
                      <p className="text-sm text-gray-500">Completed on {selectedArea.lastAudit}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">Passed</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Q3 2023 Audit</p>
                      <p className="text-sm text-gray-500">Completed on 2023-10-15</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">Passed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Score Breakdown */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Score Breakdown</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Technical Controls</span>
                    <span className="text-sm font-medium text-gray-900">95%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Administrative</span>
                    <span className="text-sm font-medium text-gray-900">88%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Physical Security</span>
                    <span className="text-sm font-medium text-gray-900">92%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Next Steps</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Schedule Q1 2024 Audit</p>
                    <p className="text-xs text-gray-500">Due in 15 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Update privacy policy</p>
                    <p className="text-xs text-gray-500">Due in 30 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Staff training session</p>
                    <p className="text-xs text-gray-500">Scheduled for next week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'matrix' && (
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Risk Matrix</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center text-sm text-gray-600 font-medium pb-2">Low Impact</div>
                <div className="text-center text-sm text-gray-600 font-medium pb-2">Medium Impact</div>
                <div className="text-center text-sm text-gray-600 font-medium pb-2">High Impact</div>
                
                {/* Risk Grid */}
                {['high', 'medium', 'low'].map((likelihood) => 
                    ['low', 'medium', 'high'].map((impact) => {
                      const items = riskMatrix.filter(r => 
                        r.likelihood === likelihood && 
                        (impact === 'low' && r.impact === 'low' ||
                         impact === 'medium' && r.impact === 'medium' ||
                         impact === 'high' && r.impact === 'high')
                      )
                      const riskLevel = 
                        likelihood === 'high' && impact === 'high' ? 9 :
                        likelihood === 'high' && impact === 'medium' ? 6 :
                        likelihood === 'high' && impact === 'low' ? 3 :
                        likelihood === 'medium' && impact === 'high' ? 6 :
                        likelihood === 'medium' && impact === 'medium' ? 5 :
                        likelihood === 'medium' && impact === 'low' ? 2 :
                        likelihood === 'low' && impact === 'high' ? 3 :
                        likelihood === 'low' && impact === 'medium' ? 2 :
                        1
                      
                      return (
                        <div
                          key={`${likelihood}-${impact}`}
                          className={`h-24 rounded-lg border-2 border-gray-300 p-2 ${
                            riskLevel >= 7 ? 'bg-red-100' :
                            riskLevel >= 4 ? 'bg-yellow-100' :
                            'bg-green-100'
                          }`}
                        >
                          {items.map(item => (
                            <div key={item.area} className="text-xs font-medium text-gray-700 mb-1">
                              {item.area}
                            </div>
                          ))}
                        </div>
                      )
                    })
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center text-sm text-gray-600 font-medium">Low Likelihood</div>
                <div className="text-center text-sm text-gray-600 font-medium">Medium Likelihood</div>
                <div className="text-center text-sm text-gray-600 font-medium">High Likelihood</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">Risk Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded border border-green-300" />
                    <span className="text-sm text-gray-600">Low Risk (1-3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 rounded border border-yellow-300" />
                    <span className="text-sm text-gray-600">Medium Risk (4-6)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 rounded border border-red-300" />
                    <span className="text-sm text-gray-600">High Risk (7-9)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComplianceMonitoring