'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Heart, Star, MessageSquare, Gift, 
  Coffee, Wifi, Car, Sparkles, Calendar,
  Clock, MapPin, Phone, Mail, CreditCard,
  Activity, TrendingUp, Award, Zap
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts'

// Guest journey stages
const guestJourney = [
  { stage: 'Discovery', completion: 100, satisfaction: 4.5, touchpoints: 3 },
  { stage: 'Booking', completion: 100, satisfaction: 4.3, touchpoints: 5 },
  { stage: 'Pre-Arrival', completion: 100, satisfaction: 4.6, touchpoints: 4 },
  { stage: 'Check-In', completion: 100, satisfaction: 4.8, touchpoints: 2 },
  { stage: 'Stay', completion: 65, satisfaction: 4.7, touchpoints: 8 },
  { stage: 'Check-Out', completion: 0, satisfaction: null, touchpoints: 2 },
  { stage: 'Post-Stay', completion: 0, satisfaction: null, touchpoints: 3 }
]

// Guest preferences
const guestPreferences = [
  { category: 'Room', preference: 'Ocean View', importance: 95 },
  { category: 'Pillow', preference: 'Memory Foam', importance: 80 },
  { category: 'Minibar', preference: 'Local Wine', importance: 70 },
  { category: 'Breakfast', preference: 'Continental', importance: 85 },
  { category: 'Activities', preference: 'Spa & Wellness', importance: 75 },
  { category: 'Transport', preference: 'Airport Shuttle', importance: 90 }
]

// Sentiment analysis
const sentimentData = [
  { source: 'Check-in Chat', sentiment: 92, messages: 5 },
  { source: 'Room Service', sentiment: 88, messages: 3 },
  { source: 'Concierge', sentiment: 95, messages: 7 },
  { source: 'Restaurant', sentiment: 85, messages: 4 },
  { source: 'Spa Booking', sentiment: 94, messages: 2 }
]

// Personalized offers
const personalizedOffers = [
  { offer: 'Spa Package', match: 92, value: 1250, likelihood: 78 },
  { offer: 'Wine Tasting', match: 85, value: 450, likelihood: 65 },
  { offer: 'Late Checkout', match: 88, value: 350, likelihood: 82 },
  { offer: 'Restaurant Credit', match: 76, value: 500, likelihood: 58 }
]

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

