'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  Clock,
  Filter,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

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
    performance: 95,
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
    performance: 88,
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
    performance: 92,
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
    performance: 78,
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
    performance: 94,
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
    performance: 85,
  },
];

const departments = [
  { name: 'All Departments', count: 156 },
  { name: 'Engineering', count: 45 },
  { name: 'Design', count: 18 },
  { name: 'Marketing', count: 22 },
  { name: 'Sales', count: 31 },
  { name: 'Human Resources', count: 12 },
  { name: 'Finance', count: 15 },
  { name: 'Operations', count: 13 },
];

const StaffDirectory = () => {
  const [selectedDepartment, setSelectedDepartment] =
    useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center md:mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
            Employee Directory
          </h2>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            Manage your organization's workforce
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              156 Employees
            </span>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-700 md:px-4 md:text-sm">
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mb-8 md:gap-4 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 p-3 md:p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <Users className="h-5 w-5 text-violet-600" />
            <span className="text-xs font-medium text-green-600">+12%</span>
          </div>
          <p className="text-xl font-bold text-gray-900 md:text-2xl">156</p>
          <p className="text-xs text-gray-500">Total Employees</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 md:p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span className="text-xs text-gray-600">Active</span>
          </div>
          <p className="text-xl font-bold text-gray-900 md:text-2xl">8</p>
          <p className="text-xs text-gray-500">Departments</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-3 md:p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-xs font-medium text-green-600">+5</span>
          </div>
          <p className="text-xl font-bold text-gray-900 md:text-2xl">12</p>
          <p className="text-xs text-gray-500">New This Month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-3 md:p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <Clock className="h-5 w-5 text-orange-600" />
            <span className="text-xs text-gray-600">Avg</span>
          </div>
          <p className="text-xl font-bold text-gray-900 md:text-2xl">2.3y</p>
          <p className="text-xs text-gray-500">Tenure</p>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {/* Department Filter */}
          <div className="flex flex-wrap items-center gap-1 md:gap-2">
            {departments.slice(0, 5).map((dept) => (
              <button
                key={dept.name}
                onClick={() => setSelectedDepartment(dept.name)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-all md:px-4 md:text-sm ${
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
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 sm:w-64"
            />
          </div>
          <button className="rounded-xl bg-gray-100 p-2 transition-colors hover:bg-gray-200">
            <Filter className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {employees.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-xl md:p-6"
          >
            {/* Employee Header */}
            <div className="mb-3 flex items-start justify-between md:mb-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="relative">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="h-12 w-12 rounded-2xl object-cover md:h-16 md:w-16"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 h-4 w-4 ${getStatusColor(employee.status)} rounded-full border-2 border-white`}
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 md:text-lg">
                    {employee.name}
                  </h3>
                  <p className="text-xs text-gray-600 md:text-sm">
                    {employee.role}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1 md:gap-2">
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                      {employee.department}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {employee.level}
                    </span>
                  </div>
                </div>
              </div>
              <button className="rounded-lg p-1 transition-colors hover:bg-gray-100">
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="mb-3 space-y-1 md:mb-4 md:space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600 md:text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 md:text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 md:text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{employee.location}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-3 grid grid-cols-3 gap-2 md:mb-4 md:gap-3">
              <div className="text-center">
                <p className="text-base font-bold text-gray-900 md:text-lg">
                  {employee.teamSize}
                </p>
                <p className="text-xs text-gray-500">Team</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-gray-900 md:text-lg">
                  {employee.projects}
                </p>
                <p className="text-xs text-gray-500">Projects</p>
              </div>
              <div className="text-center">
                <div
                  className={`inline-block rounded-lg px-2 py-1 text-sm font-bold ${getPerformanceColor(employee.performance)}`}
                >
                  {employee.performance}%
                </div>
                <p className="mt-1 text-xs text-gray-500">Score</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <button className="flex-1 rounded-xl bg-violet-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-700 md:px-4 md:text-sm">
                View Profile
              </button>
              <button className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:flex-none md:px-4 md:text-sm">
                Message
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center md:mt-8">
        <p className="text-center text-xs text-gray-500 sm:text-left md:text-sm">
          Showing 1-6 of 156 employees
        </p>
        <div className="flex items-center justify-center gap-1 md:gap-2">
          <button className="cursor-not-allowed rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-400 md:px-4 md:text-sm">
            Previous
          </button>
          <button className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white md:text-sm">
            1
          </button>
          <button className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 md:text-sm">
            2
          </button>
          <button className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 md:text-sm">
            3
          </button>
          <span className="text-gray-400">...</span>
          <button className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 md:text-sm">
            26
          </button>
          <button className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 md:px-4 md:text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDirectory;
