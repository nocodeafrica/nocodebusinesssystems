'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users,
  Calendar,
  DollarSign,
  UserPlus,
  Activity,
  Stethoscope,
  Package,
  ArrowLeft,
  Search,
  Filter,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  Pill,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Award,
  Heart,
  Shield
} from 'lucide-react'

interface MedicalPracticeManagerMobileProps {
  onBack?: () => void
}

// Practice overview stats (from desktop component)
const practiceStats = {
  totalPatients: 2847,
  newThisMonth: 156,
  appointmentsToday: 42,
  revenue: 'R285,600',
  outstandingBills: 'R45,200',
  satisfactionScore: 4.8
}

// Today's appointments (from desktop component)
const todaysAppointments = [
  { id: 1, time: '09:00', patient: 'Sarah Johnson', type: 'Consultation', doctor: 'Dr. Smith', status: 'completed' },
  { id: 2, time: '09:30', patient: 'Michael Brown', type: 'Follow-up', doctor: 'Dr. Adams', status: 'completed' },
  { id: 3, time: '10:00', patient: 'Emma Davis', type: 'Vaccination', doctor: 'Dr. Smith', status: 'in-progress' },
  { id: 4, time: '10:30', patient: 'Robert Wilson', type: 'Consultation', doctor: 'Dr. Lee', status: 'waiting' },
  { id: 5, time: '11:00', patient: 'Lisa Anderson', type: 'Check-up', doctor: 'Dr. Adams', status: 'scheduled' },
  { id: 6, time: '11:30', patient: 'David Martinez', type: 'Consultation', doctor: 'Dr. Smith', status: 'scheduled' }
]

// Patient list (from desktop component)
const patients = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    age: 32, 
    lastVisit: '2 days ago', 
    nextAppointment: 'Feb 15, 2024',
    conditions: ['Hypertension', 'Diabetes'],
    insurance: 'Discovery Health',
    balance: 'R0'
  },
  { 
    id: 2, 
    name: 'Michael Brown', 
    age: 45, 
    lastVisit: '1 week ago', 
    nextAppointment: 'Feb 20, 2024',
    conditions: ['Asthma'],
    insurance: 'Momentum',
    balance: 'R1,250'
  },
  { 
    id: 3, 
    name: 'Emma Davis', 
    age: 28, 
    lastVisit: '3 weeks ago', 
    nextAppointment: 'Mar 5, 2024',
    conditions: ['Allergies'],
    insurance: 'Bonitas',
    balance: 'R0'
  },
  { 
    id: 4, 
    name: 'Robert Wilson', 
    age: 67, 
    lastVisit: '1 month ago', 
    nextAppointment: 'Feb 18, 2024',
    conditions: ['Diabetes', 'Arthritis', 'Hypertension'],
    insurance: 'GEMS',
    balance: 'R3,450'
  }
]

// Inventory items (from desktop component)
const inventoryItems = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Medication', stock: 450, reorderPoint: 100, status: 'good' },
  { id: 2, name: 'Insulin Pens', category: 'Medication', stock: 25, reorderPoint: 50, status: 'low' },
  { id: 3, name: 'Surgical Masks', category: 'PPE', stock: 1200, reorderPoint: 500, status: 'good' },
  { id: 4, name: 'Latex Gloves (Box)', category: 'PPE', stock: 45, reorderPoint: 100, status: 'low' },
  { id: 5, name: 'Syringes 5ml', category: 'Supplies', stock: 280, reorderPoint: 200, status: 'good' },
  { id: 6, name: 'Bandages', category: 'Supplies', stock: 180, reorderPoint: 100, status: 'good' }
]

// Doctors/Partners (from desktop component)
const doctors = [
  { 
    id: 1, 
    name: 'Dr. James Smith', 
    specialty: 'General Practice', 
    patients: 945,
    appointmentsToday: 12,
    rating: 4.9,
    revenue: 'R95,200',
    availability: 'Available',
    image: '👨‍⚕️'
  },
  { 
    id: 2, 
    name: 'Dr. Sarah Adams', 
    specialty: 'Pediatrics', 
    patients: 687,
    appointmentsToday: 10,
    rating: 4.8,
    revenue: 'R78,400',
    availability: 'In Session',
    image: '👩‍⚕️'
  },
  { 
    id: 3, 
    name: 'Dr. Michael Lee', 
    specialty: 'Cardiology', 
    patients: 523,
    appointmentsToday: 8,
    rating: 4.9,
    revenue: 'R112,000',
    availability: 'Available',
    image: '👨‍⚕️'
  },
  { 
    id: 4, 
    name: 'Dr. Emily Chen', 
    specialty: 'Dermatology', 
    patients: 692,
    appointmentsToday: 9,
    rating: 4.7,
    revenue: 'R68,900',
    availability: 'On Break',
    image: '👩‍⚕️'
  }
]

export default function MedicalPracticeManagerMobile({ onBack }: MedicalPracticeManagerMobileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'inventory' | 'partners'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'in-progress': return 'bg-blue-100 text-blue-700'
      case 'waiting': return 'bg-yellow-100 text-yellow-700'
      case 'scheduled': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch(availability) {
      case 'Available': return 'bg-green-100 text-green-700'
      case 'In Session': return 'bg-blue-100 text-blue-700'
      case 'On Break': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStockStatusColor = (status: string) => {
    switch(status) {
      case 'good': return 'bg-green-100 text-green-700'
      case 'low': return 'bg-yellow-100 text-yellow-700'
      case 'critical': return 'bg-red-100 text-red-700'
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
                <h1 className="text-xl font-bold text-gray-900">Medical Practice</h1>
                <p className="text-sm text-gray-600">Complete practice management</p>
              </div>
            </div>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b sticky top-[72px] z-10">
        <div className="px-4">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'patients', label: 'Patients', icon: Users },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'partners', label: 'Doctors', icon: Stethoscope }
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
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 opacity-80" />
                  <UserPlus className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">{practiceStats.totalPatients.toLocaleString()}</p>
                <p className="text-blue-100 text-sm">Total Patients</p>
                <p className="text-xs text-blue-200 mt-1">+{practiceStats.newThisMonth} this month</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-6 h-6 opacity-80" />
                  <ChevronRight className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">{practiceStats.revenue}</p>
                <p className="text-green-100 text-sm">Monthly Revenue</p>
                <p className="text-xs text-green-200 mt-1">Outstanding: {practiceStats.outstandingBills}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-6 h-6 opacity-80" />
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">{practiceStats.appointmentsToday}</p>
                <p className="text-purple-100 text-sm">Today's Appointments</p>
                <p className="text-xs text-purple-200 mt-1">Next at 10:30 AM</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Star className="w-6 h-6 opacity-80" />
                  <Heart className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">{practiceStats.satisfactionScore}</p>
                <p className="text-orange-100 text-sm">Satisfaction Score</p>
                <p className="text-xs text-orange-200 mt-1">Excellent rating</p>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Today's Appointments</h3>
              <div className="space-y-3">
                {todaysAppointments.slice(0, 4).map((appointment) => (
                  <motion.div 
                    key={appointment.id}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-bold text-gray-900">{appointment.time}</p>
                    </div>
                    <div className="w-px h-10 bg-gray-200" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-500">{appointment.type} • {appointment.doctor}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </motion.div>
                ))}
              </div>
              <button className="w-full mt-3 py-2 text-blue-600 text-sm font-medium hover:bg-blue-50 rounded-lg transition-colors">
                View All Appointments
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Patient List */}
            <div className="space-y-3">
              {patients.map((patient) => (
                <motion.div 
                  key={patient.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedItem(patient)}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">Age: {patient.age} • {patient.insurance}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Balance</p>
                          <p className="text-sm font-medium text-gray-900">{patient.balance}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {patient.conditions.map((condition, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {condition}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last visit: {patient.lastVisit}</span>
                        <span>Next: {patient.nextAppointment}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Inventory Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                <p className="text-2xl font-bold text-green-700">4</p>
                <p className="text-xs text-green-600">In Stock</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                <p className="text-2xl font-bold text-yellow-700">2</p>
                <p className="text-xs text-yellow-600">Low Stock</p>
              </div>
            </div>

            {/* Inventory Items */}
            <div className="space-y-3">
              {inventoryItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Pill className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(item.status)}`}>
                      {item.status === 'good' ? 'In Stock' : 'Low Stock'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{item.stock}</p>
                      <p className="text-xs text-gray-600">Current</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{item.reorderPoint}</p>
                      <p className="text-xs text-gray-600">Reorder</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {Math.round(((item.stock - item.reorderPoint) / item.reorderPoint) * 100)}%
                      </p>
                      <p className="text-xs text-gray-600">Above Min</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Doctors/Partners Tab */}
        {activeTab === 'partners' && (
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedItem(doctor)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl">{doctor.image}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                        <p className="text-sm text-gray-500">{doctor.specialty}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(doctor.availability)}`}>
                        {doctor.availability}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{doctor.patients}</p>
                    <p className="text-xs text-gray-600">Patients</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{doctor.appointmentsToday}</p>
                    <p className="text-xs text-gray-600">Today</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{doctor.revenue}</p>
                    <p className="text-xs text-gray-600">Revenue</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Monthly Performance</p>
                    <p className="text-sm font-medium text-gray-900">Excellent</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Contact
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setSelectedItem(null)}
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
                  <h3 className="text-lg font-semibold text-gray-900">Details</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Patient Details */}
                {selectedItem.age && (
                  <>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Patient Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Name</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Age</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.age} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Insurance</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.insurance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Balance</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.balance}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Medical Conditions</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.conditions?.map((condition: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Doctor Details */}
                {selectedItem.specialty && (
                  <>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Doctor Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Name</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Specialty</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.specialty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Rating</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.rating}/5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Availability</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(selectedItem.availability)}`}>
                            {selectedItem.availability}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}