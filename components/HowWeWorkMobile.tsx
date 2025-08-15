'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Search, Hammer, TrendingUp, Sparkles, CheckCircle, ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'

const HowWeWorkMobile = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activePhase, setActivePhase] = useState(0)
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const phases = [
    {
      icon: Search,
      number: '01',
      title: 'Understand',
      subtitle: 'Deep Discovery',
      description: 'We map your workflows and identify opportunities.',
      details: [
        'Business process analysis',
        'Requirements gathering',
        'Technical audit',
        'Solution architecture'
      ],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50/50',
      accentColor: '#3B82F6',
      borderColor: 'border-blue-200'
    },
    {
      icon: Hammer,
      number: '02', 
      title: 'Build',
      subtitle: 'Development',
      description: 'Expert team builds your custom solution.',
      details: [
        'Custom development',
        'Data migration',
        'Integration setup',
        'Quality assurance'
      ],
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50/50',
      accentColor: '#6366F1',
      borderColor: 'border-indigo-200'
    },
    {
      icon: TrendingUp,
      number: '03',
      title: 'Evolve',
      subtitle: 'Improvement',
      description: 'Ongoing support and enhancements.',
      details: [
        'Proactive monitoring',
        'Feature updates',
        'Performance optimization',
        'Strategic consulting'
      ],
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50/50',
      accentColor: '#10B981',
      borderColor: 'border-emerald-200'
    },
    {
      icon: Sparkles,
      number: '04',
      title: 'Transform',
      subtitle: 'Evolution',
      description: 'Experience complete digital transformation.',
      details: [
        '10x faster workflows',
        'Cost reduction',
        'Real-time insights',
        'Competitive advantage'
      ],
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50/50',
      accentColor: '#F59E0B',
      borderColor: 'border-orange-200'
    }
  ]

  // Auto-progress through phases
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhase(prev => (prev + 1) % phases.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && activePhase < phases.length - 1) {
      setActivePhase(activePhase + 1)
    }
    if (isRightSwipe && activePhase > 0) {
      setActivePhase(activePhase - 1)
    }
  }

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -30])

  return (
    <section ref={containerRef} className="relative py-16 bg-gradient-to-br from-slate-50/50 to-white overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute top-20 right-4 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-4 w-40 h-40 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-2xl" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-full text-xs font-medium mb-4 shadow-sm"
          >
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            OUR PROCESS
          </motion.span>
          
          <h2 className="text-3xl font-bold mb-3 leading-tight tracking-tight">
            <span className="text-gray-900">How We Work</span>{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              With You
            </span>
          </h2>
          
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            Four strategic phases to transform your business
          </p>
        </motion.div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {phases.map((_, index) => (
            <button
              key={index}
              onClick={() => setActivePhase(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activePhase 
                  ? 'w-8 bg-gradient-to-r from-blue-500 to-indigo-500' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Swipeable Cards Container */}
        <div 
          className="relative h-[420px] mb-8"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {phases.map((phase, index) => {
            const Icon = phase.icon
            const isActive = index === activePhase
            const offset = index - activePhase
            
            return (
              <motion.div
                key={phase.number}
                className="absolute inset-x-4 top-0"
                initial={false}
                animate={{
                  x: `${offset * 105}%`,
                  scale: isActive ? 1 : 0.9,
                  opacity: Math.abs(offset) > 1 ? 0 : 1,
                  zIndex: isActive ? 10 : 5 - Math.abs(offset)
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30 
                }}
              >
                <div 
                  className={`bg-white/90 backdrop-blur-xl rounded-2xl border ${phase.borderColor} shadow-xl overflow-hidden`}
                  onClick={() => setExpandedPhase(expandedPhase === index ? null : index)}
                >
                  {/* Card Header */}
                  <div className={`relative p-6 ${phase.bgColor}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${phase.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-3xl font-black opacity-10" style={{ color: phase.accentColor }}>
                        {phase.number}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {phase.title}
                    </h3>
                    <p className="text-sm font-medium opacity-80" style={{ color: phase.accentColor }}>
                      {phase.subtitle}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {phase.description}
                    </p>

                    {/* Expandable Details */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: expandedPhase === index ? 'auto' : 0,
                        opacity: expandedPhase === index ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pt-2">
                        {phase.details.map((detail, i) => (
                          <motion.div 
                            key={i} 
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * i }}
                          >
                            <CheckCircle 
                              className="w-4 h-4 flex-shrink-0" 
                              style={{ color: phase.accentColor }} 
                            />
                            <span className="text-xs text-gray-700">{detail}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Expand Button */}
                    <button className="flex items-center gap-1 mt-4 text-sm font-medium" style={{ color: phase.accentColor }}>
                      <span>{expandedPhase === index ? 'Show less' : 'Learn more'}</span>
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform ${
                          expandedPhase === index ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Swipe Hint */}
        <motion.div 
          className="text-center text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Swipe or tap dots to explore
        </motion.div>

        {/* Simplified Timeline View (Alternative) */}
        <div className="mt-12 space-y-4">
          <h3 className="text-sm font-semibold text-gray-600 text-center mb-6">Quick Overview</h3>
          {phases.map((phase, index) => {
            const Icon = phase.icon
            return (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${phase.accentColor}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: phase.accentColor }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {phase.number}. {phase.title}
                  </h4>
                  <p className="text-xs text-gray-600">{phase.subtitle}</p>
                </div>
                {index < phases.length - 1 && (
                  <div className="w-px h-8 bg-gray-200 ml-5" />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Ready to transform?
            </h3>
            <p className="text-sm text-gray-600">
              Let's understand your unique challenges
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowWeWorkMobile