'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart,
  Truck,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Filter,
  Download,
  Upload,
  Calendar,
  DollarSign,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  MoreVertical,
  FileText,
  Send,
  Edit2,
  RefreshCw,
  X
} from 'lucide-react'

// Purchase orders data with South African suppliers
const purchaseOrders = [
  {
    id: 'PO-2024-001',
    supplier: 'Makro Wholesale',
    date: '2024-01-15',
    expectedDate: '2024-01-25',
    status: 'pending',
    items: 5,
    totalAmount: 157500,
    progress: 0
  },
  {
    id: 'PO-2024-002',
    supplier: 'Incredible Connection',
    date: '2024-01-12',
    expectedDate: '2024-01-22',
    status: 'shipped',
    items: 8,
    totalAmount: 289000,
    progress: 60,
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'PO-2024-003',
    supplier: 'Dis-Chem Wholesale',
    date: '2024-01-10',
    expectedDate: '2024-01-20',
    status: 'delivered',
    items: 3,
    totalAmount: 540000,
    progress: 100,
    receivedDate: '2024-01-19'
  },
  {
    id: 'PO-2024-004',
    supplier: 'Game Stores Distribution',
    date: '2024-01-08',
    expectedDate: '2024-01-18',
    status: 'partial',
    items: 10,
    totalAmount: 1476000,
    progress: 75,
    receivedItems: 7
  },
  {
    id: 'PO-2024-005',
    supplier: 'Builders Warehouse',
    date: '2024-01-05',
    expectedDate: '2024-01-15',
    status: 'cancelled',
    items: 4,
    totalAmount: 1068000,
    progress: 0,
    cancelReason: 'Supplier stock issue'
  }
]

// South African suppliers data
const suppliers = [
  {
    id: 1,
    name: 'Makro Wholesale',
    contact: 'Thabo Molefe',
    email: 'thabo@makro.co.za',
    phone: '+27 11 555-0123',
    location: 'Johannesburg, GP',
    rating: 4.8,
    orders: 45,
    totalSpent: 1250000,
    paymentTerms: 'Net 30',
    leadTime: '3-5 days',
    reliability: 96,
    logo: '🏢'
  },
  {
    id: 2,
    name: 'Incredible Connection',
    contact: 'Sarah van der Merwe',
    email: 'sarah@incredible.co.za',
    phone: '+27 21 555-0124',
    location: 'Cape Town, WC',
    rating: 4.5,
    orders: 32,
    totalSpent: 890000,
    paymentTerms: 'Net 45',
    leadTime: '5-7 days',
    reliability: 92,
    logo: '💻'
  },
  {
    id: 3,
    name: 'Dis-Chem Wholesale',
    contact: 'Mike Naidoo',
    email: 'mike@dischem.co.za',
    phone: '+27 31 555-0125',
    location: 'Durban, KZN',
    rating: 4.9,
    orders: 28,
    totalSpent: 670000,
    paymentTerms: 'Net 15',
    leadTime: '2-4 days',
    reliability: 98,
    logo: '💊'
  },
  {
    id: 4,
    name: 'Game Stores Distribution',
    contact: 'Emily Botha',
    email: 'emily@game.co.za',
    phone: '+27 12 555-0126',
    location: 'Pretoria, GP',
    rating: 4.3,
    orders: 19,
    totalSpent: 450000,
    paymentTerms: 'Net 30',
    leadTime: '4-6 days',
    reliability: 88,
    logo: '🛒'
  },
  {
    id: 5,
    name: 'Builders Warehouse',
    contact: 'Peter Khumalo',
    email: 'peter@builders.co.za',
    phone: '+27 11 555-0127',
    location: 'Sandton, GP',
    rating: 4.6,
    orders: 23,
    totalSpent: 780000,
    paymentTerms: 'Net 30',
    leadTime: '3-5 days',
    reliability: 94,
    logo: '🔨'
  },
  {
    id: 6,
    name: 'Checkers Distribution',
    contact: 'Linda Zulu',
    email: 'linda@checkers.co.za',
    phone: '+27 21 555-0128',
    location: 'Stellenbosch, WC',
    rating: 4.7,
    orders: 41,
    totalSpent: 1120000,
    paymentTerms: 'Net 15',
    leadTime: '2-3 days',
    reliability: 97,
    logo: '🍎'
  }
]

// Order items for detailed view with Rand pricing
const orderItems = [
  { product: 'Wireless Headphones', sku: 'SKU-001', quantity: 50, unitPrice: 450, total: 22500 },
  { product: 'Smart Watch Pro', sku: 'SKU-004', quantity: 25, unitPrice: 1800, total: 45000 },
  { product: 'Laptop Stand', sku: 'SKU-002', quantity: 100, unitPrice: 250, total: 25000 },
  { product: 'USB-C Cable Pack', sku: 'SKU-008', quantity: 200, unitPrice: 80, total: 16000 },
  { product: 'Wireless Mouse', sku: 'SKU-009', quantity: 75, unitPrice: 220, total: 16500 }
]

const OrderManagement = () => {
  const [selectedTab, setSelectedTab] = useState<'orders' | 'suppliers'>('orders')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'shipped': return 'text-blue-600 bg-blue-100'
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'partial': return 'text-orange-600 bg-orange-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'partial': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage purchase orders and supplier relationships</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex-1 sm:flex-initial justify-center">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Auto-Reorder</span>
          </button>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 flex-1 sm:flex-initial justify-center">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Order</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500">Open Orders</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-600">In Transit</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">5</p>
          <p className="text-xs text-gray-500">Shipments</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-600">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">24</p>
          <p className="text-xs text-gray-500">Suppliers</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-gray-600">This Month</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">R8.9M</p>
          <p className="text-xs text-gray-500">Total Spent</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setSelectedTab('orders')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedTab === 'orders'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Purchase Orders
        </button>
        <button
          onClick={() => setSelectedTab('suppliers')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedTab === 'suppliers'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Suppliers
        </button>
      </div>

      {selectedTab === 'orders' ? (
        isMobile ? (
          // Mobile view for orders
          <>
            <div className="space-y-3">
              {purchaseOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-gray-50 rounded-xl p-4 active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{order.supplier}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Ordered: {order.date}
                      </p>
                      {order.expectedDate && (
                        <p className="text-xs text-gray-500">
                          Expected: {order.expectedDate}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-xs text-gray-500">{order.items} items</p>
                    </div>
                    {order.progress > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              order.status === 'delivered' ? 'bg-green-500' :
                              order.status === 'shipped' ? 'bg-blue-500' :
                              order.status === 'partial' ? 'bg-orange-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{order.progress}%</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Mobile Order Details Modal */}
            <AnimatePresence>
              {selectedOrder && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50"
                  onClick={() => setSelectedOrder(null)}
                >
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 500 }}
                    className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      {/* Order Info */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Order Number</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedOrder.id}</p>
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusIcon(selectedOrder.status)}
                            {selectedOrder.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Supplier Info */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Supplier</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedOrder.supplier}</p>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div>
                            <p className="text-xs text-gray-500">Ordered</p>
                            <p className="text-sm text-gray-900">{selectedOrder.date}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Expected</p>
                            <p className="text-sm text-gray-900">{selectedOrder.expectedDate}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Items */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-3">Items</p>
                        <div className="space-y-2">
                          {orderItems.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{item.product}</p>
                                  <p className="text-xs text-gray-500">{item.sku}</p>
                                  <p className="text-xs text-gray-600 mt-1">{item.quantity} units @ {formatCurrency(item.unitPrice)}</p>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.total)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Subtotal</span>
                            <span className="text-sm text-gray-900">{formatCurrency(125000)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">VAT (15%)</span>
                            <span className="text-sm text-gray-900">{formatCurrency(18750)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Shipping</span>
                            <span className="text-sm text-gray-900">{formatCurrency(2750)}</span>
                          </div>
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-700">Total</span>
                              <span className="text-lg font-bold text-gray-900">{formatCurrency(146500)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
                          Receive Items
                        </button>
                        <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
                          Track
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
        <div className="grid grid-cols-12 gap-6">
          {/* Orders List */}
          <div className="col-span-7">
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              <div className="bg-white p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Filter className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {purchaseOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-white transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{order.supplier}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Ordered: {order.date} • Expected: {order.expectedDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                        <p className="text-xs text-gray-500">{order.items} items</p>
                      </div>
                    </div>
                    {order.progress > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Fulfillment Progress</span>
                          <span className="text-xs font-medium text-gray-900">{order.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              order.status === 'delivered' ? 'bg-green-500' :
                              order.status === 'shipped' ? 'bg-blue-500' :
                              order.status === 'partial' ? 'bg-orange-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="col-span-5">
            <div className="bg-gray-50 rounded-2xl p-6">
              {selectedOrder ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                    <button className="p-1 hover:bg-gray-200 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Order Number</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedOrder.id}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-2">Items</p>
                      <div className="space-y-2">
                        {orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.product}</p>
                              <p className="text-xs text-gray-500">{item.sku} • {item.quantity} units @ {formatCurrency(item.unitPrice)}</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Subtotal</span>
                        <span className="text-sm text-gray-900">{formatCurrency(125000)}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">VAT (15%)</span>
                        <span className="text-sm text-gray-900">{formatCurrency(18750)}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Shipping</span>
                        <span className="text-sm text-gray-900">{formatCurrency(2750)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">Total</span>
                          <span className="text-lg font-bold text-gray-900">{formatCurrency(146500)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
                        Receive Items
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
                        Track
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
        )
      ) : (
        /* Suppliers Tab */
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-6`}>
          {suppliers.map((supplier, index) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl">
                    {supplier.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                    <p className="text-sm text-gray-500">{supplier.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-900">{supplier.rating}</span>
                  <span className="text-yellow-500">★</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Contact Person</p>
                  <p className="text-sm font-medium text-gray-900">{supplier.contact}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment Terms</p>
                  <p className="text-sm font-medium text-gray-900">{supplier.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Lead Time</p>
                  <p className="text-sm font-medium text-gray-900">{supplier.leadTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reliability</p>
                  <p className="text-sm font-medium text-green-600">{supplier.reliability}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-xl mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{supplier.orders}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(supplier.totalSpent)}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
                  New Order
                </button>
                <button className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200">
                  <Mail className="w-4 h-4 text-gray-600" />
                </button>
                <button className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200">
                  <Phone className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderManagement