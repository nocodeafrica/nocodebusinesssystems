'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Map, { Marker, Popup, NavigationControl, GeolocateControl, Source, Layer } from 'react-map-gl/mapbox'
import circle from '@turf/circle'
import { point } from '@turf/helpers'
import { 
  Search, 
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
  CheckCircle,
  Store,
  List,
  Grid3x3,
  Map as MapIcon,
  Filter,
  Settings
} from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'

// Import our mobile components
import MobileBottomSheet from '../mobile/MobileBottomSheet'
import MobileFilterBar from '../mobile/MobileFilterBar'
import MobileMapControls from '../mobile/MobileMapControls'
import MobileInfoCard from '../mobile/MobileInfoCard'
import MobileTabNav from '../mobile/MobileTabNav'

// Business data (same as original)
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
    coordinates: [28.0571, -26.1084] as [number, number],
    status: 'open' as const,
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
    coordinates: [28.0436, -26.1459] as [number, number],
    status: 'open' as const,
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
      { icon: Store, label: 'Art Gallery', value: 'Local Artists' },
      { icon: CheckCircle, label: 'Community', value: 'Events Weekly' }
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
    name: 'V&A Waterfront',
    subtitle: 'Where the City Meets the Sea',
    category: 'Tourism & Shopping',
    address: 'Dock Rd, V&A Waterfront',
    city: 'Cape Town',
    rating: 4.9,
    reviews: 18930,
    hours: '09:00 - 21:00',
    phone: '+27 21 408 7600',
    coordinates: [18.4180, -33.9036] as [number, number],
    status: 'open' as const,
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
      { icon: Store, label: 'Tourist Hub', value: '24M visitors/year' },
      { icon: ShoppingBag, label: 'Unique Stores', value: '450+ Shops' },
      { icon: MapPin, label: 'Ocean Views', value: 'Scenic Harbor' },
      { icon: CheckCircle, label: 'World-Class', value: 'Top Destination' }
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
  }
]

