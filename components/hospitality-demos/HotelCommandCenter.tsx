'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bed, Users, Clock, AlertCircle, CheckCircle, 
  Wifi, Coffee, Car, Sparkles, UserCheck,
  TrendingUp, DollarSign, Calendar, MapPin,
  Key, Phone, Settings, BarChart3
} from 'lucide-react'

// Room status types
type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved'

// Room data
const hotelFloors = [
  {
    floor: 5,
    rooms: [
      { number: 501, status: 'occupied' as RoomStatus, guest: 'M. Ndlovu', checkOut: 'Today 11am', type: 'Suite' },
      { number: 502, status: 'cleaning' as RoomStatus, progress: 65, type: 'Deluxe' },
      { number: 503, status: 'available' as RoomStatus, type: 'Deluxe' },
      { number: 504, status: 'occupied' as RoomStatus, guest: 'S. Van Der Merwe', checkOut: 'Tomorrow', type: 'Suite' },
      { number: 505, status: 'maintenance' as RoomStatus, issue: 'AC repair', type: 'Deluxe' },
      { number: 506, status: 'reserved' as RoomStatus, guest: 'P. Khumalo', checkIn: 'Today 3pm', type: 'Deluxe' },
      { number: 507, status: 'occupied' as RoomStatus, guest: 'T. Smith', checkOut: 'Today 12pm', type: 'Suite' },
      { number: 508, status: 'available' as RoomStatus, type: 'Standard' },
    ]
  },
  {
    floor: 4,
    rooms: [
      { number: 401, status: 'available' as RoomStatus, type: 'Standard' },
      { number: 402, status: 'occupied' as RoomStatus, guest: 'L. Mokoena', checkOut: 'Tomorrow', type: 'Deluxe' },
      { number: 403, status: 'cleaning' as RoomStatus, progress: 30, type: 'Standard' },
      { number: 404, status: 'occupied' as RoomStatus, guest: 'R. Pillay', checkOut: 'Today 2pm', type: 'Deluxe' },
      { number: 405, status: 'available' as RoomStatus, type: 'Standard' },
      { number: 406, status: 'occupied' as RoomStatus, guest: 'K. Botha', checkOut: 'In 3 days', type: 'Deluxe' },
      { number: 407, status: 'reserved' as RoomStatus, guest: 'J. Naidoo', checkIn: 'Today 5pm', type: 'Standard' },
      { number: 408, status: 'cleaning' as RoomStatus, progress: 90, type: 'Standard' },
    ]
  },
  {
    floor: 3,
    rooms: [
      { number: 301, status: 'occupied' as RoomStatus, guest: 'A. Zulu', checkOut: 'Tomorrow', type: 'Deluxe' },
      { number: 302, status: 'available' as RoomStatus, type: 'Standard' },
      { number: 303, status: 'maintenance' as RoomStatus, issue: 'Plumbing', type: 'Standard' },
      { number: 304, status: 'occupied' as RoomStatus, guest: 'C. Venter', checkOut: 'Today 10am', type: 'Deluxe' },
      { number: 305, status: 'cleaning' as RoomStatus, progress: 45, type: 'Standard' },
      { number: 306, status: 'available' as RoomStatus, type: 'Standard' },
      { number: 307, status: 'occupied' as RoomStatus, guest: 'N. Mbeki', checkOut: 'In 2 days', type: 'Deluxe' },
      { number: 308, status: 'reserved' as RoomStatus, guest: 'D. Du Plessis', checkIn: 'Tomorrow', type: 'Standard' },
    ]
  },
  {
    floor: 2,
    rooms: [
      { number: 201, status: 'available' as RoomStatus, type: 'Standard' },
      { number: 202, status: 'occupied' as RoomStatus, guest: 'F. Mthembu', checkOut: 'Tomorrow', type: 'Standard' },
      { number: 203, status: 'occupied' as RoomStatus, guest: 'G. Williams', checkOut: 'Today 1pm', type: 'Standard' },
      { number: 204, status: 'cleaning' as RoomStatus, progress: 75, type: 'Standard' },
      { number: 205, status: 'available' as RoomStatus, type: 'Standard' },
      { number: 206, status: 'occupied' as RoomStatus, guest: 'H. Patel', checkOut: 'In 2 days', type: 'Standard' },
      { number: 207, status: 'reserved' as RoomStatus, guest: 'I. Johnson', checkIn: 'Today 4pm', type: 'Standard' },
      { number: 208, status: 'available' as RoomStatus, type: 'Standard' },
    ]
  },
  {
    floor: 1,
    rooms: [
      { number: 101, status: 'occupied' as RoomStatus, guest: 'J. Brown', checkOut: 'Today 11am', type: 'Standard' },
      { number: 102, status: 'cleaning' as RoomStatus, progress: 20, type: 'Standard' },
      { number: 103, status: 'available' as RoomStatus, type: 'Standard' },
      { number: 104, status: 'occupied' as RoomStatus, guest: 'K. Singh', checkOut: 'Tomorrow', type: 'Standard' },
      { number: 105, status: 'available' as RoomStatus, type: 'Standard' },
      { number: 106, status: 'maintenance' as RoomStatus, issue: 'Electrical', type: 'Standard' },
      { number: 107, status: 'occupied' as RoomStatus, guest: 'L. Adams', checkOut: 'Today 3pm', type: 'Standard' },
      { number: 108, status: 'reserved' as RoomStatus, guest: 'M. Davis', checkIn: 'Today 6pm', type: 'Standard' },
    ]
  }
]

