'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp,
  TrendingDown,
  Home,
  DollarSign,
  MapPin,
  Calculator,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Info,
  AlertCircle,
  CheckCircle,
  Building2,
  Bed,
  Bath,
  Car,
  Square,
  Trees,
  Zap,
  Droplets,
  Shield,
  Wifi,
  ChevronRight,
  Download,
  Share2,
  RefreshCw,
  Clock,
  Target,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'

// Property details for valuation
const propertyDetails = {
  address: '45 Vineyard Road, Constantia',
  city: 'Cape Town',
  province: 'Western Cape',
  type: 'House',
  bedrooms: 4,
  bathrooms: 3,
  parking: 2,
  floorSize: 320,
  erfSize: 1100,
  yearBuilt: 2018,
  lastSoldPrice: 8500000,
  lastSoldDate: '2020-03-15'
}

// Valuation data
const valuationData = {
  currentValue: 11250000,
  previousValue: 10500000,
  change: 7.14,
  confidence: 92,
  lastUpdated: '2024-01-15',
  valuationRange: {
    low: 10500000,
    mid: 11250000,
    high: 12000000
  }
}

// Comparable properties
const comparables = [
  {
    id: 1,
    address: '23 Oak Avenue, Constantia',
    price: 10800000,
    soldDate: '2023-11-20',
    size: 310,
    bedrooms: 4,
    similarity: 94
  },
  {
    id: 2,
    address: '67 Willow Street, Constantia',
    price: 11500000,
    soldDate: '2023-10-15',
    size: 335,
    bedrooms: 4,
    similarity: 91
  },
  {
    id: 3,
    address: '12 Grove Road, Constantia',
    price: 10200000,
    soldDate: '2023-12-01',
    size: 295,
    bedrooms: 3,
    similarity: 87
  },
  {
    id: 4,
    address: '89 Valley View, Constantia',
    price: 12100000,
    soldDate: '2023-09-30',
    size: 350,
    bedrooms: 4,
    similarity: 85
  }
]

// Market trends
const marketTrends = [
  { month: 'Aug', value: 10200000 },
  { month: 'Sep', value: 10400000 },
  { month: 'Oct', value: 10600000 },
  { month: 'Nov', value: 10900000 },
  { month: 'Dec', value: 11100000 },
  { month: 'Jan', value: 11250000 }
]

// Area statistics
const areaStats = {
  avgPrice: 10500000,
  avgPricePerSqm: 32500,
  avgDaysOnMarket: 45,
  totalListings: 23,
  recentSales: 8,
  priceGrowth: 8.5
}

// Value factors
const valueFactors = [
  { factor: 'Location', impact: 'positive', score: 95, description: 'Prime Constantia location' },
  { factor: 'Property Size', impact: 'positive', score: 88, description: 'Above average for area' },
  { factor: 'Condition', impact: 'positive', score: 92, description: 'Excellent, recently renovated' },
  { factor: 'Market Demand', impact: 'positive', score: 85, description: 'High demand area' },
  { factor: 'Schools Nearby', impact: 'positive', score: 90, description: 'Top-rated schools in vicinity' },
  { factor: 'Security', impact: 'positive', score: 94, description: '24/7 estate security' },
  { factor: 'Age of Property', impact: 'neutral', score: 75, description: '6 years old' },
  { factor: 'Interest Rates', impact: 'negative', score: 65, description: 'Rising interest environment' }
]

