'use client'

import { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft } from 'lucide-react'

interface SystemTab {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType
}

interface MobileSystemsModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  tabs: SystemTab[]
  initialTab?: string
  systemColor?: string
}

const MobileSystemsModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  tabs,
  initialTab,
  systemColor = 'from-blue-500 to-cyan-500'
}: MobileSystemsModalProps) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.id || '')
  
  // Reset to initial tab when modal opens
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab)
    }
  }, [isOpen, initialTab])
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.position = 'unset'
      document.body.style.width = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.position = 'unset'
      document.body.style.width = 'unset'
    }
  }, [isOpen])

  const activeTabData = tabs.find(t => t.id === activeTab) || tabs[0]
  const ActiveComponent = activeTabData?.component

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-white"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
            {/* Title Bar */}
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors ml-3"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Tab Navigation - Scrollable horizontal */}
            {tabs.length > 1 && (
              <div className="px-4 pb-3">
                <div className="flex overflow-x-auto scrollbar-hide gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${systemColor} text-white shadow-md`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="absolute top-[120px] bottom-0 left-0 right-0 overflow-y-auto bg-gray-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                {ActiveComponent && (
                  <div className="p-4">
                    <ActiveComponent />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating Close Button (alternative) */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={onClose}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-900 text-white rounded-full shadow-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors z-30"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Services
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileSystemsModal