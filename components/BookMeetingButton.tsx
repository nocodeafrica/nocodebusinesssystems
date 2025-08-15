'use client'

import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'

const BookMeetingButton = () => {
  const handleBookMeeting = () => {
    // You can integrate with Calendly, Cal.com, or any booking system here
    window.open('https://calendly.com/ncbs-demo/30min', '_blank')
  }

  return (
    <motion.button
      onClick={handleBookMeeting}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Calendar className="w-4 h-4" />
      Book a Meeting
      <ArrowRight className="w-4 h-4" />
    </motion.button>
  )
}

export default BookMeetingButton