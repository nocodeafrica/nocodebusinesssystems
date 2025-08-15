'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { SUPABASE_MODELS, getModelById } from '@/lib/models'

// Model data with descriptions and specifications
const modelData = {
  [SUPABASE_MODELS[0].url]: {
    name: 'Aston Martin DB11',
    category: 'Luxury Vehicle',
    description: 'A grand tourer produced by British luxury sports car manufacturer Aston Martin. The DB11 is the first model launched under the brands second century plan.',
    specifications: {
      'Year': '2016-Present',
      'Engine': '5.2L Twin-Turbo V12',
      'Power': '630 HP',
      'Top Speed': '208 mph',
      'Acceleration': '0-60 in 3.7s',
      'Price Range': '$200,000 - $250,000'
    },
    features: [
      'Aerodynamic Design',
      'Luxury Interior',
      'Advanced Safety Systems',
      'Performance Braking'
    ],
    useCases: [
      'Automotive Design Review',
      'Virtual Showroom',
      'Engineering Analysis',
      'Marketing Presentation'
    ]
  },
  [SUPABASE_MODELS[1].url]: {
    name: 'Antonov An-72',
    category: 'Transport Aircraft',
    description: 'A Soviet/Ukrainian transport aircraft, developed by Antonov. Known for its ability to operate from unprepared airfields in remote areas.',
    specifications: {
      'Type': 'STOL Transport',
      'Crew': '3-5 Personnel',
      'Capacity': '52 Passengers',
      'Range': '4,800 km',
      'Service Ceiling': '11,000 m',
      'Max Speed': '705 km/h'
    },
    features: [
      'Short Takeoff and Landing',
      'High-mounted Engines',
      'Rear Loading Ramp',
      'All-weather Capability'
    ],
    useCases: [
      'Flight Simulation',
      'Aviation Training',
      'Aircraft Design Study',
      'Logistics Planning'
    ]
  },
  [SUPABASE_MODELS[3].url]: {
    name: 'Hyundai HL975A',
    category: 'Construction Equipment',
    description: 'A heavy-duty wheel loader designed for mining, quarrying, and large-scale construction projects. Known for reliability and performance.',
    specifications: {
      'Operating Weight': '28,840 kg',
      'Bucket Capacity': '5.5 m³',
      'Engine Power': '353 HP',
      'Max Speed': '38 km/h',
      'Breakout Force': '23,240 kgf',
      'Fuel Tank': '474 L'
    },
    features: [
      'Heavy-duty Axles',
      'Advanced Hydraulics',
      'Operator Comfort Cab',
      'Load Sensing System'
    ],
    useCases: [
      'Equipment Training',
      'Site Planning',
      'Safety Demonstrations',
      'Maintenance Procedures'
    ]
  },
  [SUPABASE_MODELS[2].url]: {
    name: 'Urban City Model',
    category: 'Architecture & Planning',
    description: 'A comprehensive 3D city model featuring modern urban infrastructure, buildings, and transportation systems for city planning and visualization.',
    specifications: {
      'Scale': '1:1000',
      'Coverage': '~10 km²',
      'Buildings': '200+ Structures',
      'Detail Level': 'LOD 2-3',
      'Texture Resolution': '2K-4K',
      'Polygon Count': '~500,000'
    },
    features: [
      'Realistic Buildings',
      'Road Networks',
      'Green Spaces',
      'Infrastructure Details'
    ],
    useCases: [
      'Urban Planning',
      'Smart City Projects',
      'Environmental Studies',
      'Real Estate Development'
    ]
  },
  [SUPABASE_MODELS[4].url]: {
    name: 'Modular Neighborhood',
    category: 'Residential Planning',
    description: 'A low-poly modular neighborhood design system for rapid prototyping of residential areas and community planning projects.',
    specifications: {
      'Style': 'Low Poly',
      'Modules': '50+ Components',
      'Houses': '30 Variations',
      'Optimization': 'Mobile Ready',
      'File Size': '< 50 MB',
      'Textures': 'Atlas Mapped'
    },
    features: [
      'Modular Design',
      'Optimized Geometry',
      'Customizable Layout',
      'Performance Focused'
    ],
    useCases: [
      'Community Planning',
      'Game Development',
      'VR Walkthroughs',
      'Architectural Visualization'
    ]
  }
}

export default function ModelViewerPlatform() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentModel, setCurrentModel] = useState(SUPABASE_MODELS[0].url)
  const [autoRotate, setAutoRotate] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(0)
  const [showGrid, setShowGrid] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const viewerRef = useRef<any>(null)
  const modelViewerRef = useRef<any>(null)

  const models = [
    { name: 'Aston Martin', path: SUPABASE_MODELS[0].url, icon: LucideIcons.Car },
    { name: 'Aircraft', path: SUPABASE_MODELS[1].url, icon: LucideIcons.Plane },
    { name: 'Wheel Loader', path: SUPABASE_MODELS[3].url, icon: LucideIcons.Truck },
    { name: 'City', path: SUPABASE_MODELS[2].url, icon: LucideIcons.Building2 },
    { name: 'Neighborhood', path: SUPABASE_MODELS[4].url, icon: LucideIcons.Home }
  ]

  const currentModelData = modelData[currentModel as keyof typeof modelData]

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
    `
    document.head.appendChild(style)
    
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js'
    
    const legacyScript = document.createElement('script')
    legacyScript.noModule = true
    legacyScript.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer-legacy.js'
    
    script.onload = () => {
      console.log('Model-viewer loaded successfully')
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

  // Apply zoom using field of view
  useEffect(() => {
    if (modelViewerRef.current && isLoaded) {
      const fov = 30 - (zoomLevel * 0.2) // Zoom in by reducing FOV
      modelViewerRef.current.setAttribute('field-of-view', `${fov}deg`)
    }
  }, [zoomLevel, isLoaded])

  // Reset settings when changing models
  useEffect(() => {
    setZoomLevel(0)
    setActiveTab('overview')
  }, [currentModel])

  return (
    <div className="w-full h-[900px] bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200 flex">
      {/* Left Information Panel */}
      <div className="w-96 border-r border-gray-200 flex flex-col bg-gray-50">
        {/* Panel Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
            <LucideIcons.Info className="w-5 h-5 text-blue-600" />
            {currentModelData.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{currentModelData.category}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {[
            { id: 'overview', label: 'Overview', icon: LucideIcons.FileText },
            { id: 'specs', label: 'Specifications', icon: LucideIcons.Settings },
            { id: 'usage', label: 'Use Cases', icon: LucideIcons.Briefcase }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentModelData.description}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                <ul className="space-y-2">
                  {currentModelData.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <LucideIcons.CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <LucideIcons.Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-medium">Pro Tip</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Use the zoom slider to examine details, or rotate the model for different perspectives.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 mb-3">Technical Specifications</h4>
              {Object.entries(currentModelData.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">{key}</span>
                  <span className="text-sm font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 mb-3">Industry Applications</h4>
              <div className="space-y-3">
                {currentModelData.useCases.map((useCase, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <LucideIcons.Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{useCase}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Need Custom Solutions?</h5>
                <p className="text-xs text-gray-600 mb-3">
                  We can create tailored 3D models and viewers for your specific industry needs.
                </p>
                <button className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Our Team
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Model Format: GLB</span>
            <span>Optimized for Web</span>
          </div>
        </div>
      </div>

      {/* Right Viewer Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LucideIcons.Box className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">3D Model Platform</h2>
            </div>
            
            {/* Model Selector */}
            <div className="flex items-center space-x-2">
              {models.map((model) => {
                const Icon = model.icon
                return (
                  <button
                    key={model.path}
                    onClick={() => setCurrentModel(model.path)}
                    className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-all text-sm ${
                      currentModel === model.path 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{model.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 3D Model Viewer */}
        <div ref={viewerRef} className="flex-1 relative bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {isLoaded ? (
            <>
              {/* @ts-ignore - model-viewer is a custom element */}
              <model-viewer
                ref={modelViewerRef}
                src={currentModel}
                alt={`3D model of ${currentModelData.name}`}
                camera-controls
                auto-rotate={autoRotate}
                auto-rotate-delay="0"
                rotation-per-second="30deg"
                shadow-intensity="1"
                shadow-softness="1"
                environment-image="neutral"
                exposure="1"
                camera-orbit="45deg 55deg 105%"
                min-camera-orbit="auto auto 50%"
                max-camera-orbit="auto auto 400%"
                field-of-view="30deg"
                min-field-of-view="10deg"
                max-field-of-view="60deg"
                interaction-prompt="none"
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent'
                }}
              >
                <div slot="progress-bar" style={{
                  position: 'absolute',
                  width: '100%',
                  height: '4px',
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
                    backgroundSize: '50px 50px'
                  }}
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
                <p className="text-gray-600 font-medium">Initializing 3D Viewer...</p>
              </div>
            </div>
          )}

          {/* Controls Toolbar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200">
            <div className="px-4 py-3 flex items-center justify-between">
              {/* Zoom Control */}
              <div className="flex items-center space-x-3">
                <LucideIcons.Search className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Zoom:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                  className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${zoomLevel}%, #e5e7eb ${zoomLevel}%, #e5e7eb 100%)`
                  }}
                />
                <span className="text-sm text-gray-600 w-10">{zoomLevel}%</span>
              </div>

              {/* Additional Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded-lg transition-all ${
                    showGrid ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                  title="Toggle Grid"
                >
                  <LucideIcons.Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-2 rounded-lg transition-all ${
                    autoRotate ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                  title="Auto Rotate"
                >
                  <LucideIcons.RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(0)
                    setAutoRotate(false)
                    setShowGrid(true)
                    if (modelViewerRef.current) {
                      modelViewerRef.current.setAttribute('camera-orbit', '45deg 55deg 105%')
                    }
                  }}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                  title="Reset View"
                >
                  <LucideIcons.RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Bar */}
            <div className="border-t border-gray-200 px-4 py-1 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <LucideIcons.Mouse className="w-3 h-3 mr-1" />
                  Drag to rotate • Scroll to zoom • Double-click to reset
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-500">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}