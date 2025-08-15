'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  Home,
  Building2,
  TrendingUp,
  Users,
  ChartBar,
  ChevronRight,
  MapPin,
  Move3d
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import components
const PropertyListingsMobile = dynamic(() => import('./PropertyListingsMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
})

const VirtualTourMobile = dynamic(() => import('./VirtualTourMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
})

const PropertyValuationMobile = dynamic(() => import('./PropertyValuationMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
})

const TenantManagementMobile = dynamic(() => import('./TenantManagementMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
})

const PropertyAnalyticsMobile = dynamic(() => import('./PropertyAnalyticsMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
})

const realEstateModules = [
  {
    id: 'property-listings',
    title: 'Property Listings',
    subtitle: 'Browse properties with interactive map',
    icon: MapPin,
    component: PropertyListingsMobile,
    color: 'bg-indigo-500'
  },
  {
    id: 'virtual-tour',
    title: 'Virtual Property Tour',
    subtitle: '360° tours and interactive walkthroughs',
    icon: Move3d,
    component: VirtualTourMobile,
    color: 'bg-purple-500'
  },
  {
    id: 'property-valuation',
    title: 'Property Valuation',
    subtitle: 'AI-powered property estimates',
    icon: TrendingUp,
    component: PropertyValuationMobile,
    color: 'bg-green-500'
  },
  {
    id: 'tenant-management',
    title: 'Tenant Management',
    subtitle: 'Manage tenants and leases',
    icon: Users,
    component: TenantManagementMobile,
    color: 'bg-blue-500'
  },
  {
    id: 'property-analytics',
    title: 'Property Analytics',
    subtitle: 'Portfolio performance insights',
    icon: ChartBar,
    component: PropertyAnalyticsMobile,
    color: 'bg-orange-500'
  }
]

interface RealEstateMobileContainerProps {
  onBack?: () => void
}

export default function RealEstateMobileContainer({ onBack }: RealEstateMobileContainerProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const currentModule = realEstateModules.find(m => m.id === selectedModule)
  const ModuleComponent = currentModule?.component

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId)
  }

  const handleBackFromModule = () => {
    setSelectedModule(null)
  }

  // Show selected module
  if (selectedModule && ModuleComponent) {
    return <ModuleComponent onBack={handleBackFromModule} />
  }

  // Main menu
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
                <h1 className="text-xl font-bold text-gray-900">Real Estate Systems</h1>
                <p className="text-sm text-gray-600">Property management solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 py-6 pb-20">
        {/* Module Grid */}
        <div className="space-y-3 mb-6">
          {realEstateModules.map((module) => {
            const Icon = module.icon
            return (
              <motion.button
                key={module.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModuleSelect(module.id)}
                className="w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.subtitle}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Featured Property Card */}
        <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Featured Property</h3>
          <p className="text-sm opacity-90 mb-4">
            Luxury Villa in Constantia - R12.5M
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>5 Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span>650m²</span>
            </div>
          </div>
          <button
            onClick={() => handleModuleSelect('virtual-tour')}
            className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium"
          >
            Take Virtual Tour
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4">
            <p className="text-2xl font-bold text-indigo-600">24</p>
            <p className="text-sm text-gray-600">Active Listings</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-2xl font-bold text-green-600">R45M</p>
            <p className="text-sm text-gray-600">Portfolio Value</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-2xl font-bold text-blue-600">18</p>
            <p className="text-sm text-gray-600">Tenants</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-2xl font-bold text-orange-600">92%</p>
            <p className="text-sm text-gray-600">Occupancy</p>
          </div>
        </div>
      </div>
    </div>
  )
}