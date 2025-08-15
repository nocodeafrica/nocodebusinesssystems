'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import MobileMapOverlay, { MiniLocationCard } from '../mobile/MobileMapOverlay'
import MapWrapper from '../MapWrapper'

// Conditionally import map components only on client
let Map: any, Marker: any, Source: any, Layer: any, NavigationControl: any, ScaleControl: any, Popup: any

if (typeof window !== 'undefined') {
  const mapgl = require('react-map-gl/mapbox')
  Map = mapgl.default
  Marker = mapgl.Marker
  Source = mapgl.Source
  Layer = mapgl.Layer
  NavigationControl = mapgl.NavigationControl
  ScaleControl = mapgl.ScaleControl
  Popup = mapgl.Popup
}
import { 
  Search,
  MapPin,
  Users,
  Building2,
  Home,
  School,
  Hospital,
  TrendingUp,
  ChevronRight,
  X,
  Filter,
  Layers,
  ZoomIn,
  BarChart3,
  Activity,
  DollarSign,
  GraduationCap,
  Heart,
  Target
} from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'


// Major South African cities
const majorCities = [
  {
    id: 'JHB',
    name: 'Johannesburg',
    province: 'Gauteng',
    coordinates: [28.0473, -26.2041],
    population: 5635000,
    description: 'Economic hub of Africa',
    image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=400&h=250&fit=crop',
    attractions: ['Gold Reef City', 'Apartheid Museum', 'Constitution Hill', 'Sandton City'],
    economy: 'Finance, Mining, Technology'
  },
  {
    id: 'CPT',
    name: 'Cape Town',
    province: 'Western Cape',
    coordinates: [18.4241, -33.9249],
    population: 4618000,
    description: 'Mother City and tourist paradise',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=250&fit=crop',
    attractions: ['Table Mountain', 'V&A Waterfront', 'Robben Island', 'Kirstenbosch'],
    economy: 'Tourism, Finance, Technology'
  },
  {
    id: 'PTA',
    name: 'Pretoria',
    province: 'Gauteng',
    coordinates: [28.1881, -25.7461],
    population: 2473000,
    description: 'Administrative capital',
    image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=400&h=250&fit=crop',
    attractions: ['Union Buildings', 'Voortrekker Monument', 'Freedom Park', 'Pretoria Zoo'],
    economy: 'Government, Education, Research'
  },
  {
    id: 'DBN',
    name: 'Durban',
    province: 'KwaZulu-Natal',
    coordinates: [31.0218, -29.8587],
    population: 3956000,
    description: 'Busiest port in Africa',
    image: 'https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?w=400&h=250&fit=crop',
    attractions: ['uShaka Marine World', 'Golden Mile', 'Moses Mabhida Stadium', 'Valley of 1000 Hills'],
    economy: 'Shipping, Manufacturing, Tourism'
  },
  {
    id: 'PE',
    name: 'Port Elizabeth',
    province: 'Eastern Cape',
    coordinates: [25.6022, -33.9608],
    population: 1152000,
    description: 'Friendly City',
    image: 'https://images.unsplash.com/photo-1496497243327-9dccd845c35f?w=400&h=250&fit=crop',
    attractions: ['Bayworld', 'Donkin Reserve', 'Boardwalk', 'Addo Elephant Park'],
    economy: 'Automotive, Tourism, Manufacturing'
  },
  {
    id: 'EL',
    name: 'East London',
    province: 'Eastern Cape',
    coordinates: [27.9116, -32.9943],
    population: 478000,
    description: 'Buffalo City',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=250&fit=crop',
    attractions: ['East London Museum', 'Nahoon Beach', 'Gonubie Beach', 'Inkwenkwezi'],
    economy: 'Manufacturing, Automotive, Tourism'
  },
  {
    id: 'BFN',
    name: 'Bloemfontein',
    province: 'Free State',
    coordinates: [26.2128, -29.1217],
    population: 556000,
    description: 'City of Roses',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4a0e1b4a?w=400&h=250&fit=crop',
    attractions: ['Naval Hill', 'Oliewenhuis Art Museum', 'Free State Stadium', 'Loch Logan Waterfront'],
    economy: 'Judiciary, Education, Agriculture'
  },
  {
    id: 'KMB',
    name: 'Kimberley',
    province: 'Northern Cape',
    coordinates: [24.7661, -28.7382],
    population: 253000,
    description: 'Diamond City',
    image: 'https://images.unsplash.com/photo-1540270776932-e72e7c2d11cd?w=400&h=250&fit=crop',
    attractions: ['Big Hole', 'Kimberley Mine Museum', 'McGregor Museum', 'Flamingo Casino'],
    economy: 'Mining, Tourism, Agriculture'
  },
  {
    id: 'PMB',
    name: 'Pietermaritzburg',
    province: 'KwaZulu-Natal',
    coordinates: [30.3794, -29.6006],
    population: 679000,
    description: 'City of Choice',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=250&fit=crop',
    attractions: ['KwaZulu-Natal Museum', 'Butterflies for Africa', 'Tatham Art Gallery', 'Comrades Marathon'],
    economy: 'Education, Government, Manufacturing'
  },
  {
    id: 'PLK',
    name: 'Polokwane',
    province: 'Limpopo',
    coordinates: [29.4486, -23.9045],
    population: 798000,
    description: 'Place of Safety',
    image: 'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=400&h=250&fit=crop',
    attractions: ['Polokwane Game Reserve', 'Bakone Malapa Museum', 'Mall of the North', 'Peter Mokaba Stadium'],
    economy: 'Agriculture, Mining, Retail'
  },
  {
    id: 'MFK',
    name: 'Mahikeng',
    province: 'North West',
    coordinates: [25.6422, -25.8642],
    population: 291000,
    description: 'Capital of North West',
    image: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400&h=250&fit=crop',
    attractions: ['Mafikeng Game Reserve', 'Lotlamoreng Cultural Village', 'Mmabatho Stadium', 'Botsalano Game Reserve'],
    economy: 'Government, Agriculture, Tourism'
  },
  {
    id: 'GRG',
    name: 'George',
    province: 'Western Cape',
    coordinates: [22.4502, -33.9639],
    population: 217000,
    description: 'Heart of the Garden Route',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    attractions: ['Outeniqua Mountains', 'George Golf Club', 'Garden Route Dam', 'Victoria Bay'],
    economy: 'Tourism, Timber, Agriculture'
  }
]

// Meaningful SA administrative data
const saAdminData = {
  provinces: [
    {
      id: 'WC',
      name: 'Western Cape',
      capital: 'Cape Town',
      population: 7113776,
      area: 129462,
      gdp: 681.9,
      unemployment: 20.9,
      coordinates: [20.5, -33.5],
      demographics: {
        urban: 95.1,
        rural: 4.9,
        languages: { afrikaans: 49.7, english: 20.3, xhosa: 24.7 }
      },
      infrastructure: {
        schools: 1518,
        hospitals: 58,
        clinics: 385,
        universities: 4
      },
      economy: {
        sectors: { services: 72, manufacturing: 16, agriculture: 4 },
        growth: 1.2
      },
      districts: 6,
      municipalities: 30
    },
    {
      id: 'GP',
      name: 'Gauteng',
      capital: 'Johannesburg',
      population: 15810388,
      area: 18178,
      gdp: 1492.3,
      unemployment: 32.6,
      coordinates: [28.0, -26.0],
      demographics: {
        urban: 97.4,
        rural: 2.6,
        languages: { zulu: 19.8, english: 13.3, afrikaans: 12.4 }
      },
      infrastructure: {
        schools: 2805,
        hospitals: 34,
        clinics: 420,
        universities: 6
      },
      economy: {
        sectors: { services: 75, manufacturing: 20, mining: 3 },
        growth: 0.8
      },
      districts: 5,
      municipalities: 11
    },
    {
      id: 'KZN',
      name: 'KwaZulu-Natal',
      capital: 'Pietermaritzburg',
      population: 11531628,
      area: 94361,
      gdp: 703.8,
      unemployment: 23.0,
      coordinates: [31.0, -29.0],
      demographics: {
        urban: 54.4,
        rural: 45.6,
        languages: { zulu: 77.8, english: 13.2, afrikaans: 1.6 }
      },
      infrastructure: {
        schools: 5997,
        hospitals: 72,
        clinics: 615,
        universities: 4
      },
      economy: {
        sectors: { services: 68, manufacturing: 22, agriculture: 5 },
        growth: 0.5
      },
      districts: 11,
      municipalities: 54
    },
    {
      id: 'EC',
      name: 'Eastern Cape',
      capital: 'Bhisho',
      population: 6676590,
      area: 168966,
      gdp: 379.4,
      unemployment: 42.6,
      coordinates: [26.5, -32.0],
      demographics: {
        urban: 42.5,
        rural: 57.5,
        languages: { xhosa: 78.8, afrikaans: 10.5, english: 5.6 }
      },
      infrastructure: {
        schools: 5738,
        hospitals: 91,
        clinics: 820,
        universities: 4
      },
      economy: {
        sectors: { services: 72, manufacturing: 15, agriculture: 8 },
        growth: -0.3
      },
      districts: 8,
      municipalities: 39
    },
    {
      id: 'FS',
      name: 'Free State',
      capital: 'Bloemfontein',
      population: 2928903,
      area: 129825,
      gdp: 252.7,
      unemployment: 32.7,
      coordinates: [26.5, -28.5],
      demographics: {
        urban: 77.9,
        rural: 22.1,
        languages: { sesotho: 64.2, afrikaans: 12.7, xhosa: 7.5 }
      },
      infrastructure: {
        schools: 1332,
        hospitals: 32,
        clinics: 247,
        universities: 2
      },
      economy: {
        sectors: { services: 62, mining: 20, agriculture: 10 },
        growth: -0.8
      },
      districts: 5,
      municipalities: 23
    },
    {
      id: 'NW',
      name: 'North West',
      capital: 'Mahikeng',
      population: 4108816,
      area: 104882,
      gdp: 244.8,
      unemployment: 31.0,
      coordinates: [25.5, -26.5],
      demographics: {
        urban: 38.9,
        rural: 61.1,
        languages: { tswana: 63.4, afrikaans: 9.0, xhosa: 5.5 }
      },
      infrastructure: {
        schools: 1597,
        hospitals: 21,
        clinics: 332,
        universities: 1
      },
      economy: {
        sectors: { mining: 40, services: 45, agriculture: 8 },
        growth: -1.2
      },
      districts: 4,
      municipalities: 22
    },
    {
      id: 'MP',
      name: 'Mpumalanga',
      capital: 'Mbombela',
      population: 4679786,
      area: 76495,
      gdp: 282.3,
      unemployment: 30.8,
      coordinates: [30.0, -26.0],
      demographics: {
        urban: 45.5,
        rural: 54.5,
        languages: { siswati: 27.7, zulu: 24.1, ndebele: 10.1 }
      },
      infrastructure: {
        schools: 1795,
        hospitals: 33,
        clinics: 301,
        universities: 1
      },
      economy: {
        sectors: { mining: 25, services: 55, agriculture: 12 },
        growth: 0.2
      },
      districts: 3,
      municipalities: 20
    },
    {
      id: 'LP',
      name: 'Limpopo',
      capital: 'Polokwane',
      population: 5982584,
      area: 125754,
      gdp: 259.2,
      unemployment: 21.1,
      coordinates: [29.0, -23.5],
      demographics: {
        urban: 13.3,
        rural: 86.7,
        languages: { sepedi: 52.9, tsonga: 17.0, venda: 16.7 }
      },
      infrastructure: {
        schools: 3896,
        hospitals: 40,
        clinics: 468,
        universities: 2
      },
      economy: {
        sectors: { mining: 30, services: 50, agriculture: 10 },
        growth: 0.7
      },
      districts: 5,
      municipalities: 27
    },
    {
      id: 'NC',
      name: 'Northern Cape',
      capital: 'Kimberley',
      population: 1292786,
      area: 372889,
      gdp: 92.8,
      unemployment: 27.1,
      coordinates: [22.0, -29.0],
      demographics: {
        urban: 77.7,
        rural: 22.3,
        languages: { afrikaans: 53.8, tswana: 33.1, xhosa: 5.3 }
      },
      infrastructure: {
        schools: 560,
        hospitals: 18,
        clinics: 146,
        universities: 1
      },
      economy: {
        sectors: { mining: 45, services: 40, agriculture: 7 },
        growth: -0.5
      },
      districts: 5,
      municipalities: 32
    }
  ]
}

const SAAdministrativeMapV3 = () => {
  const [viewLevel, setViewLevel] = useState<'country' | 'province' | 'municipality' | 'ward'>('country')
  const [selectedProvince, setSelectedProvince] = useState<typeof saAdminData.provinces[0] | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<any>(null)
  const [hoveredFeature, setHoveredFeature] = useState<any>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'economy' | 'infrastructure'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLayers, setShowLayers] = useState(false)
  const [geoData, setGeoData] = useState<any>({})
  const [dataLoaded, setDataLoaded] = useState(false)
  const [selectedCity, setSelectedCity] = useState<typeof majorCities[0] | null>(null)
  const [showCityPopup, setShowCityPopup] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const [viewState, setViewState] = useState({
    latitude: -28.5,
    longitude: 24.5,
    zoom: 5.5
  })

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load GeoJSON data
  useEffect(() => {
    const loadGeoData = async () => {
      try {
        // Load provinces by default
        const provincesResponse = await fetch('/data/provinces.json')
        if (!provincesResponse.ok) {
          console.error('Failed to fetch provinces:', provincesResponse.status)
          return
        }
        const provincesData = await provincesResponse.json()
        
        // Log province names from GeoJSON
        console.log('[DEBUG] Province names in GeoJSON:', 
          provincesData.features?.slice(0, 3).map((f: any) => ({
            PROVINCE: f.properties?.PROVINCE,
            NAME_1: f.properties?.NAME_1,
            allProps: Object.keys(f.properties || {})
          }))
        )
        
        setGeoData({
          provinces: provincesData,
          districts: null,
          municipalities: null
        })
        setDataLoaded(true)
      } catch (error) {
        console.error('Error loading GeoJSON data:', error)
      }
    }

    loadGeoData()
  }, [])

  // Load additional data based on view level
  useEffect(() => {
    const loadAdditionalData = async () => {
      if (viewLevel === 'province' && !geoData.districts) {
        try {
          const response = await fetch('/data/districts.json')
          const data = await response.json()
          setGeoData((prev: any) => ({ ...prev, districts: data }))
        } catch (error) {
          console.error('Error loading districts:', error)
        }
      }
      
      if (viewLevel === 'municipality' && !geoData.municipalities) {
        try {
          const response = await fetch('/data/municipalities.json')
          const data = await response.json()
          setGeoData((prev: any) => ({ ...prev, municipalities: data }))
        } catch (error) {
          console.error('Error loading municipalities:', error)
        }
      }

      if (viewLevel === 'ward' && !geoData.wards) {
        try {
          const response = await fetch('/data/wards.json')
          const data = await response.json()
          setGeoData((prev: any) => ({ ...prev, wards: data }))
        } catch (error) {
          console.error('Error loading wards:', error)
        }
      }
    }

    loadAdditionalData()
  }, [viewLevel, geoData])

  // Filter provinces based on search
  const filteredProvinces = useMemo(() => {
    if (!searchQuery) return saAdminData.provinces
    return saAdminData.provinces.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.capital.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  // Handle province selection - stays in country view
  const handleProvinceClick = (province: typeof saAdminData.provinces[0], featureId?: string) => {
    console.log('[DEBUG] handleProvinceClick called:', {
      provinceName: province.name,
      featureId: featureId,
      settingSelectedId: featureId || province.name
    })
    setSelectedProvince(province)
    // Use the provided featureId or province name
    setSelectedId(featureId || province.name)
    // Stay in country view - don't change the view level
    // Just zoom in slightly to focus on the province
    setViewState({
      latitude: province.coordinates[1],
      longitude: province.coordinates[0],
      zoom: isMobile ? 6 : 6.5
    })
  }

  // Handle feature click on map
  const handleMapClick = (event: any) => {
    if (event.features && event.features.length > 0) {
      const feature = event.features[0]
      const layerId = feature.layer?.id
      
      if (layerId === 'provinces-fill' && viewLevel === 'country') {
        // Handle province click in country view
        // The GeoJSON uses ADM1_EN for province names
        const provinceName = feature.properties?.ADM1_EN || feature.properties?.PROVINCE || feature.properties?.NAME_1
        
        const matchingProvince = saAdminData.provinces.find(p => 
          p.name.toLowerCase() === provinceName?.toLowerCase() ||
          p.name.toLowerCase().includes(provinceName?.toLowerCase()) ||
          provinceName?.toLowerCase().includes(p.name.toLowerCase())
        )
        
        if (matchingProvince) {
          setSelectedFeature(feature)
          // Use the exact province name from GeoJSON for matching
          setSelectedId(provinceName)
          setSelectedProvince(matchingProvince)
          // Stay in country view, just focus on the province
          setViewState({
            latitude: matchingProvince.coordinates[1],
            longitude: matchingProvince.coordinates[0],
            zoom: isMobile ? 6 : 6.5
          })
        }
      } else if (layerId === 'districts-fill' && viewLevel === 'province') {
        // Handle district click in province view
        setSelectedFeature(feature)
        setSelectedId(feature.properties?.NAME_2 || feature.id?.toString())
      } else if (layerId === 'municipalities-fill' && viewLevel === 'province') {
        // Handle municipality click in province view
        setSelectedFeature(feature)
        setSelectedId(feature.properties?.NAME_3 || feature.id?.toString())
      } else if (layerId === 'wards-fill' && viewLevel === 'municipality') {
        // Handle ward click in municipality view
        setSelectedFeature(feature)
        setSelectedId(feature.properties?.NAME_4 || feature.id?.toString())
      }
    }
  }

  // Handle hover
  const handleMapHover = (event: any) => {
    if (event.features && event.features.length > 0) {
      const feature = event.features[0]
      setHoveredFeature(feature)
      // Set hovered ID based on the feature properties - use ADM1_EN for provinces
      const hoverId = feature.properties?.ADM1_EN || feature.properties?.NAME_1 || feature.properties?.PROVINCE || 
                      feature.properties?.NAME_2 || feature.properties?.NAME_3 || 
                      feature.properties?.NAME_4 || feature.properties?.name
      setHoveredId(hoverId)
    } else {
      setHoveredFeature(null)
      setHoveredId(null)
    }
  }

  // Format numbers
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Get fill color based on data
  const getFillColor = (feature: any) => {
    if (selectedFeature && selectedFeature.properties?.NAME_1 === feature.properties?.NAME_1) {
      return '#3b82f6' // Blue for selected
    }
    if (hoveredFeature && hoveredFeature.properties?.NAME_1 === feature.properties?.NAME_1) {
      return '#60a5fa' // Light blue for hover
    }
    
    // Color based on unemployment rate (example)
    const provinceName = feature.properties?.PROVINCE || feature.properties?.NAME_1
    const province = saAdminData.provinces.find(p => 
      p.name.toLowerCase() === provinceName?.toLowerCase()
    )
    
    if (province) {
      if (province.unemployment < 25) return '#10b981' // Green
      if (province.unemployment < 35) return '#f59e0b' // Yellow
      return '#ef4444' // Red
    }
    
    return '#6b7280' // Default gray
  }

  // Handle city click
  const handleCityClick = (city: typeof majorCities[0]) => {
    setSelectedCity(city)
    setShowCityPopup(true)
    setViewState({
      latitude: city.coordinates[1],
      longitude: city.coordinates[0],
      zoom: isMobile ? 8.5 : 10
    })
  }

  // Removed unused functions - using getProvincePaint instead

  // Layer styles - use useMemo to ensure they update when selectedId changes
  const provinceLayer = useMemo(() => {
    // Only apply highlighting in country view
    if (viewLevel !== 'country') {
      return {
        id: 'provinces-fill',
        type: 'fill' as const,
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.6
        }
      }
    }
    
    // Simple conditional expression for province colors
    let fillColor: any = '#3b82f6' // Default blue
    let fillOpacity: any = 0.6
    
    if (selectedId) {
      console.log('[DEBUG] Creating layer with selectedId:', selectedId)
      // When a province is selected, use conditional coloring
      // The GeoJSON uses ADM1_EN for province names
      fillColor = [
        'case',
        ['==', ['get', 'ADM1_EN'], selectedId],
        '#f59e0b', // Orange for selected
        '#d1d5db'  // Gray for non-selected
      ]
      
      fillOpacity = [
        'case',
        ['==', ['get', 'ADM1_EN'], selectedId],
        0.8,
        0.3
      ]
    }
    
    return {
      id: 'provinces-fill',
      type: 'fill' as const,
      paint: {
        'fill-color': fillColor,
        'fill-opacity': fillOpacity
      }
    }
  }, [selectedId, viewLevel])

  const provinceOutlineLayer = useMemo(() => ({
    id: 'provinces-outline',
    type: 'line' as const,
    paint: {
      'line-color': selectedId ? 
        ['case', 
          ['==', ['get', 'ADM1_EN'], selectedId], 
          '#ea580c', 
          '#4b5563'
        ] : 
        '#4b5563',
      'line-width': selectedId ? 
        ['case', 
          ['==', ['get', 'ADM1_EN'], selectedId], 
          3, 
          1
        ] : 
        1
    }
  }), [selectedId])

  // Mobile layout
  if (isMobile) {
    // Create mini cards for provinces and cities
    const locationCards = [
      ...saAdminData.provinces.map(province => ({
        key: province.id,
        element: (
          <MiniLocationCard
            title={province.name}
            subtitle={`${province.population.toLocaleString()} people`}
            distance={`${province.municipalities} municipalities`}
            status="open"
            onClick={() => {
              setSelectedProvince(province)
              setViewState({
                latitude: province.coordinates[1],
              longitude: province.coordinates[0],
              zoom: 6
            })
            }}
            isSelected={selectedProvince?.id === province.id}
          />
        )
      })),
      ...majorCities.map(city => ({
        key: city.id,
        element: (
          <MiniLocationCard
            title={city.name}
            subtitle={city.province}
            distance={`${(city.population / 1000000).toFixed(1)}M people`}
            status="busy"
            onClick={() => {
              setSelectedCity(city)
              setViewState({
                latitude: city.coordinates[1],
                longitude: city.coordinates[0],
                zoom: 9
              })
            }}
            isSelected={selectedCity?.id === city.id}
          />
        )
      }))
    ]

    // Selected content
    const selectedContent = (selectedProvince || selectedCity) ? (
      <div className="space-y-4">
        {/* Province Info */}
        {selectedProvince && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedProvince.name}</h3>
                <p className="text-sm text-gray-500">Capital: {selectedProvince.capital}</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Province
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Users className="w-3 h-3" />
                  <span>Population</span>
                </div>
                <p className="text-sm font-semibold">{(selectedProvince.population / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Building2 className="w-3 h-3" />
                  <span>Municipalities</span>
                </div>
                <p className="text-sm font-semibold">{selectedProvince.municipalities}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>Area</span>
                </div>
                <p className="text-sm font-semibold">{(selectedProvince.area / 1000).toFixed(0)}k km²</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Growth</span>
                </div>
                <p className="text-sm font-semibold">+2.3%</p>
              </div>
            </div>
          </div>
        )}

        {/* City Info */}
        {selectedCity && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedCity.name}</h3>
                <p className="text-sm text-gray-500">{selectedCity.province}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                City
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{selectedCity.description}</p>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Users className="w-3 h-3" />
                  <span>Population</span>
                </div>
                <p className="text-sm font-semibold">{(selectedCity.population / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <DollarSign className="w-3 h-3" />
                  <span>Economy</span>
                </div>
                <p className="text-xs font-medium">{selectedCity.economy.split(',')[0]}</p>
              </div>
            </div>
          </div>
        )}

        {/* View Level Switcher */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setViewLevel('country')}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                viewLevel === 'country' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Country
            </button>
            <button
              onClick={() => setViewLevel('province')}
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                viewLevel === 'province' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Provinces
            </button>
          </div>
        </div>
      </div>
    ) : null

    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg h-[700px] relative">
        {/* Mobile Header with Controls */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">SA Regions</h2>
              <p className="text-xs text-gray-500">Administrative boundaries</p>
            </div>
            <button
              onClick={() => setShowLayers(!showLayers)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Layers className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* View Level Selector */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-3">
            {['country', 'province', 'district', 'municipality'].map(level => (
              <button
                key={level}
                onClick={() => {
                  setViewLevel(level as any)
                  // Reset selection when changing view level
                  if (level === 'country') {
                    setSelectedId(null)
                    setSelectedFeature(null)
                    setSelectedProvince(null)
                    setSelectedCity(null)
                    setViewState({ latitude: -28.5, longitude: 24.5, zoom: 5.5 })
                  }
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition-all ${
                  viewLevel === level 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {level === 'municipality' ? 'munic.' : level}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search regions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <MobileMapOverlay
          miniCards={locationCards.map((card, index) => (
            <div key={`${card.key}-${index}`}>{card.element}</div>
          ))}
          selectedContent={selectedContent}
          hasSelection={!!(selectedProvince || selectedCity)}
          headerHeight="180px"
        >
          {/* Map */}
          <MapWrapper>
            {Map && (
              <Map
            {...viewState}
            onMove={(evt: any) => setViewState(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
            interactiveLayerIds={['provinces-fill', 'districts-fill-mobile', 'municipalities-fill-mobile', 'wards-fill-mobile']}
            onClick={handleMapClick}
          >
            <NavigationControl position="top-right" />
            
            {/* Province boundaries - match desktop highlighting logic */}
            {viewLevel === 'country' && dataLoaded && geoData.provinces && (
              <Source type="geojson" data={geoData.provinces}>
                <Layer {...provinceLayer} />
                <Layer {...provinceOutlineLayer} />
              </Source>
            )}

            {/* District boundaries (when in province view) */}
            {viewLevel === 'province' && geoData.districts && (
              <Source type="geojson" data={geoData.districts}>
                <Layer
                  id="districts-fill-mobile"
                  type="fill"
                  paint={{
                    'fill-color': [
                      'case',
                      ['==', ['get', 'NAME_2'], selectedId || ''],
                      '#f59e0b', // Orange for selected district
                      '#60a5fa'  // Default blue
                    ],
                    'fill-opacity': [
                      'case',
                      ['==', ['get', 'NAME_2'], selectedId || ''],
                      0.7,
                      0.4
                    ]
                  }}
                />
                <Layer
                  id="districts-outline-mobile"
                  type="line"
                  paint={{
                    'line-color': [
                      'case',
                      ['==', ['get', 'NAME_2'], selectedId || ''],
                      '#ea580c',
                      '#2563eb'
                    ],
                    'line-width': [
                      'case',
                      ['==', ['get', 'NAME_2'], selectedId || ''],
                      2,
                      1
                    ]
                  }}
                />
              </Source>
            )}

            {/* Municipality boundaries (when in province view) */}
            {viewLevel === 'province' && geoData.municipalities && (
              <Source type="geojson" data={geoData.municipalities}>
                <Layer
                  id="municipalities-fill-mobile"
                  type="fill"
                  paint={{
                    'fill-color': [
                      'case',
                      ['==', ['get', 'NAME_3'], selectedId || ''],
                      '#10b981', // Green for selected municipality
                      '#60a5fa'  // Default blue
                    ],
                    'fill-opacity': [
                      'case',
                      ['==', ['get', 'NAME_3'], selectedId || ''],
                      0.7,
                      0.4
                    ]
                  }}
                />
                <Layer
                  id="municipalities-outline-mobile"
                  type="line"
                  paint={{
                    'line-color': [
                      'case',
                      ['==', ['get', 'NAME_3'], selectedId || ''],
                      '#059669',
                      '#2563eb'
                    ],
                    'line-width': [
                      'case',
                      ['==', ['get', 'NAME_3'], selectedId || ''],
                      2,
                      1
                    ]
                  }}
                />
              </Source>
            )}

            {/* Ward boundaries (when in municipality view) */}
            {viewLevel === 'municipality' && geoData.wards && (
              <Source type="geojson" data={geoData.wards}>
                <Layer
                  id="wards-fill-mobile"
                  type="fill"
                  paint={{
                    'fill-color': [
                      'case',
                      ['==', ['get', 'WARD'], selectedId || ''],
                      '#8b5cf6', // Purple for selected ward
                      '#60a5fa'  // Default blue
                    ],
                    'fill-opacity': [
                      'case',
                      ['==', ['get', 'WARD'], selectedId || ''],
                      0.7,
                      0.4
                    ]
                  }}
                />
                <Layer
                  id="wards-outline-mobile"
                  type="line"
                  paint={{
                    'line-color': [
                      'case',
                      ['==', ['get', 'WARD'], selectedId || ''],
                      '#7c3aed',
                      '#2563eb'
                    ],
                    'line-width': [
                      'case',
                      ['==', ['get', 'WARD'], selectedId || ''],
                      2,
                      1
                    ]
                  }}
                />
              </Source>
            )}

            {/* City markers */}
            {majorCities.map(city => (
              <Marker
                key={city.id}
                longitude={city.coordinates[0]}
                latitude={city.coordinates[1]}
                onClick={() => {
                  setSelectedCity(city)
                  setShowCityPopup(true)
                }}
              >
                <div className="relative cursor-pointer">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    selectedCity?.id === city.id ? 'bg-blue-500' : 'bg-white'
                  }`}>
                    <Building2 className={`w-5 h-5 ${
                      selectedCity?.id === city.id ? 'text-white' : 'text-gray-700'
                    }`} />
                  </div>
                  {selectedCity?.id === city.id && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md">
                      <p className="text-xs font-medium text-gray-900 whitespace-nowrap">{city.name}</p>
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
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg" style={{ height: '900px' }}>
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-[420px] bg-white border-r border-gray-100 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">South African Regions</h2>
                <p className="text-sm text-gray-500 mt-1">Administrative boundaries & data</p>
              </div>
              <button
                onClick={() => setShowLayers(!showLayers)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Layers className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* View Level Selector */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-3">
              {['country', 'province', 'district', 'municipality'].map(level => (
                <button
                  key={level}
                  onClick={() => {
                    setViewLevel(level as any)
                    // Reset selection when changing view level
                    if (level === 'country') {
                      setSelectedId(null)
                      setSelectedFeature(null)
                      setViewState({ latitude: -28.5, longitude: 24.5, zoom: 5.5 })
                    }
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium capitalize transition-all ${
                    viewLevel === level 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search provinces, cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {viewLevel === 'country' && (
              <div className="p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Provinces</h3>
                <div className="space-y-2">
                  {filteredProvinces.map(province => (
                    <motion.div
                      key={province.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        // Find the matching GeoJSON province name
                        if (geoData.provinces?.features) {
                          const matchingFeature = geoData.provinces.features.find((f: any) => {
                            const fname = f.properties?.ADM1_EN || f.properties?.PROVINCE || f.properties?.NAME_1
                            return fname && (
                              fname.toLowerCase() === province.name.toLowerCase() ||
                              fname.toLowerCase().includes(province.name.toLowerCase()) ||
                              province.name.toLowerCase().includes(fname.toLowerCase())
                            )
                          })
                          // Use ADM1_EN which is the actual property name in the GeoJSON
                          const geoJsonName = matchingFeature?.properties?.ADM1_EN || province.name
                          handleProvinceClick(province, geoJsonName)
                        } else {
                          // If GeoJSON not loaded, use province name directly
                          handleProvinceClick(province, province.name)
                        }
                      }}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        selectedProvince?.id === province.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{province.name}</h4>
                          <p className="text-sm text-gray-500">Capital: {province.capital}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 mt-0.5" />
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Population</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {(province.population / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">GDP</p>
                          <p className="text-sm font-semibold text-gray-900">
                            R{province.gdp.toFixed(0)}bn
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Unemployment</p>
                          <p className={`text-sm font-semibold ${
                            province.unemployment < 25 ? 'text-green-600' : 
                            province.unemployment < 35 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {province.unemployment}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {province.districts} districts
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {province.municipalities} municipalities
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {province.demographics.urban}% urban
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Show selected province details in country view */}
            {viewLevel === 'country' && selectedProvince && (
              <div className="p-5">
                <button
                  onClick={() => {
                    setSelectedId(null)
                    setSelectedProvince(null)
                    setSelectedFeature(null)
                    setHoveredFeature(null)
                    setHoveredId(null)
                    setViewState({ latitude: -28.5, longitude: 24.5, zoom: 5.5 })
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 mb-4"
                >
                  ← Clear Selection
                </button>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedProvince.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Provincial Capital: {selectedProvince.capital}</p>

                {/* Province Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Population</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatNumber(selectedProvince.population)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-gray-600">GDP</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      R{selectedProvince.gdp}bn
                    </p>
                  </div>
                </div>

                {/* Cities in this Province */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Major Cities</h4>
                  <div className="space-y-2">
                    {majorCities
                      .filter(city => city.province === selectedProvince.name)
                      .map(city => (
                        <div
                          key={city.id}
                          onClick={() => handleCityClick(city)}
                          className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{city.name}</p>
                              <p className="text-xs text-gray-500">{city.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {(city.population / 1000000).toFixed(1)}M
                              </p>
                              <p className="text-xs text-gray-500">population</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {viewLevel === 'municipality' && (
              <div className="p-5">
                <button
                  onClick={() => {
                    setViewLevel('province')
                    if (selectedProvince) {
                      setViewState({
                        latitude: selectedProvince.coordinates[1],
                        longitude: selectedProvince.coordinates[0],
                        zoom: 7
                      })
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 mb-4"
                >
                  ← Back to Province View
                </button>
                
                <h3 className="text-lg font-bold text-gray-900 mb-4">Municipalities</h3>
                <p className="text-sm text-gray-500 mb-4">Showing all municipalities</p>
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Municipality data will be displayed here</p>
                </div>
              </div>
            )}

            {/* Province view - show districts */}
            {viewLevel === 'province' && (
              <div className="p-5">
                <button
                  onClick={() => {
                    setViewLevel('country')
                    setSelectedId(null)
                    setSelectedFeature(null)
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 mb-4"
                >
                  ← Back to Country View
                </button>
                
                <h3 className="text-lg font-bold text-gray-900 mb-4">Districts</h3>
                <p className="text-sm text-gray-500 mb-4">Click on a district to select it</p>
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">District data will be displayed here</p>
                </div>
              </div>
            )}
            
            {/* District view - show municipalities */}
            {viewLevel === 'municipality' && (
              <div className="p-5">
                <button
                  onClick={() => {
                    setViewLevel('province')
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 mb-4"
                >
                  ← Back to Province View
                </button>
                
                <h3 className="text-lg font-bold text-gray-900 mb-4">Municipalities</h3>
                <p className="text-sm text-gray-500 mb-4">Click on a municipality to select it</p>
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Municipality data will be displayed here</p>
                </div>
              </div>
            )}
            
            {/* Municipality view - show wards */}
            {viewLevel === 'municipality' && (
              <div className="p-5">
                <button
                  onClick={() => {
                    setViewLevel('province')
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 mb-4"
                >
                  ← Back to District View
                </button>
                
                <h3 className="text-lg font-bold text-gray-900 mb-4">Wards</h3>
                <p className="text-sm text-gray-500 mb-4">Click on a ward to select it</p>
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Ward data will be displayed here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapWrapper>
            {Map && (
              <Map
            {...viewState}
            onMove={(evt: any) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWZyb2NvZGVyeiIsImEiOiJjbTJjemdkZ3YwM3pxMnJzN3BkaHVnanZ1In0.SI6lhJMX0oderM2o9PmLww'}
            style={{ width: '100%', height: '100%' }}
            interactiveLayerIds={['provinces-fill', 'districts-fill', 'municipalities-fill', 'wards-fill']}
            onClick={handleMapClick}
            onMouseMove={handleMapHover}
            onMouseLeave={() => {
              setHoveredFeature(null)
              setHoveredId(null)
            }}
          >
            <NavigationControl position="top-right" />
            <ScaleControl position="bottom-right" />

            {/* Province boundaries - always visible in country view */}
            {viewLevel === 'country' && dataLoaded && geoData.provinces && (
              <Source type="geojson" data={geoData.provinces}>
                <Layer {...provinceLayer} />
                <Layer {...provinceOutlineLayer} />
              </Source>
            )}

            {/* District boundaries (when in province view) */}
            {viewLevel === 'province' && geoData.districts && (
              <Source type="geojson" data={geoData.districts}>
                <Layer
                  id="districts-fill"
                  type="fill"
                  paint={{
                    'fill-color': [
                      'case',
                      ['==', ['get', 'NAME_2'], selectedId || ''],
                      '#f59e0b', // Orange for selected district
                      ['==', ['get', 'NAME_2'], hoveredId || ''],
                      '#93c5fd', // Light blue on hover
                      '#60a5fa'  // Default blue
                    ],
                    'fill-opacity': [
                      'case',
                      ['==', ['get', 'NAME_2'], selectedId || ''],
                      0.7,
                      0.4
                    ]
                  }}
                />
                <Layer
                  id="districts-outline"
                  type="line"
                  paint={{
                    'line-color': [
                      'case',
                      ['==', ['get', 'NAME_2'], selectedId || ''],
                      '#ea580c',
                      '#2563eb'
                    ],
                    'line-width': [
                      'case',
                      ['==', ['get', 'NAME_2'], selectedId || ''],
                      2,
                      1
                    ]
                  }}
                />
              </Source>
            )}

            {/* Municipality boundaries (when in province view) */}
            {viewLevel === 'province' && geoData.municipalities && (
              <Source type="geojson" data={geoData.municipalities}>
                <Layer
                  id="municipalities-fill"
                  type="fill"
                  paint={{
                    'fill-color': [
                      'case',
                      ['==', ['get', 'NAME_3'], selectedId || ''],
                      '#f59e0b', // Orange for selected municipality
                      ['==', ['get', 'NAME_3'], hoveredId || ''],
                      '#c4b5fd', // Light purple on hover
                      '#a78bfa'  // Default purple
                    ],
                    'fill-opacity': [
                      'case',
                      ['==', ['get', 'NAME_3'], selectedId || ''],
                      0.7,
                      0.4
                    ]
                  }}
                />
                <Layer
                  id="municipalities-outline"
                  type="line"
                  paint={{
                    'line-color': [
                      'case',
                      ['==', ['get', 'NAME_3'], selectedId || ''],
                      '#ea580c',
                      '#7c3aed'
                    ],
                    'line-width': [
                      'case',
                      ['==', ['get', 'NAME_3'], selectedId || ''],
                      2,
                      1
                    ]
                  }}
                />
              </Source>
            )}

            {/* Ward boundaries (when in municipality view) */}
            {viewLevel === 'municipality' && geoData.wards && (
              <Source type="geojson" data={geoData.wards}>
                <Layer
                  id="wards-fill"
                  type="fill"
                  paint={{
                    'fill-color': [
                      'case',
                      ['==', ['get', 'NAME_4'], selectedId || ''],
                      '#dc2626', // Red for selected ward
                      ['==', ['get', 'NAME_4'], hoveredId || ''],
                      '#fde047', // Light yellow on hover
                      '#fbbf24'  // Default yellow
                    ],
                    'fill-opacity': [
                      'case',
                      ['==', ['get', 'NAME_4'], selectedId || ''],
                      0.6,
                      0.3
                    ]
                  }}
                />
                <Layer
                  id="wards-outline"
                  type="line"
                  paint={{
                    'line-color': [
                      'case',
                      ['==', ['get', 'NAME_4'], selectedId || ''],
                      '#b91c1c',
                      '#f59e0b'
                    ],
                    'line-width': [
                      'case',
                      ['==', ['get', 'NAME_4'], selectedId || ''],
                      1.5,
                      0.5
                    ]
                  }}
                />
              </Source>
            )}

            {/* City Markers - Always visible */}
            {majorCities.map(city => (
              <Marker
                key={city.id}
                longitude={city.coordinates[0]}
                latitude={city.coordinates[1]}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCityClick(city)
                  }}
                  className="relative cursor-pointer"
                >
                  {/* City marker */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white rounded-full opacity-75" />
                    <div className="relative px-2 py-1 bg-red-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {city.name}
                    </div>
                  </div>
                </motion.div>
              </Marker>
            ))}

            {/* City Popup */}
            {showCityPopup && selectedCity && (
              <Popup
                longitude={selectedCity.coordinates[0]}
                latitude={selectedCity.coordinates[1]}
                onClose={() => {
                  setShowCityPopup(false)
                  setSelectedCity(null)
                }}
                closeButton={false}
                className="city-popup"
                offset={25}
              >
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden" style={{ width: '320px' }}>
                  {/* City Image */}
                  <div className="relative h-32">
                    <img
                      src={selectedCity.image}
                      alt={selectedCity.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <button
                      onClick={() => {
                        setShowCityPopup(false)
                        setSelectedCity(null)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                    <div className="absolute bottom-3 left-4">
                      <h3 className="text-xl font-bold text-white">{selectedCity.name}</h3>
                      <p className="text-sm text-white/80">{selectedCity.province}</p>
                    </div>
                  </div>

                  {/* City Info */}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3">{selectedCity.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Population</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {(selectedCity.population / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Economy</p>
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {selectedCity.economy}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Key Attractions</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedCity.attractions.slice(0, 3).map((attraction, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                            {attraction}
                          </span>
                        ))}
                        {selectedCity.attractions.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                            +{selectedCity.attractions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Explore {selectedCity.name}
                    </button>
                  </div>
                </div>
              </Popup>
            )}

            {/* Hover popup */}
            {hoveredFeature && (
              <div
                className="absolute bg-white px-3 py-2 rounded-lg shadow-lg pointer-events-none z-10"
                style={{
                  left: '50%',
                  top: '10px',
                  transform: 'translateX(-50%)'
                }}
              >
                <p className="text-sm font-semibold text-gray-900">
                  {hoveredFeature.properties?.ADM1_EN || hoveredFeature.properties?.PROVINCE || hoveredFeature.properties?.NAME_1}
                </p>
                {hoveredFeature.properties?.NAME_2 && (
                  <p className="text-xs text-gray-600">
                    District: {hoveredFeature.properties.NAME_2}
                  </p>
                )}
              </div>
            )}
          </Map>
            )}
          </MapWrapper>

          {/* Map Controls */}
          <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setViewLevel('country')
                  setSelectedId(null)
                  setSelectedProvince(null)
                  setViewState({ latitude: -28.5, longitude: 24.5, zoom: 5.5 })
                }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                Reset View
              </button>
              {selectedProvince && (
                <button
                  onClick={() => {
                    setViewState({
                      latitude: selectedProvince.coordinates[1],
                      longitude: selectedProvince.coordinates[0],
                      zoom: 7
                    })
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <ZoomIn className="w-4 h-4" />
                  Focus {selectedProvince.name}
                </button>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-white rounded-xl shadow-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Map Legend</h4>
            <div className="space-y-2">
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs font-medium text-gray-700 mb-1">Administrative</p>
                <div className="space-y-1">
                  {viewLevel === 'country' && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded" />
                        <span className="text-xs text-gray-600">Provinces</span>
                      </div>
                      {selectedId && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-500 rounded" />
                          <span className="text-xs text-gray-600">Selected Province</span>
                        </div>
                      )}
                    </>
                  )}
                  {viewLevel === 'province' && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-400 rounded" />
                        <span className="text-xs text-gray-600">Districts</span>
                      </div>
                      {selectedId && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-500 rounded" />
                          <span className="text-xs text-gray-600">Selected District</span>
                        </div>
                      )}
                    </>
                  )}
                  {viewLevel === 'municipality' && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-400 rounded" />
                        <span className="text-xs text-gray-600">Municipalities</span>
                      </div>
                      {selectedId && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-500 rounded" />
                          <span className="text-xs text-gray-600">Selected Municipality</span>
                        </div>
                      )}
                    </>
                  )}
                  {viewLevel === 'municipality' && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-400 rounded" />
                        <span className="text-xs text-gray-600">Wards</span>
                      </div>
                      {selectedId && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-600 rounded" />
                          <span className="text-xs text-gray-600">Selected Ward</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Cities</p>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-red-600 text-white rounded-full text-xs font-medium">📍</div>
                  <span className="text-xs text-gray-600">Major Cities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

      {/* Custom styles */}
      <style jsx global>{`
        .city-popup .mapboxgl-popup-content {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 12px !important;
        }
        .city-popup .mapboxgl-popup-tip {
          display: none !important;
        }
      `}</style>
    </div>
  )
}

export default SAAdministrativeMapV3