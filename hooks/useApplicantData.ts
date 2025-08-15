import { useState, useEffect } from 'react'

export interface Candidate {
  id: number
  name: string
  avatar: string
  position: string
  email: string
  phone: string
  location: string
  experience: string
  education: string
  skills: string[]
  appliedDate: string
  resumeScore: number
  status: string
  source: string
  notes?: string
  interviewDate?: string
  testScore?: number
  offerAmount?: string
}

export interface PipelineStage {
  id: string
  name: string
  count: number
  color: string
}

// Pipeline stages configuration
export const pipelineStages: PipelineStage[] = [
  { id: 'applied', name: 'Applied', count: 142, color: 'bg-gray-500' },
  { id: 'screening', name: 'Screening', count: 89, color: 'bg-blue-500' },
  { id: 'interview', name: 'Interview', count: 45, color: 'bg-purple-500' },
  { id: 'assessment', name: 'Assessment', count: 28, color: 'bg-orange-500' },
  { id: 'offer', name: 'Offer', count: 12, color: 'bg-green-500' },
  { id: 'hired', name: 'Hired', count: 8, color: 'bg-emerald-600' }
]

// Mock candidates data
const candidatesData: Record<string, Candidate[]> = {
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

export const useApplicantData = () => {
  const [candidates, setCandidates] = useState(candidatesData)
  const [selectedStage, setSelectedStage] = useState('applied')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    position: '',
    location: '',
    minScore: 0,
    experience: ''
  })

  // Get candidates by stage
  const getCandidatesByStage = (stage: string): Candidate[] => {
    return candidates[stage as keyof typeof candidates] || []
  }

  // Search and filter candidates
  const getFilteredCandidates = (stage: string): Candidate[] => {
    let stageCandidates = getCandidatesByStage(stage)
    
    // Apply search
    if (searchQuery) {
      stageCandidates = stageCandidates.filter(candidate =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    // Apply filters
    if (filters.position) {
      stageCandidates = stageCandidates.filter(candidate =>
        candidate.position.toLowerCase().includes(filters.position.toLowerCase())
      )
    }
    
    if (filters.location) {
      stageCandidates = stageCandidates.filter(candidate =>
        candidate.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }
    
    if (filters.minScore > 0) {
      stageCandidates = stageCandidates.filter(candidate =>
        candidate.resumeScore >= filters.minScore
      )
    }
    
    return stageCandidates
  }

  // Move candidate to different stage
  const moveCandidate = (candidateId: number, fromStage: string, toStage: string) => {
    setCandidates(prev => {
      const candidate = prev[fromStage as keyof typeof prev].find(c => c.id === candidateId)
      if (!candidate) return prev
      
      const newCandidates = { ...prev }
      // Remove from current stage
      newCandidates[fromStage as keyof typeof newCandidates] = prev[fromStage as keyof typeof prev].filter(c => c.id !== candidateId)
      // Add to new stage
      newCandidates[toStage as keyof typeof newCandidates] = [...prev[toStage as keyof typeof prev], candidate]
      
      return newCandidates
    })
  }

  // Advance candidate to next stage
  const advanceCandidate = (candidateId: number, currentStage: string) => {
    const stageIndex = pipelineStages.findIndex(s => s.id === currentStage)
    if (stageIndex < pipelineStages.length - 1) {
      const nextStage = pipelineStages[stageIndex + 1].id
      moveCandidate(candidateId, currentStage, nextStage)
    }
  }

  // Reject candidate
  const rejectCandidate = (candidateId: number, currentStage: string) => {
    setCandidates(prev => ({
      ...prev,
      [currentStage]: prev[currentStage as keyof typeof prev].filter(c => c.id !== candidateId)
    }))
  }

  // Update candidate data
  const updateCandidate = (candidateId: number, stage: string, updates: Partial<Candidate>) => {
    setCandidates(prev => ({
      ...prev,
      [stage]: prev[stage as keyof typeof prev].map(c => 
        c.id === candidateId ? { ...c, ...updates } : c
      )
    }))
  }

  // Get statistics
  const getStatistics = () => {
    const totalCandidates = Object.values(candidates).flat().length
    const avgScore = Object.values(candidates).flat().reduce((acc, c) => acc + c.resumeScore, 0) / totalCandidates || 0
    const topSources = Object.values(candidates).flat().reduce((acc, c) => {
      acc[c.source] = (acc[c.source] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalCandidates,
      avgScore: Math.round(avgScore),
      topSources,
      stageDistribution: pipelineStages.map(stage => ({
        ...stage,
        count: getCandidatesByStage(stage.id).length
      }))
    }
  }

  // Helper functions
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusDetails = (status: string) => {
    const statusMap = {
      'new': { icon: 'AlertCircle', color: 'blue', label: 'New Application' },
      'in-review': { icon: 'Clock', color: 'yellow', label: 'Under Review' },
      'scheduled': { icon: 'Calendar', color: 'purple', label: 'Interview Scheduled' },
      'testing': { icon: 'FileText', color: 'orange', label: 'Assessment in Progress' },
      'offer-sent': { icon: 'CheckCircle', color: 'green', label: 'Offer Extended' },
      'hired': { icon: 'Award', color: 'emerald', label: 'Hired' }
    }
    return statusMap[status as keyof typeof statusMap] || { icon: 'User', color: 'gray', label: 'Unknown' }
  }

  return {
    // Data
    candidates,
    pipelineStages,
    selectedStage,
    searchQuery,
    filters,
    
    // Setters
    setSelectedStage,
    setSearchQuery,
    setFilters,
    
    // Functions
    getCandidatesByStage,
    getFilteredCandidates,
    moveCandidate,
    advanceCandidate,
    rejectCandidate,
    updateCandidate,
    getStatistics,
    
    // Helpers
    getScoreColor,
    getStatusDetails
  }
}