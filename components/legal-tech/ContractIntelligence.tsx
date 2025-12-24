'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText,
  Upload,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Brain,
  Search,
  Download,
  ChevronRight,
  Eye,
  Calendar,
  Building2,
  User,
  Scale,
  Sparkles,
  ArrowRight,
  Info,
  XCircle,
  DollarSign,
  Target,
  Activity,
  Lock,
  Unlock,
  FileCheck,
  AlertOctagon
} from 'lucide-react'

// Sample contract for demo
const sampleContract = {
  title: 'Service Agreement - TechCorp Solutions',
  parties: ['TechCorp Solutions (Pty) Ltd', 'Innovation Partners SA'],
  value: 'R 2,400,000',
  duration: '24 months',
  date: '2024-01-15',
  type: 'Service Agreement'
}

// Simulated extraction results
const extractedClauses = [
  {
    id: 1,
    type: 'payment-terms',
    title: 'Payment Terms',
    content: 'Payment shall be made within 30 days of invoice...',
    risk: 'low',
    icon: DollarSign,
    highlights: ['30 days', 'invoice'],
    position: { page: 3, paragraph: 2 }
  },
  {
    id: 2,
    type: 'termination',
    title: 'Termination Clause',
    content: 'Either party may terminate with 30 days written notice...',
    risk: 'high',
    icon: AlertOctagon,
    highlights: ['30 days', 'written notice'],
    position: { page: 8, paragraph: 4 },
    alert: 'Unusually short termination notice period'
  },
  {
    id: 3,
    type: 'liability',
    title: 'Limitation of Liability',
    content: 'Total liability shall not exceed the total contract value...',
    risk: 'medium',
    icon: Shield,
    highlights: ['total contract value'],
    position: { page: 12, paragraph: 1 }
  },
  {
    id: 4,
    type: 'confidentiality',
    title: 'Confidentiality',
    content: 'Confidential information must be protected for 5 years...',
    risk: 'low',
    icon: Lock,
    highlights: ['5 years'],
    position: { page: 15, paragraph: 3 }
  },
  {
    id: 5,
    type: 'ip-rights',
    title: 'Intellectual Property',
    content: 'All work product becomes property of the client...',
    risk: 'medium',
    icon: Brain,
    highlights: ['property of the client'],
    position: { page: 18, paragraph: 2 },
    alert: 'No retention of IP rights for service provider'
  }
]

// Risk summary
const riskSummary = {
  overall: 72,
  high: 2,
  medium: 3,
  low: 5,
  criticalIssues: [
    'Short termination notice period',
    'No IP retention rights',
    'Unlimited indemnification clause'
  ]
}

// Comparison with standard template
const comparisonPoints = [
  { aspect: 'Payment Terms', standard: '45 days', current: '30 days', status: 'different' },
  { aspect: 'Termination Notice', standard: '90 days', current: '30 days', status: 'warning' },
  { aspect: 'Liability Cap', standard: '12 months fees', current: 'Total value', status: 'acceptable' },
  { aspect: 'Warranty Period', standard: '12 months', current: '6 months', status: 'warning' }
]

const ContractIntelligence = () => {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle')
  const [selectedClause, setSelectedClause] = useState(extractedClauses[0])
  const [activeTab, setActiveTab] = useState<'extraction' | 'risks' | 'comparison'>('extraction')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [showAnimation, setShowAnimation] = useState(false)

  const handleFileUpload = () => {
    setUploadState('uploading')
    setProcessingProgress(0)
    setShowAnimation(true)
    
    // Simulate upload and processing
    setTimeout(() => {
      setUploadState('processing')
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setUploadState('complete')
            return 100
          }
          return prev + 10
        })
      }, 200)
    }, 1000)
  }

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-500 bg-green-50 border-green-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const getRiskGradient = (risk: string) => {
    switch(risk) {
      case 'high': return 'from-red-500 to-rose-500'
      case 'medium': return 'from-yellow-500 to-amber-500'
      case 'low': return 'from-green-500 to-emerald-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 min-h-[700px] border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Contract Intelligence</h2>
          <p className="text-gray-600">AI-powered contract analysis and risk detection</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Contracts
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFileUpload}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-medium shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Contract
          </motion.button>
        </div>
      </div>

      {/* Upload/Processing Animation */}
      <AnimatePresence>
        {uploadState !== 'idle' && uploadState !== 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">{sampleContract.title}</p>
                  <p className="text-gray-600 text-sm">
                    {uploadState === 'uploading' ? 'Uploading document...' : 'Analyzing contract...'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{processingProgress}%</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: '0%' }}
                animate={{ width: `${processingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {uploadState === 'processing' && (
              <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Brain className="w-4 h-4 animate-pulse" />
                  Extracting clauses
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 animate-pulse" />
                  Analyzing risks
                </span>
                <span className="flex items-center gap-2">
                  <Scale className="w-4 h-4 animate-pulse" />
                  Checking compliance
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {(uploadState === 'complete' || uploadState === 'idle') && (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Document Info & Clauses */}
          <div className="col-span-4 space-y-6">
            {/* Document Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-gray-50 border border-gray-200 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Document Details</h3>
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                  <FileCheck className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Contract Type</p>
                  <p className="text-gray-900 font-medium">{sampleContract.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Parties</p>
                  <p className="text-gray-900 font-medium text-sm">{sampleContract.parties.join(' & ')}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Value</p>
                    <p className="text-gray-900 font-medium">{sampleContract.value}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-gray-900 font-medium">{sampleContract.duration}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Extracted Clauses */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-gray-50 border border-gray-200 rounded-2xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Clauses</h3>
              <div className="space-y-3">
                {extractedClauses.map((clause, index) => (
                  <motion.div
                    key={clause.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedClause(clause)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedClause.id === clause.id
                        ? 'bg-indigo-50 border border-indigo-300'
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getRiskColor(clause.risk)}`}>
                          <clause.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium text-sm">{clause.title}</p>
                          <p className="text-gray-500 text-xs">Page {clause.position.page}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        clause.risk === 'high' ? 'bg-red-100 text-red-700' :
                        clause.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {clause.risk} risk
                      </span>
                    </div>
                    {clause.alert && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <p className="text-xs text-red-700">{clause.alert}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Analysis & Visualization */}
          <div className="col-span-8 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 border border-gray-300 rounded-xl w-fit">
              {['extraction', 'risks', 'comparison'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'extraction' && (
                <motion.div
                  key="extraction"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Selected Clause Detail */}
                  <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 bg-gradient-to-r ${getRiskGradient(selectedClause.risk)} rounded-xl`}>
                          <selectedClause.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{selectedClause.title}</h3>
                          <p className="text-gray-500 text-sm">
                            Page {selectedClause.position.page}, Paragraph {selectedClause.position.paragraph}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <Eye className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>

                    {/* Clause Content with Highlights */}
                    <div className="p-4 bg-gray-100 rounded-xl mb-4">
                      <p className="text-gray-800 leading-relaxed">
                        {selectedClause.content.split(' ').map((word, i) => {
                          const isHighlighted = selectedClause.highlights.some(h => 
                            word.toLowerCase().includes(h.toLowerCase())
                          )
                          return (
                            <span key={i}>
                              {isHighlighted ? (
                                <span className="bg-indigo-100 text-indigo-700 px-1 rounded">
                                  {word}
                                </span>
                              ) : (
                                word
                              )}{' '}
                            </span>
                          )
                        })}
                      </p>
                    </div>

                    {/* AI Analysis */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-indigo-500" />
                          <p className="text-xs text-gray-500">AI Confidence</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900">96%</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <p className="text-xs text-gray-500">Risk Level</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 capitalize">{selectedClause.risk}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Scale className="w-4 h-4 text-green-500" />
                          <p className="text-xs text-gray-500">Compliance</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900">Pass</p>
                      </div>
                    </div>
                  </div>

                  {/* Similar Clauses */}
                  <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Clauses in Database</h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-gray-900 text-sm">Standard Service Agreement v2.1</p>
                            <p className="text-gray-500 text-xs">Last used 2 weeks ago</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 text-sm font-medium">92% match</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'risks' && (
                <motion.div
                  key="risks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Risk Overview */}
                  <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                    
                    {/* Overall Risk Score */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-gray-500 text-sm mb-2">Overall Risk Score</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-gray-900">{riskSummary.overall}</span>
                          <span className="text-xl text-gray-500">/100</span>
                        </div>
                      </div>
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - riskSummary.overall / 100)}`}
                            className="transition-all duration-1000"
                          />
                          <defs>
                            <linearGradient id="gradient">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Activity className="w-8 h-8 text-indigo-600" />
                        </div>
                      </div>
                    </div>

                    {/* Risk Distribution */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-red-700 text-sm">High Risk</span>
                          <AlertOctagon className="w-4 h-4 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{riskSummary.high}</p>
                        <p className="text-xs text-red-600 mt-1">items found</p>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-yellow-700 text-sm">Medium Risk</span>
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{riskSummary.medium}</p>
                        <p className="text-xs text-yellow-600 mt-1">items found</p>
                      </div>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-green-700 text-sm">Low Risk</span>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{riskSummary.low}</p>
                        <p className="text-xs text-green-600 mt-1">items found</p>
                      </div>
                    </div>

                    {/* Critical Issues */}
                    <div>
                      <h4 className="text-gray-900 font-medium mb-3">Critical Issues</h4>
                      <div className="space-y-2">
                        {riskSummary.criticalIssues.map((issue, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <p className="text-sm text-red-700">{issue}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'comparison' && (
                <motion.div
                  key="comparison"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Comparison</h3>
                    <div className="space-y-3">
                      {comparisonPoints.map((point, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              point.status === 'warning' ? 'bg-yellow-100' :
                              point.status === 'different' ? 'bg-blue-100' :
                              'bg-green-100'
                            }`}>
                              {point.status === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> :
                               point.status === 'different' ? <Info className="w-4 h-4 text-blue-600" /> :
                               <CheckCircle className="w-4 h-4 text-green-600" />}
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium">{point.aspect}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-gray-500">Standard: {point.standard}</span>
                                <ArrowRight className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">Current: {point.current}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            point.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                            point.status === 'different' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {point.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContractIntelligence