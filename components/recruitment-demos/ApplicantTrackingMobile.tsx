'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users,
  User,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Filter,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Paperclip,
  Award,
  Briefcase,
  GraduationCap,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  X,
  ChevronDown
} from 'lucide-react'

// Reuse data from desktop version
const pipelineStages = [
  { id: 'applied', name: 'Applied', count: 142, color: 'bg-gray-500' },
  { id: 'screening', name: 'Screening', count: 89, color: 'bg-blue-500' },
  { id: 'interview', name: 'Interview', count: 45, color: 'bg-purple-500' },
  { id: 'assessment', name: 'Assessment', count: 28, color: 'bg-orange-500' },
  { id: 'offer', name: 'Offer', count: 12, color: 'bg-green-500' },
  { id: 'hired', name: 'Hired', count: 8, color: 'bg-emerald-600' }
]

const candidatesData = {
  applied: [
    {
      id: 1,
      name: 'Alex Thompson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      position: 'Senior Software Engineer',
      email: 'alex.t@email.com',
      phone: '+1 555-0123',
      location: 'Cape Town, WC',
      experience: '8 years',
      education: 'MS Computer Science',
      skills: ['React', 'Node.js', 'AWS'],
      appliedDate: '2 hours ago',
      resumeScore: 92,
      status: 'new',
      source: 'LinkedIn'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?img=5',
      position: 'Product Designer',
      email: 'sarah.c@email.com',
      phone: '+1 555-0124',
      location: 'New York, NY',
      experience: '5 years',
      education: 'BFA Design',
      skills: ['Figma', 'UI/UX', 'Prototyping'],
      appliedDate: '5 hours ago',
      resumeScore: 88,
      status: 'new',
      source: 'Company Website'
    }
  ],
  screening: [
    {
      id: 3,
      name: 'Michael Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      position: 'Marketing Manager',
      email: 'michael.j@email.com',
      phone: '+1 555-0125',
      location: 'Austin, TX',
      experience: '6 years',
      education: 'MBA Marketing',
      skills: ['Digital Marketing', 'SEO', 'Analytics'],
      appliedDate: '1 day ago',
      resumeScore: 85,
      status: 'in-review',
      source: 'Indeed',
      notes: 'Strong background in B2B marketing'
    }
  ],
  interview: [
    {
      id: 4,
      name: 'Emily Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=9',
      position: 'Data Scientist',
      email: 'emily.r@email.com',
      phone: '+1 555-0126',
      location: 'Seattle, WA',
      experience: '4 years',
      education: 'PhD Statistics',
      skills: ['Python', 'ML', 'SQL'],
      appliedDate: '3 days ago',
      resumeScore: 94,
      status: 'scheduled',
      source: 'Referral',
      interviewDate: 'Nov 25, 2:00 PM'
    }
  ],
  assessment: [
    {
      id: 5,
      name: 'David Kim',
      avatar: 'https://i.pravatar.cc/150?img=11',
      position: 'Senior Software Engineer',
      email: 'david.k@email.com',
      phone: '+1 555-0127',
      location: 'Remote',
      experience: '7 years',
      education: 'BS Computer Science',
      skills: ['Java', 'Spring', 'Kubernetes'],
      appliedDate: '1 week ago',
      resumeScore: 90,
      status: 'testing',
      source: 'GitHub Jobs',
      testScore: 87
    }
  ],
  offer: [
    {
      id: 6,
      name: 'Lisa Wang',
      avatar: 'https://i.pravatar.cc/150?img=16',
      position: 'Product Manager',
      email: 'lisa.w@email.com',
      phone: '+1 555-0128',
      location: 'Cape Town, WC',
      experience: '9 years',
      education: 'MBA',
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      appliedDate: '2 weeks ago',
      resumeScore: 96,
      status: 'offer-sent',
      source: 'AngelList',
      offerAmount: '$165,000'
    }
  ],
  hired: []
}

const ApplicantTrackingMobile = () => {
  const [selectedStage, setSelectedStage] = useState('applied')
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [detailView, setDetailView] = useState<'overview' | 'contact' | 'documents'>('overview')

  const getCandidatesByStage = (stage: string) => {
    return candidatesData[stage as keyof typeof candidatesData] || []
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'new': return <AlertCircle className="w-4 h-4 text-blue-500" />
      case 'in-review': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'scheduled': return <Calendar className="w-4 h-4 text-purple-500" />
      case 'testing': return <FileText className="w-4 h-4 text-orange-500" />
      case 'offer-sent': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-900">Applicant Tracking</h1>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Pipeline Stages - Horizontal Scroll */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {pipelineStages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${
                  selectedStage === stage.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedStage === stage.id ? 'bg-white' : stage.color
                  }`} />
                  <span className="text-sm font-medium">{stage.name}</span>
                  <span className="text-xs opacity-80">({stage.count})</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="pt-36 pb-20 px-4">
        {/* Candidates List */}
        <div className="space-y-3">
          {getCandidatesByStage(selectedStage).map((candidate) => (
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
                      <p className="text-xs text-gray-600">{candidate.position}</p>
                    </div>
                    {getStatusIcon(candidate.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(candidate.resumeScore)}`}>
                      {candidate.resumeScore}%
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{candidate.appliedDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {candidate.experience}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle advance
                  }}
                  className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-medium active:bg-green-100"
                >
                  <ThumbsUp className="w-3 h-3 mx-auto mb-0.5" />
                  Advance
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle reject
                  }}
                  className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium active:bg-red-100"
                >
                  <ThumbsDown className="w-3 h-3 mx-auto mb-0.5" />
                  Reject
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle schedule
                  }}
                  className="flex-1 py-2 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium active:bg-purple-100"
                >
                  <Calendar className="w-3 h-3 mx-auto mb-0.5" />
                  Schedule
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Candidate Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Bottom Sheet */}
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
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Candidate Header */}
              <div className="px-4 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedCandidate.avatar}
                      alt={selectedCandidate.name}
                      className="w-14 h-14 rounded-full"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{selectedCandidate.name}</h2>
                      <p className="text-sm text-gray-600">{selectedCandidate.position}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCandidate(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-100">
                {(['overview', 'contact', 'documents'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDetailView(tab)}
                    className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                      detailView === tab 
                        ? 'text-purple-600 border-b-2 border-purple-600' 
                        : 'text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="overflow-y-auto max-h-[60vh] pb-6">
                {detailView === 'overview' && (
                  <div className="p-4 space-y-4">
                    {/* Score & Status */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Match Score</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-sm font-bold ${getScoreColor(selectedCandidate.resumeScore)}`}>
                            {selectedCandidate.resumeScore}%
                          </span>
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">Applied</p>
                        <p className="text-sm font-medium text-gray-900">{selectedCandidate.appliedDate}</p>
                      </div>
                    </div>

                    {/* Experience & Education */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Experience</p>
                          <p className="text-sm font-medium text-gray-900">{selectedCandidate.experience}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Education</p>
                          <p className="text-sm font-medium text-gray-900">{selectedCandidate.education}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Location</p>
                          <p className="text-sm font-medium text-gray-900">{selectedCandidate.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill: string) => (
                          <span key={skill} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button className="py-3 bg-green-600 text-white rounded-xl text-sm font-medium active:bg-green-700">
                        Advance to Next Stage
                      </button>
                      <button className="py-3 bg-purple-600 text-white rounded-xl text-sm font-medium active:bg-purple-700">
                        Schedule Interview
                      </button>
                    </div>
                  </div>
                )}

                {detailView === 'contact' && (
                  <div className="p-4 space-y-3">
                    <a href={`mailto:${selectedCandidate.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl active:bg-gray-100">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="text-sm font-medium text-gray-900">{selectedCandidate.email}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </a>
                    <a href={`tel:${selectedCandidate.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl active:bg-gray-100">
                      <Phone className="w-5 h-5 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{selectedCandidate.phone}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </a>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">Source</p>
                        <p className="text-sm font-medium text-gray-900">{selectedCandidate.source}</p>
                      </div>
                    </div>
                  </div>
                )}

                {detailView === 'documents' && (
                  <div className="p-4 space-y-3">
                    <button className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl w-full active:bg-gray-100">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">Resume.pdf</p>
                        <p className="text-xs text-gray-500">Uploaded 2 days ago</p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl w-full active:bg-gray-100">
                      <Paperclip className="w-5 h-5 text-purple-600" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">Portfolio.zip</p>
                        <p className="text-xs text-gray-500">15 MB</p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApplicantTrackingMobile