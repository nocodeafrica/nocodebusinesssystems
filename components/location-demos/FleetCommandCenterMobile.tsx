'use client'

import React, { useState, useEffect } from 'react'
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/mapbox'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search,
  Filter,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Phone,
  Truck,
  Navigation,
  Gauge,
  Fuel,
  Package,
  DollarSign,
  MoreVertical,
  Activity,
  X,
  ChevronDown,
  User,
  Bell,
  Car,
  Building2,
  Target,
  Timer,
  Route,
  Zap,
  Battery,
  Wifi,
  WifiOff,
  Trophy,
  ArrowLeft,
  Layers,
  MessageSquare
} from 'lucide-react'

// Reuse driver data from desktop version
const drivers = [
  {
    id: 'DRV001',
    name: 'David Gray',
    avatar: 'https://i.pravatar.cc/150?img=11',
    status: 'active',
    statusLabel: 'En Route',
    rating: 4.8,
    currentLocation: 'Southern Avenue, Murray',
    phone: '+27 81 234 5678',
    online: true,
    vehicle: {
      id: 'GR72 TD',
      type: 'Mercedes Benz',
      speed: 72,
      fuel: 68,
      battery: 95,
      currentCoordinates: [28.0673, -26.1841]
    },
    route: {
      name: 'Johannesburg North',
      totalDistance: '156 km',
      estimatedTime: '3h 45m',
      progress: 45,
      nextStop: 'Sandton Warehouse',
      stopsCompleted: 2,
      totalStops: 5
    }
  },
  {
    id: 'DRV002',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'active',
    statusLabel: 'Loading',
    rating: 4.9,
    currentLocation: 'Warehouse District',
    phone: '+27 82 345 6789',
    online: true,
    vehicle: {
      id: 'BT54 XY',
      type: 'Isuzu NPR',
      speed: 0,
      fuel: 82,
      battery: 90,
      currentCoordinates: [28.0473, -26.1041]
    },
    route: {
      name: 'Cape Town Central',
      totalDistance: '89 km',
      estimatedTime: '2h 15m',
      progress: 0,
      nextStop: 'Starting Route',
      stopsCompleted: 0,
      totalStops: 4
    }
  },
  {
    id: 'DRV003',
    name: 'Mike Chen',
    avatar: 'https://i.pravatar.cc/150?img=8',
    status: 'inactive',
    statusLabel: 'Break',
    rating: 4.7,
    currentLocation: 'Rest Stop, N1',
    phone: '+27 83 456 7890',
    online: true,
    vehicle: {
      id: 'KL89 RS',
      type: 'Ford Transit',
      speed: 0,
      fuel: 45,
      battery: 88,
      currentCoordinates: [28.1073, -26.2041]
    },
    route: {
      name: 'Pretoria Route',
      totalDistance: '124 km',
      estimatedTime: '3h',
      progress: 60,
      nextStop: 'Resuming in 15 min',
      stopsCompleted: 3,
      totalStops: 5
    }
  }
]

