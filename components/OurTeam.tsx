'use client'

import { motion } from 'framer-motion'

const OurTeam = () => {
  const team = [
    {
      name: 'Sarah Ngozi',
      role: 'Managing Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
    },
    {
      name: 'James Okonkwo',
      role: 'Director of Technology',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      name: 'Amara Dlamini',
      role: 'Director of Operations',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop'
    },
    {
      name: 'Michael Adeyemi',
      role: 'Director of Marketing',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop'
    }
  ]

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Meet Our Team
          </h2>
        </motion.div>

        {/* Team Grid - Mobile optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 px-2">{member.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 px-2">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurTeam