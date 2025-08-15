'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Star,
  Heart,
  Activity,
  Users,
  Bell,
  Edit,
  X
} from 'lucide-react'

interface AppointmentSchedulingMobileProps {
  onBack?: () => void
}

// Sample doctors data
const doctors = [
  { 
    id: 1, 
    name: 'Dr. James Smith', 
    specialty: 'General Practice', 
    rating: 4.9,
    availability: 'Available',
    nextSlot: '2:00 PM',
    image: '👨‍⚕️'
  },
  { 
    id: 2, 
    name: 'Dr. Sarah Adams', 
    specialty: 'Pediatrics', 
    rating: 4.8,
    availability: 'Busy',
    nextSlot: '4:30 PM',
    image: '👩‍⚕️'
  },
  { 
    id: 3, 
    name: 'Dr. Michael Lee', 
    specialty: 'Cardiology', 
    rating: 4.9,
    availability: 'Available',
    nextSlot: '1:30 PM',
    image: '👨‍⚕️'
  },
  { 
    id: 4, 
    name: 'Dr. Emily Chen', 
    specialty: 'Dermatology', 
    rating: 4.7,
    availability: 'Available',
    nextSlot: '3:15 PM',
    image: '👩‍⚕️'
  }
]

// Sample appointments data
const appointments = [
  {
    id: 1,
    patient: 'Sarah Johnson',
    doctor: 'Dr. Smith',
    date: '2024-02-15',
    time: '09:00 AM',
    type: 'Consultation',
    status: 'confirmed',
    duration: '30 min'
  },
  {
    id: 2,
    patient: 'Michael Brown',
    doctor: 'Dr. Adams',
    date: '2024-02-15',
    time: '10:30 AM',
    type: 'Follow-up',
    status: 'confirmed',
    duration: '15 min'
  },
  {
    id: 3,
    patient: 'Emma Davis',
    doctor: 'Dr. Lee',
    date: '2024-02-15',
    time: '02:00 PM',
    type: 'Check-up',
    status: 'pending',
    duration: '45 min'
  },
  {
    id: 4,
    patient: 'Robert Wilson',
    doctor: 'Dr. Chen',
    date: '2024-02-16',
    time: '11:00 AM',
    type: 'Consultation',
    status: 'confirmed',
    duration: '30 min'
  }
]

// Time slots for scheduling
const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM'
]

const appointmentTypes = [
  { id: 'consultation', name: 'Consultation', duration: '30 min', color: 'bg-blue-100 text-blue-700' },
  { id: 'followup', name: 'Follow-up', duration: '15 min', color: 'bg-green-100 text-green-700' },
  { id: 'checkup', name: 'Check-up', duration: '45 min', color: 'bg-purple-100 text-purple-700' },
  { id: 'emergency', name: 'Emergency', duration: '60 min', color: 'bg-red-100 text-red-700' }
]

export default function AppointmentSchedulingMobile({ onBack }: AppointmentSchedulingMobileProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'doctors' | 'book'>('schedule')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<any>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch(availability) {
      case 'Available': return 'bg-green-100 text-green-700'
      case 'Busy': return 'bg-yellow-100 text-yellow-700'
      case 'Unavailable': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const todaysAppointments = appointments.filter(apt => apt.date === '2024-02-15')

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
                <h1 className="text-xl font-bold text-gray-900">Appointments</h1>
                <p className="text-sm text-gray-600">Schedule and manage appointments</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('book')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b sticky top-[72px] z-10">
        <div className="px-4">
          <div className="flex gap-6">
            {[
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'doctors', label: 'Doctors', icon: Stethoscope },
              { id: 'book', label: 'Book New', icon: Plus }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
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

      {/* Content */}
      <div className="px-4 py-6 pb-20">
        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            {/* Date Selector */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
                <span className="text-sm text-gray-500">{formatDate(selectedDate)}</span>
              </div>
              
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{todaysAppointments.length}</p>
                  <p className="text-xs text-blue-600">Today</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">
                    {todaysAppointments.filter(apt => apt.status === 'confirmed').length}
                  </p>
                  <p className="text-xs text-green-600">Confirmed</p>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded-lg">
                  <p className="text-lg font-bold text-yellow-600">
                    {todaysAppointments.filter(apt => apt.status === 'pending').length}
                  </p>
                  <p className="text-xs text-yellow-600">Pending</p>
                </div>
              </div>
            </div>

            {/* Appointment List */}
            <div className="space-y-3">
              {todaysAppointments.map((appointment) => (
                <motion.div
                  key={appointment.id}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-bold text-gray-900">{appointment.time}</p>
                      <p className="text-xs text-gray-500">{appointment.duration}</p>
                    </div>
                    <div className="w-px h-16 bg-gray-200" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{appointment.patient}</p>
                          <p className="text-sm text-gray-500">{appointment.doctor}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          {appointment.type}
                        </span>
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                          View Details
                          <ChevronRight className="w-4 h-4 inline ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-700">View Calendar</p>
              </button>
              <button className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <Plus className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-700">Quick Book</p>
              </button>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Doctor List */}
            <div className="space-y-3">
              {doctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedDoctor(doctor)
                    setActiveTab('book')
                  }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{doctor.image}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                          <p className="text-sm text-gray-500">{doctor.specialty}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(doctor.availability)}`}>
                          {doctor.availability}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Next: {doctor.nextSlot}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                          View Profile
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium">
                          Book Appointment
                          <ChevronRight className="w-4 h-4 inline ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Book New Tab */}
        {activeTab === 'book' && (
          <div className="space-y-4">
            {/* Step 1: Select Doctor */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">1. Select Doctor</h3>
              {selectedDoctor ? (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl">{selectedDoctor.image}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedDoctor.name}</p>
                    <p className="text-sm text-gray-500">{selectedDoctor.specialty}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedDoctor(null)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {doctors.slice(0, 2).map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="text-3xl">{doctor.image}</div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{doctor.name}</p>
                        <p className="text-sm text-gray-500">{doctor.specialty}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                  <button 
                    onClick={() => setActiveTab('doctors')}
                    className="p-3 border border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    View All Doctors
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Select Appointment Type */}
            {selectedDoctor && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">2. Appointment Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {appointmentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedAppointmentType(type)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedAppointmentType?.id === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{type.name}</p>
                        <p className="text-sm text-gray-500">{type.duration}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Select Time Slot */}
            {selectedDoctor && selectedAppointmentType && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">3. Select Time</h3>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTimeSlot(time)}
                      className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedTimeSlot === time
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Book Button */}
            {selectedDoctor && selectedAppointmentType && selectedTimeSlot && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Appointment Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor</span>
                    <span className="font-medium text-gray-900">{selectedDoctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-900">{selectedAppointmentType.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium text-gray-900">{selectedTimeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">{selectedAppointmentType.duration}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowBookingForm(true)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Confirm Appointment
                  <CheckCircle className="w-4 h-4 inline ml-2" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowBookingForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Booking Confirmation</h3>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Appointment Booked!</h4>
                  <p className="text-gray-600">Your appointment has been confirmed</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor</span>
                    <span className="font-medium text-gray-900">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-gray-900">Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium text-gray-900">{selectedTimeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-900">{selectedAppointmentType?.name}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => {
                      setShowBookingForm(false)
                      setSelectedDoctor(null)
                      setSelectedAppointmentType(null)
                      setSelectedTimeSlot(null)
                      setActiveTab('schedule')
                    }}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
                  >
                    View Schedule
                  </button>
                  <button 
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium"
                  >
                    Book Another
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