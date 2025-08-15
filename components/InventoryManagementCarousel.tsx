'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Dynamically import inventory management components to avoid SSR issues
const StockOverview = dynamic(() => import('./inventory-demos/StockOverview'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading stock overview...</p>
      </div>
    </div>
  )
})

const ProductCatalog = dynamic(() => import('./inventory-demos/ModernProductCatalogV2'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading product catalog...</p>
      </div>
    </div>
  )
})

const OrderManagement = dynamic(() => import('./inventory-demos/OrderManagement'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading order management...</p>
      </div>
    </div>
  )
})

// Import mobile version for warehouse management
const WarehouseMobile = dynamic(() => import('./inventory-demos/WarehouseMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading warehouse management...</p>
      </div>
    </div>
  )
})

const WarehouseManagement = dynamic(() => import('./inventory-demos/WarehouseManagement'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading warehouse management...</p>
      </div>
    </div>
  )
})

const InventoryAnalytics = dynamic(() => import('./inventory-demos/InventoryAnalytics'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading inventory analytics...</p>
      </div>
    </div>
  )
})

const inventoryManagementSystems = [
  {
    id: 'stock-overview',
    title: 'Stock Overview',
    description: 'Real-time inventory levels, stock alerts, and multi-location tracking',
    component: StockOverview,
    features: ['Stock Levels', 'Low Stock Alerts', 'Location Tracking', 'Reorder Points'],
    icon: '📦',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'product-catalog',
    title: 'Product Catalog',
    description: 'Comprehensive product database with variants, pricing, and barcode management',
    component: ProductCatalog,
    features: ['SKU Management', 'Product Variants', 'Barcode Scanning', 'Price Management'],
    icon: '🏷️',
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'order-management',
    title: 'Purchase Orders',
    description: 'Supplier management, purchase orders, and automated reordering system',
    component: OrderManagement,
    features: ['Supplier Database', 'PO Generation', 'Order Tracking', 'Auto-Reordering'],
    icon: '📋',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'warehouse-management',
    title: 'Warehouse Operations',
    description: 'Location management, stock transfers, and picking/packing workflows',
    component: WarehouseManagement,
    features: ['Bin Locations', 'Stock Transfers', 'Pick Lists', 'Cycle Counting'],
    icon: '🏭',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'inventory-analytics',
    title: 'Inventory Analytics',
    description: 'Advanced analytics with ABC analysis, turnover rates, and demand forecasting',
    component: InventoryAnalytics,
    features: ['ABC Analysis', 'Turnover Rates', 'Demand Forecasting', 'Cost Analysis'],
    icon: '📊',
    color: 'from-cyan-500 to-teal-500'
  }
]

const InventoryManagementCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Use mobile version for warehouse on mobile devices
  const inventorySystemsWithMobile = inventoryManagementSystems.map(system => {
    if (system.id === 'warehouse-management' && isMobile) {
      return { ...system, component: WarehouseMobile }
    }
    return system
  })
  
  const currentSystem = inventorySystemsWithMobile[currentIndex]
  const SystemComponent = currentSystem.component

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? inventoryManagementSystems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === inventoryManagementSystems.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative">
      {/* Navigation Header with Controls - Fixed Position */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <motion.h3 
              key={inventoryManagementSystems[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-semibold text-gray-800"
            >
              {inventoryManagementSystems[currentIndex].title}
            </motion.h3>
            <motion.p 
              key={`${inventoryManagementSystems[currentIndex].id}-subtitle`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm sm:text-base text-gray-600 mt-1"
            >
              {inventoryManagementSystems[currentIndex].description}
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

        {/* Navigation Dots - Fixed Position */}
        <div className="flex justify-center gap-2">
          {inventoryManagementSystems.map((system, index) => (
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
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200"
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

export default InventoryManagementCarousel