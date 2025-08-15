'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User,
  Clock,
  Activity,
  Heart,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Hospital,
  Stethoscope,
  Pill,
  Home,
  TrendingUp,
  Zap,
  Info,
  ChevronRight,
  ChevronDown,
  Star,
  MapPin,
  Phone,
  FileText,
  Award
} from 'lucide-react'

interface PatientJourneyTrackerMobileProps {
  onBack?: () => void
}

// Sample patient journeys (from desktop component)
const patientJourneys = [
  {
    id: 1,
    patientName: 'Sarah Johnson',
    patientId: 'P-2024-0156',
    age: 32,
    admissionDate: '2024-02-10',
    dischargeDate: '2024-02-15',
    diagnosis: 'Appendicitis',
    status: 'discharged',
    insuranceProvider: 'Discovery Health',
    totalCost: 'R45,600',
    satisfaction: 4.8
  },
  {
    id: 2,
    patientName: 'Michael Brown',
    patientId: 'P-2024-0157',
    age: 45,
    admissionDate: '2024-02-12',
    dischargeDate: null,
    diagnosis: 'Cardiac Evaluation',
    status: 'active',
    insuranceProvider: 'Momentum',
    totalCost: 'R28,900',
    satisfaction: null
  }
]

// Journey stages (from desktop component)
const journeyStages = [
  {
    id: 'admission',
    name: 'Admission',
    icon: Hospital,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'triage',
    name: 'Triage',
    icon: Stethoscope,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    id: 'diagnosis',
    name: 'Diagnosis',
    icon: Activity,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'treatment',
    name: 'Treatment',
    icon: Pill,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'recovery',
    name: 'Recovery',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  {
    id: 'discharge',
    name: 'Discharge',
    icon: Home,
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  }
]

// Patient timeline events (from desktop component)
const timelineEvents = [
  {
    id: 1,
    time: '08:30 AM',
    date: 'Feb 12, 2024',
    stage: 'admission',
    title: 'Patient Admitted',
    description: 'Emergency admission via ambulance',
    staff: 'Nurse Williams',
    critical: false
  },
  {
    id: 2,
    time: '08:45 AM',
    date: 'Feb 12, 2024',
    stage: 'triage',
    title: 'Initial Assessment',
    description: 'Vital signs recorded, pain level 7/10',
    staff: 'Dr. Smith',
    critical: true
  },
  {
    id: 3,
    time: '09:15 AM',
    date: 'Feb 12, 2024',
    stage: 'diagnosis',
    title: 'CT Scan Ordered',
    description: 'Abdominal CT scan to confirm appendicitis',
    staff: 'Dr. Adams',
    critical: false
  },
  {
    id: 4,
    time: '10:30 AM',
    date: 'Feb 12, 2024',
    stage: 'diagnosis',
    title: 'Diagnosis Confirmed',
    description: 'Acute appendicitis confirmed',
    staff: 'Dr. Adams',
    critical: true
  },
  {
    id: 5,
    time: '11:00 AM',
    date: 'Feb 12, 2024',
    stage: 'treatment',
    title: 'Surgery Scheduled',
    description: 'Laparoscopic appendectomy scheduled',
    staff: 'Dr. Lee',
    critical: false
  },
  {
    id: 6,
    time: '02:00 PM',
    date: 'Feb 12, 2024',
    stage: 'treatment',
    title: 'Surgery Completed',
    description: 'Successful appendectomy performed',
    staff: 'Dr. Lee',
    critical: false
  }
]

// Touch points (from desktop component)
const touchPoints = [
  { id: 1, name: 'Registration', satisfaction: 4.5, waitTime: '15 min', status: 'completed' },
  { id: 2, name: 'Triage', satisfaction: 4.8, waitTime: '5 min', status: 'completed' },
  { id: 3, name: 'Doctor Consultation', satisfaction: 4.9, waitTime: '20 min', status: 'completed' },
  { id: 4, name: 'Lab Tests', satisfaction: 4.3, waitTime: '45 min', status: 'completed' },
  { id: 5, name: 'Surgery', satisfaction: 5.0, waitTime: 'N/A', status: 'completed' },
  { id: 6, name: 'Nursing Care', satisfaction: 4.7, waitTime: 'N/A', status: 'in-progress' },
  { id: 7, name: 'Billing', satisfaction: 3.8, waitTime: '30 min', status: 'pending' },
  { id: 8, name: 'Discharge', satisfaction: 4.6, waitTime: '25 min', status: 'pending' }
]

export default function PatientJourneyTrackerMobile({ onBack }: PatientJourneyTrackerMobileProps) {
  const [selectedPatient, setSelectedPatient] = useState(patientJourneys[0])
  const [activeStage, setActiveStage] = useState('treatment')
  const [viewMode, setViewMode] = useState<'timeline' | 'stages' | 'touchpoints'>('timeline')
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)

  const getStageProgress = (stageId: string) => {
    const stageOrder = ['admission', 'triage', 'diagnosis', 'treatment', 'recovery', 'discharge']
    const currentIndex = stageOrder.indexOf(activeStage)
    const targetIndex = stageOrder.indexOf(stageId)
    
    if (targetIndex < currentIndex) return 'completed'
    if (targetIndex === currentIndex) return 'active'
    return 'pending'
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'in-progress': return 'bg-blue-100 text-blue-700'
      case 'pending': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                <h1 className="text-xl font-bold text-gray-900">Patient Journey</h1>
                <p className="text-sm text-gray-600">Admission to discharge tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Info Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mx-4 mt-4 border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
            {selectedPatient.patientName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{selectedPatient.patientName}</h3>
            <p className="text-sm text-gray-500">
              {selectedPatient.patientId} • Age {selectedPatient.age} • {selectedPatient.diagnosis}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            selectedPatient.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {selectedPatient.status}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <p className="text-gray-500">Admitted</p>
            <p className="font-medium text-gray-900">{selectedPatient.admissionDate}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Total Cost</p>
            <p className="font-medium text-gray-900">{selectedPatient.totalCost}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Satisfaction</p>
            <p className="font-medium text-gray-900">
              {selectedPatient.satisfaction ? `${selectedPatient.satisfaction}/5` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="px-4 py-4">
        <div className="flex gap-2">
          {[
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'stages', label: 'Stages', icon: CheckCircle },
            { id: 'touchpoints', label: 'Experience', icon: Heart }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  viewMode === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-20">
        {/* Journey Stages - Mobile Optimized */}
        {viewMode === 'stages' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Patient Journey Stages</h3>
              <div className="space-y-3">
                {journeyStages.map((stage, index) => {
                  const progress = getStageProgress(stage.id)
                  const Icon = stage.icon
                  
                  return (
                    <motion.div
                      key={stage.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveStage(stage.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        progress === 'active' ? `${stage.bgColor} ${stage.borderColor}` : 
                        progress === 'completed' ? 'bg-green-50 border-green-200' :
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center ${
                        progress === 'pending' ? 'grayscale opacity-50' : ''
                      }`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{stage.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{progress}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {progress === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {progress === 'active' && <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />}
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Stage Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">5.5 days</p>
                <p className="text-xs text-gray-500">Length of Stay</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">94%</p>
                <p className="text-xs text-gray-500">Efficiency</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                <Zap className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">2.3 hrs</p>
                <p className="text-xs text-gray-500">Avg Wait</p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Journey Timeline</h3>
            <div className="space-y-4">
              {timelineEvents.map((event, index) => {
                const stage = journeyStages.find(s => s.id === event.stage)
                const Icon = stage?.icon || Activity
                const isExpanded = expandedEvent === event.id
                
                return (
                  <motion.div key={event.id} className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stage?.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {index < timelineEvents.length - 1 && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gray-200" />
                      )}
                    </div>
                    
                    <motion.div
                      layout
                      className="flex-1"
                    >
                      <div 
                        className="bg-gray-50 rounded-lg p-3 cursor-pointer"
                        onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{event.title}</h4>
                              {event.critical && <AlertCircle className="w-4 h-4 text-red-500" />}
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-2 border-t border-gray-200 mt-2">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <p className="text-gray-500">Date & Time</p>
                                    <p className="text-gray-900 font-medium">{event.date}</p>
                                    <p className="text-gray-900 font-medium">{event.time}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Staff Member</p>
                                    <p className="text-gray-900 font-medium">{event.staff}</p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <span>{event.date} • {event.time}</span>
                          <span>{event.staff}</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Touch Points View */}
        {viewMode === 'touchpoints' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Patient Experience Touch Points</h3>
              <div className="space-y-3">
                {touchPoints.map((point) => (
                  <motion.div
                    key={point.id}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {point.id}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{point.name}</h4>
                          <p className="text-sm text-gray-500">Wait: {point.waitTime}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(point.status)}`}>
                        {point.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <Heart 
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.floor(point.satisfaction) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{point.satisfaction}/5.0</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Overall Satisfaction */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-2">Overall Patient Satisfaction</h4>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map((star) => (
                      <Heart 
                        key={star}
                        className={`w-5 h-5 ${
                          star <= 4 ? 'text-white fill-current' : 'text-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">4.6</p>
                  <p className="text-sm opacity-90">out of 5.0</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}