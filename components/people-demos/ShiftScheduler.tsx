'use client'

import { motion } from 'framer-motion'
import { 
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  Copy,
  Edit2,
  Trash2,
  User,
  MapPin,
  ArrowRight,
  TrendingUp,
  Sun,
  Coffee,
  Moon
} from 'lucide-react'
import { useShiftData } from '@/hooks/useShiftData'
import { useState } from 'react'

const ShiftScheduler = () => {
  const {
    selectedWeek,
    setSelectedWeek,
    viewMode,
    setViewMode,
    selectedEmployee,
    setSelectedEmployee,
    selectedDay,
    setSelectedDay,
    getShiftColor,
    getShiftInfo,
    getCoverageColor,
    getShiftCountForDay,
    daysOfWeek,
    shiftTypes,
    weeklySchedule,
    shiftRequests,
    coverageStats
  } = useShiftData()

  const [selectedPerson, setSelectedPerson] = useState<number | null>(null)

  // Helper function to get hourly schedule for a person on a specific day
  const getHourlySchedule = (personId: number, day: string) => {
    const person = weeklySchedule.find(s => s.employee.id === personId)
    if (!person) return []
    
    const shiftId = person.shifts[day as keyof typeof person.shifts]
    if (!shiftId) return []
    
    const shift = shiftTypes.find(s => s.id === shiftId)
    if (!shift) return []
    
    // Parse time range and create hourly blocks
    const [startTime, endTime] = shift.time.split(' - ')
    const hours = []
    
    // Simple hour generation based on shift type
    switch (shiftId) {
      case 'morning':
        for (let i = 6; i <= 14; i++) {
          hours.push({
            hour: i,
            display: i <= 12 ? `${i}:00 AM` : `${i-12}:00 PM`,
            activity: i === 6 ? 'Clock In' : i === 10 ? 'Break' : i === 12 ? 'Lunch' : i === 14 ? 'Clock Out' : 'Work'
          })
        }
        break
      case 'afternoon':
        for (let i = 14; i <= 22; i++) {
          hours.push({
            hour: i,
            display: i <= 12 ? `${i}:00 AM` : `${i-12}:00 PM`,
            activity: i === 14 ? 'Clock In' : i === 18 ? 'Break' : i === 20 ? 'Dinner' : i === 22 ? 'Clock Out' : 'Work'
          })
        }
        break
      case 'night':
        for (let i = 22; i <= 30; i++) { // 30 represents 6 AM next day
          const actualHour = i > 24 ? i - 24 : i
          hours.push({
            hour: actualHour,
            display: actualHour <= 12 ? `${actualHour}:00 AM` : `${actualHour-12}:00 PM`,
            activity: i === 22 ? 'Clock In' : i === 26 ? 'Break' : i === 30 ? 'Clock Out' : 'Work'
          })
        }
        break
      case 'fullday':
        for (let i = 9; i <= 18; i++) {
          hours.push({
            hour: i,
            display: i <= 12 ? `${i}:00 AM` : `${i-12}:00 PM`,
            activity: i === 9 ? 'Clock In' : i === 12 ? 'Lunch' : i === 15 ? 'Break' : i === 18 ? 'Clock Out' : 'Work'
          })
        }
        break
    }
    
    return hours
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shift Scheduler</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage employee shifts and schedules</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => {
                setViewMode('week')
                setSelectedPerson(null)
              }}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Day
            </button>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-emerald-700">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Shift</span>
            </button>
          </div>
        </div>
      </div>

      {/* Week Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">{selectedWeek}</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            Copy Last Week
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            Auto-Assign
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Coverage Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {coverageStats.map((stat, index) => (
          <motion.div
            key={stat.shift}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-xl p-3 sm:p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{stat.shift}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCoverageColor(stat.coverage)}`}>
                {stat.coverage}%
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{stat.assigned}</span>
              <span className="text-sm text-gray-500">/ {stat.required}</span>
            </div>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  stat.coverage >= 100 ? 'bg-green-500' : stat.coverage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(stat.coverage, 100)}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Main Schedule Grid */}
          <div className="xl:col-span-9">
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              {/* Days Header - Desktop Only */}
              <div className="hidden lg:grid grid-cols-8 bg-white border-b border-gray-200">
                <div className="p-4 border-r border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Employee</span>
                </div>
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                    <p className="text-sm font-semibold text-gray-900">{day.slice(0, 3)}</p>
                    <p className="text-xs text-gray-500 mt-1">Nov {20 + daysOfWeek.indexOf(day)}</p>
                  </div>
                ))}
              </div>

              {/* Mobile View - Card Layout */}
              <div className="lg:hidden p-4 space-y-3 bg-gray-50">
                {weeklySchedule.map((schedule, index) => (
                  <motion.div
                    key={schedule.employee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={schedule.employee.avatar}
                        alt={schedule.employee.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{schedule.employee.name}</p>
                        <p className="text-xs text-gray-500">{schedule.employee.role}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {daysOfWeek.map((day, idx) => {
                        const shiftId = schedule.shifts[day as keyof typeof schedule.shifts]
                        const shiftInfo = getShiftInfo(shiftId)
                        return (
                          <div key={day} className="text-center">
                            <p className="text-[10px] text-gray-500 mb-1">{day.slice(0, 3)}</p>
                            <p className="text-[9px] text-gray-400">{20 + idx}</p>
                            {shiftId ? (
                              <div className={`${getShiftColor(shiftId)} text-white rounded py-2 px-1 mt-1`}>
                                <p className="text-[10px] font-bold">{shiftInfo.name.charAt(0)}</p>
                                <p className="text-[8px] opacity-90">{shiftInfo.time.split('-')[0]}</p>
                              </div>
                            ) : (
                              <div className="bg-gray-100 text-gray-400 rounded py-2 px-1 mt-1">
                                <p className="text-[10px]">Off</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop View - Grid Layout */}
              <div className="hidden lg:block">
              {weeklySchedule.map((schedule, index) => (
                <motion.div
                  key={schedule.employee.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-8 border-b border-gray-200 hover:bg-white transition-colors"
                >
                  <div className="p-4 border-r border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
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
                  </div>
                  {daysOfWeek.map((day) => {
                    const shiftId = schedule.shifts[day as keyof typeof schedule.shifts]
                    const shiftInfo = getShiftInfo(shiftId)
                    return (
                      <div key={day} className="p-2 border-r border-gray-200 last:border-r-0">
                        {shiftId ? (
                          <button className={`w-full p-2 ${getShiftColor(shiftId)} text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity`}>
                            <p className="font-semibold">{shiftInfo.name}</p>
                            <p className="text-xs opacity-90 mt-0.5">{shiftInfo.time}</p>
                          </button>
                        ) : (
                          <button className="w-full p-2 bg-gray-100 text-gray-400 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                            Off
                          </button>
                        )}
                      </div>
                    )
                  })}
                </motion.div>
              ))}
              </div>

              {/* Total Hours Row - Desktop Only */}
              <div className="hidden lg:grid grid-cols-8 bg-white">
                <div className="p-4 border-r border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Coverage</span>
                </div>
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                    <div className="text-xs text-gray-600">
                      {getShiftCountForDay(day)} staff
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Hidden on mobile */}
          <div className="hidden xl:block xl:col-span-3 space-y-6">
            {/* Shift Requests */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Shift Requests</h3>
                <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                  2 Pending
                </span>
              </div>
              <div className="space-y-3">
                {shiftRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-xl p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.employee}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {request.type === 'swap' && `Swap: ${request.from} → ${request.to}`}
                          {request.type === 'leave' && `Leave: ${request.reason}`}
                          {request.type === 'overtime' && `Overtime: ${request.hours} hours`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{request.date}</p>
                      </div>
                      {request.status === 'pending' ? (
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {request.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift Types Legend */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shift Types</h3>
              <div className="space-y-3">
                {shiftTypes.map((shift) => {
                  const Icon = shift.icon
                  return (
                    <div key={shift.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${shift.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{shift.name}</p>
                          <p className="text-xs text-gray-500">{shift.time}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day View - Completely Redesigned */}
      {viewMode === 'day' && (
        <div className="space-y-6">
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {daysOfWeek.map((day, index) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedDay === day 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-300'
                }`}
              >
                {day.slice(0, 3)} {20 + index}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Employee List */}
            <div className="lg:col-span-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff on {selectedDay}</h3>
                <div className="space-y-2">
                  {weeklySchedule
                    .filter(schedule => schedule.shifts[selectedDay as keyof typeof schedule.shifts])
                    .map((schedule) => {
                      const shiftId = schedule.shifts[selectedDay as keyof typeof schedule.shifts]
                      const shiftInfo = getShiftInfo(shiftId)
                      const isSelected = selectedPerson === schedule.employee.id
                      
                      return (
                        <motion.button
                          key={schedule.employee.id}
                          onClick={() => setSelectedPerson(isSelected ? null : schedule.employee.id)}
                          className={`w-full text-left p-3 rounded-xl transition-all ${
                            isSelected 
                              ? 'bg-emerald-100 border-2 border-emerald-500' 
                              : 'bg-white border border-gray-200 hover:border-emerald-300'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={schedule.employee.avatar}
                                alt={schedule.employee.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{schedule.employee.name}</p>
                                <p className="text-xs text-gray-500">{schedule.employee.role}</p>
                              </div>
                            </div>
                            <div className={`px-3 py-1.5 ${getShiftColor(shiftId)} text-white rounded-lg`}>
                              <p className="text-xs font-medium">{shiftInfo.name}</p>
                              <p className="text-xs opacity-90">{shiftInfo.time}</p>
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                </div>
              </div>
            </div>

            {/* Person's Day Schedule */}
            <div className="lg:col-span-8">
              {selectedPerson ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl border border-gray-200"
                >
                  {/* Person Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      {(() => {
                        const person = weeklySchedule.find(s => s.employee.id === selectedPerson)
                        const shiftId = person?.shifts[selectedDay as keyof typeof person.shifts]
                        const shiftInfo = getShiftInfo(shiftId || null)
                        const Icon = shiftTypes.find(s => s.id === shiftId)?.icon || Clock
                        
                        return (
                          <>
                            <div className={`w-16 h-16 ${getShiftColor(shiftId || null)} rounded-2xl flex items-center justify-center`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{person?.employee.name}</h3>
                              <p className="text-gray-600">{person?.employee.role} • {selectedDay}</p>
                              <p className="text-sm text-gray-500 mt-1">{shiftInfo.name} Shift: {shiftInfo.time}</p>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Hourly Schedule */}
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Schedule Timeline</h4>
                    <div className="space-y-3">
                      {getHourlySchedule(selectedPerson, selectedDay).map((hour, index) => (
                        <motion.div
                          key={hour.hour}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-4 p-3 rounded-xl ${
                            hour.activity === 'Clock In' || hour.activity === 'Clock Out' 
                              ? 'bg-emerald-50 border border-emerald-200' 
                              : hour.activity === 'Break' || hour.activity === 'Lunch' || hour.activity === 'Dinner'
                              ? 'bg-blue-50 border border-blue-200'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="w-20 text-right">
                            <span className="text-sm font-medium text-gray-900">{hour.display}</span>
                          </div>
                          <div className="w-px h-8 bg-gray-300" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {hour.activity === 'Clock In' || hour.activity === 'Clock Out' ? (
                                <Clock className="w-4 h-4 text-emerald-600" />
                              ) : hour.activity === 'Break' || hour.activity === 'Lunch' || hour.activity === 'Dinner' ? (
                                <Coffee className="w-4 h-4 text-blue-600" />
                              ) : (
                                <User className="w-4 h-4 text-gray-600" />
                              )}
                              <span className="text-sm font-medium text-gray-900">{hour.activity}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-12 text-center">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Staff Member</h3>
                  <p className="text-gray-600">Choose someone from the staff list to view their detailed schedule for {selectedDay}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShiftScheduler