'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Calendar, BookOpen, DollarSign, MessageSquare,
  Bell, ChevronRight, Clock, AlertTriangle, CheckCircle,
  Star, TrendingUp, FileText, Bus, Apple, Heart,
  Shield, Phone, Mail, MapPin, User
} from 'lucide-react'

// Children data
const children = [
  { 
    id: 1, 
    name: 'Emma Johnson', 
    grade: '7A', 
    school: 'Riverside Middle School',
    avatar: 'EJ',
    color: 'from-purple-500 to-pink-500',
    attendance: 95,
    overallGrade: 'A-'
  },
  { 
    id: 2, 
    name: 'Michael Johnson', 
    grade: '5B', 
    school: 'Oakwood Elementary',
    avatar: 'MJ',
    color: 'from-blue-500 to-cyan-500',
    attendance: 92,
    overallGrade: 'B+'
  }
]

const upcomingEvents = [
  { id: 1, title: 'Parent-Teacher Conference', date: 'Tomorrow, 3:00 PM', type: 'meeting', child: 'Emma', urgent: true },
  { id: 2, title: 'Science Fair', date: 'Mar 15, 9:00 AM', type: 'event', child: 'Michael', urgent: false },
  { id: 3, title: 'Field Trip Permission', date: 'Due Mar 12', type: 'form', child: 'Emma', urgent: true },
  { id: 4, title: 'School Fees Due', date: 'Mar 20', type: 'payment', child: 'Both', urgent: false }
]

const notifications = [
  { id: 1, message: 'Emma scored 95% on her Math test', time: '2 hours ago', type: 'success', icon: Star },
  { id: 2, message: 'Michael was absent yesterday', time: '1 day ago', type: 'warning', icon: AlertTriangle },
  { id: 3, message: 'New homework assigned for Science', time: '3 hours ago', type: 'info', icon: BookOpen },
  { id: 4, message: 'School newsletter available', time: '2 days ago', type: 'info', icon: FileText }
]

const ParentPortalMobile = () => {
  const [selectedChild, setSelectedChild] = useState(children[0])
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'activities' | 'communication'>('overview')
  const [showChildSelector, setShowChildSelector] = useState(false)

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'meeting': return Users
      case 'event': return Calendar
      case 'form': return FileText
      case 'payment': return DollarSign
      default: return Calendar
    }
  }

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-100 text-green-600'
      case 'warning': return 'bg-yellow-100 text-yellow-600'
      case 'info': return 'bg-blue-100 text-blue-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Child Selector */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Parent Portal</h1>
              <p className="text-sm text-gray-500">Welcome back, Sarah</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </motion.button>
          </div>

          {/* Child Selector */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowChildSelector(!showChildSelector)}
            className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${selectedChild.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-sm font-bold">{selectedChild.avatar}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{selectedChild.name}</p>
                  <p className="text-xs text-gray-500">{selectedChild.grade} • {selectedChild.school}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showChildSelector ? 'rotate-90' : ''}`} />
            </div>
          </motion.button>

          {/* Child Selector Dropdown */}
          <AnimatePresence>
            {showChildSelector && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  {children.map(child => (
                    <motion.button
                      key={child.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedChild(child)
                        setShowChildSelector(false)
                      }}
                      className={`w-full p-3 rounded-lg border ${
                        selectedChild.id === child.id 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${child.color} rounded-full flex items-center justify-center`}>
                          <span className="text-white text-sm font-bold">{child.avatar}</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-900">{child.name}</p>
                          <p className="text-xs text-gray-500">{child.grade} • {child.school}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 pb-3">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {(['overview', 'academics', 'activities', 'communication'] as const).map(tab => (
              <motion.button
                key={tab}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-2 rounded-md text-xs font-medium capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                {tab === 'communication' ? 'Messages' : tab}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-xs text-gray-500">Attendance</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedChild.attendance}%</p>
                  <p className="text-xs text-gray-500 mt-1">This term</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-xs text-gray-500">Overall Grade</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{selectedChild.overallGrade}</p>
                  <p className="text-xs text-gray-500 mt-1">Current average</p>
                </motion.div>
              </div>

              {/* Today's Schedule */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-12 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Mathematics</p>
                        <span className="text-xs text-gray-500">8:00 - 8:45</span>
                      </div>
                      <p className="text-xs text-gray-500">Room 204 • Mr. Anderson</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-12 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Science Lab</p>
                        <span className="text-xs text-gray-500">9:00 - 10:30</span>
                      </div>
                      <p className="text-xs text-gray-500">Lab 3 • Ms. Chen</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-12 bg-purple-500 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">English Literature</p>
                        <span className="text-xs text-gray-500">10:45 - 11:30</span>
                      </div>
                      <p className="text-xs text-gray-500">Room 105 • Mrs. Williams</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {upcomingEvents.filter(e => e.child === selectedChild.name || e.child === 'Both').slice(0, 3).map(event => {
                    const Icon = getEventIcon(event.type)
                    return (
                      <motion.div
                        key={event.id}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${event.urgent ? 'bg-red-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${event.urgent ? 'text-red-600' : 'text-blue-600'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                            <p className="text-xs text-gray-500">{event.date}</p>
                          </div>
                        </div>
                        {event.urgent && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">Urgent</span>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Recent Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Recent Updates</h3>
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map(notification => {
                    const Icon = notification.icon
                    return (
                      <div key={notification.id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'academics' && (
            <motion.div
              key="academics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Grade Summary */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Grade Summary</h3>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-2xl font-bold">{selectedChild.overallGrade}</p>
                    <p className="text-xs opacity-80">Overall</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3.7</p>
                    <p className="text-xs opacity-80">GPA</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12th</p>
                    <p className="text-xs opacity-80">Rank</p>
                  </div>
                </div>
              </div>

              {/* Subject Grades */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Subject Performance</h3>
                <div className="space-y-3">
                  {[
                    { subject: 'Mathematics', grade: 'A', score: 92, trend: 'up' },
                    { subject: 'Science', grade: 'A-', score: 88, trend: 'up' },
                    { subject: 'English', grade: 'B+', score: 85, trend: 'stable' },
                    { subject: 'History', grade: 'A', score: 94, trend: 'up' },
                    { subject: 'Art', grade: 'A-', score: 89, trend: 'down' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.subject}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-700">{item.grade}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.subject}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{item.score}%</span>
                          </div>
                        </div>
                      </div>
                      {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {item.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
                      {item.trend === 'stable' && <div className="w-4 h-1 bg-gray-400 rounded" />}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Homework Status */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Homework</h3>
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Math Assignment</span>
                      <span className="text-xs text-yellow-600 font-medium">Due Tomorrow</span>
                    </div>
                    <p className="text-xs text-gray-600">Chapter 7: Quadratic Equations</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Science Project</span>
                      <span className="text-xs text-green-600 font-medium">Submitted</span>
                    </div>
                    <p className="text-xs text-gray-600">Solar System Model</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activities' && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Extra-Curricular */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Extra-Curricular Activities</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Drama Club</p>
                        <p className="text-xs text-gray-500">Every Tuesday, 3:30 PM</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Swimming Team</p>
                        <p className="text-xs text-gray-500">Mon & Thu, 4:00 PM</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Transportation */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Transportation</h3>
                  <Bus className="w-5 h-5 text-gray-400" />
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">School Bus #42</span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Morning Pickup: 7:15 AM</p>
                    <p className="text-xs text-gray-600">Afternoon Drop: 3:45 PM</p>
                    <p className="text-xs text-gray-600">Driver: Mr. Thompson</p>
                  </div>
                </div>
              </div>

              {/* Meals */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Meal Plan</h3>
                  <Apple className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Today's Lunch</span>
                    <span className="text-sm font-medium text-gray-900">Chicken & Rice</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Balance</span>
                    <span className="text-sm font-medium text-green-600">$45.50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Dietary Restrictions</span>
                    <span className="text-sm font-medium text-gray-900">None</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'communication' && (
            <motion.div
              key="communication"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Recent Messages */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Recent Messages</h3>
                <div className="space-y-3">
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Mr. Anderson</p>
                          <p className="text-xs text-gray-500">Math Teacher</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">2h ago</span>
                    </div>
                    <p className="text-sm text-gray-700">Emma did excellent work on today's algebra test. She's showing great improvement!</p>
                  </motion.div>

                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Ms. Chen</p>
                          <p className="text-xs text-gray-500">Science Teacher</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">1d ago</span>
                    </div>
                    <p className="text-sm text-gray-700">Reminder: Science fair project due next week. Emma's volcano model is coming along nicely.</p>
                  </motion.div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Contact</h3>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-blue-50 rounded-lg flex flex-col items-center gap-2"
                  >
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-xs text-gray-700">Call School</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-purple-50 rounded-lg flex flex-col items-center gap-2"
                  >
                    <Mail className="w-5 h-5 text-purple-600" />
                    <span className="text-xs text-gray-700">Email Teacher</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-green-50 rounded-lg flex flex-col items-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <span className="text-xs text-gray-700">Class Chat</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-yellow-50 rounded-lg flex flex-col items-center gap-2"
                  >
                    <Calendar className="w-5 h-5 text-yellow-600" />
                    <span className="text-xs text-gray-700">Schedule Meet</span>
                  </motion.button>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Emergency</h3>
                  <Shield className="w-5 h-5 text-red-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm text-gray-700">School Office</span>
                    <span className="text-sm font-medium text-blue-600">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm text-gray-700">School Nurse</span>
                    <span className="text-sm font-medium text-blue-600">(555) 123-4568</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ParentPortalMobile