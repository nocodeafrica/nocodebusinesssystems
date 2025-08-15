'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Building2,
  Search,
  Filter,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Globe,
  Zap,
  TrendingUp,
  Star,
  BookOpen,
  Award,
  Eye,
  Send,
  Bookmark,
  X,
  CheckCircle
} from 'lucide-react'

// Job listings data
const jobListings = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp Solutions',
    logo: '🏢',
    location: 'Cape Town, WC',
    type: 'Full-time',
    experience: '5+ years',
    salary: 'R1.8M - R2.4M',
    posted: '2 days ago',
    applicants: 48,
    tags: ['React', 'Node.js', 'AWS', 'TypeScript'],
    featured: true,
    remote: 'Hybrid',
    department: 'Engineering',
    description: 'We are looking for a talented Senior Software Engineer to join our growing team...',
    benefits: ['Health Insurance', '401k', 'Remote Work', 'Stock Options'],
    urgency: 'high'
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Design Studio Inc',
    logo: '🎨',
    location: 'Johannesburg, GP',
    type: 'Full-time',
    experience: '3-5 years',
    salary: 'R1.2M - R1.6M',
    posted: '1 week ago',
    applicants: 32,
    tags: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
    featured: false,
    remote: 'Remote',
    department: 'Design',
    description: 'Join our creative team to design beautiful and functional user experiences...',
    benefits: ['Health Insurance', 'Creative Freedom', 'Learning Budget'],
    urgency: 'medium'
  },
  {
    id: 3,
    title: 'Marketing Manager',
    company: 'Growth Agency',
    logo: '📈',
    location: 'Durban, KZN',
    type: 'Full-time',
    experience: '4-6 years',
    salary: 'R1.1M - R1.4M',
    posted: '3 days ago',
    applicants: 24,
    tags: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
    featured: true,
    remote: 'On-site',
    department: 'Marketing',
    description: 'Lead our marketing initiatives and drive growth across multiple channels...',
    benefits: ['Performance Bonus', 'Professional Development', 'Gym Membership'],
    urgency: 'low'
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'AI Innovations',
    logo: '🤖',
    location: 'Pretoria, GP',
    type: 'Full-time',
    experience: '3+ years',
    salary: 'R1.6M - R2.0M',
    posted: '1 day ago',
    applicants: 15,
    tags: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    featured: true,
    remote: 'Remote',
    department: 'Data',
    description: 'Help us build cutting-edge AI solutions and derive insights from complex data...',
    benefits: ['Unlimited PTO', 'Conference Budget', 'Top-tier Equipment'],
    urgency: 'high'
  },
  {
    id: 5,
    title: 'Sales Executive',
    company: 'Sales Force Pro',
    logo: '💼',
    location: 'Port Elizabeth, EC',
    type: 'Full-time',
    experience: '2-4 years',
    salary: 'R850k - R1.1M + Commission',
    posted: '5 days ago',
    applicants: 56,
    tags: ['B2B Sales', 'CRM', 'Lead Generation', 'Negotiation'],
    featured: false,
    remote: 'Hybrid',
    department: 'Sales',
    description: 'Drive revenue growth by identifying and closing new business opportunities...',
    benefits: ['Commission', 'Car Allowance', 'Sales Training'],
    urgency: 'medium'
  }
]

// Department filters
const departments = [
  { name: 'All', count: 142, icon: '🏢' },
  { name: 'Engineering', count: 45, icon: '💻' },
  { name: 'Design', count: 18, icon: '🎨' },
  { name: 'Marketing', count: 22, icon: '📈' },
  { name: 'Sales', count: 31, icon: '💼' },
  { name: 'Data', count: 15, icon: '📊' },
  { name: 'Operations', count: 11, icon: '⚙️' }
]

// Quick stats
const quickStats = [
  { label: 'Open Positions', value: '142', change: '+12', icon: Briefcase, color: 'from-indigo-500 to-blue-500' },
  { label: 'Applications', value: '3,847', change: '+248', icon: Users, color: 'from-purple-500 to-violet-500' },
  { label: 'Avg Time to Fill', value: '23 days', change: '-3', icon: Clock, color: 'from-green-500 to-emerald-500' },
  { label: 'Active Candidates', value: '892', change: '+56', icon: TrendingUp, color: 'from-orange-500 to-amber-500' }
]

