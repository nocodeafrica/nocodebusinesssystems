'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  FileText,
  Upload,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Shield,
  Brain,
  Search,
  Download,
  Eye,
  Calendar,
  Building2,
  User,
  Scale,
  Sparkles,
  Info,
  XCircle,
  DollarSign,
  Target,
  Activity,
  Lock,
  AlertOctagon,
  RefreshCw,
  Share2,
  Filter,
  ChevronRight
} from 'lucide-react'

interface ContractIntelligenceMobileProps {
  onBack?: () => void
}

// Sample contract data (from desktop component)
const sampleContract = {
  title: 'Service Agreement - TechCorp Solutions',
  parties: ['TechCorp Solutions (Pty) Ltd', 'Innovation Partners SA'],
  value: 'R 2,400,000',
  duration: '24 months',
  date: '2024-01-15',
  type: 'Service Agreement',
  status: 'Under Review',
  riskScore: 72
}

// Extracted clauses with risk analysis
const extractedClauses = [
  {
    id: 1,
    type: 'payment-terms',
    title: 'Payment Terms',
    content: 'Payment shall be made within 30 days of invoice date. Late payments will incur interest at prime + 2%.',
    risk: 'low',
    icon: DollarSign,
    highlights: ['30 days', 'prime + 2%'],
    position: { page: 3, paragraph: 2 }
  },
  {
    id: 2,
    type: 'termination',
    title: 'Termination Clause',
    content: 'Either party may terminate with 30 days written notice without cause.',
    risk: 'high',
    icon: AlertOctagon,
    highlights: ['30 days', 'without cause'],
    position: { page: 8, paragraph: 4 },
    alert: 'Unusually short termination notice period'
  },
  {
    id: 3,
    type: 'liability',
    title: 'Limitation of Liability',
    content: 'Total liability shall not exceed the total contract value paid in the preceding 12 months.',
    risk: 'medium',
    icon: Shield,
    highlights: ['12 months', 'total contract value'],
    position: { page: 12, paragraph: 1 }
  },
  {
    id: 4,
    type: 'confidentiality',
    title: 'Confidentiality',
    content: 'Confidential information must be protected for 5 years after contract termination.',
    risk: 'low',
    icon: Lock,
    highlights: ['5 years', 'after termination'],
    position: { page: 15, paragraph: 3 }
  },
  {
    id: 5,
    type: 'ip-rights',
    title: 'Intellectual Property',
    content: 'All work product becomes exclusive property of the client upon payment.',
    risk: 'medium',
    icon: Brain,
    highlights: ['exclusive property', 'upon payment'],
    position: { page: 18, paragraph: 2 },
    alert: 'No retention of IP rights for service provider'
  }
]

// Risk summary
const riskSummary = {
  high: 1,
  medium: 2,
  low: 2,
  totalClauses: 45,
  reviewedClauses: 38,
  flaggedClauses: 5
}

// Recent contracts for comparison
const recentContracts = [
  { id: 1, title: 'NDA - DataTech SA', date: '2024-01-10', riskScore: 25, value: 'N/A', status: 'Approved' },
  { id: 2, title: 'Supply Agreement - BuildCo', date: '2024-01-08', riskScore: 45, value: 'R 850,000', status: 'Pending' },
  { id: 3, title: 'Employment Contract', date: '2024-01-05', riskScore: 15, value: 'R 480,000/year', status: 'Approved' }
]

export default function ContractIntelligenceMobile({ onBack }: ContractIntelligenceMobileProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'clauses' | 'risks' | 'history'>('analysis')
  const [selectedClause, setSelectedClause] = useState<number | null>(null)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskBadgeColor = (score: number) => {
    if (score >= 70) return 'bg-red-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-green-500'
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
                <h1 className="text-xl font-bold text-gray-900">Contract Intelligence</h1>
                <p className="text-sm text-gray-600">AI-powered analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Info Card */}
      <div className="px-4 pt-4">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">{sampleContract.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{sampleContract.type}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              sampleContract.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
            }`}>
              {sampleContract.status}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-500">Contract Value</p>
              <p className="text-sm font-semibold text-gray-900">{sampleContract.value}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-semibold text-gray-900">{sampleContract.duration}</p>
            </div>
          </div>

          {/* Risk Score Indicator */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Risk Score</span>
              <span className="text-lg font-bold text-gray-900">{sampleContract.riskScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className={getRiskBadgeColor(sampleContract.riskScore)}
                initial={{ width: 0 }}
                animate={{ width: `${sampleContract.riskScore}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[60px] z-10">
        <div className="px-4">
          <div className="flex gap-6">
            {[
              { id: 'analysis', label: 'Analysis', icon: Brain },
              { id: 'clauses', label: 'Clauses', icon: FileText },
              { id: 'risks', label: 'Risks', icon: AlertTriangle },
              { id: 'history', label: 'History', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
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
        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-4">
            {/* AI Summary */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="w-5 h-5 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">AI Analysis Summary</h3>
                  <p className="text-sm opacity-90">
                    This service agreement contains standard terms with notable exceptions in termination and IP clauses. 
                    The 30-day termination without cause presents elevated risk for service continuity.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>28 pages</span>
                </div>
              </div>
            </div>

            {/* Risk Overview */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Risk Overview</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">High Risk</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{riskSummary.high} clause</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Medium Risk</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{riskSummary.medium} clauses</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Low Risk</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{riskSummary.low} clauses</span>
                </div>
              </div>
            </div>

            {/* Key Parties */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Contract Parties</h3>
              <div className="space-y-3">
                {sampleContract.parties.map((party, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{party}</p>
                      <p className="text-xs text-gray-500">Party {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white rounded-xl shadow-sm p-3 flex items-center justify-center gap-2 hover:shadow-md transition-shadow">
                <Scale className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-900">Compare</span>
              </button>
              <button className="bg-white rounded-xl shadow-sm p-3 flex items-center justify-center gap-2 hover:shadow-md transition-shadow">
                <Target className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-900">Negotiate</span>
              </button>
            </div>
          </div>
        )}

        {/* Clauses Tab */}
        {activeTab === 'clauses' && (
          <div className="space-y-3">
            {extractedClauses.map((clause) => {
              const Icon = clause.icon
              return (
                <motion.div
                  key={clause.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedClause(selectedClause === clause.id ? null : clause.id)}
                  className="bg-white rounded-xl shadow-sm p-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getRiskColor(clause.risk)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{clause.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(clause.risk)}`}>
                          {clause.risk} risk
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{clause.content}</p>
                      {clause.alert && (
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <p className="text-xs text-yellow-800">{clause.alert}</p>
                        </div>
                      )}
                      {selectedClause === clause.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-gray-200"
                        >
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Page {clause.position.page}</span>
                            <span>Paragraph {clause.position.paragraph}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {clause.highlights.map((highlight, i) => (
                              <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Risks Tab */}
        {activeTab === 'risks' && (
          <div className="space-y-4">
            {/* Critical Risk Alert */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Critical Risk Identified</h3>
                  <p className="text-sm text-red-800 mb-2">
                    The termination clause allows either party to exit with only 30 days notice without cause, 
                    creating significant business continuity risk.
                  </p>
                  <button className="text-sm font-medium text-red-600 underline">
                    View Mitigation Options
                  </button>
                </div>
              </div>
            </div>

            {/* Risk Matrix */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Risk Assessment Matrix</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <div className="w-full h-20 bg-yellow-100 rounded-lg flex items-center justify-center mb-1">
                    <span className="text-2xl font-bold text-yellow-700">2</span>
                  </div>
                  <p className="text-xs text-gray-600">Low</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-20 bg-orange-100 rounded-lg flex items-center justify-center mb-1">
                    <span className="text-2xl font-bold text-orange-700">2</span>
                  </div>
                  <p className="text-xs text-gray-600">Medium</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-20 bg-red-100 rounded-lg flex items-center justify-center mb-1">
                    <span className="text-2xl font-bold text-red-700">1</span>
                  </div>
                  <p className="text-xs text-gray-600">High</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Clauses Analyzed</span>
                <span className="font-semibold text-gray-900">{riskSummary.totalClauses}</span>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Recommended Actions</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Negotiate termination period</p>
                    <p className="text-xs text-gray-600">Extend to 90 days minimum</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Add termination penalties</p>
                    <p className="text-xs text-gray-600">Include early termination fees</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Review IP assignment</p>
                    <p className="text-xs text-gray-600">Consider shared IP model</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Recent Contracts</h3>
              <p className="text-sm text-gray-600">Compare with similar agreements</p>
            </div>
            {recentContracts.map((contract) => (
              <motion.div
                key={contract.id}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{contract.title}</h4>
                    <p className="text-sm text-gray-600">{contract.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contract.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {contract.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Contract Value</p>
                    <p className="text-sm font-semibold text-gray-900">{contract.value}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Risk Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={getRiskBadgeColor(contract.riskScore)}
                          style={{ width: `${contract.riskScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{contract.riskScore}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}