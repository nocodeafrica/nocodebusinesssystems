'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Video,
  Users,
  Mic,
  MicOff,
  VideoOff,
  Monitor as Screen,
  FileText,
  Gavel,
  Clock,
  MessageCircle,
  Hand,
  Volume2,
  Settings,
  Camera,
  Monitor,
  PhoneOff,
  User,
  AlertCircle,
  ChevronRight,
  Scale,
  Shield,
  CheckCircle,
  Info,
  Plus,
  Paperclip,
  Send,
  MoreVertical
} from 'lucide-react'

interface DigitalCourtRoomMobileProps {
  onBack?: () => void
}

export default function DigitalCourtRoomMobile({ onBack }: DigitalCourtRoomMobileProps) {
  const [isMuted, setIsMuted] = useState(true) // Start muted
  const [isVideoOn, setIsVideoOn] = useState(false) // Start with camera off
  const [activeView, setActiveView] = useState<'session' | 'evidence' | 'participants'>('session')
  const [inSession, setInSession] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [sessionTime, setSessionTime] = useState(0)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const miniVideoRef = useRef<HTMLVideoElement>(null)

  // Sample participants
  const participants = [
    { id: 1, name: 'Judge Smith', role: 'Presiding Judge', status: 'speaking', initials: 'JS' },
    { id: 2, name: 'Adv. Johnson', role: 'Plaintiff Counsel', status: 'active', initials: 'AJ' },
    { id: 3, name: 'Adv. Williams', role: 'Defense Counsel', status: 'active', initials: 'AW' },
    { id: 4, name: 'John Doe', role: 'Plaintiff', status: 'muted', initials: 'JD' },
    { id: 5, name: 'Court Clerk', role: 'Clerk', status: 'active', initials: 'CC' }
  ]

  // Sample evidence items
  const evidenceItems = [
    { id: 1, name: 'Contract Agreement', type: 'document', status: 'presented', pages: 28 },
    { id: 2, name: 'Email Correspondence', type: 'document', status: 'queued', pages: 15 },
    { id: 3, name: 'Security Footage', type: 'video', status: 'queued', duration: '2:34' },
    { id: 4, name: 'Financial Records', type: 'document', status: 'presented', pages: 42 }
  ]

  // Session info
  const sessionInfo = {
    caseNumber: '2024-CV-1234',
    title: 'Smith vs. TechCorp Ltd',
    type: 'Pre-trial Hearing',
    judge: 'Hon. Judge Smith',
    startTime: '10:00 AM'
  }

  // Session timer
  useEffect(() => {
    if (inSession) {
      const interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [inSession])

  // Setup video stream
  useEffect(() => {
    if (localStream && videoRef.current) {
      videoRef.current.srcObject = localStream
    }
    if (localStream && miniVideoRef.current) {
      miniVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  // Handle microphone toggle
  const toggleMicrophone = async () => {
    if (!isMuted) {
      if (localStream) {
        localStream.getAudioTracks().forEach(track => track.enabled = false)
      }
      setIsMuted(true)
    } else {
      if (localStream) {
        localStream.getAudioTracks().forEach(track => track.enabled = true)
      } else {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: false,
            audio: true 
          })
          setLocalStream(stream)
        } catch (error) {
          console.error('Error accessing microphone:', error)
        }
      }
      setIsMuted(false)
    }
  }

  // Handle camera toggle
  const toggleCamera = async () => {
    if (!isVideoOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }, 
          audio: true
        })
        setLocalStream(stream)
        setIsVideoOn(true)
        stream.getAudioTracks().forEach(track => track.enabled = !isMuted)
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    } else {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
        setLocalStream(null)
      }
      setIsVideoOn(false)
    }
  }

  // Start session
  const startSession = () => {
    setInSession(true)
    setSessionTime(0)
  }

  // End session
  const endSession = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }
    setInSession(false)
    setIsVideoOn(false)
    setIsMuted(true)
    setSessionTime(0)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Only show when not in session */}
      {!inSession && (
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Digital Court Room</h1>
                  <p className="text-sm text-gray-600">Virtual court proceedings</p>
                </div>
              </div>
              <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation - Only show when not in session */}
      {!inSession && (
        <div className="bg-white border-b sticky top-[60px] z-10">
          <div className="px-4">
            <div className="flex gap-6">
              {[
                { id: 'session', label: 'Session', icon: Gavel },
                { id: 'evidence', label: 'Evidence', icon: FileText },
                { id: 'participants', label: 'Participants', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as any)}
                    className={`py-3 px-1 border-b-2 transition-colors ${
                      activeView === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500'
                    }`}
                  >
                    <Icon className="w-5 h-5 inline mr-1" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={inSession ? '' : 'px-4 py-6 pb-20'}>
        {/* Session Tab */}
        {activeView === 'session' && !inSession && (
          <div className="space-y-4">
            {/* Case Info Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm opacity-90">Case #{sessionInfo.caseNumber}</p>
                  <h2 className="text-xl font-bold">{sessionInfo.title}</h2>
                  <p className="text-sm opacity-90 mt-1">{sessionInfo.type}</p>
                </div>
                <Scale className="w-8 h-8 opacity-50" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <p className="text-xs opacity-80">Presiding</p>
                  <p className="text-sm font-medium">{sessionInfo.judge}</p>
                </div>
                <div>
                  <p className="text-xs opacity-80">Scheduled</p>
                  <p className="text-sm font-medium">{sessionInfo.startTime}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
                <p className="text-sm text-gray-600">Participants</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <Info className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{evidenceItems.length}</p>
                <p className="text-sm text-gray-600">Evidence Items</p>
              </div>
            </div>

            {/* Session Status */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Session Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recording</span>
                  <span className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Ready</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Court Reporter</span>
                  <span className="text-sm font-medium text-gray-900">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Interpreter</span>
                  <span className="text-sm text-gray-500">Not Required</span>
                </div>
              </div>
            </div>

            {/* Join Session Button */}
            <button
              onClick={startSession}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              Join Court Session
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Evidence Tab */}
        {activeView === 'evidence' && !inSession && (
          <div className="space-y-3">
            {evidenceItems.map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${
                      item.status === 'presented' ? 'bg-green-100' : 'bg-gray-100'
                    } rounded-lg flex items-center justify-center`}>
                      <FileText className={`w-5 h-5 ${
                        item.status === 'presented' ? 'text-green-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.type === 'document' ? `${item.pages} pages` : item.duration}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'presented' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Participants Tab */}
        {activeView === 'participants' && !inSession && (
          <div className="space-y-3">
            {participants.map((participant) => (
              <motion.div
                key={participant.id}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {participant.initials}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{participant.name}</p>
                      <p className="text-sm text-gray-600">{participant.role}</p>
                    </div>
                  </div>
                  {participant.status === 'speaking' && (
                    <Volume2 className="w-4 h-4 text-green-500 animate-pulse" />
                  )}
                  {participant.status === 'muted' && (
                    <MicOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Video Call Interface - Full Screen when in session */}
      {inSession && (
        <div className="fixed inset-0 bg-black z-50">
          {/* Video Container */}
          <div className="relative h-full w-full">
            {/* Main Video Area */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              {isVideoOn && localStream ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    JS
                  </div>
                  <p className="text-white text-lg font-medium">Judge Smith</p>
                  <p className="text-gray-400 text-sm">
                    {isVideoOn ? 'Connecting...' : 'Camera Off'}
                  </p>
                </div>
              )}
            </div>

            {/* Remote Participants Grid */}
            <motion.div 
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              className="absolute top-4 right-4 w-32 h-48 bg-gray-700 rounded-xl overflow-hidden shadow-xl"
            >
              <div className="w-full h-full p-2">
                <div className="grid grid-cols-2 gap-1 h-full">
                  {participants.slice(1, 5).map((participant) => (
                    <div key={participant.id} className="bg-gray-800 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{participant.initials}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Session Info Overlay */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-white font-medium">{sessionInfo.title}</p>
              <p className="text-gray-300 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Recording • {formatTime(sessionTime)}
              </p>
            </div>

            {/* Hand Raised Indicator */}
            {isHandRaised && (
              <div className="absolute top-20 left-4 bg-yellow-500 text-black rounded-lg px-3 py-2 flex items-center gap-2">
                <Hand className="w-4 h-4" />
                <span className="text-sm font-medium">Hand Raised</span>
              </div>
            )}

            {/* Chat Overlay */}
            {showChat && (
              <motion.div
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                className="absolute right-0 top-0 bottom-20 w-80 bg-white/95 backdrop-blur-sm shadow-xl"
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Court Chat</h3>
                  <button onClick={() => setShowChat(false)} className="p-1">
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <p className="text-sm text-gray-500 text-center">No messages yet</p>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button className="p-2 bg-indigo-600 text-white rounded-lg">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center justify-center gap-3">
                <button 
                  onClick={toggleMicrophone}
                  className={`p-3 rounded-full transition-colors ${
                    isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                </button>
                
                <button 
                  onClick={toggleCamera}
                  className={`p-3 rounded-full transition-colors ${
                    !isVideoOn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {!isVideoOn ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
                </button>
                
                <button 
                  onClick={endSession}
                  className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                >
                  <PhoneOff className="w-6 h-6 text-white" />
                </button>
                
                <button 
                  onClick={() => setIsHandRaised(!isHandRaised)}
                  className={`p-3 rounded-full transition-colors ${
                    isHandRaised ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Hand className="w-5 h-5 text-white" />
                </button>
                
                <button 
                  onClick={() => setShowChat(!showChat)}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button - Only show when not in session */}
      {!inSession && activeView !== 'session' && (
        <div className="fixed bottom-4 right-4 z-30">
          <button 
            onClick={() => setActiveView('session')}
            className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Gavel className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}