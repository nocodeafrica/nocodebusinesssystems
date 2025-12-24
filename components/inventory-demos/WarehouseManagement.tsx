'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Warehouse,
  Package,
  MapPin,
  ArrowRight,
  ArrowUpDown,
  Truck,
  Grid3x3,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Users,
  Plus,
  Search,
  Filter,
  Download,
  QrCode,
  Box,
  Activity,
  TrendingUp,
  ChevronRight,
  MoreVertical,
  RefreshCw,
  Layers
} from 'lucide-react'

// Warehouse locations with zones
const warehouseData = [
  {
    id: 'WH-001',
    name: 'Main Distribution Center',
    location: 'San Francisco, CA',
    zones: [
      { id: 'A', name: 'Electronics', capacity: 500, used: 380, percentage: 76 },
      { id: 'B', name: 'Accessories', capacity: 300, used: 210, percentage: 70 },
      { id: 'C', name: 'Returns', capacity: 100, used: 45, percentage: 45 },
      { id: 'D', name: 'Overflow', capacity: 200, used: 180, percentage: 90 }
    ],
    totalCapacity: 1100,
    totalUsed: 815,
    staff: 12,
    activeOrders: 24
  },
  {
    id: 'WH-002',
    name: 'Regional Warehouse',
    location: 'Johannesburg, GP',
    zones: [
      { id: 'E', name: 'Fast Moving', capacity: 400, used: 350, percentage: 87.5 },
      { id: 'F', name: 'Bulk Storage', capacity: 600, used: 420, percentage: 70 },
      { id: 'G', name: 'Fragile Items', capacity: 150, used: 90, percentage: 60 }
    ],
    totalCapacity: 1150,
    totalUsed: 860,
    staff: 8,
    activeOrders: 18
  }
]

// Stock transfers
const stockTransfers = [
  {
    id: 'TRF-001',
    from: 'Main Distribution Center',
    to: 'Regional Warehouse',
    items: 45,
    status: 'in-transit',
    date: '2024-01-15',
    eta: '2024-01-16',
    progress: 65
  },
  {
    id: 'TRF-002',
    from: 'Regional Warehouse',
    to: 'Store Front',
    items: 28,
    status: 'pending',
    date: '2024-01-15',
    eta: '2024-01-17',
    progress: 0
  },
  {
    id: 'TRF-003',
    from: 'Supplier Direct',
    to: 'Main Distribution Center',
    items: 120,
    status: 'completed',
    date: '2024-01-14',
    completedDate: '2024-01-15',
    progress: 100
  }
]

// Bin locations grid
const binLocations = [
  { id: 'A-01-01', zone: 'A', product: 'Wireless Headphones', quantity: 45, status: 'optimal' },
  { id: 'A-01-02', zone: 'A', product: 'Smart Watch Pro', quantity: 12, status: 'low' },
  { id: 'A-01-03', zone: 'A', product: 'Laptop Stand', quantity: 67, status: 'optimal' },
  { id: 'A-02-01', zone: 'A', product: 'USB-C Cables', quantity: 234, status: 'optimal' },
  { id: 'A-02-02', zone: 'A', product: 'Empty', quantity: 0, status: 'empty' },
  { id: 'A-02-03', zone: 'A', product: 'Wireless Mouse', quantity: 89, status: 'optimal' },
  { id: 'B-01-01', zone: 'B', product: 'Phone Cases', quantity: 156, status: 'optimal' },
  { id: 'B-01-02', zone: 'B', product: 'Screen Protectors', quantity: 8, status: 'critical' },
  { id: 'B-01-03', zone: 'B', product: 'Charging Docks', quantity: 34, status: 'low' }
]

// Picking tasks
const pickingTasks = [
  {
    id: 'PICK-001',
    order: 'ORD-2024-0145',
    items: 8,
    locations: ['A-01-01', 'A-02-03', 'B-01-01'],
    assignee: 'John Smith',
    status: 'in-progress',
    priority: 'high',
    startTime: '10:30 AM',
    estimatedTime: '15 min'
  },
  {
    id: 'PICK-002',
    order: 'ORD-2024-0146',
    items: 5,
    locations: ['A-01-03', 'B-01-03'],
    assignee: 'Sarah Chen',
    status: 'pending',
    priority: 'medium',
    startTime: '--',
    estimatedTime: '10 min'
  },
  {
    id: 'PICK-003',
    order: 'ORD-2024-0144',
    items: 12,
    locations: ['A-01-01', 'A-02-01', 'B-01-01', 'B-01-02'],
    assignee: 'Mike Johnson',
    status: 'completed',
    priority: 'low',
    startTime: '09:45 AM',
    completedTime: '10:05 AM'
  }
]

