'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox'
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
  Heart,
  Share2,
  Car,
  Coffee,
  ShoppingBag,
  Wifi,
  Shield,
  Store,
  Layers,
  List,
  X
} from 'lucide-react'
import MobileMapOverlay, { MiniLocationCard, FloatingActionButton } from '../mobile/MobileMapOverlay'
import MobileFilterBar from '../mobile/MobileFilterBar'
import { useHapticFeedback } from '../mobile/TouchInteractionPatterns'
import 'mapbox-gl/dist/mapbox-gl.css'

// Business data
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
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&h=400&fit=crop',
    tags: ['Premium', 'Fashion', 'Dining', 'Entertainment'],
    features: {
      parking: '8,000+ bays',
      stores: '300+',
      restaurants: '50+',
      wifi: true,
      wheelchair: true,
      valet: true
    },
    description: 'Sandton City is Africa\'s most iconic shopping destination, offering a world-class retail experience with over 300 stores, restaurants, and entertainment options.'
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
    distance: '3.5 km',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    tags: ['Modern', 'Family', 'Entertainment', 'Tech'],
    features: {
      parking: '6,500 bays',
      stores: '280+',
      restaurants: '40+',
      wifi: true,
      wheelchair: true,
      valet: false
    },
    description: 'Mall of Africa is the biggest shopping mall ever built in a single phase in Africa, featuring cutting-edge architecture and a diverse mix of local and international brands.'
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
    distance: '1.3 km',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    tags: ['Luxury', 'Dining', 'Fashion', 'Tourist'],
    features: {
      parking: '4,000 bays',
      stores: '150+',
      restaurants: '30+',
      wifi: true,
      wheelchair: true,
      valet: true
    },
    description: 'Home to the iconic 6-meter tall Nelson Mandela statue, this square offers luxury shopping, fine dining, and a vibrant piazza atmosphere.'
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
    distance: '5.8 km',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
    tags: ['Urban', 'Art', 'Markets', 'Culture'],
    features: {
      parking: '3,500 bays',
      stores: '180+',
      restaurants: '25+',
      wifi: true,
      wheelchair: true,
      valet: false
    },
    description: 'Rosebank Mall combines shopping with art and culture, featuring the popular Sunday Rooftop Market and African Craft Market.'
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
    distance: '4.2 km',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    tags: ['Exclusive', 'Books', 'Gourmet', 'Boutique'],
    features: {
      parking: '2,000 bays',
      stores: '80+',
      restaurants: '15+',
      wifi: true,
      wheelchair: true,
      valet: true
    },
    description: 'Hyde Park Corner is Southern Africa\'s most exclusive shopping center, featuring high-end boutiques, gourmet restaurants, and the famous Exclusive Books flagship store.'
  }
]

const ModernBusinessLocatorMobileV2 = () => {
  const [viewport, setViewport] = useState({
    latitude: -26.1084,
    longitude: 28.0571,
    zoom: 13
  })
  const [selectedBusiness, setSelectedBusiness] = useState<typeof businesses[0] | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showListView, setShowListView] = useState(false)
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

  // Filter businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.category.toLowerCase().includes(searchQuery.toLowerCase())
      
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

  const handleLocateUser = useCallback(() => {
    if (userLocation) {
      setViewport({
        latitude: userLocation[1],
        longitude: userLocation[0],
        zoom: 15
      })
      triggerImpact('light')
    }
  }, [userLocation, triggerImpact])

  // Search Bar Component
  const searchBar = (
    <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3">
      <Search className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search locations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 outline-none text-sm"
      />
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Filter className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  )

  // Mini Cards for horizontal scroll
  const miniCards = filteredBusinesses.map(business => (
    <MiniLocationCard
      key={business.id}
      title={business.name}
      subtitle={business.category}
      distance={business.distance}
      status={business.status}
      isSelected={selectedBusiness?.id === business.id}
      onClick={() => handleBusinessSelect(business)}
    />
  ))

  // Selected Business Content (Peek View)
  const selectedContent = selectedBusiness && (
    <div className="space-y-4">
      {/* Business Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{selectedBusiness.name}</h3>
          <p className="text-sm text-gray-500">{selectedBusiness.subtitle}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          selectedBusiness.status === 'open' ? 'bg-green-100 text-green-700' :
          selectedBusiness.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {selectedBusiness.status === 'open' ? '● Open' :
           selectedBusiness.status === 'busy' ? '● Busy' : '● Closed'}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{selectedBusiness.rating}</span>
          <span className="text-sm text-gray-500">({selectedBusiness.reviews})</span>
        </div>
        <span className="text-sm text-gray-400">•</span>
        <span className="text-sm text-gray-600">{selectedBusiness.distance}</span>
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

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => handleGetDirections(selectedBusiness)}
          className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </button>
        <button
          onClick={() => handleCall(selectedBusiness.phone)}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
          Call
        </button>
        <button
          onClick={() => handleShare(selectedBusiness)}
          className="p-3 bg-gray-100 text-gray-700 rounded-xl"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  // Full Detail Content (Expanded View)
  const detailContent = selectedBusiness && (
    <div className="space-y-4">
      {/* Image */}
      <img
        src={selectedBusiness.image}
        alt={selectedBusiness.name}
        className="w-full h-48 object-cover rounded-xl"
      />

      {/* All content from peek view */}
      {selectedContent}

      {/* Additional Details */}
      <div className="pt-4 border-t">
        <h4 className="font-semibold mb-2">About</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {selectedBusiness.description}
        </p>
      </div>

      {/* Features */}
      <div>
        <h4 className="font-semibold mb-3">Features</h4>
        <div className="grid grid-cols-2 gap-3">
          {selectedBusiness.features.parking && (
            <div className="flex items-center gap-2 text-sm">
              <Car className="w-4 h-4 text-gray-400" />
              <span>{selectedBusiness.features.parking}</span>
            </div>
          )}
          {selectedBusiness.features.stores && (
            <div className="flex items-center gap-2 text-sm">
              <Store className="w-4 h-4 text-gray-400" />
              <span>{selectedBusiness.features.stores}</span>
            </div>
          )}
          {selectedBusiness.features.restaurants && (
            <div className="flex items-center gap-2 text-sm">
              <Coffee className="w-4 h-4 text-gray-400" />
              <span>{selectedBusiness.features.restaurants}</span>
            </div>
          )}
          {selectedBusiness.features.wifi && (
            <div className="flex items-center gap-2 text-sm">
              <Wifi className="w-4 h-4 text-gray-400" />
              <span>Free WiFi</span>
            </div>
          )}
          {selectedBusiness.features.wheelchair && (
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-gray-400" />
              <span>Wheelchair Access</span>
            </div>
          )}
          {selectedBusiness.features.valet && (
            <div className="flex items-center gap-2 text-sm">
              <Car className="w-4 h-4 text-gray-400" />
              <span>Valet Parking</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 className="font-semibold mb-2">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {selectedBusiness.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen bg-gray-50 relative lg:hidden">
      {/* Filter Overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-40"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <MobileFilterBar
                searchPlaceholder="Search..."
                onSearch={setSearchQuery}
                filters={[
                  {
                    id: 'status',
                    label: 'Status',
                    options: [
                      { id: 'open', label: 'Open Now', value: 'open' },
                      { id: 'closed', label: 'Closed', value: 'closed' },
                      { id: 'busy', label: 'Busy', value: 'busy' }
                    ]
                  },
                  {
                    id: 'features',
                    label: 'Features',
                    options: [
                      { id: 'Premium', label: 'Premium', value: 'Premium' },
                      { id: 'Family', label: 'Family', value: 'Family' },
                      { id: 'Dining', label: 'Dining', value: 'Dining' }
                    ]
                  }
                ]}
                activeFilters={activeFilters}
                onFilterChange={(_, optionId) => {
                  setActiveFilters(prev => 
                    prev.includes(optionId) 
                      ? prev.filter(f => f !== optionId)
                      : [...prev, optionId]
                  )
                }}
                onClearFilters={() => setActiveFilters([])}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map with Overlay */}
      <MobileMapOverlay
        searchBar={searchBar}
        miniCards={miniCards}
        selectedContent={selectedContent}
        detailContent={detailContent}
        hasSelection={!!selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
      >
        {/* Map */}
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

        {/* Floating Action Buttons */}
        <FloatingActionButton
          icon={<Navigation className="w-5 h-5 text-gray-700" />}
          onClick={handleLocateUser}
          label="My Location"
          position="right"
          className="bottom-[25vh]"
        />
        
        <FloatingActionButton
          icon={<List className="w-5 h-5 text-gray-700" />}
          onClick={() => setShowListView(true)}
          label="List View"
          position="right"
          className="bottom-[35vh]"
        />
      </MobileMapOverlay>
    </div>
  )
}

export default ModernBusinessLocatorMobileV2