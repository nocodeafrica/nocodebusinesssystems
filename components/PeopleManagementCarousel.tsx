'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Dynamically import people management components to avoid SSR issues
const StaffDirectory = dynamic(() => import('./people-demos/StaffDirectory'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading staff directory...</p>
      </div>
    </div>
  )
})

const TimeTracking = dynamic(() => import('./people-demos/TimeTracking'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading time tracking...</p>
      </div>
    </div>
  )
})

const ShiftScheduler = dynamic(() => import('./people-demos/ShiftScheduler'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading shift scheduler...</p>
      </div>
    </div>
  )
})

const TeamManagement = dynamic(() => import('./people-demos/TeamManagement'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading team management...</p>
      </div>
    </div>
  )
})

const PayrollDashboard = dynamic(() => import('./people-demos/PayrollDashboard'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading payroll dashboard...</p>
      </div>
    </div>
  )
})

const peopleManagementSystems = [
  {
    id: 'time-tracking',
    title: 'Time & Attendance',
    description: 'Digital clock-in/out system with real-time tracking and attendance analytics',
    component: TimeTracking,
    features: ['Clock In/Out', 'Break Tracking', 'Overtime Monitoring', 'Attendance Reports'],
    icon: '⏰',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'shift-scheduler',
    title: 'Shift & Roster Management',
    description: 'Visual shift scheduling with drag-and-drop interface and automated conflict detection',
    component: ShiftScheduler,
    features: ['Drag & Drop Scheduling', 'Shift Swapping', 'Availability Management', 'Auto-Assignment'],
    icon: '📅',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'staff-directory',
    title: 'Employee Directory',
    description: 'Comprehensive staff management with profiles, departments, and contact information',
    component: StaffDirectory,
    features: ['Employee Profiles', 'Department Structure', 'Contact Management', 'Role Assignment'],
    icon: '👥',
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'team-management',
    title: 'Team Organization',
    description: 'Team structure visualization with collaboration tools and performance tracking',
    component: TeamManagement,
    features: ['Team Hierarchy', 'Project Assignment', 'Collaboration Hub', 'Performance Metrics'],
    icon: '🏆',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'payroll-dashboard',
    title: 'Payroll & Compensation',
    description: 'Automated payroll processing with benefits management and tax calculations',
    component: PayrollDashboard,
    features: ['Salary Processing', 'Benefits Tracking', 'Tax Management', 'Payment History'],
    icon: '💰',
    color: 'from-green-500 to-emerald-500'
  }
]

const PeopleManagementCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSystem = peopleManagementSystems[currentIndex]
  const SystemComponent = currentSystem.component

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? peopleManagementSystems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === peopleManagementSystems.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative">
      {/* Navigation Header with Controls - Fixed Position */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <div>
            <motion.h3 
              key={peopleManagementSystems[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-2xl font-semibold text-gray-800"
            >
              {peopleManagementSystems[currentIndex].title}
            </motion.h3>
            <motion.p 
              key={`${peopleManagementSystems[currentIndex].id}-subtitle`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-base text-gray-600 mt-1"
            >
              {peopleManagementSystems[currentIndex].description}
            </motion.p>
          </div>

          {/* Navigation Arrows - Always in same position */}
          <div className="flex items-center gap-2 md:gap-3 justify-center sm:justify-end">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
              aria-label="Previous demo"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-violet-600 transition-colors" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
              aria-label="Next demo"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-violet-600 transition-colors" />
            </motion.button>
          </div>
        </div>

        {/* Navigation Dots - Fixed Position */}
        <div className="flex justify-center gap-1 md:gap-2">
          {peopleManagementSystems.map((system, index) => (
            <button
              key={system.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 md:h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-6 md:w-8 bg-gradient-to-r ' + system.color
                  : 'w-1.5 md:w-2 bg-gray-300 hover:bg-gray-400'
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
        className="mt-6 md:mt-8 text-center"
      >
        <motion.a
          href="https://calendly.com/ncbs-demo/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm md:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
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
        <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-500">
          Schedule your free consultation • No credit card required
        </p>
      </motion.div>
    </div>
  )
}

export default PeopleManagementCarousel