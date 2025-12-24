'use client';

import { SUPABASE_MODELS } from '@/lib/models';
import { AnimatePresence, motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import BookMeetingButton from './BookMeetingButton';

// Model data with descriptions and specifications
// Extended Model Data Type
interface Hotspot {
  name: string;
  position: string;
  normal: string;
  orbit: string;
  description: string;
}

// Model data with descriptions, specifications, and HOTSPOTS
const modelData: Record<string, any> = {
  [SUPABASE_MODELS[0].url]: {
    name: 'Volvo S90 Recharge',
    category: 'Luxury Sedan',
    description:
      'A luxury sedan that combines Scandinavian design with advanced plug-in hybrid technology. The S90 Recharge offers a refined driving experience with zero tailpipe emissions mode.',
    specifications: {
      Year: '2024',
      Engine: 'T8 Plug-in Hybrid',
      Power: '455 HP Combined',
      'Electric Range': 'Up to 90 km',
      Acceleration: '0-100 km/h in 4.8s',
      Drivetrain: 'eAWD',
    },
    features: [
      'Google Built-in',
      'Bowers & Wilkins Audio',
      'Advanced Air Purifier',
      'Pilot Assist',
    ],
    useCases: [
      'Interactive Configurator',
      'Digital Showroom',
      'VR Test Drive',
      'Engineering Showcase',
    ],
    hotspots: [
      {
        name: 'Thor Hammer Headlights',
        position: '0.8m 0.8m 2.2m',
        normal: '0m 0m 1m',
        orbit: '0deg 80deg 4m',
        description: 'Iconic LED active high-beam lights.',
      },
      {
        name: 'Hybrid Powertrain',
        position: '0m 0.5m 1.5m',
        normal: '0m 1m 0m',
        orbit: '90deg 45deg 4m',
        description: 'T8 AWD plug-in hybrid engine.',
      },
      {
        name: '21" Alloy Wheels',
        position: '0.9m 0.35m 1.4m',
        normal: '1m 0m 0m',
        orbit: '90deg 90deg 2m',
        description: 'Diamond-cut 8-multi spoke black alloy wheels.',
      },
    ] as Hotspot[],
  },
  [SUPABASE_MODELS[1].url]: {
    name: 'Ferrari LaFerrari',
    category: 'Hypercar',
    description:
      'The first production car from the famous Italian brand to feature a hybrid solution. The HY-KERS system combines an electric motor producing over 150 CV with the most powerful V12 in Ferrari history.',
    specifications: {
      Year: '2016-Present',
      Engine: '6.3L V12 + Electric',
      Power: '963 HP Combined',
      'Top Speed': '217 mph',
      Acceleration: '0-62 in <3.0s',
      'Price Range': '$3,000,000+',
    },
    features: [
      'HY-KERS System',
      'Carbon Fiber Chassis',
      'Active Aerodynamics',
      'F1-derived Tech',
    ],
    useCases: [
      'Automotive Design Review',
      'Virtual Showroom',
      'Engineering Analysis',
      'Marketing Presentation',
    ],
    hotspots: [
      {
        name: 'V12 Engine',
        position: '0m 0.8m -1.5m',
        normal: '0m 1m 0m',
        orbit: '180deg 40deg 3m',
        description: '6.3L naturally aspirated V12 engine.',
      },
      {
        name: 'Active Aero',
        position: '0m 0.9m -2.2m',
        normal: '0m 1m 0.5m',
        orbit: '180deg 60deg 4m',
        description: 'Rear spoiler deploys for maximum downforce.',
      },
      {
        name: 'Carbon Ceramics',
        position: '0.9m 0.35m 1.2m',
        normal: '1m 0m 0m',
        orbit: '90deg 90deg 1.5m',
        description: 'Brembo CCM braking system.',
      },
    ] as Hotspot[],
  },
  [SUPABASE_MODELS[2].url]: {
    name: 'Military Vehicle',
    category: 'Defense',
    description:
      'A tactical military vehicle designed for rugged terrain and personnel transport. Features heavy armor plating and advanced off-road suspension systems.',
    specifications: {
      Type: 'Armored Transport',
      Crew: '2 + 8 Passengers',
      Armor: 'Level 4 Ballistic',
      Range: '600 km',
      'Max Speed': '110 km/h',
      Payload: '2,500 kg',
    },
    features: [
      'Run-flat Tires',
      'Mine Protection',
      '360° Cameras',
      'NBC Filtration',
    ],
    useCases: [
      'Defense Simulation',
      'Training Scenarios',
      'Logistics Planning',
      'Maintenance Training',
    ],
  },
  [SUPABASE_MODELS[3].url]: {
    name: 'Suspension Bridge',
    category: 'Infrastructure',
    description:
      'A large-scale suspension bridge model demonstrating structural engineering principles. Ideal for visualization of civil engineering projects and load analysis.',
    specifications: {
      'Main Span': '1,280 m',
      'Total Length': '2,737 m',
      'Tower Height': '227 m',
      Clearance: '67 m',
      Lanes: '6 + 2 Pedestrian',
      Material: 'Steel/Concrete',
    },
    features: [
      'High-tensile Cables',
      'Aerodynamic Deck',
      'Seismic Dampers',
      'LED Lighting',
    ],
    useCases: [
      'Structural Analysis',
      'Urban Planning',
      'Traffic Simulation',
      'Public Consultation',
    ],
  },
  [SUPABASE_MODELS[4].url]: {
    name: 'Futuristic City',
    category: 'Architecture & Planning',
    description:
      'A visionary concept of a future metropolis, integrating vertical gardens, renewable energy sources, and efficient mass transit systems.',
    specifications: {
      Scale: '1:2000',
      'Area Covered': '15 km²',
      'Pop. Density': 'High',
      Energy: '100% Renewable',
      Transport: 'Hyperloop/Drone',
      Zoning: 'Mixed-Use',
    },
    features: [
      'Vertical Forests',
      'Solar Facades',
      'Auto-Traffic',
      'Smart Grid',
    ],
    useCases: [
      'Urban Planning',
      'Smart City Projects',
      'Sustainability Study',
      'Sci-Fi Visualization',
    ],
  },
};

const ModelViewerPlatform = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentModel, setCurrentModel] = useState(SUPABASE_MODELS[0].url);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null); // Track active hotspot
  const viewerRef = useRef<any>(null);
  const modelViewerRef = useRef<any>(null);

  const models = [
    {
      name: 'Volvo S90',
      path: SUPABASE_MODELS[0].url,
      icon: LucideIcons.Car,
    },
    {
      name: 'Ferrari LaFerrari',
      path: SUPABASE_MODELS[1].url,
      icon: LucideIcons.Zap,
    },
    {
      name: 'Military Vehicle',
      path: SUPABASE_MODELS[2].url,
      icon: LucideIcons.Shield,
    },
    {
      name: 'Suspension Bridge',
      path: SUPABASE_MODELS[3].url,
      icon: LucideIcons.Construction,
    },
    {
      name: 'Futuristic City',
      path: SUPABASE_MODELS[4].url,
      icon: LucideIcons.Building2,
    },
  ];

  const currentModelData = modelData[currentModel as keyof typeof modelData];

  // Load model-viewer script
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      model-viewer::part(default-progress-bar) {
        display: none;
      }
      .hotspot {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        border: none;
        background-color: rgba(255, 255, 255, 0.9);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
      }
      
      .hotspot:hover, .hotspot[data-active="true"] {
        background-color: #4f46e5; /* Indigo 600 */
        transform: scale(1.2);
      }

      .hotspot-annotation {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        color: #1e293b;
        display: block;
        font-family: sans-serif;
        font-size: 12px;
        font-weight: 600;
        left: calc(100% + 12px);
        max-width: 150px;
        padding: 8px 12px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: max-content;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
      }
      
      .hotspot:hover .hotspot-annotation, .hotspot[data-active="true"] .hotspot-annotation {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.type = 'module';
    script.src =
      'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';

    const legacyScript = document.createElement('script');
    legacyScript.noModule = true;
    legacyScript.src =
      'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer-legacy.js';

    script.onload = () => {
      console.log('Model-viewer loaded successfully');
      setIsLoaded(true);
    };

    document.head.appendChild(script);
    document.head.appendChild(legacyScript);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
      if (document.head.contains(legacyScript))
        document.head.removeChild(legacyScript);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  // Apply zoom using field of view
  useEffect(() => {
    if (modelViewerRef.current && isLoaded) {
      const fov = 30 - zoomLevel * 0.2; // Zoom in by reducing FOV
      modelViewerRef.current.setAttribute('field-of-view', `${fov}deg`);
    }
  }, [zoomLevel, isLoaded]);

  // Reset settings when changing models
  useEffect(() => {
    setZoomLevel(0);
    setActiveTab('overview');
    setActiveHotspot(null);
  }, [currentModel]);

  const [loadProgress, setLoadProgress] = useState(0);
  const [preloadedModels, setPreloadedModels] = useState<Set<string>>(
    new Set()
  );

  // Background Preloading Logic
  useEffect(() => {
    if (!isLoaded) return;

    const preloadNextModels = async () => {
      // Get all models except the current one
      const otherModels = models.filter((m) => m.path !== currentModel);

      // Prioritize neighbor models (next and previous)
      const nextIndex = (currentIndex + 1) % models.length;
      const prevIndex = (currentIndex - 1 + models.length) % models.length;

      const prioritizedPaths = Array.from(
        new Set([
          models[nextIndex].path,
          models[prevIndex].path,
          ...otherModels.map((m) => m.path),
        ])
      );

      for (const path of prioritizedPaths) {
        if (!preloadedModels.has(path) && path !== currentModel) {
          try {
            // Fetch with low priority to not block main thread/interactions
            await fetch(path, { priority: 'low' } as any);
            setPreloadedModels((prev) => new Set(prev).add(path));
            console.log(`Background preloaded: ${path}`);
          } catch (error) {
            console.error(`Failed to preload: ${path}`, error);
          }
        }
      }
    };

    // Start preloading after a short delay to ensure initial model rendering is smooth
    const timer = setTimeout(preloadNextModels, 2000);
    return () => clearTimeout(timer);
  }, [isLoaded, currentModel, preloadedModels]);

  // Find current model index
  const currentIndex = models.findIndex((m) => m.path === currentModel);
  const activeModel = models[currentIndex];

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % models.length;
    setCurrentModel(models[nextIndex].path);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + models.length) % models.length;
    setCurrentModel(models[prevIndex].path);
  };

  // Listen for loading progress
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const onProgress = (event: any) => {
      const progress = event.detail.totalProgress;
      setLoadProgress(progress * 100);
    };

    viewer.addEventListener('progress', onProgress);
    return () => {
      viewer.removeEventListener('progress', onProgress);
    };
  }, [isLoaded, currentModel]);

  // Reset progress when model changes (optional, but good for UI feedback)
  useEffect(() => {
    setLoadProgress(0);
  }, [currentModel]);

  // Handle Hotspot Click
  const handleHotspotClick = (hotspot: Hotspot) => {
    setActiveHotspot(hotspot.name);
    setAutoRotate(false); // Stop rotation to focus

    if (modelViewerRef.current) {
      modelViewerRef.current.cameraTarget = hotspot.position;
      modelViewerRef.current.cameraOrbit = hotspot.orbit;
    }
  };

  return (
    <div className="w-full">
      <div className="flex h-[850px] w-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl">
        {/* Left Information Panel - Cinematic Style */}
        <div className="flex w-[400px] flex-shrink-0 flex-col border-r border-slate-100 bg-white">
          {/* Header */}
          <div className="p-8 pb-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {currentModelData.name}
            </h3>
            <p className="mt-2 text-sm font-medium uppercase tracking-wider text-slate-500">
              {currentModelData.category}
            </p>
          </div>

          {/* Clean Tab Navigation */}
          <div className="px-8">
            <div className="flex w-full border-b border-slate-100">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'specs', label: 'Specs' },
                { id: 'usage', label: 'Usage' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 py-4 text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'text-slate-900'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <p className="text-base leading-relaxed text-slate-600">
                      {currentModelData.description}
                    </p>

                    <div>
                      <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900">
                        Highlights
                      </h4>
                      <ul className="space-y-3">
                        {currentModelData.features.map(
                          (feature: any, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-sm text-slate-600"
                            >
                              <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                <LucideIcons.Check className="h-2.5 w-2.5 text-emerald-600" />
                              </div>
                              {feature}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid gap-4">
                    {Object.entries(currentModelData.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between border-b border-slate-50 py-3 last:border-0"
                        >
                          <span className="text-sm text-slate-500">{key}</span>
                          <span className="text-sm font-semibold text-slate-900">
                            {value as string}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}

                {activeTab === 'usage' && (
                  <div className="space-y-4">
                    {currentModelData.useCases.map(
                      (useCase: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                            <LucideIcons.Target className="h-4 w-4 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">
                            {useCase}
                          </span>
                        </div>
                      )
                    )}
                    <div className="mt-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg">
                      <p className="mb-4 text-sm font-medium text-slate-200">
                        Need a custom 3D implementation?
                      </p>
                      <button className="w-full rounded-lg bg-white py-2.5 text-sm font-bold text-slate-900 transition-transform active:scale-95">
                        Contact Solutions Team
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Viewer - Immersive Canvas */}
        <div className="relative flex min-w-0 flex-1 flex-col bg-slate-100">
          {/* Canvas Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-slate-100 to-slate-200" />

          {/* Subtle Grid Pattern */}
          {showGrid && (
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          )}

          {/* Floating Model Navigation - Replaces Tabs */}
          <div className="absolute left-1/2 top-8 z-10 -translate-x-1/2">
            <div className="flex items-center gap-4 rounded-full border border-white/20 bg-white/60 p-2 shadow-xl backdrop-blur-xl transition-all hover:bg-white/80">
              <button
                onClick={handlePrev}
                className="rounded-full p-2 text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-50"
              >
                <LucideIcons.ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex min-w-[180px] items-center justify-center gap-3 px-2">
                {activeModel && (
                  <>
                    <activeModel.icon className="h-4 w-4 text-slate-900" />
                    <span className="text-sm font-bold text-slate-900">
                      {activeModel.name}
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={handleNext}
                className="rounded-full p-2 text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-50"
              >
                <LucideIcons.ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 3D Viewer Component */}
          <div className="relative h-full w-full">
            {isLoaded ? (
              // @ts-ignore
              <model-viewer
                ref={modelViewerRef}
                src={currentModel}
                camera-controls
                auto-rotate={autoRotate}
                auto-rotate-delay="0"
                rotation-per-second="30deg"
                shadow-intensity="2"
                shadow-softness="0.5"
                environment-image="neutral"
                exposure="1.2"
                camera-orbit="45deg 55deg 105%"
                min-camera-orbit="auto auto 10%"
                max-camera-orbit="auto auto 200%"
                style={{ width: '100%', height: '100%', outline: 'none' }}
              >
                {/* Custom Progress Bar Slot */}
                <div
                  slot="progress-bar"
                  className="absolute inset-x-0 bottom-0 top-0 z-20 flex flex-col items-center justify-center bg-slate-100/50 backdrop-blur-sm transition-opacity duration-300"
                  style={{
                    opacity: loadProgress < 100 ? 1 : 0,
                    pointerEvents: loadProgress < 100 ? 'auto' : 'none',
                  }}
                >
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                      <span>Loading Model</span>
                      <span>{Math.round(loadProgress)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        className="h-full bg-slate-900"
                        initial={{ width: 0 }}
                        animate={{ width: `${loadProgress}%` }}
                        transition={{ ease: 'linear' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Hotspots */}
                {currentModelData.hotspots?.map(
                  (hotspot: Hotspot, idx: number) => (
                    <button
                      key={idx}
                      className="hotspot"
                      slot={`hotspot-${idx}`}
                      data-position={hotspot.position}
                      data-normal={hotspot.normal}
                      data-active={activeHotspot === hotspot.name}
                      onClick={() => handleHotspotClick(hotspot)}
                    >
                      <div className="hotspot-annotation">
                        <div className="mb-1 text-xs font-bold text-slate-900">
                          {hotspot.name}
                        </div>
                        <div className="text-[10px] font-normal leading-tight text-slate-500">
                          {hotspot.description}
                        </div>
                      </div>
                    </button>
                  )
                )}
              </model-viewer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                  <span className="text-sm font-medium text-slate-400">
                    Initializing Viewer...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Floating Controls Pill */}
          <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
            <div className="flex items-center gap-6 rounded-full border border-white/20 bg-white/80 px-6 py-3 shadow-2xl backdrop-blur-xl transition-all hover:scale-105 hover:bg-white">
              {/* Zoom */}
              <div className="flex items-center gap-3">
                <LucideIcons.ZoomIn className="h-4 w-4 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                  className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
                />
              </div>

              <div className="h-4 w-px bg-slate-200" />

              {/* Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`rounded-full p-2 transition-colors ${showGrid ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
                  title="Toggle Grid"
                >
                  <LucideIcons.Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`rounded-full p-2 transition-colors ${autoRotate ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
                  title="Auto Rotate"
                >
                  <LucideIcons.RotateCw
                    className={`h-4 w-4 ${autoRotate ? 'animate-spin' : ''}`}
                  />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(0);
                    setAutoRotate(false);
                    if (modelViewerRef.current) {
                      modelViewerRef.current.setAttribute(
                        'camera-orbit',
                        '45deg 55deg 105%'
                      );
                    }
                  }}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  title="Reset View"
                >
                  <LucideIcons.RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action - Outside */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-16 text-center"
      >
        <BookMeetingButton />
        <p className="mt-4 text-sm font-medium text-slate-500">
          Experience our interactive sales platforms for yourself
        </p>
      </motion.div>
    </div>
  );
};

export default ModelViewerPlatform;
