'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, MapPin, Calendar, Star, Camera, MessageCircle,
  DollarSign, Users, Clock, Wifi, Car, Coffee, 
  CheckCircle, AlertTriangle, TrendingUp, BarChart3,
  Eye, Heart, ChevronLeft, ChevronRight, Settings,
  Phone, Mail, Globe, Shield, Award, Zap, Filter,
  Plus, Edit3, MoreHorizontal, Bell, Search
} from 'lucide-react'

// Multiple Airbnb listings data
const airbnbListings = [
  {
    id: 1,
    name: 'Ocean View Penthouse',
    type: 'Entire apartment',
    location: 'Sea Point, Cape Town',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop&crop=center', 
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop&crop=center'
    ],
    rating: 4.9,
    reviews: 127,
    pricePerNight: 1850,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Ocean View', 'Pool', 'Parking', 'Wifi', 'Kitchen'],
    monthlyBookings: 23,
    monthlyRevenue: 42550,
    occupancyRate: 87,
    status: 'active',
    nextGuest: {
      name: 'Sarah Johnson',
      checkIn: 'Today 3:00 PM',
      nights: 4,
      guests: 2
    },
    lastBooking: '2 hours ago',
    yearlyRevenue: 485000,
    totalBookings: 156
  },
  {
    id: 2,
    name: 'Mountain View Villa',
    type: 'Entire villa',
    location: 'Stellenbosch, Western Cape',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=250&fit=crop&crop=center'
    ],
    rating: 4.8,
    reviews: 89,
    pricePerNight: 2850,
    guests: 10,
    bedrooms: 5,
    bathrooms: 3,
    amenities: ['Mountain View', 'Pool', 'Garden', 'BBQ', 'Wine Cellar'],
    monthlyBookings: 18,
    monthlyRevenue: 51300,
    occupancyRate: 78,
    status: 'active',
    nextGuest: {
      name: 'Michael Chen Family',
      checkIn: 'Tomorrow 4:00 PM',
      nights: 7,
      guests: 8
    },
    lastBooking: '1 day ago',
    yearlyRevenue: 620000,
    totalBookings: 98
  },
  {
    id: 3,
    name: 'City Loft Studio',
    type: 'Studio apartment',
    location: 'Green Point, Cape Town',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=250&fit=crop&crop=center'
    ],
    rating: 4.7,
    reviews: 203,
    pricePerNight: 950,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['City View', 'Wifi', 'Kitchen', 'Gym'],
    monthlyBookings: 28,
    monthlyRevenue: 26600,
    occupancyRate: 93,
    status: 'active',
    nextGuest: {
      name: 'Emma Wilson',
      checkIn: 'Nov 15 2:00 PM',
      nights: 3,
      guests: 2
    },
    lastBooking: '5 hours ago',
    yearlyRevenue: 320000,
    totalBookings: 245
  },
  {
    id: 4,
    name: 'Beachfront Cottage',
    type: 'Entire house',
    location: 'Hermanus, Western Cape',
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=250&fit=crop&crop=center'
    ],
    rating: 4.6,
    reviews: 156,
    pricePerNight: 1650,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Beach Access', 'Whale Watching', 'Fireplace', 'Garden'],
    monthlyBookings: 20,
    monthlyRevenue: 33000,
    occupancyRate: 82,
    status: 'maintenance',
    nextGuest: null,
    lastBooking: '3 days ago',
    yearlyRevenue: 380000,
    totalBookings: 134
  }
]

// Combined bookings across all properties
const upcomingBookings = [
  {
    id: 1,
    propertyName: 'Ocean View Penthouse',
    propertyId: 1,
    guest: 'Sarah Johnson',
    dates: 'Nov 12-16',
    amount: 7400,
    status: 'confirmed',
    checkin: 'Today 3:00 PM',
    guests: 2,
    nights: 4,
    specialRequests: 'Late checkout requested'
  },
  {
    id: 2,
    propertyName: 'Mountain View Villa', 
    propertyId: 2,
    guest: 'Michael Chen Family',
    dates: 'Nov 13-20',
    amount: 19950,
    status: 'confirmed',
    checkin: 'Tomorrow 4:00 PM',
    guests: 8,
    nights: 7,
    specialRequests: 'Anniversary celebration'
  },
  {
    id: 3,
    propertyName: 'City Loft Studio',
    propertyId: 3,
    guest: 'Emma Wilson',
    dates: 'Nov 15-18',
    amount: 2850,
    status: 'pending_payment',
    checkin: 'Nov 15 2:00 PM',
    guests: 2,
    nights: 3,
    specialRequests: null
  },
  {
    id: 4,
    propertyName: 'Ocean View Penthouse',
    propertyId: 1,
    guest: 'David Martinez',
    dates: 'Nov 18-22',
    amount: 7400,
    status: 'inquiry',
    checkin: 'Nov 18 3:00 PM',
    guests: 4,
    nights: 4,
    specialRequests: 'Pet-friendly inquiry'
  }
]

// Messages across all properties
const guestMessages = [
  {
    id: 1,
    guest: 'Sarah Johnson',
    property: 'Ocean View Penthouse',
    message: 'Hi! Can we get access to the pool area after 8 PM?',
    time: '15 min ago',
    unread: true,
    urgent: false
  },
  {
    id: 2,
    guest: 'Michael Chen',
    property: 'Mountain View Villa',
    message: 'Thank you for the wine cellar access code!',
    time: '2 hours ago',
    unread: true,
    urgent: false
  },
  {
    id: 3,
    guest: 'Emma Wilson',
    property: 'City Loft Studio',
    message: 'Payment not going through, can you help?',
    time: '1 day ago',
    unread: false,
    urgent: true
  },
  {
    id: 4,
    guest: 'James Miller',
    property: 'Beachfront Cottage',
    message: 'When will the maintenance be completed?',
    time: '2 days ago',
    unread: false,
    urgent: true
  }
]

// Performance analytics across all properties
const performanceData = [
  { month: 'Jul', revenue: 145000, bookings: 67, occupancy: 78 },
  { month: 'Aug', revenue: 162000, bookings: 74, occupancy: 82 },
  { month: 'Sep', revenue: 128000, bookings: 58, occupancy: 65 },
  { month: 'Oct', revenue: 156000, bookings: 69, occupancy: 75 },
  { month: 'Nov', revenue: 153450, bookings: 89, occupancy: 85 }
]

const AirbnbHostDashboard = () => {
  const [selectedProperty, setSelectedProperty] = useState(airbnbListings[0])
  const [activeView, setActiveView] = useState<'overview' | 'bookings' | 'messages' | 'analytics' | 'pricing'>('overview')
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const target = 153450
    const increment = target / 100
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setTotalRevenue(target)
        clearInterval(timer)
      } else {
        setTotalRevenue(Math.floor(current))
      }
    }, 20)
    return () => clearInterval(timer)
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedProperty.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedProperty.images.length - 1 : prev - 1
    )
  }

  const totalProperties = airbnbListings.length
  const activeProperties = airbnbListings.filter(p => p.status === 'active').length
  const totalBookings = airbnbListings.reduce((sum, p) => sum + p.monthlyBookings, 0)
  const avgOccupancy = Math.round(airbnbListings.reduce((sum, p) => sum + p.occupancyRate, 0) / totalProperties)
  const avgRating = (airbnbListings.reduce((sum, p) => sum + p.rating, 0) / totalProperties).toFixed(1)
  const unreadMessages = guestMessages.filter(m => m.unread).length
  const urgentMessages = guestMessages.filter(m => m.urgent).length

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Airbnb Host Dashboard</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your portfolio of {totalProperties} listings</p>
        </div>
        
        {/* Host Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-pink-50 to-red-50 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-pink-200">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600" />
            <span className="text-xs sm:text-sm font-medium text-pink-700">Superhost</span>
          </div>
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {(unreadMessages + urgentMessages) > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                {unreadMessages + urgentMessages}
              </span>
            )}
          </div>
          <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1 sm:gap-2">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add Listing</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 lg:mb-8">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-red-100">
          <Home className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mb-1 sm:mb-2" />
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{activeProperties}/{totalProperties}</p>
          <p className="text-xs text-gray-500">Active Listings</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-100">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mb-1 sm:mb-2" />
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalBookings}</p>
          <p className="text-xs text-gray-500">Monthly Bookings</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-green-100">
          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1 sm:mb-2" />
          <p className="text-lg sm:text-2xl font-bold text-gray-900">R{(totalRevenue/1000).toFixed(0)}k</p>
          <p className="text-xs text-gray-500">This Month</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-yellow-100">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mb-1 sm:mb-2" />
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{avgOccupancy}%</p>
          <p className="text-xs text-gray-500">Avg Occupancy</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-100">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mb-1 sm:mb-2" />
          <p className="text-lg sm:text-2xl font-bold text-gray-900">⭐ {avgRating}</p>
          <p className="text-xs text-gray-500">Avg Rating</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-indigo-100">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mb-1 sm:mb-2" />
          <p className="text-lg sm:text-2xl font-bold text-gray-900">2.8k</p>
          <p className="text-xs text-gray-500">Monthly Views</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Property Listings */}
        <div className="col-span-1 lg:col-span-8">
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 h-[500px] lg:h-[600px] flex flex-col">
            {/* Property Selector */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Properties</h3>
              <div className="flex items-center gap-2">
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                <select className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2 sm:px-3 py-1">
                  <option>All Properties</option>
                  <option>Active Only</option>
                  <option>High Performers</option>
                </select>
              </div>
            </div>

            {/* Scrollable Property Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                {airbnbListings.map((property) => (
                  <motion.div
                    key={property.id}
                    onClick={() => {
                      setSelectedProperty(property)
                      setCurrentImageIndex(0)
                    }}
                    className={`relative p-2 sm:p-3 rounded-xl cursor-pointer transition-all border-2 ${
                      selectedProperty.id === property.id
                        ? 'border-red-500 bg-white shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Property Image */}
                    <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-2 relative">
                      <img
                        src={property.images[0]}
                        alt={property.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDE4NVY5MEgxNzVWMTAwWk0xODUgMTEwSDE5NVYxMDBIMTg1VjExMFpNMTk1IDEyMEgyMDVWMTEwSDE5NVYxMjBaTTIwNSAxMzBIMjE1VjEyMEgyMDVWMTMwWk0yMTUgMTQwSDIyNVYxMzBIMjE1VjE0MFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHN2Zz4K'
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === 'active' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-yellow-500 text-white'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm">{property.name}</h4>
                      <p className="text-xs text-gray-500 mb-1 sm:mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {property.location}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-medium">{property.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">({property.reviews})</span>
                        <span className="text-xs font-bold text-gray-900">R{property.pricePerNight}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 sm:gap-2">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-900">{property.occupancyRate}%</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">Occupancy</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-900">{property.monthlyBookings}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">Bookings</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-900">R{(property.monthlyRevenue / 1000).toFixed(0)}k</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">Revenue</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Selected Property Detailed View */}
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 mb-3 sm:mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Image Gallery */}
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
                      <img
                        src={selectedProperty.images[currentImageIndex]}
                        alt={selectedProperty.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDE4NVY5MEgxNzVWMTAwWk0xODUgMTEwSDE5NVYxMDBIMTg1VjExMFpNMTk1IDEyMEgyMDVWMTEwSDE5NVYxMjBaTTIwNSAxMzBIMjE1VjEyMEgyMDVWMTMwWk0yMTUgMTQwSDIyNVYxMzBIMjE1VjE0MFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHN2Zz4K'
                        }}
                      />
                      
                      {/* Image Navigation */}
                      {selectedProperty.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              prevImage()
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              nextImage()
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Image Indicators */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
                        {selectedProperty.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentImageIndex(index)
                            }}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Property Information */}
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">{selectedProperty.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {selectedProperty.location}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{selectedProperty.type}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{selectedProperty.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({selectedProperty.reviews} reviews)</span>
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{selectedProperty.guests} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{selectedProperty.bedrooms} bedrooms</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedProperty.amenities.slice(0, 4).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-gray-200 rounded-lg text-xs text-gray-700"
                          >
                            {amenity}
                          </span>
                        ))}
                        {selectedProperty.amenities.length > 4 && (
                          <span className="text-xs text-gray-500">+{selectedProperty.amenities.length - 4} more</span>
                        )}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900">R{selectedProperty.pricePerNight}</p>
                        <p className="text-xs text-gray-500">per night</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{selectedProperty.occupancyRate}%</p>
                        <p className="text-xs text-gray-500">occupancy rate</p>
                      </div>
                    </div>

                    {/* Next Guest Info */}
                    {selectedProperty.nextGuest ? (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Next Check-in</span>
                        </div>
                        <p className="text-sm text-blue-700">{selectedProperty.nextGuest.name}</p>
                        <p className="text-xs text-blue-600">{selectedProperty.nextGuest.checkIn} • {selectedProperty.nextGuest.nights} nights</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">Under Maintenance</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-1 lg:col-span-4 h-auto lg:h-[600px] flex flex-col space-y-3 sm:space-y-4">
          {/* Navigation Tabs - Horizontal Scroll on Mobile */}
          <div className="bg-gray-100 rounded-lg sm:rounded-xl p-1">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'messages', label: 'Messages', icon: MessageCircle },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'pricing', label: 'Pricing', icon: () => <span className="text-xs font-bold">R</span> }
              ].map((tab) => {
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as any)}
                    className={`flex items-center gap-1 px-3 sm:px-2 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      activeView === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <TabIcon className="w-3 h-3" />
                    {tab.label}
                    {tab.id === 'messages' && unreadMessages > 0 && (
                      <span className="ml-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]">
                        {unreadMessages}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 flex-1 overflow-hidden"
            >
              {activeView === 'overview' && (
                <div>
                  <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-3 sm:mb-4">Portfolio Overview</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Properties</span>
                      <span className="font-medium">{totalProperties}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Month Revenue</span>
                      <span className="font-medium">R{totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Bookings</span>
                      <span className="font-medium">{upcomingBookings.filter(b => b.status === 'confirmed').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="font-medium text-green-600">98%</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Superhost Status</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">Excellent performance across all listings!</p>
                  </div>
                </div>
              )}

              {activeView === 'bookings' && (
                <div>
                  <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-3 sm:mb-4">Upcoming Bookings</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{booking.guest}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{booking.propertyName}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{booking.dates} • {booking.guests} guests</span>
                          <span className="text-sm font-bold text-gray-900">R{booking.amount.toLocaleString()}</span>
                        </div>
                        {booking.specialRequests && (
                          <p className="text-xs text-orange-600 mt-1">⚠️ {booking.specialRequests}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeView === 'messages' && (
                <div>
                  <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-3 sm:mb-4">Guest Messages</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {guestMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.unread ? 'bg-blue-50 border border-blue-200' : 
                          message.urgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {message.guest}
                            {message.urgent && <AlertTriangle className="w-3 h-3 text-red-500" />}
                          </span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{message.property}</p>
                        <p className="text-sm text-gray-800">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeView === 'analytics' && (
                <div>
                  <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-3 sm:mb-4">Performance Analytics</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <TrendingUp className="w-4 h-4 text-green-600 mb-1" />
                        <p className="text-lg font-bold text-gray-900">+18%</p>
                        <p className="text-xs text-gray-500">Revenue Growth</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <Eye className="w-4 h-4 text-blue-600 mb-1" />
                        <p className="text-lg font-bold text-gray-900">2,847</p>
                        <p className="text-xs text-gray-500">Monthly Views</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Recent Months</p>
                      {performanceData.slice(-4).map((month) => (
                        <div key={month.month} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">{month.month}</span>
                          <div className="text-right">
                            <span className="text-sm font-medium">R{(month.revenue / 1000).toFixed(0)}k</span>
                            <span className="text-xs text-gray-500 ml-2">{month.occupancy}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'pricing' && (
                <div>
                  <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-3 sm:mb-4">Smart Pricing</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">AI Recommendations</span>
                      </div>
                      <p className="text-xs text-blue-700">Increase weekend rates by 15% for peak demand</p>
                    </div>
                    
                    {/* Pricing for selected property */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">{selectedProperty.name}</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Base Rate</span>
                          <span className="font-medium">R{selectedProperty.pricePerNight}/night</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Weekend Rate</span>
                          <span className="font-medium text-green-600">R{Math.round(selectedProperty.pricePerNight * 1.2)}/night</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Holiday Rate</span>
                          <span className="font-medium text-orange-600">R{Math.round(selectedProperty.pricePerNight * 1.5)}/night</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white">
            <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all">
                <Camera className="w-4 h-4 inline mr-2" />
                Update Photos
              </button>
              <button className="w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all">
                <Settings className="w-4 h-4 inline mr-2" />
                Adjust Rates
              </button>
              <button className="w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all">
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Message Guests
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AirbnbHostDashboard