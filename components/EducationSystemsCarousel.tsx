'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { 
  ChevronLeft, ChevronRight, Loader2
} from 'lucide-react'

// Dynamic imports for education demo components - Desktop
const SmartClassroomHub = dynamic(() => import('./education-demos/SmartClassroomHubCompact'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  )
})

// Dynamic imports for mobile education components
const SmartClassroomMobile = dynamic(() => import('./education-mobile/SmartClassroomMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  )
})

const StudentPerformanceMobile = dynamic(() => import('./education-mobile/StudentPerformanceMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
    </div>
  )
})

const ParentPortalMobile = dynamic(() => import('./education-mobile/ParentPortalMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  )
})

const AITutorMobile = dynamic(() => import('./education-mobile/AITutorMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
    </div>
  )
})

const TeacherLessonPlannerMobile = dynamic(() => import('./education-mobile/TeacherLessonPlannerMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
    </div>
  )
})

const StudentPerformanceAnalytics = dynamic(() => import('./education-demos/StudentPerformanceAnalytics'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
    </div>
  )
})

const ParentPortal = dynamic(() => import('./education-demos/ParentPortal'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  )
})

const AISubjectTutor = dynamic(() => import('./education-demos/AISubjectTutor'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
    </div>
  )
})

const TeacherLessonPlanner = dynamic(() => import('./education-demos/TeacherLessonPlanner'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
    </div>
  )
})

const educationSystems = [
  {
    id: 'classroom-hub',
    title: 'Smart Classroom Hub',
    description: 'Virtual classroom management with real-time engagement tracking and collaboration tools',
    component: SmartClassroomHub,
    mobileComponent: SmartClassroomMobile
  },
  {
    id: 'student-analytics',
    title: 'Student Performance Analytics',
    description: 'Comprehensive academic tracking with predictive insights and learning path optimization',
    component: StudentPerformanceAnalytics,
    mobileComponent: StudentPerformanceMobile
  },
  {
    id: 'parent-portal',
    title: 'Parent Portal',
    description: 'Multi-child dashboard for homework, grades, events, and school communication',
    component: ParentPortal,
    mobileComponent: ParentPortalMobile
  },
  {
    id: 'ai-tutor',
    title: 'AI Subject Tutor',
    description: 'Personalized learning with subject-specific AI assistance and mathematical equation support',
    component: AISubjectTutor,
    mobileComponent: AITutorMobile
  },
  {
    id: 'lesson-planner',
    title: 'Teacher Lesson Planner',
    description: 'CAPS-aligned curriculum planning with resource management and collaboration tools',
    component: TeacherLessonPlanner,
    mobileComponent: TeacherLessonPlannerMobile
  }
]

const EducationSystemsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handlePrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev === 0 ? educationSystems.length - 1 : prev - 1))
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev === educationSystems.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const CurrentComponent = isMobile && educationSystems[currentIndex].mobileComponent 
    ? educationSystems[currentIndex].mobileComponent 
    : educationSystems[currentIndex].component

  return (
    <div className="relative">
      {/* Clean Header Section */}
      <div className="mb-6">
        {/* Title */}
        <motion.h3
          key={educationSystems[currentIndex].id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-2"
        >
          {educationSystems[currentIndex].title}
        </motion.h3>
        
        {/* Description */}
        <motion.p
          key={`${educationSystems[currentIndex].id}-desc`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm sm:text-base text-gray-600 text-center mb-6 max-w-3xl mx-auto px-4"
        >
          {educationSystems[currentIndex].description}
        </motion.p>
        
        {/* Navigation Arrows */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
            aria-label="Previous demo"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
            aria-label="Next demo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-2">
          {educationSystems.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning && index !== currentIndex) {
                  setIsTransitioning(true)
                  setCurrentIndex(index)
                  setTimeout(() => setIsTransitioning(false), 500)
                }
              }}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full'
                  : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
              }`}
              aria-label={`Go to ${educationSystems[index].title}`}
            />
          ))}
        </div>
      </div>


      {/* Component Display Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={isMobile ? "min-h-screen -mx-4" : "min-h-[700px]"}
        >
          <CurrentComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default EducationSystemsCarousel