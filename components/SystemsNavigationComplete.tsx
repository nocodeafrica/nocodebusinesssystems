'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { 
  Mic,
  MapPin,
  Box,
  BarChart3,
  Users,
  Package,
  UserPlus,
  Scale,
  Building,
  Heart,
  Hotel,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react'

// Import actual demo components
import VoiceSalesAgentV4 from './VoiceSalesAgentV4'
import LocationSystemsCarouselV2 from './LocationSystemsCarouselV2'
import BookMeetingButton from './BookMeetingButton'
import MobileSystemsModal from './mobile/MobileSystemsModal'

// Use ModelViewerPlatform for 3D Systems
const ModelViewerPlatform = dynamic(() => import('./ModelViewerPlatform'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[900px] bg-gradient-to-br from-slate-100 to-blue-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading 3D systems...</p>
      </div>
    </div>
  )
})

// Mobile 3D viewer
const ModelViewerMobile = dynamic(() => import('./ModelViewerMobile'), {
  ssr: false,
  loading: () => (
    <div className="h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading 3D viewer...</p>
      </div>
    </div>
  )
})

const AnalyticsSystemsCarousel = dynamic(() => import('./AnalyticsSystemsCarousel'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading analytics...</p>
      </div>
    </div>
  )
})

const PeopleManagementCarousel = dynamic(() => import('./PeopleManagementCarousel'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading people management...</p>
      </div>
    </div>
  )
})

const InventoryManagementCarousel = dynamic(() => import('./InventoryManagementCarousel'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading inventory management...</p>
      </div>
    </div>
  )
})

const RecruitmentSystemsCarousel = dynamic(() => import('./RecruitmentSystemsCarousel'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading recruitment systems...</p>
      </div>
    </div>
  )
})

const LegalTechCarousel = dynamic(() => import('./LegalTechCarousel'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-indigo-400">Loading legal tech systems...</p>
      </div>
    </div>
  )
})

const RealEstateCarousel = dynamic(() => import('./RealEstateCarousel'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-white rounded-3xl flex items-center justify-center border border-gray-200">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading real estate systems...</p>
      </div>
    </div>
  )
})

const HealthcareSystemsCarousel = dynamic(() => import('./HealthcareSystemsCarousel'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading healthcare systems...</p>
      </div>
    </div>
  )
})

const HospitalitySystemsCarousel = dynamic(() => import('./HospitalitySystemsCarousel'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading hospitality systems...</p>
      </div>
    </div>
  )
})

const EducationSystemsCarousel = dynamic(() => import('./EducationSystemsCarousel'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] sm:h-[500px] lg:h-[700px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading education systems...</p>
      </div>
    </div>
  )
})

const SystemsNavigationComplete = () => {
  const [activeTab, setActiveTab] = useState<string>('voice')
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileModal, setShowMobileModal] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState<string>('')
  const [showMobile3D, setShowMobile3D] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const systems = [
    {
      id: 'voice',
      name: 'Voice Systems',
      icon: Mic,
      color: 'from-blue-500 to-cyan-500',
      component: VoiceSalesAgentV4,
      title: 'We Build Voice Systems',
      subtitle: 'AI-powered conversational interfaces that understand and respond naturally'
    },
    {
      id: 'location',
      name: 'Location Systems',
      icon: MapPin,
      color: 'from-green-500 to-emerald-500',
      component: LocationSystemsCarouselV2,
      title: 'We Build Location Systems',
      subtitle: 'Interactive maps and geospatial intelligence for better business decisions'
    },
    {
      id: '3d',
      name: '3D Systems',
      icon: Box,
      color: 'from-purple-500 to-pink-500',
      component: ModelViewerPlatform,
      title: 'We Build 3D Systems',
      subtitle: 'Immersive product visualizations and interactive 3D experiences'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      component: AnalyticsSystemsCarousel,
      title: 'We Build Analytics Systems',
      subtitle: 'Real-time insights and predictive analytics for data-driven decisions'
    },
    {
      id: 'people',
      name: 'People Management',
      icon: Users,
      color: 'from-indigo-500 to-blue-500',
      component: PeopleManagementCarousel,
      title: 'We Build People Management Systems',
      subtitle: 'Complete HR solutions from recruitment to performance management'
    },
    {
      id: 'inventory',
      name: 'Inventory',
      icon: Package,
      color: 'from-yellow-500 to-orange-500',
      component: InventoryManagementCarousel,
      title: 'We Build Inventory Systems',
      subtitle: 'Smart warehouse and stock management with real-time tracking'
    },
    {
      id: 'recruitment',
      name: 'Recruitment',
      icon: UserPlus,
      color: 'from-teal-500 to-cyan-500',
      component: RecruitmentSystemsCarousel,
      title: 'We Build Recruitment Systems',
      subtitle: 'End-to-end talent acquisition and onboarding platforms'
    },
    {
      id: 'legal',
      name: 'Legal Tech',
      icon: Scale,
      color: 'from-gray-600 to-gray-800',
      component: LegalTechCarousel,
      title: 'We Build Legal Tech Systems',
      subtitle: 'Digital transformation for legal practices and compliance'
    },
    {
      id: 'realestate',
      name: 'Real Estate',
      icon: Building,
      color: 'from-amber-500 to-yellow-500',
      component: RealEstateCarousel,
      title: 'We Build Real Estate Systems',
      subtitle: 'Property management and real estate transaction platforms'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      component: HealthcareSystemsCarousel,
      title: 'We Build Healthcare Systems',
      subtitle: 'Patient care platforms and medical practice management'
    },
    {
      id: 'hospitality',
      name: 'Hospitality',
      icon: Hotel,
      color: 'from-rose-500 to-pink-500',
      component: HospitalitySystemsCarousel,
      title: 'We Build Hospitality Systems',
      subtitle: 'Hotel and restaurant management with guest experience focus'
    },
    {
      id: 'education',
      name: 'Education',
      icon: GraduationCap,
      color: 'from-violet-500 to-purple-500',
      component: EducationSystemsCarousel,
      title: 'We Build Education Systems',
      subtitle: 'Learning management and academic administration platforms'
    }
  ]

  const activeSystem = systems.find(s => s.id === activeTab) || systems[0]
  const ActiveComponent = activeSystem.component

  // Handle mobile system selection
  const handleMobileSystemClick = (systemId: string) => {
    // Special handling for 3D system on mobile
    if (systemId === '3d') {
      setShowMobile3D(true)
      return
    }
    
    setSelectedSystem(systemId)
    setShowMobileModal(true)
  }

  // Get tabs for selected system in modal (for now just one, but can be expanded)
  const getSystemTabs = (systemId: string) => {
    const system = systems.find(s => s.id === systemId)
    if (!system) return []
    
    // For location systems, we have multiple demos
    if (systemId === 'location') {
      // Return the carousel component which contains all demos
      return [{
        id: 'all',
        name: 'All Demos',
        icon: system.icon,
        component: system.component
      }]
    }
    
    // For other systems, return single tab
    return [{
      id: system.id,
      name: system.name,
      icon: system.icon,
      component: system.component
    }]
  }

  // Mobile 3D viewer - Full screen
  if (showMobile3D) {
    return (
      <div className="fixed inset-0 z-50">
        <button
          onClick={() => setShowMobile3D(false)}
          className="absolute top-4 left-4 z-50 p-2 bg-white/90 backdrop-blur-md rounded-lg text-gray-700 shadow-lg flex items-center gap-2"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span className="text-sm">Back</span>
        </button>
        <ModelViewerMobile />
      </div>
    )
  }

  // Mobile layout - Grid of services
  if (isMobile) {
    const selectedSystemData = systems.find(s => s.id === selectedSystem)
    
    return (
      <>
        <section className="py-12 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-sm font-semibold mb-4">
                Our Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                We Build Intelligent Systems
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto px-4">
                Tap any system below to explore our interactive demos
              </p>
            </motion.div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-4">
              {systems.map((system, index) => (
                <motion.button
                  key={system.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleMobileSystemClick(system.id)}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${system.color} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                    <system.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{system.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{system.subtitle}</p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-blue-600">
                    <span className="text-xs font-medium">Explore</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <BookMeetingButton />
            </motion.div>
          </div>
        </section>

        {/* Mobile Modal */}
        {selectedSystemData && (
          <MobileSystemsModal
            isOpen={showMobileModal}
            onClose={() => {
              setShowMobileModal(false)
              setSelectedSystem('')
            }}
            title={selectedSystemData.title}
            subtitle={selectedSystemData.subtitle}
            tabs={getSystemTabs(selectedSystem)}
            initialTab={getSystemTabs(selectedSystem)[0]?.id}
            systemColor={selectedSystemData.color}
          />
        )}
      </>
    )
  }

  // Desktop layout - Keep existing
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-sm font-semibold mb-4">
            Our Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
            We Build Intelligent Systems
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Experience a showcase of intelligent business systems we've crafted. 
            Every solution here represents what's possible when African innovation meets world-class technology.
          </p>
        </motion.div>

        {/* Tab Navigation - Enhanced Mobile Scrollable */}
        <div className="mb-6 sm:mb-8 relative">
          <div className="relative">
            {/* Scroll indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none sm:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none sm:hidden" />
            
            <div className="flex overflow-x-auto scrollbar-hide gap-2 sm:gap-3 pb-2 snap-x snap-mandatory">
              {systems.map((system) => (
                <motion.button
                  key={system.id}
                  onClick={() => setActiveTab(system.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl whitespace-nowrap transition-all snap-center min-w-fit ${
                    activeTab === system.id
                      ? `bg-gradient-to-r ${system.color} text-white shadow-lg scale-105`
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:scale-102'
                  }`}
                  whileHover={{ scale: activeTab === system.id ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ minHeight: '44px' }} // Ensure touch-friendly size
                >
                  <system.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{system.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Active System Title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`title-${activeTab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight px-4">
              <span className="text-gray-900">{activeSystem.title.split(' ').slice(0, 2).join(' ')} </span>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeSystem.color}`}>
                {activeSystem.title.split(' ').slice(2).join(' ')}
              </span>
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {activeSystem.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Active Component */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`component-${activeTab}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Show mobile 3D viewer on mobile devices when 3D is selected */}
            {activeTab === '3d' && isMobile ? (
              <ModelViewerMobile />
            ) : (
              <ActiveComponent />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-center {
          scroll-snap-align: center;
        }
        @media (max-width: 640px) {
          .scrollbar-hide {
            scroll-behavior: smooth;
            scroll-padding: 1rem;
          }
        }
      `}</style>
    </section>
  )
}

export default SystemsNavigationComplete