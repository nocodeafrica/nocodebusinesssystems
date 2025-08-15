'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { 
  Home,
  MapPin,
  Bed,
  Bath,
  Car,
  Square,
  Heart,
  Filter,
  Search,
  Building2,
  ChevronUp,
  ChevronDown,
  Star,
  Clock,
  List,
  Map as MapIcon,
  Banknote,
  X,
  Phone,
  MessageCircle,
  ArrowLeft
} from 'lucide-react'

// Property data with coordinates for South African cities
const properties = [
  {
    id: 1,
    title: 'Modern Apartment in Sandton',
    type: 'Apartment',
    price: 2850000,
    location: 'Sandton, Johannesburg',
    coordinates: [28.0573, -26.1075],
    province: 'Gauteng',
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    size: 95,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
    ],
    featured: true,
    status: 'For Sale',
    description: 'Luxurious apartment in the heart of Sandton CBD with panoramic city views',
    amenities: ['24/7 Security', 'Gym', 'Pool', 'Fiber'],
    levies: 3500,
    rates: 1200,
    listed: '2 days ago',
    agent: 'Sarah Naidoo',
    rating: 4.8
  },
  {
    id: 2,
    title: 'Family Home in Waterkloof',
    type: 'House',
    price: 4500000,
    location: 'Waterkloof, Pretoria',
    coordinates: [28.2778, -25.7790],
    province: 'Gauteng',
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    size: 350,
    erfsSize: 1200,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
    ],
    featured: false,
    status: 'For Sale',
    description: 'Spacious family home with beautiful garden and entertainment area',
    amenities: ['Garden', 'Pool', 'Study', 'Staff Quarters'],
    levies: 0,
    rates: 2800,
    listed: '1 week ago',
    agent: 'Thabo Molefe',
    rating: 4.6
  },
  {
    id: 3,
    title: 'Sea View Penthouse',
    type: 'Penthouse',
    price: 8900000,
    location: 'Clifton, Cape Town',
    coordinates: [18.3776, -33.9390],
    province: 'Western Cape',
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    size: 280,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
    ],
    featured: true,
    status: 'For Sale',
    description: 'Stunning penthouse with panoramic ocean views',
    amenities: ['Sea View', 'Concierge', 'Wine Cellar', 'Smart Home'],
    levies: 8500,
    rates: 4200,
    listed: '3 days ago',
    agent: 'Marie van Zyl',
    rating: 4.9
  },
  {
    id: 4,
    title: 'Student Apartment',
    type: 'Studio',
    price: 8500,
    location: 'Stellenbosch Central',
    coordinates: [18.8602, -33.9321],
    province: 'Western Cape',
    bedrooms: 0,
    bathrooms: 1,
    parking: 0,
    size: 32,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    featured: false,
    status: 'To Rent',
    description: 'Compact studio perfect for students, walking distance to campus',
    amenities: ['WiFi', 'Security', 'Laundry'],
    levies: 0,
    rates: 0,
    listed: '5 days ago',
    agent: 'Johan Botha',
    rating: 4.2
  },
  {
    id: 5,
    title: 'Office Space in Umhlanga',
    type: 'Commercial',
    price: 35000,
    location: 'Umhlanga Ridge, Durban',
    coordinates: [31.0840, -29.7252],
    province: 'KwaZulu-Natal',
    bedrooms: 0,
    bathrooms: 2,
    parking: 10,
    size: 450,
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
    ],
    featured: false,
    status: 'To Rent',
    description: 'Premium office space with sea views in business district',
    amenities: ['Generator', 'Meeting Rooms', 'Kitchenette', 'Parking'],
    levies: 0,
    rates: 0,
    listed: '2 weeks ago',
    agent: 'Priya Naidoo',
    rating: 4.5
  }
]

interface PropertyListingsMobileProps {
  onBack?: () => void
}

export default function PropertyListingsMobile({ onBack }: PropertyListingsMobileProps) {
  const [viewState, setViewState] = useState({
    latitude: -26.1075,
    longitude: 28.0573,
    zoom: 10
  })
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [savedProperties, setSavedProperties] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [bottomSheetHeight, setBottomSheetHeight] = useState<'collapsed' | 'half' | 'full'>('collapsed')

  const handlePropertyClick = useCallback((property: typeof properties[0]) => {
    setSelectedProperty(property)
    setBottomSheetHeight('half')
    setViewState({
      latitude: property.coordinates[1],
      longitude: property.coordinates[0],
      zoom: 14
    })
  }, [])

  const toggleSaveProperty = (propertyId: number) => {
    setSavedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const formatPrice = (price: number, status: string) => {
    if (status === 'To Rent') {
      return `R ${price.toLocaleString('en-ZA')}/mo`
    }
    return `R ${price.toLocaleString('en-ZA')}`
  }

  const getMarkerColor = (property: typeof properties[0]) => {
    if (property.featured) return '#fbbf24'
    if (property.status === 'To Rent') return '#10b981'
    return '#6366f1'
  }

  // Handle touch gestures for bottom sheet
  useEffect(() => {
    let startY = 0
    let currentY = 0

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY
      const diff = startY - currentY

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swiping up
          if (bottomSheetHeight === 'collapsed') setBottomSheetHeight('half')
          else if (bottomSheetHeight === 'half') setBottomSheetHeight('full')
        } else {
          // Swiping down
          if (bottomSheetHeight === 'full') setBottomSheetHeight('half')
          else if (bottomSheetHeight === 'half') setBottomSheetHeight('collapsed')
        }
        startY = currentY
      }
    }

    const bottomSheet = document.getElementById('property-bottom-sheet')
    if (bottomSheet) {
      bottomSheet.addEventListener('touchstart', handleTouchStart)
      bottomSheet.addEventListener('touchmove', handleTouchMove)
    }

    return () => {
      if (bottomSheet) {
        bottomSheet.removeEventListener('touchstart', handleTouchStart)
        bottomSheet.removeEventListener('touchmove', handleTouchMove)
      }
    }
  }, [bottomSheetHeight])

  return (
    <div className="relative h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-xl font-bold text-gray-900">Property Listings</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"
              >
                {viewMode === 'map' ? <List className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowFilters(true)}
                className="p-2 bg-gray-100 text-gray-700 rounded-lg"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search location..."
              className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="absolute inset-0 pt-24">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
            style={{ width: '100%', height: '100%' }}
          >
            <NavigationControl position="top-right" />
            <GeolocateControl position="top-right" />

            {/* Property Markers */}
            {properties.map((property) => (
              <Marker
                key={property.id}
                longitude={property.coordinates[0]}
                latitude={property.coordinates[1]}
                onClick={() => handlePropertyClick(property)}
              >
                <div
                  className="cursor-pointer transition-transform active:scale-110"
                  style={{
                    background: 'white',
                    border: `2px solid ${getMarkerColor(property)}`,
                    borderRadius: '6px',
                    padding: '2px 6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: getMarkerColor(property),
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  R{(property.price / (property.status === 'To Rent' ? 1 : 1000000)).toFixed(property.status === 'To Rent' ? 0 : 1)}
                  {property.status === 'To Rent' ? '/mo' : 'M'}
                </div>
              </Marker>
            ))}
          </Map>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="absolute inset-0 pt-24 pb-20 overflow-y-auto">
          <div className="px-4 py-4 space-y-3">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handlePropertyClick(property)}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.featured && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                      Featured
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSaveProperty(property.id)
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        savedProperties.includes(property.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium">
                    {property.status}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {property.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">
                        {formatPrice(property.price, property.status)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{property.size}m²</span>
                    </div>
                    {property.parking > 0 && (
                      <div className="flex items-center gap-1">
                        <Car className="w-4 h-4" />
                        <span>{property.parking}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{property.agent}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{property.rating}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {property.listed}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sheet for Property Details */}
      <AnimatePresence>
        {selectedProperty && viewMode === 'map' && (
          <motion.div
            id="property-bottom-sheet"
            initial={{ y: '100%' }}
            animate={{ 
              y: bottomSheetHeight === 'collapsed' ? '85%' : 
                 bottomSheetHeight === 'half' ? '50%' : '10%'
            }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-30"
            style={{ minHeight: '100px' }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-4 pb-4">
              {/* Property Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedProperty.title}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {selectedProperty.location}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProperty(null)
                    setBottomSheetHeight('collapsed')
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Price and Status */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xl font-bold text-indigo-600">
                  {formatPrice(selectedProperty.price, selectedProperty.status)}
                </p>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg">
                  {selectedProperty.status}
                </span>
              </div>

              {/* Property Features */}
              <div className="flex items-center gap-4 mb-4">
                {selectedProperty.bedrooms > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg">
                    <Bed className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">{selectedProperty.bedrooms} Beds</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg">
                  <Bath className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">{selectedProperty.bathrooms} Baths</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg">
                  <Square className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">{selectedProperty.size}m²</span>
                </div>
              </div>

              {/* Expandable Content */}
              {bottomSheetHeight !== 'collapsed' && (
                <>
                  {/* Property Images */}
                  <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                      {selectedProperty.images.map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{selectedProperty.description}</p>
                  </div>

                  {/* Amenities */}
                  {bottomSheetHeight === 'full' && (
                    <>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProperty.amenities.map((amenity: string) => (
                            <span
                              key={amenity}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Agent Info */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div>
                              <p className="font-medium text-gray-900">{selectedProperty.agent}</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-600">{selectedProperty.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 bg-white border border-gray-200 rounded-lg">
                              <Phone className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 bg-white border border-gray-200 rounded-lg">
                              <MessageCircle className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleSaveProperty(selectedProperty.id)}
                      className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                        savedProperties.includes(selectedProperty.id)
                          ? 'bg-red-50 text-red-600'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 mx-auto ${
                          savedProperties.includes(selectedProperty.id) ? 'fill-current' : ''
                        }`}
                      />
                    </button>
                    <button className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium">
                      Contact Agent
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Modal */}
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
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Options */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Property Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'House', 'Apartment', 'Studio', 'Commercial'].map((type) => (
                      <button
                        key={type}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Min"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <span className="self-center text-gray-500">-</span>
                    <input
                      type="text"
                      placeholder="Max"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Bedrooms</label>
                  <div className="flex gap-2">
                    {['Any', '1+', '2+', '3+', '4+'].map((beds) => (
                      <button
                        key={beds}
                        className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                      >
                        {beds}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Filters */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}