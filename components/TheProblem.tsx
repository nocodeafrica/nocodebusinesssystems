'use client'

import { motion } from 'framer-motion'
import { Database, Users, FileSpreadsheet, TrendingDown, AlertCircle, Layers } from 'lucide-react'

const TheProblem = () => {
  const problems = [
    {
      icon: Database,
      title: 'Your data lives in disconnected silos',
      description: 'Critical information scattered across multiple tools, making it impossible to get a complete picture of your business.',
      color: 'from-red-400 to-orange-400',
      bgPattern: 'radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)',
      delay: 0
    },
    {
      icon: Users,
      title: 'Your team wastes hours on manual, repetitive tasks',
      description: 'Valuable talent spending time on copy-paste work instead of strategic initiatives that drive growth.',
      color: 'from-purple-400 to-pink-400',
      bgPattern: 'radial-gradient(circle at 80% 50%, rgba(192, 132, 252, 0.1) 0%, transparent 50%)',
      delay: 0.2
    },
    {
      icon: FileSpreadsheet,
      title: "Your business runs on spreadsheets that can't scale",
      description: 'Excel files with complex formulas that break, version conflicts, and no real-time collaboration.',
      color: 'from-blue-400 to-cyan-400',
      bgPattern: 'radial-gradient(circle at 50% 100%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)',
      delay: 0.4
    }
  ]

  return (
    <section className="py-16 md:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Creative background elements - simplified for mobile */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[300px] md:w-[600px] h-[300px] md:h-[600px] hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-red-200/20 via-orange-200/20 to-transparent rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="absolute -bottom-40 -left-40 w-[250px] md:w-[500px] h-[250px] md:h-[500px] hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/20 via-pink-200/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Floating shapes - hidden on mobile */}
        <motion.div
          className="absolute top-20 left-[10%] w-20 h-20 bg-gradient-to-br from-orange-300/30 to-red-300/30 rounded-2xl hidden lg:block"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 right-[15%] w-16 h-16 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full hidden lg:block"
          animate={{
            y: [0, 40, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6 md:mb-8"
          >
            <AlertCircle className="w-4 h-4 text-white" />
            <span className="text-white text-xs md:text-sm font-medium tracking-wide">THE CHALLENGE</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-[1.1] md:leading-[0.9] px-2">
            <span className="text-gray-900 block mb-1 md:mb-2">These Problems Are</span>
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Holding You Back
            </span>
          </h2>
          
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Most businesses face the same operational bottlenecks that limit growth. 
            <span className="font-semibold text-gray-700 block md:inline mt-1 md:mt-0"> Recognizing these pain points</span> is the first step.
          </p>
        </motion.div>

        {/* Creative cards layout - optimized for mobile */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connection lines - visible on desktop only */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" style={{ zIndex: 0 }}>
            <motion.path
              d="M 200 150 Q 400 100 600 150"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.path
              d="M 600 250 Q 400 300 200 250"
              stroke="url(#gradient2)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.7 }}
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f87171" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 relative">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100
                }}
                className="group relative"
              >
                {/* Card container optimized for mobile */}
                <div 
                  className="relative bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 h-full overflow-hidden transition-all duration-300 md:hover:scale-[1.02] shadow-lg md:shadow-xl"
                  style={{
                    background: problem.bgPattern,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Hover gradient overlay - desktop only */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 md:group-hover:from-white/50 md:group-hover:to-white/0 transition-all duration-500 rounded-2xl md:rounded-3xl" />
                  
                  {/* Number badge - smaller on mobile */}
                  <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center transform rotate-6 md:rotate-12 md:group-hover:rotate-0 transition-transform duration-300 md:duration-500">
                    <span className="text-lg md:text-2xl font-bold text-gray-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Icon with creative background - smaller on mobile */}
                  <div className="relative mb-4 md:mb-6">
                    <div className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${problem.color} rounded-xl md:rounded-2xl flex items-center justify-center transform -rotate-3 md:-rotate-6 md:group-hover:rotate-0 transition-transform duration-300 md:duration-500`}>
                      <problem.icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                    </div>
                    {/* Icon decoration - hidden on mobile */}
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br ${problem.color} opacity-20 rounded-lg hidden md:block`} />
                  </div>

                  {/* Content - responsive text sizes */}
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight md:group-hover:text-transparent md:group-hover:bg-gradient-to-r md:group-hover:from-gray-900 md:group-hover:to-gray-700 md:group-hover:bg-clip-text transition-all duration-300 md:duration-500">
                    {problem.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed text-xs md:text-sm lg:text-sm">
                    {problem.description}
                  </p>

                  {/* Bottom decoration - desktop only */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
                    <div className={`h-full bg-gradient-to-r ${problem.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA hint - responsive spacing */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-10 md:mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 text-gray-400"
            >
              <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">But there's a better way...</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default TheProblem