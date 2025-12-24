'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Phone,
  Mail,
  MapPin,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  UserPlus,
  CreditCard,
  Package,
  Pill,
  Stethoscope,
  Building,
  ChevronRight,
  Filter,
  Search,
  Star,
  MessageSquare,
  Shield,
  Award,
  Briefcase,
  Heart
} from 'lucide-react'

// Practice overview stats
const practiceStats = {
  totalPatients: 2847,
  newThisMonth: 156,
  appointmentsToday: 42,
  revenue: 'R285,600',
  outstandingBills: 'R45,200',
  satisfactionScore: 4.8
}

// Today's appointments
const todaysAppointments = [
  { id: 1, time: '09:00', patient: 'Sarah Johnson', type: 'Consultation', doctor: 'Dr. Smith', status: 'completed' },
  { id: 2, time: '09:30', patient: 'Michael Brown', type: 'Follow-up', doctor: 'Dr. Adams', status: 'completed' },
  { id: 3, time: '10:00', patient: 'Emma Davis', type: 'Vaccination', doctor: 'Dr. Smith', status: 'in-progress' },
  { id: 4, time: '10:30', patient: 'Robert Wilson', type: 'Consultation', doctor: 'Dr. Lee', status: 'waiting' },
  { id: 5, time: '11:00', patient: 'Lisa Anderson', type: 'Check-up', doctor: 'Dr. Adams', status: 'scheduled' },
  { id: 6, time: '11:30', patient: 'David Martinez', type: 'Consultation', doctor: 'Dr. Smith', status: 'scheduled' }
]

// Patient list
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

// Inventory items
const inventoryItems = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Medication', stock: 450, reorderPoint: 100, status: 'good' },
  { id: 2, name: 'Insulin Pens', category: 'Medication', stock: 25, reorderPoint: 50, status: 'low' },
  { id: 3, name: 'Surgical Masks', category: 'PPE', stock: 1200, reorderPoint: 500, status: 'good' },
  { id: 4, name: 'Latex Gloves (Box)', category: 'PPE', stock: 45, reorderPoint: 100, status: 'low' },
  { id: 5, name: 'Syringes 5ml', category: 'Supplies', stock: 280, reorderPoint: 200, status: 'good' },
  { id: 6, name: 'Bandages', category: 'Supplies', stock: 180, reorderPoint: 100, status: 'good' }
]

// Doctors/Partners
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

const MedicalPracticeManager = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'inventory' | 'partners'>('overview')
  const [searchQuery, setSearchQuery] = useState('')

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

  return (
    <div className="bg-white rounded-3xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Practice Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Complete practice and partner management system</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            <UserPlus className="w-4 h-4 inline mr-2" />
            New Patient
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
            <Calendar className="w-4 h-4 inline mr-2" />
            Schedule
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'overview' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Activity className="w-4 h-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('patients')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'patients' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Patients
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'inventory' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Inventory
        </button>
        <button
          onClick={() => setActiveTab('partners')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'partners' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Stethoscope className="w-4 h-4 inline mr-2" />
          Partners
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Key Metrics */}
          <div className="grid grid-cols-6 gap-4 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100"
            >
              <Users className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{practiceStats.totalPatients.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Patients</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100"
            >
              <UserPlus className="w-5 h-5 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{practiceStats.newThisMonth}</p>
              <p className="text-xs text-gray-500">New This Month</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100"
            >
              <Calendar className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{practiceStats.appointmentsToday}</p>
              <p className="text-xs text-gray-500">Today's Appointments</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-100"
            >
              <DollarSign className="w-5 h-5 text-yellow-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{practiceStats.revenue}</p>
              <p className="text-xs text-gray-500">Monthly Revenue</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100"
            >
              <CreditCard className="w-5 h-5 text-red-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{practiceStats.outstandingBills}</p>
              <p className="text-xs text-gray-500">Outstanding</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100"
            >
              <Star className="w-5 h-5 text-orange-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{practiceStats.satisfactionScore}</p>
              <p className="text-xs text-gray-500">Satisfaction</p>
            </motion.div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>
            <div className="space-y-2">
              {todaysAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{appointment.time}</p>
                      </div>
                      <div className="w-px h-10 bg-gray-200" />
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient}</p>
                        <p className="text-sm text-gray-500">{appointment.type} • {appointment.doctor}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patients' && (
        <div>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Patient List */}
          <div className="space-y-3">
            {patients.map((patient) => (
              <div key={patient.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">Age: {patient.age} • {patient.insurance}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {patient.conditions.map((condition, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                    <p className="text-sm text-gray-500">Next: {patient.nextAppointment}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">Balance: {patient.balance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div>
          {/* Inventory Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-3 border border-green-200">
              <p className="text-2xl font-bold text-green-700">4</p>
              <p className="text-xs text-green-600">In Stock</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
              <p className="text-2xl font-bold text-yellow-700">2</p>
              <p className="text-xs text-yellow-600">Low Stock</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 border border-red-200">
              <p className="text-2xl font-bold text-red-700">0</p>
              <p className="text-xs text-red-600">Out of Stock</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">R45,890</p>
              <p className="text-xs text-blue-600">Total Value</p>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Item</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Reorder Point</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Pill className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-gray-600">{item.category}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-semibold text-gray-900">{item.stock}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-gray-600">{item.reorderPoint}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'good' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status === 'good' ? 'In Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'partners' && (
        <div>
          {/* Partners/Doctors Grid */}
          <div className="grid grid-cols-2 gap-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{doctor.image}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(doctor.availability)}`}>
                    {doctor.availability}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-500">Patients</p>
                    <p className="text-lg font-bold text-gray-900">{doctor.patients}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-500">Today</p>
                    <p className="text-lg font-bold text-gray-900">{doctor.appointmentsToday}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Monthly Revenue</p>
                    <p className="text-lg font-bold text-gray-900">{doctor.revenue}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                    <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicalPracticeManager