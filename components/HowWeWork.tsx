'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Search, Hammer, TrendingUp, Sparkles, CheckCircle, ArrowDown } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const HowWeWorkMobile = dynamic(() => import('./HowWeWorkMobile'), { 
  ssr: false,
  loading: () => <div className="py-16 bg-gradient-to-br from-slate-50/50 to-white" />
})

const HowWeWork = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    return <HowWeWorkMobile />
  }

  return <HowWeWorkDesktop />
}

const HowWeWorkDesktop = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const phases = [
    {
      icon: Search,
      number: '01',
      title: 'Understand',
      subtitle: 'Deep Discovery & Strategy',
      description: 'We start by understanding your business inside and out. Through comprehensive consultation, we map your workflows and identify opportunities.',
      details: [
        'Business process analysis',
        'Requirements gathering',
        'Technical audit',
        'Solution architecture'
      ],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50/50',
      accentColor: '#3B82F6',
      borderColor: 'border-blue-100'
    },
    {
      icon: Hammer,
      number: '02', 
      title: 'Build',
      subtitle: 'Development & Migration',
      description: 'Our expert team builds your custom solution using modern technologies, ensuring a seamless transition from existing systems.',
      details: [
        'Custom development',
        'Data migration',
        'Integration setup',
        'Quality assurance'
      ],
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50/50',
      accentColor: '#6366F1',
      borderColor: 'border-indigo-100'
    },
    {
      icon: TrendingUp,
      number: '03',
      title: 'Evolve',
      subtitle: 'Continuous Improvement',
      description: 'Your business evolves, and so should your software. We provide ongoing support and strategic enhancements.',
      details: [
        'Proactive monitoring',
        'Feature updates',
        'Performance optimization',
        'Strategic consulting'
      ],
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50/50',
      accentColor: '#10B981',
      borderColor: 'border-emerald-100'
    },
    {
      icon: Sparkles,
      number: '04',
      title: 'Transform',
      subtitle: 'Complete Digital Evolution',
      description: 'Experience the full transformation as your new system revolutionizes operations and drives unprecedented growth.',
      details: [
        '10x faster workflows',
        'Cost reduction',
        'Real-time insights',
        'Competitive advantage'
      ],
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50/50',
      accentColor: '#F59E0B',
      borderColor: 'border-orange-100'
    }
  ]

  // Timeline progress animation
  const timelineProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 100])
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <section ref={containerRef} className="relative py-32 bg-gradient-to-br from-slate-50/50 to-white overflow-hidden" style={{ position: 'relative' }}>
      {/* Minimalist Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full">
            <pattern id="subtle-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#6366F1" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#subtle-grid)" />
          </svg>
        </div>

        {/* Floating Geometric Elements */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute top-32 right-[10%] w-64 h-64 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl" />
          <div className="absolute bottom-32 left-[10%] w-80 h-80 bg-gradient-to-br from-emerald-100/20 to-teal-100/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-orange-100/10 to-amber-100/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-full text-sm font-medium mb-8 shadow-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            OUR PROCESS
          </motion.span>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[0.9] tracking-tight">
            <span className="text-gray-900">How We Work</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              With You
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A refined four-phase approach that transforms your business through 
            <span className="font-semibold text-gray-800"> strategic digital innovation</span>
          </p>
        </motion.div>

        {/* Modern Timeline Layout */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-px h-full">
            {/* Static Line */}
            <div className="w-full h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
            
            {/* Animated Progress Line */}
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full"
              style={{ height: `${timelineProgress}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>

          {/* Phase Cards */}
          {phases.map((phase, index) => {
            const Icon = phase.icon
            const isEven = index % 2 === 0
            
            return (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, x: isEven ? -60 : 60, y: 40 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                className={`relative flex items-center mb-24 ${
                  isEven ? 'justify-start' : 'justify-end'
                }`}
                onMouseEnter={() => setHoveredPhase(index)}
                onMouseLeave={() => setHoveredPhase(null)}
              >
                {/* Timeline Node */}
                <motion.div 
                  className="absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 z-20"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="relative">
                    {/* Outer Glow Ring */}
                    <motion.div 
                      className={`absolute inset-0 w-16 h-16 bg-gradient-to-r ${phase.color} rounded-full blur-sm`}
                      animate={hoveredPhase === index ? { 
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3]
                      } : { scale: 1, opacity: 0.3 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Main Node */}
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${phase.color} rounded-full flex items-center justify-center shadow-xl border-4 border-white`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    {/* Phase Number */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      <span className="inline-block px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-600 rounded-full border border-gray-200/50 shadow-sm">
                        {phase.number}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Card Content */}
                <motion.div
                  className={`w-full max-w-lg ${isEven ? 'pr-24' : 'pl-24'}`}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {/* Glass Card */}
                  <div className={`relative bg-white/70 backdrop-blur-xl rounded-2xl border ${phase.borderColor} shadow-xl overflow-hidden group`}>
                    {/* Subtle Background Pattern */}
                    <div className={`absolute inset-0 ${phase.bgColor} opacity-50`}></div>
                    
                    {/* Content */}
                    <div className="relative p-8">
                      {/* Header */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {phase.title}
                        </h3>
                        <p className="text-lg font-medium opacity-80" style={{ color: phase.accentColor }}>
                          {phase.subtitle}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {phase.description}
                      </p>

                      {/* Details List */}
                      <div className="space-y-3">
                        {phase.details.map((detail, i) => (
                          <motion.div 
                            key={i} 
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i + 0.3 }}
                          >
                            <div className="w-6 h-6 rounded-full bg-white/80 border-2 flex items-center justify-center shadow-sm" style={{ borderColor: phase.accentColor }}>
                              <CheckCircle className="w-3.5 h-3.5" style={{ color: phase.accentColor }} />
                            </div>
                            <span className="text-gray-700 font-medium">{detail}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Hover Effect Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      />
                    </div>

                    {/* Card Number Watermark */}
                    <div 
                      className="absolute top-4 right-4 text-6xl font-black opacity-5"
                      style={{ color: phase.accentColor }}
                    >
                      {phase.number}
                    </div>
                  </div>

                  {/* Connecting Arrow for Next Phase */}
                  {index < phases.length - 1 && (
                    <motion.div 
                      className="flex justify-center mt-8"
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200/50 flex items-center justify-center shadow-sm">
                        <ArrowDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-20"
        >
          <div className="inline-block p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to begin your transformation?
            </h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Let's start with understanding your unique business challenges and opportunities
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowWeWork