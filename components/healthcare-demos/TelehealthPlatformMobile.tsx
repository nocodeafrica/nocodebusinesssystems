'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Users,
  Calendar,
  Clock,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  User,
  Stethoscope,
  ChevronRight,
  Plus,
  Phone,
  FileText,
  Share2,
  Settings,
  ScreenShare,
  ScreenShareOff,
  Download,
  Type,
  Zap,
  X
} from 'lucide-react'

interface TelehealthPlatformMobileProps {
  onBack?: () => void
}

// Active consultations (from desktop component)
const activeConsultations = [
  {
    id: 1,
    patient: 'Sarah Johnson',
    doctor: 'Dr. Smith',
    startTime: '09:00 AM',
    duration: '15 mins',
    status: 'in-progress',
    type: 'video',
    reason: 'Follow-up Consultation'
  },
  {
    id: 2,
    patient: 'Michael Brown',
    doctor: 'Dr. Adams',
    startTime: '09:30 AM',
    duration: '0 mins',
    status: 'waiting',
    type: 'video',
    reason: 'Prescription Renewal'
  },
  {
    id: 3,
    patient: 'Emma Davis',
    doctor: 'Dr. Lee',
    startTime: '10:00 AM',
    duration: '0 mins',
    status: 'scheduled',
    type: 'audio',
    reason: 'General Consultation'
  }
]

// Vital signs data (from desktop component)
const vitalSigns = [
  { 
    id: 'heart-rate',
    name: 'Heart Rate',
    value: 72,
    unit: 'bpm',
    status: 'normal',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    min: 60,
    max: 100
  },
  { 
    id: 'blood-pressure',
    name: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    status: 'normal',
    icon: Activity,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  { 
    id: 'temperature',
    name: 'Temperature',
    value: 36.5,
    unit: '°C',
    status: 'normal',
    icon: Thermometer,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    min: 36,
    max: 37.5
  },
  { 
    id: 'oxygen',
    name: 'O₂ Saturation',
    value: 98,
    unit: '%',
    status: 'normal',
    icon: Wind,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    min: 95,
    max: 100
  }
]

// Chat messages
const initialMessages = [
  { id: 1, sender: 'Dr. Smith', message: 'Hello Sarah, how are you feeling today?', time: '09:15 AM', type: 'doctor' },
  { id: 2, sender: 'Patient', message: 'Much better, thank you doctor', time: '09:16 AM', type: 'patient' },
  { id: 3, sender: 'Dr. Smith', message: 'Can you show me where it hurts?', time: '09:17 AM', type: 'doctor' }
]

export default function TelehealthPlatformMobile({ onBack }: TelehealthPlatformMobileProps) {
  const [activeTab, setActiveTab] = useState<'consultations' | 'vitals' | 'call'>('consultations')
  const [inCall, setInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const [callDuration, setCallDuration] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const screenShareRef = useRef<HTMLVideoElement>(null)
  const recognitionRef = useRef<any>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop())
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
    }
  }, [localStream, screenStream])

  // Update video stream when localStream changes
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream
      videoRef.current.play().catch(e => console.log('Video play error:', e))
    }
  }, [localStream])

  // Update screen share stream
  useEffect(() => {
    if (screenShareRef.current && screenStream) {
      screenShareRef.current.srcObject = screenStream
      screenShareRef.current.play().catch(e => console.log('Screen share play error:', e))
    }
  }, [screenStream])

  // Call timer
  useEffect(() => {
    if (inCall) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
      setCallDuration(0)
    }
  }, [inCall])

  // Show notification helper
  const showNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 3000)
  }

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Toggle camera
  const toggleCamera = async () => {
    if (!isVideoOn) {
      try {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
          showNotification('Camera not available')
          return
        }
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { ideal: 'user' },
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          }, 
          audio: false 
        })
        setLocalStream(stream)
        setIsVideoOn(true)
        showNotification('Camera turned on')
      } catch (error) {
        showNotification('Camera access denied')
      }
    } else {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
        setLocalStream(null)
      }
      setIsVideoOn(false)
      showNotification('Camera turned off')
    }
  }

  // Toggle screen sharing (may not work on all mobile browsers)
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
          showNotification('Screen sharing not available on this device')
          return
        }
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: false
        })
        
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
          setScreenStream(null)
          showNotification('Screen sharing stopped')
        }
        
        setScreenStream(stream)
        setIsScreenSharing(true)
        showNotification('Screen sharing started')
      } catch (error) {
        showNotification('Screen share not supported on mobile')
      }
    } else {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop())
        setScreenStream(null)
      }
      setIsScreenSharing(false)
      showNotification('Screen sharing stopped')
    }
  }

  // Toggle transcription
  const toggleTranscription = () => {
    if (!isTranscribing) {
      startTranscription()
    } else {
      stopTranscription()
    }
  }

  const startTranscription = () => {
    if (typeof window === 'undefined' || (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window))) {
      showNotification('Speech recognition not supported')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    
    recognition.onstart = () => {
      setIsTranscribing(true)
      setTranscript('Listening...')
      showNotification('Transcription started')
    }
    
    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }
      
      setTranscript(finalTranscript + interimTranscript)
      
      // Add to chat if final
      if (finalTranscript) {
        const newMsg = {
          id: messages.length + 1,
          sender: 'Transcription',
          message: finalTranscript.trim(),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          type: 'transcription'
        }
        setMessages(prev => [...prev, newMsg])
      }
    }
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsTranscribing(false)
      setTranscript('Error: ' + event.error)
    }
    
    recognition.onend = () => {
      setIsTranscribing(false)
    }
    
    recognitionRef.current = recognition
    recognition.start()
  }

  const stopTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsTranscribing(false)
    setTranscript('')
    showNotification('Transcription stopped')
  }

  // Send chat message
  const sendMessage = () => {
    if (newMessage.trim()) {
      const msg = {
        id: messages.length + 1,
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'doctor'
      }
      setMessages([...messages, msg])
      setNewMessage('')
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'in-progress': return 'bg-green-100 text-green-700'
      case 'waiting': return 'bg-yellow-100 text-yellow-700'
      case 'scheduled': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getVitalStatus = (status: string) => {
    switch(status) {
      case 'normal': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const startVideoCall = (consultation: any) => {
    setSelectedConsultation(consultation)
    setInCall(true)
    setActiveTab('call')
    // Auto-enable camera when starting call
    toggleCamera()
  }

  const endCall = () => {
    // Clean up streams
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop())
      setScreenStream(null)
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    
    setInCall(false)
    setIsVideoOn(false)
    setIsScreenSharing(false)
    setIsTranscribing(false)
    setIsMuted(false)
    setSelectedConsultation(null)
    setActiveTab('consultations')
    showNotification('Call ended')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {notification}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      {!inCall && (
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
                  <h1 className="text-xl font-bold text-gray-900">Telehealth Platform</h1>
                  <p className="text-sm text-gray-600">Virtual consultations & monitoring</p>
                </div>
              </div>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      {!inCall && (
        <div className="bg-white border-b sticky top-[72px] z-10">
          <div className="px-4">
            <div className="flex gap-6">
              {[
                { id: 'consultations', label: 'Consultations', icon: Video },
                { id: 'vitals', label: 'Vitals', icon: Activity },
                { id: 'call', label: 'Join Call', icon: Phone }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 px-1 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
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
      <div className={inCall ? '' : 'px-4 py-6 pb-20'}>
        {/* Consultations Tab */}
        {activeTab === 'consultations' && !inCall && (
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Video className="w-6 h-6 opacity-80" />
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-blue-100 text-sm">Active Today</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 opacity-80" />
                  <Activity className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-green-100 text-sm">Completed</p>
              </div>
            </div>

            {/* Active Consultations */}
            <div className="space-y-3">
              {activeConsultations.map((consultation) => (
                <motion.div
                  key={consultation.id}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {consultation.patient.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{consultation.patient}</p>
                        <p className="text-sm text-gray-500">{consultation.doctor}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                      {consultation.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-600 mb-1">{consultation.reason}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {consultation.startTime}
                      </span>
                      <span className="flex items-center gap-1">
                        {consultation.type === 'video' ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                        {consultation.type}
                      </span>
                      {consultation.status === 'in-progress' && (
                        <span className="text-green-600 font-medium">{consultation.duration}</span>
                      )}
                    </div>
                  </div>

                  {consultation.status === 'in-progress' || consultation.status === 'waiting' ? (
                    <button 
                      onClick={() => startVideoCall(consultation)}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      {consultation.status === 'in-progress' ? 'Join Call' : 'Start Call'}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg text-base font-medium">
                      Schedule
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Vitals Tab */}
        {activeTab === 'vitals' && !inCall && (
          <div className="space-y-4">
            {/* Patient Selector */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Current Patient</h3>
                <button className="text-blue-600 text-sm font-medium">Change</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  SJ
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Last updated: 2 mins ago</p>
                </div>
              </div>
            </div>

            {/* Vital Signs Grid */}
            <div className="grid grid-cols-2 gap-3">
              {vitalSigns.map((vital) => {
                const Icon = vital.icon
                return (
                  <motion.div
                    key={vital.id}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 ${vital.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${vital.color}`} />
                      </div>
                      <span className={`text-xs font-medium ${getVitalStatus(vital.status)}`}>
                        {vital.status}
                      </span>
                    </div>
                    
                    <p className="text-2xl font-bold text-gray-900">
                      {vital.value}
                      <span className="text-sm text-gray-500 ml-1">{vital.unit}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{vital.name}</p>
                    
                    {vital.min && vital.max && (
                      <div className="mt-3">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${vital.status === 'normal' ? 'bg-green-500' : 'bg-yellow-500'} rounded-full`}
                            style={{ 
                              width: `${((typeof vital.value === 'number' ? vital.value : 0) - vital.min) / (vital.max - vital.min) * 100}%` 
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{vital.min}</span>
                          <span>{vital.max}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Video Call View */}
        {(activeTab === 'call' || inCall) && (
          <div className="fixed inset-0 bg-black z-50">
            {/* Video Container */}
            <div className="relative h-full w-full">
              {/* Main Video Area */}
              {isScreenSharing ? (
                // Screen Share View
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <video
                    ref={screenShareRef}
                    className="w-full h-full object-contain"
                    autoPlay
                    playsInline
                  />
                </div>
              ) : (
                // Camera View or Placeholder
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {isVideoOn && localStream ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(1)' }}
                      autoPlay
                      playsInline
                      muted
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                        {selectedConsultation ? 
                          selectedConsultation.patient.split(' ').map((n: string) => n[0]).join('') : 
                          'SJ'
                        }
                      </div>
                      <p className="text-white text-lg font-medium">
                        {selectedConsultation ? selectedConsultation.patient : 'Sarah Johnson'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {isVideoOn ? 'Connecting...' : 'Camera Off'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Remote Video (PiP) - In real app, this would show the other person */}
              <motion.div 
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="absolute top-4 right-4 w-32 h-48 bg-gray-700 rounded-xl overflow-hidden shadow-xl"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              </motion.div>

              {/* Call Info Overlay */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-white font-medium">{selectedConsultation?.patient || 'Patient'}</p>
                <p className="text-gray-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {formatDuration(callDuration)}
                </p>
              </div>

              {/* Transcription Display */}
              {isTranscribing && transcript && (
                <div className="absolute bottom-32 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 max-h-32 overflow-y-auto">
                  <p className="text-white text-sm">{transcript}</p>
                </div>
              )}

              {/* Control Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
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
                    onClick={endCall}
                    className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                  >
                    <PhoneOff className="w-6 h-6 text-white" />
                  </button>
                  
                  <button 
                    onClick={() => setShowChat(!showChat)}
                    className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors relative"
                  >
                    <MessageSquare className="w-5 h-5 text-white" />
                    {messages.length > 3 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {messages.length - 3}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={toggleTranscription}
                    className={`p-3 rounded-full transition-colors ${
                      isTranscribing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Type className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Additional Actions */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button 
                    onClick={toggleScreenShare}
                    className={`px-3 py-1.5 rounded-lg text-white text-xs transition-colors ${
                      isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700/50 hover:bg-gray-700'
                    }`}
                  >
                    {isScreenSharing ? <ScreenShareOff className="w-4 h-4 inline mr-1" /> : <ScreenShare className="w-4 h-4 inline mr-1" />}
                    Screen
                  </button>
                  <button className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-white text-xs transition-colors">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Records
                  </button>
                  <button className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-white text-xs transition-colors">
                    <Activity className="w-4 h-4 inline mr-1" />
                    Vitals
                  </button>
                </div>
              </div>

              {/* Chat Panel */}
              <AnimatePresence>
                {showChat && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl"
                  >
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Chat</h3>
                      <button onClick={() => setShowChat(false)} className="p-1">
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ height: 'calc(100% - 128px)' }}>
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] p-3 rounded-lg ${
                            msg.type === 'doctor' ? 'bg-blue-600 text-white' : 
                            msg.type === 'transcription' ? 'bg-gray-200 text-gray-700' :
                            'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.type === 'doctor' ? 'text-blue-100' : 'text-gray-500'}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={sendMessage} className="p-2 bg-blue-600 text-white rounded-lg">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button (when not in call) */}
      {!inCall && (
        <div className="fixed bottom-4 right-4 z-30">
          <button 
            onClick={() => setActiveTab('call')}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Video className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}