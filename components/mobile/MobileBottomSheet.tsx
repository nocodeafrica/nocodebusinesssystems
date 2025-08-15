'use client'

import { ReactNode, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { X, Minus } from 'lucide-react'

interface MobileBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  snapPoints?: number[] // Percentages of viewport height
  defaultSnapPoint?: number
  showHandle?: boolean
  showCloseButton?: boolean
  className?: string
}

const MobileBottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.4, 0.9], // 40% and 90% of viewport height
  defaultSnapPoint = 0,
  showHandle = true,
  showCloseButton = true,
  className = ''
}: MobileBottomSheetProps) => {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(defaultSnapPoint)
  const sheetRef = useRef<HTMLDivElement>(null)
  
  // Calculate height based on snap point
  const height = snapPoints[currentSnapIndex] * 100

  const handleDragEnd = (event: any, info: PanInfo) => {
    const shouldClose = info.velocity.y > 500 || (info.velocity.y > 0 && info.offset.y > 100)
    
    if (shouldClose) {
      onClose()
    } else {
      // Determine which snap point to go to
      const currentHeight = window.innerHeight * snapPoints[currentSnapIndex]
      const draggedTo = currentHeight - info.offset.y
      const viewportHeight = window.innerHeight
      
      // Find closest snap point
      let closestIndex = 0
      let closestDistance = Math.abs(draggedTo - viewportHeight * snapPoints[0])
      
      snapPoints.forEach((point, index) => {
        const distance = Math.abs(draggedTo - viewportHeight * point)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })
      
      setCurrentSnapIndex(closestIndex)
    }
  }

  // Prevent body scroll when sheet is open
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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ 
              y: `${100 - height}%`,
              transition: { type: 'spring', damping: 30, stiffness: 300 }
            }}
            exit={{ y: '100%' }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 lg:hidden ${className}`}
            style={{ height: `${height}vh` }}
          >
            {/* Handle */}
            {showHandle && (
              <div className="absolute top-0 left-0 right-0 flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
            )}
            
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{title || ''}</h3>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileBottomSheet