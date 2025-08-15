'use client'

const CustomSoftwareSection = () => {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)' // Deep blue to purple matching NCBS brand
    }}>
      <section className="min-h-[600px] md:min-h-[700px] lg:min-h-screen text-white relative overflow-hidden">
        {/* Background decoration - Grid overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            opacity: 0.3
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Navigation - Same as AboutHero */}
          <nav className="py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <a href="/">
                  <img
                    src="/ncbs-logo.png"
                    alt="NCBS"
                    width={150}
                    height={40}
                    className="h-10 w-auto cursor-pointer"
                  />
                </a>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-white/80 hover:text-white transition-colors">Home</a>
                <a href="/about" className="text-white font-semibold">About</a>
                <a href="/services" className="text-white/80 hover:text-white transition-colors">Services</a>
                <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
                <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact Us</a>
                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  Book a Meeting
                </button>
              </div>
            </div>
          </nav>

          {/* Content */}
          <div className="py-6 sm:py-8 md:py-12 lg:py-16">
            <div className="text-center max-w-4xl lg:max-w-5xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-lime-400 border border-lime-400/30 mb-4 sm:mb-6 md:mb-8">
                <span className="text-xs sm:text-sm font-medium">🚀 AI-Powered Development</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
                <span className="block">We Build Custom Software</span>
                <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-lime-400">
                  For Everyday Businesses
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-0">
                In the AI age, your business deserves enterprise-grade custom software.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 md:mb-12 px-4 sm:px-0">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[44px]">
                  Book a Meeting
                </button>
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 transition-all duration-200 transform hover:scale-105 min-h-[44px]">
                  See Work
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-xs sm:max-w-xl md:max-w-2xl mx-auto px-4 sm:px-0">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">100+</div>
                  <div className="text-xs sm:text-sm text-gray-400">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">10x</div>
                  <div className="text-xs sm:text-sm text-gray-400">Faster Development</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">70%</div>
                  <div className="text-xs sm:text-sm text-gray-400">Cost Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CustomSoftwareSection