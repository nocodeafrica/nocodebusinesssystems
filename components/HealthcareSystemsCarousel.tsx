'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Check if device is mobile
const getIsMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768
  }
  return false
}

// Loading component
const LoadingComponent = ({ title }: { title: string }) => (
  <div className="h-[800px] md:h-[800px] h-screen bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm text-gray-400">Loading {title}...</p>
    </div>
  </div>
)

// Dynamically import healthcare components based on device type
const HospitalOperationsCenter = dynamic(() => {
  if (getIsMobile()) {
    return import('./healthcare-demos/HospitalOperationsCenterMobile')
  }
  return import('./healthcare-demos/HospitalOperationsCenter')
}, {
  ssr: false,
  loading: () => <LoadingComponent title="hospital operations" />
})

const MedicalPracticeManager = dynamic(() => {
  if (getIsMobile()) {
    return import('./healthcare-demos/MedicalPracticeManagerMobile')
  }
  return import('./healthcare-demos/MedicalPracticeManager')
}, {
  ssr: false,
  loading: () => <LoadingComponent title="practice manager" />
})

const PatientJourneyTracker = dynamic(() => {
  if (getIsMobile()) {
    return import('./healthcare-demos/PatientJourneyTrackerMobile')
  }
  return import('./healthcare-demos/PatientJourneyTracker')
}, {
  ssr: false,
  loading: () => <LoadingComponent title="patient journey" />
})

const TelehealthPlatform = dynamic(() => {
  if (getIsMobile()) {
    return import('./healthcare-demos/TelehealthPlatformMobile')
  }
  return import('./healthcare-demos/TelehealthPlatformV2')
}, {
  ssr: false,
  loading: () => <LoadingComponent title="telehealth platform" />
})

// Appointment Scheduling (mobile-first component)
const AppointmentScheduling = dynamic(() => {
  if (getIsMobile()) {
    return import('./healthcare-demos/AppointmentSchedulingMobile')
  }
  // Use mobile version for desktop too as it's responsive
  return import('./healthcare-demos/AppointmentSchedulingMobile')
}, {
  ssr: false,
  loading: () => <LoadingComponent title="appointment scheduling" />
})

const demos = [
  {
    id: 'hospital-ops',
    title: 'Hospital Operations Center',
    subtitle: 'Real-time bed capacity and ward management',
    component: HospitalOperationsCenter,
    gradient: 'from-green-500 to-blue-500',
    delay: 0
  },
  {
    id: 'practice-manager',
    title: 'Medical Practice Manager',
    subtitle: 'Complete practice and partner management',
    component: MedicalPracticeManager,
    gradient: 'from-blue-500 to-purple-500',
    delay: 0.1
  },
  {
    id: 'patient-journey',
    title: 'Patient Journey Tracker',
    subtitle: 'Admission to discharge visualization',
    component: PatientJourneyTracker,
    gradient: 'from-purple-500 to-pink-500',
    delay: 0.2
  },
  {
    id: 'telehealth',
    title: 'Telehealth Platform',
    subtitle: 'Virtual consultations with vital monitoring',
    component: TelehealthPlatform,
    gradient: 'from-indigo-500 to-blue-500',
    delay: 0.3
  }
]

const HealthcareSystemsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const CurrentDemo = demos[currentIndex].component

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? demos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === demos.length - 1 ? 0 : prev + 1))
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleBack = () => {
    // Handle back navigation for mobile
    setCurrentIndex(0)
  }

  return (
    <div className="relative">
      {/* Navigation Header - Mobile responsive */}
      <div className="mb-8">
        {/* Title and Description */}
        <div className="mb-4 md:mb-6">
          <motion.h3 
            key={demos[currentIndex].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
          >
            {demos[currentIndex].title}
          </motion.h3>
          <motion.p
            key={`${demos[currentIndex].id}-subtitle`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm md:text-base text-gray-600"
          >
            {demos[currentIndex].subtitle}
          </motion.p>
        </div>
        
        {/* Arrow Navigation - Below title/description on mobile */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all group"
            aria-label="Previous demo"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600 group-hover:text-green-600" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all group"
            aria-label="Next demo"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600 group-hover:text-green-600" />
          </motion.button>
        </div>

        {/* Navigation Dots - At the bottom */}
        <div className="flex justify-center gap-2">
          {demos.map((demo, index) => (
            <button
              key={demo.id}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-gradient-to-r ' + demo.gradient
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to ${demo.title}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {isMobile ? (
            <CurrentDemo onBack={handleBack} />
          ) : (
            <CurrentDemo />
          )}
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
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200"
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

export default HealthcareSystemsCarousel