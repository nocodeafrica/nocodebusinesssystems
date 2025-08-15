'use client'

import { motion } from 'framer-motion'
import { Rocket, Building, TrendingUp, Crown, Check, Star, ArrowRight } from 'lucide-react'

const InvestmentTiers = () => {
  const tiers = [
    {
      name: 'Startup',
      icon: Rocket,
      priceRange: 'From R50,000',
      description: 'Perfect for startups and small businesses ready to automate their core processes and establish a solid digital foundation.',
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      features: [
        'Core business process automation',
        'Customer management system',
        'Basic reporting and analytics',
        'Mobile-responsive design',
        'Email integration',
        '3 months support included'
      ]
    },
    {
      name: 'Small Business',
      icon: Building,
      priceRange: 'R80,000 - R150,000',
      description: 'Comprehensive business management platform for established small businesses looking to scale operations efficiently.',
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      popular: true,
      features: [
        'Advanced workflow automation',
        'Multi-department integration',
        'Custom reporting dashboards',
        'API integrations (accounting, CRM)',
        'Role-based user permissions',
        '6 months support included'
      ]
    },
    {
      name: 'Growing Business',
      icon: TrendingUp,
      priceRange: 'R150,000 - R500,000',
      description: 'Enterprise-ready platform with advanced features for rapidly growing businesses with complex operational needs.',
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      features: [
        'Multi-location support',
        'Advanced analytics and BI',
        'Custom third-party integrations',
        'Automated compliance reporting',
        'Custom modules and features',
        'Priority support (12 months)'
      ]
    },
    {
      name: 'Enterprise',
      icon: Crown,
      priceRange: 'R500,000+',
      description: 'Fully customized enterprise solution with unlimited scalability, advanced security, and dedicated support.',
      color: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      features: [
        'Fully custom development',
        'Enterprise architecture design',
        'Advanced security and compliance',
        'AI/ML integration ready',
        'Dedicated support team',
        'Ongoing strategic consulting'
      ]
    }
  ]

  return (
    <section className="py-12 sm:py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Creative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-20 left-20 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating decorative shapes */}
      <motion.div 
        className="hidden md:block absolute top-40 left-32 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl backdrop-blur-sm border border-white/20"
        animate={{ 
          rotate: [0, 360],
          y: [-10, 10, -10],
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.span 
            className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 lg:mb-8"
            whileHover={{ scale: 1.05 }}
          >
            INVESTMENT TIERS
          </motion.span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-[0.9]">
            <span className="text-gray-900">Right-Sized Solutions</span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              For Every Business
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6 px-4 sm:px-0">
            From startup to enterprise, we have the right solution for your business size, 
            complexity, and growth stage. <span className="font-semibold text-gray-700">Transparent pricing</span> with no hidden costs.
          </p>
          
          {/* Pricing Disclaimer */}
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 sm:px-6 py-3 sm:py-4">
              <p className="text-xs sm:text-sm text-blue-900 text-center">
                <span className="font-semibold">Note:</span> These are estimated price ranges. 
                Final pricing is determined by the specific features, complexity, integrations, 
                and unique requirements of your project. We'll provide a detailed quote after understanding your exact needs.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Clean Pricing Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.6
                }}
                className="relative"
                whileHover={{ y: -5 }}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center shadow-lg">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card with fixed height */}
                <div className={`
                  ${tier.popular 
                    ? 'bg-white border-emerald-200 shadow-xl border-2' 
                    : 'bg-white border-gray-200 shadow-lg border'
                  } 
                  rounded-2xl p-4 sm:p-6 relative overflow-hidden h-auto md:h-[500px] md:max-h-[500px] flex flex-col
                `}>

                  {/* Header */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md`}>
                      <tier.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {tier.name}
                    </h3>
                    
                    <div className={`text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${tier.color} mb-1 sm:mb-2`}>
                      {tier.priceRange}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Complete Solution
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-center mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Key Features - Limited to top 4 */}
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
                    {tier.features.slice(0, 4).map((feature, i) => (
                      <div
                        key={feature}
                        className="flex items-start"
                      >
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-xs sm:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button aligned at bottom */}
                  <div className="mt-auto">
                    <button
                      className={`
                        w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r ${tier.color} text-white rounded-xl text-sm sm:text-base font-semibold 
                        shadow-md hover:shadow-lg transition-all hover:scale-[1.02] min-h-[44px]
                      `}
                    >
                      Get Started with {tier.name}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Simple CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Get Your Custom Quote?
            </h3>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
              Every business is unique. Our pricing is based on the specific features, complexity, 
              and integrations you need. Book a free consultation to discuss your requirements and get an accurate quote.
            </p>
            
            {/* Simple features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[
                { icon: Check, title: "No Hidden Costs", desc: "Transparent pricing upfront" },
                { icon: TrendingUp, title: "Flexible Payment Plans", desc: "Split over milestones" },
                { icon: Crown, title: "ROI Guarantee", desc: "Returns within 6 months" }
              ].map((item, index) => (
                <div key={item.title} className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 min-h-[44px]">
              Get Your Custom Quote
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default InvestmentTiers