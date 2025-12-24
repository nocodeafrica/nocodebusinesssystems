// Mobile Design System for Location Systems
// Entry point for all mobile components and utilities

// Core Components
export { default as MobileBottomSheet } from './MobileBottomSheet'
export { default as MobileFilterBar } from './MobileFilterBar'
export { default as MobileMapControls } from './MobileMapControls'
export { default as MobileInfoCard } from './MobileInfoCard'
export { default as MobileTabNav } from './MobileTabNav'

// Touch Interaction Patterns
export {
  useDoubleTap,
  useLongPress,
  Swipeable,
  PullToRefresh,
  useHapticFeedback,
  TouchButton,
  GestureDetector
} from './TouchInteractionPatterns'

// Performance Optimizations
export {
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
} from './PerformanceOptimizations'

// Re-export everything as default for convenience
import MobileBottomSheet from './MobileBottomSheet'
import MobileFilterBar from './MobileFilterBar'
import MobileMapControls from './MobileMapControls'
import MobileInfoCard from './MobileInfoCard'
import MobileTabNav from './MobileTabNav'

import {
  useDoubleTap,
  useLongPress,
  Swipeable,
  PullToRefresh,
  useHapticFeedback,
  TouchButton,
  GestureDetector
} from './TouchInteractionPatterns'

import {
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
} from './PerformanceOptimizations'

export default {
  // Core Components
  MobileBottomSheet,
  MobileFilterBar,
  MobileMapControls,
  MobileInfoCard,
  MobileTabNav,
  
  // Touch Interactions
  useDoubleTap,
  useLongPress,
  Swipeable,
  PullToRefresh,
  useHapticFeedback,
  TouchButton,
  GestureDetector,
  
  // Performance
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