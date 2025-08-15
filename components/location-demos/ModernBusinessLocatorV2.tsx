'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Map, { Marker, Popup, NavigationControl, GeolocateControl, Source, Layer, useMap } from 'react-map-gl/mapbox'
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
  Users,
  Globe,
  Calendar,
  TrendingUp,
  Award,
  Camera,
  Info,
  ChevronDown,
  Menu,
  Grid3x3,
  List,
  Map as MapIcon,
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle,
  Home,
  Building2,
  Store
} from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import MobileInteractiveMapModal from '../mobile/MobileInteractiveMapModal'

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
    status: 'open',
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=1200&h=400&fit=crop',
    tags: ['Premium', 'Fashion', 'Dining', 'Entertainment'],
    features: {
      parking: '8,000+ bays',
      stores: '300+',
      restaurants: '50+',
      wifi: true,
      wheelchair: true,
      valet: true
    },
    highlights: [
      { icon: ShoppingBag, label: '300+ Stores', value: 'Premium Brands' },
      { icon: Coffee, label: 'Food Court', value: '50+ Restaurants' },
      { icon: Car, label: 'Parking', value: '8,000 Bays' },
      { icon: Shield, label: 'Security', value: '24/7 Monitoring' }
    ],
    busyTimes: {
      current: 65,
      peak: [
        { day: 'Mon', value: 45 },
        { day: 'Tue', value: 50 },
        { day: 'Wed', value: 55 },
        { day: 'Thu', value: 60 },
        { day: 'Fri', value: 85 },
        { day: 'Sat', value: 95 },
        { day: 'Sun', value: 75 }
      ]
    },
    popularStores: ['Woolworths', 'Zara', 'H&M', 'Apple Store'],
    events: [
      { name: 'Summer Sale', date: 'Dec 1-31', discount: 'Up to 50% off' },
      { name: 'Food Festival', date: 'Dec 15-17', discount: 'Special offers' }
    ]
  },
  {
    id: 2,
    name: 'Rosebank Mall',
    subtitle: 'Urban Lifestyle Center',
    category: 'Lifestyle Mall',
    address: '50 Bath Ave, Rosebank',
    city: 'Johannesburg',
    rating: 4.6,
    reviews: 1280,
    hours: '09:00 - 19:00',
    phone: '+27 11 788 5530',
    coordinates: [28.0436, -26.1459],
    status: 'open',
    distance: 3.5,
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    tags: ['Trendy', 'Art', 'Fashion', 'Markets'],
    features: {
      parking: '2,500 bays',
      stores: '180+',
      restaurants: '30+',
      wifi: true,
      wheelchair: true,
      valet: false
    },
    highlights: [
      { icon: ShoppingBag, label: '180+ Stores', value: 'Boutique Shops' },
      { icon: Coffee, label: 'Rooftop Market', value: 'Every Sunday' },
      { icon: Camera, label: 'Art Gallery', value: 'Local Artists' },
      { icon: Users, label: 'Community', value: 'Events Weekly' }
    ],
    busyTimes: {
      current: 45,
      peak: [
        { day: 'Mon', value: 35 },
        { day: 'Tue', value: 40 },
        { day: 'Wed', value: 45 },
        { day: 'Thu', value: 55 },
        { day: 'Fri', value: 70 },
        { day: 'Sat', value: 80 },
        { day: 'Sun', value: 90 }
      ]
    },
    popularStores: ['Exclusive Books', 'Pick n Pay', 'Dis-Chem', 'Cotton On'],
    events: [
      { name: 'Sunday Market', date: 'Every Sunday', discount: 'Local crafts' },
      { name: 'Jazz Evening', date: 'Fridays', discount: 'Live music' }
    ]
  },
  {
    id: 3,
    name: 'Menlyn Park',
    subtitle: 'Capital Shopping Experience',
    category: 'Super Regional Mall',
    address: 'Atterbury Rd, Menlyn',
    city: 'Pretoria',
    rating: 4.7,
    reviews: 5670,
    hours: '09:00 - 20:00',
    phone: '+27 12 348 1906',
    coordinates: [28.2797, -25.7826],
    status: 'open',
    distance: 45,
    image: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=600&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&h=400&fit=crop',
    tags: ['Massive', 'Entertainment', 'Dining', 'Tech'],
    features: {
      parking: '10,000+ bays',
      stores: '400+',
      restaurants: '60+',
      wifi: true,
      wheelchair: true,
      valet: true
    },
    highlights: [
      { icon: Building2, label: '400+ Stores', value: 'Largest in Africa' },
      { icon: Globe, label: 'International', value: 'Global Brands' },
      { icon: Sparkles, label: 'Entertainment', value: 'Cinema & Arcade' },
      { icon: Award, label: 'Awards', value: 'Best Mall 2023' }
    ],
    busyTimes: {
      current: 70,
      peak: [
        { day: 'Mon', value: 50 },
        { day: 'Tue', value: 55 },
        { day: 'Wed', value: 60 },
        { day: 'Thu', value: 65 },
        { day: 'Fri', value: 80 },
        { day: 'Sat', value: 100 },
        { day: 'Sun', value: 85 }
      ]
    },
    popularStores: ['Game', 'Checkers', 'Mr Price', 'Edgars'],
    events: [
      { name: 'Tech Expo', date: 'Dec 10-12', discount: 'Latest gadgets' },
      { name: 'Kids Holiday', date: 'Dec 15-Jan 15', discount: 'Fun activities' }
    ]
  },
  {
    id: 4,
    name: 'V&A Waterfront',
    subtitle: 'Where the City Meets the Sea',
    category: 'Tourism & Shopping',
    address: 'Dock Rd, V&A Waterfront',
    city: 'Cape Town',
    rating: 4.9,
    reviews: 18930,
    hours: '09:00 - 21:00',
    phone: '+27 21 408 7600',
    coordinates: [18.4180, -33.9036],
    status: 'open',
    distance: 1400,
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    tags: ['Waterfront', 'Tourist', 'Harbor', 'Luxury'],
    features: {
      parking: '4,000 bays',
      stores: '450+',
      restaurants: '80+',
      wifi: true,
      wheelchair: true,
      valet: true
    },
    highlights: [
      { icon: Globe, label: 'Tourist Hub', value: '24M visitors/year' },
      { icon: Store, label: 'Unique Stores', value: '450+ Shops' },
      { icon: Camera, label: 'Ocean Views', value: 'Scenic Harbor' },
      { icon: Award, label: 'World-Class', value: 'Top Destination' }
    ],
    busyTimes: {
      current: 85,
      peak: [
        { day: 'Mon', value: 60 },
        { day: 'Tue', value: 65 },
        { day: 'Wed', value: 70 },
        { day: 'Thu', value: 75 },
        { day: 'Fri', value: 85 },
        { day: 'Sat', value: 100 },
        { day: 'Sun', value: 95 }
      ]
    },
    popularStores: ['Cape Union Mart', 'Two Oceans Aquarium', 'Watershed', 'Food Market'],
    events: [
      { name: 'Harbor Festival', date: 'Dec 20-31', discount: 'Live entertainment' },
      { name: 'Craft Market', date: 'Daily', discount: 'Local artisans' }
    ]
  },
  {
    id: 5,
    name: 'Gateway Theatre',
    subtitle: 'KZN\'s Premier Destination',
    category: 'Entertainment Complex',
    address: '1 Palm Blvd, Umhlanga',
    city: 'Durban',
    rating: 4.5,
    reviews: 8920,
    hours: '09:00 - 22:00',
    phone: '+27 31 566 1000',
    coordinates: [31.0218, -29.7263],
    status: 'open',
    distance: 600,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1200&h=400&fit=crop',
    tags: ['Cinema', 'Shopping', 'Beach', 'Family'],
    features: {
      parking: '6,500 bays',
      stores: '380+',
      restaurants: '70+',
      wifi: true,
      wheelchair: true,
      valet: true
    },
    highlights: [
      { icon: Camera, label: 'IMAX Cinema', value: '18 Screens' },
      { icon: ShoppingBag, label: 'Fashion Hub', value: '380+ Stores' },
      { icon: Coffee, label: 'Food Haven', value: '70+ Eateries' },
      { icon: Users, label: 'Family Fun', value: 'Kids Zone' }
    ],
    busyTimes: {
      current: 55,
      peak: [
        { day: 'Mon', value: 40 },
        { day: 'Tue', value: 45 },
        { day: 'Wed', value: 50 },
        { day: 'Thu', value: 55 },
        { day: 'Fri', value: 75 },
        { day: 'Sat', value: 90 },
        { day: 'Sun', value: 80 }
      ]
    },
    popularStores: ['Nu Metro', 'Toys R Us', 'Sportsmans Warehouse', 'Food Lovers'],
    events: [
      { name: 'Movie Premieres', date: 'Fridays', discount: 'Latest releases' },
      { name: 'Beach Festival', date: 'Dec-Jan', discount: 'Summer vibes' }
    ]
  }
]