const MobileStoreLocator = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<typeof businesses[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showBottomSheet, setShowBottomSheet] = useState(true)
  const [activeTab, setActiveTab] = useState('list')
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v11')
  
  const [viewState, setViewState] = useState({
    latitude: -26.2041,
    longitude: 28.0473,
    zoom: 11
  })

  useEffect(() => {
    let mounted = true
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!mounted) return
          
          const newLocation: [number, number] = [position.coords.longitude, position.coords.latitude]
          setUserLocation(newLocation)
          
          setViewState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 14
          })
        },
        (error) => {
          // Silently handle errors
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }
    
    return () => {
      mounted = false
    }
  }, [])

  // Filter configuration for mobile filter bar
  const filterGroups = [
    {
      id: 'category',
      label: 'Category',
      type: 'select' as const,
      value: selectedCategory,
      options: [
        { id: 'all', label: 'All Categories', value: 'All', count: businesses.length },
        { id: 'shopping', label: 'Shopping Mall', value: 'Shopping Mall', count: 1 },
        { id: 'lifestyle', label: 'Lifestyle Mall', value: 'Lifestyle Mall', count: 1 },
        { id: 'tourism', label: 'Tourism & Shopping', value: 'Tourism & Shopping', count: 1 }
      ]
    }
  ]

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
    setViewState({
      latitude: business.coordinates[1],
      longitude: business.coordinates[0],
      zoom: 14
    })
  }

  const handleFilterChange = (filterId: string, value: any) => {
    if (filterId === 'category') {
      setSelectedCategory(value)
    }
  }

  const handleResetFilters = () => {
    setSelectedCategory('All')
    setSearchQuery('')
  }

  const getBusyColor = (percentage: number) => {
    if (percentage < 30) return 'bg-green-500'
    if (percentage < 60) return 'bg-yellow-500'
    if (percentage < 80) return 'bg-orange-500'
    return 'bg-red-500'
  }

  // Tab navigation items
  const tabs = [
    { id: 'list', label: 'List', icon: <List className="w-5 h-5" /> },
    { id: 'map', label: 'Map', icon: <MapIcon className="w-5 h-5" /> },
    { id: 'grid', label: 'Grid', icon: <Grid3x3 className="w-5 h-5" /> }
  ]

  const mapStyles = [
    { id: 'mapbox://styles/mapbox/light-v11', name: 'Light' },
    { id: 'mapbox://styles/mapbox/dark-v11', name: 'Dark' },
    { id: 'mapbox://styles/mapbox/satellite-v9', name: 'Satellite' },
    { id: 'mapbox://styles/mapbox/outdoors-v12', name: 'Outdoors' }
  ]

  return (
    <div className="relative h-screen bg-gray-50 mobile-safe-area">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-100 px-mobile-padding py-3 z-mobile-header relative">
        <div className="flex items-center justify-between">
          <h1 className="text-mobile-title font-bold text-gray-900">Store Locator</h1>
          <div className="flex items-center gap-2">
            <span className="text-mobile-caption text-gray-500">
              {filteredBusinesses.length} stores
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <MobileTabNav
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
        size="medium"
      />

      {/* Filter Bar */}
      <MobileFilterBar
        filters={filterGroups}
        onFilterChange={handleFilterChange}
        onClearFilters={handleResetFilters}
        onSearch={setSearchQuery}
        searchPlaceholder="Search stores..."
        activeFilters={selectedCategory === 'All' ? [] : [selectedCategory]}
      />

      {/* Map View */}
      <div className="flex-1 relative">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle={mapStyle}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
          style={{ width: '100%', height: '100%' }}
        >
          {/* User location circle */}
          {userLocation && (() => {
            const center = point(userLocation)
            const radius = 1
            const options = { steps: 64, units: 'kilometers' as const }
            const circleFeature = circle(center, radius, options)
            
            return (
              <>
                <Source id="user-location-radius" type="geojson" data={circleFeature}>
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
              
                <Marker longitude={userLocation[0]} latitude={userLocation[1]} anchor="center">
                  <div className="relative">
                    <div className="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-75" />
                    <div className="relative w-6 h-6 bg-blue-600 rounded-full border-3 border-white shadow-lg">
                      <div className="absolute inset-1 bg-white rounded-full opacity-30" />
                    </div>
                  </div>
                </Marker>
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
                className="relative cursor-pointer touch-manipulation"
                onClick={(e) => {
                  e.stopPropagation()
                  handleBusinessClick(business)
                  setShowBottomSheet(true)
                }}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center shadow-mobile-floating transition-all
                  ${selectedBusiness?.id === business.id ? 'bg-ncbs-blue scale-110' : 'bg-white hover:scale-105'}
                `}>
                  <div className="w-6 h-6 rounded-full overflow-hidden">
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
                <div className={`
                  absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 
                  border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px]
                  ${selectedBusiness?.id === business.id ? 'border-t-ncbs-blue' : 'border-t-white'}
                `} />
              </div>
            </Marker>
          ))}
        </Map>

        {/* Map Controls */}
        <MobileMapControls
          onZoomIn={() => setViewState(prev => ({ ...prev, zoom: prev.zoom + 1 }))}
          onZoomOut={() => setViewState(prev => ({ ...prev, zoom: prev.zoom - 1 }))}
          onResetView={() => {
            if (userLocation) {
              setViewState({
                latitude: userLocation[1],
                longitude: userLocation[0],
                zoom: 14
              })
            } else {
              setViewState({
                latitude: -26.2041,
                longitude: 28.0473,
                zoom: 11
              })
            }
          }}
          onLocateUser={() => {
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
          currentStyle={mapStyle}
          onMapStyleChange={setMapStyle}
          mapStyles={mapStyles.map(style => ({ id: style.id, label: style.name, name: style.name }))}
        />
      </div>

      {/* Bottom Sheet with Store List */}
      <MobileBottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title="Nearby Stores"
        snapPoints={[35, 60, 85]}
        defaultSnapPoint={0}
        showHandle={true}
      >
        <div className="space-y-4 pb-8">
          {/* Store count info */}
          <div className="flex items-center justify-between text-sm text-gray-500 px-4 -mt-2">
            <span>{filteredBusinesses.length} stores found</span>
            <span>{filteredBusinesses.filter(b => b.status === 'open').length} open now</span>
          </div>
          
          {activeTab === 'list' && (
            <div className="space-y-3">
              {filteredBusinesses.map((business) => (
                <MobileInfoCard
                  key={business.id}
                  title={business.name}
                  subtitle={business.subtitle}
                  image={business.image}
                  rating={business.rating}
                  reviews={business.reviews}
                  address={business.address}
                  phone={business.phone}
                  hours={business.hours}
                  status={business.status}
                  size="normal"
                  badges={[
                    { id: 'distance', label: 'Distance', value: `${business.distance}km`, color: 'blue' },
                    { id: 'busy', label: 'Activity', value: `${business.busyTimes.current}%`, color: business.busyTimes.current > 70 ? 'red' : 'green' }
                  ]}
                  actions={[
                    {
                      id: 'directions',
                      label: 'Directions',
                      icon: <Navigation className="w-4 h-4" />,
                      primary: true,
                      onClick: () => handleBusinessClick(business)
                    },
                    {
                      id: 'call',
                      label: 'Call',
                      icon: <Phone className="w-4 h-4" />,
                      onClick: () => window.open(`tel:${business.phone}`)
                    }
                  ]}
                  expandable={true}
                  onExpandToggle={() => {}}
                  className={selectedBusiness?.id === business.id ? 'ring-2 ring-ncbs-blue' : ''}
                >
                  {/* Extended content */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-mobile-subtitle font-semibold mb-2">Highlights</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {business.highlights.map((highlight, index) => (
                          <div key={index} className="bg-gray-50 rounded-mobile-button p-2">
                            <div className="flex items-center gap-2">
                              <highlight.icon className="w-4 h-4 text-ncbs-blue" />
                              <div>
                                <p className="text-mobile-caption text-gray-500">{highlight.label}</p>
                                <p className="text-mobile-caption font-medium">{highlight.value}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-mobile-subtitle font-semibold mb-2">Current Activity</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${getBusyColor(business.busyTimes.current)}`}
                              style={{ width: `${business.busyTimes.current}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-mobile-caption text-gray-600">{business.busyTimes.current}% busy</span>
                      </div>
                    </div>
                  </div>
                </MobileInfoCard>
              ))}
            </div>
          )}

          {activeTab === 'grid' && (
            <div className="grid grid-cols-2 gap-3">
              {filteredBusinesses.map((business) => (
                <MobileInfoCard
                  key={business.id}
                  title={business.name}
                  subtitle={business.category}
                  image={business.image}
                  rating={business.rating}
                  status={business.status}
                  size="compact"
                  actions={[
                    {
                      id: 'view',
                      label: 'View',
                      icon: <MapPin className="w-4 h-4" />,
                      primary: true,
                      onClick: () => handleBusinessClick(business)
                    }
                  ]}
                  className={selectedBusiness?.id === business.id ? 'ring-2 ring-ncbs-blue' : ''}
                />
              ))}
            </div>
          )}

          {activeTab === 'map' && (
            <div className="text-center py-8">
              <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-mobile-body text-gray-600">Map view is shown above</p>
              <p className="text-mobile-caption text-gray-500">Tap markers to see store details</p>
            </div>
          )}
        </div>
      </MobileBottomSheet>
    </div>
  )
}

export default MobileStoreLocator