const WarehouseManagement = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouseData[0])
  const [activeView, setActiveView] = useState<'overview' | 'bins' | 'transfers' | 'picking'>('overview')

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'optimal': return 'text-green-600 bg-green-100'
      case 'low': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      case 'empty': return 'text-gray-600 bg-gray-100'
      case 'in-transit': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Warehouse Operations</h2>
          <p className="text-sm text-gray-500 mt-1">Manage inventory locations and transfers</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            Cycle Count
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700">
            <ArrowUpDown className="w-4 h-4" />
            New Transfer
          </button>
        </div>
      </div>

      {/* Warehouse Selector and Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="col-span-2">
          <select 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedWarehouse.id}
            onChange={(e) => setSelectedWarehouse(warehouseData.find(w => w.id === e.target.value) || warehouseData[0])}
          >
            {warehouseData.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name} - {warehouse.location}
              </option>
            ))}
          </select>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">
                {Math.round((selectedWarehouse.totalUsed / selectedWarehouse.totalCapacity) * 100)}%
              </p>
              <p className="text-xs text-gray-500">Capacity Used</p>
            </div>
            <Warehouse className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">{selectedWarehouse.activeOrders}</p>
              <p className="text-xs text-gray-500">Active Orders</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">{selectedWarehouse.staff}</p>
              <p className="text-xs text-gray-500">Staff On Duty</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveView('overview')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeView === 'overview'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveView('bins')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeView === 'bins'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Bin Locations
        </button>
        <button
          onClick={() => setActiveView('transfers')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeView === 'transfers'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Transfers
        </button>
        <button
          onClick={() => setActiveView('picking')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeView === 'picking'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Picking Tasks
        </button>
      </div>

      {/* Content based on active view */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Zone Overview */}
          <div className="col-span-7">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Zone Utilization</h3>
              <div className="space-y-4">
                {selectedWarehouse.zones.map((zone) => (
                  <div key={zone.id} className="bg-white rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-600">Z{zone.id}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Zone {zone.id}: {zone.name}</p>
                          <p className="text-xs text-gray-500">{zone.used} / {zone.capacity} locations</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        zone.percentage >= 90 ? 'text-red-600 bg-red-100' :
                        zone.percentage >= 70 ? 'text-yellow-600 bg-yellow-100' :
                        'text-green-600 bg-green-100'
                      }`}>
                        {zone.percentage}% Full
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          zone.percentage >= 90 ? 'bg-red-500' :
                          zone.percentage >= 70 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${zone.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-5">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Goods Received</p>
                    <p className="text-xs text-gray-500">150 units • Zone A • 30 min ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Transfer Shipped</p>
                    <p className="text-xs text-gray-500">TRF-001 to Regional • 1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Picking Completed</p>
                    <p className="text-xs text-gray-500">Order ORD-0144 • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Cycle Count</p>
                    <p className="text-xs text-gray-500">Zone B completed • 3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'bins' && (
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bin Locations</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                <QrCode className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                <Grid3x3 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {binLocations.map((bin) => (
              <motion.div
                key={bin.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{bin.id}</p>
                    <p className="text-xs text-gray-500">Zone {bin.zone}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bin.status)}`}>
                    {bin.status}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{bin.product}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {bin.quantity > 0 ? `${bin.quantity} units` : 'Empty'}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                    View Details →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'transfers' && (
        <div className="space-y-4">
          {stockTransfers.map((transfer, index) => (
            <motion.div
              key={transfer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <ArrowUpDown className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{transfer.id}</p>
                    <p className="text-sm text-gray-500">{transfer.items} items</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transfer.status)}`}>
                  {transfer.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">From</p>
                  <p className="text-sm font-medium text-gray-900">{transfer.from}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <div className="flex-1 bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">To</p>
                  <p className="text-sm font-medium text-gray-900">{transfer.to}</p>
                </div>
              </div>
              {transfer.progress > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs font-medium text-gray-900">{transfer.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        transfer.status === 'completed' ? 'bg-green-500' :
                        transfer.status === 'in-transit' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${transfer.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {activeView === 'picking' && (
        <div className="space-y-4">
          {pickingTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Box className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{task.id}</p>
                    <p className="text-xs text-gray-500">Order: {task.order}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-white rounded-lg p-2">
                  <p className="text-xs text-gray-500">Items</p>
                  <p className="text-sm font-semibold text-gray-900">{task.items}</p>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <p className="text-xs text-gray-500">Locations</p>
                  <p className="text-sm font-semibold text-gray-900">{task.locations.length}</p>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-semibold text-gray-900">{task.estimatedTime}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://i.pravatar.cc/150?img=${index + 1}`}
                    alt={task.assignee}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-700">{task.assignee}</span>
                </div>
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View Route →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WarehouseManagement