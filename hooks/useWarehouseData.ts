import { useState, useCallback, useMemo } from 'react'

export interface Zone {
  id: string
  name: string
  capacity: number
  used: number
  percentage: number
}

export interface Warehouse {
  id: string
  name: string
  location: string
  zones: Zone[]
  totalCapacity: number
  totalUsed: number
  staff: number
  activeOrders: number
}

export interface StockTransfer {
  id: string
  from: string
  to: string
  items: number
  status: 'in-transit' | 'pending' | 'completed'
  date: string
  eta?: string
  completedDate?: string
  progress: number
}

export interface BinLocation {
  id: string
  zone: string
  product: string
  quantity: number
  status: 'optimal' | 'low' | 'critical' | 'empty'
}

export interface PickingTask {
  id: string
  order: string
  items: number
  locations: string[]
  assignee: string
  status: 'in-progress' | 'pending' | 'completed'
  priority: 'high' | 'medium' | 'low'
  startTime: string
  estimatedTime?: string
  completedTime?: string
}

export interface Activity {
  type: 'received' | 'shipped' | 'picked' | 'counted'
  description: string
  details: string
  time: string
  icon: string
  color: string
}

// Static data - in production this would come from an API
const warehouseData: Warehouse[] = [
  {
    id: 'WH-001',
    name: 'Johannesburg DC',
    location: 'Johannesburg, GP',
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
    name: 'Cape Town Warehouse',
    location: 'Cape Town, WC',
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

const stockTransfers: StockTransfer[] = [
  {
    id: 'TRF-001',
    from: 'Johannesburg DC',
    to: 'Cape Town Warehouse',
    items: 45,
    status: 'in-transit',
    date: '2024-01-15',
    eta: '2024-01-16',
    progress: 65
  },
  {
    id: 'TRF-002',
    from: 'Cape Town Warehouse',
    to: 'Sandton Store',
    items: 28,
    status: 'pending',
    date: '2024-01-15',
    eta: '2024-01-17',
    progress: 0
  },
  {
    id: 'TRF-003',
    from: 'Makro Direct',
    to: 'Johannesburg DC',
    items: 120,
    status: 'completed',
    date: '2024-01-14',
    completedDate: '2024-01-15',
    progress: 100
  }
]

const binLocations: BinLocation[] = [
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

const pickingTasks: PickingTask[] = [
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

const recentActivity: Activity[] = [
  {
    type: 'received',
    description: 'Goods Received',
    details: '150 units • Zone A • 30 min ago',
    time: '30 min ago',
    icon: 'ArrowRight',
    color: 'green'
  },
  {
    type: 'shipped',
    description: 'Transfer Shipped',
    details: 'TRF-001 to Regional • 1 hour ago',
    time: '1 hour ago',
    icon: 'Truck',
    color: 'blue'
  },
  {
    type: 'picked',
    description: 'Picking Completed',
    details: 'Order ORD-0144 • 2 hours ago',
    time: '2 hours ago',
    icon: 'Package',
    color: 'orange'
  },
  {
    type: 'counted',
    description: 'Cycle Count',
    details: 'Zone B completed • 3 hours ago',
    time: '3 hours ago',
    icon: 'RefreshCw',
    color: 'purple'
  }
]

export type ViewType = 'overview' | 'bins' | 'transfers' | 'picking'

export const useWarehouseData = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>(warehouseData[0])
  const [activeView, setActiveView] = useState<ViewType>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Filtered data based on search and filters
  const filteredBins = useMemo(() => {
    return binLocations.filter(bin => {
      const matchesSearch = bin.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           bin.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || bin.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, filterStatus])

  const filteredTransfers = useMemo(() => {
    return stockTransfers.filter(transfer => {
      const matchesSearch = transfer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transfer.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transfer.to.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || transfer.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, filterStatus])

  const filteredTasks = useMemo(() => {
    return pickingTasks.filter(task => {
      const matchesSearch = task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.order.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, filterStatus])

  // Utility functions
  const getStatusColor = useCallback((status: string) => {
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
  }, [])

  const getPriorityColor = useCallback((priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }, [])

  const getZoneUtilizationColor = useCallback((percentage: number) => {
    if (percentage >= 90) return 'red'
    if (percentage >= 70) return 'yellow'
    return 'green'
  }, [])

  // Actions
  const handleWarehouseChange = useCallback((warehouseId: string) => {
    const warehouse = warehouseData.find(w => w.id === warehouseId)
    if (warehouse) {
      setSelectedWarehouse(warehouse)
    }
  }, [])

  const handleViewChange = useCallback((view: ViewType) => {
    setActiveView(view)
    // Reset filters when changing views
    setSearchQuery('')
    setFilterStatus('all')
  }, [])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleFilterChange = useCallback((status: string) => {
    setFilterStatus(status)
  }, [])

  // Summary statistics
  const stats = useMemo(() => ({
    totalWarehouses: warehouseData.length,
    totalCapacity: warehouseData.reduce((sum, w) => sum + w.totalCapacity, 0),
    totalUsed: warehouseData.reduce((sum, w) => sum + w.totalUsed, 0),
    totalStaff: warehouseData.reduce((sum, w) => sum + w.staff, 0),
    totalActiveOrders: warehouseData.reduce((sum, w) => sum + w.activeOrders, 0),
    activeTransfers: stockTransfers.filter(t => t.status === 'in-transit').length,
    pendingTasks: pickingTasks.filter(t => t.status === 'pending').length,
    criticalBins: binLocations.filter(b => b.status === 'critical').length
  }), [])

  return {
    // Data
    warehouses: warehouseData,
    selectedWarehouse,
    stockTransfers,
    binLocations: filteredBins,
    pickingTasks: filteredTasks,
    transfers: filteredTransfers,
    recentActivity,
    stats,
    
    // View state
    activeView,
    searchQuery,
    filterStatus,
    
    // Actions
    setSelectedWarehouse: handleWarehouseChange,
    setActiveView: handleViewChange,
    setSearchQuery: handleSearch,
    setFilterStatus: handleFilterChange,
    
    // Utility functions
    getStatusColor,
    getPriorityColor,
    getZoneUtilizationColor
  }
}