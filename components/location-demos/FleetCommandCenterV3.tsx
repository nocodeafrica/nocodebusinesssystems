'use client'

import React, { useState, useEffect } from 'react'
import Map, { Marker, Source, Layer, NavigationControl, ScaleControl, Popup } from 'react-map-gl/mapbox'
import { motion, AnimatePresence } from 'framer-motion'
import MobileMapOverlay, { MiniLocationCard } from '../mobile/MobileMapOverlay'
import { 
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Award,
  Truck,
  Navigation,
  Gauge,
  Fuel,
  Package,
  DollarSign,
  Star,
  MoreVertical,
  Shield,
  Activity,
  X,
  ChevronDown,
  User,
  Edit,
  Bell,
  Settings,
  LogOut,
  Car,
  Bike,
  Home,
  Building2,
  Flag,
  Target,
  Timer,
  Route,
  Zap,
  Battery,
  Wifi,
  WifiOff,
  Trophy
} from 'lucide-react'

// Enhanced driver data with multiple stops for each route
const drivers = [
  {
    id: 'DRV001',
    name: 'David Gray',
    avatar: 'https://i.pravatar.cc/150?img=11',
    status: 'active',
    statusLabel: 'En Route',
    experience: '7 years',
    rating: 4.8,
    totalDeliveries: 2781,
    onTimeRate: 98,
    currentLocation: 'Southern Avenue, Murray',
    phone: '+27 81 234 5678',
    email: 'david.gray@fleet.com',
    licenseClass: 'HDV Class 1',
    online: true,
    vehicle: {
      id: 'GR72 TD',
      type: 'Mercedes Benz Axor',
      year: 2019,
      color: 'Gray',
      status: 'en-route',
      speed: 72,
      fuel: 68,
      battery: 95,
      temperature: 85,
      nextService: '2,300 km',
      currentCoordinates: [28.0673, -26.1841]
    },
    route: {
      id: 'RT-001',
      name: 'Johannesburg North Route',
      totalDistance: '156 km',
      estimatedTime: '3h 45m',
      progress: 45,
      stops: [
        {
          id: 'ST001',
          type: 'pickup',
          name: 'Warehouse District',
          address: '2397 Coal Street, Sandton',
          coordinates: [28.0473, -26.1041],
          packages: 24,
          status: 'completed',
          arrivalTime: '08:30',
          departureTime: '08:45'
        },
        {
          id: 'ST002',
          type: 'delivery',
          name: 'MegaCorp Industries',
          address: '45 Business Park, Midrand',
          coordinates: [28.1273, -25.9941],
          packages: 8,
          status: 'completed',
          arrivalTime: '09:15',
          departureTime: '09:25'
        },
        {
          id: 'ST003',
          type: 'delivery',
          name: 'TechHub Office',
          address: '122 Innovation Drive, Centurion',
          coordinates: [28.1873, -25.8641],
          packages: 6,
          status: 'in-progress',
          arrivalTime: '10:00',
          estimatedArrival: '10:05'
        },
        {
          id: 'ST004',
          type: 'delivery',
          name: 'Retail Center',
          address: '88 Mall Road, Pretoria',
          coordinates: [28.2273, -25.7441],
          packages: 10,
          status: 'pending',
          estimatedArrival: '10:45'
        }
      ],
      routePath: [
        [28.0473, -26.1041],
        [28.0573, -26.0841],
        [28.0673, -26.0641],
        [28.0873, -26.0441],
        [28.1073, -26.0241],
        [28.1273, -25.9941],
        [28.1473, -25.9641],
        [28.1673, -25.9341],
        [28.1873, -25.8641],
        [28.2073, -25.8041],
        [28.2273, -25.7441]
      ]
    },
    performance: {
      deliveriesToday: 12,
      packagesDelivered: 86,
      distance: '142 km',
      avgSpeed: '68 km/h',
      fuelUsed: '18.5L',
      idleTime: '45 min',
      drivingTime: '2h 15m'
    }
  },
  {
    id: 'DRV002',
    name: 'Samir Gutierrez',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'active',
    statusLabel: 'On Delivery',
    experience: '5 years',
    rating: 4.9,
    totalDeliveries: 1965,
    onTimeRate: 96,
    currentLocation: 'Derrick Street, Boston',
    phone: '+27 82 345 6789',
    email: 'samir.g@fleet.com',
    licenseClass: 'C+E',
    online: true,
    vehicle: {
      id: 'VH-023',
      type: 'Isuzu NPR',
      year: 2021,
      color: 'White',
      status: 'delivering',
      speed: 45,
      fuel: 82,
      battery: 88,
      temperature: 78,
      nextService: '5,100 km',
      currentCoordinates: [28.0473, -26.2041]
    },
    route: {
      id: 'RT-002',
      name: 'CBD Express Route',
      totalDistance: '89 km',
      estimatedTime: '2h 30m',
      progress: 67,
      stops: [
        {
          id: 'ST011',
          type: 'pickup',
          name: 'Central Depot',
          address: '15 Depot Road, Johannesburg',
          coordinates: [28.0373, -26.2041],
          packages: 18,
          status: 'completed',
          arrivalTime: '07:00',
          departureTime: '07:20'
        },
        {
          id: 'ST012',
          type: 'delivery',
          name: 'City Tower',
          address: '200 Commissioner St, Johannesburg',
          coordinates: [28.0473, -26.2041],
          packages: 5,
          status: 'in-progress',
          arrivalTime: '07:45',
          estimatedArrival: '07:50'
        },
        {
          id: 'ST013',
          type: 'delivery',
          name: 'Financial Plaza',
          address: '55 Marshall St, Johannesburg',
          coordinates: [28.0573, -26.2041],
          packages: 7,
          status: 'pending',
          estimatedArrival: '08:15'
        },
        {
          id: 'ST014',
          type: 'delivery',
          name: 'Trade Center',
          address: '78 Fox Street, Johannesburg',
          coordinates: [28.0673, -26.2041],
          packages: 6,
          status: 'pending',
          estimatedArrival: '08:45'
        }
      ],
      routePath: [
        [28.0373, -26.2041],
        [28.0473, -26.2041],
        [28.0573, -26.2041],
        [28.0673, -26.2041]
      ]
    },
    performance: {
      deliveriesToday: 8,
      packagesDelivered: 42,
      distance: '56 km',
      avgSpeed: '52 km/h',
      fuelUsed: '8.2L',
      idleTime: '35 min',
      drivingTime: '1h 45m'
    }
  },
  {
    id: 'DRV003',
    name: 'Halina Rogers',
    avatar: 'https://i.pravatar.cc/150?img=44',
    status: 'idle',
    statusLabel: 'Break Time',
    experience: '10 years',
    rating: 5.0,
    totalDeliveries: 4521,
    onTimeRate: 99,
    currentLocation: 'Rest Stop Plaza, N1 Highway',
    phone: '+27 83 456 7890',
    email: 'halina.r@fleet.com',
    licenseClass: 'HDV Class 1',
    online: true,
    vehicle: {
      id: 'VH-015',
      type: 'Volvo FH16',
      year: 2020,
      color: 'Blue',
      status: 'idle',
      speed: 0,
      fuel: 45,
      battery: 100,
      temperature: 72,
      nextService: '800 km',
      currentCoordinates: [27.9873, -26.1541]
    },
    route: {
      id: 'RT-003',
      name: 'Completed Morning Route',
      totalDistance: '125 km',
      estimatedTime: '3h',
      progress: 100,
      stops: [
        {
          id: 'ST021',
          type: 'pickup',
          name: 'Distribution Hub',
          coordinates: [27.9873, -26.1541],
          packages: 30,
          status: 'completed'
        }
      ],
      routePath: [[27.9873, -26.1541]]
    },
    performance: {
      deliveriesToday: 15,
      packagesDelivered: 95,
      distance: '125 km',
      avgSpeed: '71 km/h',
      fuelUsed: '22L',
      idleTime: '20 min',
      drivingTime: '3h 10m'
    }
  },
  {
    id: 'DRV004',
    name: 'Jim Bright',
    avatar: 'https://i.pravatar.cc/150?img=12',
    status: 'active',
    statusLabel: 'En Route',
    experience: '3 years',
    rating: 4.5,
    totalDeliveries: 876,
    onTimeRate: 92,
    currentLocation: 'Briarwood Drive, Rosebank',
    phone: '+27 84 567 8901',
    email: 'jim.bright@fleet.com',
    licenseClass: 'C',
    online: true,
    vehicle: {
      id: 'VH-008',
      type: 'Ford Transit',
      year: 2022,
      color: 'Silver',
      status: 'en-route',
      speed: 55,
      fuel: 71,
      battery: 92,
      temperature: 80,
      nextService: '3,200 km',
      currentCoordinates: [28.0373, -26.1441]
    },
    route: {
      id: 'RT-004',
      name: 'Rosebank Local Deliveries',
      totalDistance: '42 km',
      estimatedTime: '1h 30m',
      progress: 25,
      stops: [
        {
          id: 'ST031',
          type: 'pickup',
          name: 'Rosebank Mall Storage',
          coordinates: [28.0373, -26.1441],
          packages: 12,
          status: 'completed'
        },
        {
          id: 'ST032',
          type: 'delivery',
          name: 'Oxford Parks',
          coordinates: [28.0473, -26.1341],
          packages: 4,
          status: 'in-progress'
        },
        {
          id: 'ST033',
          type: 'delivery',
          name: 'Melrose Arch',
          coordinates: [28.0573, -26.1241],
          packages: 8,
          status: 'pending'
        }
      ],
      routePath: [
        [28.0373, -26.1441],
        [28.0473, -26.1341],
        [28.0573, -26.1241]
      ]
    },
    performance: {
      deliveriesToday: 4,
      packagesDelivered: 18,
      distance: '28 km',
      avgSpeed: '48 km/h',
      fuelUsed: '4.5L',
      idleTime: '25 min',
      drivingTime: '45m'
    }
  },
  {
    id: 'DRV005',
    name: 'Nicholas Graham',
    avatar: 'https://i.pravatar.cc/150?img=8',
    status: 'offline',
    statusLabel: 'Off Duty',
    experience: '8 years',
    rating: 4.7,
    totalDeliveries: 3079,
    onTimeRate: 95,
    currentLocation: 'Home - Fourways',
    phone: '+27 85 678 9012',
    email: 'nicholas.g@fleet.com',
    licenseClass: 'C+E',
    online: false,
    vehicle: null,
    route: null,
    performance: {
      deliveriesToday: 0,
      packagesDelivered: 0,
      distance: '0 km',
      avgSpeed: '0 km/h',
      fuelUsed: '0L',
      idleTime: '0 min',
      drivingTime: '0h'
    }
  }
]

const FleetCommandCenterV3 = () => {
  const [selectedDriver, setSelectedDriver] = useState(drivers[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'tracking' | 'analytics' | 'details'>('tracking')
  const [showStopDetails, setShowStopDetails] = useState<string | null>(null)
  const [showTimeline, setShowTimeline] = useState(false)
  const [viewState, setViewState] = useState({
    latitude: -26.1041,
    longitude: 28.0473,
    zoom: 10
  })
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'idle': return 'text-yellow-600 bg-yellow-100'
      case 'offline': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStopStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#10b981'
      case 'in-progress': return '#3b82f6'
      case 'pending': return '#9ca3af'
      default: return '#9ca3af'
    }
  }

  const getStopIcon = (type: string, status: string) => {
    if (status === 'completed') return '✓'
    if (status === 'in-progress') return '⏱'
    if (type === 'pickup') return '📦'
    if (type === 'delivery') return '📍'
    return '•'
  }

  // Mobile layout
  if (isMobile) {
    // Create mini cards for drivers
    const driverCards = drivers.map(driver => (
      <MiniLocationCard
        key={driver.id}
        title={driver.name}
        subtitle={driver.vehicle?.id || 'No vehicle'}
        distance={driver.vehicle?.speed ? `${driver.vehicle.speed} km/h` : 'Idle'}
        status={driver.status === 'active' ? 'open' : driver.status === 'idle' ? 'busy' : 'closed'}
        onClick={() => {
          setSelectedDriver(driver)
          if (driver.vehicle?.currentCoordinates) {
            setViewState({
              latitude: driver.vehicle.currentCoordinates[1],
              longitude: driver.vehicle.currentCoordinates[0],
              zoom: 14
            })
          }
        }}
        isSelected={selectedDriver?.id === driver.id}
      />
    ))

    // Selected driver content
    const selectedContent = selectedDriver ? (
      <div className="space-y-4">
        {/* Driver Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <img src={selectedDriver.avatar} alt={selectedDriver.name} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selectedDriver.name}</h3>
              <p className="text-sm text-gray-500">{selectedDriver.currentLocation}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDriver.status)}`}>
              {selectedDriver.statusLabel}
            </span>
          </div>
          
          {/* Vehicle Info */}
          {selectedDriver.vehicle && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Truck className="w-3 h-3" />
                  <span>Vehicle</span>
                </div>
                <p className="text-sm font-medium">{selectedDriver.vehicle.id}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Gauge className="w-3 h-3" />
                  <span>Speed</span>
                </div>
                <p className="text-sm font-medium">{selectedDriver.vehicle.speed} km/h</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Fuel className="w-3 h-3" />
                  <span>Fuel</span>
                </div>
                <p className="text-sm font-medium">{selectedDriver.vehicle.fuel}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Battery className="w-3 h-3" />
                  <span>Battery</span>
                </div>
                <p className="text-sm font-medium">{selectedDriver.vehicle.battery}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Route Progress */}
        {selectedDriver.route && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">{selectedDriver.route.name}</h4>
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
        )}
      </div>
    ) : null

    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg h-[600px] relative">
        <MobileMapOverlay
          miniCards={driverCards}
          selectedContent={selectedContent}
          hasSelection={!!selectedDriver}
        >
          {/* Map */}
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
          >
            <NavigationControl position="top-right" />
            
            {/* Render vehicle markers and routes */}
            {drivers.map(driver => {
              if (!driver.vehicle?.currentCoordinates) return null
              
              return (
                <Marker
                  key={driver.id}
                  longitude={driver.vehicle.currentCoordinates[0]}
                  latitude={driver.vehicle.currentCoordinates[1]}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`relative ${selectedDriver?.id === driver.id ? 'z-20' : 'z-10'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      selectedDriver?.id === driver.id 
                        ? 'bg-blue-500 scale-110' 
                        : driver.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    {selectedDriver?.id === driver.id && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md">
                        <p className="text-xs font-medium text-gray-900 whitespace-nowrap">{driver.vehicle.id}</p>
                      </div>
                    )}
                  </motion.div>
                </Marker>
              )
            })}

            {/* Render route stops */}
            {selectedDriver?.route?.stops?.map((stop, index) => (
              <Marker
                key={stop.id}
                longitude={stop.coordinates[0]}
                latitude={stop.coordinates[1]}
              >
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                    stop.status === 'completed' ? 'bg-green-500 text-white' :
                    stop.status === 'in-progress' ? 'bg-blue-500 text-white' :
                    'bg-white text-gray-700 border-2 border-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                </div>
              </Marker>
            ))}
          </Map>
        </MobileMapOverlay>
      </div>
    )
  }

  // Desktop layout
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: '1200px' }}>
      <div className="flex h-full" style={{ minHeight: '1200px' }}>
        {/* Left Sidebar - Drivers List */}
        <div className="w-[300px] bg-gray-50 border-r border-gray-200 flex flex-col" style={{ maxHeight: '1200px' }}>
          {/* Header */}
          <div className="p-5 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">Drivers</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">All (332)</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <Filter className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Add Driver Button */}
            <button className="w-full mt-3 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add driver
            </button>
          </div>

          {/* Drivers List */}
          <div className="flex-1 overflow-y-auto">
            {drivers.filter(d => 
              d.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((driver) => (
              <motion.div
                key={driver.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                onClick={() => {
                  setSelectedDriver(driver)
                  setShowTimeline(true)
                  if (driver.route?.stops && driver.route.stops.length > 0) {
                    const firstStop = driver.route.stops[0]
                    setViewState({
                      latitude: firstStop.coordinates[1],
                      longitude: firstStop.coordinates[0],
                      zoom: 11
                    })
                  } else if (driver.vehicle?.currentCoordinates) {
                    setViewState({
                      latitude: driver.vehicle.currentCoordinates[1],
                      longitude: driver.vehicle.currentCoordinates[0],
                      zoom: 12
                    })
                  }
                }}
                className={`p-3.5 border-b border-gray-100 cursor-pointer transition-all ${
                  selectedDriver?.id === driver.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      driver.status === 'active' ? 'bg-green-500' :
                      driver.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">{driver.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{driver.currentLocation}</p>
                      </div>
                      <MoreVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(driver.status)}`}>
                        {driver.statusLabel}
                      </span>
                      {driver.vehicle?.speed && driver.vehicle.speed > 0 && (
                        <span className="text-xs text-gray-600">
                          {driver.vehicle.speed} km/h
                        </span>
                      )}
                      {driver.online && (
                        <Wifi className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Driver Header */}
          {selectedDriver && (
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedDriver.avatar}
                    alt={selectedDriver.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedDriver.name}</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500">
                        Girteka Logistic • {selectedDriver.licenseClass}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{selectedDriver.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    <Edit className="w-3.5 h-3.5 inline mr-1.5" />
                    Edit
                  </button>
                </div>
              </div>

              {/* Quick Stats - More Compact */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">Category</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedDriver.vehicle?.type ? 'C+E' : 'N/A'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">Experience</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedDriver.experience}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">Driver score</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedDriver.rating} 
                    <span className="text-xs text-red-500 ml-1">-0.2</span>
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">Location</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {selectedDriver.currentLocation?.split(',')[0]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-5">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tracking' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Tracking
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'analytics' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'details' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Details
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1" style={{ minHeight: '850px' }}>
            {activeTab === 'tracking' && selectedDriver && (
              <div className="h-full flex" style={{ height: '850px' }}>
                {/* Map - Full Height */}
                <div className="flex-1 relative">
                  <Map
                    {...viewState}
                    onMove={(evt) => setViewState(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/light-v11"
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <NavigationControl position="top-right" />
                    <ScaleControl position="bottom-right" />

                    {/* Route Path */}
                    {selectedDriver.route?.routePath && selectedDriver.route.routePath.length > 1 && (
                      <Source
                        key={`route-${selectedDriver.id}`}
                        id="route"
                        type="geojson"
                        data={{
                          type: 'Feature',
                          properties: {},
                          geometry: {
                            type: 'LineString',
                            coordinates: selectedDriver.route.routePath
                          }
                        }}
                      >
                        <Layer
                          id="route-line"
                          type="line"
                          paint={{
                            'line-color': '#3b82f6',
                            'line-width': 3,
                            'line-opacity': 0.7,
                            'line-dasharray': [2, 1]
                          }}
                        />
                      </Source>
                    )}

                    {/* Delivery/Pickup Stops */}
                    {selectedDriver.route?.stops.map((stop) => (
                      <Marker
                        key={stop.id}
                        longitude={stop.coordinates[0]}
                        latitude={stop.coordinates[1]}
                        onClick={() => setShowStopDetails(stop.id)}
                      >
                        <div className="relative group">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-transform group-hover:scale-110"
                            style={{ 
                              backgroundColor: stop.status === 'completed' ? '#10b981' :
                                             stop.status === 'in-progress' ? '#3b82f6' : '#ffffff',
                              border: `3px solid ${getStopStatusColor(stop.status)}`
                            }}
                          >
                            <span className="text-lg font-bold" style={{ 
                              color: stop.status === 'pending' ? '#6b7280' : '#ffffff' 
                            }}>
                              {getStopIcon(stop.type, stop.status)}
                            </span>
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {stop.name}
                          </div>
                        </div>
                      </Marker>
                    ))}

                    {/* Current Vehicle Position */}
                    {selectedDriver.vehicle?.currentCoordinates && (
                      <Marker
                        longitude={selectedDriver.vehicle.currentCoordinates[0]}
                        latitude={selectedDriver.vehicle.currentCoordinates[1]}
                      >
                        <div className="relative">
                          <div className="p-3 bg-blue-600 rounded-full shadow-xl animate-pulse">
                            <Truck className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        </div>
                      </Marker>
                    )}

                    {/* Stop Details Popup */}
                    {showStopDetails && selectedDriver?.route?.stops && (
                      <Popup
                        longitude={selectedDriver.route.stops.find(s => s.id === showStopDetails)?.coordinates[0] || 0}
                        latitude={selectedDriver.route.stops.find(s => s.id === showStopDetails)?.coordinates[1] || 0}
                        onClose={() => setShowStopDetails(null)}
                        closeButton={false}
                        className="stop-popup"
                      >
                        {(() => {
                          const stop = selectedDriver?.route?.stops?.find(s => s.id === showStopDetails)
                          if (!stop) return null
                          return (
                            <div className="bg-white rounded-lg p-3 min-w-[250px] shadow-xl">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{stop.name}</h4>
                                <button
                                  onClick={() => setShowStopDetails(null)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{(stop as any).address}</p>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500">Packages:</span>
                                  <span className="font-medium">{stop.packages}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500">Status:</span>
                                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                                    stop.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    stop.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {stop.status}
                                  </span>
                                </div>
                                {(stop as any).estimatedArrival && (
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">ETA:</span>
                                    <span className="font-medium">{(stop as any).estimatedArrival}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })()}
                      </Popup>
                    )}
                  </Map>

                  {/* Vehicle Info Card Overlay */}
                  {selectedDriver.vehicle && (
                    <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-xl p-4 w-80">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{selectedDriver.vehicle.id}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          {selectedDriver.vehicle.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {selectedDriver.vehicle.type} • {selectedDriver.vehicle.year} • {selectedDriver.vehicle.color}
                      </p>
                      
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Gauge className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">Speed</span>
                          </div>
                          <p className="text-sm font-semibold">{selectedDriver.vehicle.speed} km/h</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Fuel className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">Fuel</span>
                          </div>
                          <p className="text-sm font-semibold">{selectedDriver.vehicle.fuel}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Battery className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">Battery</span>
                          </div>
                          <p className="text-sm font-semibold">{selectedDriver.vehicle.battery}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Settings className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">Service</span>
                          </div>
                          <p className="text-xs font-semibold">{selectedDriver.vehicle.nextService}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Route Progress Bar */}
                  {selectedDriver?.route && selectedDriver.route.stops && (
                    <div className="absolute top-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{selectedDriver.route.name}</h3>
                        <span className="text-sm text-gray-500">
                          {selectedDriver.route.totalDistance} • {selectedDriver.route.estimatedTime}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                          style={{ width: `${selectedDriver.route.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {selectedDriver.route.stops.filter(s => s.status === 'completed').length} of {selectedDriver.route.stops.length} stops completed
                        </span>
                        <span className="text-xs font-medium text-blue-600">
                          {selectedDriver.route.progress}% Complete
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Route Timeline Sidebar - Collapsible */}
                <AnimatePresence>
                  {showTimeline && selectedDriver?.route?.stops && selectedDriver.route.stops.length > 0 && (
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 320, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 border-l border-gray-200 overflow-hidden"
                    >
                      <div className="p-5 h-full overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Route Timeline</h3>
                          <button
                            onClick={() => setShowTimeline(false)}
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                    
                    <div className="space-y-4">
                      {selectedDriver.route.stops.map((stop, index) => (
                        <div key={stop.id} className="relative">
                          {index < selectedDriver.route!.stops.length - 1 && (
                            <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-300" />
                          )}
                          
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center z-10"
                              style={{ 
                                backgroundColor: stop.status === 'completed' ? '#10b981' :
                                               stop.status === 'in-progress' ? '#3b82f6' : '#e5e7eb',
                                color: stop.status === 'pending' ? '#6b7280' : '#ffffff'
                              }}
                            >
                              {stop.status === 'completed' ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : stop.status === 'in-progress' ? (
                                <Timer className="w-4 h-4" />
                              ) : (
                                <span className="text-xs font-bold">{index + 1}</span>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="flex items-start justify-between mb-1">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{stop.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{(stop as any).address}</p>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    stop.type === 'pickup' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                  }`}>
                                    {stop.type}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    {stop.packages} packages
                                  </span>
                                  {(stop as any).estimatedArrival && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      ETA {(stop as any).estimatedArrival}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeTab === 'analytics' && selectedDriver && (
              <div className="p-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Deliveries Today</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedDriver.performance?.deliveriesToday || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedDriver.performance?.packagesDelivered || 0} packages
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">Distance</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedDriver.performance?.distance || '0 km'}</p>
                    <p className="text-xs text-gray-500 mt-1">Avg {selectedDriver.performance?.avgSpeed || '0 km/h'}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Fuel className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-gray-600">Fuel Used</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedDriver.performance?.fuelUsed || '0L'}</p>
                    <p className="text-xs text-gray-500 mt-1">Economy: Good</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600">Drive Time</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedDriver.performance?.drivingTime || '0h'}</p>
                    <p className="text-xs text-gray-500 mt-1">Idle: {selectedDriver.performance?.idleTime || '0 min'}</p>
                  </div>
                </div>

                {/* Charts and more analytics... */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Weekly Performance</h3>
                    <div className="h-48 flex items-end justify-between gap-2">
                      {[65, 78, 42, 89, 76, 93, 68].map((height, i) => (
                        <div key={i} className="flex-1">
                          <div className="bg-blue-500 rounded-t transition-all hover:bg-blue-600" style={{ height: `${height}%` }} />
                          <p className="text-xs text-gray-500 text-center mt-1">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Delivery Stats</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">On-Time Rate</span>
                          <span className="font-medium">{selectedDriver.onTimeRate}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${selectedDriver.onTimeRate}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Customer Rating</span>
                          <span className="font-medium">{selectedDriver.rating}/5.0</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(selectedDriver.rating / 5) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Total Deliveries</span>
                          <span className="font-medium">{selectedDriver.totalDeliveries}</span>
                        </div>
                        <div className="text-xs text-gray-500">Lifetime achievement</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && selectedDriver && (
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="text-sm font-medium text-gray-900">{selectedDriver.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{selectedDriver.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">{selectedDriver.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">License Class</p>
                        <p className="text-sm font-medium text-gray-900">{selectedDriver.licenseClass}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-sm font-medium text-gray-900">{selectedDriver.experience}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  {selectedDriver.vehicle ? (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Assigned Vehicle</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Vehicle ID</p>
                          <p className="text-sm font-medium text-gray-900">{selectedDriver.vehicle.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Model</p>
                          <p className="text-sm font-medium text-gray-900">{selectedDriver.vehicle.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Year</p>
                          <p className="text-sm font-medium text-gray-900">{selectedDriver.vehicle.year}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Color</p>
                          <p className="text-sm font-medium text-gray-900">{selectedDriver.vehicle.color}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Next Service</p>
                          <p className="text-sm font-medium text-gray-900">{selectedDriver.vehicle.nextService}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">No Vehicle Assigned</h3>
                      <p className="text-sm text-gray-500">Driver is currently off duty</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        .stop-popup .mapboxgl-popup-content {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  )
}

export default FleetCommandCenterV3