const FleetCommandCenterMobile = () => {
  const [viewState, setViewState] = useState({
    longitude: 28.0473,
    latitude: -26.1041,
    zoom: 11
  })
  const [selectedDriver, setSelectedDriver] = useState<any>(null)
  const [showDriverList, setShowDriverList] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'route' | 'vehicle'>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'En Route': return 'text-green-600 bg-green-100'
      case 'Loading': return 'text-blue-600 bg-blue-100'
      case 'Break': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="h-screen relative bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-gray-900">Fleet Command</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => setShowDriverList(!showDriverList)}
              className="p-2 bg-blue-600 text-white rounded-lg"
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <div className="flex-shrink-0 bg-green-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Active</p>
                <p className="text-sm font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 bg-blue-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Deliveries</p>
                <p className="text-sm font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 bg-yellow-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-600">On Time</p>
                <p className="text-sm font-bold text-gray-900">94%</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 bg-purple-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Routes</p>
                <p className="text-sm font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-full pt-32">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
        >
          <NavigationControl position="top-right" />
          
          {/* Vehicle markers */}
          {drivers.map(driver => {
            if (!driver.vehicle?.currentCoordinates) return null
            
            return (
              <Marker
                key={driver.id}
                longitude={driver.vehicle.currentCoordinates[0]}
                latitude={driver.vehicle.currentCoordinates[1]}
                onClick={() => setSelectedDriver(driver)}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    selectedDriver?.id === driver.id 
                      ? 'bg-blue-500 scale-125' 
                      : driver.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  {driver.online && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
              </Marker>
            )
          })}
        </Map>
      </div>

      {/* Driver List Sheet */}
      <AnimatePresence>
        {showDriverList && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDriverList(false)}
              className="fixed inset-0 bg-black/50 z-30"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 bg-white w-80 z-40 shadow-xl overflow-hidden"
            >
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-900">Drivers</h2>
                  <button onClick={() => setShowDriverList(false)} className="p-2">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search drivers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="overflow-y-auto h-full pb-20">
                {drivers.map((driver) => (
                  <div
                    key={driver.id}
                    onClick={() => {
                      setSelectedDriver(driver)
                      setShowDriverList(false)
                    }}
                    className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(driver.status)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900">{driver.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusLabel(driver.statusLabel)}`}>
                            {driver.statusLabel}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{driver.vehicle.id} • {driver.vehicle.type}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Gauge className="w-3 h-3" />
                            {driver.vehicle.speed} km/h
                          </div>
                          <div className="flex items-center gap-1">
                            <Fuel className="w-3 h-3" />
                            {driver.vehicle.fuel}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Driver Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedDriver && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                setSelectedDriver(null)
              }
            }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-30 max-h-[70vh] shadow-2xl"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Driver Header */}
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedDriver.avatar}
                    alt={selectedDriver.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h2 className="text-base font-bold text-gray-900">{selectedDriver.name}</h2>
                    <p className="text-xs text-gray-600">{selectedDriver.vehicle.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-green-600 text-white rounded-lg">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-blue-600 text-white rounded-lg">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4 pb-2">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'overview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('route')}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'route' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Route
                </button>
                <button
                  onClick={() => setActiveTab('vehicle')}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'vehicle' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Vehicle
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="px-4 pb-6 overflow-y-auto max-h-[40vh]">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Current Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusLabel(selectedDriver.statusLabel)}`}>
                        {selectedDriver.statusLabel}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{selectedDriver.currentLocation}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Speed</p>
                      <p className="text-lg font-bold text-gray-900">{selectedDriver.vehicle.speed} km/h</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Fuel</p>
                      <p className="text-lg font-bold text-gray-900">{selectedDriver.vehicle.fuel}%</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Today's Progress</span>
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-lg font-bold">12</p>
                        <p className="text-xs opacity-90">Deliveries</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">156km</p>
                        <p className="text-xs opacity-90">Distance</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">98%</p>
                        <p className="text-xs opacity-90">On Time</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'route' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">{selectedDriver.route.name}</h3>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        style={{ width: `${selectedDriver.route.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{selectedDriver.route.totalDistance}</span>
                      <span>{selectedDriver.route.progress}% Complete</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Next Stop</p>
                      <p className="text-sm font-medium text-gray-900">{selectedDriver.route.nextStop}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Stops</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedDriver.route.stopsCompleted}/{selectedDriver.route.totalStops}
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Estimated Arrival</p>
                        <p className="text-lg font-bold text-gray-900">{selectedDriver.route.estimatedTime}</p>
                      </div>
                      <Clock className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vehicle' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Truck className="w-8 h-8 text-gray-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{selectedDriver.vehicle.type}</p>
                        <p className="text-xs text-gray-600">Registration: {selectedDriver.vehicle.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Fuel className="w-4 h-4 text-blue-600" />
                        <p className="text-xs text-gray-500">Fuel Level</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedDriver.vehicle.fuel}%</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Battery className="w-4 h-4 text-green-600" />
                        <p className="text-xs text-gray-500">Battery</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedDriver.vehicle.battery}%</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Next Service</p>
                        <p className="text-sm font-medium text-gray-900">In 2,300 km</p>
                      </div>
                      <Activity className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FleetCommandCenterMobile