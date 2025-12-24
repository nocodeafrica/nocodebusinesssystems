'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users,
  Home,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  CreditCard,
  Phone,
  Mail,
  MessageSquare,
  Shield,
  Key,
  Wrench,
  Bell,
  TrendingUp,
  TrendingDown,
  User,
  Building2,
  Receipt,
  ClipboardCheck,
  AlertTriangle,
  Filter,
  Search,
  Plus,
  Download,
  ChevronRight,
  Star,
  MapPin,
  Banknote,
  CalendarCheck,
  Timer,
  CheckSquare,
  FileCheck,
  UserCheck,
  Archive
} from 'lucide-react'

// Tenant data with SA context
const tenants = [
  {
    id: 1,
    name: 'Thabo Molefe',
    property: 'Unit 12A, Sandton City Apartments',
    unit: '12A',
    rentAmount: 15500,
    status: 'active',
    leaseStart: '2023-03-01',
    leaseEnd: '2024-02-29',
    paymentStatus: 'paid',
    lastPayment: '2024-01-01',
    deposit: 31000,
    avatar: '👨🏿‍💼',
    phone: '+27 82 555 0123',
    email: 'thabo.molefe@email.com',
    creditScore: 720,
    occupation: 'Software Engineer',
    employer: 'Tech Corp SA'
  },
  {
    id: 2,
    name: 'Sarah van der Merwe',
    property: 'House 45, Waterkloof Estate',
    unit: '45',
    rentAmount: 25000,
    status: 'active',
    leaseStart: '2023-06-01',
    leaseEnd: '2024-05-31',
    paymentStatus: 'overdue',
    lastPayment: '2023-12-01',
    deposit: 50000,
    avatar: '👩🏼‍💼',
    phone: '+27 83 555 0456',
    email: 'sarah.vdm@email.com',
    creditScore: 680,
    occupation: 'Marketing Manager',
    employer: 'AdWorld PTY'
  },
  {
    id: 3,
    name: 'Priya Naidoo',
    property: 'Unit 8B, Sea Point Tower',
    unit: '8B',
    rentAmount: 18000,
    status: 'active',
    leaseStart: '2023-09-01',
    leaseEnd: '2024-08-31',
    paymentStatus: 'pending',
    lastPayment: '2024-01-01',
    deposit: 36000,
    avatar: '👩🏽‍💼',
    phone: '+27 84 555 0789',
    email: 'priya.naidoo@email.com',
    creditScore: 750,
    occupation: 'Doctor',
    employer: 'Groote Schuur Hospital'
  },
  {
    id: 4,
    name: 'Johan Kruger',
    property: 'Unit 3C, Umhlanga Arch',
    unit: '3C',
    rentAmount: 22000,
    status: 'notice',
    leaseStart: '2023-01-01',
    leaseEnd: '2023-12-31',
    paymentStatus: 'paid',
    lastPayment: '2024-01-01',
    deposit: 44000,
    avatar: '👨🏼‍💼',
    phone: '+27 81 555 0321',
    email: 'johan.k@email.com',
    creditScore: 695,
    occupation: 'Financial Advisor',
    employer: 'Wealth Management Co'
  }
]

// Maintenance requests
const maintenanceRequests = [
  {
    id: 1,
    tenant: 'Thabo Molefe',
    unit: '12A',
    issue: 'Leaking tap in kitchen',
    priority: 'medium',
    status: 'in-progress',
    created: '2024-01-10',
    category: 'Plumbing'
  },
  {
    id: 2,
    tenant: 'Sarah van der Merwe',
    unit: '45',
    issue: 'Air conditioner not working',
    priority: 'high',
    status: 'pending',
    created: '2024-01-12',
    category: 'HVAC'
  },
  {
    id: 3,
    tenant: 'Priya Naidoo',
    unit: '8B',
    issue: 'Garage door remote needed',
    priority: 'low',
    status: 'completed',
    created: '2024-01-08',
    category: 'Security'
  }
]

// Payment history
const recentPayments = [
  { id: 1, tenant: 'Thabo Molefe', amount: 15500, date: '2024-01-01', method: 'EFT', status: 'completed' },
  { id: 2, tenant: 'Priya Naidoo', amount: 18000, date: '2024-01-01', method: 'Debit Order', status: 'completed' },
  { id: 3, tenant: 'Johan Kruger', amount: 22000, date: '2024-01-01', method: 'EFT', status: 'completed' },
  { id: 4, tenant: 'Sarah van der Merwe', amount: 25000, date: '2023-12-01', method: 'EFT', status: 'completed' }
]

// Lease renewals
const upcomingRenewals = [
  { tenant: 'Thabo Molefe', expiryDate: '2024-02-29', daysLeft: 45, status: 'pending' },
  { tenant: 'Sarah van der Merwe', expiryDate: '2024-05-31', daysLeft: 136, status: 'pending' },
  { tenant: 'Priya Naidoo', expiryDate: '2024-08-31', daysLeft: 228, status: 'pending' }
]

const TenantManagement = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'payments' | 'maintenance'>('overview')
  const [selectedTenant, setSelectedTenant] = useState<typeof tenants[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'notice': return 'bg-yellow-100 text-yellow-700'
      case 'inactive': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'overdue': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Calculate statistics
  const totalUnits = tenants.length
  const occupiedUnits = tenants.filter(t => t.status === 'active').length
  const occupancyRate = (occupiedUnits / totalUnits) * 100
  const totalMonthlyRent = tenants.reduce((sum, t) => sum + t.rentAmount, 0)
  const overduePayments = tenants.filter(t => t.paymentStatus === 'overdue').length

  return (
    <div className="bg-white rounded-3xl p-8 min-h-[700px] border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tenant Management</h2>
          <p className="text-gray-600">Manage your properties and tenants efficiently</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Tenant
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{totalUnits}</span>
          </div>
          <p className="text-blue-100 text-sm">Total Units</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{occupancyRate.toFixed(0)}%</span>
          </div>
          <p className="text-green-100 text-sm">Occupancy Rate</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Banknote className="w-8 h-8 opacity-80" />
            <span className="text-xl font-bold">R{(totalMonthlyRent / 1000).toFixed(0)}k</span>
          </div>
          <p className="text-indigo-100 text-sm">Monthly Revenue</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{overduePayments}</span>
          </div>
          <p className="text-red-100 text-sm">Overdue Payments</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'tenants', label: 'Tenants', icon: Users },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'maintenance', label: 'Maintenance', icon: Wrench }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Payment Received</p>
                  <p className="text-xs text-gray-500">Thabo Molefe - R15,500</p>
                </div>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Maintenance Request</p>
                  <p className="text-xs text-gray-500">Unit 45 - AC not working</p>
                </div>
                <span className="text-xs text-gray-400">5 hours ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Key className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Lease Renewal</p>
                  <p className="text-xs text-gray-500">Johan Kruger - Notice given</p>
                </div>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Payment Overdue</p>
                  <p className="text-xs text-gray-500">Sarah van der Merwe - R25,000</p>
                </div>
                <span className="text-xs text-gray-400">3 days ago</span>
              </div>
            </div>
          </div>

          {/* Upcoming Renewals */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Lease Renewals</h3>
            <div className="space-y-3">
              {upcomingRenewals.map((renewal) => (
                <div key={renewal.tenant} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{renewal.tenant}</p>
                      <p className="text-sm text-gray-500">Expires: {renewal.expiryDate}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        renewal.daysLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {renewal.daysLeft} days
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Overview */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Maintenance Requests</h3>
            <div className="space-y-3">
              {maintenanceRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.issue}</p>
                      <p className="text-xs text-gray-500">Unit {request.unit}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Expected This Month</span>
                <span className="font-semibold text-gray-900">R{totalMonthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Collected</span>
                <span className="font-semibold text-green-600">R55,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Outstanding</span>
                <span className="font-semibold text-red-600">R25,000</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Collection Rate</span>
                  <span className="font-semibold text-gray-900">69%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tenants' && (
        <div>
          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="notice">Notice Given</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Tenants List */}
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedTenant(tenant)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{tenant.avatar}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{tenant.name}</h4>
                      <p className="text-sm text-gray-600">{tenant.property}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {tenant.phone}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {tenant.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">R{tenant.rentAmount.toLocaleString()}/mo</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(tenant.status)}`}>
                        {tenant.status}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPaymentStatusColor(tenant.paymentStatus)}`}>
                        {tenant.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div>
          {/* Payment History */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Payments</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tenant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">{payment.tenant}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">R{payment.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{payment.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{payment.method}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          {maintenanceRequests.map((request) => (
            <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{request.issue}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {request.tenant}
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      Unit {request.unit}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {request.created}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TenantManagement