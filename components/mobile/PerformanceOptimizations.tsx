'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Lazy loading hook for images
export const useLazyImage = (src: string, threshold = 0.1) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return { imgRef, isLoaded, isInView, handleLoad, shouldLoad: isInView }
}

// Optimized image component
interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
  blur?: boolean
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  blur = true,
  priority = false,
  onLoad,
  onError
}: OptimizedImageProps) => {
  const { imgRef, isLoaded, shouldLoad, handleLoad } = useLazyImage(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  const handleImageLoad = () => {
    handleLoad()
    onLoad?.()
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      <AnimatePresence>
        {(!isLoaded || hasError) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          >
            {hasError ? (
              <div className="text-gray-400 text-sm">Failed to load</div>
            ) : placeholder ? (
              <img
                src={placeholder}
                alt=""
                className={`w-full h-full object-cover ${blur ? 'blur-sm' : ''}`}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Image */}
      {(shouldLoad || priority) && (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  )
}

// Virtual scrolling hook for large lists
export const useVirtualScroll = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) => {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }))
  }, [items, startIndex, endIndex])

  const totalHeight = items.length * itemHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    startIndex,
    handleScroll,
    scrollTop
  }
}

// Virtual scroll component
interface VirtualScrollProps<T> {
  items: T[]
  itemHeight: number
  height: number
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  onEndReached?: () => void
  endThreshold?: number
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  height,
  renderItem,
  className = '',
  onEndReached,
  endThreshold = 200
}: VirtualScrollProps<T>) {
  const { visibleItems, totalHeight, startIndex, handleScroll, scrollTop } = useVirtualScroll(
    items,
    itemHeight,
    height
  )

  const containerRef = useRef<HTMLDivElement>(null)

  // Handle end reached
  useEffect(() => {
    if (onEndReached && scrollTop + height >= totalHeight - endThreshold) {
      onEndReached()
    }
  }, [scrollTop, height, totalHeight, endThreshold, onEndReached])

  return (
    <div
      ref={containerRef}
      className={`mobile-scroll ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}

// Debounced input hook
export const useDebouncedValue = <T,>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttled scroll hook
export const useThrottledScroll = (callback: (scrollY: number) => void, delay = 16) => {
  const lastCall = useRef(0)

  const throttledCallback = useCallback((scrollY: number) => {
    const now = Date.now()
    if (now - lastCall.current >= delay) {
      callback(scrollY)
      lastCall.current = now
    }
  }, [callback, delay])

  useEffect(() => {
    const handleScroll = () => {
      throttledCallback(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [throttledCallback])
}

// Intersection observer hook for lazy loading
export const useIntersectionObserver = (
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) => {
  const [element, setElement] = useState<Element | null>(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      { threshold: 0.1, ...options }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, callback, options])

  return setElement
}

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<{
    renderTime: number
    memoryUsage?: number
    fps: number
  }>({
    renderTime: 0,
    fps: 0
  })

  const startTime = useRef<number>(0)
  const frameCount = useRef<number>(0)
  const lastTime = useRef<number>(0)

  const startRender = useCallback(() => {
    startTime.current = performance.now()
  }, [])

  const endRender = useCallback(() => {
    const renderTime = performance.now() - startTime.current
    setMetrics(prev => ({ ...prev, renderTime }))
  }, [])

  const measureFPS = useCallback(() => {
    const now = performance.now()
    frameCount.current++

    if (now - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current))
      setMetrics(prev => ({ ...prev, fps }))
      frameCount.current = 0
      lastTime.current = now
    }

    requestAnimationFrame(measureFPS)
  }, [])

  useEffect(() => {
    lastTime.current = performance.now()
    const handle = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(handle)
  }, [measureFPS])

  useEffect(() => {
    if ('memory' in performance) {
      const updateMemory = () => {
        const memory = (performance as any).memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
        }))
      }
      
      const interval = setInterval(updateMemory, 5000)
      return () => clearInterval(interval)
    }
  }, [])

  return { metrics, startRender, endRender }
}

// Optimized list component with virtualization
interface OptimizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  getItemHeight?: (item: T, index: number) => number
  estimatedItemHeight?: number
  height: number
  onEndReached?: () => void
  className?: string
  loadingComponent?: ReactNode
  emptyComponent?: ReactNode
  isLoading?: boolean
}

export function OptimizedList<T>({
  items,
  renderItem,
  getItemHeight,
  estimatedItemHeight = 80,
  height,
  onEndReached,
  className = '',
  loadingComponent,
  emptyComponent,
  isLoading = false
}: OptimizedListProps<T>) {
  if (isLoading && loadingComponent) {
    return <div className={className}>{loadingComponent}</div>
  }

  if (items.length === 0 && emptyComponent) {
    return <div className={className}>{emptyComponent}</div>
  }

  if (getItemHeight) {
    // Dynamic height virtualization (more complex)
    return (
      <div className={`mobile-scroll ${className}`} style={{ height }}>
        {items.map((item, index) => (
          <div key={index} style={{ height: getItemHeight(item, index) }}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    )
  }

  // Fixed height virtualization
  return (
    <VirtualScroll
      items={items}
      itemHeight={estimatedItemHeight}
      height={height}
      renderItem={renderItem}
      className={className}
      onEndReached={onEndReached}
    />
  )
}

// Memoized component wrapper
export const memo = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return React.memo(Component, areEqual)
}

// Bundle size optimization utilities
export const loadComponent = (importFunction: () => Promise<any>) => {
  return React.lazy(importFunction)
}

export const preloadComponent = (importFunction: () => Promise<any>) => {
  importFunction()
}

export default {
  useLazyImage,
  OptimizedImage,
  useVirtualScroll,
  VirtualScroll,
  useDebouncedValue,
  useThrottledScroll,
  useIntersectionObserver,
  usePerformanceMonitor,
  OptimizedList,
  memo,
  loadComponent,
  preloadComponent
}