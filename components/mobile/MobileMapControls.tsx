'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Minus, 
  Layers, 
  Navigation, 
  Home,
  Map,
  Satellite,
  ChevronUp,
  Compass,
  Maximize2,
  Search
} from 'lucide-react'

interface MapLayer {
  id: string
  label: string
  icon?: React.ReactNode
  enabled: boolean
}

interface MapStyle {
  id: string
  label: string
  preview?: string
}

interface MobileMapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onResetView: () => void
  onLocateUser: () => void
  onFullscreen?: () => void
  onSearch?: () => void
  layers?: MapLayer[]
  onLayerToggle?: (layerId: string) => void
  mapStyles?: MapStyle[]
  currentStyle?: string
  onMapStyleChange?: (styleId: string) => void
  showCompass?: boolean
  compassHeading?: number
  onCompassReset?: () => void
  className?: string
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
}

const MobileMapControls = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onLocateUser,
  onFullscreen,
  onSearch,
  layers = [],
  onLayerToggle,
  mapStyles = [],
  currentStyle,
  onMapStyleChange,
  showCompass = true,
  compassHeading = 0,
  onCompassReset,
  className = '',
  position = 'bottom-right'
}: MobileMapControlsProps) => {
  const [showLayers, setShowLayers] = useState(false)
  const [showStyles, setShowStyles] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  const handleLocateUser = () => {
    setIsLocating(true)
    onLocateUser()
    setTimeout(() => setIsLocating(false), 2000)
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-24 right-4',
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-24 left-4'
  }

  return (
    <>
      {/* Main Control Stack */}
      <div className={`absolute ${positionClasses[position]} flex flex-col gap-2 z-30 ${className}`}>
        
        {/* Search Button (if provided) */}
        {onSearch && (
          <button
            onClick={onSearch}
            className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Compass (if enabled) */}
        {showCompass && compassHeading !== 0 && (
          <button
            onClick={onCompassReset}
            className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
            aria-label="Reset compass"
            style={{ transform: `rotate(${-compassHeading}deg)` }}
          >
            <Compass className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Zoom Controls */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <button
            onClick={onZoomIn}
            className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95 border-b border-gray-200"
            aria-label="Zoom in"
          >
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={onZoomOut}
            className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
            aria-label="Zoom out"
          >
            <Minus className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Location Button */}
        <button
          onClick={handleLocateUser}
          className={`w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95 ${
            isLocating ? 'bg-blue-50' : ''
          }`}
          aria-label="My location"
        >
          <Navigation 
            className={`w-5 h-5 transition-all ${
              isLocating ? 'text-blue-500 animate-pulse' : 'text-gray-700'
            }`} 
          />
        </button>

        {/* Reset View Button */}
        <button
          onClick={onResetView}
          className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
          aria-label="Reset view"
        >
          <Home className="w-5 h-5 text-gray-700" />
        </button>

        {/* Fullscreen Button (if provided) */}
        {onFullscreen && (
          <button
            onClick={onFullscreen}
            className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
            aria-label="Fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Layers Button (if layers provided) */}
        {layers.length > 0 && (
          <button
            onClick={() => {
              setShowLayers(!showLayers)
              setShowStyles(false)
            }}
            className={`w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95 ${
              showLayers ? 'bg-blue-50' : ''
            }`}
            aria-label="Layers"
          >
            <Layers className={`w-5 h-5 ${showLayers ? 'text-blue-500' : 'text-gray-700'}`} />
          </button>
        )}

        {/* Map Style Button (if styles provided) */}
        {mapStyles.length > 0 && (
          <button
            onClick={() => {
              setShowStyles(!showStyles)
              setShowLayers(false)
            }}
            className={`w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95 ${
              showStyles ? 'bg-blue-50' : ''
            }`}
            aria-label="Map style"
          >
            {currentStyle === 'satellite' ? (
              <Satellite className={`w-5 h-5 ${showStyles ? 'text-blue-500' : 'text-gray-700'}`} />
            ) : (
              <Map className={`w-5 h-5 ${showStyles ? 'text-blue-500' : 'text-gray-700'}`} />
            )}
          </button>
        )}
      </div>

      {/* Layers Panel */}
      <AnimatePresence>
        {showLayers && (
          <motion.div
            initial={{ opacity: 0, x: position.includes('right') ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: position.includes('right') ? 20 : -20 }}
            className={`absolute ${
              position.includes('right') ? 'right-20' : 'left-20'
            } ${
              position.includes('top') ? 'top-4' : 'bottom-24'
            } bg-white rounded-xl shadow-xl p-3 z-20 min-w-[200px]`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Layers</h3>
              <button
                onClick={() => setShowLayers(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronUp className="w-4 h-4 text-gray-500 rotate-90" />
              </button>
            </div>
            <div className="space-y-2">
              {layers.map(layer => (
                <label
                  key={layer.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={layer.enabled}
                    onChange={() => onLayerToggle?.(layer.id)}
                    className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                  />
                  {layer.icon && <span className="w-5 h-5">{layer.icon}</span>}
                  <span className="text-sm text-gray-700">{layer.label}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Styles Panel */}
      <AnimatePresence>
        {showStyles && (
          <motion.div
            initial={{ opacity: 0, x: position.includes('right') ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: position.includes('right') ? 20 : -20 }}
            className={`absolute ${
              position.includes('right') ? 'right-20' : 'left-20'
            } ${
              position.includes('top') ? 'top-4' : 'bottom-24'
            } bg-white rounded-xl shadow-xl p-3 z-20`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Map Style</h3>
              <button
                onClick={() => setShowStyles(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronUp className="w-4 h-4 text-gray-500 rotate-90" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mapStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => {
                    onMapStyleChange?.(style.id)
                    setShowStyles(false)
                  }}
                  className={`relative p-2 rounded-lg border-2 transition-all ${
                    currentStyle === style.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {style.preview ? (
                    <img
                      src={style.preview}
                      alt={style.label}
                      className="w-full h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">{style.label}</span>
                    </div>
                  )}
                  <span className="text-xs font-medium text-gray-700 mt-1 block">
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileMapControls