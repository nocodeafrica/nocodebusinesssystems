'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VoiceSalesAgentV4 = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [agentResponse, setAgentResponse] = useState('')
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messagesRemaining, setMessagesRemaining] = useState(5)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'agent', content: string}>>([])
  
  const recognitionRef = useRef<any>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [conversationHistory])

  const startNewSession = () => {
    setSessionId(null)
    setMessagesRemaining(5)
    setSessionExpired(false)
    setTranscript('')
    setAgentResponse('')
    setConversationHistory([])
  }

  const startListening = () => {
    if (sessionExpired) {
      startNewSession()
      return
    }

    setIsListening(true)
    setTranscript('')
    setAgentResponse('')
    
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'
      
      recognition.onresult = (event: any) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)
        
        if (event.results[current].isFinal) {
          setIsListening(false)
          processUserInput(transcript)
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        // Fallback to demo mode if speech recognition fails
        if (event.error === 'not-allowed' || event.error === 'no-speech') {
          const demoInput = "I need help building custom software for my business"
          setTranscript(demoInput)
          processUserInput(demoInput)
        }
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognition.start()
    } else {
      // Browser doesn't support speech recognition - use demo mode
      console.warn('Speech recognition not supported, using demo mode')
      const demoInput = "I need help building custom software for my business"
      setTranscript(demoInput)
      setIsListening(false)
      processUserInput(demoInput)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const processUserInput = async (input: string) => {
    setIsProcessing(true)
    
    // Add user message to conversation history
    setConversationHistory(prev => [...prev, { role: 'user', content: input }])
    
    try {
      // Call the OpenAI-powered chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          sessionId: sessionId 
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSessionId(data.sessionId)
        setMessagesRemaining(data.messagesRemaining)
        setAgentResponse(data.response)
        
        // Add agent response to conversation history
        setConversationHistory(prev => [...prev, { role: 'agent', content: data.response }])
        
        if (data.sessionExpired) {
          setSessionExpired(true)
        }
        
        // Speak the response
        await speakResponse(data.response)
      } else {
        // Handle errors
        if (response.status === 429) {
          setSessionExpired(true)
          const expiredMessage = "Thanks for chatting! To continue our conversation, please click to start a new session."
          setAgentResponse(expiredMessage)
          setConversationHistory(prev => [...prev, { role: 'agent', content: expiredMessage }])
          await speakResponse(expiredMessage)
        } else {
          const errorMessage = "Let me help you explore how NoCode Business Systems can transform your business. What challenges are you facing?"
          setAgentResponse(errorMessage)
          setConversationHistory(prev => [...prev, { role: 'agent', content: errorMessage }])
          await speakResponse(errorMessage)
        }
      }
    } catch (error) {
      console.error('Chat Error:', error)
      const errorMessage = "I'd love to learn more about your business needs. What specific problems are you looking to solve?"
      setAgentResponse(errorMessage)
      setConversationHistory(prev => [...prev, { role: 'agent', content: errorMessage }])
      await speakResponse(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const speakResponse = async (text: string) => {
    setIsAgentSpeaking(true)
    
    try {
      // Use ElevenLabs for high-quality voice
      const ttsResponse = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      
      if (ttsResponse.ok) {
        const audioBlob = await ttsResponse.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        
        audio.onended = () => {
          setIsAgentSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }
        
        audio.onerror = () => {
          console.error('Audio playback failed')
          setIsAgentSpeaking(false)
          useBrowserTTS(text)
        }
        
        await audio.play()
      } else {
        console.warn('ElevenLabs TTS failed, using browser TTS')
        useBrowserTTS(text)
      }
    } catch (error) {
      console.error('TTS Error:', error)
      useBrowserTTS(text)
    }
  }

  // Browser TTS fallback function
  const useBrowserTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      const voices = speechSynthesis.getVoices()
      
      // Prefer female voices for sales agent
      const preferredVoices = [
        'Google UK English Female',
        'Google US English Female', 
        'Microsoft Zira - English (United States)',
        'Samantha',
        'Victoria'
      ]
      
      const selectedVoice = preferredVoices
        .map(name => voices.find(v => v.name.includes(name)))
        .find(v => v) || voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) || voices[0]
      
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
      
      utterance.rate = 1.0
      utterance.pitch = 1.05
      utterance.volume = 0.9
      
      utterance.onend = () => setIsAgentSpeaking(false)
      utterance.onerror = () => setIsAgentSpeaking(false)
      
      speechSynthesis.speak(utterance)
    } else {
      // No TTS available, just show text
      setTimeout(() => setIsAgentSpeaking(false), 3000)
    }
  }

  return (
    <div className="relative w-full">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row h-[500px] sm:h-[500px] lg:h-[600px]">
        {/* Left Side / Top (Mobile) - Voice Orb */}
        <div className="w-full sm:w-1/3 h-[200px] sm:h-full flex flex-col items-center justify-center p-4 sm:p-8 border-b sm:border-b-0 sm:border-r border-gray-100">
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 sm:mb-6"
          >
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/60 backdrop-blur-md rounded-full border border-gray-200">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] sm:text-xs text-gray-600 font-medium">AI-Powered Sales Assistant</span>
            </div>
          </motion.div>

          {/* Main Orb Container - Fixed Centering */}
          <div className="relative flex flex-col items-center justify-center">
            <motion.div
              className="relative flex items-center justify-center"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              {/* Combined Animation Container */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <AnimatePresence>
                  {(isListening || isAgentSpeaking || isProcessing) && (
                    <>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 0.4 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute w-24 h-24 sm:w-40 sm:h-40 rounded-full bg-gradient-to-r from-blue-400 to-lime-400 blur-2xl"
                      />
                      {/* Additional pulsing rings when speaking */}
                      {isAgentSpeaking && (
                        <>
                          <motion.div
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                            className="absolute w-20 h-20 sm:w-32 sm:h-32 rounded-full border-2 border-lime-400"
                          />
                          <motion.div
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                            className="absolute w-20 h-20 sm:w-32 sm:h-32 rounded-full border-2 border-lime-500"
                          />
                        </>
                      )}
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Orb Button */}
              <motion.button
              onClick={sessionExpired ? startNewSession : (isListening ? stopListening : startListening)}
              disabled={isProcessing || isAgentSpeaking}
              animate={{
                scale: isAgentSpeaking ? [1, 1.05, 1] : (isHovered ? 1.05 : 1),
              }}
              transition={isAgentSpeaking ? {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
              whileTap={{ scale: 0.95 }}
              className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden group shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border-2 border-white/30 rounded-full" />
              
              <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${
                sessionExpired ? 'from-orange-400 to-red-400' :
                isProcessing ? 'from-purple-500 to-blue-500' :
                isListening ? 'from-blue-500 to-lime-500' :
                isAgentSpeaking ? 'from-lime-500 to-blue-500' :
                'from-blue-400 to-lime-400'
              } transition-all duration-500`} />
              
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {sessionExpired ? (
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-6l2.5 2.5L12 17l-4-4 4-4 1.5 1.5L11 8h6v5z"/>
                  </svg>
                ) : isProcessing ? (
                  <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </div>
            </motion.button>
          </motion.div>
        </div>

          {/* Voice Waveform when speaking */}
          <AnimatePresence>
            {isAgentSpeaking && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-8 flex items-center justify-center gap-1 mt-4"
              >
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={`wave-${i}`}
                    className="w-1 bg-gradient-to-t from-lime-400 to-blue-400 rounded-full"
                    animate={{
                      height: [12, 24, 12],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Text */}
          <motion.div className="mt-6 text-center">
            <AnimatePresence mode="wait">
              {sessionExpired && (
                <motion.p
                  key="expired"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium text-orange-600"
                >
                  Session complete. Tap to start new
                </motion.p>
              )}
              {isProcessing && !sessionExpired && (
                <motion.p
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium text-purple-600"
                >
                  Thinking...
                </motion.p>
              )}
              {isListening && !sessionExpired && (
                <motion.p
                  key="listening"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium text-blue-600"
                >
                  Listening...
                </motion.p>
              )}
              {isAgentSpeaking && !sessionExpired && (
                <motion.p
                  key="speaking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium text-green-600"
                >
                  Sarah is speaking...
                </motion.p>
              )}
              {!isListening && !isAgentSpeaking && !isProcessing && !sessionExpired && (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-gray-500"
                >
                  Tap to speak with Sarah
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Session Info */}
          {messagesRemaining < 5 && !sessionExpired && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 px-3 py-1 bg-blue-50 rounded-full"
            >
              <span className="text-xs text-blue-600">
                {messagesRemaining} {messagesRemaining === 1 ? 'message' : 'messages'} remaining
              </span>
            </motion.div>
          )}
        </div>

        {/* Right Side / Bottom (Mobile) - Chat Conversation */}
        <div className="flex-1 flex flex-col bg-white h-[300px] sm:h-auto">
          {/* Chat Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Sarah • Sales AI</h3>
            <p className="text-xs sm:text-sm text-gray-500">NoCode Business Systems</p>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 max-h-[200px] sm:max-h-none"
          >
            {conversationHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-center">
                  Click the microphone to start a conversation<br/>
                  <span className="text-sm">Ask about our custom software solutions</span>
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {conversationHistory.map((message, index) => (
                  <motion.div
                    key={`message-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[90%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Current transcript (while speaking) */}
            {transcript && isListening && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <div className="max-w-[90%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl bg-blue-100 text-blue-600">
                  <p className="text-xs sm:text-sm italic">{transcript}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      </div>
      
      {/* Call to Action Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <motion.a
          href="https://calendly.com/your-link" // Replace with actual booking link
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-lime-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Book a Meeting
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.a>
        <p className="mt-3 text-sm text-gray-500">
          Schedule your free consultation • No credit card required
        </p>
      </motion.div>
    </div>
  )
}

export default VoiceSalesAgentV4