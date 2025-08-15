'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Map, { Marker, Popup, NavigationControl, GeolocateControl, Source, Layer } from 'react-map-gl/mapbox'
import circle from '@turf/circle'
import { point } from '@turf/helpers'
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  Navigation,
  ChevronRight,
  X,
  Heart,
  Share2,
  Car,
  Coffee,
  ShoppingBag,
  Wifi,
  CreditCard,
  Shield,
  List,
  Map as MapIcon,
  Store
} from 'lucide-react'
import MobileBottomSheet from '../mobile/MobileBottomSheet'
import MobileFilterBar from '../mobile/MobileFilterBar'
import MobileMapControls from '../mobile/MobileMapControls'
import MobileInfoCard from '../mobile/MobileInfoCard'
import MobileTabNav from '../mobile/MobileTabNav'
import { useHapticFeedback } from '../mobile/TouchInteractionPatterns'
import 'mapbox-gl/dist/mapbox-gl.css'

// Enhanced business data with richer information
const businesses = [
  {
    id: 1,
    name: 'Sandton City',
    subtitle: 'Premium Shopping Destination',
    category: 'Shopping Mall',
    address: 'Sandton Central, Sandton',
    city: 'Johannesburg',
    rating: 4.8,
    reviews: 3420,
    hours: '09:00 - 21:00',
    phone: '+27 11 783 0000',
    coordinates: [28.0571, -26.1084],
    status: 'open' as const,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&h=400&fit=crop',
    tags: ['Premium', 'Fashion', 'Dining', 'Entertainment'],
    features: {
      parking: '8,000+ bays',
      stores: '300+',
      restaurants: '50+',
      wifi: true,
      wheelchair: true,
      valet: true
    }
  },
  {
    id: 2,
    name: 'Mall of Africa',
    subtitle: 'Largest Single-Phase Mall',
    category: 'Shopping Mall',
    address: 'Waterfall City, Midrand',
    city: 'Johannesburg',
    rating: 4.7,
    reviews: 2890,
    hours: '09:00 - 20:00',
    phone: '+27 11 517 2000',
    coordinates: [28.1087, -26.0143],
    status: 'open' as const,
    distance: 3.5,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    tags: ['Modern', 'Family', 'Entertainment', 'Tech'],
    features: {
      parking: '6,500 bays',
      stores: '280+',
      restaurants: '40+',
      wifi: true,
      wheelchair: true,
      valet: false
    }
  },
  {
    id: 3,
    name: 'Nelson Mandela Square',
    subtitle: 'Iconic Luxury Shopping',
    category: 'Shopping Center',
    address: 'Sandton, Johannesburg',
    city: 'Johannesburg',
    rating: 4.9,
    reviews: 1567,
    hours: '09:00 - 21:00',
    phone: '+27 11 783 0000',
    coordinates: [28.0574, -26.1082],
    status: 'open' as const,
    distance: 1.3,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    tags: ['Luxury', 'Dining', 'Fashion', 'Tourist'],
    features: {
      parking: '4,000 bays',
      stores: '150+',
      restaurants: '30+',
      wifi: true,
      wheelchair: true,
      valet: true
    }
  },
  {
    id: 4,
    name: 'Rosebank Mall',
    subtitle: 'Urban Shopping Experience',
    category: 'Shopping Mall',
    address: 'Rosebank, Johannesburg',
    city: 'Johannesburg',
    rating: 4.5,
    reviews: 2103,
    hours: '09:00 - 19:00',
    phone: '+27 11 788 5530',
    coordinates: [28.0436, -26.1451],
    status: 'closed' as const,
    distance: 5.8,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
    tags: ['Urban', 'Art', 'Markets', 'Culture'],
    features: {
      parking: '3,500 bays',
      stores: '180+',
      restaurants: '25+',
      wifi: true,
      wheelchair: true,
      valet: false
    }
  },
  {
    id: 5,
    name: 'Hyde Park Corner',
    subtitle: 'Exclusive Shopping Haven',
    category: 'Shopping Center',
    address: 'Hyde Park, Johannesburg',
    city: 'Johannesburg',
    rating: 4.6,
    reviews: 1876,
    hours: '09:00 - 18:00',
    phone: '+27 11 325 4340',
    coordinates: [28.0373, -26.1284],
    status: 'busy' as const,
    distance: 4.2,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    tags: ['Exclusive', 'Books', 'Gourmet', 'Boutique'],
    features: {
      parking: '2,000 bays',
      stores: '80+',
      restaurants: '15+',
      wifi: true,
      wheelchair: true,
      valet: true
    }
  }
]

const ModernBusinessLocatorMobile = () => {
  const [viewport, setViewport] = useState({
    latitude: -26.1084,
    longitude: 28.0571,
    zoom: 13
  })
  const [selectedBusiness, setSelectedBusiness] = useState<typeof businesses[0] | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('list')
  const [showBottomSheet, setShowBottomSheet] = useState(true)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const { triggerImpact } = useHapticFeedback()

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude])
        },
        (error) => console.error('Error getting location:', error)
      )
    }
  }, [])

  // Filter businesses based on search and filters
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesFilters = activeFilters.length === 0 || 
                            activeFilters.some(filter => business.status === filter || business.tags.includes(filter))
      
      return matchesSearch && matchesFilters
    })
  }, [searchQuery, activeFilters])

  const handleBusinessSelect = useCallback((business: typeof businesses[0]) => {
    triggerImpact('light')
    setSelectedBusiness(business)
    setViewport({
      latitude: business.coordinates[1],
      longitude: business.coordinates[0],
      zoom: 15
    })
  }, [triggerImpact])

  const handleGetDirections = useCallback((business: typeof businesses[0]) => {
    triggerImpact('medium')
    // In real app, integrate with navigation API
    console.log('Getting directions to:', business.name)
  }, [triggerImpact])

  const handleCall = useCallback((phone: string) => {
    triggerImpact('medium')
    window.location.href = `tel:${phone}`
  }, [triggerImpact])

  const handleShare = useCallback((business: typeof businesses[0]) => {
    triggerImpact('light')
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `Check out ${business.name} at ${business.address}`,
        url: window.location.href
      })
    }
  }, [triggerImpact])

  return (
    <div className="h-screen bg-gray-50 flex flex-col lg:hidden">
      {/* Mobile Tab Navigation */}
      <MobileTabNav
        tabs={[
          { id: 'list', label: 'List', icon: <List className="w-5 h-5" /> },
          { id: 'map', label: 'Map', icon: <MapIcon className="w-5 h-5" /> }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
      />

      {/* Mobile Filter Bar */}
      <MobileFilterBar
        searchPlaceholder="Search locations..."
        onSearch={setSearchQuery}
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: [
              { id: 'open', label: 'Open', value: 'open', count: 3 },
              { id: 'closed', label: 'Closed', value: 'closed', count: 1 },
              { id: 'busy', label: 'Busy', value: 'busy', count: 1 }
            ]
          },
          {
            id: 'features',
            label: 'Features',
            options: [
              { id: 'parking', label: 'Parking', value: 'parking' },
              { id: 'wifi', label: 'WiFi', value: 'wifi' },
              { id: 'wheelchair', label: 'Accessible', value: 'wheelchair' }
            ]
          }
        ]}
        activeFilters={activeFilters}
        onFilterChange={(filterId, optionId) => {
          setActiveFilters(prev => 
            prev.includes(optionId) 
              ? prev.filter(f => f !== optionId)
              : [...prev, optionId]
          )
        }}
        onClearFilters={() => setActiveFilters([])}
      />

      {/* Content Area */}
      <div className="flex-1 relative">
        {activeTab === 'map' ? (
          <>
            {/* Map View */}
            <Map
              {...viewport}
              onMove={evt => setViewport(evt.viewState)}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            >
              {/* User Location */}
              {userLocation && (
                <>
                  <Marker latitude={userLocation[1]} longitude={userLocation[0]}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75" />
                      <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
                    </div>
                  </Marker>
                  <Source
                    id="user-radius"
                    type="geojson"
                    data={circle(point(userLocation), 2, { units: 'kilometers' })}
                  >
                    <Layer
                      id="user-radius-fill"
                      type="fill"
                      paint={{
                        'fill-color': '#3B82F6',
                        'fill-opacity': 0.1
                      }}
                    />
                  </Source>
                </>
              )}

              {/* Business Markers */}
              {filteredBusinesses.map(business => (
                <Marker
                  key={business.id}
                  latitude={business.coordinates[1]}
                  longitude={business.coordinates[0]}
                  onClick={() => handleBusinessSelect(business)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative ${
                      selectedBusiness?.id === business.id ? 'z-20' : 'z-10'
                    }`}
                  >
                    <div className={`
                      p-2 rounded-full shadow-lg transition-all cursor-pointer
                      ${selectedBusiness?.id === business.id 
                        ? 'bg-blue-500 scale-110' 
                        : business.status === 'open' 
                          ? 'bg-green-500' 
                          : business.status === 'busy'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }
                    `}>
                      <Store className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                </Marker>
              ))}
            </Map>

            {/* Mobile Map Controls */}
            <MobileMapControls
              onZoomIn={() => setViewport(v => ({ ...v, zoom: Math.min(v.zoom + 1, 20) }))}
              onZoomOut={() => setViewport(v => ({ ...v, zoom: Math.max(v.zoom - 1, 1) }))}
              onResetView={() => setViewport({ latitude: -26.1084, longitude: 28.0571, zoom: 13 })}
              onLocateUser={() => {
                if (userLocation) {
                  setViewport({
                    latitude: userLocation[1],
                    longitude: userLocation[0],
                    zoom: 15
                  })
                }
              }}
              position="bottom-right"
            />
          </>
        ) : (
          /* List View */
          <div className="h-full overflow-y-auto bg-gray-50 pb-20">
            <div className="p-4 space-y-3">
              {filteredBusinesses.map(business => (
                <MobileInfoCard
                  key={business.id}
                  title={business.name}
                  subtitle={business.subtitle}
                  image={business.image}
                  rating={business.rating}
                  reviews={business.reviews}
                  address={business.address}
                  status={business.status}
                  badges={[
                    { id: 'distance', label: 'Distance', value: `${business.distance} km` },
                    { id: 'stores', label: 'Stores', value: business.features.stores }
                  ]}
                  actions={[
                    {
                      id: 'directions',
                      label: 'Directions',
                      icon: <Navigation className="w-4 h-4" />,
                      onClick: () => handleGetDirections(business),
                      primary: true
                    },
                    {
                      id: 'call',
                      label: 'Call',
                      icon: <Phone className="w-4 h-4" />,
                      onClick: () => handleCall(business.phone)
                    }
                  ]}
                  size="normal"
                  expandable={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Sheet for Selected Business (Map View) */}
        {activeTab === 'map' && selectedBusiness && (
          <MobileBottomSheet
            isOpen={showBottomSheet}
            onClose={() => setShowBottomSheet(false)}
            title={selectedBusiness.name}
            snapPoints={[0.4, 0.9]}
            defaultSnapPoint={0}
          >
            <div className="p-4">
              {/* Business Image */}
              <img
                src={selectedBusiness.image}
                alt={selectedBusiness.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              {/* Business Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{selectedBusiness.name}</h3>
                  <p className="text-sm text-gray-500">{selectedBusiness.subtitle}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{selectedBusiness.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({selectedBusiness.reviews} reviews)</span>
                </div>

                {/* Quick Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedBusiness.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{selectedBusiness.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedBusiness.phone}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {selectedBusiness.features.wifi && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm flex items-center gap-1">
                      <Wifi className="w-4 h-4" />
                      WiFi
                    </span>
                  )}
                  {selectedBusiness.features.wheelchair && (
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      Accessible
                    </span>
                  )}
                  {selectedBusiness.features.valet && (
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm flex items-center gap-1">
                      <Car className="w-4 h-4" />
                      Valet
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => handleGetDirections(selectedBusiness)}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Directions
                  </button>
                  <button
                    onClick={() => handleCall(selectedBusiness.phone)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button
                    onClick={() => handleShare(selectedBusiness)}
                    className="p-3 bg-gray-100 text-gray-700 rounded-lg"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </MobileBottomSheet>
        )}
      </div>
    </div>
  )
}

export default ModernBusinessLocatorMobile