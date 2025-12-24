'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Building,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Filter,
  Search,
  MapPin,
  ChevronRight,
  RefreshCw,
  Zap,
  Shield,
  Award,
  Phone,
  Bell
} from 'lucide-react'

interface HospitalOperationsCenterMobileProps {
  onBack?: () => void
}

// Ward data with bed capacity (from desktop component)
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

// Recent admissions (from desktop component)
const recentAdmissions = [
  { id: 1, patient: 'John Smith', ward: 'Emergency', time: '5 mins ago', priority: 'critical' },
  { id: 2, patient: 'Sarah Johnson', ward: 'Maternity', time: '12 mins ago', priority: 'normal' },
  { id: 3, patient: 'Michael Brown', ward: 'Surgery', time: '25 mins ago', priority: 'urgent' },
  { id: 4, patient: 'Emma Davis', ward: 'Pediatrics', time: '1 hour ago', priority: 'normal' }
]

// Upcoming discharges (from desktop component)
const upcomingDischarges = [
  { id: 1, patient: 'Robert Wilson', ward: 'General', time: '2:00 PM', bed: 'G-105' },
  { id: 2, patient: 'Lisa Anderson', ward: 'Surgery', time: '3:30 PM', bed: 'S-208' },
  { id: 3, patient: 'David Martinez', ward: 'ICU', time: '4:00 PM', bed: 'ICU-03' },
  { id: 4, patient: 'Jennifer Taylor', ward: 'Maternity', time: '5:15 PM', bed: 'M-412' }
]

