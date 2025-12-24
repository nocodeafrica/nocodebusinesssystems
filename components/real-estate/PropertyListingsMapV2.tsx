'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Map, { Marker, NavigationControl, ScaleControl, GeolocateControl } from 'react-map-gl/mapbox'
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
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  List,
  Grid,
  Map as MapIcon,
  Banknote
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
    description: 'Stunning penthouse with panoramic Atlantic Ocean views',
    amenities: ['Sea View', 'Terrace', 'Wine Cellar', 'Smart Home'],
    levies: 8500,
    rates: 3500,
    listed: '3 days ago',
    agent: 'Johan van der Merwe',
    rating: 4.9
  },
  {
    id: 4,
    title: 'Student Accommodation',
    type: 'Apartment',
    price: 7500,
    location: 'Stellenbosch Central',
    coordinates: [18.8665, -33.9321],
    province: 'Western Cape',
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    size: 45,
    images: [
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800'
    ],
    featured: false,
    status: 'To Rent',
    description: 'Modern student accommodation walking distance from university',
    amenities: ['Furnished', 'Fiber', 'Secure', 'Prepaid Electricity'],
    levies: 0,
    rates: 0,
    listed: '1 day ago',
    agent: 'Lisa Botha',
    rating: 4.3
  },
  {
    id: 5,
    title: 'Commercial Office Space',
    type: 'Commercial',
    price: 45000,
    location: 'Umhlanga, Durban',
    coordinates: [31.0726, -29.7263],
    province: 'KwaZulu-Natal',
    bedrooms: 0,
    bathrooms: 2,
    parking: 10,
    size: 450,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
    ],
    featured: false,
    status: 'To Rent',
    description: 'Prime office space in Umhlanga business district with ocean views',
    amenities: ['Generator', 'Fiber', 'Parking', 'Air Conditioning'],
    levies: 0,
    rates: 5500,
    listed: '5 days ago',
    agent: 'Priya Patel',
    rating: 4.5
  },
  {
    id: 6,
    title: 'Luxury Villa in Camps Bay',
    type: 'House',
    price: 18500000,
    location: 'Camps Bay, Cape Town',
    coordinates: [18.3780, -33.9511],
    province: 'Western Cape',
    bedrooms: 5,
    bathrooms: 5,
    parking: 3,
    size: 650,
    erfsSize: 1500,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ],
    featured: true,
    status: 'For Sale',
    description: 'Ultra-luxury villa with infinity pool and mountain views',
    amenities: ['Sea View', 'Pool', 'Cinema', 'Wine Cellar', 'Gym'],
    levies: 0,
    rates: 8000,
    listed: '1 week ago',
    agent: 'Michael Chen',
    rating: 5.0
  }
]

const PropertyListingsMapV2 = () => {
  const [selectedProperty, setSelectedProperty] = useState(properties[0])
  const [savedProperties, setSavedProperties] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split')
  const [viewState, setViewState] = useState({
    latitude: -28.8166,
    longitude: 24.991639,
    zoom: 5
  })

  const handlePropertyClick = useCallback((property: typeof properties[0]) => {
    setSelectedProperty(property)
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
    if (property.featured) return '#fbbf24' // Yellow for featured
    if (property.status === 'To Rent') return '#10b981' // Green for rent
    return '#6366f1' // Indigo for sale
  }

  return (
    <div className="bg-white rounded-3xl p-6 min-h-[700px] border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Listings</h2>
          <p className="text-gray-600">Interactive map with {properties.length} properties</p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'split' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'map' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MapIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by location, property type, or keyword..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm cursor-pointer hover:bg-gray-200">
          <Building2 className="w-4 h-4" />
          All Types
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm cursor-pointer hover:bg-gray-200">
          <MapPin className="w-4 h-4" />
          All Provinces
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm cursor-pointer hover:bg-gray-200">
          <Banknote className="w-4 h-4" />
          Any Price
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm cursor-pointer hover:bg-gray-200">
          <Bed className="w-4 h-4" />
          Any Beds
        </div>
      </div>

      {/* Main Content */}
      <div className={`grid ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {/* Property List */}
        {viewMode !== 'map' && (
          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-white border rounded-xl overflow-hidden cursor-pointer transition-all ${
                  selectedProperty.id === property.id ? 'border-indigo-500 shadow-lg' : 'border-gray-200 hover:shadow-md'
                }`}
                onClick={() => handlePropertyClick(property)}
              >
                <div className="flex">
                  {/* Property Image with Gallery */}
                  <div className="relative w-40 h-32 bg-gray-200 flex-shrink-0">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {property.featured && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-500 text-white text-xs font-medium rounded">
                        Featured
                      </div>
                    )}
                    {property.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                        +{property.images.length - 1} photos
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{property.title}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSaveProperty(property.id)
                        }}
                        className="ml-2"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            savedProperties.includes(property.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-400 hover:text-red-500'
                          }`} 
                        />
                      </button>
                    </div>
                    
                    <p className="text-lg font-bold text-indigo-600 mb-1">
                      {formatPrice(property.price, property.status)}
                    </p>
                    
                    <div className="flex items-center gap-1 text-gray-600 text-xs mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />
                          <span className="text-xs">{property.bedrooms}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Bath className="w-3 h-3" />
                        <span className="text-xs">{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="w-3 h-3" />
                        <span className="text-xs">{property.size}m²</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs">{property.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Map */}
        {viewMode !== 'list' && (
          <div className="relative">
            <div className="w-full h-[550px] rounded-xl overflow-hidden">
              <Map
                {...viewState}
                onMove={(evt: any) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/light-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
              >
                <NavigationControl position="top-right" />
                <ScaleControl />
                <GeolocateControl />

                {/* Property Markers */}
                {properties.map((property) => (
                  <Marker
                    key={property.id}
                    longitude={property.coordinates[0]}
                    latitude={property.coordinates[1]}
                    onClick={() => handlePropertyClick(property)}
                  >
                    <div
                      className="cursor-pointer transition-transform hover:scale-110"
                      style={{
                        background: 'white',
                        border: `2px solid ${getMarkerColor(property)}`,
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
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
            
            {/* Property Carousel for Map View */}
            {viewMode === 'map' && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {properties.map((property) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handlePropertyClick(property)}
                      className={`flex-shrink-0 bg-white rounded-xl shadow-xl p-3 cursor-pointer transition-all hover:shadow-2xl ${
                        selectedProperty.id === property.id ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      style={{ width: '280px' }}
                    >
                      <div className="flex gap-3">
                        {/* Property Image */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                          {property.featured && (
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-yellow-500 text-white text-xs font-medium rounded">
                              Featured
                            </div>
                          )}
                        </div>

                        {/* Property Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{property.title}</h3>
                          <p className="text-lg font-bold text-indigo-600">
                            {formatPrice(property.price, property.status)}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-1">{property.location}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {property.bedrooms > 0 && (
                              <div className="flex items-center gap-0.5">
                                <Bed className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-600">{property.bedrooms}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-0.5">
                              <Bath className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-600">{property.bathrooms}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Square className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-600">{property.size}m²</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add styles for hiding scrollbar */}
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

export default PropertyListingsMapV2