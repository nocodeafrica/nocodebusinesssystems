'use client'

import { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Map as MapIcon, List, Search, Filter, Navigation } from 'lucide-react'

interface MobileInteractiveMapModalProps {
  isOpen: boolean
  onClose: () => void
  mapComponent: ReactNode
  listComponent: ReactNode
  title?: string
  subtitle?: string
}

const MobileInteractiveMapModal = ({
  isOpen,
  onClose,
  mapComponent,
  listComponent,
  title = 'Explore Locations',
  subtitle
}: MobileInteractiveMapModalProps) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list')
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex border-t border-gray-100">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Map View
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="absolute top-[120px] bottom-0 left-0 right-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {viewMode === 'list' ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full overflow-y-auto bg-gray-50"
                >
                  {listComponent}
                </motion.div>
              ) : (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full relative"
                >
                  {mapComponent}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Floating Action Button (for map view) */}
          {viewMode === 'map' && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setViewMode('list')}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white rounded-full shadow-lg flex items-center gap-2 text-sm font-medium text-gray-700 hover:shadow-xl transition-shadow"
            >
              <List className="w-4 h-4" />
              Show List
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileInteractiveMapModal