'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  DollarSign,
  MessageSquare,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Shield,
  Sparkles,
  X,
  ChevronDown
} from 'lucide-react'

// Reuse data structures from desktop version
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
  }
]

const TalentPipelineMobile = () => {
  const [selectedPool, setSelectedPool] = useState<any>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'pools' | 'candidates'>('pools')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

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
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-900">Talent Pipeline</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-blue-600 text-white rounded-lg">
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('pools')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'pools' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Talent Pools
            </button>
            <button
              onClick={() => setViewMode('candidates')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'candidates' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Candidates
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <div className="flex-shrink-0 bg-blue-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-sm font-bold text-gray-900">1,624</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 bg-green-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Match</p>
                <p className="text-sm font-bold text-gray-900">86%</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 bg-purple-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Active</p>
                <p className="text-sm font-bold text-gray-900">74%</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 bg-orange-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">Pools</p>
                <p className="text-sm font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-40 pb-20 px-4">
        {viewMode === 'pools' ? (
          /* Talent Pools View */
          <div className="space-y-3">
            {talentPools.map((pool) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedPool(pool)}
                className="bg-white rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform"
              >
                {/* Pool Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{pool.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPoolStatusColor(pool.status)}`}>
                        {pool.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{pool.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {pool.growth > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      pool.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(pool.growth)}%
                    </span>
                  </div>
                </div>

                {/* Pool Stats */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{pool.candidates}</p>
                    <p className="text-xs text-gray-500">Candidates</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{pool.avgScore}%</p>
                    <p className="text-xs text-gray-500">Avg Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{pool.engagement}%</p>
                    <p className="text-xs text-gray-500">Engaged</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {pool.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      {skill}
                    </span>
                  ))}
                  {pool.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-500">+{pool.skills.length - 3}</span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Pipeline Health</span>
                    <span className="text-xs font-medium text-gray-700">{pool.engagement}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${pool.color} rounded-full transition-all`}
                      style={{ width: `${pool.engagement}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Candidates View */
          <div className="space-y-3">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Candidates List */}
            {topCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedCandidate(candidate)}
                className="bg-white rounded-xl p-4 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-xs text-gray-600">{candidate.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{candidate.score}%</p>
                        <p className="text-xs text-gray-500">match</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{candidate.experience}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {candidate.location}
                      </div>
                      <div className="flex items-center gap-1">
                        {candidate.linkedin && <Linkedin className="w-3 h-3" />}
                        {candidate.github && <Github className="w-3 h-3" />}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle view profile
                    }}
                    className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium active:bg-gray-100"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle contact
                    }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium active:bg-blue-700"
                  >
                    Contact
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pool Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedPool && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPool(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  setSelectedPool(null)
                }
              }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-hidden"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              <div className="px-4 pb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">{selectedPool.name}</h2>
                  <button onClick={() => setSelectedPool(null)} className="p-2">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="px-4 pb-6 overflow-y-auto max-h-[70vh]">
                {/* Pool Performance Card */}
                <div className={`bg-gradient-to-br ${selectedPool.color} rounded-xl p-4 text-white mb-4`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-3xl font-bold">{selectedPool.candidates}</p>
                      <p className="text-sm opacity-90">Total Candidates</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{selectedPool.avgScore}%</p>
                      <p className="text-sm opacity-90">Avg Match</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">{selectedPool.engagement}% Engaged</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {selectedPool.growth > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {selectedPool.growth > 0 ? '+' : ''}{selectedPool.growth}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button className="py-3 bg-blue-600 text-white rounded-xl text-sm font-medium">
                    View Candidates
                  </button>
                  <button className="py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
                    Send Campaign
                  </button>
                </div>

                {/* Skills Distribution */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Skills</h3>
                  <div className="space-y-2">
                    {selectedPool.skills.map((skill: string, index: number) => (
                      <div key={skill} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{skill}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${85 - index * 10}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{85 - index * 10}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Candidate Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  setSelectedCandidate(null)
                }
              }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-hidden"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              <div className="px-4 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedCandidate.avatar}
                      alt={selectedCandidate.name}
                      className="w-14 h-14 rounded-full"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{selectedCandidate.name}</h2>
                      <p className="text-sm text-gray-600">{selectedCandidate.title}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCandidate(null)} className="p-2">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="px-4 pb-6 overflow-y-auto max-h-[70vh] space-y-4">
                {/* Match Score */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Match Score</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedCandidate.score}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-1">Matching Roles</p>
                      <p className="text-lg font-bold text-gray-900">{selectedCandidate.matchingRoles}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 bg-blue-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button className="py-3 bg-green-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="text-sm font-medium text-gray-900">{selectedCandidate.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Experience</p>
                      <p className="text-sm font-medium text-gray-900">{selectedCandidate.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Salary Range</p>
                      <p className="text-sm font-medium text-gray-900">{selectedCandidate.salary}</p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TalentPipelineMobile