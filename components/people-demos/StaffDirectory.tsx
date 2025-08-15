'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Users,
  Building2,
  MoreVertical,
  Star,
  Briefcase,
  ChevronRight,
  Clock,
  TrendingUp
} from 'lucide-react'

// Employee data
const employees = [
  {
    id: 1,
    name: 'Lerato Ndlovu',
    role: 'Head of Engineering',
    department: 'Engineering',
    email: 'lerato.n@company.com',
    phone: '+27 82 555 0123',
    location: 'Cape Town, WC',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'online',
    joinDate: '2021-03-15',
    level: 'Senior',
    reportingTo: 'CEO',
    teamSize: 12,
    projects: 8,
    performance: 95
  },
  {
    id: 2,
    name: 'Mpho Khumalo',
    role: 'Product Designer',
    department: 'Design',
    email: 'mpho.k@company.com',
    phone: '+27 83 555 0234',
    location: 'Johannesburg, GP',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'online',
    joinDate: '2022-01-10',
    level: 'Mid',
    reportingTo: 'Design Lead',
    teamSize: 0,
    projects: 5,
    performance: 88
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Marketing Manager',
    department: 'Marketing',
    email: 'emily.r@company.com',
    phone: '+1 (555) 345-6789',
    location: 'Durban, KZN',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'away',
    joinDate: '2020-09-20',
    level: 'Senior',
    reportingTo: 'CMO',
    teamSize: 8,
    projects: 12,
    performance: 92
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Sales Executive',
    department: 'Sales',
    email: 'james.w@company.com',
    phone: '+1 (555) 456-7890',
    location: 'Pretoria, GP',
    avatar: 'https://i.pravatar.cc/150?img=8',
    status: 'offline',
    joinDate: '2023-02-01',
    level: 'Junior',
    reportingTo: 'Sales Manager',
    teamSize: 0,
    projects: 3,
    performance: 78
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'HR Director',
    department: 'Human Resources',
    email: 'lisa.t@company.com',
    phone: '+1 (555) 567-8901',
    location: 'Remote',
    avatar: 'https://i.pravatar.cc/150?img=9',
    status: 'online',
    joinDate: '2019-11-12',
    level: 'Executive',
    reportingTo: 'COO',
    teamSize: 6,
    projects: 10,
    performance: 94
  },
  {
    id: 6,
    name: 'David Kim',
    role: 'DevOps Engineer',
    department: 'Engineering',
    email: 'david.k@company.com',
    phone: '+1 (555) 678-9012',
    location: 'Port Elizabeth, EC',
    avatar: 'https://i.pravatar.cc/150?img=11',
    status: 'online',
    joinDate: '2022-06-15',
    level: 'Mid',
    reportingTo: 'Engineering Lead',
    teamSize: 0,
    projects: 6,
    performance: 85
  }
]

const departments = [
  { name: 'All Departments', count: 156 },
  { name: 'Engineering', count: 45 },
  { name: 'Design', count: 18 },
  { name: 'Marketing', count: 22 },
  { name: 'Sales', count: 31 },
  { name: 'Human Resources', count: 12 },
  { name: 'Finance', count: 15 },
  { name: 'Operations', count: 13 }
]

const StaffDirectory = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Employee Directory</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Manage your organization's workforce</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">156 Employees</span>
          </div>
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-violet-600 text-white rounded-xl text-xs md:text-sm font-medium hover:bg-violet-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-3 md:p-4 border border-violet-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-violet-600" />
            <span className="text-xs text-green-600 font-medium">+12%</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">156</p>
          <p className="text-xs text-gray-500">Total Employees</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 md:p-4 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-600">Active</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">8</p>
          <p className="text-xs text-gray-500">Departments</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 md:p-4 border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">+5</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500">New This Month</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-3 md:p-4 border border-orange-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-gray-600">Avg</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">2.3y</p>
          <p className="text-xs text-gray-500">Tenure</p>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {/* Department Filter */}
          <div className="flex flex-wrap items-center gap-1 md:gap-2">
            {departments.slice(0, 5).map((dept) => (
              <button
                key={dept.name}
                onClick={() => setSelectedDepartment(dept.name)}
                className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
                  selectedDepartment === dept.name
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept.name} <span className="opacity-70">({dept.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:w-64"
            />
          </div>
          <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {employees.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 hover:shadow-xl transition-shadow"
          >
            {/* Employee Header */}
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="relative">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-2xl object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(employee.status)} rounded-full border-2 border-white`} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">{employee.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{employee.role}</p>
                  <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                      {employee.department}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {employee.level}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{employee.location}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="text-center">
                <p className="text-base md:text-lg font-bold text-gray-900">{employee.teamSize}</p>
                <p className="text-xs text-gray-500">Team</p>
              </div>
              <div className="text-center">
                <p className="text-base md:text-lg font-bold text-gray-900">{employee.projects}</p>
                <p className="text-xs text-gray-500">Projects</p>
              </div>
              <div className="text-center">
                <div className={`inline-block px-2 py-1 rounded-lg text-sm font-bold ${getPerformanceColor(employee.performance)}`}>
                  {employee.performance}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Score</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button className="flex-1 px-3 md:px-4 py-2 bg-violet-600 text-white rounded-xl text-xs md:text-sm font-medium hover:bg-violet-700 transition-colors">
                View Profile
              </button>
              <button className="sm:flex-none px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-200 transition-colors">
                Message
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 md:mt-8">
        <p className="text-xs md:text-sm text-gray-500 text-center sm:text-left">Showing 1-6 of 156 employees</p>
        <div className="flex items-center gap-1 md:gap-2 justify-center">
          <button className="px-3 md:px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs md:text-sm font-medium cursor-not-allowed">
            Previous
          </button>
          <button className="px-3 py-2 bg-violet-600 text-white rounded-lg text-xs md:text-sm font-medium">
            1
          </button>
          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-200">
            2
          </button>
          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-200">
            3
          </button>
          <span className="text-gray-400">...</span>
          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-200">
            26
          </button>
          <button className="px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-200">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default StaffDirectory