'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion'
import { 
  ChevronUp, 
  X, 
  Search,
  Filter,
  Navigation,
  Layers,
  MapPin
} from 'lucide-react'

interface MobileMapOverlayProps {
  children: ReactNode
  miniCards?: ReactNode // Horizontal scrollable cards
  searchBar?: ReactNode
  selectedContent?: ReactNode // Content shown when item selected
  detailContent?: ReactNode // Full detail view
  onClose?: () => void
  hasSelection?: boolean
  className?: string
  headerHeight?: string // Height of the fixed header
}

type OverlayState = 'mini' | 'peek' | 'expanded' | 'hidden'

const MobileMapOverlay = ({
  children,
  miniCards,
  searchBar,
  selectedContent,
  detailContent,
  onClose,
  hasSelection = false,
  className = '',
  headerHeight = '0px'
}: MobileMapOverlayProps) => {
  const [overlayState, setOverlayState] = useState<OverlayState>('mini')
  const [dragY, setDragY] = useState(0)
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  // State heights (percentage of viewport)
  const stateHeights = {
    hidden: 100,
    mini: 80,    // 20% visible
    peek: 60,    // 40% visible
    expanded: 10 // 90% visible
  }

  // Auto-show peek state when selection made
  useEffect(() => {
    if (hasSelection && overlayState === 'mini') {
      setOverlayState('peek')
    }
  }, [hasSelection, overlayState])

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const velocity = info.velocity.y
    const offset = info.offset.y
    
    // Determine target state based on drag
    let targetState = overlayState
    
    if (Math.abs(velocity) > 500) {
      // Fast swipe
      if (velocity > 0) {
        // Swipe down
        targetState = overlayState === 'expanded' ? 'peek' : 
                     overlayState === 'peek' ? 'mini' : 'hidden'
      } else {
        // Swipe up
        targetState = overlayState === 'mini' ? 'peek' :
                     overlayState === 'peek' ? 'expanded' : 'expanded'
      }
    } else if (Math.abs(offset) > 50) {
      // Slow drag
      if (offset > 0) {
        // Drag down
        targetState = overlayState === 'expanded' ? 'peek' : 
                     overlayState === 'peek' ? 'mini' : 'hidden'
      } else {
        // Drag up
        targetState = overlayState === 'mini' ? 'peek' :
                     overlayState === 'peek' ? 'expanded' : 'expanded'
      }
    }

    setOverlayState(targetState)
    setDragY(0)
  }

  const getOverlayHeight = () => {
    return `${stateHeights[overlayState]}vh`
  }

  return (
    <>
      {/* Map Container */}
      <div className="absolute inset-0">
        {children}
      </div>

      {/* Floating Search Bar (when overlay is hidden/mini) */}
      {searchBar && (overlayState === 'hidden' || overlayState === 'mini') && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute left-4 right-4 z-20"
          style={{ top: `calc(${headerHeight} + 1rem)` }}
        >
          {searchBar}
        </motion.div>
      )}

      {/* Bottom Overlay */}
      <motion.div
        ref={containerRef}
        initial={{ y: '80vh' }}
        animate={{ 
          y: getOverlayHeight(),
          transition: { type: 'spring', damping: 30, stiffness: 300 }
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDrag={(_, info) => setDragY(info.offset.y)}
        onDragEnd={handleDragEnd}
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-30 ${className}`}
        style={{ 
          height: '100vh',
          touchAction: 'none'
        }}
      >
        {/* Drag Handle */}
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* State Indicator & Controls */}
        <div className="flex items-center justify-between px-4 pt-6 pb-3">
          <button
            onClick={() => {
              const nextState = overlayState === 'mini' ? 'peek' :
                              overlayState === 'peek' ? 'expanded' :
                              overlayState === 'expanded' ? 'peek' : 'mini'
              setOverlayState(nextState)
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronUp 
              className={`w-5 h-5 text-gray-600 transition-transform ${
                overlayState === 'expanded' ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          <span className="text-sm font-medium text-gray-500">
            {overlayState === 'mini' && 'Nearby Locations'}
            {overlayState === 'peek' && 'Location Details'}
            {overlayState === 'expanded' && 'Full Details'}
          </span>

          {onClose && overlayState !== 'mini' && (
            <button
              onClick={() => {
                setOverlayState('mini')
                onClose?.()
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Mini State - Horizontal Cards */}
          {overlayState === 'mini' && miniCards && (
            <div className="px-4 pb-4">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-3">
                  {miniCards}
                </div>
              </div>
            </div>
          )}

          {/* Peek State - Selected Content */}
          {overlayState === 'peek' && selectedContent && (
            <div className="px-4 pb-4 overflow-y-auto max-h-[40vh]">
              {selectedContent}
            </div>
          )}

          {/* Expanded State - Full Details */}
          {overlayState === 'expanded' && (detailContent || selectedContent) && (
            <div className="px-4 pb-4 overflow-y-auto max-h-[85vh]">
              {detailContent || selectedContent}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Action Buttons (floating on map) */}
      {overlayState === 'hidden' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setOverlayState('mini')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg z-20 flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          Show Locations
        </motion.button>
      )}
    </>
  )
}

// Mini Card Component for horizontal scroll
interface MiniLocationCardProps {
  title: string
  subtitle?: string
  distance?: string
  status?: 'open' | 'closed' | 'busy'
  onClick?: () => void
  isSelected?: boolean
}

export const MiniLocationCard = ({
  title,
  subtitle,
  distance,
  status = 'open',
  onClick,
  isSelected = false
}: MiniLocationCardProps) => {
  const statusColors = {
    open: 'bg-green-500',
    closed: 'bg-red-500',
    busy: 'bg-yellow-500'
  }

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        min-w-[200px] p-3 bg-white rounded-xl border-2 transition-all cursor-pointer
        ${isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 shadow-sm'}
      `}
    >
      <div className="flex items-start justify-between mb-1">
        <h4 className="text-sm font-semibold text-gray-900 truncate pr-2">{title}</h4>
        <div className={`w-2 h-2 rounded-full ${statusColors[status]} flex-shrink-0 mt-1`} />
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500 truncate">{subtitle}</p>
      )}
      {distance && (
        <p className="text-xs text-gray-400 mt-1">{distance}</p>
      )}
    </motion.div>
  )
}

// Floating Action Button Component
interface FloatingActionButtonProps {
  icon: ReactNode
  onClick: () => void
  label?: string
  position?: 'left' | 'right'
  className?: string
}

export const FloatingActionButton = ({
  icon,
  onClick,
  label,
  position = 'right',
  className = ''
}: FloatingActionButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`
        absolute ${position === 'right' ? 'right-4' : 'left-4'} 
        bg-white rounded-full shadow-lg p-3 z-20
        hover:shadow-xl transition-shadow
        ${className}
      `}
      aria-label={label}
    >
      {icon}
    </motion.button>
  )
}

export default MobileMapOverlay