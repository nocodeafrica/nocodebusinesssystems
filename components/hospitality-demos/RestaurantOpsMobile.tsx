'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UtensilsCrossed, Clock, Users, DollarSign, 
  Crown, Star, Timer, ChefHat, Utensils,
  MapPin, Phone, MessageSquare, CheckCircle2,
  AlertCircle, Calendar, TrendingUp, Filter,
  X, Search, MoreVertical, ArrowLeft, ChevronRight
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

const RestaurantOpsMobile = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'orders' | 'kitchen'>('overview')
  const [selectedFilter, setSelectedFilter] = useState<'all' | TableStatus>('all')
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

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

  const kitchenOrders = [
    { id: 1, table: 1, items: ['Ribeye Steak', 'Salmon Fillet'], status: 'cooking', timeRemaining: '8 min', priority: 'high' },
    { id: 2, table: 3, items: ['Business Lunch x6'], status: 'ready', timeRemaining: 'Ready!', priority: 'urgent' },
    { id: 3, table: 7, items: ['Sharing Platter'], status: 'prep', timeRemaining: '15 min', priority: 'normal' },
    { id: 4, table: 4, items: ['Dessert'], status: 'cooking', timeRemaining: '5 min', priority: 'normal' }
  ]

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

  const getOrderStatusColor = (status: string) => {
    switch(status) {
      case 'prep': return 'bg-yellow-500'
      case 'cooking': return 'bg-blue-500'
      case 'ready': return 'bg-green-500'
      default: return 'bg-gray-500'
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

  // Calculate stats
  const totalRevenue = tables.reduce((sum, table) => sum + (table.customer?.totalSpent || 0), 0)
  const occupiedTables = tables.filter(t => t.status === 'occupied').length
  const availableTables = tables.filter(t => t.status === 'available').length
  const avgSpend = totalRevenue / Math.max(occupiedTables, 1)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Restaurant Ops</h2>
              <p className="text-xs text-gray-500">Table management & operations</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-gray-100 rounded-lg"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 bg-orange-600 text-white rounded-lg">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {[
              { key: 'overview', label: 'Overview', icon: TrendingUp },
              { key: 'tables', label: 'Tables', icon: UtensilsCrossed },
              { key: 'orders', label: 'Orders', icon: Utensils },
              { key: 'kitchen', label: 'Kitchen', icon: ChefHat }
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
                  {['all', 'available', 'occupied', 'reserved', 'cleaning', 'bill'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedFilter(status as any)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedFilter === status 
                          ? 'bg-orange-600 text-white' 
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
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900">R{(totalRevenue / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                  <DollarSign className="w-6 h-6 text-orange-500" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900">{occupiedTables}/{tables.length}</p>
                    <p className="text-xs text-gray-500">Occupied</p>
                  </div>
                  <UtensilsCrossed className="w-6 h-6 text-blue-500" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900">R{Math.round(avgSpend)}</p>
                    <p className="text-xs text-gray-500">Avg Spend</p>
                  </div>
                  <Star className="w-6 h-6 text-green-500" />
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
                    <p className="text-xl font-bold text-gray-900">{availableTables}</p>
                    <p className="text-xs text-gray-500">Available</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-purple-500" />
                </div>
              </motion.div>
            </div>

            {/* Section Overview */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Sections Overview</h3>
              <div className="space-y-3">
                {['Window', 'VIP', 'Garden', 'Patio', 'Main Hall', 'Bar Area'].map((section) => {
                  const sectionTables = tables.filter(t => t.section === section)
                  const occupied = sectionTables.filter(t => t.status === 'occupied').length
                  
                  return (
                    <div key={section} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{section}</p>
                        <p className="text-xs text-gray-500">{sectionTables.length} tables</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{occupied}/{sectionTables.length}</p>
                        <p className="text-xs text-gray-500">occupied</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <div className="space-y-3">
            {filteredTables.map((table) => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedTable(table)}
                className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${getStatusColor(table.status)}`}>
                      <span className="text-sm font-bold">{table.number}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Table {table.number}</p>
                      <p className="text-xs text-gray-500">{table.section} • {table.seats} seats</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      table.status === 'available' ? 'bg-green-100 text-green-700' :
                      table.status === 'occupied' ? 'bg-blue-100 text-blue-700' :
                      table.status === 'reserved' ? 'bg-purple-100 text-purple-700' :
                      table.status === 'cleaning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-pink-100 text-pink-700'
                    }`}>
                      {getStatusText(table.status)}
                    </span>
                  </div>
                </div>

                {table.customer && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-900 flex items-center gap-1">
                          {table.customer.name} 
                          {table.customer.vip && <Crown className="w-3 h-3 text-yellow-500" />}
                          <span className="text-xs">{getMoodEmoji(table.customer.mood)}</span>
                        </p>
                        <p className="text-xs text-gray-500">{table.customer.timeSeated}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-900">R{table.customer.totalSpent}</p>
                        {table.estimatedTurnTime && (
                          <p className="text-xs text-gray-500">{table.estimatedTurnTime}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {tables.filter(t => t.customer && t.customer.orders.length > 0).map((table) => (
              <div key={table.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Table {table.number}</p>
                    <p className="text-xs text-gray-500">{table.customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">R{table.customer?.totalSpent}</p>
                    <p className="text-xs text-gray-500">{table.customer?.timeSeated}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {table.customer?.orders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-700">{order}</span>
                      <Utensils className="w-3 h-3 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Kitchen Tab */}
        {activeTab === 'kitchen' && (
          <div className="space-y-3">
            {kitchenOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${getOrderStatusColor(order.status)}`}>
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Table {order.table}</p>
                      <p className="text-xs text-gray-500">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{order.timeRemaining}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      order.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.priority}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table Detail Modal */}
      <AnimatePresence>
        {selectedTable && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Table {selectedTable.number}</h3>
                <button onClick={() => setSelectedTable(null)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${getStatusColor(selectedTable.status)}`}>
                    <span className="font-bold">{selectedTable.number}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedTable.section} Section</p>
                    <p className="text-sm text-gray-500">{selectedTable.seats} seats • {getStatusText(selectedTable.status)}</p>
                  </div>
                </div>
                
                {selectedTable.customer && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                      Guest Information
                      {selectedTable.customer.vip && <Crown className="w-4 h-4 text-yellow-500" />}
                      <span className="text-sm">{getMoodEmoji(selectedTable.customer.mood)}</span>
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">{selectedTable.customer.name}</p>
                      <p className="text-xs text-gray-500">Party of {selectedTable.customer.partySize}</p>
                      <p className="text-xs text-gray-500">Seated: {selectedTable.customer.timeSeated}</p>
                      <p className="text-xs text-gray-500">Phone: {selectedTable.customer.phone}</p>
                      {selectedTable.customer.specialRequests && (
                        <p className="text-xs text-blue-600">Note: {selectedTable.customer.specialRequests}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-orange-600 text-white rounded-xl text-sm font-medium">
                    Update Status
                  </button>
                  <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
                    View Orders
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

export default RestaurantOpsMobile