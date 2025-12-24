'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Box,
  Building,
  ChevronRight,
  GraduationCap,
  Heart,
  Hotel,
  MapPin,
  Mic,
  Package,
  Scale,
  UserPlus,
  Users,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Import actual demo components
import BookMeetingButton from './BookMeetingButton';
import LocationSystemsCarouselV2 from './LocationSystemsCarouselV2';
import VoiceSalesAgentV4 from './VoiceSalesAgentV4';
import MobileSystemsModal from './mobile/MobileSystemsModal';

// Use ModelViewerPlatform for 3D Systems
const ModelViewerPlatform = dynamic(() => import('./ModelViewerPlatform'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 to-blue-50 sm:h-[500px] lg:h-[900px]">
      <div className="text-center">
        <div className="border-3 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-blue-500 border-t-transparent" />
        <p className="text-sm text-gray-400">Loading 3D systems...</p>
      </div>
    </div>
  ),
});

// Mobile 3D viewer
const ModelViewerMobile = dynamic(() => import('./ModelViewerMobile'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="text-center">
        <div className="border-3 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-blue-500 border-t-transparent" />
        <p className="text-sm text-gray-400">Loading 3D viewer...</p>
      </div>
    </div>
  ),
});

const AnalyticsSystemsCarousel = dynamic(
  () => import('./AnalyticsSystemsCarousel'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 sm:h-[500px] lg:h-[700px]">
        <div className="text-center">
          <div className="border-3 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-purple-500 border-t-transparent" />
          <p className="text-sm text-gray-400">Loading analytics...</p>
        </div>
      </div>
    ),
  }
);

const PeopleManagementCarousel = dynamic(
  () => import('./PeopleManagementCarousel'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-violet-50 to-purple-50 sm:h-[500px] lg:h-[700px]">
        <div className="text-center">
          <div className="border-3 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-violet-500 border-t-transparent" />
          <p className="text-sm text-gray-400">Loading people management...</p>
        </div>
      </div>
    ),
  }
);

const InventoryManagementCarousel = dynamic(
  () => import('./InventoryManagementCarousel'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 sm:h-[500px] lg:h-[700px]">
        <div className="text-center">
          <div className="border-3 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-blue-500 border-t-transparent" />
          <p className="text-sm text-gray-400">
            Loading inventory management...
          </p>
        </div>
      </div>
    ),
  }
);

const RecruitmentSystemsCarousel = dynamic(
  () => import('./RecruitmentSystemsCarousel'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 sm:h-[500px] lg:h-[700px]">
        <div className="text-center">
          <div className="border-3 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-indigo-500 border-t-transparent" />
          <p className="text-sm text-gray-400">
            Loading recruitment systems...
          </p>
        </div>
      </div>
    ),
  }
);

const LegalTechCarousel = dynamic(() => import('./LegalTechCarousel'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 sm:h-[500px] lg:h-[700px]">
      <div className="text-center">
        <div className="border-3 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-indigo-500 border-t-transparent" />
        <p className="text-sm text-indigo-400">Loading legal tech systems...</p>
      </div>
    </div>
  ),
});

const RealEstateCarousel = dynamic(() => import('./RealEstateCarousel'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-3xl border border-gray-200 bg-white sm:h-[500px] lg:h-[700px]">
      <div className="text-center">
        <div className="border-3 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-green-500 border-t-transparent" />
        <p className="text-sm text-gray-500">Loading real estate systems...</p>
      </div>
    </div>
  ),
});

const HealthcareSystemsCarousel = dynamic(
  () => import('./HealthcareSystemsCarousel'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-red-50 to-pink-50 sm:h-[500px] lg:h-[700px]">
        <div className="text-center">
          <div className="border-3 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-red-500 border-t-transparent" />
          <p className="text-sm text-gray-400">Loading healthcare systems...</p>
        </div>
      </div>
    ),
  }
);

const HospitalitySystemsCarousel = dynamic(
  () => import('./HospitalitySystemsCarousel'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 sm:h-[500px] lg:h-[700px]">
        <div className="text-center">
          <div className="border-3 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-rose-500 border-t-transparent" />
          <p className="text-sm text-gray-400">
            Loading hospitality systems...
          </p>
        </div>
      </div>
    ),
  }
);

const EducationSystemsCarousel = dynamic(
  () => import('./EducationSystemsCarousel'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 sm:h-[500px] lg:h-[700px]">
        <div className="text-center">
          <div className="border-3 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-blue-500 border-t-transparent" />
          <p className="text-sm text-gray-400">Loading education systems...</p>
        </div>
      </div>
    ),
  }
);

const SystemsNavigationComplete = () => {
  const [activeTab, setActiveTab] = useState<string>('voice');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [showMobile3D, setShowMobile3D] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle deep linking from custom events
  useEffect(() => {
    const handleSystemSelection = (event: CustomEvent) => {
      const systemId = event.detail.systemId;
      const system = systems.find((s) => s.id === systemId);
      if (system) {
        setActiveTab(systemId);
        // Scroll to the section
        const section = document.getElementById('our-work');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    window.addEventListener(
      'selectSystem',
      handleSystemSelection as EventListener
    );

    return () => {
      window.removeEventListener(
        'selectSystem',
        handleSystemSelection as EventListener
      );
    };
  }, []);

  const systems = [
    {
      id: 'voice',
      name: 'Voice Systems',
      icon: Mic,
      color: 'from-blue-500 to-cyan-500',
      component: VoiceSalesAgentV4,
      title: 'We Build Voice Systems',
      subtitle:
        'AI-powered conversational interfaces that understand and respond naturally',
    },
    {
      id: 'location',
      name: 'Location Systems',
      icon: MapPin,
      color: 'from-green-500 to-emerald-500',
      component: LocationSystemsCarouselV2,
      title: 'We Build Location Systems',
      subtitle:
        'Interactive maps and geospatial intelligence for better business decisions',
    },
    {
      id: '3d',
      name: '3D Systems',
      icon: Box,
      color: 'from-purple-500 to-pink-500',
      component: ModelViewerPlatform,
      title: 'We Build 3D Systems',
      subtitle:
        'Immersive product visualizations and interactive 3D experiences',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      component: AnalyticsSystemsCarousel,
      title: 'We Build Analytics Systems',
      subtitle:
        'Real-time insights and predictive analytics for data-driven decisions',
    },
    {
      id: 'people',
      name: 'People Management',
      icon: Users,
      color: 'from-indigo-500 to-blue-500',
      component: PeopleManagementCarousel,
      title: 'We Build People Management Systems',
      subtitle:
        'Complete HR solutions from recruitment to performance management',
    },
    {
      id: 'inventory',
      name: 'Inventory',
      icon: Package,
      color: 'from-yellow-500 to-orange-500',
      component: InventoryManagementCarousel,
      title: 'We Build Inventory Systems',
      subtitle: 'Smart warehouse and stock management with real-time tracking',
    },
    {
      id: 'recruitment',
      name: 'Recruitment',
      icon: UserPlus,
      color: 'from-teal-500 to-cyan-500',
      component: RecruitmentSystemsCarousel,
      title: 'We Build Recruitment Systems',
      subtitle: 'End-to-end talent acquisition and onboarding platforms',
    },
    {
      id: 'legal',
      name: 'Legal Tech',
      icon: Scale,
      color: 'from-gray-600 to-gray-800',
      component: LegalTechCarousel,
      title: 'We Build Legal Tech Systems',
      subtitle: 'Digital transformation for legal practices and compliance',
    },
    {
      id: 'realestate',
      name: 'Real Estate',
      icon: Building,
      color: 'from-amber-500 to-yellow-500',
      component: RealEstateCarousel,
      title: 'We Build Real Estate Systems',
      subtitle: 'Property management and real estate transaction platforms',
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      component: HealthcareSystemsCarousel,
      title: 'We Build Healthcare Systems',
      subtitle: 'Patient care platforms and medical practice management',
    },
    {
      id: 'hospitality',
      name: 'Hospitality',
      icon: Hotel,
      color: 'from-rose-500 to-pink-500',
      component: HospitalitySystemsCarousel,
      title: 'We Build Hospitality Systems',
      subtitle: 'Hotel and restaurant management with guest experience focus',
    },
    {
      id: 'education',
      name: 'Education',
      icon: GraduationCap,
      color: 'from-violet-500 to-purple-500',
      component: EducationSystemsCarousel,
      title: 'We Build Education Systems',
      subtitle: 'Learning management and academic administration platforms',
    },
  ];

  const activeSystem = systems.find((s) => s.id === activeTab) || systems[0];
  const ActiveComponent = activeSystem.component;

  // Handle mobile system selection
  const handleMobileSystemClick = (systemId: string) => {
    // Special handling for 3D system on mobile
    if (systemId === '3d') {
      setShowMobile3D(true);
      return;
    }

    setSelectedSystem(systemId);
    setShowMobileModal(true);
  };

  // Get tabs for selected system in modal (for now just one, but can be expanded)
  const getSystemTabs = (systemId: string) => {
    const system = systems.find((s) => s.id === systemId);
    if (!system) return [];

    // For location systems, we have multiple demos
    if (systemId === 'location') {
      // Return the carousel component which contains all demos
      return [
        {
          id: 'all',
          name: 'All Demos',
          icon: system.icon,
          component: system.component,
        },
      ];
    }

    // For other systems, return single tab
    return [
      {
        id: system.id,
        name: system.name,
        icon: system.icon,
        component: system.component,
      },
    ];
  };

  // Mobile 3D viewer - Full screen
  if (showMobile3D) {
    return (
      <div className="fixed inset-0 z-50">
        <button
          onClick={() => setShowMobile3D(false)}
          className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-lg bg-white/90 p-2 text-gray-700 shadow-lg backdrop-blur-md"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
          <span className="text-sm">Back</span>
        </button>
        <ModelViewerMobile />
      </div>
    );
  }

  // Mobile layout - Grid of services
  if (isMobile) {
    const selectedSystemData = systems.find((s) => s.id === selectedSystem);

    return (
      <>
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white py-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-center"
            >
              <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white">
                Our Capabilities
              </span>
              <h2 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold leading-tight text-transparent sm:text-3xl">
                We Build Intelligent Systems
              </h2>
              <p className="mx-auto max-w-2xl px-4 text-base text-gray-600">
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
                  className="group rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-lg"
                >
                  <div
                    className={`h-12 w-12 rounded-xl bg-gradient-to-r ${system.color} mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110`}
                  >
                    <system.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">
                    {system.name}
                  </h3>
                  <p className="line-clamp-2 text-xs text-gray-500">
                    {system.subtitle}
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-blue-600">
                    <span className="text-xs font-medium">Explore</span>
                    <ArrowRight className="h-3 w-3" />
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
              setShowMobileModal(false);
              setSelectedSystem('');
            }}
            title={selectedSystemData.title}
            subtitle={selectedSystemData.subtitle}
            tabs={getSystemTabs(selectedSystem)}
            initialTab={getSystemTabs(selectedSystem)[0]?.id}
            systemColor={selectedSystemData.color}
          />
        )}
      </>
    );
  }

  // Desktop layout - Premium Light
  return (
    <section
      id="our-work"
      className="relative overflow-hidden bg-white py-24 md:py-48"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[50%] w-[50%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[50%] w-[50%] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <div className="mb-6 inline-block rounded-full border border-[#bef264] bg-[#bef264]/10 px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-slate-900">
            Ecosystem of Excellence
          </div>
          <h2 className="mb-8 text-5xl font-black tracking-tight text-slate-900 md:text-8xl">
            Our capabilities are{' '}
            <span className="italic text-[#84cc16]">limitless</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl font-medium leading-relaxed text-slate-600">
            From conversational AI to deep analytics, we build the systems that
            power modern industry leaders.
          </p>
        </motion.div>

        {/* Tab Navigation - Polished Light */}
        <div className="mb-24 px-4">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3 rounded-[3rem] border border-slate-200 bg-slate-50 p-4 shadow-xl">
            {systems.map((system) => (
              <motion.button
                key={system.id}
                onClick={() => setActiveTab(system.id)}
                className={`flex items-center gap-3 rounded-2xl px-6 py-4 transition-all duration-500 ${
                  activeTab === system.id
                    ? `bg-[#bef264] text-black shadow-[0_10px_30px_rgba(190,242,100,0.4)]`
                    : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-md'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <system.icon
                  className={`h-5 w-5 ${activeTab === system.id ? 'text-black' : 'text-slate-400'}`}
                />
                <span className="text-sm font-black uppercase tracking-tight">
                  {system.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active System Content - Vertical Overhaul - Light Theme */}
        <div className="relative px-4 sm:px-8 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-[4rem] border border-slate-200 bg-white p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] md:p-24"
            >
              <div className="flex flex-col items-center gap-16">
                {/* Text Content - Stacked on Top */}
                <div className="max-w-4xl text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-center"
                  >
                    <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-[#bef264] to-transparent" />
                  </motion.div>

                  <h3 className="mb-8 text-5xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-8xl">
                    {activeSystem.title.split(' ').map((word, i) => (
                      <span
                        key={i}
                        className={
                          word === 'Systems' || word === 'Intelligence'
                            ? 'text-[#84cc16]'
                            : ''
                        }
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </h3>

                  <p className="mx-auto mb-12 max-w-2xl text-xl font-medium leading-relaxed text-slate-600">
                    {activeSystem.subtitle}
                  </p>
                </div>

                {/* Visual Content - Clean & Spacious */}
                <div className="w-full">
                  <ActiveComponent />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SystemsNavigationComplete;
