'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Dynamically import recruitment management components to avoid SSR issues
const JobBoard = dynamic(() => import('./recruitment-demos/JobBoard'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading job board...</p>
      </div>
    </div>
  )
})

const ApplicantTracking = dynamic(() => import('./recruitment-demos/ApplicantTracking'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading applicant tracking...</p>
      </div>
    </div>
  )
})

const InterviewScheduler = dynamic(() => import('./recruitment-demos/InterviewScheduler'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading interview scheduler...</p>
      </div>
    </div>
  )
})

const TalentPipeline = dynamic(() => import('./recruitment-demos/TalentPipeline'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading talent pipeline...</p>
      </div>
    </div>
  )
})

const RecruitmentAnalytics = dynamic(() => import('./recruitment-demos/RecruitmentAnalytics'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading recruitment analytics...</p>
      </div>
    </div>
  )
})

const recruitmentSystems = [
  {
    id: 'job-board',
    title: 'Job Board & Postings',
    description: 'Modern job listings with smart filtering and application management',
    component: JobBoard,
    features: ['Job Postings', 'Smart Filters', 'Application Portal', 'Career Page'],
    icon: '💼',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'applicant-tracking',
    title: 'Applicant Tracking System',
    description: 'End-to-end candidate management with AI-powered resume screening',
    component: ApplicantTracking,
    features: ['Resume Parsing', 'Candidate Pipeline', 'Automated Screening', 'Collaboration Tools'],
    icon: '📋',
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'interview-scheduler',
    title: 'Interview Management',
    description: 'Streamlined interview scheduling with calendar integration and feedback',
    component: InterviewScheduler,
    features: ['Calendar Sync', 'Panel Coordination', 'Video Integration', 'Feedback Forms'],
    icon: '📅',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'talent-pipeline',
    title: 'Talent Pipeline',
    description: 'Build and nurture talent pools for future hiring needs',
    component: TalentPipeline,
    features: ['Talent Pools', 'Skill Matching', 'Engagement Tracking', 'Succession Planning'],
    icon: '🎯',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'recruitment-analytics',
    title: 'Recruitment Analytics',
    description: 'Data-driven insights to optimize your hiring process',
    component: RecruitmentAnalytics,
    features: ['Time to Hire', 'Source Analytics', 'Quality Metrics', 'Diversity Reports'],
    icon: '📊',
    color: 'from-pink-500 to-rose-500'
  }
]

const RecruitmentSystemsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSystem = recruitmentSystems[currentIndex]
  const SystemComponent = currentSystem.component

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? recruitmentSystems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === recruitmentSystems.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative">
      {/* Navigation Header with Controls - Fixed Position */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h3 
              key={recruitmentSystems[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold text-gray-800"
            >
              {recruitmentSystems[currentIndex].title}
            </motion.h3>
            <motion.p 
              key={`${recruitmentSystems[currentIndex].id}-subtitle`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mt-1"
            >
              {recruitmentSystems[currentIndex].description}
            </motion.p>
          </div>

          {/* Navigation Arrows - Always in same position */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
              aria-label="Previous demo"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
              aria-label="Next demo"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
            </motion.button>
          </div>
        </div>

        {/* Navigation Dots - Fixed Position */}
        <div className="flex justify-center gap-2">
          {recruitmentSystems.map((system, index) => (
            <button
              key={system.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-gradient-to-r ' + system.color
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to ${system.title}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSystem.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Component Display */}
          <SystemComponent />
        </motion.div>
      </AnimatePresence>

      {/* Call to Action Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <motion.a
          href="https://calendly.com/ncbs-demo/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Book a Meeting
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.a>
        <p className="mt-3 text-sm text-gray-500">
          Schedule your free consultation • No credit card required
        </p>
      </motion.div>
    </div>
  )
}

export default RecruitmentSystemsCarousel