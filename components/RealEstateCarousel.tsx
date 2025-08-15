'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Detect if we're on mobile
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

// Import mobile container
const RealEstateMobileContainer = dynamic(() => import('./real-estate/RealEstateMobileContainer'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading Real Estate Systems...</p>
      </div>
    </div>
  )
})

// Dynamically import real estate components based on device type
const PropertyListings = dynamic(() => {
  if (isMobileDevice()) {
    return import('./real-estate/PropertyListingsMobile')
  }
  return import('./real-estate/PropertyListingsMapV2')
}, {
  ssr: false,
  loading: () => (
    <div className="h-[700px] md:h-[700px] h-screen bg-white rounded-3xl md:rounded-3xl rounded-none flex items-center justify-center border border-gray-200 md:border-gray-200 border-0">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading property listings...</p>
      </div>
    </div>
  )
})

const VirtualPropertyTour = dynamic(() => {
  if (isMobileDevice()) {
    return import('./real-estate/VirtualTourMobile')
  }
  return import('./real-estate/VirtualPropertyTourV2')
}, {
  ssr: false,
  loading: () => (
    <div className="h-[700px] md:h-[700px] h-screen bg-white rounded-3xl md:rounded-3xl rounded-none flex items-center justify-center border border-gray-200 md:border-gray-200 border-0">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading virtual tour...</p>
      </div>
    </div>
  )
})

const PropertyValuation = dynamic(() => import('./real-estate/PropertyValuation'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-white rounded-3xl flex items-center justify-center border border-gray-200">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading property valuation...</p>
      </div>
    </div>
  )
})

const TenantManagement = dynamic(() => import('./real-estate/TenantManagement'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-white rounded-3xl flex items-center justify-center border border-gray-200">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading tenant management...</p>
      </div>
    </div>
  )
})

const PropertyAnalytics = dynamic(() => import('./real-estate/PropertyAnalytics'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-white rounded-3xl flex items-center justify-center border border-gray-200">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading property analytics...</p>
      </div>
    </div>
  )
})

const realEstateSystems = [
  {
    id: 'virtual-tour',
    title: 'Virtual Property Tour',
    subtitle: '360° property tours with interactive floor plans',
    component: VirtualPropertyTour,
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    id: 'property-listings',
    title: 'Property Listings',
    subtitle: 'Browse and search properties across South Africa',
    component: PropertyListings,
    gradient: 'from-indigo-600 to-blue-600'
  },
  {
    id: 'property-valuation',
    title: 'Property Valuation',
    subtitle: 'AI-powered property valuations with market comparables',
    component: PropertyValuation,
    gradient: 'from-green-600 to-emerald-600'
  },
  {
    id: 'tenant-management',
    title: 'Tenant Management',
    subtitle: 'Complete tenant management with payments and maintenance',
    component: TenantManagement,
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'property-analytics',
    title: 'Property Analytics',
    subtitle: 'Portfolio analytics dashboard with revenue insights',
    component: PropertyAnalytics,
    gradient: 'from-orange-600 to-red-600'
  }
]

const RealEstateCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const CurrentComponent = realEstateSystems[currentIndex].component

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % realEstateSystems.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + realEstateSystems.length) % realEstateSystems.length)
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  // For mobile, render the mobile container with all sections
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <RealEstateMobileContainer onBack={() => window.history.back()} />
      </div>
    )
  }

  return (
    <div className="relative">
      {/* System Navigation Pills at TOP */}
      <div className="mb-6 flex items-center justify-center gap-3 flex-wrap">
        {realEstateSystems.map((system, index) => (
          <motion.button
            key={system.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDotClick(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              index === currentIndex
                ? 'bg-gradient-to-r text-white shadow-lg ' + system.gradient
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {system.title}
          </motion.button>
        ))}
      </div>

      {/* Navigation Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h3 
              key={realEstateSystems[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              {realEstateSystems[currentIndex].title}
            </motion.h3>
            <motion.p
              key={`${realEstateSystems[currentIndex].id}-subtitle`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600"
            >
              {realEstateSystems[currentIndex].subtitle}
            </motion.p>
          </div>
          
          {/* Arrow Navigation */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all group"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </motion.button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="relative">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${realEstateSystems[currentIndex].gradient} rounded-full`}
              initial={{ width: '0%' }}
              animate={{ width: `${((currentIndex + 1) / realEstateSystems.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
          
          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {realEstateSystems.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-gradient-to-r ' + realEstateSystems[currentIndex].gradient + ' rounded-full'
                    : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Component Display with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <CurrentComponent />
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
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200"
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

export default RealEstateCarousel