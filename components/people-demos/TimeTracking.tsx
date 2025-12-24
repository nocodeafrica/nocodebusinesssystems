'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock,
  LogIn,
  LogOut,
  Coffee,
  Calendar,
  TrendingUp,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Timer,
  BarChart3,
  Target,
  Award
} from 'lucide-react'

// Current time tracking data
const currentSession = {
  clockInTime: '09:15 AM',
  currentTime: new Date(),
  totalHours: '5:42',
  breaksTaken: 1,
  breakTime: '00:45',
  productiveTime: '4:57',
  status: 'active'
}

// Today's timeline
const todayTimeline = [
  { time: '09:15 AM', event: 'Clocked In', type: 'clock-in', location: 'Main Office' },
  { time: '10:30 AM', event: 'Meeting - Project Review', type: 'meeting', duration: '45 min' },
  { time: '12:00 PM', event: 'Break Started', type: 'break-start', duration: '45 min' },
  { time: '12:45 PM', event: 'Break Ended', type: 'break-end' },
  { time: '02:30 PM', event: 'Meeting - Client Call', type: 'meeting', duration: '30 min' },
  { time: '03:45 PM', event: 'Task Completed', type: 'task', task: 'Dashboard Design' }
]

// Team attendance
const teamAttendance = [
  { id: 1, name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=1', status: 'online', clockIn: '09:00 AM', hours: '6:15' },
  { id: 2, name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?img=3', status: 'online', clockIn: '09:30 AM', hours: '5:45' },
  { id: 3, name: 'Emily Rodriguez', avatar: 'https://i.pravatar.cc/150?img=5', status: 'break', clockIn: '08:45 AM', hours: '6:30' },
  { id: 4, name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?img=8', status: 'offline', clockIn: '--:--', hours: '0:00' },
  { id: 5, name: 'Lisa Thompson', avatar: 'https://i.pravatar.cc/150?img=9', status: 'online', clockIn: '09:15 AM', hours: '6:00' },
  { id: 6, name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=11', status: 'online', clockIn: '08:30 AM', hours: '6:45' }
]

// Weekly stats
const weeklyStats = [
  { day: 'Mon', hours: 8.5, target: 8 },
  { day: 'Tue', hours: 7.8, target: 8 },
  { day: 'Wed', hours: 9.2, target: 8 },
  { day: 'Thu', hours: 8.0, target: 8 },
  { day: 'Fri', hours: 5.7, target: 8 },
  { day: 'Sat', hours: 0, target: 0 },
  { day: 'Sun', hours: 0, target: 0 }
]

const TimeTracking = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [manualClockIn, setManualClockIn] = useState<boolean | null>(null)
  const [isOnBreak, setIsOnBreak] = useState(false)
  
  // Shift times
  const shiftStart = new Date()
  shiftStart.setHours(9, 0, 0, 0)
  
  const shiftEnd = new Date()
  shiftEnd.setHours(18, 0, 0, 0) // 6pm
  
  // Determine if user is clocked in based on time and manual override
  const isBeforeShift = currentTime < shiftStart
  const isAfterShift = currentTime > shiftEnd
  const isDuringShift = !isBeforeShift && !isAfterShift
  
  // If user manually clocked in/out, use that. Otherwise, use time-based logic
  const isClockedIn = manualClockIn !== null ? manualClockIn : isDuringShift
  
  // Calculate hours worked
  const calculateHoursWorked = () => {
    if (!isClockedIn && manualClockIn !== true) return 0
    
    let startTime = shiftStart
    if (isBeforeShift && manualClockIn === true) {
      // If manually clocked in before shift, start from now
      startTime = currentTime
      return 0 // Just clocked in
    } else if (isDuringShift || isAfterShift) {
      // During or after shift, calculate from 9am
      startTime = shiftStart
    }
    
    const endTime = isAfterShift ? shiftEnd : currentTime
    const diff = endTime.getTime() - startTime.getTime()
    const hours = Math.max(0, diff / (1000 * 60 * 60))
    return hours
  }
  
  const hoursWorked = calculateHoursWorked()
  const hoursDisplay = `${Math.floor(hoursWorked)}:${String(Math.floor((hoursWorked % 1) * 60)).padStart(2, '0')}`
  
  // Calculate time until shift or end of shift
  const calculateTimeUntil = () => {
    if (isBeforeShift) {
      const diff = shiftStart.getTime() - currentTime.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return { hours, minutes, isUntilShift: true }
    } else if (isDuringShift) {
      const diff = shiftEnd.getTime() - currentTime.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return { hours, minutes, isUntilShift: false }
    }
    return null
  }
  
  const timeUntil = calculateTimeUntil()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleClockIn = () => {
    setManualClockIn(true)
    setIsOnBreak(false)
  }

  const handleClockOut = () => {
    setManualClockIn(false)
    setIsOnBreak(false)
  }

  const handleBreak = () => {
    setIsOnBreak(!isOnBreak)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-green-500'
      case 'break': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'clock-in': return <LogIn className="w-4 h-4 text-green-600" />
      case 'clock-out': return <LogOut className="w-4 h-4 text-red-600" />
      case 'break-start': return <Coffee className="w-4 h-4 text-yellow-600" />
      case 'break-end': return <Coffee className="w-4 h-4 text-blue-600" />
      case 'meeting': return <Users className="w-4 h-4 text-purple-600" />
      case 'task': return <CheckCircle className="w-4 h-4 text-green-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Time & Attendance</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Track your work hours and attendance</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Time</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Date</p>
            <p className="text-base md:text-lg font-medium text-gray-700">
              {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
        {/* Left Column - Clock In/Out Panel */}
        <div className="xl:col-span-4">
          {/* Clock Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white mb-4 md:mb-6"
          >
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Clock className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                {isBeforeShift && !isClockedIn ? (
                  'Your shift starts at 9:00 AM'
                ) : isClockedIn ? (
                  'You are clocked in'
                ) : (
                  'You are clocked out'
                )}
              </h3>
              {isBeforeShift && !isClockedIn && timeUntil && (
                <div className="space-y-1">
                  <p className="text-2xl md:text-3xl font-bold">
                    {timeUntil.hours}h {timeUntil.minutes}m
                  </p>
                  <p className="text-sm opacity-90">until your shift</p>
                </div>
              )}
              {isClockedIn && (
                <div className="space-y-1">
                  <p className="text-sm opacity-90">
                    {manualClockIn === true && isBeforeShift 
                      ? 'Just clocked in' 
                      : `Started at ${isDuringShift || isAfterShift ? '9:00 AM' : 'now'}`}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold">{hoursDisplay}</p>
                  <p className="text-sm opacity-90">hours worked today</p>
                  {isDuringShift && timeUntil && (
                    <p className="text-xs opacity-75 mt-2">
                      {timeUntil.hours}h {timeUntil.minutes}m remaining
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isClockedIn ? (
                <button
                  onClick={handleClockIn}
                  className="w-full py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Clock In
                </button>
              ) : (
                <>
                  <button
                    onClick={handleBreak}
                    className="w-full py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Coffee className="w-5 h-5" />
                    {isOnBreak ? 'End Break' : 'Start Break'}
                  </button>
                  <button
                    onClick={handleClockOut}
                    className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Clock Out
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Today's Stats */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Time</span>
                <span className="text-sm font-semibold text-gray-900">{hoursDisplay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Productive Time</span>
                <span className="text-sm font-semibold text-gray-900">{hoursDisplay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Break Time</span>
                <span className="text-sm font-semibold text-gray-900">0:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Breaks Taken</span>
                <span className="text-sm font-semibold text-gray-900">0</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Overtime</span>
                  <span className="text-sm font-bold text-green-600">
                    {hoursWorked > 8 ? `+${Math.floor(hoursWorked - 8)}:${String(Math.floor(((hoursWorked - 8) % 1) * 60)).padStart(2, '0')}` : '0:00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Timeline */}
        <div className="xl:col-span-4">
          <div className="bg-gray-50 rounded-2xl p-4 md:p-6 h-full">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Today's Timeline</h3>
            <div className="space-y-3 md:space-y-4 max-h-[400px] md:max-h-[500px] overflow-y-auto">
              {todayTimeline.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 md:gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs md:text-sm font-medium text-gray-900">{event.event}</p>
                    <p className="text-xs text-gray-500">{event.time}</p>
                    {event.duration && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        {event.duration}
                      </span>
                    )}
                    {event.location && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {event.location}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Team & Stats */}
        <div className="xl:col-span-4 space-y-4 md:space-y-6">
          {/* Team Attendance */}
          <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Team Attendance</h3>
              <span className="text-xs md:text-sm text-gray-500">6 members</span>
            </div>
            <div className="space-y-2 md:space-y-3">
              {teamAttendance.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">
                        {member.status === 'offline' ? 'Not clocked in' : `Since ${member.clockIn}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-700">{member.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Hours Chart */}
          <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Weekly Hours</h3>
            <div className="space-y-2 md:space-y-3">
              {weeklyStats.map((day, index) => (
                <div key={day.day}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs md:text-sm font-medium text-gray-700">{day.day}</span>
                    <span className="text-xs md:text-sm text-gray-900">{day.hours}h</span>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.hours / 10) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`absolute left-0 top-0 h-full rounded-full ${
                        day.hours >= day.target ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    />
                    {day.target > 0 && (
                      <div
                        className="absolute top-0 h-full w-0.5 bg-gray-400"
                        style={{ left: `${(day.target / 10) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-medium text-gray-700">Total This Week</span>
                <span className="text-base md:text-lg font-bold text-gray-900">39.2 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeTracking