'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video, Users, Hand, MessageSquare, Monitor, 
  Mic, MicOff, VideoOff, Settings, Share2,
  Clock, UserCheck, Activity, ChevronUp,
  Grid, User, BookOpen, BarChart3, Bell
} from 'lucide-react'

// Student data
const students = [
  { id: 1, name: 'Thabo M.', avatar: 'TM', status: 'active', engagement: 92, handRaised: false, micOn: true, cameraOn: true },
  { id: 2, name: 'Sarah V.', avatar: 'SV', status: 'active', engagement: 88, handRaised: true, micOn: false, cameraOn: true },
  { id: 3, name: 'Kwame A.', avatar: 'KA', status: 'active', engagement: 76, handRaised: false, micOn: false, cameraOn: true },
  { id: 4, name: 'Amara O.', avatar: 'AO', status: 'active', engagement: 94, handRaised: false, micOn: false, cameraOn: true },
]

const SmartClassroomMobile = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMuted, setIsMuted] = useState(true)  // Start muted
  const [isVideoOff, setIsVideoOff] = useState(true)  // Start with camera off
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [activePanel, setActivePanel] = useState<'class' | 'students' | 'chat' | 'activities'>('class')
  const [showControls, setShowControls] = useState(true)
  const [handRaised, setHandRaised] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Keep controls always visible - removed auto-hide logic
  useEffect(() => {
    setShowControls(true)  // Always show controls
  }, [activePanel])

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-800/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-300">LIVE</span>
          </div>
          <div className="text-white">
            <h3 className="text-sm font-semibold">Mathematics Grade 10</h3>
            <p className="text-xs text-gray-400">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="bg-gray-700/50 rounded-lg px-2 py-1 flex items-center gap-1"
          >
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white font-medium">24</span>
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setHandRaised(!handRaised)}
            className={`p-2 rounded-lg ${handRaised ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700/50 text-gray-400'}`}
          >
            <Hand className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-black">  {/* Removed onClick handler */}
        {activePanel === 'class' && (
          <>
            {/* Main Video Feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <User className="w-16 h-16 text-gray-500" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-1">Mr. Johnson</h3>
                <p className="text-gray-400 text-sm">Instructor</p>
              </div>
            </div>

            {/* Student Video Grid Overlay */}
            <motion.div 
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              className="absolute top-4 right-4 w-24 space-y-2"
            >
              {students.slice(0, 3).map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="w-24 h-16 bg-gray-800 rounded-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">{student.avatar}</span>
                      </div>
                    </div>
                  </div>
                  {student.handRaised && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Hand className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 flex gap-1">
                    {!student.micOn && <div className="w-4 h-4 bg-red-500/80 rounded flex items-center justify-center"><MicOff className="w-2 h-2 text-white" /></div>}
                    {!student.cameraOn && <div className="w-4 h-4 bg-red-500/80 rounded flex items-center justify-center"><VideoOff className="w-2 h-2 text-white" /></div>}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Floating Engagement Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-xl p-3"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-xs text-gray-400">Class Engagement</p>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold text-white">87%</div>
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '87%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {activePanel === 'students' && (
          <div className="h-full bg-gray-900 p-4 overflow-y-auto">
            <h3 className="text-white text-lg font-semibold mb-4">Students (24)</h3>
            <div className="space-y-3">
              {students.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      student.status === 'active' ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-gray-700'
                    }`}>
                      <span className="text-white text-sm font-semibold">{student.avatar}</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{student.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400">{student.engagement}%</span>
                        </div>
                        {student.handRaised && (
                          <div className="flex items-center gap-1">
                            <Hand className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-yellow-400">Hand up</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className={`p-2 rounded-lg ${student.micOn ? 'bg-gray-700' : 'bg-red-500/20'}`}>
                      {student.micOn ? <Mic className="w-4 h-4 text-gray-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
                    </button>
                    <button className={`p-2 rounded-lg ${student.cameraOn ? 'bg-gray-700' : 'bg-red-500/20'}`}>
                      {student.cameraOn ? <Video className="w-4 h-4 text-gray-400" /> : <VideoOff className="w-4 h-4 text-red-400" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activePanel === 'chat' && (
          <div className="h-full bg-gray-900 flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">SV</span>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 max-w-[80%]">
                  <p className="text-xs text-gray-400 mb-1">Sarah V. • 9:45 AM</p>
                  <p className="text-white text-sm">Can you explain the quadratic formula again?</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 justify-end"
              >
                <div className="bg-blue-600 rounded-xl p-3 max-w-[80%]">
                  <p className="text-xs text-blue-200 mb-1">You • 9:46 AM</p>
                  <p className="text-white text-sm">Of course! Let me share my screen to show you the steps.</p>
                </div>
              </motion.div>
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white p-2 rounded-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {activePanel === 'activities' && (
          <div className="h-full bg-gray-900 p-4 overflow-y-auto">
            <h3 className="text-white text-lg font-semibold mb-4">Class Activities</h3>
            
            {/* Quick Poll */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-4 mb-4 border border-purple-500/30"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">Quick Poll</h4>
                <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-gray-300 text-sm mb-3">Do you understand quadratic equations?</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Yes, completely</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '65%' }} />
                    </div>
                    <span className="text-xs text-gray-400">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Need more practice</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: '25%' }} />
                    </div>
                    <span className="text-xs text-gray-400">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Still confused</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: '10%' }} />
                    </div>
                    <span className="text-xs text-gray-400">10%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Breakout Rooms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-4"
            >
              <h4 className="text-white font-medium mb-3">Breakout Rooms</h4>
              <div className="space-y-2">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white font-medium">Room 1 - Algebra</span>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-700" />
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-700" />
                    </div>
                    <span className="text-xs text-gray-400">2 students</span>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white font-medium">Room 2 - Geometry</span>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-gray-700" />
                      <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-gray-700" />
                    </div>
                    <span className="text-xs text-gray-400">2 students</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom Controls - Always Visible */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="bg-gray-800 border-t border-gray-700"
        >
            {/* Control Buttons */}
            <div className="flex items-center justify-around py-3 px-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-white'}`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-white'}`}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
              >
                <Monitor className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-red-500 text-white"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-xs font-bold">END</span>
                </div>
              </motion.button>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-around py-2 px-4 border-t border-gray-700">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePanel('class')}
                className={`flex flex-col items-center gap-1 p-2 ${activePanel === 'class' ? 'text-blue-400' : 'text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
                <span className="text-xs">Class</span>
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePanel('students')}
                className={`flex flex-col items-center gap-1 p-2 ${activePanel === 'students' ? 'text-blue-400' : 'text-gray-400'}`}
              >
                <Users className="w-5 h-5" />
                <span className="text-xs">Students</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePanel('chat')}
                className={`flex flex-col items-center gap-1 p-2 relative ${activePanel === 'chat' ? 'text-blue-400' : 'text-gray-400'}`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs">Chat</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePanel('activities')}
                className={`flex flex-col items-center gap-1 p-2 ${activePanel === 'activities' ? 'text-blue-400' : 'text-gray-400'}`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs">Activities</span>
              </motion.button>
            </div>
          </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default SmartClassroomMobile