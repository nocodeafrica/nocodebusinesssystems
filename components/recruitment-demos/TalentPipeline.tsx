'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users,
  Star,
  Target,
  Award,
  TrendingUp,
  Filter,
  Search,
  Plus,
  ChevronRight,
  Calendar,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Brain,
  Zap,
  Heart,
  MessageSquare,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Shield,
  Sparkles
} from 'lucide-react'

// Talent pools
const talentPools = [
  {
    id: 1,
    name: 'Senior Engineers',
    description: 'Experienced software engineers with 5+ years',
    candidates: 245,
    avgScore: 88,
    growth: 12,
    status: 'active',
    skills: ['React', 'Node.js', 'AWS', 'Python'],
    engagement: 76,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 2,
    name: 'Product Designers',
    description: 'UI/UX designers with strong portfolio',
    candidates: 156,
    avgScore: 85,
    growth: 8,
    status: 'active',
    skills: ['Figma', 'Design Systems', 'Prototyping'],
    engagement: 82,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 3,
    name: 'Data Scientists',
    description: 'ML experts and data analysts',
    candidates: 89,
    avgScore: 92,
    growth: 15,
    status: 'active',
    skills: ['Python', 'TensorFlow', 'SQL', 'Statistics'],
    engagement: 71,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    name: 'Marketing Specialists',
    description: 'Digital marketing and growth experts',
    candidates: 134,
    avgScore: 79,
    growth: -3,
    status: 'review',
    skills: ['SEO', 'Content', 'Analytics', 'Social Media'],
    engagement: 65,
    color: 'from-orange-500 to-amber-500'
  }
]

// Top candidates
const topCandidates = [
  {
    id: 1,
    name: 'Thabo Molefe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    title: 'Senior Full Stack Engineer',
    location: 'Cape Town, WC',
    experience: '8 years',
    skills: ['React', 'Node.js', 'AWS', 'GraphQL'],
    score: 94,
    matchingRoles: 3,
    lastActive: '2 days ago',
    status: 'available',
    salary: 'R1.8M - R2.2M',
    linkedin: true,
    github: true
  },
  {
    id: 2,
    name: 'Lerato Ndlovu',
    avatar: 'https://i.pravatar.cc/150?img=5',
    title: 'Product Designer',
    location: 'Johannesburg, GP',
    experience: '5 years',
    skills: ['Figma', 'UI/UX', 'Design Systems'],
    score: 91,
    matchingRoles: 2,
    lastActive: '1 week ago',
    status: 'passive',
    salary: 'R1.4M - R1.7M',
    linkedin: true,
    github: false
  },
  {
    id: 3,
    name: 'Sipho Dlamini',
    avatar: 'https://i.pravatar.cc/150?img=8',
    title: 'Data Scientist',
    location: 'Pretoria, GP',
    experience: '6 years',
    skills: ['Python', 'ML', 'SQL', 'TensorFlow'],
    score: 89,
    matchingRoles: 4,
    lastActive: '3 days ago',
    status: 'available',
    salary: 'R1.7M - R2.0M',
    linkedin: true,
    github: true
  },
  {
    id: 4,
    name: 'Nalini Pillay',
    avatar: 'https://i.pravatar.cc/150?img=9',
    title: 'Marketing Manager',
    location: 'Durban, KZN',
    experience: '7 years',
    skills: ['Digital Marketing', 'SEO', 'Analytics'],
    score: 86,
    matchingRoles: 1,
    lastActive: '5 days ago',
    status: 'employed',
    salary: 'R1.2M - R1.4M',
    linkedin: true,
    github: false
  }
]

// Skill demand trends
const skillTrends = [
  { skill: 'React', demand: 92, change: 15, candidates: 1250 },
  { skill: 'Python', demand: 88, change: 12, candidates: 980 },
  { skill: 'AWS', demand: 85, change: 8, candidates: 756 },
  { skill: 'TypeScript', demand: 82, change: 20, candidates: 645 },
  { skill: 'Kubernetes', demand: 78, change: 18, candidates: 432 },
  { skill: 'Figma', demand: 75, change: 10, candidates: 523 }
]

// Succession planning
const successionPlans = [
  {
    role: 'Engineering Manager',
    current: 'Johan Kruger',
    readyNow: 2,
    ready1Year: 3,
    ready3Years: 5,
    criticalRole: true
  },
  {
    role: 'Product Director',
    current: 'Fatima Abrahams',
    readyNow: 1,
    ready1Year: 2,
    ready3Years: 4,
    criticalRole: true
  },
  {
    role: 'Head of Sales',
    current: 'Mpho Khumalo',
    readyNow: 3,
    ready1Year: 4,
    ready3Years: 6,
    criticalRole: false
  }
]

