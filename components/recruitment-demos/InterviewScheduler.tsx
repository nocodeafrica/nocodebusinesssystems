'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  User,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageSquare,
  Star,
  MoreVertical,
  Send,
  Edit2,
  Trash2,
  Link,
  Monitor,
  Coffee,
  Bell,
  X
} from 'lucide-react'

// Interview data
const interviews = [
  {
    id: 1,
    candidate: 'Thabo Molefe',
    candidateAvatar: 'https://i.pravatar.cc/150?img=1',
    position: 'Senior Software Engineer',
    date: '2024-01-25',
    time: '10:00 AM',
    duration: '60 min',
    type: 'video',
    status: 'confirmed',
    interviewers: [
      { name: 'Johan Kruger', role: 'Engineering Manager', avatar: 'https://i.pravatar.cc/150?img=11' },
      { name: 'Fatima Abrahams', role: 'Tech Lead', avatar: 'https://i.pravatar.cc/150?img=16' }
    ],
    round: 'Technical Round 1',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Focus on system design and coding skills'
  },
  {
    id: 2,
    candidate: 'Nalini Pillay',
    candidateAvatar: 'https://i.pravatar.cc/150?img=9',
    position: 'Product Designer',
    date: '2024-01-25',
    time: '2:00 PM',
    duration: '45 min',
    type: 'in-person',
    status: 'pending',
    interviewers: [
      { name: 'Mpho Khumalo', role: 'Design Lead', avatar: 'https://i.pravatar.cc/150?img=3' }
    ],
    round: 'Portfolio Review',
    location: 'Conference Room A',
    notes: 'Review recent projects and design process'
  },
  {
    id: 3,
    candidate: 'Sipho Dlamini',
    candidateAvatar: 'https://i.pravatar.cc/150?img=8',
    position: 'Marketing Manager',
    date: '2024-01-26',
    time: '11:00 AM',
    duration: '30 min',
    type: 'phone',
    status: 'confirmed',
    interviewers: [
      { name: 'Amara Ngwenya', role: 'CMO', avatar: 'https://i.pravatar.cc/150?img=5' }
    ],
    round: 'Initial Screen',
    phoneNumber: '+27 82 555 0123',
    notes: 'Discuss background and motivation'
  },
  {
    id: 4,
    candidate: 'Lerato Ndlovu',
    candidateAvatar: 'https://i.pravatar.cc/150?img=15',
    position: 'Data Scientist',
    date: '2024-01-26',
    time: '3:00 PM',
    duration: '90 min',
    type: 'video',
    status: 'confirmed',
    interviewers: [
      { name: 'Pieter van Wyk', role: 'Data Science Manager', avatar: 'https://i.pravatar.cc/150?img=12' },
      { name: 'Aisha Patel', role: 'Senior Data Scientist', avatar: 'https://i.pravatar.cc/150?img=20' }
    ],
    round: 'Technical Assessment',
    meetingLink: 'https://zoom.us/j/123456789',
    notes: 'Include live coding exercise'
  }
]

// Calendar view days
const calendarDays = [
  { date: 22, day: 'Mon', interviews: 2 },
  { date: 23, day: 'Tue', interviews: 3 },
  { date: 24, day: 'Wed', interviews: 1 },
  { date: 25, day: 'Thu', interviews: 4 },
  { date: 26, day: 'Fri', interviews: 2 },
  { date: 27, day: 'Sat', interviews: 0 },
  { date: 28, day: 'Sun', interviews: 0 }
]

// Time slots
const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
]

// Feedback categories
const feedbackCategories = [
  { name: 'Technical Skills', rating: 0 },
  { name: 'Communication', rating: 0 },
  { name: 'Problem Solving', rating: 0 },
  { name: 'Culture Fit', rating: 0 },
  { name: 'Experience', rating: 0 }
]

const InterviewScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(25)
  const [selectedInterview, setSelectedInterview] = useState(interviews[0])
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [showMobileDetail, setShowMobileDetail] = useState(false)

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return <Video className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
      case 'in-person': return <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
      case 'phone': return <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
      default: return <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
    }
  }

  const handleInterviewClick = (interview: any) => {
    setSelectedInterview(interview)
    setShowMobileDetail(true)
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Interview Scheduler</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage and coordinate interview schedules</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-lg sm:rounded-xl p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
          <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-green-700">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Schedule Interview</span>
            <span className="sm:hidden">Schedule</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs text-gray-600">Today</span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-500">Interviews</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-xs text-gray-600">This Week</span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500">Scheduled</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-100"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <span className="text-xs text-gray-600">Confirmed</span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">8</p>
          <p className="text-xs text-gray-500">Confirmed</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-yellow-100"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            <span className="text-xs text-gray-600">Pending</span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-500">To Confirm</p>
        </motion.div>
      </div>

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-8">
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">January 2024</h3>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg">
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg">
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-4">
                {calendarDays.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl text-center transition-all ${
                      selectedDate === day.date 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <p className={`text-xs mb-1 ${
                      selectedDate === day.date ? 'text-white' : 'text-gray-500'
                    }`}>{day.day}</p>
                    <p className="text-base sm:text-lg font-bold">{day.date}</p>
                    {day.interviews > 0 && (
                      <div className={`mt-1 sm:mt-2 flex justify-center`}>
                        <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
                          selectedDate === day.date ? 'bg-white' : 'bg-green-500'
                        }`} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Time Slots - Mobile optimized */}
              <div className="space-y-2 sm:space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Today's Schedule</h4>
                <div className="space-y-2">
                  {interviews.slice(0, 3).map((interview) => (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleInterviewClick(interview)}
                      className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all"
                    >
                      <div className="text-xs sm:text-sm text-gray-500 min-w-[60px] sm:min-w-[70px]">
                        {interview.time}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={interview.candidateAvatar}
                            alt={interview.candidate}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                          />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{interview.candidate}</p>
                            <p className="text-xs text-gray-600 truncate">{interview.position}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(interview.type)}
                        <span className={`hidden sm:inline px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                          {interview.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interview Details - Desktop only */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="bg-gray-50 rounded-2xl p-6">
              {/* Selected Interview */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Interview Details</h3>
                  <button className="p-2 hover:bg-gray-200 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                {/* Candidate Info */}
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={selectedInterview.candidateAvatar}
                      alt={selectedInterview.candidate}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-base font-semibold text-gray-900">{selectedInterview.candidate}</p>
                      <p className="text-sm text-gray-600">{selectedInterview.position}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Date & Time</p>
                      <p className="text-sm font-medium text-gray-900">{selectedInterview.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm font-medium text-gray-900">{selectedInterview.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Round</p>
                      <p className="text-sm font-medium text-gray-900">{selectedInterview.round}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInterview.status)}`}>
                        {selectedInterview.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interviewers */}
                <div className="bg-white rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Interviewers</h4>
                  <div className="space-y-2">
                    {selectedInterview.interviewers.map((interviewer) => (
                      <div key={interviewer.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={interviewer.avatar}
                            alt={interviewer.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{interviewer.name}</p>
                            <p className="text-xs text-gray-500">{interviewer.role}</p>
                          </div>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Mail className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meeting Details */}
                <div className="bg-white rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Meeting Information</h4>
                  {selectedInterview.type === 'video' && selectedInterview.meetingLink && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-900">Video Meeting</span>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Copy Link
                      </button>
                    </div>
                  )}
                  {selectedInterview.type === 'in-person' && selectedInterview.location && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-900">{selectedInterview.location}</span>
                      </div>
                    </div>
                  )}
                  {selectedInterview.notes && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{selectedInterview.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
                    Send Reminder
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {interviews.map((interview, index) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleInterviewClick(interview)}
                className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img
                      src={interview.candidateAvatar}
                      alt={interview.candidate}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                    />
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">{interview.candidate}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{interview.position} • {interview.round}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-6">
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{interview.date}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{interview.time}</p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      {getTypeIcon(interview.type)}
                      <span className="text-xs sm:text-sm text-gray-700">{interview.type}</span>
                    </div>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                    <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Interview Detail Modal */}
      <AnimatePresence>
        {showMobileDetail && selectedInterview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowMobileDetail(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedInterview.candidateAvatar}
                      alt={selectedInterview.candidate}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{selectedInterview.candidate}</h3>
                      <p className="text-xs text-gray-600">{selectedInterview.position}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMobileDetail(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Date & Time</p>
                    <p className="text-sm font-medium text-gray-900">{selectedInterview.time}</p>
                    <p className="text-xs text-gray-600">{selectedInterview.date}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-900">{selectedInterview.duration}</p>
                  </div>
                </div>

                {/* Status and Round */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInterview.status)}`}>
                    {selectedInterview.status}
                  </span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs font-medium text-gray-700">{selectedInterview.round}</span>
                </div>

                {/* Interviewers */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Interviewers</h4>
                  <div className="space-y-2">
                    {selectedInterview.interviewers.map((interviewer) => (
                      <div key={interviewer.name} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={interviewer.avatar}
                            alt={interviewer.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{interviewer.name}</p>
                            <p className="text-xs text-gray-500">{interviewer.role}</p>
                          </div>
                        </div>
                        <button className="p-1.5 hover:bg-gray-200 rounded">
                          <Mail className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meeting Info */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Meeting Information</h4>
                  {selectedInterview.type === 'video' && selectedInterview.meetingLink && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-900">Video Meeting</span>
                      </div>
                      <button className="text-xs text-blue-600 font-medium">Copy Link</button>
                    </div>
                  )}
                  {selectedInterview.type === 'in-person' && selectedInterview.location && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-900">{selectedInterview.location}</span>
                      </div>
                    </div>
                  )}
                  {selectedInterview.type === 'phone' && selectedInterview.phoneNumber && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-purple-900">{selectedInterview.phoneNumber}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {selectedInterview.notes && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                      {selectedInterview.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium text-sm">
                    Send Reminder
                  </button>
                  <button className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 text-sm">
                    Reschedule
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InterviewScheduler