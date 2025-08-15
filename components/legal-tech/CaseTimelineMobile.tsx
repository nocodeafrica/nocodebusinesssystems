'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Users,
  Gavel,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Filter,
  Search,
  Download,
  Eye,
  Paperclip,
  MessageCircle,
  Scale
} from 'lucide-react'

interface CaseTimelineMobileProps {
  onBack?: () => void
}

export default function CaseTimelineMobile({ onBack }: CaseTimelineMobileProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'documents' | 'parties'>('timeline')

  // Sample timeline events
  const timelineEvents = [
    {
      id: 1,
      date: '2024-01-15',
      title: 'Case Filed',
      description: 'Initial complaint filed with the court',
      type: 'milestone',
      icon: Gavel,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      date: '2024-01-10',
      title: 'Discovery Phase',
      description: 'Document exchange initiated',
      type: 'process',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      id: 3,
      date: '2024-01-05',
      title: 'Witness Deposition',
      description: 'Key witness testimony recorded',
      type: 'evidence',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      id: 4,
      date: '2023-12-20',
      title: 'Motion Filed',
      description: 'Motion for summary judgment submitted',
      type: 'filing',
      icon: Scale,
      color: 'bg-orange-500'
    }
  ]

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
                <h1 className="text-xl font-bold text-gray-900">Case Timeline</h1>
                <p className="text-sm text-gray-600">Case #2024-CV-1234</p>
              </div>
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Case Summary */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white mb-4">
          <h2 className="font-semibold mb-2">Smith vs. TechCorp Ltd</h2>
          <p className="text-sm opacity-90 mb-3">Commercial Litigation • Contract Dispute</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold">45</p>
              <p className="text-xs opacity-80">Documents</p>
            </div>
            <div>
              <p className="text-lg font-bold">12</p>
              <p className="text-xs opacity-80">Events</p>
            </div>
            <div>
              <p className="text-lg font-bold">8</p>
              <p className="text-xs opacity-80">Parties</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[60px] z-10">
        <div className="px-4">
          <div className="flex gap-6">
            {[
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'parties', label: 'Parties', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
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
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {/* Timeline Events */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              {timelineEvents.map((event, index) => {
                const Icon = event.icon
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start gap-4 mb-6"
                  >
                    <div className={`w-12 h-12 ${event.color} rounded-full flex items-center justify-center z-10`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 bg-white rounded-xl shadow-sm p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <button className="text-xs text-purple-600 font-medium">View Details</button>
                        <button className="text-xs text-gray-600">Attachments (3)</button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Initial Complaint</p>
                    <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
                  </div>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Contract Agreement</p>
                    <p className="text-xs text-gray-500">PDF • 1.8 MB</p>
                  </div>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'parties' && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">John Smith</p>
                  <p className="text-sm text-gray-600">Plaintiff</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">TechCorp Ltd</p>
                  <p className="text-sm text-gray-600">Defendant</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}