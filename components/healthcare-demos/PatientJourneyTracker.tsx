'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User,
  Clock,
  Activity,
  FileText,
  Pill,
  Heart,
  Calendar,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  MapPin,
  Stethoscope,
  Hospital,
  Home,
  CreditCard,
  MessageSquare,
  Phone,
  Mail,
  TrendingUp,
  Zap,
  Shield,
  Award,
  ArrowRight,
  ArrowLeft,
  MoreVertical
} from 'lucide-react'

// Sample patient journeys
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

// Journey stages
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
    name: 'Triage & Assessment',
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

// Patient timeline events
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
  },
  {
    id: 7,
    time: '06:00 PM',
    date: 'Feb 12, 2024',
    stage: 'recovery',
    title: 'Post-Op Recovery',
    description: 'Patient stable, moved to recovery ward',
    staff: 'Nurse Johnson',
    critical: false
  },
  {
    id: 8,
    time: '09:00 AM',
    date: 'Feb 14, 2024',
    stage: 'recovery',
    title: 'Recovery Progress',
    description: 'Walking independently, pain managed',
    staff: 'Dr. Smith',
    critical: false
  },
  {
    id: 9,
    time: '11:00 AM',
    date: 'Feb 15, 2024',
    stage: 'discharge',
    title: 'Discharge Approved',
    description: 'Patient ready for discharge',
    staff: 'Dr. Adams',
    critical: false
  },
  {
    id: 10,
    time: '02:00 PM',
    date: 'Feb 15, 2024',
    stage: 'discharge',
    title: 'Patient Discharged',
    description: 'Discharged with post-op instructions',
    staff: 'Nurse Williams',
    critical: false
  }
]

// Touch points
const touchPoints = [
  { id: 1, name: 'Registration', satisfaction: 4.5, waitTime: '15 min' },
  { id: 2, name: 'Triage', satisfaction: 4.8, waitTime: '5 min' },
  { id: 3, name: 'Doctor Consultation', satisfaction: 4.9, waitTime: '20 min' },
  { id: 4, name: 'Lab Tests', satisfaction: 4.3, waitTime: '45 min' },
  { id: 5, name: 'Surgery', satisfaction: 5.0, waitTime: 'N/A' },
  { id: 6, name: 'Nursing Care', satisfaction: 4.7, waitTime: 'N/A' },
  { id: 7, name: 'Billing', satisfaction: 3.8, waitTime: '30 min' },
  { id: 8, name: 'Discharge', satisfaction: 4.6, waitTime: '25 min' }
]

const PatientJourneyTracker = () => {
  const [selectedPatient, setSelectedPatient] = useState(patientJourneys[0])
  const [activeStage, setActiveStage] = useState('admission')
  const [viewMode, setViewMode] = useState<'timeline' | 'flow' | 'touchpoints'>('timeline')

  const getStageProgress = (stageId: string) => {
    const stageOrder = ['admission', 'triage', 'diagnosis', 'treatment', 'recovery', 'discharge']
    const currentIndex = stageOrder.indexOf(activeStage)
    const targetIndex = stageOrder.indexOf(stageId)
    
    if (targetIndex < currentIndex) return 'completed'
    if (targetIndex === currentIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="bg-white rounded-3xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Journey Tracker</h2>
          <p className="text-sm text-gray-500 mt-1">Admission to discharge visualization and tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'timeline' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('flow')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'flow' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Flow
          </button>
          <button
            onClick={() => setViewMode('touchpoints')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'touchpoints' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Touch Points
          </button>
        </div>
      </div>

      {/* Patient Info Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              {selectedPatient.patientName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedPatient.patientName}</h3>
              <p className="text-sm text-gray-500">
                {selectedPatient.patientId} • Age {selectedPatient.age} • {selectedPatient.diagnosis}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <p className="text-gray-500">Admitted</p>
              <p className="font-medium text-gray-900">{selectedPatient.admissionDate}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                selectedPatient.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {selectedPatient.status}
              </span>
            </div>
            <div>
              <p className="text-gray-500">Total Cost</p>
              <p className="font-medium text-gray-900">{selectedPatient.totalCost}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Stages */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2 relative">
          {/* Render all connecting lines first (behind the boxes) */}
          {journeyStages.map((stage, index) => {
            const progress = getStageProgress(stage.id)
            
            if (index < journeyStages.length - 1) {
              return (
                <div
                  key={`line-${stage.id}`}
                  className="absolute top-1/2 -translate-y-1/2 -z-10"
                  style={{
                    left: `${(100 / journeyStages.length) * index + (100 / journeyStages.length / 2)}%`,
                    width: `${100 / journeyStages.length}%`,
                    transform: 'translateY(-50%) translateX(-50%)'
                  }}
                >
                  <div className={`h-1 w-full ${
                    progress === 'completed' ? 'bg-green-400' : 'bg-gray-200'
                  }`} />
                </div>
              )
            }
            return null
          })}
          
          {/* Render stage boxes on top */}
          {journeyStages.map((stage, index) => {
            const progress = getStageProgress(stage.id)
            const Icon = stage.icon
            
            return (
              <div key={stage.id} className="flex-1 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveStage(stage.id)}
                  className={`cursor-pointer transition-all ${
                    progress === 'active' ? 'scale-110' : ''
                  }`}
                >
                  <div className={`${stage.bgColor} ${stage.borderColor} border-2 rounded-2xl p-4 text-center relative bg-white ${
                    progress === 'completed' ? 'opacity-100' : progress === 'active' ? 'opacity-100' : 'opacity-50'
                  }`}>
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center ${
                      progress === 'completed' || progress === 'active' ? '' : 'grayscale'
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-medium text-gray-900">{stage.name}</p>
                    {progress === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto mt-1" />
                    )}
                    {progress === 'active' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1 animate-pulse" />
                    )}
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'timeline' && (
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Timeline</h3>
          <div className="space-y-4">
            {timelineEvents.map((event, index) => {
              const stage = journeyStages.find(s => s.id === event.stage)
              const Icon = stage?.icon || Activity
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4"
                >
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stage?.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {index < timelineEvents.length - 1 && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-500">{event.description}</p>
                      </div>
                      {event.critical && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{event.date} • {event.time}</span>
                      <span>{event.staff}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {viewMode === 'flow' && (
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Flow Visualization</h3>
          
          {/* Sankey-style flow diagram */}
          <div className="relative h-96">
            {/* Flow paths */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              {/* Flow lines */}
              <path
                d="M 50,50 Q 200,50 200,150 T 350,150 Q 500,150 500,250 T 650,250"
                stroke="url(#flowGradient)"
                strokeWidth="40"
                fill="none"
                className="animate-pulse"
              />
            </svg>
            
            {/* Stage nodes */}
            <div className="absolute inset-0 flex items-center justify-between px-8">
              {journeyStages.map((stage, index) => {
                const Icon = stage.icon
                return (
                  <motion.div
                    key={stage.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="relative z-10"
                  >
                    <div className={`w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border-4 ${stage.borderColor}`}>
                      <Icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <p className="text-xs font-medium text-gray-700 text-center mt-2">{stage.name}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Flow Metrics */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <Clock className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">5.5 days</p>
              <p className="text-xs text-gray-500">Average Length of Stay</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">94%</p>
              <p className="text-xs text-gray-500">Process Efficiency</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <Zap className="w-5 h-5 text-yellow-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">2.3 hrs</p>
              <p className="text-xs text-gray-500">Avg Wait Time</p>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'touchpoints' && (
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Experience Touch Points</h3>
          
          <div className="space-y-3">
            {touchPoints.map((point, index) => (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {point.id}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{point.name}</h4>
                      <p className="text-sm text-gray-500">Wait time: {point.waitTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {[1,2,3,4,5].map((star) => (
                        <motion.div
                          key={star}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + star * 0.02 }}
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              star <= Math.floor(point.satisfaction) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{point.satisfaction}/5.0</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Overall Satisfaction */}
          <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold mb-2">Overall Patient Satisfaction</h4>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map((star) => (
                    <Heart 
                      key={star}
                      className={`w-6 h-6 ${
                        star <= 4 ? 'text-white fill-current' : 'text-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">4.6</p>
                <p className="text-sm opacity-90">out of 5.0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientJourneyTracker