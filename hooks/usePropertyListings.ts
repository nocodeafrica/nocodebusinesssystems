import { useState, useCallback, useEffect } from 'react'

export interface Property {
  id: number
  title: string
  type: 'House' | 'Apartment' | 'Studio' | 'Penthouse' | 'Commercial' | 'Townhouse'
  price: number
  location: string
  coordinates: [number, number]
  province: string
  bedrooms: number
  bathrooms: number
  parking: number
  size: number
  erfsSize?: number
  images: string[]
  featured: boolean
  status: 'For Sale' | 'To Rent' | 'Sold'
  description: string
  amenities: string[]
  levies: number
  rates: number
  listed: string
  agent: string
  rating: number
}

interface Filters {
  type?: string
  province?: string
  minPrice?: number
  maxPrice?: number
  minBeds?: number
  status?: string
  search?: string
}

// Sample property data for South African market
const sampleProperties: Property[] = [
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
  },
  {
    id: 6,
    title: 'Townhouse in Fourways',
    type: 'Townhouse',
    price: 1950000,
    location: 'Fourways, Johannesburg',
    coordinates: [28.0105, -26.0167],
    province: 'Gauteng',
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    size: 145,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'
    ],
    featured: false,
    status: 'For Sale',
    description: 'Modern townhouse in secure complex near schools',
    amenities: ['Security', 'Garden', 'Pet Friendly', 'Clubhouse'],
    levies: 1800,
    rates: 950,
    listed: '4 days ago',
    agent: 'Linda Dlamini',
    rating: 4.7
  }
]

export function usePropertyListings() {
  const [properties, setProperties] = useState<Property[]>(sampleProperties)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(sampleProperties)
  const [savedProperties, setSavedProperties] = useState<number[]>([])
  const [filters, setFilters] = useState<Filters>({})
  const [loading, setLoading] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [viewState, setViewState] = useState({
    latitude: -26.1075,
    longitude: 28.0573,
    zoom: 10
  })

  // Apply filters
  useEffect(() => {
    let filtered = [...properties]

    if (filters.type && filters.type !== 'All') {
      filtered = filtered.filter(p => p.type === filters.type)
    }

    if (filters.province && filters.province !== 'All') {
      filtered = filtered.filter(p => p.province === filters.province)
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!)
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!)
    }

    if (filters.minBeds) {
      filtered = filtered.filter(p => p.bedrooms >= filters.minBeds!)
    }

    if (filters.status && filters.status !== 'All') {
      filtered = filtered.filter(p => p.status === filters.status)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.location.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      )
    }

    setFilteredProperties(filtered)
  }, [filters, properties])

  const toggleSaveProperty = useCallback((propertyId: number) => {
    setSavedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }, [])

  const handlePropertyClick = useCallback((property: Property) => {
    setSelectedProperty(property)
    setViewState({
      latitude: property.coordinates[1],
      longitude: property.coordinates[0],
      zoom: 14
    })
  }, [])

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  const formatPrice = useCallback((price: number, status: string) => {
    if (status === 'To Rent') {
      return `R ${price.toLocaleString('en-ZA')}/mo`
    }
    return `R ${price.toLocaleString('en-ZA')}`
  }, [])

  const getMarkerColor = useCallback((property: Property) => {
    if (property.featured) return '#fbbf24' // Yellow for featured
    if (property.status === 'To Rent') return '#10b981' // Green for rent
    return '#6366f1' // Indigo for sale
  }, [])

  const getSavedProperties = useCallback(() => {
    return properties.filter(p => savedProperties.includes(p.id))
  }, [properties, savedProperties])

  // Simulated data fetching
  const fetchMoreProperties = useCallback(async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In real app, fetch from API
    setLoading(false)
  }, [])

  return {
    properties: filteredProperties,
    allProperties: properties,
    savedProperties,
    selectedProperty,
    viewState,
    loading,
    filters,
    toggleSaveProperty,
    handlePropertyClick,
    setSelectedProperty,
    setViewState,
    updateFilters,
    clearFilters,
    formatPrice,
    getMarkerColor,
    getSavedProperties,
    fetchMoreProperties
  }
}