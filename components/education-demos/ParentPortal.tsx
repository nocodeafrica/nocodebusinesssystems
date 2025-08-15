'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Calendar, MessageSquare, CreditCard, Clock,
  BookOpen, AlertCircle, CheckCircle, Bell, Download,
  UserCheck, TrendingUp, Star, FileText, MapPin,
  Phone, Mail, Award, Target, Activity, Eye
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

// Children data
const children = [
  {
    id: 1,
    name: 'Thabo Mthembu',
    grade: '11A',
    avatar: 'TM',
    overallGrade: 86,
    attendance: 94,
    nextClass: 'Mathematics',
    nextTime: '10:00 AM',
    recentGrade: 'A-',
    behaviorPoints: 15
  },
  {
    id: 2, 
    name: 'Amara Mthembu',
    grade: '8B',
    avatar: 'AM',
    overallGrade: 78,
    attendance: 88,
    nextClass: 'Natural Sciences',
    nextTime: '11:30 AM',
    recentGrade: 'B+',
    behaviorPoints: 8
  },
  {
    id: 3,
    name: 'Kenzo Mthembu', 
    grade: '5C',
    avatar: 'KM',
    overallGrade: 82,
    attendance: 96,
    nextClass: 'English',
    nextTime: '2:00 PM',
    recentGrade: 'B+',
    behaviorPoints: 12
  }
]

// Homework assignments
const homeworkData = [
  { subject: 'Mathematics', assignment: 'Quadratic Equations - Exercise 4.3', due: 'Today', status: 'pending', teacher: 'Mr. Johnson' },
  { subject: 'Physical Sciences', assignment: 'Newton\'s Laws Lab Report', due: 'Tomorrow', status: 'in_progress', teacher: 'Ms. Patel' },
  { subject: 'English', assignment: 'Poetry Analysis - Langston Hughes', due: 'Friday', status: 'completed', teacher: 'Mrs. van Der Merwe' },
  { subject: 'Life Sciences', assignment: 'Cell Division Diagram', due: 'Monday', status: 'not_started', teacher: 'Dr. Nkomo' },
]

// Messages from teachers
const teacherMessages = [
  {
    id: 1,
    teacher: 'Mr. Johnson',
    subject: 'Mathematics',
    message: 'Thabo showed excellent improvement in today\'s algebra test. Keep up the great work!',
    time: '2 hours ago',
    priority: 'positive',
    read: false
  },
  {
    id: 2,
    teacher: 'Ms. Patel', 
    subject: 'Physical Sciences',
    message: 'Please remind Thabo to bring his lab notebook for tomorrow\'s experiment.',
    time: '1 day ago',
    priority: 'normal',
    read: false
  },
  {
    id: 3,
    teacher: 'Mrs. van Der Merwe',
    subject: 'English',
    message: 'Parent-teacher conference scheduled for Friday at 3:00 PM to discuss Thabo\'s progress.',
    time: '2 days ago',
    priority: 'important',
    read: true
  }
]

// School events
const schoolEvents = [
  {
    id: 1,
    title: 'Science Fair',
    date: '2024-08-15',
    time: '9:00 AM',
    location: 'School Hall',
    description: 'Annual science project exhibition',
    permissionRequired: true,
    cost: 0,
    rsvp: false,
    signed: false
  },
  {
    id: 2,
    title: 'Grade 11 Camp',
    date: '2024-08-22',
    time: '7:00 AM',
    location: 'Drakensberg Mountains',
    description: '3-day educational excursion',
    permissionRequired: true,
    cost: 1250,
    rsvp: false,
    signed: true
  },
  {
    id: 3,
    title: 'Parent-Teacher Evening',
    date: '2024-08-18',
    time: '6:00 PM',
    location: 'School Classrooms',
    description: 'Meet with your child\'s teachers',
    permissionRequired: false,
    cost: 0,
    rsvp: true,
    signed: false
  },
  {
    id: 4,
    title: 'Inter-School Rugby Match',
    date: '2024-08-20',
    time: '2:00 PM',
    location: 'Rugby Fields',
    description: 'Support our team against Pretoria Boys High',
    permissionRequired: false,
    cost: 0,
    rsvp: false,
    signed: false
  }
]

// Fee payments
const feeData = [
  { type: 'School Fees', amount: 2850, due: 'Monthly', status: 'paid', dueDate: '2024-08-01' },
  { type: 'Textbooks', amount: 1200, due: 'One-time', status: 'paid', dueDate: '2024-07-15' },
  { type: 'Sports Equipment', amount: 350, due: 'Annual', status: 'pending', dueDate: '2024-08-30' },
  { type: 'Grade 11 Camp', amount: 1250, due: 'One-time', status: 'pending', dueDate: '2024-08-20' },
]

// Upcoming tests
const upcomingTests = [
  { subject: 'Mathematics', test: 'Functions & Graphs', date: '2024-08-12', weightage: '15%' },
  { subject: 'Physical Sciences', test: 'Mechanics Test', date: '2024-08-14', weightage: '20%' },
  { subject: 'English', test: 'Poetry Exam', date: '2024-08-16', weightage: '10%' },
]

const ParentPortal = () => {
  const [selectedChild, setSelectedChild] = useState(0)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [unreadCount, setUnreadCount] = useState(0)
  const [totalOwed, setTotalOwed] = useState(0)
  const [events, setEvents] = useState(schoolEvents)
  const [messages, setMessages] = useState(teacherMessages)
  const [fees, setFees] = useState(feeData)

  const currentChild = children[selectedChild]

  useEffect(() => {
    // Calculate unread messages
    const unread = messages.filter(m => !m.read).length
    setUnreadCount(unread)

    // Calculate total owed
    const owed = fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0)
    setTotalOwed(owed)
  }, [messages, fees])

  const getHomeworkStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'not_started': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getMessagePriorityColor = (priority: string) => {
    switch(priority) {
      case 'important': return 'border-red-500 bg-red-50'
      case 'positive': return 'border-green-500 bg-green-50'
      case 'normal': return 'border-blue-500 bg-blue-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  const handleSignPermission = (eventId: number) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, signed: !event.signed } : event
    ))
  }

  const handlePayFee = (index: number) => {
    setFees(prev => prev.map((fee, i) => 
      i === index ? { ...fee, status: 'paid' } : fee
    ))
  }

  const handleMarkMessageRead = (messageId: number) => {
    setMessages(prev => prev.map(message => 
      message.id === messageId ? { ...message, read: true } : message
    ))
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Parent Portal</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor your children's academic journey</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* Child Selector */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-2xl border border-indigo-200">
        {children.map((child, index) => (
          <motion.div
            key={child.id}
            onClick={() => setSelectedChild(index)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              selectedChild === index 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
              selectedChild === index ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'
            }`}>
              {child.avatar}
            </div>
            <div>
              <p className="font-medium">{child.name}</p>
              <p className="text-sm opacity-75">Grade {child.grade}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Child Overview Cards */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 border border-indigo-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="text-xs text-green-600 font-medium">+3.2%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentChild.overallGrade}%</p>
          <p className="text-xs text-gray-500">Overall Grade</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-indigo-200"
        >
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentChild.attendance}%</p>
          <p className="text-xs text-gray-500">Attendance</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-indigo-200"
        >
          <Clock className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-lg font-bold text-gray-900">{currentChild.nextTime}</p>
          <p className="text-xs text-gray-500">{currentChild.nextClass}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-indigo-200"
        >
          <Award className="w-5 h-5 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{currentChild.recentGrade}</p>
          <p className="text-xs text-gray-500">Latest Grade</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 border border-indigo-200"
        >
          <Target className="w-5 h-5 text-orange-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{currentChild.behaviorPoints}</p>
          <p className="text-xs text-gray-500">Merit Points</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-4 border border-indigo-200"
        >
          <CreditCard className="w-5 h-5 text-red-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">R{totalOwed.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Outstanding</p>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'homework', label: 'Homework', icon: BookOpen },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'fees', label: 'Fees', icon: CreditCard }
        ].map(tab => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'messages' && unreadCount > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {selectedTab === 'overview' && (
          <>
            <div className="col-span-8">
              <div className="bg-white rounded-2xl p-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tests & Assignments</h3>
                <div className="space-y-3">
                  {upcomingTests.map((test, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{test.subject}</p>
                          <p className="text-sm text-gray-600">{test.test}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{test.date}</p>
                        <p className="text-xs text-gray-600">Weight: {test.weightage}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-4">
              <div className="bg-white rounded-2xl p-5 border border-indigo-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">English Assignment Submitted</p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mathematics Class Attended</p>
                      <p className="text-xs text-gray-600">Today, 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Fee Payment Due</p>
                      <p className="text-xs text-gray-600">Due in 5 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'homework' && (
          <div className="col-span-12">
            <div className="bg-white rounded-2xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Homework & Assignments</h3>
              <div className="space-y-4">
                {homeworkData.map((homework, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{homework.subject}</p>
                          <p className="text-sm text-gray-600">{homework.teacher}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getHomeworkStatusColor(homework.status)}`}>
                          {homework.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">Due: {homework.due}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{homework.assignment}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'messages' && (
          <div className="col-span-12">
            <div className="bg-white rounded-2xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages from Teachers</h3>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`border-l-4 p-4 rounded-lg cursor-pointer transition-all ${getMessagePriorityColor(message.priority)} ${!message.read ? 'shadow-md' : ''}`}
                    onClick={() => handleMarkMessageRead(message.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{message.teacher}</p>
                        <p className="text-sm text-gray-600">{message.subject}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!message.read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                        <span className="text-xs text-gray-500">{message.time}</span>
                        {!message.read && (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700">{message.message}</p>
                    {!message.read && (
                      <p className="text-xs text-gray-500 mt-2 italic">Click to mark as read</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'events' && (
          <div className="col-span-12">
            <div className="bg-white rounded-2xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming School Events</h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.cost > 0 && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                            R{event.cost}
                          </span>
                        )}
                        {event.permissionRequired && (
                          <button 
                            onClick={() => handleSignPermission(event.id)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              event.signed 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                          >
                            {event.signed ? '✓ Permission Signed' : 'Sign Permission Slip'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{event.location}</span>
                    </div>
                    <p className="text-gray-700">{event.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'fees' && (
          <div className="col-span-12">
            <div className="bg-white rounded-2xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Payments & Outstanding Balance</h3>
              <div className="space-y-4">
                {fees.map((fee, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          fee.status === 'paid' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <CreditCard className={`w-5 h-5 ${
                            fee.status === 'paid' ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{fee.type}</p>
                          <p className="text-sm text-gray-600">{fee.due} • Due: {fee.dueDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-900">R{fee.amount.toLocaleString()}</span>
                        {fee.status === 'paid' ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Paid
                          </span>
                        ) : (
                          <button 
                            onClick={() => handlePayFee(index)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ParentPortal