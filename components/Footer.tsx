'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, ArrowRight, Code, Database, Smartphone, Globe } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const services = [
    { name: 'Custom Software Development', href: '#services' },
    { name: 'Business Process Automation', href: '#services' },
    { name: 'System Integration', href: '#services' },
    { name: 'Data Migration', href: '#services' },
    { name: 'Cloud Solutions', href: '#services' },
    { name: 'Mobile Applications', href: '#services' }
  ]

  const industries = [
    { name: 'Healthcare', href: '#industries' },
    { name: 'Education', href: '#industries' },
    { name: 'Hospitality', href: '#industries' },
    { name: 'Real Estate', href: '#industries' },
    { name: 'Legal Services', href: '#industries' },
    { name: 'Manufacturing', href: '#industries' }
  ]

  const company = [
    { name: 'About Us', href: '#about' },
    { name: 'Our Team', href: '#team' },
    { name: 'Case Studies', href: '#portfolio' },
    { name: 'Careers', href: '#careers' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' }
  ]

  const legal = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Data Protection', href: '/data-protection' }
  ]

  return (
    <footer className="relative overflow-hidden">
      {/* Creative Wave Top Border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg 
          className="relative block w-full h-20 md:h-32" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <motion.path 
            d="M0,0V46.29C47.79,22.85,103.59,32.78,158.09,20.72C226.47,4.51,296.71,15.11,358.09,37.56C419.97,60.19,475.79,70.51,538.09,54.29C600.87,38.02,658.71,48.85,720.09,60.72C781.97,72.71,843.79,83.51,906.09,75.56C968.87,67.51,1025.71,78.85,1087.09,86.72C1126.97,91.71,1167.79,93.51,1200,92.29V0Z"
            className="fill-white"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Background with animated gradient */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative">
        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-40 left-10 sm:left-20 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl sm:blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-40 right-10 sm:right-20 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl sm:blur-3xl"
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.4, 0.6, 0.4],
              x: [0, -40, 0],
              y: [0, 30, 0]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Newsletter Section with Creative Background */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-10 md:pb-16"
          >
            <div className="bg-white/5 backdrop-blur-2xl rounded-xl sm:rounded-2xl md:rounded-[2rem] p-4 sm:p-8 md:p-16 pt-8 sm:pt-8 md:pt-16 border border-white/10 shadow-2xl relative overflow-visible max-w-4xl mx-auto mb-6 sm:mb-10 md:mb-16">
              
              {/* Floating newsletter icon */}
              <motion.div 
                className="absolute -top-5 sm:-top-6 md:-top-8 left-1/2 transform -translate-x-1/2 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl z-10"
                animate={{ 
                  y: [-3, 3, -3],
                  rotate: [-2, 2, -2]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Mail className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </motion.div>

              <div className="text-center">
                <motion.h3 
                  className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-5 md:mb-6 px-2 mt-2 sm:mt-0"
                  whileHover={{ scale: 1.05 }}
                >
                  Stay Updated with the Latest in Business Technology
                </motion.h3>
                
                <motion.p 
                  className="text-xs sm:text-sm md:text-lg text-blue-100 mb-4 sm:mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Get insights, case studies, and tips delivered to your inbox. 
                  No spam, just valuable content to help your business thrive.
                </motion.p>
                
                {/* Enhanced Newsletter Form */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 max-w-lg mx-auto px-2">
                  <motion.input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all text-xs sm:text-sm md:text-base"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl md:rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center relative overflow-hidden group text-xs sm:text-sm md:text-base"
                  >
                    <span className="relative z-10">Subscribe</span>
                    <motion.div
                      className="ml-1 sm:ml-2 relative z-10"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ scale: 0, borderRadius: "100%" }}
                      whileHover={{ scale: 1, borderRadius: "1rem" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Footer Content */}
          <div className="pb-6 sm:pb-10 md:pb-16">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-12">
              
              {/* Company Info with Enhanced Design */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="col-span-2 sm:col-span-2 lg:col-span-2"
              >
                <div className="mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="mb-6"
                  >
                    <Image
                      src="/ncbs-logo.png"
                      alt="NCBS Logo"
                      width={200}
                      height={60}
                      className="h-10 sm:h-12 md:h-14 w-auto mb-4 sm:mb-6"
                    />
                  </motion.div>
                  
                  <motion.p 
                    className="text-blue-100 leading-relaxed mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-lg hidden sm:block"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    NoCode Business Systems builds custom software solutions for South African businesses. 
                    We help companies streamline operations, automate processes, and scale efficiently 
                    with modern, AI-ready technology.
                  </motion.p>
                </div>

                {/* Enhanced Contact Info */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-8 md:mb-10 hidden sm:block">
                  {[
                    { icon: Mail, text: "hello@ncbs.co.za", href: "mailto:hello@ncbs.co.za", color: "from-blue-500 to-cyan-500" },
                    { icon: Phone, text: "+27 (12) 345-6789", href: "tel:+27123456789", color: "from-emerald-500 to-teal-500" },
                    { icon: MapPin, text: "Cape Town & Johannesburg, South Africa", href: null, color: "from-purple-500 to-pink-500" }
                  ].map((contact, index) => (
                    <motion.div 
                      key={contact.text}
                      className="flex items-center group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <motion.div 
                        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r ${contact.color} rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 md:mr-4 shadow-lg flex-shrink-0`}
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <contact.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                      </motion.div>
                      {contact.href ? (
                        <a 
                          href={contact.href} 
                          className="text-blue-100 hover:text-white transition-colors font-medium text-xs sm:text-sm md:text-base break-all"
                        >
                          {contact.text}
                        </a>
                      ) : (
                        <span className="text-blue-100 font-medium text-xs sm:text-sm md:text-base">{contact.text}</span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Floating Social Icons */}
                <motion.div 
                  className="flex space-x-2 sm:space-x-3 md:space-x-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  {[
                    { icon: Linkedin, href: "#", color: "hover:bg-blue-600", name: "LinkedIn" },
                    { icon: Twitter, href: "#", color: "hover:bg-blue-400", name: "Twitter" },
                    { icon: Facebook, href: "#", color: "hover:bg-blue-600", name: "Facebook" }
                  ].map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center ${social.color} transition-all border border-white/20 shadow-lg`}
                      whileHover={{ 
                        scale: 1.1,
                        y: -5,
                        rotate: 360
                      }}
                      whileTap={{ scale: 0.9 }}
                      animate={{ 
                        y: [0, -3, 0],
                        rotate: [0, 2, 0, -2, 0]
                      }}
                      transition={{ 
                        duration: 4 + index,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <social.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>

              {/* Services Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="hidden sm:block"
              >
                <h3 className="text-sm sm:text-base md:text-xl font-black text-white mb-3 sm:mb-4 md:mb-8">Services</h3>
                <ul className="space-y-1.5 sm:space-y-2 md:space-y-4">
                  {services.map((service, index) => (
                    <motion.li 
                      key={service.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <motion.a
                        href={service.href}
                        className="text-blue-200 hover:text-white transition-colors flex items-center group text-xs sm:text-sm md:text-lg"
                        whileHover={{ 
                          x: 5,
                          textShadow: "0 0 10px rgba(59, 130, 246, 0.5)"
                        }}
                      >
                        <motion.div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 sm:mr-3 md:mr-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.5 }}
                        />
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 opacity-0 group-hover:opacity-100 transition-all" />
                        {service.name}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Industries Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="hidden sm:block"
              >
                <h3 className="text-sm sm:text-base md:text-xl font-black text-white mb-3 sm:mb-4 md:mb-8">Industries</h3>
                <ul className="space-y-1.5 sm:space-y-2 md:space-y-4">
                  {industries.map((industry, index) => (
                    <motion.li 
                      key={industry.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <motion.a
                        href={industry.href}
                        className="text-blue-200 hover:text-white transition-colors flex items-center group text-xs sm:text-sm md:text-lg"
                        whileHover={{ 
                          x: 5,
                          textShadow: "0 0 10px rgba(59, 130, 246, 0.5)"
                        }}
                      >
                        <motion.div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-2 sm:mr-3 md:mr-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.5 }}
                        />
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 opacity-0 group-hover:opacity-100 transition-all" />
                        {industry.name}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Company Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="hidden sm:block sm:col-span-2 lg:col-span-1"
              >
                <h3 className="text-sm sm:text-base md:text-xl font-black text-white mb-3 sm:mb-4 md:mb-8">Company</h3>
                <ul className="space-y-1.5 sm:space-y-2 md:space-y-4">
                  {company.map((item, index) => (
                    <motion.li 
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <motion.a
                        href={item.href}
                        className="text-blue-200 hover:text-white transition-colors flex items-center group text-xs sm:text-sm md:text-lg"
                        whileHover={{ 
                          x: 5,
                          textShadow: "0 0 10px rgba(59, 130, 246, 0.5)"
                        }}
                      >
                        <motion.div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2 sm:mr-3 md:mr-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.5 }}
                        />
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 opacity-0 group-hover:opacity-100 transition-all" />
                        {item.name}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Technology Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 sm:mt-12 md:mt-20 pt-6 sm:pt-8 md:pt-12 border-t border-white/10 hidden sm:block"
            >
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <motion.h3 
                  className="text-lg sm:text-xl md:text-2xl font-black text-white mb-4 sm:mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  Built with Modern Technology
                </motion.h3>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8">
                  {[
                    { icon: Code, text: "React & Next.js", color: "text-blue-400" },
                    { icon: Database, text: "Cloud Infrastructure", color: "text-emerald-400" },
                    { icon: Smartphone, text: "Mobile-First Design", color: "text-purple-400" },
                    { icon: Globe, text: "Global Scale", color: "text-orange-400" }
                  ].map((tech, index) => (
                    <motion.div 
                      key={tech.text}
                      className="flex items-center bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-5 md:px-6 py-2 sm:py-3 md:py-4 border border-white/10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: "rgba(255,255,255,0.1)"
                      }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                      >
                        <tech.icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${tech.color} mr-2 sm:mr-3`} />
                      </motion.div>
                      <span className="text-blue-100 font-semibold text-xs sm:text-sm md:text-base">{tech.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar with Creative Design */}
          <div className="py-4 sm:py-6 md:py-8 border-t border-white/10">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-3 sm:gap-4 md:gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <p className="text-blue-200 text-xs sm:text-sm md:text-lg font-medium">
                  © {currentYear} NoCode Business Systems (Pty) Ltd. All rights reserved.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center lg:justify-end gap-3 sm:gap-4 md:gap-8 hidden sm:flex"
              >
                {legal.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="text-blue-200 hover:text-white font-medium transition-colors text-xs sm:text-sm md:text-base"
                    whileHover={{ 
                      scale: 1.05,
                      textShadow: "0 0 10px rgba(59, 130, 246, 0.5)"
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer