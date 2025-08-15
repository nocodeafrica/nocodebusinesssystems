'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Dynamically import analytics components to avoid SSR issues
const BusinessIntelligence = dynamic(() => import('./analytics-demos/BusinessIntelligence'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading analytics...</p>
      </div>
    </div>
  )
})

const RealtimeMonitoring = dynamic(() => import('./analytics-demos/RealtimeMonitoring'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading monitoring...</p>
      </div>
    </div>
  )
})

const PredictiveAnalytics = dynamic(() => import('./analytics-demos/PredictiveAnalytics'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading predictions...</p>
      </div>
    </div>
  )
})

const CustomerAnalytics = dynamic(() => import('./analytics-demos/CustomerAnalytics'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading customer data...</p>
      </div>
    </div>
  )
})

const analyticsSystems = [
  {
    id: 'business-intelligence',
    title: 'Business Intelligence Dashboard',
    description: 'Executive KPIs, sales performance, and revenue analytics with AI-powered insights',
    component: BusinessIntelligence,
    features: ['Real-time KPIs', 'Sales Analytics', 'Revenue Tracking', 'AI Insights'],
    icon: '📊',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'realtime-monitoring',
    title: 'Real-time Operations Monitoring',
    description: 'Live system metrics, performance tracking, and automated anomaly detection',
    component: RealtimeMonitoring,
    features: ['Live Metrics', 'Alert System', 'Performance Tracking', 'Anomaly Detection'],
    icon: '📡',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'predictive-analytics',
    title: 'Predictive Analytics & Forecasting',
    description: 'ML-powered predictions, trend analysis, and future business projections',
    component: PredictiveAnalytics,
    features: ['ML Predictions', 'Trend Analysis', 'Forecasting', 'Risk Assessment'],
    icon: '🔮',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'customer-analytics',
    title: 'Customer Analytics & Insights',
    description: 'Customer segmentation, behavior analysis, and retention optimization',
    component: CustomerAnalytics,
    features: ['Segmentation', 'Behavior Analysis', 'Churn Prediction', 'CLV Analysis'],
    icon: '👥',
    color: 'from-orange-500 to-amber-500'
  }
]

const AnalyticsSystemsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSystem = analyticsSystems[currentIndex]
  const SystemComponent = currentSystem.component

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? analyticsSystems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === analyticsSystems.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative">
      {/* Navigation Header with Controls - Fixed Position */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <motion.h3 
              key={analyticsSystems[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800"
            >
              {analyticsSystems[currentIndex].title}
            </motion.h3>
            <motion.p 
              key={`${analyticsSystems[currentIndex].id}-subtitle`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-base text-gray-600 mt-1"
            >
              {analyticsSystems[currentIndex].description}
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
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group"
              aria-label="Next demo"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
            </motion.button>
          </div>
        </div>

        {/* Navigation Dots - Fixed Position */}
        <div className="flex justify-center gap-2">
          {analyticsSystems.map((system, index) => (
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
          {/* Analytics Component */}
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
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200"
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

export default AnalyticsSystemsCarousel