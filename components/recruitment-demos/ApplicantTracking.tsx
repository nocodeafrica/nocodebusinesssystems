'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
  AlertCircle
} from 'lucide-react'

// Candidate pipeline stages
const pipelineStages = [
  { id: 'applied', name: 'Applied', count: 142, color: 'bg-gray-500' },
  { id: 'screening', name: 'Screening', count: 89, color: 'bg-blue-500' },
  { id: 'interview', name: 'Interview', count: 45, color: 'bg-purple-500' },
  { id: 'assessment', name: 'Assessment', count: 28, color: 'bg-orange-500' },
  { id: 'offer', name: 'Offer', count: 12, color: 'bg-green-500' },
  { id: 'hired', name: 'Hired', count: 8, color: 'bg-emerald-600' }
]

// Candidates data
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

const ApplicantTracking = () => {
  const [selectedStage, setSelectedStage] = useState('applied')
  const [selectedCandidate, setSelectedCandidate] = useState(candidatesData.applied[0])
  const [searchQuery, setSearchQuery] = useState('')

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
    <div className="bg-white rounded-3xl p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Applicant Tracking System</h2>
          <p className="text-sm text-gray-500 mt-1">Manage candidates through your hiring pipeline</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px]">
            <Download className="w-4 h-4" />
            <span className="sm:inline">Export</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 min-h-[44px]">
            <Users className="w-4 h-4" />
            <span className="sm:inline">Import Candidates</span>
          </button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="mb-6 md:mb-8 bg-gray-50 rounded-2xl p-3 md:p-4">
        <div className="overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] md:min-w-0">
            {pipelineStages.map((stage, index) => (
              <div key={stage.id} className="flex-1 relative">
                <button
                  onClick={() => setSelectedStage(stage.id)}
                  className={`w-full p-3 md:p-4 rounded-xl transition-all min-h-[80px] ${
                    selectedStage === stage.id ? 'bg-white shadow-lg' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="text-xl md:text-2xl font-bold text-gray-900">{stage.count}</span>
                  </div>
                  <p className="text-xs md:text-sm font-medium text-gray-700">{stage.name}</p>
                </button>
                {index < pipelineStages.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Candidates List */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-2xl p-3 md:p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                {pipelineStages.find(s => s.id === selectedStage)?.name} Candidates
              </h3>
              <button className="p-2 hover:bg-gray-200 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 md:py-2 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[44px]"
              />
            </div>

            <div className="space-y-3 max-h-[400px] md:max-h-[500px] overflow-y-auto">
              {getCandidatesByStage(selectedStage).map((candidate) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`relative bg-white rounded-xl p-3 md:p-4 cursor-pointer transition-all duration-200 min-h-[80px] ${
                    selectedCandidate.id === candidate.id 
                      ? 'bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 shadow-xl border-l-4 border-indigo-500 scale-[1.02]' 
                      : 'hover:shadow-lg border-l-4 border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className={`text-sm font-semibold truncate ${
                            selectedCandidate.id === candidate.id ? 'text-indigo-900' : 'text-gray-900'
                          }`}>{candidate.name}</h4>
                          <p className={`text-xs truncate ${
                            selectedCandidate.id === candidate.id ? 'text-indigo-600' : 'text-gray-600'
                          }`}>{candidate.position}</p>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          {getStatusIcon(candidate.status)}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${getScoreColor(candidate.resumeScore)}`}>
                          {candidate.resumeScore}% match
                        </span>
                        <span className="text-xs text-gray-500">{candidate.appliedDate}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Candidate Details */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm">
            {/* Candidate Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedCandidate.avatar}
                    alt={selectedCandidate.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl mx-auto sm:mx-0 object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">{selectedCandidate.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedCandidate.position}</p>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedCandidate.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {selectedCandidate.experience}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6">
              <button className="px-3 py-3 md:px-4 md:py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2 min-h-[44px]">
                <ThumbsUp className="w-4 h-4" />
                <span className="hidden sm:inline">Advance</span>
              </button>
              <button className="px-3 py-3 md:px-4 md:py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2 min-h-[44px]">
                <ThumbsDown className="w-4 h-4" />
                <span className="hidden sm:inline">Reject</span>
              </button>
              <button className="px-3 py-3 md:px-4 md:py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-2 min-h-[44px]">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Schedule</span>
              </button>
              <button className="px-3 py-3 md:px-4 md:py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 min-h-[44px]">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Email</span>
              </button>
            </div>

            {/* Candidate Information Tabs */}
            <div className="space-y-4 md:space-y-6">
              {/* Contact & Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <h4 className="text-sm md:text-base font-semibold text-gray-700 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 break-all">{selectedCandidate.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">{selectedCandidate.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">{selectedCandidate.source}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="text-sm md:text-base font-semibold text-gray-700 mb-3">Education & Experience</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">{selectedCandidate.education}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">{selectedCandidate.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Score: {selectedCandidate.resumeScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl p-4">
                <h4 className="text-sm md:text-base font-semibold text-gray-700 mb-3">Skills & Competencies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume & Documents */}
              <div className="bg-white rounded-xl p-4">
                <h4 className="text-sm md:text-base font-semibold text-gray-700 mb-3">Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-h-[60px]">
                    <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">Resume.pdf</p>
                      <p className="text-xs text-gray-500">Uploaded 2 days ago</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-h-[60px]">
                    <Paperclip className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">Portfolio.zip</p>
                      <p className="text-xs text-gray-500">15 MB</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-xl p-4">
                <h4 className="text-sm md:text-base font-semibold text-gray-700 mb-3">Activity Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">Application received</p>
                      <p className="text-xs text-gray-500">{selectedCandidate.appliedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">Resume screened - {selectedCandidate.resumeScore}% match</p>
                      <p className="text-xs text-gray-500">Automated screening</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicantTracking