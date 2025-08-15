'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Dynamically import hospitality demo components to avoid SSR issues
const HotelCommandCenter = dynamic(() => import('./hospitality-demos/HotelCommandCenter'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-slate-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading hotel command center...</p>
      </div>
    </div>
  )
})

const RestaurantOperations = dynamic(() => import('./hospitality-demos/RestaurantOperationsV4'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading restaurant operations...</p>
      </div>
    </div>
  )
})

const AirbnbHostDashboard = dynamic(() => import('./hospitality-demos/AirbnbHostDashboard'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading Airbnb dashboard...</p>
      </div>
    </div>
  )
})

const GuestExperience = dynamic(() => import('./hospitality-demos/GuestExperience'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading guest experience...</p>
      </div>
    </div>
  )
})

// Import mobile components
const HotelCommandMobile = dynamic(() => import('./hospitality-demos/HotelCommandMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-slate-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading mobile hotel command...</p>
      </div>
    </div>
  )
})

const RestaurantOpsMobile = dynamic(() => import('./hospitality-demos/RestaurantOpsMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading mobile restaurant ops...</p>
      </div>
    </div>
  )
})

const hospitalitySystems = [
  {
    id: 'hotel-command',
    title: 'Hotel Command Center',
    description: 'Real-time hotel operations with multi-floor room management, housekeeping coordination, and guest services',
    component: HotelCommandCenter,
    mobileComponent: HotelCommandMobile,
    features: ['Floor Plan Management', 'Housekeeping Tracking', 'Guest Services', 'Real-time Metrics'],
    icon: '🏨',
    color: 'from-slate-500 to-blue-500'
  },
  {
    id: 'restaurant-ops',
    title: 'Restaurant Operations',
    description: 'Interactive floor plan with real-time table management, order tracking, and kitchen coordination',
    component: RestaurantOperations,
    mobileComponent: RestaurantOpsMobile,
    features: ['Table Management', 'Order Tracking', 'Kitchen Coordination', 'Customer Analytics'],
    icon: '🍽️',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'airbnb-dashboard',
    title: 'Vacation Rental Management',
    description: 'Multi-property Airbnb management with bookings, guest communication, and revenue optimization',
    component: AirbnbHostDashboard,
    features: ['Property Management', 'Booking Calendar', 'Guest Communication', 'Revenue Analytics'],
    icon: '🏡',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'guest-experience',
    title: 'Guest Experience Platform',
    description: 'End-to-end guest journey management with personalization and service coordination',
    component: GuestExperience,
    features: ['Guest Journey', 'Service Requests', 'Personalization', 'Feedback Management'],
    icon: '⭐',
    color: 'from-emerald-500 to-teal-500'
  }
]

const HospitalitySystemsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Create systems array with mobile components where available
  const hospitalitySystemsWithMobile = hospitalitySystems.map(system => ({
    ...system,
    component: isMobile && system.mobileComponent ? system.mobileComponent : system.component
  }))
  
  const currentSystem = hospitalitySystemsWithMobile[currentIndex]
  const SystemComponent = currentSystem.component

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? hospitalitySystems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === hospitalitySystems.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative">
      {/* Navigation Header with Controls - Fixed Position */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <motion.h3 
              key={hospitalitySystems[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-semibold text-gray-800"
            >
              {hospitalitySystems[currentIndex].title}
            </motion.h3>
            <motion.p 
              key={`${hospitalitySystems[currentIndex].id}-subtitle`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm sm:text-base text-gray-600 mt-1"
            >
              {hospitalitySystems[currentIndex].description}
            </motion.p>
          </div>

          {/* Navigation Arrows - Always in same position */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
              aria-label="Previous demo"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
              aria-label="Next demo"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
            </motion.button>
          </div>
        </div>

        {/* Navigation Dots - Fixed Position */}
        <div className="flex justify-center gap-2">
          {hospitalitySystems.map((system, index) => (
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
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200"
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

export default HospitalitySystemsCarousel