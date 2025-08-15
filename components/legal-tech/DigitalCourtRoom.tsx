'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Gavel,
  Video,
  Users,
  Monitor,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share2,
  MessageSquare,
  FileText,
  Upload,
  Play,
  Pause,
  Clock,
  User,
  Shield,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Settings,
  Maximize2,
  Minimize2,
  PictureInPicture2,
  Volume2,
  VolumeX,
  Grid,
  Eye,
  Hand,
  ScreenShare,
  ScreenShareOff,
  Send,
  X,
  Maximize,
  Minimize
} from 'lucide-react'

// Participants data
const participants = [
  { id: 1, name: 'Judge Khumalo', role: 'Presiding Judge', avatar: '⚖️', video: true, audio: true, status: 'active' },
  { id: 2, name: 'Adv. Molefe', role: 'Plaintiff Counsel', avatar: '👨‍⚖️', video: true, audio: false, status: 'active' },
  { id: 3, name: 'Adv. Naidoo', role: 'Defense Counsel', avatar: '👩‍⚖️', video: true, audio: true, status: 'active' },
  { id: 4, name: 'J. Kruger', role: 'Witness', avatar: '👤', video: true, audio: true, status: 'speaking' },
  { id: 5, name: 'Court Clerk', role: 'Clerk', avatar: '📝', video: false, audio: true, status: 'active' },
  { id: 6, name: 'Court Reporter', role: 'Reporter', avatar: '⌨️', video: false, audio: false, status: 'active' }
]

// Evidence items
const evidenceItems = [
  { id: 1, name: 'Contract_Agreement.pdf', type: 'document', size: '2.3 MB', status: 'admitted' },
  { id: 2, name: 'Email_Chain.pdf', type: 'document', size: '450 KB', status: 'admitted' },
  { id: 3, name: 'Security_Footage.mp4', type: 'video', size: '125 MB', status: 'pending' },
  { id: 4, name: 'Financial_Records.xlsx', type: 'spreadsheet', size: '1.8 MB', status: 'admitted' },
  { id: 5, name: 'Site_Photos.zip', type: 'images', size: '45 MB', status: 'rejected' }
]

// Chat messages
const chatMessages = [
  { id: 1, sender: 'Court Clerk', message: 'Court is now in session', time: '09:00', type: 'system' },
  { id: 2, sender: 'Judge Khumalo', message: 'Counsel, please present your opening statement', time: '09:02', type: 'judge' },
  { id: 3, sender: 'Adv. Molefe', message: 'Requesting permission to share evidence item #1', time: '09:15', type: 'request' },
  { id: 4, sender: 'Judge Khumalo', message: 'Permission granted', time: '09:16', type: 'judge' }
]