const PropertyValuation = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparables' | 'trends' | 'factors'>('overview')
  const [showDetails, setShowDetails] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'positive': return 'text-green-600 bg-green-100'
      case 'negative': return 'text-red-600 bg-red-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch(impact) {
      case 'positive': return <ArrowUpRight className="w-4 h-4" />
      case 'negative': return <ArrowDownRight className="w-4 h-4" />
      default: return <Minus className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 min-h-[700px] border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Property Valuation</h2>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {propertyDetails.address}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Updated: {valuationData.lastUpdated}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
          <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Main Valuation Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-8 text-white">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-indigo-100 text-sm mb-1">Estimated Value</p>
            <p className="text-4xl font-bold mb-2">R {(valuationData.currentValue / 1000000).toFixed(2)}M</p>
            <div className="flex items-center gap-2">
              {valuationData.change > 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span className="text-sm">
                {valuationData.change > 0 ? '+' : ''}{valuationData.change}% from last valuation
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-indigo-100 text-sm mb-1">Valuation Range</p>
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Low</span>
                <span>R {(valuationData.valuationRange.low / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Mid</span>
                <span className="font-semibold">R {(valuationData.valuationRange.mid / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>High</span>
                <span>R {(valuationData.valuationRange.high / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-indigo-100 text-sm mb-1">Confidence Score</p>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl font-bold">{valuationData.confidence}%</div>
              <Target className="w-8 h-8 text-indigo-200" />
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2"
                style={{ width: `${valuationData.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'comparables', label: 'Comparables', icon: Building2 },
          { id: 'trends', label: 'Market Trends', icon: BarChart3 },
          { id: 'factors', label: 'Value Factors', icon: Activity }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Property Details */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Property Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Type
                </span>
                <span className="font-medium text-gray-900">{propertyDetails.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Bed className="w-4 h-4" />
                  Bedrooms
                </span>
                <span className="font-medium text-gray-900">{propertyDetails.bedrooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Bath className="w-4 h-4" />
                  Bathrooms
                </span>
                <span className="font-medium text-gray-900">{propertyDetails.bathrooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Parking
                </span>
                <span className="font-medium text-gray-900">{propertyDetails.parking}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  Floor Size
                </span>
                <span className="font-medium text-gray-900">{propertyDetails.floorSize}m²</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Trees className="w-4 h-4" />
                  Erf Size
                </span>
                <span className="font-medium text-gray-900">{propertyDetails.erfSize}m²</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Year Built
                </span>
                <span className="font-medium text-gray-900">{propertyDetails.yearBuilt}</span>
              </div>
            </div>
          </div>

          {/* Area Statistics */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Area Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Price</span>
                <span className="font-medium text-gray-900">R {(areaStats.avgPrice / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price per m²</span>
                <span className="font-medium text-gray-900">R {areaStats.avgPricePerSqm.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Days on Market</span>
                <span className="font-medium text-gray-900">{areaStats.avgDaysOnMarket} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Listings</span>
                <span className="font-medium text-gray-900">{areaStats.totalListings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Recent Sales</span>
                <span className="font-medium text-gray-900">{areaStats.recentSales}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">YoY Price Growth</span>
                <span className="font-medium text-green-600">+{areaStats.priceGrowth}%</span>
              </div>
            </div>
          </div>

          {/* Price History Chart */}
          <div className="col-span-2 bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Price History</h3>
            <div className="h-64 flex items-end justify-between gap-4">
              {marketTrends.map((trend, index) => (
                <div key={trend.month} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(trend.value / 12000000) * 200}px` }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      R{(trend.value / 1000000).toFixed(1)}M
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-600 mt-2">{trend.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparables' && (
        <div className="space-y-4">
          {comparables.map((comp) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{comp.address}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>Sold: {comp.soldDate}</span>
                    <span>{comp.size}m²</span>
                    <span>{comp.bedrooms} beds</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600">R {(comp.price / 1000000).toFixed(1)}M</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{comp.similarity}% match</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Market Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">3 Month Trend</span>
                  <span className="text-green-600 font-medium">+4.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 rounded-full h-2" style={{ width: '70%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">6 Month Trend</span>
                  <span className="text-green-600 font-medium">+7.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 rounded-full h-2" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">12 Month Trend</span>
                  <span className="text-green-600 font-medium">+12.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 rounded-full h-2" style={{ width: '95%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Market Indicators</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Supply Level</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm">Moderate</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Demand Level</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price Trend</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm">Rising</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Market Activity</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'factors' && (
        <div className="space-y-3">
          {valueFactors.map((factor) => (
            <div key={factor.factor} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${getImpactColor(factor.impact)}`}>
                    {getImpactIcon(factor.impact)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{factor.factor}</h4>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{factor.score}</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 ${
                        factor.impact === 'positive' ? 'bg-green-500' :
                        factor.impact === 'negative' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PropertyValuation