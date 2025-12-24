'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Video, Users, Hand, MessageSquare, Monitor, 
  Mic, MicOff, VideoOff, Share2,
  Clock, UserCheck, Activity, ChevronRight
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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
]

// Engagement data
const engagementData = [
  { time: '09:00', avg: 85 },
  { time: '09:15', avg: 88 },
  { time: '09:30', avg: 92 },
  { time: '09:45', avg: 86 },
  { time: '10:00', avg: 90 },
]

// Breakout rooms
const breakoutRooms = [
  { id: 1, name: 'Algebra', members: 2, progress: 75 },
  { id: 2, name: 'Geometry', members: 2, progress: 60 },
  { id: 3, name: 'Statistics', members: 2, progress: 85 },
]

// Attendance data
const attendanceData = [
  { status: 'Present', count: 6, color: '#10b981' },
  { status: 'Late', count: 1, color: '#f59e0b' },
  { status: 'Absent', count: 1, color: '#ef4444' },
]

const SmartClassroomHubCompact = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [whiteboardActive, setWhiteboardActive] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)
  const [avgEngagement, setAvgEngagement] = useState(0)
  const [viewMode, setViewMode] = useState<'gallery' | 'speaker'>('gallery')
  const [isMuted, setIsMuted] = useState(true)  // Start muted
  const [isVideoOn, setIsVideoOn] = useState(false)  // Start with camera off

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const activeStudents = students.filter(s => s.status === 'active')
    const targetEngagement = Math.round(
      activeStudents.reduce((sum, s) => sum + s.engagement, 0) / activeStudents.length
    )
    setTimeout(() => setAvgEngagement(targetEngagement), 500)
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-4 sm:p-6 max-h-[800px] overflow-hidden">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Virtual Classroom</h2>
          <p className="text-xs text-gray-600">Grade 11 Mathematics • 45 min</p>
        </div>
        <div className="text-sm font-medium text-gray-700">
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Compact Metrics */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
        <div className="bg-white rounded-lg p-2 border border-blue-200">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-blue-600" />
            <div>
              <p className="text-sm font-bold">{students.filter(s => s.status === 'active').length}</p>
              <p className="text-[9px] text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2 border border-blue-200">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-green-600" />
            <div>
              <p className="text-sm font-bold">{avgEngagement}%</p>
              <p className="text-[9px] text-gray-500">Engaged</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2 border border-blue-200">
          <div className="flex items-center gap-1">
            <Hand className="w-3 h-3 text-yellow-600" />
            <div>
              <p className="text-sm font-bold">1</p>
              <p className="text-[9px] text-gray-500">Question</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2 border border-blue-200">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-purple-600" />
            <div>
              <p className="text-sm font-bold">3</p>
              <p className="text-[9px] text-gray-500">Rooms</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2 border border-blue-200">
          <div className="flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-indigo-600" />
            <div>
              <p className="text-sm font-bold">75%</p>
              <p className="text-[9px] text-gray-500">Present</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2 border border-blue-200">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-orange-600" />
            <div>
              <p className="text-sm font-bold">32m</p>
              <p className="text-[9px] text-gray-500">Left</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Video Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-3 border border-blue-200">
            {/* Controls Bar - Always Visible */}
            <div className="flex items-center justify-between mb-2 bg-gray-50 rounded-lg p-2">
              <h3 className="text-sm font-semibold text-gray-900">Live Session</h3>
              <div className="flex items-center gap-1">
                {/* Microphone Control */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isMuted 
                      ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                  title={isMuted ? 'Turn on microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                </button>
                
                {/* Camera Control */}
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    !isVideoOn 
                      ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                  title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isVideoOn ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
                </button>
                
                {/* Screen Share Control */}
                <button
                  onClick={() => setScreenSharing(!screenSharing)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    screenSharing 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title={screenSharing ? 'Stop sharing screen' : 'Share screen'}
                >
                  <Share2 className="w-3 h-3" />
                </button>
                
                {/* Whiteboard Control */}
                <button
                  onClick={() => setWhiteboardActive(!whiteboardActive)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    whiteboardActive 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title={whiteboardActive ? 'Close whiteboard' : 'Open whiteboard'}
                >
                  <Monitor className="w-3 h-3" />
                </button>
                
                <div className="border-l border-gray-300 mx-1 h-4" />
                
                {/* View Mode Toggle */}
                <button 
                  onClick={() => setViewMode('gallery')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    viewMode === 'gallery' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Gallery
                </button>
                <button 
                  onClick={() => setViewMode('speaker')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    viewMode === 'speaker' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Speaker
                </button>
              </div>
            </div>

            {/* Notifications */}
            {(whiteboardActive || screenSharing) && (
              <div className="flex gap-2 mb-2">
                {whiteboardActive && (
                  <div className="flex-1 bg-indigo-50 border border-indigo-200 rounded px-2 py-1">
                    <span className="text-xs text-indigo-700">📝 Whiteboard Active</span>
                  </div>
                )}
                {screenSharing && (
                  <div className="flex-1 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                    <span className="text-xs text-blue-700">🖥️ Screen Sharing</span>
                  </div>
                )}
              </div>
            )}

            {/* Video Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
              {students.slice(0, 6).map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative aspect-video rounded-lg border-2 ${getEngagementColor(student.engagement)} overflow-hidden`}
                >
                  {student.cameraOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <div className="text-white font-bold text-sm sm:text-base">{student.avatar}</div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <VideoOff className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Student Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-1 py-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white truncate">{student.name.split(' ')[0]}</span>
                      <div className="flex items-center gap-0.5">
                        {student.handRaised && <Hand className="w-2 h-2 text-yellow-400" />}
                        {!student.micOn && <MicOff className="w-2 h-2 text-red-400" />}
                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(student.status)}`} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Engagement Score */}
                  <div className="absolute top-1 right-1">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
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

            {/* Engagement Chart */}
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs font-medium text-gray-700 mb-1">Engagement Trend</p>
              <ResponsiveContainer width="100%" height={60}>
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="avg" stroke="#3b82f6" fill="url(#colorGradient)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Questions */}
          <div className="bg-white rounded-xl p-3 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Questions</h3>
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-900">Sarah v.D.M</span>
                <Hand className="w-3 h-3 text-yellow-600" />
              </div>
              <p className="text-[10px] text-gray-600">Quadratic formula question</p>
              <button className="mt-1 px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded">Answer</button>
            </div>
          </div>

          {/* Breakout Rooms */}
          <div className="bg-white rounded-xl p-3 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Breakout Rooms</h3>
            <div className="space-y-1.5">
              {breakoutRooms.map((room) => (
                <div key={room.id} className="p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-900">{room.name}</span>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">{room.members} students</span>
                    <div className="flex items-center gap-1">
                      <div className="h-1 w-12 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${room.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-600">{room.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-xl p-3 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Attendance</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={80} height={80}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={35}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="ml-3 space-y-1">
                {attendanceData.map((item) => (
                  <div key={item.status} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-gray-600">{item.status}: {item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartClassroomHubCompact