'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bed, Users, Clock, AlertCircle, CheckCircle, 
  Wifi, Coffee, Car, Sparkles, UserCheck,
  TrendingUp, DollarSign, Calendar, MapPin,
  Key, Phone, Settings, BarChart3, ArrowLeft,
  X, ChevronRight, Filter, Search, MoreVertical
} from 'lucide-react'

// Room status types
type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved'

// Room data - same as desktop version
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

const HotelCommandMobile = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'floors' | 'staff' | 'rooms'>('overview')
  const [selectedFloor, setSelectedFloor] = useState<number>(5)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'all'>('all')

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

  const getStatusText = (status: RoomStatus) => {
    switch(status) {
      case 'available': return 'Available'
      case 'occupied': return 'Occupied'
      case 'cleaning': return 'Cleaning'
      case 'maintenance': return 'Maintenance'
      case 'reserved': return 'Reserved'
      default: return 'Unknown'
    }
  }

  // Get all rooms for room list view
  const allRooms = hotelFloors.flatMap(floor => 
    floor.rooms.map(room => ({ ...room, floor: floor.floor }))
  ).filter(room => filterStatus === 'all' || room.status === filterStatus)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Hotel Command</h2>
              <p className="text-xs text-gray-500">Real-time operations center</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-gray-100 rounded-lg"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 bg-blue-600 text-white rounded-lg">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'floors', label: 'Floors', icon: Bed },
              { key: 'staff', label: 'Staff', icon: Users },
              { key: 'rooms', label: 'Rooms', icon: Key }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-all ${
                    activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-3 h-3 mx-auto mb-1" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-gray-200"
            >
              <div className="p-4 bg-gray-50">
                <div className="flex gap-2 overflow-x-auto">
                  {['all', 'available', 'occupied', 'cleaning', 'maintenance', 'reserved'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filterStatus === status 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900">{liveMetrics.occupancy}%</p>
                    <p className="text-xs text-gray-500">Occupancy</p>
                  </div>
                  <Bed className="w-6 h-6 text-blue-500" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900">R{(liveMetrics.revenue / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900">{liveMetrics.todayCheckIns}</p>
                    <p className="text-xs text-gray-500">Check-ins</p>
                  </div>
                  <UserCheck className="w-6 h-6 text-orange-500" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-3 border border-purple-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900">{liveMetrics.satisfaction}</p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                </div>
              </motion.div>
            </div>

            {/* Floor Summary */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Floor Summary</h3>
              <div className="space-y-3">
                {hotelFloors.map((floor) => {
                  const available = floor.rooms.filter(r => r.status === 'available').length
                  const occupied = floor.rooms.filter(r => r.status === 'occupied').length
                  const cleaning = floor.rooms.filter(r => r.status === 'cleaning').length
                  const maintenance = floor.rooms.filter(r => r.status === 'maintenance').length
                  
                  return (
                    <div key={floor.floor} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Floor {floor.floor}</p>
                        <p className="text-xs text-gray-500">{floor.rooms.length} rooms</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-xs text-gray-600">{available}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-xs text-gray-600">{occupied}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          <span className="text-xs text-gray-600">{cleaning}</span>
                        </div>
                        {maintenance > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-xs text-gray-600">{maintenance}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Floors Tab */}
        {activeTab === 'floors' && (
          <div className="space-y-4">
            {/* Floor Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {hotelFloors.map((floor) => (
                <button
                  key={floor.floor}
                  onClick={() => setSelectedFloor(floor.floor)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFloor === floor.floor 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-700'
                  }`}
                >
                  Floor {floor.floor}
                </button>
              ))}
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-4 gap-2">
              {hotelFloors.find(f => f.floor === selectedFloor)?.rooms.map((room) => (
                <motion.button
                  key={room.number}
                  onClick={() => setSelectedRoom(room)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative aspect-square rounded-lg p-2 text-white transition-all ${getRoomStatusColor(room.status)}`}
                >
                  <div className="absolute top-1 left-1">
                    {getRoomStatusIcon(room.status)}
                  </div>
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-sm font-bold">{room.number}</p>
                    <p className="text-xs opacity-90">{room.type}</p>
                  </div>
                  {room.status === 'cleaning' && room.progress && (
                    <div className="absolute bottom-1 left-1 right-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all"
                        style={{ width: `${room.progress}%` }}
                      />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <div className="space-y-3">
            {housekeepingStaff.map((staff) => (
              <div key={staff.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                    <p className="text-xs text-gray-500">Floor {staff.floor} • Room {staff.currentRoom}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{staff.efficiency}%</p>
                    <p className="text-xs text-gray-500">Efficiency</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{staff.roomsCleaned} rooms cleaned</span>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${staff.efficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="space-y-3">
            {allRooms.map((room) => (
              <motion.div
                key={room.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${getRoomStatusColor(room.status)}`}>
                      <span className="text-sm font-bold">{room.number}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Room {room.number}</p>
                      <p className="text-xs text-gray-500">Floor {room.floor} • {room.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      room.status === 'available' ? 'bg-green-100 text-green-700' :
                      room.status === 'occupied' ? 'bg-blue-100 text-blue-700' :
                      room.status === 'cleaning' ? 'bg-yellow-100 text-yellow-700' :
                      room.status === 'maintenance' ? 'bg-red-100 text-red-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {getStatusText(room.status)}
                    </span>
                  </div>
                </div>
                
                {room.guest && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-900">{room.guest}</p>
                    {room.checkOut && <p className="text-xs text-gray-500">Check-out: {room.checkOut}</p>}
                    {room.checkIn && <p className="text-xs text-gray-500">Check-in: {room.checkIn}</p>}
                  </div>
                )}
                
                {room.issue && (
                  <div className="mt-2 p-2 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-700">Issue: {room.issue}</p>
                  </div>
                )}
                
                {room.progress && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Cleaning Progress</span>
                      <span className="text-xs font-medium text-gray-900">{room.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full transition-all"
                        style={{ width: `${room.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Room Detail Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Room {selectedRoom.number}</h3>
                <button onClick={() => setSelectedRoom(null)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${getRoomStatusColor(selectedRoom.status)}`}>
                    {getRoomStatusIcon(selectedRoom.status)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedRoom.type} Room</p>
                    <p className="text-sm text-gray-500">{getStatusText(selectedRoom.status)}</p>
                  </div>
                </div>
                
                {selectedRoom.guest && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Guest Information</h4>
                    <p className="text-sm text-gray-700">{selectedRoom.guest}</p>
                    {selectedRoom.checkOut && <p className="text-xs text-gray-500 mt-1">Check-out: {selectedRoom.checkOut}</p>}
                    {selectedRoom.checkIn && <p className="text-xs text-gray-500 mt-1">Check-in: {selectedRoom.checkIn}</p>}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium">
                    Update Status
                  </button>
                  <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HotelCommandMobile