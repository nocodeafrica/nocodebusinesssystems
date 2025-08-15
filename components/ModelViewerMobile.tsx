'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SUPABASE_MODELS } from '@/lib/models'

import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Grid,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  X,
  Car,
  Plane,
  Truck,
  Building2,
  Home
} from 'lucide-react'

// Model data
const models = [
  { 
    id: 'car',
    name: 'Aston Martin DB11',
    path: SUPABASE_MODELS[0].url, 
    icon: Car,
    description: 'Luxury sports car with aerodynamic design',
    specs: ['630 HP', '208 mph', '0-60: 3.7s']
  },
  { 
    id: 'aircraft',
    name: 'Antonov An-72',
    path: SUPABASE_MODELS[1].url, 
    icon: Plane,
    description: 'Transport aircraft for remote operations',
    specs: ['52 passengers', '4,800 km range', 'STOL capable']
  },
  { 
    id: 'loader',
    name: 'Hyundai HL975A',
    path: SUPABASE_MODELS[3].url, 
    icon: Truck,
    description: 'Heavy-duty construction equipment',
    specs: ['353 HP', '5.5 m³ bucket', '28,840 kg weight']
  },
  { 
    id: 'city',
    name: 'Urban City',
    path: SUPABASE_MODELS[2].url, 
    icon: Building2,
    description: 'Modern city infrastructure model',
    specs: ['10 km² area', '200+ buildings', 'LOD 2-3 detail']
  },
  { 
    id: 'neighborhood',
    name: 'Modular Neighborhood',
    path: SUPABASE_MODELS[4].url, 
    icon: Home,
    description: 'Low-poly residential planning system',
    specs: ['50+ modules', '30 house types', 'Mobile optimized']
  }
]

export default function ModelViewerMobile() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentModelIndex, setCurrentModelIndex] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(0)
  const modelViewerRef = useRef<any>(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const currentModel = models[currentModelIndex]

  // Load model-viewer script
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      model-viewer::part(default-progress-bar) {
        display: none;
      }
      model-viewer {
        --poster-color: transparent;
      }
    `
    document.head.appendChild(style)
    
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js'
    
    const legacyScript = document.createElement('script')
    legacyScript.noModule = true
    legacyScript.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer-legacy.js'
    
    script.onload = () => {
      setIsLoaded(true)
    }
    
    document.head.appendChild(script)
    document.head.appendChild(legacyScript)
    
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script)
      if (document.head.contains(legacyScript)) document.head.removeChild(legacyScript)
      if (document.head.contains(style)) document.head.removeChild(style)
    }
  }, [])

  // Handle zoom
  useEffect(() => {
    if (modelViewerRef.current && isLoaded) {
      const fov = 30 - (zoomLevel * 0.3)
      modelViewerRef.current.setAttribute('field-of-view', `${fov}deg`)
    }
  }, [zoomLevel, isLoaded])

  // Navigation functions
  const nextModel = () => {
    setCurrentModelIndex((prev) => (prev + 1) % models.length)
    setZoomLevel(0)
  }

  const prevModel = () => {
    setCurrentModelIndex((prev) => (prev - 1 + models.length) % models.length)
    setZoomLevel(0)
  }

  const resetView = () => {
    setZoomLevel(0)
    if (modelViewerRef.current) {
      modelViewerRef.current.setAttribute('camera-orbit', '45deg 55deg 105%')
    }
  }

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchEndX - touchStartX.current
    const deltaY = Math.abs(touchEndY - touchStartY.current)
    
    // Only trigger swipe if horizontal movement is significant and vertical is minimal
    if (Math.abs(deltaX) > 100 && deltaY < 50) {
      if (deltaX > 0) {
        prevModel()
      } else {
        nextModel()
      }
    }
  }

  return (
    <div className="h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <currentModel.icon className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-gray-900 font-semibold text-lg">{currentModel.name}</h1>
            <p className="text-gray-600 text-xs">{currentModel.description}</p>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Model Viewer */}
      <div 
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isLoaded ? (
          <>
            {/* @ts-ignore - model-viewer is a custom element */}
            <model-viewer
              ref={modelViewerRef}
              src={currentModel.path}
              alt={`3D model of ${currentModel.name}`}
              camera-controls
              auto-rotate={autoRotate}
              auto-rotate-delay="0"
              rotation-per-second="30deg"
              shadow-intensity="0.5"
              shadow-softness="1"
              environment-image="neutral"
              exposure="0.8"
              camera-orbit="45deg 55deg 105%"
              min-camera-orbit="auto auto 50%"
              max-camera-orbit="auto auto 400%"
              field-of-view="30deg"
              min-field-of-view="10deg"
              max-field-of-view="60deg"
              interaction-prompt="none"
              touch-action="pan-y"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent'
              }}
            >
              <div slot="progress-bar" style={{
                position: 'absolute',
                width: '100%',
                height: '3px',
                bottom: '0',
                left: '0',
                background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s ease-in-out infinite'
              }} />
            {/* @ts-ignore */}
            </model-viewer>

            {/* Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, 0.02) 25%, rgba(0, 0, 0, 0.02) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.02) 75%, rgba(0, 0, 0, 0.02) 76%, transparent 77%, transparent),
                    linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, 0.02) 25%, rgba(0, 0, 0, 0.02) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.02) 75%, rgba(0, 0, 0, 0.02) 76%, transparent 77%, transparent)
                  `,
                  backgroundSize: '30px 30px'
                }}
              />
            )}

            {/* Navigation Arrows */}
            <button
              onClick={prevModel}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md rounded-full text-gray-700 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextModel}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md rounded-full text-gray-700 shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Model Indicators */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
              {models.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentModelIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentModelIndex 
                      ? 'w-8 bg-blue-600' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
              <p className="text-gray-700 font-medium">Loading 3D Viewer...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-3 rounded-lg transition-all ${
              showGrid ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-3 rounded-lg transition-all ${
              autoRotate ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <RotateCw className={`w-5 h-5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setZoomLevel(Math.min(zoomLevel + 20, 100))}
            className="p-3 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoomLevel(Math.max(zoomLevel - 20, 0))}
            className="p-3 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={resetView}
            className="p-3 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="absolute inset-0 bg-white z-50 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-gray-900 text-lg font-semibold">Model Information</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="p-2 bg-gray-100 rounded-lg text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Current Model Info */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <currentModel.icon className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-gray-900 font-semibold">{currentModel.name}</h3>
                    <p className="text-gray-600 text-sm">{currentModel.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {currentModel.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="text-gray-700">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Models */}
              <div>
                <h3 className="text-gray-900 font-medium mb-3">All Models</h3>
                <div className="space-y-2">
                  {models.map((model, index) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setCurrentModelIndex(index)
                        setShowInfo(false)
                      }}
                      className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                        index === currentModelIndex
                          ? 'bg-blue-100 border border-blue-300'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <model.icon className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="text-gray-900 text-sm font-medium">{model.name}</p>
                        <p className="text-gray-500 text-xs">{model.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-gray-900 font-medium mb-2">How to Use</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Swipe left/right to change models</li>
                  <li>• Pinch to zoom in/out</li>
                  <li>• Drag to rotate the model</li>
                  <li>• Use controls for grid, auto-rotate, and zoom</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}