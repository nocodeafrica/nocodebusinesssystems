'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users,
  User,
  UserPlus,
  Star,
  Target,
  TrendingUp,
  Award,
  MessageSquare,
  Calendar,
  Activity,
  Briefcase,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Trophy,
  GitBranch,
  Layers
} from 'lucide-react'

// Teams data
const teams = [
  {
    id: 1,
    name: 'Product Development',
    description: 'Building next-generation products',
    lead: 'Sarah Johnson',
    leadAvatar: 'https://i.pravatar.cc/150?img=1',
    memberCount: 12,
    projects: 5,
    performance: 92,
    status: 'active',
    color: 'from-purple-500 to-indigo-600',
    members: [
      { id: 1, name: 'Sarah Johnson', role: 'Team Lead', avatar: 'https://i.pravatar.cc/150?img=1', status: 'online' },
      { id: 2, name: 'Michael Chen', role: 'Senior Developer', avatar: 'https://i.pravatar.cc/150?img=3', status: 'online' },
      { id: 3, name: 'Emily Rodriguez', role: 'UX Designer', avatar: 'https://i.pravatar.cc/150?img=5', status: 'away' },
      { id: 4, name: 'David Kim', role: 'Backend Developer', avatar: 'https://i.pravatar.cc/150?img=11', status: 'online' }
    ],
    recentActivity: [
      { type: 'milestone', description: 'Completed Sprint 23', time: '2 hours ago' },
      { type: 'member', description: 'David Kim joined the team', time: '1 day ago' },
      { type: 'achievement', description: 'Reached 100% sprint velocity', time: '3 days ago' }
    ]
  },
  {
    id: 2,
    name: 'Marketing & Growth',
    description: 'Driving customer acquisition and engagement',
    lead: 'Emily Rodriguez',
    leadAvatar: 'https://i.pravatar.cc/150?img=5',
    memberCount: 8,
    projects: 8,
    performance: 88,
    status: 'active',
    color: 'from-orange-500 to-red-500',
    members: [
      { id: 5, name: 'Emily Rodriguez', role: 'Marketing Lead', avatar: 'https://i.pravatar.cc/150?img=5', status: 'online' },
      { id: 6, name: 'James Wilson', role: 'Content Manager', avatar: 'https://i.pravatar.cc/150?img=8', status: 'online' },
      { id: 7, name: 'Lisa Thompson', role: 'Growth Analyst', avatar: 'https://i.pravatar.cc/150?img=9', status: 'offline' }
    ],
    recentActivity: [
      { type: 'achievement', description: 'Campaign reached 2M impressions', time: '4 hours ago' },
      { type: 'project', description: 'Launched Q4 marketing campaign', time: '2 days ago' }
    ]
  },
  {
    id: 3,
    name: 'Customer Success',
    description: 'Ensuring customer satisfaction and retention',
    lead: 'Lisa Thompson',
    leadAvatar: 'https://i.pravatar.cc/150?img=9',
    memberCount: 15,
    projects: 3,
    performance: 95,
    status: 'active',
    color: 'from-green-500 to-emerald-600',
    members: [
      { id: 8, name: 'Lisa Thompson', role: 'CS Manager', avatar: 'https://i.pravatar.cc/150?img=9', status: 'online' },
      { id: 9, name: 'John Smith', role: 'Support Lead', avatar: 'https://i.pravatar.cc/150?img=12', status: 'online' },
      { id: 10, name: 'Anna Lee', role: 'Success Manager', avatar: 'https://i.pravatar.cc/150?img=16', status: 'online' }
    ],
    recentActivity: [
      { type: 'milestone', description: 'NPS score reached 72', time: '1 day ago' },
      { type: 'achievement', description: '99.9% SLA compliance', time: '1 week ago' }
    ]
  }
]

// Projects data
const activeProjects = [
  { id: 1, name: 'Mobile App v2.0', team: 'Product Development', progress: 75, deadline: '2023-12-15', status: 'on-track' },
  { id: 2, name: 'Q4 Marketing Campaign', team: 'Marketing & Growth', progress: 60, deadline: '2023-11-30', status: 'on-track' },
  { id: 3, name: 'Customer Portal Redesign', team: 'Product Development', progress: 45, deadline: '2024-01-20', status: 'at-risk' },
  { id: 4, name: 'Onboarding Automation', team: 'Customer Success', progress: 90, deadline: '2023-11-25', status: 'on-track' }
]

// Performance metrics
const performanceMetrics = [
  { metric: 'Productivity', current: 92, target: 90, trend: 'up' },
  { metric: 'Collaboration', current: 88, target: 85, trend: 'up' },
  { metric: 'Quality', current: 94, target: 95, trend: 'stable' },
  { metric: 'Innovation', current: 85, target: 80, trend: 'up' }
]

const TeamManagement = () => {
  const [selectedTeam, setSelectedTeam] = useState(teams[0])
  const [viewMode, setViewMode] = useState<'overview' | 'details'>('overview')

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getProjectStatusColor = (status: string) => {
    switch(status) {
      case 'on-track': return 'text-green-600 bg-green-100'
      case 'at-risk': return 'text-yellow-600 bg-yellow-100'
      case 'delayed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'milestone': return <Target className="w-4 h-4 text-blue-600" />
      case 'member': return <UserPlus className="w-4 h-4 text-green-600" />
      case 'achievement': return <Trophy className="w-4 h-4 text-yellow-600" />
      case 'project': return <Briefcase className="w-4 h-4 text-purple-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Organize teams, track performance, and manage projects</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                viewMode === 'overview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('details')}
              className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                viewMode === 'details' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Details
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-orange-600 text-white rounded-xl text-xs md:text-sm font-medium hover:bg-orange-700">
            <UserPlus className="w-4 h-4" />
            Create Team
          </button>
        </div>
      </div>

      {/* Stats Overview - Only show in overview mode */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-3 md:p-4 border border-orange-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-green-600 font-medium">+2</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{teams.length}</p>
          <p className="text-xs text-gray-500">Active Teams</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 md:p-4 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <User className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-green-600 font-medium">+8%</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">35</p>
          <p className="text-xs text-gray-500">Total Members</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 md:p-4 border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-600">Active</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">16</p>
          <p className="text-xs text-gray-500">Projects</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-3 md:p-4 border border-purple-100"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-green-600 font-medium">+5%</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900">91%</p>
          <p className="text-xs text-gray-500">Avg Performance</p>
        </motion.div>
      </div>
      )}

      {/* Overview Mode Content */}
      {viewMode === 'overview' && (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
        {/* Teams List */}
        <div className="xl:col-span-4">
          <div className="space-y-3 md:space-y-4">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedTeam(team)}
                className={`bg-white border rounded-2xl p-4 md:p-5 cursor-pointer transition-all ${
                  selectedTeam.id === team.id 
                    ? 'border-orange-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${team.color} rounded-xl flex items-center justify-center`}>
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{team.description}</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center gap-2 md:gap-3 mb-3">
                  <img
                    src={team.leadAvatar}
                    alt={team.lead}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs md:text-sm text-gray-600">Led by {team.lead}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-3 text-center">
                  <div>
                    <p className="text-base md:text-lg font-bold text-gray-900">{team.memberCount}</p>
                    <p className="text-xs text-gray-500">Members</p>
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-bold text-gray-900">{team.projects}</p>
                    <p className="text-xs text-gray-500">Projects</p>
                  </div>
                  <div>
                    <p className="text-base md:text-lg font-bold text-gray-900">{team.performance}%</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>

                <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${team.color} rounded-full`}
                    style={{ width: `${team.performance}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Details */}
        <div className="xl:col-span-8">
          <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
            {/* Team Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${selectedTeam.color} rounded-2xl flex items-center justify-center`}>
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900">{selectedTeam.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">{selectedTeam.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </button>
                <button className="px-3 md:px-4 py-2 bg-orange-600 text-white rounded-xl text-xs md:text-sm font-medium hover:bg-orange-700">
                  Manage Team
                </button>
              </div>
            </div>

            {/* Team Members */}
            <div className="mb-4 md:mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Team Members</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {selectedTeam.members.map((member) => (
                  <div key={member.id} className="bg-white rounded-xl p-3 flex items-center justify-between hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`} />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500 hidden sm:block">{member.role}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
                <button className="bg-gray-100 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors min-h-[52px]">
                  <UserPlus className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Add Member</span>
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mb-4 md:mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {performanceMetrics.map((metric) => (
                  <div key={metric.metric} className="bg-white rounded-xl p-2 md:p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">{metric.metric}</span>
                      {metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                      {metric.trend === 'down' && <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />}
                      {metric.trend === 'stable' && <Activity className="w-3 h-3 text-gray-400" />}
                    </div>
                    <p className="text-lg md:text-xl font-bold text-gray-900">{metric.current}%</p>
                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          metric.current >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${metric.current}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h4>
              <div className="space-y-2 md:space-y-3">
                {selectedTeam.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-2 md:gap-3 bg-white rounded-xl p-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Details Mode Content */}
      {viewMode === 'details' && (
        <div className="space-y-4 md:space-y-6">
          {/* Detailed Team List - Mobile Card View / Desktop Table */}
          <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">All Teams Detailed View</h3>
            
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-3">
              {teams.map((team) => (
                <div key={team.id} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${team.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{team.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{team.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <img src={team.leadAvatar} alt={team.lead} className="w-6 h-6 rounded-full" />
                        <span className="text-xs text-gray-600">Led by {team.lead}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Members</p>
                      <p className="text-sm font-semibold text-gray-900">{team.memberCount}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Projects</p>
                      <p className="text-sm font-semibold text-gray-900">{team.projects}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Performance</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${team.color} rounded-full`} style={{ width: `${team.performance}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-900">{team.performance}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Budget Used</span>
                      <span className="text-xs font-medium text-gray-700">78%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Velocity</span>
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">High</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Team</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Lead</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Members</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Projects</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Performance</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Budget Used</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Velocity</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${team.color} rounded-lg flex items-center justify-center`}>
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{team.name}</p>
                            <p className="text-xs text-gray-500">{team.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <img src={team.leadAvatar} alt={team.lead} className="w-8 h-8 rounded-full" />
                          <span className="text-sm text-gray-700">{team.lead}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-medium text-gray-900">{team.memberCount}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-medium text-gray-900">{team.projects}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${team.color} rounded-full`} style={{ width: `${team.performance}%` }} />
                          </div>
                          <span className="text-sm font-bold text-gray-900">{team.performance}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-gray-700">78%</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">High</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button className="p-1 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Projects Overview */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Projects Across Teams</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{project.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{project.team}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProjectStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          project.status === 'on-track' ? 'bg-green-500' : 
                          project.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Deadline</span>
                      <span className="font-medium text-gray-900">{project.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Collaboration Matrix */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Collaboration Matrix</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <Layers className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-gray-500">Cross-team Projects</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <GitBranch className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">142</p>
                <p className="text-xs text-gray-500">Dependencies</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">892</p>
                <p className="text-xs text-gray-500">Messages Today</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">96%</p>
                <p className="text-xs text-gray-500">Response Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamManagement