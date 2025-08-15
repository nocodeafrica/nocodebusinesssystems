'use client'

import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion'
import { Brain, TrendingUp, Zap, Shield, Layers, Globe, Quote } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const TheSolution = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovered, setIsHovered] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Smooth spring animations for mouse movement
  const springConfig = { damping: 25, stiffness: 150 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set((e.clientX - rect.left) / rect.width)
      mouseY.set((e.clientY - rect.top) / rect.height)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const features = [
    {
      icon: Brain,
      title: "AI-Ready Infrastructure",
      description: "Built to integrate with AI tools and automation from day one",
      gradient: "from-purple-600 to-pink-600",
      glow: "purple",
      type: "feature"
    },
    {
      icon: TrendingUp,
      title: "Scales With You",
      description: "From startup to enterprise, your system grows as you grow",
      gradient: "from-cyan-600 to-blue-600",
      glow: "cyan",
      type: "feature"
    },
    {
      icon: Zap,
      title: "Lightning-Fast",
      description: "Go from chaos to clarity in weeks, not years",
      gradient: "from-emerald-600 to-teal-600",
      glow: "emerald",
      type: "feature"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption",
      gradient: "from-orange-600 to-red-600",
      glow: "orange",
      type: "feature"
    },
    {
      icon: Layers,
      title: "Modular Architecture",
      description: "Add or remove features as your needs evolve",
      gradient: "from-indigo-600 to-purple-600",
      glow: "indigo",
      type: "feature"
    },
    {
      icon: Globe,
      title: "Global Ready",
      description: "Multi-language, multi-currency, multi-timezone support",
      gradient: "from-rose-600 to-pink-600",
      glow: "rose",
      type: "feature"
    },
    {
      icon: Quote,
      quote: true,
      title: "Stop patching problems",
      description: "Build a foundation that lasts",
      gradient: "from-purple-600 to-cyan-600",
      glow: "purple",
      type: "quote"
    }
  ]

  // Define the grid layout pattern for the bento grid - Responsive
  const getGridClass = (index: number) => {
    // Create responsive patterns for mobile and desktop
    const patterns = [
      "col-span-1 row-span-1", // Card 0 - AI-Ready Infrastructure
      "col-span-1 row-span-1", // Card 1 - Scales With You
      "col-span-1 row-span-1", // Card 2 - Lightning-Fast
      "col-span-1 row-span-1", // Card 3 - Enterprise Security
      "col-span-1 row-span-1", // Card 4 - Modular Architecture
      "col-span-1 row-span-1", // Card 5 - Global Ready
      "col-span-1 md:col-span-2 lg:col-span-3 row-span-1", // Card 6 - Quote (responsive width)
    ]
    return patterns[index] || "col-span-1 row-span-1"
  }

  const getCardSize = (index: number) => {
    if (index === 6) return "wide" // Only quote card is wide (spans full width - 3 columns)
    return "normal"
  }

  return (
    <section ref={containerRef} className="relative min-h-screen pt-20 sm:pt-24 md:pt-32 pb-8 overflow-hidden bg-gradient-to-br from-[#0A0E1A] via-[#0F1629] to-black" style={{ position: 'relative' }}>
      {/* Neural Network Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="neural-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="#00D4FF" opacity="0.5" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
          
          {/* Animated Neural Connections */}
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${20 + (i * 10)}%`}
              y1="20%"
              x2={`${30 + (i * 8)}%`}
              y2="80%"
              stroke="url(#neural-gradient)"
              strokeWidth="0.5"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
          
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#00D4FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#8B5FFF" stopOpacity="0" />
          </linearGradient>
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => {
          // Use deterministic values based on index instead of Math.random()
          const left = ((i * 37) % 100)
          const top = ((i * 53) % 100)
          const duration = 10 + (i % 10)
          const delay = i % 5
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
              }}
            />
          )
        })}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Title Section - More compact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-10 px-2 sm:px-4"
        >
          <motion.div
            className="inline-block mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <span className="px-4 py-2 text-sm font-semibold text-cyan-400 border border-cyan-400/30 rounded-full bg-cyan-400/10 backdrop-blur-sm">
              THE SOLUTION
            </span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[0.9]">
            <span className="text-white">We Build</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Custom Business Systems
            </span>
          </h2>
          
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            2025 is the age of AI, and businesses need intelligent digital systems to compete and thrive.
          </motion.p>
        </motion.div>

        {/* Bento Grid Feature Cards - Fixed grid alignment */}
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            style={{
              gridAutoRows: 'minmax(180px, 1fr)'
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              const cardRotateX = useTransform(mouseYSpring, [0, 1], [10, -10])
              const cardRotateY = useTransform(mouseXSpring, [0, 1], [-10, 10])
              
              // Parallax effect for each card
              const parallaxY = useTransform(
                scrollYProgress,
                [0, 1],
                [0, -30 * ((index % 3) + 1) / 3] // Reduced parallax amount
              )
              
              const cardSize = getCardSize(index)
              const gridClass = getGridClass(index)
              
              // Quote card special rendering
              if (feature.type === 'quote') {
                return (
                  <motion.div
                    key={index}
                    className={`relative group ${gridClass}`}
                    onMouseEnter={() => setIsHovered(index)}
                    onMouseLeave={() => setIsHovered(null)}
                    whileHover={{ scale: 1.02, z: 50 }}
                    style={{
                      y: parallaxY,
                      transformStyle: "preserve-3d",
                      rotateX: isHovered === index ? cardRotateX : 0,
                      rotateY: isHovered === index ? cardRotateY : 0,
                    }}
                  >
                    {/* Glow Effect */}
                    <div 
                      className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 bg-gradient-to-r ${feature.gradient}`}
                      style={{
                        transform: "translateZ(-1px)"
                      }}
                    />
                    
                    {/* Card Content - Quote Style */}
                    <div className="relative h-full p-4 sm:p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden flex items-center justify-center">
                      
                      {/* Inner Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 pointer-events-none" />
                      
                      {/* Animated gradient background */}
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: 'radial-gradient(circle at 50% 50%, #8B5FFF 0%, transparent 70%)'
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <div className="relative z-10 text-center">
                        <svg className="w-8 h-8 text-purple-400 opacity-50 mx-auto mb-2">
                          <text x="0" y="28" fontSize="32" fill="currentColor">"</text>
                        </svg>
                        <p className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                            Stop patching problems with temporary fixes.
                          </span>
                          <span className="block text-white mt-2">
                            Build a foundation that lasts.
                          </span>
                        </p>
                      </div>
                      
                      {/* Corner decorations */}
                      <div className="absolute top-3 left-3">
                        <svg className="w-4 h-4 text-cyan-400 opacity-30">
                          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="8" cy="8" r="2" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <svg className="w-4 h-4 text-purple-400 opacity-30">
                          <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                          <rect x="5" y="5" width="6" height="6" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )
              }
              
              // Regular feature cards
              return (
                <motion.div
                  key={index}
                  className={`relative group ${gridClass}`}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                  whileHover={{ scale: 1.02, z: 50 }}
                  style={{
                    y: parallaxY,
                    transformStyle: "preserve-3d",
                    rotateX: isHovered === index ? cardRotateX : 0,
                    rotateY: isHovered === index ? cardRotateY : 0,
                  }}
                >
                  {/* Glow Effect */}
                  <div 
                    className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 bg-gradient-to-r ${feature.gradient}`}
                    style={{
                      transform: "translateZ(-1px)"
                    }}
                  />
                  
                  {/* Card Content */}
                  <div className={`relative h-full p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden flex flex-col`}>
                    
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    
                    {/* Animated Border */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                      style={{
                        background: `linear-gradient(90deg, transparent, ${
                          feature.glow === 'purple' ? '#8B5FFF' : 
                          feature.glow === 'cyan' ? '#00D4FF' : 
                          feature.glow === 'emerald' ? '#10B981' :
                          feature.glow === 'orange' ? '#FB923C' :
                          feature.glow === 'indigo' ? '#6366F1' :
                          '#F43F5E'
                        }, transparent)`,
                        backgroundSize: '200% 100%',
                      }}
                      animate={{
                        backgroundPosition: isHovered === index ? ['200% 0', '-200% 0'] : '200% 0'
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    {/* Icon Container */}
                    <motion.div 
                      className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 mb-3 rounded-xl bg-gradient-to-r ${feature.gradient} p-0.5`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="w-full h-full bg-[#0A0E1A] rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </motion.div>
                    
                    {/* Text Content */}
                    <h3 className={`relative z-10 text-base sm:text-lg font-bold text-white mb-2`}>
                      {feature.title}
                    </h3>
                    
                    <p className={`relative z-10 text-xs sm:text-sm text-gray-400 leading-relaxed flex-grow`}>
                      {feature.description}
                    </p>
                    
                    {/* Neural Nodes - removed since no large cards */}
                    {false && (
                      <div className="absolute bottom-4 right-4 opacity-20">
                        <motion.div
                          className="relative w-16 h-16"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          {[...Array(6)].map((_, i) => {
                            const angle = (i * 60) * Math.PI / 180
                            const x = Math.cos(angle) * 25
                            const y = Math.sin(angle) * 25
                            return (
                              <motion.div
                                key={i}
                                className="absolute w-1.5 h-1.5 bg-purple-500 rounded-full"
                                style={{
                                  left: `calc(50% + ${x.toFixed(2)}px)`,
                                  top: `calc(50% + ${y.toFixed(2)}px)`,
                                  transform: 'translate(-50%, -50%)'
                                }}
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 2,
                                  delay: i * 0.2,
                                  repeat: Infinity
                                }}
                              />
                            )
                          })}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-600 rounded-full" />
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Tech Pattern for wide card - Smaller */}
                    {cardSize === 'wide' && index === 5 && (
                      <div className="absolute bottom-0 right-0 opacity-10">
                        <svg width="120" height="60" viewBox="0 0 120 60">
                          <pattern id="grid-pattern" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                            <rect x="0" y="0" width="15" height="15" fill="none" stroke="white" strokeWidth="0.5"/>
                          </pattern>
                          <rect width="120" height="60" fill="url(#grid-pattern)" />
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default TheSolution