const TalentPipeline = () => {
  const [selectedPool, setSelectedPool] = useState(talentPools[0])
  const [viewMode, setViewMode] = useState<'pools' | 'candidates'>('pools')
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'text-green-600 bg-green-100'
      case 'passive': return 'text-blue-600 bg-blue-100'
      case 'employed': return 'text-yellow-600 bg-yellow-100'
      case 'not-interested': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPoolStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'review': return 'text-yellow-600 bg-yellow-100'
      case 'inactive': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Talent Pipeline</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Build and nurture your talent pools</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('pools')}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex-1 sm:flex-none text-center ${
                viewMode === 'pools' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Talent Pools
            </button>
            <button
              onClick={() => setViewMode('candidates')}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex-1 sm:flex-none text-center ${
                viewMode === 'candidates' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Candidates
            </button>
          </div>
          <button className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-xl text-xs md:text-sm font-medium hover:bg-blue-700 min-h-[44px] w-full sm:w-auto">
            <UserPlus className="w-4 h-4" />
            Add Candidate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-green-600 font-medium">+15%</span>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">1,624</p>
          <p className="text-xs text-gray-500">Total Candidates</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">+3pts</span>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">86%</p>
          <p className="text-xs text-gray-500">Avg Match Score</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-purple-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-green-600 font-medium">+8%</span>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">74%</p>
          <p className="text-xs text-gray-500">Engagement Rate</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-orange-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-gray-600">Active</span>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500">Talent Pools</p>
        </motion.div>
      </div>

      {viewMode === 'pools' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Talent Pools List */}
          <div className="lg:col-span-7">
            <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Talent Pools</h3>
                <button className="flex items-center gap-2 text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium min-h-[44px] px-2">
                  <Plus className="w-4 h-4" />
                  Create Pool
                </button>
              </div>

              <div className="space-y-4">
                {talentPools.map((pool, index) => (
                  <motion.div
                    key={pool.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedPool(pool)}
                    className={`bg-white rounded-lg md:rounded-xl p-3 md:p-4 cursor-pointer transition-all ${
                      selectedPool.id === pool.id 
                        ? 'ring-2 ring-blue-500 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm md:text-base font-semibold text-gray-900">{pool.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPoolStatusColor(pool.status)}`}>
                            {pool.status}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600">{pool.description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {pool.growth > 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-xs md:text-sm font-medium ${
                          pool.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.abs(pool.growth)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Candidates</p>
                        <p className="text-sm md:text-lg font-bold text-gray-900">{pool.candidates}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Avg Score</p>
                        <p className="text-sm md:text-lg font-bold text-gray-900">{pool.avgScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Engagement</p>
                        <p className="text-sm md:text-lg font-bold text-gray-900">{pool.engagement}%</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 md:gap-2">
                      {pool.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                          {skill}
                        </span>
                      ))}
                      {pool.skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{pool.skills.length - 3}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Pool Details & Analytics */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            {/* Pool Performance */}
            <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Pool Performance</h3>
              
              <div className={`h-28 md:h-32 bg-gradient-to-br ${selectedPool.color} rounded-lg md:rounded-xl mb-4 p-3 md:p-4 text-white`}>
                <h4 className="text-lg md:text-xl font-bold mb-2">{selectedPool.name}</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold">{selectedPool.candidates}</p>
                    <p className="text-xs md:text-sm opacity-90">candidates</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg md:text-xl lg:text-2xl font-bold">{selectedPool.avgScore}%</p>
                    <p className="text-xs md:text-sm opacity-90">match score</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg md:rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Response Rate</span>
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-base md:text-lg font-bold text-gray-900">68%</p>
                </div>
                <div className="bg-white rounded-lg md:rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Hired from Pool</span>
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-base md:text-lg font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>

            {/* Skill Trends */}
            <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Trending Skills</h3>
              <div className="space-y-3">
                {skillTrends.slice(0, 4).map((skill) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs md:text-sm font-medium text-gray-900">{skill.skill}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 hidden sm:inline">{skill.candidates} candidates</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600">+{skill.change}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: `${skill.demand}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Candidates View */
        <div>
          {/* Search Bar */}
          <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-1 order-1 sm:order-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search candidates by name, skills, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-4 py-3 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2 min-h-[44px] order-2 sm:order-none w-full sm:w-auto">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Top Candidates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {topCandidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-sm md:text-base font-semibold text-gray-900">{candidate.name}</h4>
                      <p className="text-xs md:text-sm text-gray-600">{candidate.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{candidate.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-base md:text-lg font-bold text-blue-600">{candidate.score}%</p>
                      <p className="text-xs text-gray-500">match</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                    {candidate.status}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">• {candidate.experience}</span>
                  <span className="text-xs text-gray-500 hidden md:inline">• {candidate.salary}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-white rounded-lg text-xs text-gray-600">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 order-2 sm:order-1">
                    {candidate.linkedin && <Linkedin className="w-4 h-4 text-gray-400" />}
                    {candidate.github && <Github className="w-4 h-4 text-gray-400" />}
                    <span className="text-xs text-gray-500 ml-2">{candidate.lastActive}</span>
                  </div>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <button className="px-3 py-2 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 flex-1 sm:flex-none min-h-[40px]">
                      View Profile
                    </button>
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex-1 sm:flex-none min-h-[40px]">
                      Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Succession Planning */}
          <div className="mt-6 md:mt-8 bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Succession Planning</h3>
            <div className="space-y-4">
              {successionPlans.map((plan) => (
                <div key={plan.role} className="bg-white rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900">{plan.role}</h4>
                        {plan.criticalRole && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                            Critical
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Current: {plan.current}</p>
                    </div>
                    <Shield className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    <div className="text-center p-1.5 md:p-2 bg-green-50 rounded-lg">
                      <p className="text-sm md:text-lg font-bold text-green-600">{plan.readyNow}</p>
                      <p className="text-xs text-gray-600">Ready Now</p>
                    </div>
                    <div className="text-center p-1.5 md:p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm md:text-lg font-bold text-blue-600">{plan.ready1Year}</p>
                      <p className="text-xs text-gray-600">1 Year</p>
                    </div>
                    <div className="text-center p-1.5 md:p-2 bg-purple-50 rounded-lg">
                      <p className="text-sm md:text-lg font-bold text-purple-600">{plan.ready3Years}</p>
                      <p className="text-xs text-gray-600">3 Years</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TalentPipeline