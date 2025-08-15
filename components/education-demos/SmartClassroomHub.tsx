'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Video, Users, Hand, MessageSquare, Monitor, 
  Mic, MicOff, VideoOff, Settings, Share2,
  Clock, UserCheck, Activity, Target, Zap,
  ChevronRight, Eye, EyeOff, Volume2, VolumeX
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

// Student data with engagement levels
const students = [
  { id: 1, name: 'Thabo Mthembu', avatar: 'TM', status: 'active', engagement: 92, handRaised: false, micOn: true, cameraOn: true },
  { id: 2, name: 'Sarah van Der Merwe', avatar: 'SV', status: 'active', engagement: 88, handRaised: true, micOn: false, cameraOn: true },
  { id: 3, name: 'Kwame Asante', avatar: 'KA', status: 'active', engagement: 76, handRaised: false, micOn: false, cameraOn: true },
  { id: 4, name: 'Amara Okafor', avatar: 'AO', status: 'active', engagement: 94, handRaised: false, micOn: false, cameraOn: true },
  { id: 5, name: 'Daniel Botha', avatar: 'DB', status: 'inactive', engagement: 45, handRaised: false, micOn: false, cameraOn: false },
  { id: 6, name: 'Lerato Mokoena', avatar: 'LM', status: 'active', engagement: 85, handRaised: false, micOn: false, cameraOn: true },
  { id: 7, name: 'Ravi Patel', avatar: 'RP', status: 'active', engagement: 91, handRaised: false, micOn: false, cameraOn: true },
  { id: 8, name: 'Zinhle Dlamini', avatar: 'ZD', status: 'away', engagement: 62, handRaised: false, micOn: false, cameraOn: true },
]

// Engagement data over time
const engagementData = [
  { time: '09:00', average: 85, individual: 78 },
  { time: '09:15', average: 88, individual: 82 },
  { time: '09:30', average: 92, individual: 89 },
  { time: '09:45', average: 86, individual: 84 },
  { time: '10:00', average: 90, individual: 88 },
  { time: '10:15', average: 94, individual: 91 },
  { time: '10:30', average: 89, individual: 85 },
]

// Breakout rooms data
const breakoutRooms = [
  { id: 1, name: 'Room 1 - Algebra', members: ['Thabo M.', 'Sarah V.'], topic: 'Quadratic Equations', progress: 75 },
  { id: 2, name: 'Room 2 - Geometry', members: ['Kwame A.', 'Amara O.'], topic: 'Circle Theorems', progress: 60 },
  { id: 3, name: 'Room 3 - Statistics', members: ['Lerato M.', 'Ravi P.'], topic: 'Data Analysis', progress: 85 },
  { id: 4, name: 'Room 4 - Review', members: ['Zinhle D.'], topic: 'Catch-up Session', progress: 40 },
]

// Hand raise queue
const handRaiseQueue = [
  { id: 2, name: 'Sarah van Der Merwe', question: 'Can you explain the quadratic formula again?', time: '2 min ago' },
]

// Attendance data
const attendanceData = [
  { status: 'Present', count: 6, color: '#10b981' },
  { status: 'Late', count: 1, color: '#f59e0b' },
  { status: 'Absent', count: 1, color: '#ef4444' },
]

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

const SmartClassroomHub = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedBreakoutRoom, setSelectedBreakoutRoom] = useState<number | null>(null)
  const [whiteboardActive, setWhiteboardActive] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)
  const [avgEngagement, setAvgEngagement] = useState(0)
  const [viewMode, setViewMode] = useState<'gallery' | 'speaker'>('gallery')
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Animate engagement score
    const activeStudents = students.filter(s => s.status === 'active')
    const targetEngagement = Math.round(
      activeStudents.reduce((sum, s) => sum + s.engagement, 0) / activeStudents.length
    )
    
    const timer = setTimeout(() => {
      setAvgEngagement(targetEngagement)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return 'border-green-500 bg-green-50'
    if (engagement >= 60) return 'border-yellow-500 bg-yellow-50'
    return 'border-red-500 bg-red-50'
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'inactive': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Smart Classroom Hub</h2>
          <p className="text-sm text-gray-600 mt-1">Grade 11 Mathematics • Quadratic Functions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-gray-600">Class Duration: 45 min</p>
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg transition-colors ${screenSharing ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              onClick={() => setScreenSharing(!screenSharing)}>
              <Share2 className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg transition-colors ${whiteboardActive ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
              onClick={() => setWhiteboardActive(!whiteboardActive)}>
              <Monitor className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Bar */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-3 sm:p-4 border border-blue-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.status === 'active').length}</p>
          <p className="text-xs text-gray-500">Active Students</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-3 sm:p-4 border border-blue-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">+5%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgEngagement}%</p>
          <p className="text-xs text-gray-500">Avg Engagement</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-3 sm:p-4 border border-blue-200"
        >
          <Hand className="w-5 h-5 text-yellow-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{handRaiseQueue.length}</p>
          <p className="text-xs text-gray-500">Hands Raised</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-3 sm:p-4 border border-blue-200"
        >
          <MessageSquare className="w-5 h-5 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-500">Breakout Rooms</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-3 sm:p-4 border border-blue-200"
        >
          <UserCheck className="w-5 h-5 text-indigo-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">75%</p>
          <p className="text-xs text-gray-500">Attendance</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-3 sm:p-4 border border-blue-200"
        >
          <Clock className="w-5 h-5 text-orange-600 mb-2" />
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">32m</p>
          <p className="text-[10px] sm:text-xs text-gray-500">Remaining</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Main Video Grid */}
        <div className="col-span-1 lg:col-span-8">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-blue-200 mb-4 lg:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Live Classroom</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <button 
                  onClick={() => setViewMode('gallery')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    viewMode === 'gallery' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Gallery
                </button>
                <button 
                  onClick={() => setViewMode('speaker')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    viewMode === 'speaker' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Speaker
                </button>
              </div>
            </div>

            {/* Student Video Grid */}
            {viewMode === 'gallery' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
                {students.slice(0, 8).map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative aspect-video rounded-lg border-2 ${getEngagementColor(student.engagement)} overflow-hidden`}
                  >
                    {student.cameraOn ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <div className="text-white font-bold text-lg sm:text-xl lg:text-2xl">{student.avatar}</div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <VideoOff className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                    )}

                    {/* Student Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs truncate">{student.name.split(' ')[0]}</span>
                        <div className="flex items-center gap-1">
                          {student.handRaised && (
                            <Hand className="w-3 h-3 text-yellow-400 animate-pulse" />
                          )}
                          {!student.micOn && <MicOff className="w-3 h-3 text-red-400" />}
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(student.status)}`} />
                        </div>
                      </div>
                    </div>

                    {/* Engagement Indicator */}
                    <div className="absolute top-2 right-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        student.engagement >= 80 ? 'bg-green-500 text-white' :
                        student.engagement >= 60 ? 'bg-yellow-500 text-black' :
                        'bg-red-500 text-white'
                      }`}>
                        {student.engagement}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mb-4">
                {/* Speaker View - Large main speaker */}
                <div className="mb-4">
                  {(() => {
                    const speakingStudent = students.find(s => s.handRaised) || students[0]
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative aspect-video rounded-lg border-3 ${getEngagementColor(speakingStudent.engagement)} overflow-hidden`}
                      >
                        {speakingStudent.cameraOn ? (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <div className="text-white font-bold text-6xl">{speakingStudent.avatar}</div>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <VideoOff className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Speaker Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-medium">{speakingStudent.name}</span>
                              {speakingStudent.handRaised && (
                                <span className="ml-2 text-yellow-400 text-sm">• Currently Speaking</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {speakingStudent.handRaised && (
                                <Hand className="w-5 h-5 text-yellow-400 animate-pulse" />
                              )}
                              {!speakingStudent.micOn && <MicOff className="w-5 h-5 text-red-400" />}
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(speakingStudent.status)}`} />
                            </div>
                          </div>
                        </div>
                        
                        {/* Engagement Score */}
                        <div className="absolute top-4 right-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                            speakingStudent.engagement >= 80 ? 'bg-green-500 text-white' :
                            speakingStudent.engagement >= 60 ? 'bg-yellow-500 text-black' :
                            'bg-red-500 text-white'
                          }`}>
                            {speakingStudent.engagement}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })()}
                </div>
                
                {/* Small participant thumbnails */}
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1 sm:gap-2">
                  {students.filter(s => s.id !== (students.find(s => s.handRaised) || students[0]).id).slice(0, 8).map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={`relative aspect-video rounded border ${student.status === 'active' ? 'border-green-300' : 'border-gray-300'} overflow-hidden cursor-pointer hover:border-blue-400 transition-colors`}
                      onClick={() => {
                        // In a real app, this would switch the main speaker
                        console.log(`Switch to ${student.name} as speaker`)
                      }}
                    >
                      {student.cameraOn ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <div className="text-white font-bold text-xs">{student.avatar}</div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <VideoOff className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Mini status indicators */}
                      <div className="absolute bottom-0 right-0 flex items-center gap-0.5 p-0.5">
                        {student.handRaised && (
                          <Hand className="w-2 h-2 text-yellow-400" />
                        )}
                        {!student.micOn && <MicOff className="w-2 h-2 text-red-400" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}


            {/* Interactive Whiteboard Area */}
            {whiteboardActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 200 }}
                className="bg-white border-2 border-dashed border-indigo-300 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Interactive Whiteboard</h4>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">Pen</button>
                    <button className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">Eraser</button>
                  </div>
                </div>
                <div className="h-32 bg-gray-50 rounded border-2 border-gray-200 flex items-center justify-center">
                  <p className="text-gray-400">y = ax² + bx + c</p>
                </div>
              </motion.div>
            )}

            {/* Screen Sharing Area */}
            {screenSharing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 160 }}
                className="bg-gray-900 rounded-lg p-4 text-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Screen Share Active</h4>
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="h-24 bg-gray-800 rounded flex items-center justify-center">
                  <p className="text-gray-400">Mathematics Textbook - Chapter 4: Quadratic Functions</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Engagement Analytics */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-blue-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Real-time Engagement</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#3b82f6" 
                  fill="url(#colorAverage)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="individual" 
                  stroke="#8b5cf6" 
                  fill="none"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-1 lg:col-span-4 space-y-4 lg:space-y-6">
          {/* Hand Raise Queue */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Question Queue</h3>
            {handRaiseQueue.length > 0 ? (
              <div className="space-y-3">
                {handRaiseQueue.map((student) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{student.name}</span>
                      <Hand className="w-4 h-4 text-yellow-600 animate-pulse" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{student.question}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{student.time}</span>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                        Answer
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Hand className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm">No questions pending</p>
              </div>
            )}
          </div>

          {/* Breakout Rooms */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Breakout Rooms</h3>
            <div className="space-y-3">
              {breakoutRooms.map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedBreakoutRoom(room.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 text-sm">{room.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{room.topic}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1">
                      {room.members.map((member, idx) => (
                        <div key={idx} className="w-5 h-5 bg-blue-500 rounded-full border border-white flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{member[0]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-1000"
                          style={{ width: `${room.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{room.progress}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Attendance</h3>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {attendanceData.map((item, index) => (
                <div key={item.status} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs text-gray-600">{item.status}: {item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartClassroomHub