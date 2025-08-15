'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar,
  FileText,
  Users,
  Camera,
  Mic,
  Video,
  Mail,
  Phone,
  MessageSquare,
  Briefcase,
  Scale,
  Gavel,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  Link2,
  MapPin,
  User,
  Building2,
  Shield,
  AlertTriangle,
  Sparkles,
  Activity,
  TrendingUp,
  Eye,
  Layers,
  GitBranch,
  Zap
} from 'lucide-react'

// Case timeline events
const timelineEvents = [
  {
    id: 1,
    date: '2023-03-15',
    time: '09:00',
    type: 'filing',
    title: 'Case Filed',
    description: 'Initial complaint filed with Johannesburg High Court',
    icon: Briefcase,
    color: 'from-blue-500 to-indigo-500',
    documents: ['Complaint.pdf', 'Affidavit.pdf'],
    participants: ['Adv. Thabo Molefe', 'Client: TechCorp SA'],
    status: 'completed',
    connections: [2, 3]
  },
  {
    id: 2,
    date: '2023-03-28',
    time: '14:30',
    type: 'response',
    title: 'Defendant Response',
    description: 'Response and counter-claim received',
    icon: FileText,
    color: 'from-red-500 to-rose-500',
    documents: ['Response.pdf', 'Counter-claim.pdf'],
    participants: ['Defendant: Innovation Ltd', 'Adv. Sarah Naidoo'],
    status: 'completed',
    connections: [4, 5]
  },
  {
    id: 3,
    date: '2023-04-10',
    time: '10:00',
    type: 'evidence',
    title: 'Evidence Submitted',
    description: 'Key evidence and witness statements submitted',
    icon: Camera,
    color: 'from-purple-500 to-violet-500',
    documents: ['Evidence_Bundle.pdf', 'Witness_Statements.pdf'],
    participants: ['Witness: Johan Kruger', 'Witness: Fatima Abrahams'],
    status: 'completed',
    connections: [6]
  },
  {
    id: 4,
    date: '2023-05-15',
    time: '11:00',
    type: 'hearing',
    title: 'Pre-Trial Hearing',
    description: 'Case management conference held',
    icon: Gavel,
    color: 'from-green-500 to-emerald-500',
    documents: ['Hearing_Minutes.pdf'],
    participants: ['Judge: Hon. Justice Mpho Khumalo', 'All parties'],
    status: 'completed',
    connections: [6, 7]
  },
  {
    id: 5,
    date: '2023-06-20',
    time: '09:30',
    type: 'discovery',
    title: 'Discovery Phase',
    description: 'Document discovery and interrogatories',
    icon: Search,
    color: 'from-yellow-500 to-amber-500',
    documents: ['Discovery_Request.pdf', 'Interrogatories.pdf'],
    participants: ['Legal teams'],
    status: 'completed',
    connections: [7]
  },
  {
    id: 6,
    date: '2023-07-10',
    time: '15:00',
    type: 'settlement',
    title: 'Settlement Conference',
    description: 'Mediation attempt - unsuccessful',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    documents: ['Mediation_Report.pdf'],
    participants: ['Mediator: Adv. Pieter van Wyk', 'All parties'],
    status: 'failed',
    connections: [7]
  },
  {
    id: 7,
    date: '2024-01-25',
    time: '09:00',
    type: 'trial',
    title: 'Trial Date Set',
    description: 'Main trial scheduled',
    icon: Scale,
    color: 'from-indigo-500 to-purple-500',
    documents: ['Trial_Notice.pdf'],
    participants: ['All parties'],
    status: 'upcoming',
    connections: []
  }
]

// Evidence connections
const evidenceLinks = [
  { from: 1, to: 3, type: 'supports', strength: 'strong' },
  { from: 2, to: 5, type: 'contradicts', strength: 'medium' },
  { from: 3, to: 6, type: 'relates', strength: 'weak' },
  { from: 4, to: 7, type: 'requires', strength: 'strong' }
]

// Case participants
const caseParticipants = [
  { id: 1, name: 'Adv. Thabo Molefe', role: 'Lead Counsel', side: 'plaintiff', avatar: '👨‍⚖️' },
  { id: 2, name: 'Adv. Sarah Naidoo', role: 'Defense Counsel', side: 'defendant', avatar: '👩‍⚖️' },
  { id: 3, name: 'Hon. Justice Mpho Khumalo', role: 'Presiding Judge', side: 'court', avatar: '⚖️' },
  { id: 4, name: 'Johan Kruger', role: 'Key Witness', side: 'plaintiff', avatar: '👤' },
  { id: 5, name: 'Fatima Abrahams', role: 'Expert Witness', side: 'plaintiff', avatar: '👩' }
]

const CaseTimeline = () => {
  const [selectedEvent, setSelectedEvent] = useState(timelineEvents[0])
  const [viewMode, setViewMode] = useState<'timeline' | 'network' | 'calendar'>('timeline')
  const [filterType, setFilterType] = useState('all')

  const getEventColor = (type: string) => {
    switch(type) {
      case 'filing': return 'from-blue-500 to-indigo-500'
      case 'response': return 'from-red-500 to-rose-500'
      case 'evidence': return 'from-purple-500 to-violet-500'
      case 'hearing': return 'from-green-500 to-emerald-500'
      case 'discovery': return 'from-yellow-500 to-amber-500'
      case 'settlement': return 'from-orange-500 to-red-500'
      case 'trial': return 'from-indigo-500 to-purple-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />
      case 'upcoming': return <Clock className="w-4 h-4 text-yellow-400" />
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 min-h-[700px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Case Timeline</h2>
          <p className="text-gray-600">Case #2023-HC-1547 • TechCorp SA vs Innovation Ltd</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            {['timeline', 'network', 'calendar'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-medium shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Timeline/Events */}
        <div className="col-span-7">
          {viewMode === 'timeline' && (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-violet-500 to-purple-500 opacity-30" />
              
              {/* Events */}
              <div className="space-y-6">
                {timelineEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedEvent(event)}
                    className={`relative flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                      selectedEvent.id === event.id
                        ? 'bg-indigo-50 border border-indigo-300 shadow-md'
                        : 'bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    {/* Event Icon */}
                    <div className={`relative z-10 p-3 bg-gradient-to-r ${event.color} rounded-xl shadow-lg`}>
                      <event.icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Event Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-gray-600 text-sm">{event.description}</p>
                        </div>
                        {getStatusIcon(event.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {event.documents.length} docs
                        </span>
                      </div>

                      {/* Participants */}
                      <div className="mt-3 flex items-center gap-2">
                        <Users className="w-3 h-3 text-indigo-500" />
                        <div className="flex flex-wrap gap-2">
                          {event.participants.slice(0, 2).map((participant, i) => (
                            <span key={i} className="px-2 py-0.5 bg-indigo-100 rounded-full text-xs text-indigo-700">
                              {participant}
                            </span>
                          ))}
                          {event.participants.length > 2 && (
                            <span className="text-xs text-gray-500">+{event.participants.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'calendar' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-7 gap-2">
                {/* Calendar Header */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center py-2">
                    <span className="text-sm font-medium text-gray-600">{day}</span>
                  </div>
                ))}
                
                {/* Calendar Days */}
                {[...Array(35)].map((_, i) => {
                  const dayNum = i - 2 // Start from the 3rd position
                  const hasEvent = timelineEvents.some(e => {
                    const eventDay = new Date(e.date).getDate()
                    return eventDay === dayNum
                  })
                  const event = timelineEvents.find(e => {
                    const eventDay = new Date(e.date).getDate()
                    return eventDay === dayNum
                  })
                  
                  return (
                    <div
                      key={i}
                      className={`relative h-20 p-2 rounded-lg border ${
                        hasEvent 
                          ? 'bg-indigo-50 border-indigo-300 cursor-pointer hover:bg-indigo-100' 
                          : 'bg-gray-50 border-gray-200'
                      } ${dayNum < 1 || dayNum > 31 ? 'opacity-30' : ''}`}
                      onClick={() => event && setSelectedEvent(event)}
                    >
                      {dayNum > 0 && dayNum <= 31 && (
                        <>
                          <span className="text-xs text-gray-600">{dayNum}</span>
                          {hasEvent && event && (
                            <div className="mt-1">
                              <div className={`p-1 bg-gradient-to-r ${event.color} rounded text-xs text-white truncate`}>
                                {event.title}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-3">
                {['filing', 'response', 'evidence', 'hearing', 'trial'].map(type => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-3 h-3 bg-gradient-to-r ${getEventColor(type)} rounded`} />
                    <span className="text-xs text-gray-600 capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'network' && (
            <div className="relative h-[600px] bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              {/* Network Visualization */}
              <div className="absolute inset-6">
                {timelineEvents.map((event, index) => {
                  const angle = (index / timelineEvents.length) * 2 * Math.PI
                  const radius = 200
                  const x = 50 + Math.cos(angle) * radius / 4
                  const y = 50 + Math.sin(angle) * radius / 4
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="absolute"
                      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <div
                        onClick={() => setSelectedEvent(event)}
                        className={`relative p-4 bg-gradient-to-r ${event.color} rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all ${
                          selectedEvent.id === event.id ? 'scale-110 ring-4 ring-purple-400' : ''
                        }`}
                      >
                        <event.icon className="w-6 h-6 text-white" />
                        <p className="text-xs text-white font-medium mt-2 text-center">{event.title}</p>
                      </div>
                    </motion.div>
                  )
                })}
                
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Event Details */}
        <div className="col-span-5 space-y-6">
          {/* Selected Event Details */}
          <motion.div
            key={selectedEvent.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 bg-gradient-to-r ${selectedEvent.color} rounded-xl`}>
                  <selectedEvent.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
                  <p className="text-gray-600 text-sm">{selectedEvent.date} • {selectedEvent.time}</p>
                </div>
              </div>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Eye className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <p className="text-gray-700 mb-4">{selectedEvent.description}</p>

            {/* Documents */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Related Documents</h4>
              <div className="space-y-2">
                {selectedEvent.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm text-gray-800">{doc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Download className="w-3 h-3 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Eye className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participants */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Participants</h4>
              <div className="space-y-2">
                {selectedEvent.participants.map((participant, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-gray-800">{participant}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Case Participants */}
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Participants</h3>
            <div className="space-y-3">
              {caseParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{participant.avatar}</span>
                    <div>
                      <p className="text-gray-900 font-medium">{participant.name}</p>
                      <p className="text-gray-600 text-xs">{participant.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    participant.side === 'plaintiff' ? 'bg-blue-100 text-blue-700' :
                    participant.side === 'defendant' ? 'bg-red-100 text-red-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {participant.side}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Case Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">47</span>
              </div>
              <p className="text-xs text-gray-600">Documents Filed</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">316</span>
              </div>
              <p className="text-xs text-gray-600">Days Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseTimeline