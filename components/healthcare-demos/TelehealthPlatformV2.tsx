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
  FileText,
  Share2,
  Monitor,
  Smartphone,
  Wifi,
  WifiOff,
  Battery,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  User,
  Stethoscope,
  Pill,
  Camera,
  Settings,
  Plus,
  Zap,
  ScreenShare,
  ScreenShareOff,
  Download,
  Upload,
  Edit3,
  Type,
  Square,
  Circle,
  ArrowRight,
  Highlighter,
  MousePointer,
  PenTool,
  Send,
  X,
  Maximize2,
  Minimize2,
  PictureInPicture2,
  Volume2,
  VolumeX,
  FileUp,
  FolderOpen,
  Image
} from 'lucide-react'

// Active consultations
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

// Vital signs data
const vitalSigns = [
  { 
    id: 'heart-rate',
    name: 'Heart Rate',
    value: 72,
    unit: 'bpm',
    status: 'normal',
    icon: Heart,
    color: 'from-red-500 to-rose-500',
    range: '60-100'
  },
  {
    id: 'blood-pressure',
    name: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    status: 'normal',
    icon: Activity,
    color: 'from-blue-500 to-indigo-500',
    range: '90/60-120/80'
  },
  {
    id: 'temperature',
    name: 'Temperature',
    value: 36.8,
    unit: '°C',
    status: 'normal',
    icon: Thermometer,
    color: 'from-orange-500 to-amber-500',
    range: '36.5-37.5'
  },
  {
    id: 'oxygen',
    name: 'Oxygen Saturation',
    value: 98,
    unit: '%',
    status: 'normal',
    icon: Wind,
    color: 'from-cyan-500 to-teal-500',
    range: '95-100'
  }
]

// Shared documents
const sharedDocuments = [
  { id: 1, name: 'Medical_History.pdf', type: 'pdf', size: '2.3 MB', shared: true },
  { id: 2, name: 'Lab_Results_2024.pdf', type: 'pdf', size: '450 KB', shared: false },
  { id: 3, name: 'X-Ray_Chest.jpg', type: 'image', size: '3.2 MB', shared: false },
  { id: 4, name: 'Prescription_Feb2024.pdf', type: 'pdf', size: '125 KB', shared: true }
]

// Chat messages
const initialMessages = [
  { id: 1, sender: 'System', message: 'Consultation started', time: '09:00 AM', type: 'system' },
  { id: 2, sender: 'Dr. Smith', message: 'Good morning! How are you feeling today?', time: '09:01 AM', type: 'doctor' },
  { id: 3, sender: 'Patient', message: 'Much better, thank you. The medication is helping.', time: '09:02 AM', type: 'patient' }
]

const TelehealthPlatformV2 = () => {
  const [activeCall, setActiveCall] = useState(true)
  const [isMuted, setIsMuted] = useState(true) // Start muted
  const [isVideoOn, setIsVideoOn] = useState(false) // Start with camera off
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState(activeConsultations[0])
  const [viewMode, setViewMode] = useState<'consultation' | 'vitals' | 'documents'>('consultation')
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [transcript, setTranscript] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<typeof sharedDocuments[0] | null>(null)
  const [annotationMode, setAnnotationMode] = useState<string>('none')
  const [annotations, setAnnotations] = useState<any[]>([])
  const [isPictureInPicture, setIsPictureInPicture] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const [notifications, setNotifications] = useState<string[]>([])
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenShareRef = useRef<HTMLVideoElement>(null)
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Timer for call duration
  useEffect(() => {
    if (activeCall && selectedConsultation.status === 'in-progress') {
      const interval = setInterval(() => {
        // Update duration logic here
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [activeCall, selectedConsultation])

  // Setup video stream
  useEffect(() => {
    if (localStream && videoRef.current) {
      videoRef.current.srcObject = localStream
      videoRef.current.play().catch(e => console.log('Video play error:', e))
    }
  }, [localStream])

  // Setup screen share stream
  useEffect(() => {
    if (screenStream && screenShareRef.current) {
      screenShareRef.current.srcObject = screenStream
      screenShareRef.current.play().catch(e => console.log('Screen share play error:', e))
    }
  }, [screenStream])

  // Show notification helper
  const showNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 3000)
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
          video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
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

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
          showNotification('Screen sharing not available')
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
        showNotification('Screen share cancelled or denied')
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
      setTranscript('Speech recognition not supported')
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
  }

  // Handle document upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newDoc = {
        id: sharedDocuments.length + 1,
        name: file.name,
        type: file.type.includes('image') ? 'image' : 'pdf',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        shared: false
      }
      sharedDocuments.push(newDoc)
      showNotification(`Document "${file.name}" uploaded`)
      setSelectedDocument(newDoc)
    }
  }

  // Share document
  const shareDocument = (doc: typeof sharedDocuments[0]) => {
    doc.shared = !doc.shared
    showNotification(doc.shared ? `"${doc.name}" shared` : `"${doc.name}" unshared`)
    setSelectedDocument({ ...doc })
  }

  // Toggle Picture-in-Picture
  const togglePictureInPicture = async () => {
    if (typeof document === 'undefined' || !document.pictureInPictureEnabled) {
      showNotification('Picture-in-Picture not supported')
      return
    }

    try {
      if (!isPictureInPicture) {
        if (videoRef.current && localStream) {
          await videoRef.current.requestPictureInPicture()
          setIsPictureInPicture(true)
          showNotification('Picture-in-Picture activated')
        } else {
          showNotification('Please turn on camera first')
        }
      } else {
        if (typeof document !== 'undefined' && document.pictureInPictureElement) {
          await document.exitPictureInPicture()
          setIsPictureInPicture(false)
          showNotification('Picture-in-Picture deactivated')
        }
      }
    } catch (error) {
      showNotification('PiP error occurred')
    }
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
      case 'in-progress': return 'bg-green-100 text-green-700 border-green-200'
      case 'waiting': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'scheduled': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getVitalStatus = (status: string) => {
    switch(status) {
      case 'normal': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Telehealth Platform</h2>
          <p className="text-sm text-gray-500 mt-1">Virtual consultations with screen sharing, documents, and transcription</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4 inline mr-2" />
            New Consultation
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200">
            <Calendar className="w-4 h-4 inline mr-2" />
            Schedule
          </button>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {notification}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Video Consultation Area */}
        <div className="col-span-2">
          <div className="bg-gray-900 rounded-2xl overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
            {activeCall ? (
              <>
                {/* Main Video or Screen Share */}
                {isScreenSharing ? (
                  <div className="absolute inset-0 bg-black">
                    <video
                      ref={screenShareRef}
                      className="w-full h-full object-contain"
                      autoPlay
                      playsInline
                    />
                    {/* Annotation Canvas Overlay */}
                    {annotationMode !== 'none' && (
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full cursor-crosshair"
                        style={{ pointerEvents: annotationMode !== 'none' ? 'auto' : 'none' }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
                    {isVideoOn && localStream ? (
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                    ) : (
                      <div className="text-center text-white">
                        <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <User className="w-16 h-16" />
                        </div>
                        <h3 className="text-xl font-semibold">{selectedConsultation.patient}</h3>
                        <p className="text-sm opacity-75">{selectedConsultation.reason}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Doctor's Video (PiP) when screen sharing */}
                {isScreenSharing && isVideoOn && (
                  <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                      ref={(el) => {
                        if (el && localStream) {
                          el.srcObject = localStream
                        }
                      }}
                    />
                  </div>
                )}

                {/* Call Duration */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">{selectedConsultation.duration}</span>
                  </div>
                </div>

                {/* Transcription Display */}
                {isTranscribing && transcript && (
                  <div className="absolute bottom-24 left-4 right-4 bg-black/70 backdrop-blur rounded-lg p-3 max-h-32 overflow-y-auto">
                    <p className="text-white text-sm">{transcript}</p>
                  </div>
                )}

                {/* Call Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleCamera}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      !isVideoOn ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {!isVideoOn ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleScreenShare}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isScreenSharing ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {isScreenSharing ? <ScreenShareOff className="w-5 h-5 text-white" /> : <ScreenShare className="w-5 h-5 text-white" />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveCall(false)}
                    className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all"
                  >
                    <PhoneOff className="w-6 h-6 text-white" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTranscription}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isTranscribing ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {isTranscribing ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePictureInPicture}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isPictureInPicture ? 'bg-purple-500' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <PictureInPicture2 className="w-5 h-5 text-white" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all"
                  >
                    <FileUp className="w-5 h-5 text-white" />
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                </div>

                {/* Annotation Tools (visible when screen sharing) */}
                {isScreenSharing && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
                    <button
                      onClick={() => setAnnotationMode('none')}
                      className={`p-2 rounded ${annotationMode === 'none' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    >
                      <MousePointer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setAnnotationMode('pen')}
                      className={`p-2 rounded ${annotationMode === 'pen' ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                    >
                      <PenTool className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setAnnotationMode('highlight')}
                      className={`p-2 rounded ${annotationMode === 'highlight' ? 'bg-yellow-200' : 'hover:bg-gray-100'}`}
                    >
                      <Highlighter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setAnnotationMode('text')}
                      className={`p-2 rounded ${annotationMode === 'text' ? 'bg-green-200' : 'hover:bg-gray-100'}`}
                    >
                      <Type className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setAnnotationMode('arrow')}
                      className={`p-2 rounded ${annotationMode === 'arrow' ? 'bg-purple-200' : 'hover:bg-gray-100'}`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <button
                      onClick={() => setAnnotations([])}
                      className="p-2 rounded hover:bg-red-100 text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No active consultation</p>
                  <button 
                    onClick={() => setActiveCall(true)}
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
                  >
                    Start Consultation
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('consultation')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'consultation' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vital Signs
            </button>
            <button
              onClick={() => setViewMode('documents')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'documents' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Documents
            </button>
          </div>

          {/* Content based on tab */}
          {viewMode === 'consultation' && (
            <div className="mt-4">
              <div className="grid grid-cols-4 gap-4">
                {vitalSigns.map((vital) => {
                  const Icon = vital.icon
                  return (
                    <motion.div
                      key={vital.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${vital.color} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getVitalStatus(vital.status)}`}>
                          {vital.status}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {vital.value}
                        <span className="text-sm font-normal text-gray-500 ml-1">{vital.unit}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{vital.name}</p>
                      <p className="text-xs text-gray-400">Normal: {vital.range}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {viewMode === 'documents' && (
            <div className="mt-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Shared Documents</h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Upload className="w-4 h-4 inline mr-1" />
                    Upload
                  </button>
                </div>
                <div className="space-y-2">
                  {sharedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`bg-white rounded-lg p-3 border ${
                        selectedDocument?.id === doc.id ? 'border-blue-500' : 'border-gray-200'
                      } cursor-pointer hover:border-gray-300`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {doc.type === 'image' ? 
                            <Image className="w-5 h-5 text-gray-500" /> : 
                            <FileText className="w-5 h-5 text-gray-500" />
                          }
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            shareDocument(doc)
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            doc.shared 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {doc.shared ? 'Shared' : 'Share'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Active Consultations */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Active Consultations</h3>
            <div className="space-y-2">
              {activeConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  onClick={() => setSelectedConsultation(consultation)}
                  className={`bg-white rounded-xl p-3 border cursor-pointer transition-all ${
                    selectedConsultation.id === consultation.id 
                      ? 'border-blue-500 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{consultation.patient}</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(consultation.status)}`}>
                      {consultation.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{consultation.doctor}</span>
                    <div className="flex items-center gap-1">
                      {consultation.type === 'video' ? <Video className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{consultation.startTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Chat</h3>
            <div className="h-64 overflow-y-auto mb-3 space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`text-xs ${
                    msg.type === 'system' ? 'text-center text-gray-500' :
                    msg.type === 'transcription' ? 'bg-yellow-50 p-2 rounded' :
                    msg.type === 'doctor' ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.type !== 'system' && (
                    <p className="font-medium text-gray-700">{msg.sender}</p>
                  )}
                  <p className={msg.type === 'doctor' ? 'text-blue-600' : 'text-gray-600'}>
                    {msg.message}
                  </p>
                  <p className="text-gray-400 text-xs">{msg.time}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-white rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white">
            <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all">
                <FileText className="w-4 h-4 inline mr-2" />
                Write Prescription
              </button>
              <button className="w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all">
                <Camera className="w-4 h-4 inline mr-2" />
                Take Screenshot
              </button>
              <button className="w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all">
                <Download className="w-4 h-4 inline mr-2" />
                Download Transcript
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TelehealthPlatformV2