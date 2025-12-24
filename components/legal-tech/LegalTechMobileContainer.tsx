'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  FileText,
  Search,
  Calendar,
  Shield,
  Video,
  ChevronRight,
  Brain,
  Scale,
  Gavel,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Users
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import components
const ContractIntelligenceMobile = dynamic(() => import('./ContractIntelligenceMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
})

const CaseTimelineMobile = dynamic(() => import('./CaseTimelineMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
})

const LegalDocumentChatMobile = dynamic(() => import('./LegalDocumentChatMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
})

const ComplianceMonitoringMobile = dynamic(() => import('./ComplianceMonitoringMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
})

const DigitalCourtRoomMobile = dynamic(() => import('./DigitalCourtRoomMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
})

const legalTechModules = [
  {
    id: 'contract-intelligence',
    title: 'Contract Intelligence',
    subtitle: 'AI contract analysis & risk detection',
    icon: FileText,
    component: ContractIntelligenceMobile,
    color: 'bg-indigo-500',
    stats: { contracts: 284, risks: 12 }
  },
  {
    id: 'case-timeline',
    title: 'Case Timeline',
    subtitle: 'Interactive case & evidence tracking',
    icon: Calendar,
    component: CaseTimelineMobile,
    color: 'bg-purple-500',
    stats: { cases: 45, documents: 1420 }
  },
  {
    id: 'legal-document-chat',
    title: 'Legal Document Chat',
    subtitle: 'Chat with case files & citations',
    icon: Search,
    component: LegalDocumentChatMobile,
    color: 'bg-blue-500',
    stats: { queries: 892, citations: 3456 }
  },
  {
    id: 'compliance-monitoring',
    title: 'Compliance Monitor',
    subtitle: 'Real-time regulation tracking',
    icon: Shield,
    component: ComplianceMonitoringMobile,
    color: 'bg-emerald-500',
    stats: { compliant: 92, alerts: 8 }
  },
  {
    id: 'digital-court-room',
    title: 'Digital Court Room',
    subtitle: 'Virtual evidence presentation',
    icon: Video,
    component: DigitalCourtRoomMobile,
    color: 'bg-rose-500',
    stats: { sessions: 18, exhibits: 245 }
  }
]

interface LegalTechMobileContainerProps {
  onBack?: () => void
}

export default function LegalTechMobileContainer({ onBack }: LegalTechMobileContainerProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const currentModule = legalTechModules.find(m => m.id === selectedModule)
  const ModuleComponent = currentModule?.component

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId)
  }

  const handleBackFromModule = () => {
    setSelectedModule(null)
  }

  // Show selected module
  if (selectedModule && ModuleComponent) {
    return <ModuleComponent onBack={handleBackFromModule} />
  }

  // Main menu
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
                <h1 className="text-xl font-bold text-gray-900">Legal Tech Solutions</h1>
                <p className="text-sm text-gray-600">AI-powered legal intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 py-6 pb-20">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white"
          >
            <Scale className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">342</p>
            <p className="text-xs opacity-90">Active Cases</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white"
          >
            <Shield className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">92%</p>
            <p className="text-xs opacity-90">Compliance Rate</p>
          </motion.div>
        </div>

        {/* Module Grid */}
        <div className="space-y-3 mb-6">
          {legalTechModules.map((module, index) => {
            const Icon = module.icon
            return (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModuleSelect(module.id)}
                className="w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.subtitle}</p>
                    {module.stats && (
                      <div className="flex items-center gap-3 mt-1">
                        {Object.entries(module.stats).map(([key, value]) => (
                          <span key={key} className="text-xs text-gray-500">
                            {value} {key}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* AI Insights Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <Brain className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-bold">AI Legal Assistant</h3>
              <p className="text-sm opacity-90">Powered by advanced NLP</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>45% faster contract review</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>12 risks identified today</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              <span>28 team members active</span>
            </div>
          </div>
          <button
            onClick={() => handleModuleSelect('legal-document-chat')}
            className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium"
          >
            Ask Legal AI Assistant
          </button>
        </motion.div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Contract reviewed</p>
                <p className="text-xs text-gray-600">Service Agreement - TechCorp</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Compliance alert</p>
                <p className="text-xs text-gray-600">POPIA deadline approaching</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Gavel className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Court session</p>
                <p className="text-xs text-gray-600">Virtual hearing completed</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}