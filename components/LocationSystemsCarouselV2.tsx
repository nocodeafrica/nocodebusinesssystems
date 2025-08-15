'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Dynamically import location demos to avoid SSR issues
const FleetCommandCenter = dynamic(() => import('./location-demos/FleetCommandCenterV3'), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-white rounded-3xl flex items-center justify-center border border-gray-200">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading Fleet Command...</p>
      </div>
    </div>
  )
})

const BusinessLocatorMap = dynamic(() => import('./location-demos/ModernBusinessLocatorV2'), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-white rounded-3xl flex items-center justify-center border border-gray-200">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  )
})

const RealEstateHeatMap = dynamic(() => import('./location-demos/RealEstateHeatMapV2'), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-white rounded-3xl flex items-center justify-center border border-gray-200">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading market data...</p>
      </div>
    </div>
  )
})

const TerritoryManagement = dynamic(() => import('./location-demos/SAAdministrativeMapV3'), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-white rounded-3xl flex items-center justify-center border border-gray-200">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading territory management...</p>
      </div>
    </div>
  )
})

const StoreAnalytics = dynamic(() => import('./location-demos/StoreAnalyticsV4'), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-white rounded-3xl flex items-center justify-center border border-gray-200">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading store analytics...</p>
      </div>
    </div>
  )
})

const locationSystems = [
  {
    id: 'business-locator',
    title: 'Modern Store Locator',
    subtitle: 'Beautiful store finder with filters and real-time status',
    component: BusinessLocatorMap,
    gradient: 'from-green-600 to-emerald-600'
  },
  {
    id: 'fleet-command',
    title: 'Fleet Command Center',
    subtitle: 'Advanced fleet management with real-time tracking and analytics',
    component: FleetCommandCenter,
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'real-estate-heatmap',
    title: 'Real Estate Heat Map',
    subtitle: 'Property market analytics with heat maps and pricing trends',
    component: RealEstateHeatMap,
    gradient: 'from-orange-600 to-red-600'
  },
  {
    id: 'territory-management',
    title: 'SA Administrative Boundaries',
    subtitle: 'Explore provinces, districts, municipalities, and wards',
    component: TerritoryManagement,
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    id: 'store-analytics',
    title: 'Store Analytics',
    subtitle: 'Location intelligence for site selection and analysis',
    component: StoreAnalytics,
    gradient: 'from-indigo-600 to-blue-600'
  }
]

const LocationSystemsCarouselV2 = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const CurrentComponent = locationSystems[currentIndex].component

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % locationSystems.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + locationSystems.length) % locationSystems.length)
  }

  const handleTabClick = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative">
      {/* System Navigation Tabs at TOP - Fixed Position - Hide on mobile */}
      {!isMobile && (
        <div className="mb-6 flex items-center justify-center gap-3 flex-wrap">
          {locationSystems.map((system, index) => (
            <motion.button
              key={system.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabClick(index)}
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
      )}

      {/* Navigation Header - Title and Subtitle only on desktop with arrows */}
      <div className="mb-8">
        {!isMobile ? (
          // Desktop layout - keep existing
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h3 
                key={locationSystems[currentIndex].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-semibold text-gray-800"
              >
                {locationSystems[currentIndex].title}
              </motion.h3>
              <motion.p 
                key={`${locationSystems[currentIndex].id}-subtitle`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 mt-1"
              >
                {locationSystems[currentIndex].subtitle}
              </motion.p>
            </div>

            {/* Navigation Arrows - Desktop position */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
                aria-label="Previous demo"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
                aria-label="Next demo"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </motion.button>
            </div>
          </div>
        ) : (
          // Mobile layout - Title and subtitle only
          <div className="text-center mb-6">
            <motion.h3 
              key={locationSystems[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-semibold text-gray-800"
            >
              {locationSystems[currentIndex].title}
            </motion.h3>
            <motion.p 
              key={`${locationSystems[currentIndex].id}-subtitle`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mt-1 text-sm px-4"
            >
              {locationSystems[currentIndex].subtitle}
            </motion.p>
          </div>
        )}

        {/* Progress Indicators with Navigation for Mobile */}
        <div className="space-y-4">
          {/* Mobile: Dots with arrows on sides */}
          {isMobile ? (
            <div className="flex items-center justify-center gap-3">
              {/* Left Arrow */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
                aria-label="Previous demo"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </motion.button>

              {/* Dots Indicator */}
              <div className="flex items-center justify-center gap-2">
                {locationSystems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleTabClick(index)}
                    className={`transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-8 h-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full' 
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                    }`}
                    aria-label={`Go to ${locationSystems[index].title}`}
                  />
                ))}
              </div>

              {/* Right Arrow */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
                aria-label="Next demo"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </motion.button>
            </div>
          ) : (
            // Desktop: Just dots
            <div className="flex items-center justify-center gap-2">
              {locationSystems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleTabClick(index)}
                  className={`transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 h-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full' 
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                  }`}
                  aria-label={`Go to ${locationSystems[index].title}`}
                />
              ))}
            </div>
          )}

          {/* Progress Bar - Show on desktop only */}
          {!isMobile && (
            <div className="w-full bg-gray-200 rounded-full h-1">
              <motion.div 
                className="h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
                initial={{ width: '20%' }}
                animate={{ width: `${((currentIndex + 1) / locationSystems.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Demo Component Container - Variable Height */}
      <AnimatePresence mode="wait">
        <motion.div
          key={locationSystems[currentIndex].id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
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

export default LocationSystemsCarouselV2