const DigitalCourtRoom = () => {
  const [isInSession, setIsInSession] = useState(false)
  const [activeView, setActiveView] = useState<'gallery' | 'speaker' | 'evidence'>('speaker')
  const [isMuted, setIsMuted] = useState(true) // Start muted by default
  const [isVideoOn, setIsVideoOn] = useState(false) // Start with camera off by default
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState(evidenceItems[0])
  const [sessionTime, setSessionTime] = useState(0)
  const [handRaised, setHandRaised] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const [transcript, setTranscript] = useState<string>('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isPictureInPicture, setIsPictureInPicture] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const galleryVideoRef = useRef<HTMLVideoElement>(null)
  const screenShareRef = useRef<HTMLVideoElement>(null)
  const recognitionRef = useRef<any>(null)
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isInSession) {
      const interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isInSession])

  // Setup video when stream is available or view changes
  useEffect(() => {
    if (localStream) {
      // Update both video elements when stream is available
      if (videoRef.current) {
        videoRef.current.srcObject = localStream
        videoRef.current.play().catch(e => console.log('Speaker video play error:', e))
      }
      if (galleryVideoRef.current) {
        galleryVideoRef.current.srcObject = localStream
        galleryVideoRef.current.play().catch(e => console.log('Gallery video play error:', e))
      }
    }
  }, [localStream, activeView]) // Re-run when view changes

  // Setup screen share when stream is available
  useEffect(() => {
    if (screenStream && screenShareRef.current) {
      console.log('Setting up screen share stream')
      screenShareRef.current.srcObject = screenStream
      screenShareRef.current.play().catch(e => console.log('Screen share play error:', e))
    }
  }, [screenStream])

  // Cleanup notification timeout on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  // Helper function to show notification with auto-clear
  const showNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setNotifications([])
      notificationTimeoutRef.current = null
    }, 3000)
  }

  // Handle camera toggle
  const toggleCamera = async () => {
    if (!isVideoOn) {
      // Turn camera ON
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }, 
          audio: false 
        })
        setLocalStream(stream)
        setIsVideoOn(true)
        showNotification('Camera turned on')
      } catch (error) {
        console.error('Error accessing camera:', error)
        showNotification('Camera access denied or unavailable')
      }
    } else {
      // Turn camera OFF
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
        setLocalStream(null)
        if (videoRef.current) {
          videoRef.current.srcObject = null
        }
        if (galleryVideoRef.current) {
          galleryVideoRef.current.srcObject = null
        }
      }
      setIsVideoOn(false)
      showNotification('Camera turned off')
    }
  }

  // Toggle Picture-in-Picture mode (like Google Meet)
  const togglePictureInPicture = async () => {
    console.log('PiP button clicked')
    console.log('PiP enabled in browser?', document.pictureInPictureEnabled)
    console.log('Current PiP state:', isPictureInPicture)
    console.log('Video ref:', videoRef.current)
    console.log('Gallery video ref:', galleryVideoRef.current)
    console.log('Local stream:', localStream)
    
    if (!document.pictureInPictureEnabled) {
      showNotification('Picture-in-Picture not supported in this browser')
      return
    }

    try {
      if (!isPictureInPicture) {
        // Enter PiP mode
        let videoElement = null
        
        // Try to find the active video element based on the current view
        if (activeView === 'gallery' && galleryVideoRef.current && localStream) {
          videoElement = galleryVideoRef.current
          console.log('Using gallery video element')
        } else if (activeView === 'speaker' && videoRef.current && localStream) {
          videoElement = videoRef.current
          console.log('Using speaker video element')
        }
        
        if (videoElement && localStream) {
          console.log('Requesting PiP on video element:', videoElement)
          console.log('Video element has srcObject?', videoElement.srcObject !== null)
          console.log('Video element readyState:', videoElement.readyState)
          
          // Ensure video is playing before requesting PiP
          if (videoElement.paused) {
            await videoElement.play()
          }
          
          const pipWindow = await videoElement.requestPictureInPicture()
          console.log('PiP window created:', pipWindow)
          setIsPictureInPicture(true)
          showNotification('Picture-in-Picture mode activated - you can now switch tabs!')
        } else {
          console.log('No video element or stream available')
          showNotification('Please turn on your camera first')
        }
      } else {
        // Exit PiP mode
        if (document.pictureInPictureElement) {
          console.log('Exiting PiP mode')
          await document.exitPictureInPicture()
          setIsPictureInPicture(false)
          showNotification('Exited Picture-in-Picture mode')
        }
      }
    } catch (error) {
      console.error('PiP error:', error)
      showNotification(`PiP error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Listen for PiP state changes
  useEffect(() => {
    const handleEnterPiP = () => {
      console.log('Entered PiP mode')
      setIsPictureInPicture(true)
    }
    
    const handleLeavePiP = () => {
      console.log('Left PiP mode')
      setIsPictureInPicture(false)
    }

    const videoElement = videoRef.current
    const galleryElement = galleryVideoRef.current
    
    if (videoElement) {
      videoElement.addEventListener('enterpictureinpicture', handleEnterPiP)
      videoElement.addEventListener('leavepictureinpicture', handleLeavePiP)
    }
    
    if (galleryElement) {
      galleryElement.addEventListener('enterpictureinpicture', handleEnterPiP)
      galleryElement.addEventListener('leavepictureinpicture', handleLeavePiP)
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('enterpictureinpicture', handleEnterPiP)
        videoElement.removeEventListener('leavepictureinpicture', handleLeavePiP)
      }
      if (galleryElement) {
        galleryElement.removeEventListener('enterpictureinpicture', handleEnterPiP)
        galleryElement.removeEventListener('leavepictureinpicture', handleLeavePiP)
      }
    }
  }, [localStream]) // Re-attach listeners when stream changes

  // Handle screen share toggle
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      // Start screen share
      setIsScreenSharing(true) // Set this first to show loading state
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: false
        })
        
        console.log('Screen share stream obtained:', stream)
        console.log('Video tracks:', stream.getVideoTracks())
        
        setScreenStream(stream)
        showNotification('Screen sharing started')
        
        // Auto-enable PiP for camera when screen sharing starts (like Google Meet)
        // This shows YOUR CAMERA in PiP while you share your screen
        if (isVideoOn && localStream) {
          setTimeout(async () => {
            try {
              const videoElement = activeView === 'gallery' ? galleryVideoRef.current : videoRef.current
              if (videoElement && !document.pictureInPictureElement) {
                await videoElement.requestPictureInPicture()
                showNotification('Camera in Picture-in-Picture - you can now switch tabs while sharing!')
              }
            } catch (pipError) {
              console.log('Auto-PiP failed:', pipError)
            }
          }, 500) // Small delay to ensure video is ready
        }
        
        // Handle stream ending when user stops sharing via browser UI
        stream.getVideoTracks()[0].onended = () => {
          console.log('Screen share ended by user')
          setIsScreenSharing(false)
          setScreenStream(null)
          if (screenShareRef.current) {
            screenShareRef.current.srcObject = null
          }
          // Exit PiP when screen sharing stops
          if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(e => console.log('Exit PiP error:', e))
          }
          showNotification('Screen sharing stopped')
        }
      } catch (error) {
        console.error('Error sharing screen:', error)
        setIsScreenSharing(false) // Reset if error
        showNotification('Screen sharing cancelled or unavailable')
      }
    } else {
      // Stop screen share
      if (screenStream) {
        screenStream.getTracks().forEach(track => {
          track.stop()
          console.log('Stopped track:', track)
        })
        setScreenStream(null)
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = null
        }
      }
      setIsScreenSharing(false)
      // Exit PiP when manually stopping screen share
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(e => console.log('Exit PiP error:', e))
      }
      showNotification('Screen sharing stopped')
    }
  }

  // Handle microphone and transcription
  const toggleMicrophone = () => {
    if (isMuted) {
      // Unmute and start transcription
      setIsMuted(false)
      startTranscription()
      showNotification('Microphone unmuted - Transcription started')
    } else {
      // Mute and stop transcription
      setIsMuted(true)
      stopTranscription()
      showNotification('Microphone muted')
    }
  }

  const startTranscription = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setTranscript('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-ZA' // South African English
    
    recognition.onstart = () => {
      setIsTranscribing(true)
      setTranscript('Listening...')
    }
    
    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''
      
      // Get the last final transcript index
      let lastFinalIndex = -1
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          lastFinalIndex = i
        }
      }
      
      // Build the complete transcript
      let fullTranscript = ''
      for (let i = 0; i <= lastFinalIndex; i++) {
        if (event.results[i].isFinal) {
          fullTranscript += event.results[i][0].transcript + ' '
        }
      }
      
      // Get interim results after the last final
      for (let i = lastFinalIndex + 1; i < event.results.length; i++) {
        interimTranscript += event.results[i][0].transcript + ' '
      }
      
      // Update transcript - show final + interim (without brackets)
      if (fullTranscript || interimTranscript) {
        const display = fullTranscript + (interimTranscript ? interimTranscript : '')
        setTranscript(display.trim())
      }
    }
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsTranscribing(false)
      if (event.error === 'no-speech') {
        setTranscript('No speech detected')
      }
    }
    
    recognition.onend = () => {
      setIsTranscribing(false)
      // Restart if still unmuted and recognition is available
      if (!isMuted && recognitionRef.current === recognition) {
        try {
          recognition.start()
        } catch (e) {
          console.log('Recognition restart error:', e)
        }
      }
    }
    
    recognitionRef.current = recognition
    
    try {
      recognition.start()
    } catch (e) {
      console.error('Recognition start error:', e)
    }
  }

  const stopTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      setIsTranscribing(false)
    }
  }

  const endSession = () => {
    // Stop all media streams before ending session
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop())
      setScreenStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    if (galleryVideoRef.current) {
      galleryVideoRef.current.srcObject = null
    }
    if (screenShareRef.current) {
      screenShareRef.current.srcObject = null
    }
    stopTranscription()
    setIsInSession(false)
    setIsVideoOn(false) // Reset to off for next session
    setIsScreenSharing(false)
    setIsMuted(true) // Reset to muted for next session
    setSessionTime(0)
    setHandRaised(false)
    setTranscript('')
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'admitted': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 min-h-[700px] border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Digital Court Room</h2>
            <p className="text-gray-600">Case #2024-HC-1547 • Virtual Proceedings</p>
          </div>
        </div>
        {isInSession && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-700">LIVE</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">{formatTime(sessionTime)}</span>
            </div>
          </div>
        )}
      </div>

      {!isInSession ? (
        // Pre-session view
        <div className="flex items-center justify-center h-[550px]">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Gavel className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Virtual Court Room</h3>
            <p className="text-gray-600 mb-8">
              Join the digital court proceedings with secure video conferencing, evidence presentation, and real-time transcription
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsInSession(true)}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-medium shadow-lg shadow-indigo-500/25"
            >
              Start Court Session
            </motion.button>
          </div>
        </div>
      ) : (
        // In-session view
        <>
          {/* Notifications */}
          <AnimatePresence>
            {notifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
              >
                <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
                  {notifications[notifications.length - 1]}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        <div className="grid grid-cols-12 gap-4">
          {/* Main Video Area */}
          <div className="col-span-8 space-y-4">
            {/* View Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {['speaker', 'gallery', 'evidence'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeView === view
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {view === 'speaker' && <Monitor className="w-4 h-4 inline mr-1" />}
                    {view === 'gallery' && <Grid className="w-4 h-4 inline mr-1" />}
                    {view === 'evidence' && <FileText className="w-4 h-4 inline mr-1" />}
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Display */}
            {activeView === 'speaker' && (
              <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
                {isScreenSharing ? (
                  <>
                    <video
                      ref={screenShareRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                      style={{ display: screenStream ? 'block' : 'none' }}
                    />
                    {!screenStream && (
                      <div className="text-center">
                        <Monitor className="w-16 h-16 text-indigo-400 mb-4 mx-auto animate-pulse" />
                        <p className="text-white font-medium">Preparing screen share...</p>
                        <p className="text-gray-400 text-sm mt-2">Select a window or screen to share</p>
                      </div>
                    )}
                    {/* Show camera PiP status when screen sharing */}
                    {screenStream && isPictureInPicture && (
                      <div className="absolute top-4 left-4 bg-purple-600/90 px-3 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm">
                        <PictureInPicture2 className="w-4 h-4 text-white" />
                        <span className="text-white text-sm">Your camera is floating - switch tabs to present!</span>
                      </div>
                    )}
                  </>
                ) : isVideoOn && localStream ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <p className="text-white text-sm font-medium">You</p>
                    </div>
                    {/* PiP Indicator */}
                    {isPictureInPicture && (
                      <div className="absolute top-4 right-4 bg-purple-600 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <PictureInPicture2 className="w-4 h-4 text-white" />
                        <span className="text-white text-sm">PiP Active</span>
                      </div>
                    )}
                    {/* Live Transcription Display */}
                    {!isMuted && transcript && transcript !== 'Listening...' && (
                      <div className="absolute bottom-16 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 max-w-2xl">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mt-1.5" />
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Live Transcription</p>
                            <p className="text-white text-sm">
                              {transcript.length > 200 ? '...' + transcript.slice(-200) : transcript}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">👤</div>
                    <p className="text-white font-medium">J. Kruger</p>
                    <p className="text-gray-400 text-sm">Witness</p>
                    {!isVideoOn && <p className="text-red-400 text-xs mt-2">Camera Off</p>}
                    {isMuted && <p className="text-yellow-400 text-xs mt-1">Muted</p>}
                  </div>
                )}
                {/* Speaking Indicator */}
                {!isMuted && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 rounded-lg backdrop-blur-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-white">Speaking</span>
                    {isTranscribing && (
                      <span className="text-xs text-gray-300 ml-2">• Transcribing</span>
                    )}
                  </div>
                )}
                {handRaised && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-yellow-500/80 rounded-lg animate-pulse">
                    <Hand className="w-4 h-4 text-white" />
                    <span className="text-sm text-white">Hand Raised</span>
                  </div>
                )}
              </div>
            )}

            {activeView === 'gallery' && (
              <div className="grid grid-cols-3 gap-3">
                {/* Your video feed */}
                {isVideoOn && localStream ? (
                  <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                    <video
                      ref={galleryVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
                      <p className="text-white text-xs font-medium">You</p>
                    </div>
                    {!isMuted && (
                      <div className="absolute top-2 left-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      {isMuted && <MicOff className="w-4 h-4 text-red-500" />}
                      {!isVideoOn && <CameraOff className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="text-4xl mb-2">👤</div>
                      <p className="text-white text-sm font-medium">You</p>
                      <p className="text-gray-400 text-xs">Witness</p>
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {isMuted && <MicOff className="w-4 h-4 text-red-500" />}
                      <CameraOff className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                )}
                
                {/* Other participants */}
                {participants.map((participant) => (
                  <div key={participant.id} className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{participant.avatar}</div>
                      <p className="text-white text-sm font-medium">{participant.name}</p>
                      <p className="text-gray-400 text-xs">{participant.role}</p>
                    </div>
                    {participant.status === 'speaking' && (
                      <div className="absolute top-2 left-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {!participant.audio && <MicOff className="w-4 h-4 text-red-500" />}
                      {!participant.video && <CameraOff className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeView === 'evidence' && (
              <div className="bg-gray-50 rounded-2xl p-6 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium">{selectedEvidence.name}</p>
                  <p className="text-gray-500 text-sm mb-4">{selectedEvidence.type} • {selectedEvidence.size}</p>
                  <div className="flex items-center justify-center gap-3">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Present Evidence
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      Annotate
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Control Bar */}
            <div className="bg-gray-100 rounded-2xl p-4 flex items-center justify-center gap-3">
              <button
                onClick={toggleMicrophone}
                className={`p-3 rounded-xl transition-all ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleCamera}
                className={`p-3 rounded-xl transition-all ${
                  !isVideoOn ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isVideoOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-xl transition-all ${
                  isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isScreenSharing ? <ScreenShareOff className="w-5 h-5" /> : <ScreenShare className="w-5 h-5" />}
              </button>
              <button
                onClick={togglePictureInPicture}
                className={`p-3 rounded-xl transition-all relative ${
                  isPictureInPicture ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                title="Picture-in-Picture (works across tabs!)"
              >
                <PictureInPicture2 className="w-5 h-5" />
                {isPictureInPicture && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </button>
              <button
                onClick={() => {
                  setHandRaised(!handRaised)
                  showNotification(handRaised ? 'Hand lowered' : 'Hand raised - waiting to speak')
                }}
                className={`p-3 rounded-xl transition-all ${
                  handRaised ? 'bg-yellow-500 text-white animate-pulse' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Hand className="w-5 h-5" />
              </button>
              <button
                onClick={endSession}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                End Session
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-4">
            {/* Evidence Panel */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Evidence</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {evidenceItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedEvidence(item)}
                    className={`p-3 bg-white rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedEvidence.id === item.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.size}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Panel */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Court Chat</h3>
              {/* Live Transcription in Chat */}
              {!isMuted && transcript && (
                <div className="mb-3 p-3 bg-white rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-indigo-600">Live Transcription</span>
                  </div>
                  <p className="text-sm text-gray-700">{transcript}</p>
                </div>
              )}
              <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-medium ${
                        msg.type === 'judge' ? 'text-indigo-600' :
                        msg.type === 'system' ? 'text-gray-500' :
                        'text-gray-700'
                      }`}>
                        {msg.sender}
                      </span>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-gray-600 ml-0">{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-white rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Participants List */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Participants ({participants.length})</h3>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{participant.avatar}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {participant.audio ? (
                        <Mic className="w-3 h-3 text-green-500" />
                      ) : (
                        <MicOff className="w-3 h-3 text-red-500" />
                      )}
                      {participant.video ? (
                        <Camera className="w-3 h-3 text-green-500" />
                      ) : (
                        <CameraOff className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  )
}

export default DigitalCourtRoom