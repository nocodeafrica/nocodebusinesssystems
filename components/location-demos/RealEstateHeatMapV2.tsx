'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MobileMapOverlay, { MiniLocationCard } from '../mobile/MobileMapOverlay'
import MapWrapper from '../MapWrapper'

// Conditionally import map components only on client
let Map: any, Marker: any, Source: any, Layer: any, NavigationControl: any, ScaleControl: any, Popup: any

if (typeof window !== 'undefined') {
  const mapgl = require('react-map-gl/mapbox')
  Map = mapgl.default
  Marker = mapgl.Marker
  Source = mapgl.Source
  Layer = mapgl.Layer
  NavigationControl = mapgl.NavigationControl
  ScaleControl = mapgl.ScaleControl
  Popup = mapgl.Popup
}
import { 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Building2, 
  MapPin, 
  DollarSign,
  Users,
  BarChart3,
  Filter,
  Search,
  ChevronRight,
  Star,
  Bath,
  Bed,
  Square,
  X,
  Info,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  Heart,
  Share2,
  Navigation,
  Sparkles,
  Timer,
  Award,
  Target,
  Zap
} from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'

// Enhanced property market data
const marketData = {
  hotspots: [
    {
      id: 'sandton',
      name: 'Sandton CBD',
      coordinates: [28.0573, -26.1080],
      metrics: {
        avgPrice: 8500000,
        pricePerSqm: 45000,
        yoyGrowth: 12.5,
        inventory: 234,
        daysOnMarket: 28,
        demandScore: 95
      },
      trend: 'hot',
      type: 'commercial'
    },
    {
      id: 'clifton',
      name: 'Clifton Beach',
      coordinates: [18.3776, -33.9399],
      metrics: {
        avgPrice: 25000000,
        pricePerSqm: 120000,
        yoyGrowth: 18.2,
        inventory: 89,
        daysOnMarket: 45,
        demandScore: 100
      },
      trend: 'hot',
      type: 'luxury'
    },
    {
      id: 'rosebank',
      name: 'Rosebank',
      coordinates: [28.0436, -26.1459],
      metrics: {
        avgPrice: 4200000,
        pricePerSqm: 32000,
        yoyGrowth: 8.7,
        inventory: 167,
        daysOnMarket: 35,
        demandScore: 78
      },
      trend: 'warm',
      type: 'mixed'
    },
    {
      id: 'umhlanga',
      name: 'Umhlanga Rocks',
      coordinates: [31.0819, -29.7256],
      metrics: {
        avgPrice: 6800000,
        pricePerSqm: 38000,
        yoyGrowth: 15.3,
        inventory: 312,
        daysOnMarket: 22,
        demandScore: 88
      },
      trend: 'hot',
      type: 'coastal'
    },
    {
      id: 'centurion',
      name: 'Centurion',
      coordinates: [28.1894, -25.8507],
      metrics: {
        avgPrice: 2100000,
        pricePerSqm: 15000,
        yoyGrowth: -2.3,
        inventory: 423,
        daysOnMarket: 58,
        demandScore: 45
      },
      trend: 'cool',
      type: 'suburban'
    },
    {
      id: 'constantia',
      name: 'Constantia',
      coordinates: [18.4521, -34.0176],
      metrics: {
        avgPrice: 12000000,
        pricePerSqm: 55000,
        yoyGrowth: 9.8,
        inventory: 145,
        daysOnMarket: 40,
        demandScore: 82
      },
      trend: 'warm',
      type: 'luxury'
    }
  ],
  insights: [
    { icon: TrendingUp, label: 'Top Growth', value: 'Clifton +18.2%', color: 'text-green-600' },
    { icon: Zap, label: 'Hottest Market', value: 'Sandton CBD', color: 'text-orange-600' },
    { icon: Timer, label: 'Fastest Sales', value: 'Umhlanga (22 days)', color: 'text-blue-600' },
    { icon: Award, label: 'Premium Area', value: 'Clifton R120k/m²', color: 'text-purple-600' }
  ]
}

// Generate heatmap data for visualization
const generateHeatmapData = () => {
  const features: any[] = []
  
  marketData.hotspots.forEach(spot => {
    const intensity = spot.metrics.demandScore / 100
    const radius = 0.01
    const points = 20
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2
      for (let r = 0; r < 5; r++) {
        const currentRadius = (r / 5) * radius
        const weight = (1 - r / 5) * intensity
        
        features.push({
          type: 'Feature',
          properties: { 
            weight,
            price: spot.metrics.avgPrice,
            growth: spot.metrics.yoyGrowth
          },
          geometry: {
            type: 'Point',
            coordinates: [
              spot.coordinates[0] + Math.cos(angle) * currentRadius,
              spot.coordinates[1] + Math.sin(angle) * currentRadius
            ]
          }
        })
      }
    }
  })
  
  return {
    type: 'FeatureCollection' as const,
    features
  }
}

const RealEstateHeatMapV2 = () => {
  const [selectedArea, setSelectedArea] = useState<typeof marketData.hotspots[0] | null>(null)
  const [viewMode, setViewMode] = useState<'heat' | 'price' | 'growth'>('heat')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 30])
  const [propertyType, setPropertyType] = useState('all')
  const [showPopup, setShowPopup] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const [viewState, setViewState] = useState({
    latitude: -28.5,
    longitude: 24.5,
    zoom: 5.5
  })

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const heatmapData = useMemo(() => generateHeatmapData(), [])

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `R${(price / 1000000).toFixed(1)}M`
    }
    return `R${(price / 1000).toFixed(0)}k`
  }

  const getMarkerColor = (trend: string) => {
    switch(trend) {
      case 'hot': return '#ef4444'
      case 'warm': return '#f59e0b'
      case 'cool': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getDemandColor = (score: number) => {
    if (score >= 80) return 'bg-red-500'
    if (score >= 60) return 'bg-orange-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const heatmapLayer = {
    id: 'heatmap',
    type: 'heatmap' as const,
    paint: {
      'heatmap-weight': ['get', 'weight'],
      'heatmap-intensity': {
        stops: [[10, 1], [15, 3]]
      },
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(59, 130, 246, 0)',
        0.2, 'rgba(59, 130, 246, 0.3)',
        0.4, 'rgba(147, 51, 234, 0.5)',
        0.6, 'rgba(239, 68, 68, 0.7)',
        0.8, 'rgba(249, 115, 22, 0.9)',
        1, 'rgba(234, 179, 8, 1)'
      ],
      'heatmap-radius': {
        stops: [[10, 15], [15, 30]]
      },
      'heatmap-opacity': 0.7
    }
  }

  // Mobile layout
  if (isMobile) {
    // Create mini cards for property areas
    const areaCards = marketData.hotspots
      .filter(spot => propertyType === 'all' || spot.type === propertyType)
      .map(area => (
        <MiniLocationCard
          key={area.id}
          title={area.name}
          subtitle={`R${(area.metrics.avgPrice / 1000000).toFixed(1)}M avg`}
          distance={`${area.trend === 'hot' ? '🔥' : area.trend === 'stable' ? '📊' : '📉'} ${area.metrics.yoyGrowth > 0 ? '+' : ''}${area.metrics.yoyGrowth}%`}
          status={area.metrics.demandScore > 80 ? 'open' : area.metrics.demandScore > 50 ? 'busy' : 'closed'}
          onClick={() => {
            setSelectedArea(area)
            setViewState({
              latitude: area.coordinates[1],
              longitude: area.coordinates[0],
              zoom: 12
            })
          }}
          isSelected={selectedArea?.id === area.id}
        />
      ))

    // Selected area content  
    const selectedContent = selectedArea ? (
      <div className="space-y-4">
        {/* Area Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{selectedArea.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{selectedArea.type} Properties</p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              selectedArea.trend === 'hot' ? 'bg-red-100 text-red-700' :
              selectedArea.trend === 'growing' ? 'bg-green-100 text-green-700' :
              selectedArea.trend === 'stable' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {selectedArea.trend}
            </div>
          </div>
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <DollarSign className="w-3 h-3" />
                <span>Avg Price</span>
              </div>
              <p className="text-sm font-semibold">R{(selectedArea.metrics.avgPrice / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <TrendingUp className="w-3 h-3" />
                <span>YoY Growth</span>
              </div>
              <p className="text-sm font-semibold text-green-600">+{selectedArea.metrics.yoyGrowth}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <Home className="w-3 h-3" />
                <span>Inventory</span>
              </div>
              <p className="text-sm font-semibold">{selectedArea.metrics.inventory}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <Activity className="w-3 h-3" />
                <span>Demand</span>
              </div>
              <p className="text-sm font-semibold">{selectedArea.metrics.demandScore}%</p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('heat')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'heat' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Heat Map
            </button>
            <button
              onClick={() => setViewMode('price')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'price' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Price Zones
            </button>
            <button
              onClick={() => setViewMode('growth')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'growth' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Growth Areas
            </button>
          </div>
        </div>
      </div>
    ) : null

    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg h-[600px] relative">
        <MobileMapOverlay
          miniCards={areaCards}
          selectedContent={selectedContent}
          hasSelection={!!selectedArea}
        >
          {/* Map */}
          <MapWrapper>
            {Map && (
              <Map
            {...viewState}
            onMove={(evt: any) => setViewState(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
          >
            <NavigationControl position="top-right" />
            
            {/* Heat map layer */}
            {viewMode === 'heat' && heatmapData && (
              <Source type="geojson" data={heatmapData}>
                <Layer
                  id="heatmap-mobile"
                  type="heatmap"
                  paint={{
                    'heatmap-weight': ['get', 'weight'],
                    'heatmap-radius': 50,
                    'heatmap-opacity': 0.6,
                    'heatmap-color': [
                      'interpolate',
                      ['linear'],
                      ['heatmap-density'],
                      0, 'rgba(33,102,172,0)',
                      0.2, 'rgb(103,169,207)',
                      0.4, 'rgb(209,229,240)',
                      0.6, 'rgb(253,219,199)',
                      0.8, 'rgb(239,138,98)',
                      1, 'rgb(178,24,43)'
                    ]
                  }}
                />
              </Source>
            )}

            {/* Market area markers */}
            {marketData.hotspots
              .filter(spot => propertyType === 'all' || spot.type === propertyType)
              .map(area => (
                <Marker
                  key={area.id}
                  longitude={area.coordinates[0]}
                  latitude={area.coordinates[1]}
                  onClick={() => setSelectedArea(area)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      selectedArea?.id === area.id ? 'bg-blue-500' :
                      area.trend === 'hot' ? 'bg-red-500' :
                      area.trend === 'growing' ? 'bg-green-500' :
                      'bg-gray-400'
                    }`}>
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    {selectedArea?.id === area.id && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md">
                        <p className="text-xs font-medium text-gray-900 whitespace-nowrap">R{(area.metrics.avgPrice / 1000000).toFixed(1)}M</p>
                      </div>
                    )}
                  </motion.div>
                </Marker>
              ))}
          </Map>
            )}
          </MapWrapper>
        </MobileMapOverlay>
      </div>
    )
  }

  // Desktop layout
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg" style={{ height: '850px' }}>
      <div className="flex h-full">
        {/* Left Panel - Market Analytics */}
        <div className="w-[380px] bg-white border-r border-gray-100 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Market Heat Map</h2>
                <p className="text-sm text-gray-500 mt-1">Real-time property insights</p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* View Mode Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              {[
                { id: 'heat', label: 'Demand', icon: Activity },
                { id: 'price', label: 'Pricing', icon: () => <span className="font-bold">R</span> },
                { id: 'growth', label: 'Growth', icon: TrendingUp }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    viewMode === mode.id 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode.id === 'price' ? (
                    <span className="font-bold">R</span>
                  ) : (
                    React.createElement(mode.icon as any, { className: "w-4 h-4" })
                  )}
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters (Collapsible) */}
          {showFilters && (
            <div className="px-5 py-4 border-b border-gray-100 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">
                  Price Range (R{priceRange[0]}M - R{priceRange[1]}M)
                </label>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Property Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['all', 'luxury', 'commercial', 'coastal'].map(type => (
                    <button
                      key={type}
                      onClick={() => setPropertyType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                        propertyType === type
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Market Insights */}
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Insights</h3>
            <div className="grid grid-cols-2 gap-3">
              {marketData.insights.map((insight, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <insight.icon className={`w-4 h-4 ${insight.color}`} />
                    <span className="text-xs text-gray-600">{insight.label}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{insight.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Area List */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Markets</h3>
              <div className="space-y-2">
                {marketData.hotspots
                  .filter(spot => propertyType === 'all' || spot.type === propertyType)
                  .sort((a, b) => b.metrics.demandScore - a.metrics.demandScore)
                  .map((area) => (
                  <motion.div
                    key={area.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedArea(area)
                      setShowPopup(true)
                      setViewState({
                        latitude: area.coordinates[1],
                        longitude: area.coordinates[0],
                        zoom: 12
                      })
                    }}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      selectedArea?.id === area.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">{area.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">{area.type} market</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        area.trend === 'hot' ? 'bg-red-100 text-red-700' :
                        area.trend === 'warm' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {area.trend}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <p className="text-xs text-gray-500">Avg Price</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatPrice(area.metrics.avgPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Growth</p>
                        <p className={`text-sm font-semibold flex items-center gap-1 ${
                          area.metrics.yoyGrowth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {area.metrics.yoyGrowth > 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {Math.abs(area.metrics.yoyGrowth).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Demand Score Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Demand Score</span>
                        <span className="font-medium text-gray-700">{area.metrics.demandScore}/100</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${getDemandColor(area.metrics.demandScore)}`}
                          style={{ width: `${area.metrics.demandScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Home className="w-3 h-3" />
                          {area.metrics.inventory}
                        </span>
                        <span className="flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {area.metrics.daysOnMarket}d
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <Map
            {...viewState}
            onMove={(evt: any) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
            style={{ width: '100%', height: '100%' }}
          >
            <NavigationControl position="top-right" />
            <ScaleControl position="bottom-right" />

            {/* Heatmap Layer */}
            {viewMode === 'heat' && (
              <Source type="geojson" data={heatmapData}>
                <Layer {...heatmapLayer} />
              </Source>
            )}

            {/* Market Markers */}
            {marketData.hotspots.map((area) => (
              <Marker
                key={area.id}
                longitude={area.coordinates[0]}
                latitude={area.coordinates[1]}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedArea(area)
                    setShowPopup(true)
                  }}
                  className="relative cursor-pointer"
                >
                  {/* Pulsing ring for hot markets */}
                  {area.trend === 'hot' && (
                    <div className="absolute inset-0 rounded-full animate-ping"
                      style={{ backgroundColor: getMarkerColor(area.trend), opacity: 0.3 }}
                    />
                  )}
                  
                  {/* Main marker */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg relative"
                    style={{ backgroundColor: getMarkerColor(area.trend) }}
                  >
                    <div className="text-white text-xs font-bold">
                      {area.metrics.demandScore}
                    </div>
                  </div>

                  {/* Price label */}
                  {viewMode === 'price' && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-md whitespace-nowrap">
                      <p className="text-xs font-semibold text-gray-900">
                        {formatPrice(area.metrics.avgPrice)}
                      </p>
                    </div>
                  )}

                  {/* Growth label */}
                  {viewMode === 'growth' && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-md whitespace-nowrap">
                      <p className={`text-xs font-semibold flex items-center gap-1 ${
                        area.metrics.yoyGrowth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {area.metrics.yoyGrowth > 0 ? '↑' : '↓'}
                        {Math.abs(area.metrics.yoyGrowth).toFixed(1)}%
                      </p>
                    </div>
                  )}
                </motion.div>
              </Marker>
            ))}

            {/* Area Details Popup */}
            {showPopup && selectedArea && (
              <Popup
                longitude={selectedArea.coordinates[0]}
                latitude={selectedArea.coordinates[1]}
                onClose={() => {
                  setShowPopup(false)
                  setSelectedArea(null)
                }}
                closeButton={false}
                className="market-popup"
                offset={25}
              >
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden" style={{ width: '320px' }}>
                  {/* Header */}
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{selectedArea.name}</h3>
                        <p className="text-sm text-white/80 capitalize">{selectedArea.type} market</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowPopup(false)
                          setSelectedArea(null)
                        }}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Average Price</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(selectedArea.metrics.avgPrice)}
                        </p>
                        <p className="text-xs text-gray-500">R{(selectedArea.metrics.pricePerSqm / 1000).toFixed(0)}k/m²</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">YoY Growth</p>
                        <p className={`text-lg font-bold flex items-center gap-1 ${
                          selectedArea.metrics.yoyGrowth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedArea.metrics.yoyGrowth > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {Math.abs(selectedArea.metrics.yoyGrowth).toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">Annual change</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Market Demand</span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${getDemandColor(selectedArea.metrics.demandScore)}`}
                              style={{ width: `${selectedArea.metrics.demandScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedArea.metrics.demandScore}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Available Properties</span>
                        <span className="text-sm font-medium text-gray-900">{selectedArea.metrics.inventory}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Days on Market</span>
                        <span className="text-sm font-medium text-gray-900">{selectedArea.metrics.daysOnMarket}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        View Properties
                      </button>
                      <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            )}
          </Map>

          {/* Map Legend */}
          <div className="absolute bottom-6 right-6 bg-white rounded-xl shadow-lg p-4 w-64">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Market Temperature</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-600">Hot Market</span>
                </div>
                <span className="text-xs text-gray-900 font-medium">80-100</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs text-gray-600">Warm Market</span>
                </div>
                <span className="text-xs text-gray-900 font-medium">60-79</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-600">Cool Market</span>
                </div>
                <span className="text-xs text-gray-900 font-medium">0-59</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        .market-popup .mapboxgl-popup-content {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 12px !important;
        }
        .market-popup .mapboxgl-popup-tip {
          display: none !important;
        }
      `}</style>
    </div>
  )
}

export default RealEstateHeatMapV2