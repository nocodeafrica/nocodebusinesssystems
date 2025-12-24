'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Warehouse,
  Package,
  ArrowUpDown,
  Truck,
  Grid3x3,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Search,
  Filter,
  QrCode,
  Box,
  ChevronRight,
  RefreshCw,
  X,
  ArrowLeft,
  MoreVertical
} from 'lucide-react'
import { useWarehouseData, type ViewType } from '@/hooks/useWarehouseData'

const WarehouseMobile = () => {
  const {
    warehouses,
    selectedWarehouse,
    binLocations,
    pickingTasks,
    transfers,
    recentActivity,
    stats,
    activeView,
    searchQuery,
    filterStatus,
    setSelectedWarehouse,
    setActiveView,
    setSearchQuery,
    setFilterStatus,
    getStatusColor,
    getPriorityColor,
    getZoneUtilizationColor
  } = useWarehouseData()

  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const viewTabs: { key: ViewType; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: Grid3x3 },
    { key: 'bins', label: 'Bins', icon: Box },
    { key: 'transfers', label: 'Transfers', icon: ArrowUpDown },
    { key: 'picking', label: 'Tasks', icon: Package }
  ]

  const renderQuickStats = () => (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {Math.round((selectedWarehouse.totalUsed / selectedWarehouse.totalCapacity) * 100)}%
            </p>
            <p className="text-xs text-gray-500">Capacity</p>
          </div>
          <Warehouse className="w-6 h-6 text-orange-500" />
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
            <p className="text-lg font-bold text-gray-900">{selectedWarehouse.activeOrders}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <Package className="w-6 h-6 text-blue-500" />
        </div>
      </motion.div>
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Zone Utilization */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Zone Utilization</h3>
        <div className="space-y-3">
          {selectedWarehouse.zones.map((zone) => (
            <div key={zone.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">{zone.id}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{zone.name}</p>
                    <p className="text-xs text-gray-500">{zone.used}/{zone.capacity}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  zone.percentage >= 90 ? 'text-red-600 bg-red-100' :
                  zone.percentage >= 70 ? 'text-yellow-600 bg-yellow-100' :
                  'text-green-600 bg-green-100'
                }`}>
                  {zone.percentage}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
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

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.slice(0, 3).map((activity, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-8 h-8 ${activity.color === 'green' ? 'bg-green-100' : activity.color === 'blue' ? 'bg-blue-100' : activity.color === 'orange' ? 'bg-orange-100' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
                {activity.icon === 'ArrowRight' && <ChevronRight className={`w-4 h-4 ${activity.color === 'green' ? 'text-green-600' : activity.color === 'blue' ? 'text-blue-600' : activity.color === 'orange' ? 'text-orange-600' : 'text-purple-600'}`} />}
                {activity.icon === 'Truck' && <Truck className={`w-4 h-4 ${activity.color === 'blue' ? 'text-blue-600' : 'text-gray-600'}`} />}
                {activity.icon === 'Package' && <Package className={`w-4 h-4 ${activity.color === 'orange' ? 'text-orange-600' : 'text-gray-600'}`} />}
                {activity.icon === 'RefreshCw' && <RefreshCw className={`w-4 h-4 ${activity.color === 'purple' ? 'text-purple-600' : 'text-gray-600'}`} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBins = () => (
    <div className="space-y-3">
      {binLocations.map((bin) => (
        <motion.div
          key={bin.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setSelectedItem(bin)}
          className="bg-white rounded-xl p-4 border border-gray-200 active:scale-[0.98] transition-transform"
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
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900 line-clamp-1">{bin.product}</p>
            <p className="text-lg font-bold text-gray-900">
              {bin.quantity > 0 ? `${bin.quantity} units` : 'Empty'}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderTransfers = () => (
    <div className="space-y-3">
      {transfers.map((transfer) => (
        <motion.div
          key={transfer.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setSelectedItem(transfer)}
          className="bg-white rounded-xl p-4 border border-gray-200 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{transfer.id}</p>
                <p className="text-xs text-gray-500">{transfer.items} items</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
              {transfer.status}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">From:</span>
              <span className="text-gray-900 font-medium">{transfer.from}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">To:</span>
              <span className="text-gray-900 font-medium">{transfer.to}</span>
            </div>
          </div>
          
          {transfer.progress > 0 && (
            <div className="mt-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    transfer.status === 'completed' ? 'bg-green-500' :
                    transfer.status === 'in-transit' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${transfer.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">{transfer.progress}%</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )

  const renderPicking = () => (
    <div className="space-y-3">
      {pickingTasks.map((task) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setSelectedItem(task)}
          className="bg-white rounded-xl p-4 border border-gray-200 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{task.id}</p>
              <p className="text-xs text-gray-500">{task.order}</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <p className="text-xs text-gray-500">Items</p>
              <p className="text-sm font-semibold text-gray-900">{task.items}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Locations</p>
              <p className="text-sm font-semibold text-gray-900">{task.locations.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="text-sm font-semibold text-gray-900">{task.estimatedTime || '--'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
            <span className="text-xs text-gray-700">{task.assignee}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Warehouse Ops</h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-gray-100 rounded-lg"
            >
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          {/* Warehouse Selector */}
          <select 
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedWarehouse.id}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            {warehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Stats */}
        <div className="px-4 pb-3">
          {renderQuickStats()}
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar border-t border-gray-200">
          {viewTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key)}
              className={`flex-1 min-w-[80px] flex flex-col items-center gap-1 px-4 py-2 border-b-2 transition-colors ${
                activeView === tab.key
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-transparent'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${
                activeView === tab.key ? 'text-orange-600' : 'text-gray-500'
              }`} />
              <span className={`text-xs font-medium ${
                activeView === tab.key ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters (if visible) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              {/* Status Filter */}
              <select 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="optimal">Optimal</option>
                <option value="low">Low</option>
                <option value="critical">Critical</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-4 py-4">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'bins' && renderBins()}
        {activeView === 'transfers' && renderTransfers()}
        {activeView === 'picking' && renderPicking()}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Details</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Check if it's a bin location */}
                {selectedItem.product && (
                  <>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Location Info</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Bin ID</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Zone</span>
                          <span className="text-sm font-medium text-gray-900">Zone {selectedItem.zone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                            {selectedItem.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Product Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Product</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.product}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Quantity</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.quantity} units</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Check if it's a transfer */}
                {selectedItem.from && selectedItem.to && (
                  <>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Transfer Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Transfer ID</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Items</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.items} items</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                            {selectedItem.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Route</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">From</p>
                          <p className="text-sm font-medium text-gray-900">{selectedItem.from}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">To</p>
                          <p className="text-sm font-medium text-gray-900">{selectedItem.to}</p>
                        </div>
                        {selectedItem.eta && (
                          <div>
                            <p className="text-xs text-gray-500">Expected Arrival</p>
                            <p className="text-sm font-medium text-gray-900">{selectedItem.eta}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                {/* Check if it's a picking task */}
                {selectedItem.order && selectedItem.assignee && (
                  <>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Task Info</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Task ID</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Order</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.order}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Priority</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedItem.priority)}`}>
                            {selectedItem.priority}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                            {selectedItem.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Assignment</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Assignee</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.assignee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Items</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.items}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Locations</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.locations?.length || 0}</span>
                        </div>
                        {selectedItem.estimatedTime && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Est. Time</span>
                            <span className="text-sm font-medium text-gray-900">{selectedItem.estimatedTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Action Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <button className="w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center">
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default WarehouseMobile