export default function HospitalOperationsCenterMobile({ onBack }: HospitalOperationsCenterMobileProps) {
  const [selectedWard, setSelectedWard] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'wards' | 'activity'>('overview')
  const [showFilters, setShowFilters] = useState(false)

  const totalBeds = wardsData.reduce((acc, ward) => acc + ward.totalBeds, 0)
  const totalOccupied = wardsData.reduce((acc, ward) => acc + ward.occupied, 0)
  const totalAvailable = wardsData.reduce((acc, ward) => acc + ward.available, 0)
  const totalCritical = wardsData.reduce((acc, ward) => acc + ward.critical, 0)
  const occupancyRate = Math.round((totalOccupied / totalBeds) * 100)

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'urgent': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  const renderBedVisualization = (ward: typeof wardsData[0]) => {
    const rows = Math.ceil(ward.totalBeds / 10)
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
          className={`w-2 h-2 rounded-sm ${
            isOccupied 
              ? isCritical ? 'bg-red-500' : 'bg-blue-500'
              : 'bg-gray-300'
          }`}
        />
      )
    }
    
    return (
      <div className="grid grid-cols-10 gap-1">
        {beds}
      </div>
    )
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
                <h1 className="text-xl font-bold text-gray-900">Hospital Operations</h1>
                <p className="text-sm text-gray-600">Real-time capacity management</p>
              </div>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Filter className="w-5 h-5" />
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
              { id: 'wards', label: 'Wards', icon: Building },
              { id: 'activity', label: 'Activity', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as any)}
                  className={`py-3 px-1 border-b-2 transition-colors ${
                    viewMode === tab.id
                      ? 'border-red-600 text-red-600'
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
        {viewMode === 'overview' && (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Bed className="w-6 h-6 opacity-80" />
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    occupancyRate > 85 ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
                  }`}>
                    {occupancyRate}%
                  </span>
                </div>
                <p className="text-2xl font-bold">{totalOccupied}/{totalBeds}</p>
                <p className="text-blue-100 text-sm">Total Occupancy</p>
                <p className="text-xs text-blue-200 mt-1">{totalAvailable} beds available</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-6 h-6 opacity-80" />
                  <TrendingDown className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">{totalAvailable}</p>
                <p className="text-green-100 text-sm">Available Beds</p>
                <p className="text-xs text-green-200 mt-1">Ready for patients</p>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="w-6 h-6 opacity-80" />
                  <span className="text-xs text-red-200 font-medium">High</span>
                </div>
                <p className="text-2xl font-bold">{totalCritical}</p>
                <p className="text-red-100 text-sm">Critical Patients</p>
                <p className="text-xs text-red-200 mt-1">Require monitoring</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 opacity-80" />
                  <Activity className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">79</p>
                <p className="text-purple-100 text-sm">Staff on Duty</p>
                <p className="text-xs text-purple-200 mt-1">All departments</p>
              </div>
            </div>

            {/* Quick Ward Status */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Ward Status Summary</h3>
              <div className="space-y-3">
                {wardsData.slice(0, 4).map((ward) => (
                  <motion.div
                    key={ward.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedWard(ward.id)
                      setViewMode('wards')
                    }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${ward.color} flex items-center justify-center`}>
                        <Bed className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{ward.name}</p>
                        <p className="text-sm text-gray-500">{ward.floor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{ward.available}</p>
                      <p className="text-xs text-gray-500">available</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Today's Summary */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white">
              <h3 className="font-semibold mb-3">Today's Summary</h3>
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
        )}

        {/* Wards Tab */}
        {viewMode === 'wards' && (
          <div className="space-y-4">
            {/* Legend */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Bed Status Legend</h3>
              <div className="flex items-center justify-around">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-sm" />
                  <span className="text-xs text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                  <span className="text-xs text-gray-600">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-sm" />
                  <span className="text-xs text-gray-600">Critical</span>
                </div>
              </div>
            </div>

            {/* Ward List */}
            <div className="space-y-3">
              {wardsData.map((ward) => (
                <motion.div
                  key={ward.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedWard(selectedWard === ward.id ? null : ward.id)}
                  className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all ${
                    selectedWard === ward.id ? `${ward.bgColor} ${ward.borderColor}` : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ward.color} flex items-center justify-center`}>
                        <Bed className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{ward.name}</h4>
                        <p className="text-sm text-gray-500">{ward.floor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{ward.available}</p>
                      <p className="text-xs text-gray-500">available</p>
                    </div>
                  </div>

                  {/* Bed Visualization */}
                  <div className="mb-3">
                    {renderBedVisualization(ward)}
                  </div>

                  {/* Ward Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-red-600">{ward.critical}</p>
                      <p className="text-xs text-gray-600">Critical</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{ward.stable}</p>
                      <p className="text-xs text-gray-600">Stable</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{ward.staff}</p>
                      <p className="text-xs text-gray-600">Staff</p>
                    </div>
                  </div>

                  {/* Occupancy Bar */}
                  <div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${ward.color} rounded-full transition-all`}
                        style={{ width: `${(ward.occupied / ward.totalBeds) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{ward.occupied}/{ward.totalBeds} occupied</span>
                      <span>{Math.round((ward.occupied / ward.totalBeds) * 100)}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {viewMode === 'activity' && (
          <div className="space-y-4">
            {/* Recent Admissions */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Recent Admissions
              </h3>
              <div className="space-y-3">
                {recentAdmissions.map((admission) => (
                  <motion.div 
                    key={admission.id}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {admission.patient.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{admission.patient}</p>
                        <p className="text-sm text-gray-500">{admission.ward} • {admission.time}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(admission.priority)}`}>
                      {admission.priority}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Upcoming Discharges */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Upcoming Discharges
              </h3>
              <div className="space-y-3">
                {upcomingDischarges.map((discharge) => (
                  <motion.div 
                    key={discharge.id}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                        {discharge.patient.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{discharge.patient}</p>
                        <p className="text-sm text-gray-500">{discharge.ward} • {discharge.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-blue-600">{discharge.bed}</span>
                      <p className="text-xs text-gray-500">Bed Ready</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">23 min</p>
                <p className="text-xs text-gray-500">Avg Wait Time</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
                <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">98%</p>
                <p className="text-xs text-gray-500">Efficiency</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <button className="w-14 h-14 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center">
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}