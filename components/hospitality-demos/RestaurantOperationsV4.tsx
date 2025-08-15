'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UtensilsCrossed, Clock, Users, DollarSign, 
  Crown, Star, Timer, ChefHat, Utensils,
  MapPin, Phone, MessageSquare, CheckCircle2,
  AlertCircle, Calendar, TrendingUp, Filter
} from 'lucide-react'

type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'bill'

interface Customer {
  name: string
  phone: string
  partySize: number
  vip: boolean
  mood: 'happy' | 'neutral' | 'waiting' | 'urgent'
  arrivalTime: string
  orders: string[]
  totalSpent: number
  specialRequests?: string
  timeSeated: string
}

interface Table {
  id: string
  number: number
  seats: number
  status: TableStatus
  section: string
  customer?: Customer
  estimatedTurnTime?: string
  lastCleaned?: string
}

const RestaurantOperationsV4 = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | TableStatus>('all')
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Sample restaurant data
  const [tables] = useState<Table[]>([
    {
      id: '1', number: 1, seats: 2, status: 'occupied', section: 'Window',
      customer: {
        name: 'Sarah & Mike', phone: '+27-82-123-4567', partySize: 2, vip: true,
        mood: 'happy', arrivalTime: '7:30 PM', timeSeated: '45 min ago',
        orders: ['Ribeye Steak', 'Salmon Fillet', 'House Wine'], totalSpent: 850,
        specialRequests: 'Celebrating anniversary'
      },
      estimatedTurnTime: '20 min'
    },
    {
      id: '2', number: 2, seats: 4, status: 'reserved', section: 'VIP',
      customer: {
        name: 'The Johnsons', phone: '+27-71-987-6543', partySize: 4, vip: true,
        mood: 'neutral', arrivalTime: '8:00 PM', timeSeated: 'Reserved',
        orders: [], totalSpent: 0,
        specialRequests: 'Birthday celebration - need highchair'
      }
    },
    {
      id: '3', number: 3, seats: 6, status: 'occupied', section: 'Garden',
      customer: {
        name: 'Corporate Group', phone: '+27-11-555-0123', partySize: 6, vip: false,
        mood: 'waiting', arrivalTime: '7:15 PM', timeSeated: '1h 10min ago',
        orders: ['Business Lunch Menu x6', 'Wine Selection'], totalSpent: 1240,
        specialRequests: 'Need WiFi password'
      },
      estimatedTurnTime: '15 min'
    },
    {
      id: '4', number: 4, seats: 2, status: 'bill', section: 'Patio',
      customer: {
        name: 'Emma Watson', phone: '+27-83-456-7890', partySize: 2, vip: false,
        mood: 'neutral', arrivalTime: '7:45 PM', timeSeated: '30 min ago',
        orders: ['Caesar Salad', 'Grilled Chicken', 'Dessert'], totalSpent: 420
      }
    },
    {
      id: '5', number: 5, seats: 8, status: 'cleaning', section: 'Main Hall',
      lastCleaned: '5 min ago'
    },
    {
      id: '6', number: 6, seats: 4, status: 'available', section: 'Window'
    },
    {
      id: '7', number: 7, seats: 2, status: 'occupied', section: 'Bar Area',
      customer: {
        name: 'Date Night', phone: '+27-84-321-9876', partySize: 2, vip: false,
        mood: 'happy', arrivalTime: '8:15 PM', timeSeated: '15 min ago',
        orders: ['Cocktails', 'Sharing Platter'], totalSpent: 320
      },
      estimatedTurnTime: '1h 30min'
    },
    {
      id: '8', number: 8, seats: 6, status: 'reserved', section: 'VIP',
      customer: {
        name: 'VIP Booking', phone: '+27-72-111-2222', partySize: 6, vip: true,
        mood: 'neutral', arrivalTime: '8:30 PM', timeSeated: 'Reserved',
        orders: [], totalSpent: 0,
        specialRequests: 'Dietary restrictions - gluten free'
      }
    }
  ])

  const getStatusColor = (status: TableStatus) => {
    switch(status) {
      case 'available': return 'bg-emerald-500'
      case 'occupied': return 'bg-blue-500'
      case 'reserved': return 'bg-purple-500'
      case 'cleaning': return 'bg-amber-500'
      case 'bill': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: TableStatus) => {
    switch(status) {
      case 'available': return 'Available'
      case 'occupied': return 'Occupied'
      case 'reserved': return 'Reserved'
      case 'cleaning': return 'Cleaning'
      case 'bill': return 'Ready to Pay'
      default: return 'Unknown'
    }
  }

  const getMoodEmoji = (mood: string) => {
    switch(mood) {
      case 'happy': return '😊'
      case 'neutral': return '😐'
      case 'waiting': return '⏰'
      case 'urgent': return '🚨'
      default: return '😐'
    }
  }

  const filteredTables = tables.filter(table => {
    const matchesFilter = selectedFilter === 'all' || table.status === selectedFilter
    const matchesSearch = searchTerm === '' || 
      table.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.number.toString().includes(searchTerm) ||
      table.section.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Stats
  const totalTables = tables.length
  const occupiedTables = tables.filter(t => t.status === 'occupied').length
  const totalRevenue = tables.reduce((sum, table) => sum + (table.customer?.totalSpent || 0), 0)
  const avgTurnTime = "42 min"

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Le Jardin Restaurant</h1>
            <p className="text-gray-600">Premium Table Management System</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round((occupiedTables/totalTables)*100)}%</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">R{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Turn Time</p>
                <p className="text-2xl font-bold text-gray-900">{avgTurnTime}</p>
              </div>
              <Timer className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Tables</p>
                <p className="text-2xl font-bold text-gray-900">{occupiedTables}/{totalTables}</p>
              </div>
              <Utensils className="w-8 h-8 text-amber-500" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">Filter:</span>
            </div>
            {['all', 'available', 'occupied', 'reserved', 'cleaning', 'bill'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter === filter
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter === 'all' ? 'All Tables' : getStatusText(filter as TableStatus)}
                {filter !== 'all' && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">
                    {tables.filter(t => t.status === filter).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by table number, customer name, or section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Table Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTables.map((table) => (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedTable(table)}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Utensils className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            Table {table.number}
                            {table.customer?.vip && <Crown className="w-4 h-4 text-yellow-500" />}
                          </h3>
                          <p className="text-sm text-gray-500">{table.seats} seats • {table.section}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(table.status)}`}>
                        {getStatusText(table.status)}
                      </div>
                    </div>

                    {/* Customer Info or Status */}
                    {table.customer ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getMoodEmoji(table.customer.mood)}</div>
                          <div>
                            <p className="font-medium text-gray-900">{table.customer.name}</p>
                            <p className="text-sm text-gray-500">Party of {table.customer.partySize}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Seated: {table.customer.timeSeated}</span>
                          <span className="font-medium text-gray-900">R{table.customer.totalSpent}</span>
                        </div>

                        {table.estimatedTurnTime && (
                          <div className="flex items-center gap-2 text-sm text-amber-600">
                            <Clock className="w-4 h-4" />
                            Est. {table.estimatedTurnTime} remaining
                          </div>
                        )}

                        {table.customer.specialRequests && (
                          <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
                            {table.customer.specialRequests}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        {table.status === 'cleaning' ? (
                          <div className="text-amber-600">
                            <ChefHat className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">Being cleaned</p>
                            {table.lastCleaned && <p className="text-xs text-gray-500">Last: {table.lastCleaned}</p>}
                          </div>
                        ) : table.status === 'available' ? (
                          <div className="text-green-600">
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">Ready for guests</p>
                          </div>
                        ) : (
                          <div className="text-purple-600">
                            <Calendar className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">Reserved</p>
                            {table.customer && <p className="text-xs">for {(table.customer as Customer).arrivalTime}</p>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedTable ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Table {selectedTable.number} Details</h3>
                  <button
                    onClick={() => setSelectedTable(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>

                {selectedTable.customer ? (
                  <div className="space-y-6">
                    {/* Customer Header */}
                    <div className="text-center">
                      <div className="text-4xl mb-2">{getMoodEmoji(selectedTable.customer.mood)}</div>
                      <h4 className="text-lg font-bold text-gray-900 flex items-center justify-center gap-2">
                        {selectedTable.customer.name}
                        {selectedTable.customer.vip && <Crown className="w-5 h-5 text-yellow-500" />}
                      </h4>
                      <p className="text-gray-600">Party of {selectedTable.customer.partySize}</p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">{selectedTable.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900">Seated {selectedTable.customer.timeSeated}</span>
                      </div>
                    </div>

                    {/* Orders */}
                    {selectedTable.customer.orders.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Current Orders</h5>
                        <div className="space-y-2">
                          {selectedTable.customer.orders.map((order, idx) => (
                            <div key={idx} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {order}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Total</span>
                            <span className="font-bold text-lg">R{selectedTable.customer.totalSpent}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Special Requests */}
                    {selectedTable.customer.specialRequests && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Special Requests</h5>
                        <p className="text-sm text-purple-600 bg-purple-50 p-3 rounded-lg">
                          {selectedTable.customer.specialRequests}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                        <MessageSquare className="w-4 h-4 mx-auto mb-1" />
                        Message
                      </button>
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                        <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                        Check Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">
                      {selectedTable.status === 'available' ? '✨' : 
                       selectedTable.status === 'cleaning' ? '🧽' : '📅'}
                    </div>
                    <p className="text-lg font-medium">{getStatusText(selectedTable.status)}</p>
                    <p className="text-sm">{selectedTable.seats} seats in {selectedTable.section}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center"
              >
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Table</h3>
                <p className="text-gray-600 text-sm">Click on any table card to view detailed information</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default RestaurantOperationsV4