'use client'

import React, { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import MobileMapOverlay, { MiniLocationCard } from '../mobile/MobileMapOverlay'
import MapWrapper from '../MapWrapper'

// Conditionally import map components only on client
let Map: any, Marker: any, NavigationControl: any

if (typeof window !== 'undefined') {
  const mapgl = require('react-map-gl/mapbox')
  Map = mapgl.default
  Marker = mapgl.Marker
  NavigationControl = mapgl.NavigationControl
}
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Star, 
  Clock,
  MapPin,
  Package,
  ShoppingBag,
  Activity,
  Filter,
  Grid3x3,
  Map as MapIcon,
  Calendar,
  Download,
  Search,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Target,
  Award,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  TrendingUp as TrendIcon,
  Building2,
  CircleDollarSign,
  Users2,
  ShoppingCart,
  Percent,
  ChevronUp,
  ChevronDown,
  Info,
  MoreVertical,
  Store,
  Layers,
  RefreshCw
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ComposedChart, RadialBarChart, RadialBar, Treemap, FunnelChart, Funnel, LabelList } from 'recharts'
const GeolocateControl = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.GeolocateControl), { ssr: false })
const Source = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Source), { ssr: false })
const Layer = dynamic(() => import('react-map-gl/mapbox').then(mod => mod.Layer), { ssr: false })

// Generate mock store data with South African context
const generateStoreData = () => {
  const provinces = ['Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West']
  const storeTypes = ['Flagship', 'Mall', 'Express', 'Community', 'Premium', 'Standard', 'Outlet', 'Pop-up']
  const statuses = ['excellent', 'good', 'average', 'needs-attention']
  
  const cities = {
    'Western Cape': ['Cape Town', 'Stellenbosch', 'Paarl', 'Somerset West'],
    'Gauteng': ['Johannesburg', 'Pretoria', 'Sandton', 'Centurion', 'Midrand'],
    'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Newcastle'],
    'Eastern Cape': ['Port Elizabeth', 'East London'],
    'Free State': ['Bloemfontein', 'Welkom'],
    'Limpopo': ['Polokwane', 'Tzaneen'],
    'Mpumalanga': ['Nelspruit', 'Witbank'],
    'Northern Cape': ['Kimberley', 'Upington'],
    'North West': ['Rustenburg', 'Potchefstroom']
  }
  
  // Major city coordinates for more realistic placement - [longitude, latitude]
  // These are accurate coordinates for South African cities
  const cityCoordinates: Record<string, [number, number]> = {
    // Western Cape
    'Cape Town': [18.4241, -33.9249],
    'Stellenbosch': [18.8602, -33.9321],
    'Paarl': [18.9756, -33.7340],
    'Somerset West': [18.8459, -34.0840],
    
    // Gauteng
    'Johannesburg': [28.0473, -26.2041],
    'Pretoria': [28.1878, -25.7461],
    'Sandton': [28.0573, -26.1080],
    'Centurion': [28.1878, -25.8602],
    'Midrand': [28.1285, -25.9990],
    
    // KwaZulu-Natal
    'Durban': [31.0218, -29.8587],
    'Pietermaritzburg': [30.3928, -29.5857],
    'Newcastle': [29.9318, -27.7580],
    
    // Eastern Cape
    'Port Elizabeth': [25.6022, -33.9608],
    'East London': [27.9116, -32.9974],
    
    // Free State
    'Bloemfontein': [26.2023, -29.1191],
    'Welkom': [26.7388, -27.9776],
    
    // Limpopo
    'Polokwane': [29.4686, -23.9045],
    'Tzaneen': [30.1633, -23.8333],
    
    // Mpumalanga
    'Nelspruit': [30.9857, -25.4753],
    'Witbank': [29.2336, -25.8714],
    
    // Northern Cape
    'Kimberley': [24.7662, -28.7389],
    'Upington': [21.2565, -28.4478],
    
    // North West
    'Rustenburg': [27.2520, -25.6742],
    'Potchefstroom': [27.0976, -26.7145]
  }
  
  return Array.from({ length: 35 }, (_, i) => {
    const province = provinces[Math.floor(Math.random() * provinces.length)]
    const citiesInProvince = cities[province as keyof typeof cities] || ['Unknown City']
    const city = citiesInProvince[Math.floor(Math.random() * citiesInProvince.length)]
    
    // Get base coordinates for the city
    let baseCoords = cityCoordinates[city]
    
    // If city not found in coordinates, use a random coordinate from the province
    if (!baseCoords) {
      const provinceCities = citiesInProvince.filter(c => cityCoordinates[c])
      if (provinceCities.length > 0) {
        const fallbackCity = provinceCities[0]
        baseCoords = cityCoordinates[fallbackCity]
      } else {
        // Fallback to Johannesburg coordinates as default
        baseCoords = [28.0473, -26.2041]
      }
    }
    
    // Add slight variation to coordinates within the city (smaller variation for more realistic clustering)
    // Using 0.02 degrees variation which is approximately 2km in South Africa
    const coordinates = {
      lng: baseCoords[0] + (Math.random() - 0.5) * 0.02,
      lat: baseCoords[1] + (Math.random() - 0.5) * 0.02
    }
    
    return {
      id: `store-${i + 1}`,
      name: `${storeTypes[i % storeTypes.length]} ${city}`,
      province,
      city,
      coordinates,
      revenue: Math.floor(Math.random() * 800000) + 200000,
      previousRevenue: Math.floor(Math.random() * 700000) + 180000,
      customers: Math.floor(Math.random() * 8000) + 2000,
      previousCustomers: Math.floor(Math.random() * 7500) + 1800,
      transactions: Math.floor(Math.random() * 3000) + 500,
      avgTransaction: Math.floor(Math.random() * 500) + 150,
      rating: (Math.random() * 2 + 3).toFixed(1),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      growth: (Math.random() - 0.3) * 50,
      inventory: Math.floor(Math.random() * 15000) + 5000,
      staff: Math.floor(Math.random() * 60) + 15,
      conversion: (Math.random() * 0.4 + 0.05).toFixed(2),
      footfall: Math.floor(Math.random() * 2000) + 500,
      sqMeters: Math.floor(Math.random() * 800) + 200,
      revenuePerSqm: Math.floor(Math.random() * 2000) + 500,
      openingHours: '09:00 - 21:00',
      manager: ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis'][Math.floor(Math.random() * 4)]
    }
  })
}

// Generate hourly performance data
const generateHourlyData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    customers: Math.floor(Math.random() * 300 + Math.sin(i / 3) * 150 + 100),
    revenue: Math.floor(Math.random() * 15000 + Math.sin(i / 3) * 8000 + 5000),
    transactions: Math.floor(Math.random() * 150 + Math.sin(i / 3) * 75 + 50)
  }))
}

// Generate weekly trends
const generateWeeklyTrends = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day, i) => ({
    day,
    revenue: Math.floor(Math.random() * 150000 + (i > 4 ? 200000 : 100000)),
    customers: Math.floor(Math.random() * 3000 + (i > 4 ? 4000 : 2000)),
    conversion: (Math.random() * 0.15 + (i > 4 ? 0.25 : 0.15)).toFixed(2),
    avgBasket: Math.floor(Math.random() * 100 + (i > 4 ? 350 : 250))
  }))
}

// Generate monthly performance
const generateMonthlyPerformance = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map((month, i) => ({
    month,
    revenue: Math.floor(Math.random() * 2000000 + 1500000 + i * 100000),
    target: 2000000 + i * 80000,
    lastYear: Math.floor(Math.random() * 1800000 + 1200000),
    customers: Math.floor(Math.random() * 50000 + 40000),
    growth: (Math.random() * 20 - 5).toFixed(1)
  }))
}

// Generate category performance
const generateCategoryPerformance = () => [
  { category: 'Electronics', sales: 850000, growth: 15.2, units: 3450, margin: 28, color: '#8b5cf6' },
  { category: 'Fashion', sales: 620000, growth: -3.5, units: 8920, margin: 45, color: '#3b82f6' },
  { category: 'Groceries', sales: 1200000, growth: 8.7, units: 25850, margin: 18, color: '#10b981' },
  { category: 'Home & Living', sales: 450000, growth: 22.3, units: 2120, margin: 35, color: '#f59e0b' },
  { category: 'Sports & Outdoor', sales: 380000, growth: 18.9, units: 1850, margin: 32, color: '#ef4444' },
  { category: 'Beauty & Health', sales: 520000, growth: 5.2, units: 6410, margin: 52, color: '#ec4899' },
  { category: 'Books & Media', sales: 180000, growth: -12.3, units: 3200, margin: 25, color: '#14b8a6' },
  { category: 'Toys & Games', sales: 290000, growth: 28.5, units: 2100, margin: 38, color: '#f97316' }
]

// Generate customer segments
const generateCustomerSegments = () => [
  { segment: 'Loyal Customers', value: 35, revenue: 2800000, avgSpend: 850 },
  { segment: 'New Customers', value: 25, revenue: 1200000, avgSpend: 320 },
  { segment: 'Occasional Buyers', value: 20, revenue: 900000, avgSpend: 450 },
  { segment: 'At Risk', value: 12, revenue: 500000, avgSpend: 280 },
  { segment: 'Lost Customers', value: 8, revenue: 200000, avgSpend: 150 }
]

// Generate real-time activities
const generateRealtimeActivities = () => [
  { type: 'sale', store: 'Flagship Cape Town', amount: 3450, product: 'MacBook Pro', time: '2 min ago', status: 'completed' },
  { type: 'alert', store: 'Mall Sandton', message: 'Stock running low on iPhone 15', time: '5 min ago', status: 'warning' },
  { type: 'milestone', store: 'Express Durban', message: 'Daily target achieved (102%)', time: '12 min ago', status: 'success' },
  { type: 'sale', store: 'Community Pretoria', amount: 890, product: 'Samsung Galaxy S24', time: '15 min ago', status: 'completed' },
  { type: 'review', store: 'Premium Stellenbosch', rating: 5, comment: 'Excellent service!', time: '18 min ago', status: 'info' },
  { type: 'alert', store: 'Outlet Bloemfontein', message: 'POS system offline', time: '22 min ago', status: 'error' },
  { type: 'sale', store: 'Standard Port Elizabeth', amount: 1250, product: 'iPad Air', time: '25 min ago', status: 'completed' }
]

// Generate performance metrics for analytics view
const generatePerformanceMetrics = () => ({
  conversionFunnel: [
    { stage: 'Store Visits', value: 45000, fill: '#8b5cf6' },
    { stage: 'Product Views', value: 32000, fill: '#3b82f6' },
    { stage: 'Add to Cart', value: 18000, fill: '#10b981' },
    { stage: 'Checkout', value: 12000, fill: '#f59e0b' },
    { stage: 'Purchase', value: 9500, fill: '#ef4444' }
  ],
  performanceRadar: [
    { metric: 'Revenue', A: 85, B: 72, fullMark: 100 },
    { metric: 'Traffic', A: 92, B: 88, fullMark: 100 },
    { metric: 'Conversion', A: 78, B: 65, fullMark: 100 },
    { metric: 'AOV', A: 88, B: 82, fullMark: 100 },
    { metric: 'Satisfaction', A: 95, B: 90, fullMark: 100 },
    { metric: 'Retention', A: 82, B: 75, fullMark: 100 }
  ],
  yearOverYear: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    thisYear: Math.floor(Math.random() * 500000 + 1500000),
    lastYear: Math.floor(Math.random() * 450000 + 1300000),
    growth: (Math.random() * 30 - 10).toFixed(1)
  }))
})

const StoreAnalyticsV4: React.FC = () => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'map' | 'analytics'>('dashboard')
  const [selectedStore, setSelectedStore] = useState<any>(null)
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('week')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'customers' | 'conversion' | 'growth'>('revenue')
  const [showComparison, setShowComparison] = useState(false)
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [mapViewState, setMapViewState] = useState({
    longitude: 25.0,
    latitude: -29.0,
    zoom: 5.5
  })

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const stores = useMemo(() => generateStoreData(), [])
  const hourlyData = useMemo(() => generateHourlyData(), [])
  const weeklyTrends = useMemo(() => generateWeeklyTrends(), [])
  const monthlyPerformance = useMemo(() => generateMonthlyPerformance(), [])
  const categoryPerformance = useMemo(() => generateCategoryPerformance(), [])
  const customerSegments = useMemo(() => generateCustomerSegments(), [])
  const realtimeActivities = useMemo(() => generateRealtimeActivities(), [])
  const performanceMetrics = useMemo(() => generatePerformanceMetrics(), [])
  
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          store.province.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || store.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [stores, searchQuery, filterStatus])
  
  const totalMetrics = useMemo(() => {
    const current = filteredStores.reduce((acc, store) => ({
      revenue: acc.revenue + store.revenue,
      customers: acc.customers + store.customers,
      transactions: acc.transactions + store.transactions,
      stores: acc.stores + 1,
      avgRating: acc.avgRating + parseFloat(store.rating),
      footfall: acc.footfall + store.footfall
    }), { revenue: 0, customers: 0, transactions: 0, stores: 0, avgRating: 0, footfall: 0 })
    
    const previous = filteredStores.reduce((acc, store) => ({
      revenue: acc.revenue + store.previousRevenue,
      customers: acc.customers + store.previousCustomers
    }), { revenue: 0, customers: 0 })
    
    return {
      ...current,
      avgRating: (current.avgRating / current.stores).toFixed(1),
      revenueGrowth: ((current.revenue - previous.revenue) / previous.revenue * 100).toFixed(1),
      customerGrowth: ((current.customers - previous.customers) / previous.customers * 100).toFixed(1),
      avgTransaction: (current.revenue / current.transactions).toFixed(0),
      conversionRate: ((current.transactions / current.footfall) * 100).toFixed(1)
    }
  }, [filteredStores])
  
  const topPerformers = useMemo(() => {
    return [...filteredStores].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [filteredStores])
  
  const needsAttention = useMemo(() => {
    return filteredStores.filter(s => s.status === 'needs-attention' || s.growth < -10).slice(0, 5)
  }, [filteredStores])

  // Comparison data for selected stores
  const comparisonData = useMemo(() => {
    if (selectedStores.length === 0) return null
    
    const selected = stores.filter(s => selectedStores.includes(s.id))
    return {
      stores: selected,
      metrics: ['revenue', 'customers', 'conversion', 'rating'].map(metric => ({
        metric,
        ...selected.reduce((acc, store) => ({
          ...acc,
          [store.name]: metric === 'revenue' ? store.revenue / 1000 :
                        metric === 'customers' ? store.customers / 100 :
                        metric === 'conversion' ? parseFloat(store.conversion) :
                        parseFloat(store.rating)
        }), {})
      }))
    }
  }, [selectedStores, stores])

  const COLORS = {
    primary: '#8b5cf6',
    secondary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    pink: '#ec4899',
    indigo: '#6366f1'
  }
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-lg">
          <p className="text-gray-900 font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="text-gray-900 font-medium">
                {entry.name.includes('Revenue') || entry.name.includes('Sales') 
                  ? `R${(entry.value / 1000).toFixed(0)}k`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }
  
  // Mobile layout
  if (isMobile) {
    // Create mini cards for stores
    const storeCards = filteredStores.map(store => (
      <MiniLocationCard
        key={store.id}
        title={store.name}
        subtitle={`${store.city}, ${store.province}`}
        distance={`R${(store.revenue / 1000).toFixed(0)}k revenue`}
        status={
          store.status === 'excellent' ? 'open' :
          store.status === 'good' ? 'busy' : 'closed'
        }
        onClick={() => {
          setSelectedStore(store)
          setMapViewState({
            longitude: store.coordinates.lng,
            latitude: store.coordinates.lat,
            zoom: 12
          })
        }}
        isSelected={selectedStore?.id === store.id}
      />
    ))

    // Selected store content
    const selectedContent = selectedStore ? (
      <div className="space-y-4">
        {/* Store Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{selectedStore.name}</h3>
              <p className="text-sm text-gray-500">{selectedStore.type} • {selectedStore.city}</p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              selectedStore.status === 'excellent' ? 'bg-green-100 text-green-700' :
              selectedStore.status === 'good' ? 'bg-blue-100 text-blue-700' :
              selectedStore.status === 'average' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {selectedStore.status}
            </div>
          </div>
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <DollarSign className="w-3 h-3" />
                <span>Revenue</span>
              </div>
              <p className="text-sm font-semibold">R{(selectedStore.revenue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <Users className="w-3 h-3" />
                <span>Customers</span>
              </div>
              <p className="text-sm font-semibold">{selectedStore.customers.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <TrendingUp className="w-3 h-3" />
                <span>Growth</span>
              </div>
              <p className={`text-sm font-semibold ${selectedStore.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedStore.growth > 0 ? '+' : ''}{selectedStore.growth}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <Star className="w-3 h-3" />
                <span>Rating</span>
              </div>
              <p className="text-sm font-semibold">{selectedStore.rating}</p>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrends}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'dashboard' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'map' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'analytics' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>
    ) : null

    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg h-[600px] relative">
        <MobileMapOverlay
          miniCards={storeCards}
          selectedContent={selectedContent}
          hasSelection={!!selectedStore}
        >
          {/* Map */}
          <MapWrapper>
            {Map && (
              <Map
            {...mapViewState}
            onMove={(evt: any) => setMapViewState(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
          >
            <NavigationControl position="top-right" />
            
            {/* Store markers */}
            {filteredStores.map(store => (
              <Marker
                key={store.id}
                longitude={store.coordinates.lng}
                latitude={store.coordinates.lat}
                onClick={() => setSelectedStore(store)}
              >
                <div className="relative cursor-pointer">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    selectedStore?.id === store.id ? 'bg-purple-500' :
                    store.status === 'excellent' ? 'bg-green-500' :
                    store.status === 'good' ? 'bg-blue-500' :
                    store.status === 'average' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  {selectedStore?.id === store.id && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md">
                      <p className="text-xs font-medium text-gray-900 whitespace-nowrap">{store.name}</p>
                    </div>
                  )}
                </div>
              </Marker>
            ))}
          </Map>
            )}
          </MapWrapper>
        </MobileMapOverlay>
      </div>
    )
  }
  
  // Desktop layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    Store Analytics Pro
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">Real-time retail intelligence platform</p>
                </div>
                
                {/* View Mode Switcher */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                    { id: 'map', label: 'Map View', icon: MapIcon },
                    { id: 'analytics', label: 'Analytics', icon: LineChart }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        viewMode === mode.id
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <mode.icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Time Range Selector */}
                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-gray-200">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                
                {/* Export Button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                  <Download className="w-4 h-4" />
                  <span className="hidden lg:inline">Export</span>
                </button>
              </div>
            </div>
            
            {/* Search and Filters */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stores, cities, or provinces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2">
                {['all', 'excellent', 'good', 'average', 'needs-attention'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filterStatus === status
                        ? status === 'excellent' ? 'bg-green-100 text-green-700 border border-green-300' :
                          status === 'good' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                          status === 'average' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                          status === 'needs-attention' ? 'bg-red-100 text-red-700 border border-red-300' :
                          'bg-purple-100 text-purple-700 border border-purple-300'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' ? 'All Stores' : 
                     status === 'needs-attention' ? 'Needs Attention' :
                     status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  showComparison
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Target className="w-4 h-4" />
                Compare
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          {/* Dashboard View */}
          {viewMode === 'dashboard' && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                      <CircleDollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      parseFloat(totalMetrics.revenueGrowth) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseFloat(totalMetrics.revenueGrowth) > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(parseFloat(totalMetrics.revenueGrowth))}%
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    R{(totalMetrics.revenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="mt-3 h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyTrends.slice(-7)}>
                        <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                      <Users2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      parseFloat(totalMetrics.customerGrowth) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseFloat(totalMetrics.customerGrowth) > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(parseFloat(totalMetrics.customerGrowth))}%
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {(totalMetrics.customers / 1000).toFixed(1)}K
                  </div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                  <div className="mt-3 h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={weeklyTrends.slice(-7)}>
                        <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 bg-green-100 rounded-xl group-hover:scale-110 transition-transform">
                      <Percent className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-yellow-600">
                      <Activity className="w-4 h-4" />
                      Stable
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {totalMetrics.conversionRate}%
                  </div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        style={{ width: `${totalMetrics.conversionRate}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">Target: 15%</span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                      <ShoppingCart className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      8.5%
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    R{totalMetrics.avgTransaction}
                  </div>
                  <div className="text-sm text-gray-600">Avg Transaction</div>
                  <div className="mt-3 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex-1 h-8 bg-gray-200 rounded" style={{
                        height: `${20 + Math.random() * 12}px`,
                        background: `linear-gradient(to top, ${COLORS.warning}, ${COLORS.warning}40)`
                      }} />
                    ))}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 bg-pink-100 rounded-xl group-hover:scale-110 transition-transform">
                      <Building2 className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      +3 New
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {totalMetrics.stores}
                  </div>
                  <div className="text-sm text-gray-600">Active Stores</div>
                  <div className="mt-3 grid grid-cols-4 gap-1">
                    {['excellent', 'good', 'average', 'needs-attention'].map((status) => {
                      const count = filteredStores.filter(s => s.status === status).length
                      return (
                        <div key={status} className="relative group/bar">
                          <div className={`w-full rounded-t transition-all ${
                            status === 'excellent' ? 'bg-green-500' :
                            status === 'good' ? 'bg-blue-500' :
                            status === 'average' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} style={{ height: `${(count / totalMetrics.stores) * 32}px` }} />
                          <div className="text-xs text-gray-500 text-center mt-1">{count}</div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>
              
              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Store Performance */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Performance Chart */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-gray-900">Performance Overview</h2>
                      <div className="flex items-center gap-2">
                        {['revenue', 'customers', 'conversion', 'growth'].map(metric => (
                          <button
                            key={metric}
                            onClick={() => setSelectedMetric(metric as any)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                              selectedMetric === metric
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {metric}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={monthlyPerformance}>
                          <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                            </linearGradient>
                            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue"
                            stroke="#8b5cf6"
                            fill="url(#revenueGradient)"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="target"
                            name="Target"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                          />
                          <Bar
                            dataKey="lastYear"
                            name="Last Year"
                            fill="#e5e7eb"
                            opacity={0.7}
                            radius={[4, 4, 0, 0]}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                  
                  {/* Category Performance */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-gray-900">Category Performance</h2>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={categoryPerformance}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={2}
                              dataKey="sales"
                            >
                              {categoryPerformance.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="space-y-3">
                        {categoryPerformance.slice(0, 5).map((cat, index) => (
                          <div key={cat.category} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-700 font-medium">{cat.category}</span>
                                <span className="text-xs text-gray-500">R{(cat.sales / 1000).toFixed(0)}k</span>
                              </div>
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all"
                                  style={{ 
                                    width: `${(cat.sales / Math.max(...categoryPerformance.map(c => c.sales))) * 100}%`,
                                    backgroundColor: cat.color
                                  }}
                                />
                              </div>
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${
                              cat.growth > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {cat.growth > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              {Math.abs(cat.growth)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Store Grid - Fixed spacing */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Store Locations</h2>
                      <span className="text-sm text-gray-500">{filteredStores.length} stores</span>
                    </div>
                    
                    {showComparison && selectedStores.length > 0 && (
                      <div className="mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-indigo-700">
                            {selectedStores.length} stores selected for comparison
                          </span>
                          <button
                            onClick={() => setSelectedStores([])}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            Clear Selection
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {filteredStores.slice(0, 10).map((store, index) => (
                        <motion.div
                          key={store.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            if (showComparison) {
                              setSelectedStores(prev => 
                                prev.includes(store.id)
                                  ? prev.filter(id => id !== store.id)
                                  : [...prev, store.id]
                              )
                            } else {
                              setSelectedStore(store)
                            }
                          }}
                          className={`p-4 bg-gray-50 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedStores.includes(store.id)
                              ? 'border-indigo-500 bg-indigo-50'
                              : selectedStore?.id === store.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">{store.name}</h3>
                              <p className="text-xs text-gray-500">{store.city}, {store.province}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              store.status === 'excellent'
                                ? 'bg-green-100 text-green-700'
                                : store.status === 'good'
                                ? 'bg-blue-100 text-blue-700'
                                : store.status === 'average'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {store.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs text-gray-500">Revenue</p>
                              <p className="text-sm font-semibold text-gray-900">R{(store.revenue / 1000).toFixed(0)}k</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Customers</p>
                              <p className="text-sm font-semibold text-gray-900">{(store.customers / 1000).toFixed(1)}k</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Growth</p>
                              <p className={`text-sm font-semibold flex items-center gap-1 ${
                                store.growth > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {store.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {Math.abs(store.growth).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          
                          {showComparison && selectedStores.includes(store.id) && (
                            <div className="mt-3 pt-3 border-t border-indigo-200 flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-indigo-600" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Comparison Chart */}
                    {showComparison && comparisonData && selectedStores.length > 1 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Store Comparison</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparisonData.metrics}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="metric" stroke="#6b7280" />
                              <YAxis stroke="#6b7280" />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              {comparisonData.stores.map((store, index) => (
                                <Bar
                                  key={store.id}
                                  dataKey={store.name}
                                  fill={Object.values(COLORS)[index % Object.values(COLORS).length]}
                                />
                              ))}
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
                
                {/* Right Column - Insights & Activities */}
                <div className="space-y-6">
                  {/* Top Performers */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Top Performers</h3>
                      <Award className="w-5 h-5 text-yellow-500" />
                    </div>
                    
                    <div className="space-y-3">
                      {topPerformers.map((store, index) => (
                        <div key={store.id} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{store.name}</div>
                            <div className="text-xs text-gray-500">{store.city}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">R{(store.revenue / 1000).toFixed(0)}k</div>
                            <div className={`text-xs flex items-center gap-1 justify-end ${
                              store.growth > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {store.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {Math.abs(store.growth).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Customer Segments */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Customer Segments</h3>
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    
                    <div className="space-y-3">
                      {customerSegments.map((segment, index) => (
                        <div key={segment.segment}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-700">{segment.segment}</span>
                            <span className="text-sm font-medium text-gray-900">{segment.value}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${segment.value}%`,
                                background: `linear-gradient(to right, ${Object.values(COLORS)[index]}, ${Object.values(COLORS)[index]}dd)`
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">R{(segment.revenue / 1000000).toFixed(1)}M revenue</span>
                            <span className="text-xs text-gray-500">R{segment.avgSpend} avg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Real-time Activity */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Live Activity</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-500">Real-time</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {realtimeActivities.map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className={`p-2 rounded-lg ${
                            activity.status === 'completed' ? 'bg-green-100' :
                            activity.status === 'warning' ? 'bg-yellow-100' :
                            activity.status === 'error' ? 'bg-red-100' :
                            activity.status === 'success' ? 'bg-purple-100' :
                            'bg-blue-100'
                          }`}>
                            {activity.type === 'sale' && <ShoppingBag className={`w-4 h-4 ${
                              activity.status === 'completed' ? 'text-green-600' : 'text-gray-600'
                            }`} />}
                            {activity.type === 'alert' && <AlertCircle className={`w-4 h-4 ${
                              activity.status === 'warning' ? 'text-yellow-600' :
                              activity.status === 'error' ? 'text-red-600' : 'text-gray-600'
                            }`} />}
                            {activity.type === 'milestone' && <Award className="w-4 h-4 text-purple-600" />}
                            {activity.type === 'review' && <Star className="w-4 h-4 text-blue-600" />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">
                              {activity.type === 'sale' && (
                                <>Sale: R{activity.amount} - {activity.product}</>
                              )}
                              {activity.type === 'alert' && activity.message}
                              {activity.type === 'milestone' && activity.message}
                              {activity.type === 'review' && (
                                <>{activity.rating}⭐ "{activity.comment}"</>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {activity.store} • {activity.time}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Alerts & Actions */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Needs Attention</h3>
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    </div>
                    
                    <div className="space-y-3">
                      {needsAttention.map((store, index) => (
                        <div key={store.id} className="p-3 bg-red-50 rounded-xl border border-red-200">
                          <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{store.name}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                Revenue down {Math.abs(store.growth).toFixed(1)}% • Conversion: {store.conversion}%
                              </div>
                              <button className="text-xs text-red-600 hover:text-red-700 mt-2 font-medium">
                                View Details →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Bottom Analytics Section - Fixed spacing */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Hourly Traffic */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Today's Traffic</h3>
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyData.filter((_, i) => i % 2 === 0)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="hour" stroke="#6b7280" fontSize={10} />
                        <YAxis stroke="#6b7280" fontSize={10} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="customers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Morning</p>
                      <p className="text-sm font-semibold text-gray-900">2.3k</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Afternoon</p>
                      <p className="text-sm font-semibold text-gray-900">4.1k</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Evening</p>
                      <p className="text-sm font-semibold text-gray-900">3.8k</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Weekly Trends */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Weekly Trends</h3>
                    <TrendIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={weeklyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={10} />
                        <YAxis stroke="#6b7280" fontSize={10} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                        <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Peak Day</span>
                    <span className="text-sm font-semibold text-gray-900">Saturday</span>
                  </div>
                </motion.div>
                
                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Quick Stats</h3>
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Eye className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Page Views</p>
                          <p className="text-sm font-semibold text-gray-900">284.5k</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600">+12%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Target className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Target Progress</p>
                          <p className="text-sm font-semibold text-gray-900">87.3%</p>
                        </div>
                      </div>
                      <span className="text-xs text-yellow-600">On Track</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Package className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Stock Level</p>
                          <p className="text-sm font-semibold text-gray-900">Good</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600">92%</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
          
          {/* Map View */}
          {viewMode === 'map' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative"
              style={{ height: '800px' }}
            >
              <div className="w-full h-full">
                <Map
                  {...mapViewState}
                  onMove={(evt: any) => setMapViewState(evt.viewState)}
                  mapStyle="mapbox://styles/mapbox/light-v11"
                  mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
                  style={{ width: '100%', height: '100%' }}
                  reuseMaps
                  preserveDrawingBuffer={true}
                >
                  <NavigationControl position="top-right" style={{ marginTop: 10, marginRight: 10 }} />
                  <GeolocateControl position="top-right" style={{ marginTop: 50, marginRight: 10 }} />
                  
                  {filteredStores.map(store => (
                    <Marker
                      key={store.id}
                      longitude={store.coordinates.lng}
                      latitude={store.coordinates.lat}
                      anchor="center"
                    >
                      <div 
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedStore(store)
                        }}
                        className={`p-2 rounded-full cursor-pointer transform hover:scale-110 transition-transform shadow-lg ${
                          store.status === 'excellent' ? 'bg-green-500' :
                          store.status === 'good' ? 'bg-blue-500' :
                          store.status === 'average' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                      >
                        <Store className="w-4 h-4 text-white" />
                      </div>
                    </Marker>
                  ))}
                </Map>
              </div>
              
              {/* Map Legend */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4" style={{ zIndex: 10 }}>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Store Performance</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full" />
                    <span className="text-xs text-gray-600">Excellent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                    <span className="text-xs text-gray-600">Good</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                    <span className="text-xs text-gray-600">Average</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                    <span className="text-xs text-gray-600">Needs Attention</span>
                  </div>
                </div>
              </div>
              
              {/* Store Info Sidebar */}
              {selectedStore && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 w-80" style={{ zIndex: 10, marginRight: '50px' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedStore.name}</h3>
                      <p className="text-sm text-gray-600">{selectedStore.city}, {selectedStore.province}</p>
                    </div>
                    <button
                      onClick={() => setSelectedStore(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="text-sm font-semibold text-gray-900">R{(selectedStore.revenue / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Customers</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedStore.customers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Growth</span>
                      <span className={`text-sm font-semibold ${
                        selectedStore.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedStore.growth > 0 ? '+' : ''}{selectedStore.growth.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-900">{selectedStore.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
                      View Full Details
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Analytics View */}
          {viewMode === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6">Conversion Funnel</h2>
                <div className="space-y-3">
                  {performanceMetrics.conversionFunnel.map((stage, index) => (
                    <div key={stage.stage}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">{stage.stage}</span>
                        <span className="text-sm font-medium text-gray-900">{stage.value.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(stage.value / performanceMetrics.conversionFunnel[0].value) * 100}%`,
                            backgroundColor: stage.fill
                          }}
                        />
                      </div>
                      {index < performanceMetrics.conversionFunnel.length - 1 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Conversion: {((performanceMetrics.conversionFunnel[index + 1].value / stage.value) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Performance Radar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6">Performance Metrics</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={performanceMetrics.performanceRadar}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#e5e7eb" />
                      <Radar name="Current" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                      <Radar name="Previous" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              {/* Year Over Year */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-2"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6">Year Over Year Comparison</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={performanceMetrics.yearOverYear}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="lastYear" name="Last Year" fill="#e5e7eb" />
                      <Bar dataKey="thisYear" name="This Year" fill="#8b5cf6" />
                      <Line type="monotone" dataKey="growth" name="Growth %" stroke="#10b981" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Store Details Modal */}
          <AnimatePresence>
            {selectedStore && !showComparison && viewMode === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                onClick={() => setSelectedStore(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 max-w-4xl w-full border border-gray-200 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedStore.name}</h2>
                      <p className="text-gray-600">{selectedStore.city}, {selectedStore.province}</p>
                    </div>
                    <button
                      onClick={() => setSelectedStore(null)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-500 mb-1">Revenue</div>
                      <div className="text-xl font-bold text-gray-900">R{(selectedStore.revenue / 1000).toFixed(0)}k</div>
                      <div className={`text-xs mt-1 flex items-center gap-1 ${
                        selectedStore.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedStore.growth > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(selectedStore.growth).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-500 mb-1">Customers</div>
                      <div className="text-xl font-bold text-gray-900">{(selectedStore.customers / 1000).toFixed(1)}k</div>
                      <div className="text-xs text-gray-400 mt-1">Daily avg</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-500 mb-1">Conversion</div>
                      <div className="text-xl font-bold text-gray-900">{selectedStore.conversion}%</div>
                      <div className="text-xs text-gray-400 mt-1">Industry avg: 12%</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-500 mb-1">Rating</div>
                      <div className="text-xl font-bold text-gray-900 flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        {selectedStore.rating}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">243 reviews</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Store Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Manager</span>
                          <span className="text-gray-900">{selectedStore.manager}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Staff Count</span>
                          <span className="text-gray-900">{selectedStore.staff}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Store Size</span>
                          <span className="text-gray-900">{selectedStore.sqMeters}m²</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Revenue/m²</span>
                          <span className="text-gray-900">R{selectedStore.revenuePerSqm}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Opening Hours</span>
                          <span className="text-gray-900">{selectedStore.openingHours}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2.5 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors text-sm font-medium text-left">
                          View Detailed Analytics
                        </button>
                        <button className="w-full px-4 py-2.5 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors text-sm font-medium text-left">
                          Compare with Similar Stores
                        </button>
                        <button className="w-full px-4 py-2.5 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors text-sm font-medium text-left">
                          Download Store Report
                        </button>
                        <button className="w-full px-4 py-2.5 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors text-sm font-medium text-left">
                          Contact Store Manager
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default StoreAnalyticsV4