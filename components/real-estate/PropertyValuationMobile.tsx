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
  Activity,
  Calendar,
  Info,
  Building2,
  Bed,
  Bath,
  Car,
  Square,
  Trees,
  ArrowLeft,
  RefreshCw,
  Share2,
  Download,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'

interface PropertyValuationMobileProps {
  onBack?: () => void
}

// Property details for valuation (from desktop component)
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

// Valuation data (from desktop component)
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

// Comparable properties (from desktop component)
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
  }
]

// Market trends (from desktop component)
const marketTrends = [
  { month: 'Aug', value: 10200000 },
  { month: 'Sep', value: 10400000 },
  { month: 'Oct', value: 10600000 },
  { month: 'Nov', value: 10900000 },
  { month: 'Dec', value: 11100000 },
  { month: 'Jan', value: 11250000 }
]

// Area statistics (from desktop component)
const areaStats = {
  avgPrice: 10500000,
  avgPricePerSqm: 32500,
  avgDaysOnMarket: 45,
  totalListings: 23,
  recentSales: 8,
  priceGrowth: 8.5
}

// Value factors (from desktop component)
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

export default function PropertyValuationMobile({ onBack }: PropertyValuationMobileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparables' | 'trends' | 'factors'>('overview')
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
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">Property Valuation</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{propertyDetails.address}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Valuation Card */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-4 text-white">
          <div className="mb-4">
            <p className="text-indigo-100 text-sm mb-1">Estimated Value</p>
            <p className="text-3xl font-bold mb-2">R {(valuationData.currentValue / 1000000).toFixed(2)}M</p>
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-indigo-100 text-xs mb-2">Valuation Range</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Low</span>
                  <span>R {(valuationData.valuationRange.low / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Mid</span>
                  <span>R {(valuationData.valuationRange.mid / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span>High</span>
                  <span>R {(valuationData.valuationRange.high / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-indigo-100 text-xs mb-2">Confidence Score</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl font-bold">{valuationData.confidence}%</div>
                <Target className="w-6 h-6 text-indigo-200" />
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
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[72px] z-10">
        <div className="px-4">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'comparables', label: 'Comps', icon: Building2 },
              { id: 'trends', label: 'Trends', icon: BarChart3 },
              { id: 'factors', label: 'Factors', icon: Activity }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-3 px-1 border-b-2 transition-all ${
                  activeTab === id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4 inline mr-1" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6 pb-20">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Property Details */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Type
                  </span>
                  <span className="font-medium">{propertyDetails.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    Beds
                  </span>
                  <span className="font-medium">{propertyDetails.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Bath className="w-3 h-3" />
                    Baths
                  </span>
                  <span className="font-medium">{propertyDetails.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    Parking
                  </span>
                  <span className="font-medium">{propertyDetails.parking}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Square className="w-3 h-3" />
                    Floor
                  </span>
                  <span className="font-medium">{propertyDetails.floorSize}m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Trees className="w-3 h-3" />
                    Erf
                  </span>
                  <span className="font-medium">{propertyDetails.erfSize}m²</span>
                </div>
              </div>
            </div>

            {/* Area Statistics */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Area Statistics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Price</span>
                  <span className="font-medium">R {(areaStats.avgPrice / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per m²</span>
                  <span className="font-medium">R {areaStats.avgPricePerSqm.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days on Market</span>
                  <span className="font-medium">{areaStats.avgDaysOnMarket} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">YoY Growth</span>
                  <span className="font-medium text-green-600">+{areaStats.priceGrowth}%</span>
                </div>
              </div>
            </div>

            {/* Price History Chart */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">6-Month Price Trend</h3>
              <div className="h-32 flex items-end justify-between gap-2">
                {marketTrends.map((trend, index) => (
                  <div key={trend.month} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(trend.value / 12000000) * 80}px` }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm relative group"
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        R{(trend.value / 1000000).toFixed(1)}M
                      </div>
                    </motion.div>
                    <span className="text-xs text-gray-600 mt-1">{trend.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparables' && (
          <div className="space-y-3">
            {comparables.map((comp) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{comp.address}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                      <span>Sold: {comp.soldDate}</span>
                      <span>{comp.size}m²</span>
                      <span>{comp.bedrooms} beds</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">R {(comp.price / 1000000).toFixed(1)}M</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Target className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{comp.similarity}% match</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Market Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-gray-600">3 Month Trend</span>
                    <span className="text-green-600 font-medium">+4.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: '70%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-gray-600">6 Month Trend</span>
                    <span className="text-green-600 font-medium">+7.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-gray-600">12 Month Trend</span>
                    <span className="text-green-600 font-medium">+12.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Market Indicators</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Supply Level</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs">Moderate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Demand Level</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Trend</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">Rising</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Activity</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'factors' && (
          <div className="space-y-3">
            {valueFactors.map((factor) => (
              <div key={factor.factor} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getImpactColor(factor.impact)}`}>
                      {getImpactIcon(factor.impact)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{factor.factor}</h4>
                      <p className="text-xs text-gray-600">{factor.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{factor.score}</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
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

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>
    </div>
  )
}