const JobBoard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState<typeof jobListings[0] | null>(null)
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [applicationJob, setApplicationJob] = useState<typeof jobListings[0] | null>(null)

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRemoteColor = (remote: string) => {
    switch(remote) {
      case 'Remote': return 'text-green-600 bg-green-100'
      case 'Hybrid': return 'text-blue-600 bg-blue-100'
      case 'On-site': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Job Board</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Discover and manage open positions</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Globe className="w-4 h-4" />
            <span className="hidden lg:inline">Publish to Web</span>
            <span className="lg:hidden">Publish</span>
          </button>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-indigo-700">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Post New Job</span>
            <span className="sm:hidden">Post</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-white/80" />
              <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-white/80 truncate">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full lg:w-auto pb-2 lg:pb-0">
          {departments.map((dept) => (
            <button
              key={dept.name}
              onClick={() => setSelectedDepartment(dept.name)}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${
                selectedDepartment === dept.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-sm sm:text-base">{dept.icon}</span>
              <span className="hidden sm:inline">{dept.name}</span>
              <span className="sm:hidden">{dept.name.slice(0, 3)}</span>
              <span className="opacity-70 text-xs">({dept.count})</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-64 pl-10 pr-4 py-2 bg-gray-100 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="p-2 bg-gray-100 rounded-lg sm:rounded-xl hover:bg-gray-200">
            <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Job Listings */}
        <div className="lg:col-span-7">
          <div className="space-y-4">
            {jobListings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedJob(job)}
                className={`bg-white border rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all ${
                  selectedJob?.id === job.id 
                    ? 'border-indigo-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                      {job.logo}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start sm:items-center gap-2 mb-1 flex-col sm:flex-row">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{job.title}</h3>
                        {job.featured && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSaveJob(job.id)
                    }}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bookmark className={`w-5 h-5 ${
                      savedJobs.includes(job.id) ? 'text-indigo-600 fill-current' : 'text-gray-400'
                    }`} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 sm:w-4 h-3 sm:h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 sm:w-4 h-3 sm:h-4" />
                    {job.salary}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
                  {job.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 sm:py-1 bg-gray-100 rounded sm:rounded-lg text-xs text-gray-600">
                      {tag}
                    </span>
                  ))}
                  {job.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{job.tags.length - 3}</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getRemoteColor(job.remote)}`}>
                      {job.remote}
                    </span>
                    <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                      {job.urgency === 'high' ? 'Urgent' : job.urgency === 'medium' ? 'Active' : 'Open'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    {job.applicants} applicants
                    <span>•</span>
                    {job.posted}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Job Details */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-4">
            {selectedJob ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedJob.title}</h3>
                      <p className="text-sm text-gray-600">{selectedJob.company} • {selectedJob.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const currentIndex = jobListings.findIndex(job => job.id === selectedJob.id)
                          const prevIndex = currentIndex === 0 ? jobListings.length - 1 : currentIndex - 1
                          setSelectedJob(jobListings[prevIndex])
                        }}
                        className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow group"
                        aria-label="Previous job"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const currentIndex = jobListings.findIndex(job => job.id === selectedJob.id)
                          const nextIndex = currentIndex === jobListings.length - 1 ? 0 : currentIndex + 1
                          setSelectedJob(jobListings[nextIndex])
                        }}
                        className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow group"
                        aria-label="Next job"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                      </motion.button>
                    </div>
                  </div>
                </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Job Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-medium text-gray-900">{selectedJob.experience}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-500">Salary Range</p>
                    <p className="text-sm font-medium text-gray-900">{selectedJob.salary}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-500">Work Type</p>
                    <p className="text-sm font-medium text-gray-900">{selectedJob.remote}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-900">{selectedJob.department}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600 bg-white rounded-xl p-3">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Benefits</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedJob.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 bg-white rounded-lg p-2">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  alert(`Application submitted for ${selectedJob.title} position at ${selectedJob.company}!`)
                }}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Apply Now
              </button>
              <button 
                onClick={() => selectedJob && toggleSaveJob(selectedJob.id)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
              >
                {selectedJob && savedJobs.includes(selectedJob.id) ? 'Saved' : 'Save'}
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-blue-900">
                  <span className="font-medium">{selectedJob.applicants} candidates</span> have applied • Posted {selectedJob.posted}
                </p>
              </div>
            </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a job to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {selectedJob && (
                <>
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                      {selectedJob.logo}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{selectedJob.title}</h3>
                      <p className="text-xs text-gray-600">{selectedJob.company}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Quick Info */}
                <div className="flex items-center gap-3 mb-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedJob.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedJob.type}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {selectedJob.salary}
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-medium text-gray-900">{selectedJob.experience}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Work Type</p>
                    <p className="text-sm font-medium text-gray-900">{selectedJob.remote}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Benefits</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedJob.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                        <Award className="w-3 h-3 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="p-3 bg-blue-50 rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-blue-900">
                      <span className="font-medium">{selectedJob.applicants} candidates</span> have applied
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      if (selectedJob) {
                        setApplicationJob(selectedJob)
                        setShowApplicationModal(true)
                        setSelectedJob(null)
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Apply Now
                  </button>
                  <button 
                    onClick={() => selectedJob && toggleSaveJob(selectedJob.id)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 text-sm"
                  >
                    <Bookmark className={`w-4 h-4 ${
                      selectedJob && savedJobs.includes(selectedJob.id) ? 'text-indigo-600 fill-current' : 'text-gray-400'
                    }`} />
                  </button>
                </div>
              </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Success Modal */}
      <AnimatePresence>
        {showApplicationModal && applicationJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowApplicationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Submitted!</h3>
                <p className="text-gray-600 mb-6">
                  Your application for <span className="font-medium">{applicationJob.title}</span> at <span className="font-medium">{applicationJob.company}</span> has been successfully submitted.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Continue Browsing
                  </button>
                  <button
                    onClick={() => {
                      setSavedJobs([...savedJobs, applicationJob.id])
                      setShowApplicationModal(false)
                    }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Save Job for Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default JobBoard