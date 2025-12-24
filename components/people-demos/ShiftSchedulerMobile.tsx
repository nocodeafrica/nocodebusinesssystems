'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  AlertCircle,
  CheckCircle,
  User,
  ChevronDown,
  X,
  Menu
} from 'lucide-react'
import { useState } from 'react'
import { useShiftData } from '@/hooks/useShiftData'

const ShiftSchedulerMobile = () => {
  const {
    selectedWeek,
    setSelectedWeek,
    selectedDay,
    setSelectedDay,
    getShiftColor,
    getShiftInfo,
    getCoverageColor,
    getEmployeesForDay,
    getShiftCountForDay,
    daysOfWeek,
    shiftTypes,
    weeklySchedule,
    shiftRequests,
    coverageStats
  } = useShiftData()

  // Default to day view on mobile
  const [viewMode, setViewMode] = useState<'week' | 'day'>('day')
  const [showRequests, setShowRequests] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Shift Scheduler</h2>
              <p className="text-xs text-gray-500">Manage employee shifts</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-gray-100 rounded-lg"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 bg-emerald-600 text-white rounded-lg">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Week Selector */}
          <div className="flex items-center justify-between mb-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <Calendar className="w-3 h-3 text-gray-600" />
              <span className="text-sm font-medium">{selectedWeek}</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setViewMode('week')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Day View
            </button>
          </div>
        </div>
      </div>

      {/* Coverage Stats - Horizontal Scroll */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {coverageStats.map((stat) => (
            <div key={stat.shift} className="flex-shrink-0 bg-gray-50 rounded-lg p-3 min-w-[140px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{stat.shift}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getCoverageColor(stat.coverage)}`}>
                  {stat.coverage}%
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-900">{stat.assigned}</span>
                <span className="text-xs text-gray-500">/ {stat.required}</span>
              </div>
              <div className="mt-1.5 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    stat.coverage >= 100 ? 'bg-green-500' : stat.coverage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(stat.coverage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {viewMode === 'week' ? (
          /* Week View - Compact Grid */
          <div className="space-y-3">
            {/* Days Header - Horizontal Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {daysOfWeek.map((day, index) => (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDay(day)
                    setViewMode('day')
                  }}
                  className="flex-shrink-0 min-w-[80px] p-2 bg-white rounded-lg border border-gray-200"
                >
                  <p className="text-xs font-semibold text-gray-900">{day.slice(0, 3)}</p>
                  <p className="text-xs text-gray-500">Nov {20 + index}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-gray-400" />
                    <span className="text-xs font-medium">{getShiftCountForDay(day)}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Employee List */}
            <div className="space-y-2">
              {weeklySchedule.map((schedule) => (
                <motion.div
                  key={schedule.employee.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  onClick={() => setSelectedEmployee(
                    selectedEmployee === schedule.employee.id ? null : schedule.employee.id
                  )}
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={schedule.employee.avatar}
                          alt={schedule.employee.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{schedule.employee.name}</p>
                          <p className="text-xs text-gray-500">{schedule.employee.role}</p>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          selectedEmployee === schedule.employee.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedEmployee === schedule.employee.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 border-t border-gray-100">
                          <div className="flex gap-1 overflow-x-auto mt-3 pb-1">
                            {daysOfWeek.map((day, index) => {
                              const shiftId = schedule.shifts[day as keyof typeof schedule.shifts]
                              const shiftInfo = getShiftInfo(shiftId)
                              const ShiftIcon = shiftInfo && shiftId ? shiftTypes.find(s => s.id === shiftId)?.icon : null
                              return (
                                <div key={day} className="text-center flex-shrink-0 min-w-[52px]">
                                  <p className="text-[10px] font-medium text-gray-600 mb-0.5">{day.slice(0, 3)}</p>
                                  <p className="text-[9px] text-gray-400 mb-1">{20 + index}</p>
                                  {shiftId ? (
                                    <div className={`py-1.5 px-1 ${getShiftColor(shiftId)} text-white rounded text-xs`}>
                                      {ShiftIcon && <ShiftIcon className="w-3 h-3 mx-auto mb-0.5" />}
                                      <p className="font-medium text-[10px] leading-none">{shiftInfo.name.charAt(0)}</p>
                                    </div>
                                  ) : (
                                    <div className="py-2 bg-gray-100 text-gray-400 rounded text-xs">
                                      <span className="text-[10px]">-</span>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Day View */
          <div className="space-y-4">
            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {daysOfWeek.map((day, index) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDay === day 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-700'
                  }`}
                >
                  {day.slice(0, 3)} {20 + index}
                </button>
              ))}
            </div>

            {/* Shift Types for Selected Day */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Shift Coverage</h3>
              <div className="space-y-2">
                {shiftTypes.map((shift) => {
                  const Icon = shift.icon
                  const employeesOnShift = getEmployeesForDay(selectedDay).filter(
                    e => e.shift === shift.id
                  )
                  return (
                    <div key={shift.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 ${shift.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{shift.name}</p>
                          <p className="text-xs text-gray-500">{shift.time}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {employeesOnShift.length} staff
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Employees for Selected Day */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Staff on {selectedDay}</h3>
              {getEmployeesForDay(selectedDay).map((employee) => {
                const shiftInfo = getShiftInfo(employee.shift)
                return (
                  <div key={employee.id} className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                          <p className="text-xs text-gray-500">{employee.role}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 ${getShiftColor(employee.shift)} text-white rounded-lg`}>
                        <p className="text-xs font-medium">{shiftInfo.name}</p>
                        <p className="text-xs opacity-90">{shiftInfo.time}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
              {getEmployeesForDay(selectedDay).length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No staff scheduled for this day</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for Requests */}
      <button
        onClick={() => setShowRequests(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center z-20"
      >
        <div className="relative">
          <AlertCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        </div>
      </button>

      {/* Shift Requests Modal */}
      <AnimatePresence>
        {showRequests && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 z-40 bg-white"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Shift Requests</h3>
                <button onClick={() => setShowRequests(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {shiftRequests.map((request) => (
                <div key={request.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.employee}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {request.type === 'swap' && `Swap: ${request.from} → ${request.to}`}
                        {request.type === 'leave' && `Leave: ${request.reason}`}
                        {request.type === 'overtime' && `Overtime: ${request.hours} hours`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{request.date}</p>
                    </div>
                    {request.status === 'pending' && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    )}
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">
                        Approve
                      </button>
                      <button className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium">
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShiftSchedulerMobile