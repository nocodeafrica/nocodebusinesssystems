'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bed, 
  Users, 
  Activity, 
  Heart,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  UserPlus,
  Stethoscope,
  Pill,
  Building,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  Filter,
  Search,
  MapPin,
  User,
  Shield,
  Zap
} from 'lucide-react'

// Ward data with bed capacity
const wardsData = [
  {
    id: 'icu',
    name: 'Intensive Care Unit',
    floor: '3rd Floor',
    totalBeds: 20,
    occupied: 18,
    available: 2,
    critical: 8,
    stable: 10,
    staff: 12,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  {
    id: 'emergency',
    name: 'Emergency Room',
    floor: 'Ground Floor',
    totalBeds: 30,
    occupied: 22,
    available: 8,
    critical: 5,
    stable: 17,
    staff: 15,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'surgery',
    name: 'Surgery Ward',
    floor: '2nd Floor',
    totalBeds: 25,
    occupied: 15,
    available: 10,
    critical: 3,
    stable: 12,
    staff: 10,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'maternity',
    name: 'Maternity Ward',
    floor: '4th Floor',
    totalBeds: 35,
    occupied: 28,
    available: 7,
    critical: 2,
    stable: 26,
    staff: 14,
    color: 'from-pink-500 to-purple-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    floor: '5th Floor',
    totalBeds: 40,
    occupied: 30,
    available: 10,
    critical: 4,
    stable: 26,
    staff: 16,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'general',
    name: 'General Ward',
    floor: '1st Floor',
    totalBeds: 50,
    occupied: 35,
    available: 15,
    critical: 5,
    stable: 30,
    staff: 12,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
]

// Recent admissions
const recentAdmissions = [
  { id: 1, patient: 'John Smith', ward: 'Emergency', time: '5 mins ago', priority: 'critical' },
  { id: 2, patient: 'Sarah Johnson', ward: 'Maternity', time: '12 mins ago', priority: 'normal' },
  { id: 3, patient: 'Michael Brown', ward: 'Surgery', time: '25 mins ago', priority: 'urgent' },
  { id: 4, patient: 'Emma Davis', ward: 'Pediatrics', time: '1 hour ago', priority: 'normal' }
]

// Upcoming discharges
const upcomingDischarges = [
  { id: 1, patient: 'Robert Wilson', ward: 'General', time: '2:00 PM', bed: 'G-105' },
  { id: 2, patient: 'Lisa Anderson', ward: 'Surgery', time: '3:30 PM', bed: 'S-208' },
  { id: 3, patient: 'David Martinez', ward: 'ICU', time: '4:00 PM', bed: 'ICU-03' },
  { id: 4, patient: 'Jennifer Taylor', ward: 'Maternity', time: '5:15 PM', bed: 'M-412' }
]

const HospitalOperationsCenter = () => {
  const [selectedWard, setSelectedWard] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  const totalBeds = wardsData.reduce((acc, ward) => acc + ward.totalBeds, 0)
  const totalOccupied = wardsData.reduce((acc, ward) => acc + ward.occupied, 0)
  const totalAvailable = wardsData.reduce((acc, ward) => acc + ward.available, 0)
  const occupancyRate = Math.round((totalOccupied / totalBeds) * 100)

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'urgent': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  const renderBedGrid = (ward: typeof wardsData[0]) => {
    const beds = []
    for (let i = 0; i < ward.totalBeds; i++) {
      const isOccupied = i < ward.occupied
      const isCritical = i < ward.critical
      beds.push(
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.01 }}
          className={`w-3 h-3 rounded-sm ${
            isOccupied 
              ? isCritical ? 'bg-red-500' : 'bg-blue-500'
              : 'bg-gray-200'
          }`}
          title={`Bed ${i + 1}: ${isOccupied ? (isCritical ? 'Critical' : 'Occupied') : 'Available'}`}
        />
      )
    }
    return beds
  }

  return (
    <div className="bg-white rounded-3xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hospital Operations Center</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time bed capacity and patient flow management</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'map' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Map View
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Building className="w-4 h-4 inline mr-2" />
            List View
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Bed className="w-5 h-5 text-blue-600" />
            <span className={`text-xs font-medium ${occupancyRate > 85 ? 'text-red-600' : 'text-green-600'}`}>
              {occupancyRate}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalOccupied}/{totalBeds}</p>
          <p className="text-xs text-gray-500">Total Occupancy</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <TrendingDown className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalAvailable}</p>
          <p className="text-xs text-gray-500">Available Beds</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600 font-medium">High</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">27</p>
          <p className="text-xs text-gray-500">Critical Patients</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">79</p>
          <p className="text-xs text-gray-500">Staff on Duty</p>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-3 gap-6">
        {/* Ward Map / List */}
        <div className="col-span-2">
          {viewMode === 'map' ? (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Floor Map</h3>
              
              {/* Visual Hospital Map */}
              <div className="grid grid-cols-2 gap-4">
                {wardsData.map((ward, index) => (
                  <motion.div
                    key={ward.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedWard(ward.id)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedWard === ward.id 
                        ? `${ward.bgColor} ${ward.borderColor} shadow-lg` 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Ward Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{ward.name}</h4>
                        <p className="text-xs text-gray-500">{ward.floor}</p>
                      </div>
                      <div className={`text-right`}>
                        <p className="text-lg font-bold text-gray-900">{ward.available}</p>
                        <p className="text-xs text-gray-500">available</p>
                      </div>
                    </div>

                    {/* Bed Visualization Grid */}
                    <div className="grid grid-cols-10 gap-1 mb-3">
                      {renderBedGrid(ward)}
                    </div>

                    {/* Ward Stats */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-sm" />
                          <span className="text-gray-600">Critical: {ward.critical}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                          <span className="text-gray-600">Stable: {ward.stable}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">{ward.staff}</span>
                      </div>
                    </div>

                    {/* Occupancy Bar */}
                    <div className="mt-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${ward.color} rounded-full transition-all`}
                          style={{ width: `${(ward.occupied / ward.totalBeds) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        {Math.round((ward.occupied / ward.totalBeds) * 100)}% occupied
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-sm" />
                  <span className="text-xs text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                  <span className="text-xs text-gray-600">Occupied - Stable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-sm" />
                  <span className="text-xs text-gray-600">Occupied - Critical</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ward List</h3>
              <div className="space-y-3">
                {wardsData.map((ward) => (
                  <div 
                    key={ward.id}
                    className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ward.color} flex items-center justify-center`}>
                          <Bed className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{ward.name}</h4>
                          <p className="text-sm text-gray-500">{ward.floor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{ward.available}</p>
                          <p className="text-xs text-gray-500">Available</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{ward.occupied}</p>
                          <p className="text-xs text-gray-500">Occupied</p>
                        </div>
                        <div className="w-24">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${ward.color} rounded-full`}
                              style={{ width: `${(ward.occupied / ward.totalBeds) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            {Math.round((ward.occupied / ward.totalBeds) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          {/* Recent Admissions */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              Recent Admissions
            </h3>
            <div className="space-y-2">
              {recentAdmissions.map((admission) => (
                <div key={admission.id} className="bg-white rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{admission.patient}</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(admission.priority)}`}>
                      {admission.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{admission.ward}</span>
                    <span>{admission.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Discharges */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              Upcoming Discharges
            </h3>
            <div className="space-y-2">
              {upcomingDischarges.map((discharge) => (
                <div key={discharge.id} className="bg-white rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">{discharge.patient}</p>
                    <span className="text-xs text-blue-600 font-medium">{discharge.bed}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{discharge.ward}</span>
                    <span>{discharge.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white">
            <h3 className="text-sm font-semibold mb-3">Today's Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-bold">42</p>
                <p className="text-xs opacity-90">Admissions</p>
              </div>
              <div>
                <p className="text-2xl font-bold">38</p>
                <p className="text-xs opacity-90">Discharges</p>
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs opacity-90">Surgeries</p>
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs opacity-90">ER Visits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HospitalOperationsCenter