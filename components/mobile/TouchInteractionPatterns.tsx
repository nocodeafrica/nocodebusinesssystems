'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { motion, PanInfo, useAnimation } from 'framer-motion'

// Hook for double tap detection
export const useDoubleTap = (onDoubleTap: () => void, delay = 300) => {
  const [lastTap, setLastTap] = useState<number>(0)

  const handleTap = () => {
    const now = Date.now()
    if (now - lastTap < delay) {
      onDoubleTap()
      setLastTap(0)
    } else {
      setLastTap(now)
    }
  }

  return handleTap
}

// Hook for long press detection
export const useLongPress = (
  onLongPress: () => void,
  onPress?: () => void,
  delay = 500
) => {
  const [isLongPress, setIsLongPress] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleStart = () => {
    setIsLongPress(false)
    timeoutRef.current = setTimeout(() => {
      setIsLongPress(true)
      onLongPress()
    }, delay)
  }

  const handleEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (!isLongPress && onPress) {
      onPress()
    }
    setIsLongPress(false)
  }

  return {
    onTouchStart: handleStart,
    onTouchEnd: handleEnd,
    onMouseDown: handleStart,
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
  }
}

// Swipeable component for cards and lists
interface SwipeableProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  leftAction?: ReactNode
  rightAction?: ReactNode
  className?: string
}

export const Swipeable = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  leftAction,
  rightAction,
  className = ''
}: SwipeableProps) => {
  const [isRevealed, setIsRevealed] = useState<'left' | 'right' | null>(null)
  const controls = useAnimation()

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info
    const swipeThreshold = threshold
    const velocityThreshold = 500

    // Reset position
    controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } })

    // Determine swipe direction
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
        onSwipeRight?.()
        setIsRevealed('right')
      } else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
        onSwipeLeft?.()
        setIsRevealed('left')
      }
    } else {
      // Vertical swipe
      if (offset.y > swipeThreshold || velocity.y > velocityThreshold) {
        onSwipeDown?.()
      } else if (offset.y < -swipeThreshold || velocity.y < -velocityThreshold) {
        onSwipeUp?.()
      }
    }

    // Reset revealed state after animation
    setTimeout(() => setIsRevealed(null), 300)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left Action */}
      {leftAction && (
        <div className="absolute inset-y-0 left-0 w-20 flex items-center justify-center bg-green-500 text-white">
          {leftAction}
        </div>
      )}

      {/* Right Action */}
      {rightAction && (
        <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-red-500 text-white">
          {rightAction}
        </div>
      )}

      {/* Main Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative bg-white z-10 touch-manipulation"
      >
        {children}
      </motion.div>
    </div>
  )
}

// Pull to refresh component
interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
  className?: string
}

export const PullToRefresh = ({
  children,
  onRefresh,
  threshold = 80,
  className = ''
}: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDrag = (event: any, info: PanInfo) => {
    const container = containerRef.current
    if (!container || container.scrollTop > 0) return

    const distance = Math.max(0, info.offset.y)
    setPullDistance(Math.min(distance, threshold * 1.5))
  }

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const container = containerRef.current
    if (!container || container.scrollTop > 0) return

    if (info.offset.y > threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }

  const pullProgress = Math.min(pullDistance / threshold, 1)
  const showRefreshIndicator = pullDistance > 20

  return (
    <div className={`relative ${className}`}>
      {/* Refresh Indicator */}
      {showRefreshIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-white rounded-full shadow-lg p-3"
          style={{ y: pullDistance - 40 }}
        >
          <div 
            className={`w-6 h-6 border-2 border-gray-300 border-t-ncbs-blue rounded-full ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{ 
              transform: `rotate(${pullProgress * 360}deg)`,
              transition: isRefreshing ? 'none' : 'transform 0.2s ease-out'
            }}
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        ref={containerRef}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y: isRefreshing ? 60 : 0 }}
        className="mobile-scroll touch-manipulation"
      >
        {children}
      </motion.div>
    </div>
  )
}

// Haptic feedback hook
export const useHapticFeedback = () => {
  const triggerImpact = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if ('vibrate' in navigator) {
      const duration = style === 'light' ? 10 : style === 'medium' ? 20 : 50
      navigator.vibrate(duration)
    }
  }

  const triggerSelection = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5)
    }
  }

  const triggerNotification = (type: 'success' | 'warning' | 'error' = 'success') => {
    if ('vibrate' in navigator) {
      const pattern = type === 'success' ? [100, 50, 100] :
                    type === 'warning' ? [200, 100, 200] :
                    [300, 100, 300, 100, 300]
      navigator.vibrate(pattern)
    }
  }

  return { triggerImpact, triggerSelection, triggerNotification }
}

// Touch-friendly button component
interface TouchButtonProps {
  children: ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  haptic?: boolean
  className?: string
}

export const TouchButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  haptic = true,
  className = ''
}: TouchButtonProps) => {
  const { triggerImpact } = useHapticFeedback()

  const handleClick = () => {
    if (disabled) return
    
    if (haptic) {
      triggerImpact('light')
    }
    onClick()
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-ncbs-blue text-white hover:bg-blue-700 active:bg-blue-800'
      case 'secondary':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200'
      default:
        return 'bg-ncbs-blue text-white hover:bg-blue-700 active:bg-blue-800'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2 text-sm min-h-[36px]'
      case 'large':
        return 'px-6 py-4 text-lg min-h-[52px]'
      default:
        return 'px-4 py-3 text-base min-h-touch-target'
    }
  }

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative rounded-mobile-button font-medium transition-all duration-150
        touch-manipulation mobile-no-tap-highlight focus:outline-none focus:ring-2 focus:ring-ncbs-blue/20
        ${getVariantClasses()} ${getSizeClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-mobile-button bg-white opacity-0"
        whileTap={disabled ? {} : { opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

// Gesture detection component
interface GestureDetectorProps {
  children: ReactNode
  onPinch?: (scale: number) => void
  onRotate?: (angle: number) => void
  onPan?: (x: number, y: number) => void
  className?: string
}

export const GestureDetector = ({
  children,
  onPinch,
  onRotate,
  onPan,
  className = ''
}: GestureDetectorProps) => {
  const [initialDistance, setInitialDistance] = useState<number>(0)
  const [initialAngle, setInitialAngle] = useState<number>(0)

  const getDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0
    const touch1 = touches[0]
    const touch2 = touches[1]
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
  }

  const getAngle = (touches: React.TouchList) => {
    if (touches.length < 2) return 0
    const touch1 = touches[0]
    const touch2 = touches[1]
    return Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    ) * 180 / Math.PI
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setInitialDistance(getDistance(e.touches))
      setInitialAngle(getAngle(e.touches))
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    
    if (e.touches.length === 2 && (onPinch || onRotate)) {
      const currentDistance = getDistance(e.touches)
      const currentAngle = getAngle(e.touches)

      if (onPinch && initialDistance > 0) {
        const scale = currentDistance / initialDistance
        onPinch(scale)
      }

      if (onRotate) {
        const angleDiff = currentAngle - initialAngle
        onRotate(angleDiff)
      }
    } else if (e.touches.length === 1 && onPan) {
      const touch = e.touches[0]
      onPan(touch.clientX, touch.clientY)
    }
  }

  return (
    <div
      className={`touch-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {children}
    </div>
  )
}

export default {
  useDoubleTap,
  useLongPress,
  Swipeable,
  PullToRefresh,
  useHapticFeedback,
  TouchButton,
  GestureDetector
}