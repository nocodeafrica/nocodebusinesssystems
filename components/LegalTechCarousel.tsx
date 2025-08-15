'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Check if device is mobile
const checkIsMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

// Import mobile container
const LegalTechMobileContainer = dynamic(() => import('./legal-tech/LegalTechMobileContainer'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
})

// Dynamically import legal tech components to avoid SSR issues
const ContractIntelligence = dynamic(() => import('./legal-tech/ContractIntelligence'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-indigo-400">Loading contract intelligence...</p>
      </div>
    </div>
  )
})

const CaseTimeline = dynamic(() => import('./legal-tech/CaseTimeline'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-purple-400">Loading case timeline...</p>
      </div>
    </div>
  )
})

const LegalDocumentChat = dynamic(() => import('./legal-tech/LegalDocumentChat'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-blue-400">Loading document chat...</p>
      </div>
    </div>
  )
})

const ComplianceMonitoring = dynamic(() => import('./legal-tech/ComplianceMonitoring'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-emerald-400">Loading compliance monitoring...</p>
      </div>
    </div>
  )
})

const DigitalCourtRoom = dynamic(() => import('./legal-tech/DigitalCourtRoom'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-slate-900 via-rose-900 to-slate-900 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-rose-400">Loading digital court room...</p>
      </div>
    </div>
  )
})

const legalTechSystems = [
  {
    id: 'contract-intelligence',
    title: 'Contract Intelligence',
    subtitle: 'AI-powered contract analysis and risk detection',
    component: ContractIntelligence,
    gradient: 'from-indigo-600 to-purple-600'
  },
  {
    id: 'case-timeline',
    title: 'Case Timeline Visualizer',
    subtitle: 'Interactive timeline with evidence and document connections',
    component: CaseTimeline,
    gradient: 'from-purple-600 to-violet-600'
  },
  {
    id: 'legal-chat',
    title: 'Legal Document Chat',
    subtitle: 'Chat with case files and instant citation lookup',
    component: LegalDocumentChat,
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'compliance',
    title: 'Compliance Monitoring',
    subtitle: 'Real-time regulation tracking and risk heat maps',
    component: ComplianceMonitoring,
    gradient: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'court-room',
    title: 'Digital Court Room',
    subtitle: 'Virtual evidence presentation and 3D reconstruction',
    component: DigitalCourtRoom,
    gradient: 'from-rose-600 to-pink-600'
  }
]

const LegalTechCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const CurrentComponent = legalTechSystems[currentIndex].component

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsMobile())
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % legalTechSystems.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + legalTechSystems.length) % legalTechSystems.length)
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  // For mobile, render the mobile container with all sections
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <LegalTechMobileContainer onBack={() => window.history.back()} />
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Navigation Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h3 
              key={legalTechSystems[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              {legalTechSystems[currentIndex].title}
            </motion.h3>
            <motion.p
              key={`${legalTechSystems[currentIndex].id}-subtitle`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600"
            >
              {legalTechSystems[currentIndex].subtitle}
            </motion.p>
          </div>
          
          {/* Arrow Navigation */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Previous system"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Next system"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </motion.button>
          </div>
        </div>

        {/* System Selector Pills */}
        <div className="flex flex-wrap gap-3">
          {legalTechSystems.map((system, index) => (
            <motion.button
              key={system.id}
              onClick={() => handleDotClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                index === currentIndex
                  ? `bg-gradient-to-r ${system.gradient} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {system.title}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Component Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <CurrentComponent />
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {legalTechSystems.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all ${
              index === currentIndex
                ? 'w-8 h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full'
                : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
            }`}
            aria-label={`Go to ${legalTechSystems[index].title}`}
          />
        ))}
      </div>

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
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200"
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

export default LegalTechCarousel