const ModernBusinessLocatorV2 = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<typeof businesses[0] | null>(null)
  const [hoveredBusiness, setHoveredBusiness] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showPopup, setShowPopup] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'grid'>('list')
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v11')
  const [showFilters, setShowFilters] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  
  const [viewState, setViewState] = useState({
    latitude: -26.2041,
    longitude: 28.0473,
    zoom: 11
  })

  useEffect(() => {
    let mounted = true;
    
    // Request high-accuracy GPS location on mount
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!mounted) return; // Prevent state updates if component unmounted
          
          // Set the location
          const newLocation: [number, number] = [position.coords.longitude, position.coords.latitude]
          setUserLocation(newLocation)
          
          // Center map on user location
          setViewState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 14
          })
        },
        (error) => {
          if (!mounted) return;
          // Silently handle errors - user can use manual button if needed
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }
    
    return () => {
      mounted = false;
    }
  }, [])

  const categories = ['All', 'Shopping Mall', 'Lifestyle Mall', 'Entertainment', 'Tourism & Shopping']
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileModal, setShowMobileModal] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.address.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const handleBusinessClick = (business: typeof businesses[0]) => {
    setSelectedBusiness(business)
    setShowPopup(!isMobile) // Only show popup on desktop
    setViewState({
      latitude: business.coordinates[1],
      longitude: business.coordinates[0],
      zoom: isMobile ? 15 : 14
    })
  }

  const getStatusColor = (status: string) => {
    return status === 'open' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
  }

  const getBusyColor = (percentage: number) => {
    if (percentage < 30) return 'bg-green-500'
    if (percentage < 60) return 'bg-yellow-500'
    if (percentage < 80) return 'bg-orange-500'
    return 'bg-red-500'
  }

  // Mobile components
  const mobileMapView = (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
    >
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

      {filteredBusinesses.map(business => (
        <Marker
          key={business.id}
          latitude={business.coordinates[1]}
          longitude={business.coordinates[0]}
          onClick={() => handleBusinessClick(business)}
        >
          <motion.div
            whileTap={{ scale: 0.95 }}
            className={`relative transition-all cursor-pointer ${
              selectedBusiness?.id === business.id ? 'scale-110' : ''
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
              selectedBusiness?.id === business.id 
                ? 'bg-blue-500' 
                : 'bg-white'
            }`}>
              <Store className={`w-5 h-5 ${
                selectedBusiness?.id === business.id
                  ? 'text-white'
                  : 'text-gray-600'
              }`} />
            </div>
          </motion.div>
        </Marker>
      ))}
    </Map>
  )

  const mobileListView = (
    <div className="p-4 space-y-3">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3 sticky top-0 z-10">
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

      {/* Business Cards */}
      {filteredBusinesses.map(business => (
        <motion.div
          key={business.id}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleBusinessClick(business)}
          className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedBusiness?.id === business.id ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <img
              src={business.image}
              alt={business.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{business.name}</h3>
                  <p className="text-sm text-gray-500">{business.subtitle}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  business.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {business.status === 'open' ? 'Open' : 'Closed'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{business.rating}</span>
                </div>
                <span>•</span>
                <span>{business.distance} km</span>
                <span>•</span>
                <span>{business.hours}</span>
              </div>
              {selectedBusiness?.id === business.id && (
                <div className="mt-3 pt-3 border-t flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Getting directions to:', business.name)
                    }}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-4 h-4" />
                    Directions
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.location.href = `tel:${business.phone}`
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  // Mobile layout with modal
  if (isMobile) {
    return (
      <>
        {/* Preview Card - Always visible on page */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-[200px]">
            <Map
              {...viewState}
              interactive={false}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
            >
              {filteredBusinesses.slice(0, 5).map(business => (
                <Marker
                  key={business.id}
                  latitude={business.coordinates[1]}
                  longitude={business.coordinates[0]}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <Store className="w-4 h-4 text-white" />
                  </div>
                </Marker>
              ))}
            </Map>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-semibold text-lg mb-1">Store Locator</h3>
              <p className="text-white/90 text-sm">{filteredBusinesses.length} locations near you</p>
            </div>
          </div>
          <button
            onClick={() => setShowMobileModal(true)}
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <MapIcon className="w-5 h-5" />
            Open Interactive Map
          </button>
        </div>

        {/* Mobile Modal */}
        <MobileInteractiveMapModal
          isOpen={showMobileModal}
          onClose={() => setShowMobileModal(false)}
          title="Store Locator"
          subtitle={`${filteredBusinesses.length} locations`}
          mapComponent={mobileMapView}
          listComponent={mobileListView}
        />
      </>
    )
  }

  // Desktop layout
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg" style={{ height: '900px' }}>
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-[320px] bg-white border-r border-gray-100 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Stores</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Filters */}
          {showFilters && (
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Business List */}
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  onClick={() => handleBusinessClick(business)}
                  onMouseEnter={() => setHoveredBusiness(business.id)}
                  onMouseLeave={() => setHoveredBusiness(null)}
                  className={`px-4 py-3 cursor-pointer transition-all hover:bg-gray-50 ${
                    selectedBusiness?.id === business.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=100&h=100&fit=crop'
                        }}
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{business.name}</h3>
                          <p className="text-xs text-gray-500">{business.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            business.status === 'open' ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className="text-xs text-gray-500">{business.hours.split(' - ')[0]}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{business.distance} km away</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{business.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{business.reviews} reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-gray-50">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapStyle={mapStyle}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
            style={{ width: '100%', height: '100%' }}
          >
            <NavigationControl position="top-right" />
            <GeolocateControl 
              position="top-right"
              positionOptions={{
                enableHighAccuracy: true,
                timeout: 6000,
                maximumAge: 0
              }}
              trackUserLocation={true}
              showUserLocation={true}
              showUserHeading={true}
              showAccuracyCircle={false}
              fitBoundsOptions={{
                maxZoom: 16
              }}
              onGeolocate={(e) => {
                setUserLocation([e.coords.longitude, e.coords.latitude])
              }}
              onError={(error) => {
                // Silently handle errors
              }}
            />

            {/* User location circle (1km radius) */}
            {userLocation && (() => {
              // Create an accurate 1km circle using turf.js
              const center = point(userLocation)
              const radius = 1 // 1km
              const options = { steps: 64, units: 'kilometers' as const }
              const circleFeature = circle(center, radius, options)
              
              return (
                <>
                  <Source
                    id="user-location-radius"
                    type="geojson"
                    data={circleFeature}
                  >
                    <Layer
                      id="user-location-circle-fill"
                      type="fill"
                      paint={{
                        'fill-color': '#007cbf',
                        'fill-opacity': 0.1
                      }}
                    />
                    <Layer
                      id="user-location-circle-stroke"
                      type="line"
                      paint={{
                        'line-color': '#007cbf',
                        'line-width': 2,
                        'line-opacity': 0.5
                      }}
                    />
                  </Source>
                
                {/* Center dot for user location with pulsing effect */}
                <Marker
                  longitude={userLocation[0]}
                  latitude={userLocation[1]}
                  anchor="center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-75" />
                    <div className="relative w-6 h-6 bg-blue-600 rounded-full border-3 border-white shadow-lg">
                      <div className="absolute inset-1 bg-white rounded-full opacity-30" />
                    </div>
                  </div>
                </Marker>
                
                {/* Distance label */}
                <div className="absolute top-20 right-3 bg-white rounded-lg shadow-md px-3 py-2 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-gray-700">1km radius</span>
                  </div>
                </div>
              </>
            )
            })()}

            {/* Store Markers */}
            {filteredBusinesses.map((business) => (
              <Marker
                key={business.id}
                longitude={business.coordinates[0]}
                latitude={business.coordinates[1]}
              >
                <div
                  className="relative"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBusinessClick(business)
                  }}
                  onMouseEnter={() => setHoveredBusiness(business.id)}
                  onMouseLeave={() => setHoveredBusiness(null)}
                >
                  {/* Custom marker design */}
                  <div className={`relative transition-all cursor-pointer ${
                    selectedBusiness?.id === business.id || hoveredBusiness === business.id ? 'scale-110' : ''
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                      selectedBusiness?.id === business.id 
                        ? 'bg-blue-500' 
                        : hoveredBusiness === business.id
                        ? 'bg-gray-700'
                        : 'bg-white'
                    }`}>
                      <div className={`w-6 h-6 rounded-full overflow-hidden ${
                        selectedBusiness?.id === business.id || hoveredBusiness === business.id ? '' : 'border-2 border-gray-200'
                      }`}>
                        <img
                          src={business.image}
                          alt={business.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                    {/* Pin */}
                    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] ${
                      selectedBusiness?.id === business.id
                        ? 'border-t-blue-500'
                        : hoveredBusiness === business.id
                        ? 'border-t-gray-700'
                        : 'border-t-white'
                    }`} />
                  </div>
                </div>
              </Marker>
            ))}

            {/* Enhanced Popup */}
            {showPopup && selectedBusiness && (
              <Popup
                longitude={selectedBusiness.coordinates[0]}
                latitude={selectedBusiness.coordinates[1]}
                onClose={() => {
                  setShowPopup(false)
                  setSelectedBusiness(null)
                }}
                closeButton={false}
                className="business-popup"
                maxWidth="400px"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-xl" style={{ width: '320px' }}>
                  {/* Cover Image */}
                  <div className="relative h-28">
                    <img
                      src={selectedBusiness.coverImage || selectedBusiness.image}
                      alt={selectedBusiness.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&h=400&fit=crop'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Close Button */}
                    <button
                      onClick={() => {
                        setShowPopup(false)
                        setSelectedBusiness(null)
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>

                    {/* Title Overlay */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{selectedBusiness.name}</h3>
                      <p className="text-sm text-white/90">{selectedBusiness.subtitle}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Status and Rating */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBusiness.status)}`}>
                          {selectedBusiness.status === 'open' ? '● Open Now' : '● Closed'}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{selectedBusiness.rating}</span>
                          <span className="text-xs text-gray-500">({selectedBusiness.reviews})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <Heart className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <Share2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {selectedBusiness.highlights.map((highlight, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                              <highlight.icon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">{highlight.label}</p>
                              <p className="text-xs font-medium text-gray-900 truncate">{highlight.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Busy Indicator */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Current Activity</span>
                        <span className="text-xs text-gray-500">{selectedBusiness.busyTimes.current}% busy</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${getBusyColor(selectedBusiness.busyTimes.current)}`}
                          style={{ width: `${selectedBusiness.busyTimes.current}%` }}
                        />
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{selectedBusiness.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{selectedBusiness.hours}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{selectedBusiness.phone}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <Navigation className="w-4 h-4" />
                        Get Directions
                      </button>
                      <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                        <Info className="w-4 h-4" />
                        More Info
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            )}
          </Map>

          {/* Bottom Stats Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-900">{filteredBusinesses.length} Stores</p>
                  <p className="text-xs text-gray-500">In your area</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-sm font-medium text-green-600">
                    {filteredBusinesses.filter(b => b.status === 'open').length} Open
                  </p>
                  <p className="text-xs text-gray-500">Right now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!userLocation && (
                  <button 
                    onClick={() => {
                      if ('geolocation' in navigator) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            const newLocation: [number, number] = [position.coords.longitude, position.coords.latitude]
                            setUserLocation(newLocation)
                            setViewState({
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude,
                              zoom: 15
                            })
                          },
                          (error) => {
                            alert(`Location error: ${error.message}`)
                          },
                          {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                          }
                        )
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Get My Location
                  </button>
                )}
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Add Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        .business-popup .mapboxgl-popup-content {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 16px !important;
        }
        .business-popup .mapboxgl-popup-tip {
          display: none !important;
        }
        
        /* Style the user location dot */
        .mapboxgl-user-location-dot {
          width: 16px !important;
          height: 16px !important;
          background-color: #007cbf !important;
          border: 3px solid white !important;
          box-shadow: 0 0 10px rgba(0, 124, 191, 0.4) !important;
        }
        
        .mapboxgl-user-location-dot::after {
          display: none !important;
        }
        
        .mapboxgl-user-location-dot::before {
          display: none !important;
        }
      `}</style>
    </div>
  )
}

export default ModernBusinessLocatorV2