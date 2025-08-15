'use client'

import { motion } from 'framer-motion'
import { PhoneCall, Quote, ArrowRight, CheckCircle, Clock, Shield } from 'lucide-react'

const GetStarted = () => {
  const openCalendly = () => {
    window.open("https://calendly.com/your-calendly-link", '_blank', 'width=800,height=600')
  }

  const openQuoteRequest = () => {
    // Replace with actual quote request form or page
    window.open("mailto:hello@ncbs.co.za?subject=Custom Quote Request", '_blank')
  }

  const trustIndicators = [
    {
      icon: Clock,
      title: "2-week first demo",
      description: "See your solution in action quickly"
    },
    {
      icon: Shield,
      title: "6-month ROI guarantee",
      description: "We guarantee measurable returns"
    },
    {
      icon: CheckCircle,
      title: "24/7 dedicated support",
      description: "Always here when you need us"
    }
  ]

  return (
    <section className="relative min-h-[90vh] md:min-h-screen overflow-hidden bg-gradient-to-br from-[#0A0E1A] via-[#0F1629] to-black">
      {/* Subtle Background Elements - optimized for mobile */}
      <div className="absolute inset-0">
        {/* Gradient Orbs - smaller on mobile */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-2xl md:blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-gradient-to-br from-cyan-600/10 to-emerald-600/10 rounded-full blur-2xl md:blur-3xl"
          animate={{ 
            scale: [1.1, 0.9, 1.1],
            opacity: [0.3, 0.4, 0.3],
            x: [0, -20, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Geometric Shapes - hidden on mobile */}
        <motion.div 
          className="absolute top-20 right-20 w-32 h-32 border border-white/10 rotate-45 hidden md:block"
          animate={{ rotate: [45, 135, 45] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-32 left-32 w-24 h-24 border-2 border-cyan-500/20 rounded-full hidden md:block"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 text-white rounded-full text-xs md:text-sm font-bold mb-6 md:mb-8"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 md:mr-3 animate-pulse" />
            START YOUR JOURNEY
          </motion.div>
          
          {/* Main Headline */}
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] md:leading-[0.9] mb-6 md:mb-8 px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white block mb-2">Let's Build Something</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              Amazing Together
            </span>
          </motion.h2>
          
          {/* Subheading */}
          <motion.p 
            className="text-base md:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Transform your business with a custom software solution designed specifically for your needs. 
            <span className="block md:inline"> Let's partner together to unlock your potential and accelerate growth.</span>
          </motion.p>
        </motion.div>

        {/* Main CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-20"
        >
          {/* Primary and Secondary CTAs */}
          <div className="flex flex-col gap-4 md:flex-row md:gap-6 justify-center mb-8 md:mb-12 px-4">
            {/* Primary CTA */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={openCalendly}
              className="group relative px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white rounded-full font-bold text-base md:text-lg shadow-2xl overflow-hidden transition-all duration-300 w-full md:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center">
                <PhoneCall className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                Book a Strategy Call
                <motion.div
                  className="ml-2 md:ml-3"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </motion.div>
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={openQuoteRequest}
              className="px-8 md:px-12 py-4 md:py-5 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-base md:text-lg hover:bg-white/10 transition-all duration-300 w-full md:w-auto"
            >
              <span className="flex items-center justify-center">
                <Quote className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                Get a Custom Quote
              </span>
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto px-4">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon
              return (
                <motion.div
                  key={indicator.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex flex-col items-center text-center group"
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 border border-white/10"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                  </motion.div>
                  <h4 className="text-white font-bold text-base md:text-lg mb-1 md:mb-2">{indicator.title}</h4>
                  <p className="text-white/60 text-xs md:text-sm">{indicator.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="text-center px-4"
        >
          <div className="inline-flex flex-col sm:flex-row items-center px-6 md:px-8 py-3 md:py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="flex items-center mb-2 sm:mb-0">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-400 rounded-full mr-3 md:mr-4 animate-pulse" />
              <span className="text-white/80 text-sm md:text-base mr-2">Ready to start?</span>
            </div>
            <a 
              href="mailto:hello@ncbs.co.za" 
              className="text-cyan-400 hover:text-white underline font-semibold transition-colors text-sm md:text-base"
            >
              hello@ncbs.co.za
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Animation Trigger - hidden on mobile */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          delay: 1.5
        }}
      >
        <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-transparent rounded-full" />
      </motion.div>
    </section>
  )
}

export default GetStarted