const GuestExperience = () => {
  const [selectedGuest, setSelectedGuest] = useState('M. Ndlovu')
  const [satisfactionScore, setSatisfactionScore] = useState(0)
  const [activeStage, setActiveStage] = useState(4) // Currently in "Stay" stage

  useEffect(() => {
    // Animate satisfaction score
    const timer = setTimeout(() => {
      setSatisfactionScore(4.6)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const currentGuest = {
    name: 'Michael Ndlovu',
    room: '502',
    tier: 'Diamond',
    stays: 12,
    lifetime: 'R125,000',
    checkIn: '2 days ago',
    checkOut: 'In 3 days',
    preferences: 8,
    requests: 3
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Guest Experience Platform</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Personalized Journey Management</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <select className="px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm">
            <option>Michael Ndlovu - Room 502</option>
            <option>Sarah Van Der Merwe - Room 304</option>
            <option>John Khumalo - Suite 701</option>
          </select>
          <button className="px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-emerald-700 transition-colors">
            Send Personalized Offer
          </button>
        </div>
      </div>

      {/* Guest Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="col-span-1 lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-200"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
                {currentGuest.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">{currentGuest.name}</h3>
                <div className="flex items-center gap-1 sm:gap-2 mt-1">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span className="text-xs sm:text-sm font-medium text-yellow-600">{currentGuest.tier}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Room</span>
                <span className="font-medium">#{currentGuest.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Stays</span>
                <span className="font-medium">{currentGuest.stays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lifetime Value</span>
                <span className="font-medium text-green-600">{currentGuest.lifetime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in</span>
                <span className="font-medium">{currentGuest.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out</span>
                <span className="font-medium">{currentGuest.checkOut}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Satisfaction</span>
                <span className="text-sm font-bold text-emerald-600">
                  ⭐ {satisfactionScore.toFixed(1)}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(satisfactionScore / 5) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Guest Journey Timeline */}
        <div className="col-span-1 lg:col-span-9">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Guest Journey Timeline</h3>
            
            {/* Mobile Timeline - Horizontal Scroll */}
            <div className="block lg:hidden">
              <div className="overflow-x-auto scrollbar-hide pb-2">
                <div className="flex gap-3 min-w-max px-1">
                  {guestJourney.map((stage, index) => (
                    <motion.div
                      key={stage.stage}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col items-center"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        index <= activeStage 
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {index === 0 && <MapPin className="w-5 h-5" />}
                        {index === 1 && <Calendar className="w-5 h-5" />}
                        {index === 2 && <Mail className="w-5 h-5" />}
                        {index === 3 && <User className="w-5 h-5" />}
                        {index === 4 && <Heart className="w-5 h-5" />}
                        {index === 5 && <CreditCard className="w-5 h-5" />}
                        {index === 6 && <MessageSquare className="w-5 h-5" />}
                      </div>
                      <p className="text-[10px] font-medium text-gray-700 mt-1 text-center w-16">
                        {stage.stage.split('-').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                      </p>
                      {stage.satisfaction && (
                        <p className="text-[10px] text-emerald-600">⭐ {stage.satisfaction}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${((activeStage + 1) / guestJourney.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1 text-center">
                  Stage {activeStage + 1} of {guestJourney.length}
                </p>
              </div>
            </div>

            {/* Desktop Timeline - Original */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Journey Path */}
                <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 rounded-full" />
                <div 
                  className="absolute top-8 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(activeStage / (guestJourney.length - 1)) * 100}%` }}
                />

                {/* Journey Stages */}
                <div className="relative flex justify-between">
                  {guestJourney.map((stage, index) => (
                    <motion.div
                      key={stage.stage}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                        index <= activeStage 
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {index === 0 && <MapPin className="w-6 h-6" />}
                        {index === 1 && <Calendar className="w-6 h-6" />}
                        {index === 2 && <Mail className="w-6 h-6" />}
                        {index === 3 && <User className="w-6 h-6" />}
                        {index === 4 && <Heart className="w-6 h-6" />}
                        {index === 5 && <CreditCard className="w-6 h-6" />}
                        {index === 6 && <MessageSquare className="w-6 h-6" />}
                      </div>
                      <p className="text-xs font-medium text-gray-700 mt-2 text-center">{stage.stage}</p>
                      {stage.satisfaction && (
                        <p className="text-xs text-emerald-600 mt-1">⭐ {stage.satisfaction}</p>
                      )}
                      <p className="text-xs text-gray-500">{stage.touchpoints} touchpoints</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Stage Details */}
            <div className="mt-4 sm:mt-6 lg:mt-8 p-3 sm:p-4 bg-emerald-50 rounded-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Current Stage</p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">Stay Experience</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                  <div>
                    <p className="text-xs text-gray-600">Duration</p>
                    <p className="text-sm font-bold text-gray-900">2 days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Interactions</p>
                    <p className="text-sm font-bold text-gray-900">8</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Sentiment</p>
                    <p className="text-sm font-bold text-emerald-600">Positive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Guest Preferences */}
        <div className="col-span-1 lg:col-span-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Guest Preferences</h3>
            <div className="space-y-3">
              {guestPreferences.map((pref, index) => (
                <motion.div
                  key={pref.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      pref.importance > 85 ? 'bg-emerald-500' : 
                      pref.importance > 75 ? 'bg-teal-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{pref.category}</p>
                      <p className="text-[10px] sm:text-xs text-gray-600">{pref.preference}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        style={{ width: `${pref.importance}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{pref.importance}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="col-span-1 lg:col-span-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Sentiment Analysis</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="source" fontSize={10} angle={-45} textAnchor="end" height={60} />
                <YAxis fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="sentiment" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-gray-600">Overall: </span>
                <span className="text-sm font-bold text-emerald-600">91% Positive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Offers */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Smart Recommendations</h3>
            <div className="space-y-3">
              {personalizedOffers.map((offer, index) => (
                <motion.div
                  key={offer.offer}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-900">{offer.offer}</span>
                    <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-600 text-white rounded-full">
                      {offer.match}% match
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-gray-600">Value: R{offer.value}</span>
                    <span className="text-emerald-600 font-medium">
                      {offer.likelihood}% likely to accept
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestExperience