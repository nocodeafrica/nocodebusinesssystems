'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Users,
  Home,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  TrendingUp,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Wrench,
  CreditCard
} from 'lucide-react'

interface TenantManagementMobileProps {
  onBack?: () => void
}

// Tenant data with SA context (from desktop component)
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

// Maintenance requests (from desktop component)
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

// Payment history (from desktop component)
const recentPayments = [
  { id: 1, tenant: 'Thabo Molefe', amount: 15500, date: '2024-01-01', method: 'EFT', status: 'completed' },
  { id: 2, tenant: 'Priya Naidoo', amount: 18000, date: '2024-01-01', method: 'Debit Order', status: 'completed' },
  { id: 3, tenant: 'Johan Kruger', amount: 22000, date: '2024-01-01', method: 'EFT', status: 'completed' },
  { id: 4, tenant: 'Sarah van der Merwe', amount: 25000, date: '2023-12-01', method: 'EFT', status: 'completed' }
]

// Lease renewals (from desktop component)
const upcomingRenewals = [
  { tenant: 'Thabo Molefe', expiryDate: '2024-02-29', daysLeft: 45, status: 'pending' },
  { tenant: 'Sarah van der Merwe', expiryDate: '2024-05-31', daysLeft: 136, status: 'pending' },
  { tenant: 'Priya Naidoo', expiryDate: '2024-08-31', daysLeft: 228, status: 'pending' }
]

export default function TenantManagementMobile({ onBack }: TenantManagementMobileProps) {
  const [view, setView] = useState<'overview' | 'tenants' | 'payments' | 'maintenance'>('overview')
  const [selectedTenant, setSelectedTenant] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Calculate statistics (from desktop component)
  const totalUnits = tenants.length
  const occupiedUnits = tenants.filter(t => t.status === 'active').length
  const occupancyRate = (occupiedUnits / totalUnits) * 100
  const totalMonthlyRent = tenants.reduce((sum, t) => sum + t.rentAmount, 0)
  const overduePayments = tenants.filter(t => t.paymentStatus === 'overdue').length

  const stats = {
    totalUnits,
    occupancyRate,
    monthlyRevenue: totalMonthlyRent,
    overduePayments
  }

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

  // Tenant Detail View
  if (selectedTenant) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-y-auto">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setSelectedTenant(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{selectedTenant.name}</h1>
                <p className="text-sm text-gray-600">{selectedTenant.unit} • {selectedTenant.property}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Info */}
        <div className="px-4 py-6 space-y-4">
          {/* Contact Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold">
                {selectedTenant.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{selectedTenant.name}</h3>
                <p className="text-sm text-gray-600">{selectedTenant.unit}</p>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  getStatusColor(selectedTenant.paymentStatus)
                }`}>
                  {selectedTenant.paymentStatus === 'paid' ? 'Paid' : 
                   selectedTenant.paymentStatus === 'pending' ? 'Payment Pending' : 'Overdue'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button className="p-3 bg-gray-50 rounded-lg flex flex-col items-center gap-1">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-xs">Call</span>
              </button>
              <button className="p-3 bg-gray-50 rounded-lg flex flex-col items-center gap-1">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-xs">Email</span>
              </button>
              <button className="p-3 bg-gray-50 rounded-lg flex flex-col items-center gap-1">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <span className="text-xs">Message</span>
              </button>
            </div>
          </div>

          {/* Lease Details */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Lease Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Rent</span>
                <span className="font-semibold">R {selectedTenant.rentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lease Ends</span>
                <span className="font-semibold">{selectedTenant.leaseEnd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Payment</span>
                <span className="font-semibold">{selectedTenant.lastPayment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Deposit</span>
                <span className="font-semibold">R {selectedTenant.deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Credit Score</span>
                <span className="font-semibold">{selectedTenant.creditScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Occupation</span>
                <span className="font-semibold">{selectedTenant.occupation}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              Record Payment
            </button>
            <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              View Lease Agreement
            </button>
            <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2">
              <Wrench className="w-5 h-5" />
              Maintenance History
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tenant Management</h1>
                <p className="text-sm text-gray-600">{stats.totalUnits} total units</p>
              </div>
            </div>
            <button className="p-2 bg-indigo-600 text-white rounded-lg">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="px-4">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'tenants', label: 'Tenants', icon: Users },
              { id: 'payments', label: 'Payments', icon: DollarSign },
              { id: 'maintenance', label: 'Maintenance', icon: Wrench }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id as any)}
                  className={`py-3 px-1 border-b-2 transition-colors ${
                    view === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5 inline mr-1" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Overview */}
        {view === 'overview' && (
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Home className="w-6 h-6 opacity-80" />
                  <span className="text-2xl font-bold">{stats.totalUnits}</span>
                </div>
                <p className="text-blue-100 text-sm">Total Units</p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 opacity-80" />
                  <span className="text-2xl font-bold">{stats.occupancyRate.toFixed(0)}%</span>
                </div>
                <p className="text-green-100 text-sm">Occupancy</p>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-6 h-6 opacity-80" />
                  <span className="text-xl font-bold">R{(stats.monthlyRevenue / 1000).toFixed(0)}k</span>
                </div>
                <p className="text-indigo-100 text-sm">Monthly Revenue</p>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="w-6 h-6 opacity-80" />
                  <span className="text-2xl font-bold">{stats.overduePayments}</span>
                </div>
                <p className="text-red-100 text-sm">Overdue Payments</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
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
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Lease Renewal</p>
                    <p className="text-xs text-gray-500">Johan Kruger - Notice given</p>
                  </div>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600" />
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
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Upcoming Lease Renewals</h3>
              <div className="space-y-2">
                {upcomingRenewals.slice(0, 3).map((renewal) => (
                  <div key={renewal.tenant} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{renewal.tenant}</p>
                      <p className="text-xs text-gray-500">Expires: {renewal.expiryDate}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      renewal.daysLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {renewal.daysLeft} days
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected This Month</span>
                  <span className="font-semibold text-gray-900">R{totalMonthlyRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collected</span>
                  <span className="font-semibold text-green-600">R55,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Outstanding</span>
                  <span className="font-semibold text-red-600">R25,000</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collection Rate</span>
                    <span className="font-semibold text-gray-900">69%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tenants List */}
        {view === 'tenants' && (
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Tenant Cards */}
            {tenants.map((tenant) => (
              <motion.div
                key={tenant.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTenant(tenant)}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{tenant.avatar}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{tenant.name}</p>
                      <p className="text-sm text-gray-600">{tenant.property}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          getStatusColor(tenant.status)
                        }`}>
                          {tenant.status}
                        </span>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          getPaymentStatusColor(tenant.paymentStatus)
                        }`}>
                          {tenant.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">R{tenant.rentAmount.toLocaleString()}</p>
                    <ChevronRight className="w-5 h-5 text-gray-400 mx-auto mt-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Payments */}
        {view === 'payments' && (
          <div className="space-y-4">
            {/* Payment Summary */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <p className="text-sm opacity-90 mb-2">Total Expected This Month</p>
              <p className="text-3xl font-bold mb-4">
                R {stats.monthlyRevenue.toLocaleString()}
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold">
                    {tenants.filter(t => t.paymentStatus === 'paid').length}
                  </p>
                  <p className="text-xs opacity-80">Paid</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {tenants.filter(t => t.paymentStatus === 'pending').length}
                  </p>
                  <p className="text-xs opacity-80">Pending</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {tenants.filter(t => t.paymentStatus === 'overdue').length}
                  </p>
                  <p className="text-xs opacity-80">Overdue</p>
                </div>
              </div>
            </div>

            {/* Payment List */}
            <div className="space-y-3">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{tenant.name}</p>
                      <p className="text-sm text-gray-600">{tenant.unit}</p>
                      <p className="text-xs text-gray-500">Last: {tenant.lastPayment}</p>
                    </div>
                    <p className="font-semibold text-lg">R {tenant.rentAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      getPaymentStatusColor(tenant.paymentStatus)
                    }`}>
                      {tenant.paymentStatus === 'paid' ? '✓ Paid' : 
                       tenant.paymentStatus === 'pending' ? '⏳ Pending' : '⚠ Overdue'}
                    </span>
                    {tenant.paymentStatus !== 'paid' && (
                      <button className="text-indigo-600 text-sm font-medium">
                        Send Reminder
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Maintenance */}
        {view === 'maintenance' && (
          <div className="space-y-3">
            {maintenanceRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{request.issue}</p>
                    <p className="text-sm text-gray-600">{request.tenant} • {request.unit}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    getPriorityColor(request.priority)
                  }`}>
                    {request.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{request.created}</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                      request.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {request.status === 'pending' ? 'Pending' :
                       request.status === 'in-progress' ? 'In Progress' : 'Completed'}
                    </span>
                    <button className="text-indigo-600 text-sm font-medium">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}