// Housekeeping staff
const housekeepingStaff = [
  { id: 1, name: 'Sarah M.', floor: 5, roomsCleaned: 3, currentRoom: 502, efficiency: 92 },
  { id: 2, name: 'John K.', floor: 4, roomsCleaned: 4, currentRoom: 403, efficiency: 88 },
  { id: 3, name: 'Mary N.', floor: 3, roomsCleaned: 2, currentRoom: 305, efficiency: 95 },
  { id: 4, name: 'Peter L.', floor: 4, roomsCleaned: 3, currentRoom: 408, efficiency: 85 },
  { id: 5, name: 'Lisa T.', floor: 2, roomsCleaned: 3, currentRoom: 204, efficiency: 90 },
  { id: 6, name: 'David R.', floor: 1, roomsCleaned: 2, currentRoom: 102, efficiency: 87 },
]

// Live metrics
const liveMetrics = {
  occupancy: 68,
  avgStayDuration: 2.3,
  todayCheckIns: 12,
  todayCheckOuts: 8,
  revenue: 125400,
  satisfaction: 4.6
}

const HotelCommandCenter = () => {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>(5)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [animatedOccupancy, setAnimatedOccupancy] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedOccupancy(liveMetrics.occupancy)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const getRoomStatusColor = (status: RoomStatus) => {
    switch(status) {
      case 'available': return 'bg-green-500'
      case 'occupied': return 'bg-blue-500'
      case 'cleaning': return 'bg-yellow-500'
      case 'maintenance': return 'bg-red-500'
      case 'reserved': return 'bg-purple-500'
      default: return 'bg-gray-400'
    }
  }

  const getRoomStatusIcon = (status: RoomStatus) => {
    switch(status) {
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'occupied': return <Users className="w-4 h-4" />
      case 'cleaning': return <Sparkles className="w-4 h-4" />
      case 'maintenance': return <Settings className="w-4 h-4" />
      case 'reserved': return <Calendar className="w-4 h-4" />
      default: return <Bed className="w-4 h-4" />
    }
  }

  const currentFloor = selectedFloor === 'all' ? null : hotelFloors.find(f => f.floor === selectedFloor)

  const renderRoomGrid = (rooms: any[], floorNumber?: number) => (
    <div className="grid grid-cols-4 gap-3">
      {rooms.map((room, index) => (
        <motion.div
          key={room.number}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => setSelectedRoom(room)}
          className={`relative p-4 rounded-xl cursor-pointer transition-all hover:scale-105 ${getRoomStatusColor(room.status)} ${room.status === 'available' ? 'opacity-60' : ''}`}
        >
          <div className="text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">{room.number}</span>
              {getRoomStatusIcon(room.status)}
            </div>
            <p className="text-xs opacity-90">{room.type}</p>
            {room.guest && (
              <p className="text-xs mt-1 font-medium">{room.guest}</p>
            )}
            {room.progress && (
              <div className="mt-2">
                <div className="h-1 bg-white/30 rounded">
                  <div 
                    className="h-1 bg-white rounded"
                    style={{ width: `${room.progress}%` }}
                  />
                </div>
                <p className="text-xs mt-1">{room.progress}% cleaned</p>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Hotel Command Center</h2>
          <p className="text-sm text-gray-600 mt-1">Sun City Resort - Main Tower</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-sm text-gray-600">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-green-600 font-medium">+5%</span>
          </div>
          <div className="relative h-20">
            <svg className="w-full h-full">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray={`${animatedOccupancy * 2.2} 220`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                className="transition-all duration-1000"
              />
              <text x="40" y="45" textAnchor="middle" className="text-xl font-bold fill-gray-900">
                {animatedOccupancy}%
              </text>
            </svg>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">Occupancy Rate</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{liveMetrics.todayCheckIns}</p>
          <p className="text-xs text-gray-500">Check-ins Today</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Key className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{liveMetrics.todayCheckOuts}</p>
          <p className="text-xs text-gray-500">Check-outs Today</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{liveMetrics.avgStayDuration}</p>
          <p className="text-xs text-gray-500">Avg Stay (days)</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-4 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">+12%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">R{(liveMetrics.revenue / 1000).toFixed(0)}k</p>
          <p className="text-xs text-gray-500">Today's Revenue</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-4 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">⭐ {liveMetrics.satisfaction}</p>
          <p className="text-xs text-gray-500">Guest Rating</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Floor Plan */}
        <div className="col-span-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            {/* Floor Selector */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Floor Plan View</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFloor('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFloor === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Floors
                </button>
                {[5, 4, 3, 2, 1].map(floor => (
                  <button
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFloor === floor
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Floor {floor}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Grid */}
            {selectedFloor === 'all' ? (
              <div className="space-y-6">
                {hotelFloors.map((floor) => (
                  <div key={floor.floor} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Floor {floor.floor}</h4>
                    {renderRoomGrid(floor.rooms, floor.floor)}
                  </div>
                ))}
              </div>
            ) : (
              currentFloor && renderRoomGrid(currentFloor.rooms, currentFloor.floor)
            )}

            {/* Status Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
              {[
                { status: 'available', label: 'Available' },
                { status: 'occupied', label: 'Occupied' },
                { status: 'cleaning', label: 'Cleaning' },
                { status: 'maintenance', label: 'Maintenance' },
                { status: 'reserved', label: 'Reserved' }
              ].map(item => (
                <div key={item.status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getRoomStatusColor(item.status as RoomStatus)}`} />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Housekeeping Status */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Housekeeping Staff</h3>
            <div className="space-y-3">
              {housekeepingStaff.map((staff) => (
                <motion.div
                  key={staff.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">Floor {staff.floor} • Room {staff.currentRoom}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{staff.roomsCleaned} done</p>
                    <p className="text-xs text-green-600">{staff.efficiency}% eff</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Selected Room Details */}
          {selectedRoom && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Room {selectedRoom.number} Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getRoomStatusColor(selectedRoom.status)}`}>
                    {selectedRoom.status.charAt(0).toUpperCase() + selectedRoom.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="text-sm font-medium text-gray-900">{selectedRoom.type}</span>
                </div>
                {selectedRoom.guest && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Guest</span>
                    <span className="text-sm font-medium text-gray-900">{selectedRoom.guest}</span>
                  </div>
                )}
                {selectedRoom.checkOut && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Check-out</span>
                    <span className="text-sm font-medium text-orange-600">{selectedRoom.checkOut}</span>
                  </div>
                )}
                {selectedRoom.checkIn && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Check-in</span>
                    <span className="text-sm font-medium text-green-600">{selectedRoom.checkIn}</span>
                  </div>
                )}
                {selectedRoom.issue && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Issue</span>
                    <span className="text-sm font-medium text-red-600">{selectedRoom.issue}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Alerts */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Room 505 AC Malfunction</p>
                  <p className="text-xs text-gray-500">Maintenance dispatched • 15 min ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Late Check-out Request</p>
                  <p className="text-xs text-gray-500">Room 304 • Pending approval</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelCommandCenter