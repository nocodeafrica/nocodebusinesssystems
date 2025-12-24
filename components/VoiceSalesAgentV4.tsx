'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import BookMeetingButton from './BookMeetingButton';

const VoiceSalesAgentV4 = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messagesRemaining, setMessagesRemaining] = useState(5);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: 'user' | 'agent'; content: string }>
  >([]);

  const recognitionRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  const startNewSession = () => {
    setSessionId(null);
    setMessagesRemaining(5);
    setSessionExpired(false);
    setTranscript('');
    setAgentResponse('');
    setConversationHistory([]);
  };

  const startListening = () => {
    if (sessionExpired) {
      startNewSession();
      return;
    }

    setIsListening(true);
    setTranscript('');
    setAgentResponse('');

    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);

        if (event.results[current].isFinal) {
          setIsListening(false);
          processUserInput(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        // Fallback to demo mode if speech recognition fails
        if (event.error === 'not-allowed' || event.error === 'no-speech') {
          const demoInput =
            'I need help building custom software for my business';
          setTranscript(demoInput);
          processUserInput(demoInput);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Browser doesn't support speech recognition - use demo mode
      console.warn('Speech recognition not supported, using demo mode');
      const demoInput = 'I need help building custom software for my business';
      setTranscript(demoInput);
      setIsListening(false);
      processUserInput(demoInput);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processUserInput = async (input: string) => {
    setIsProcessing(true);

    // Add user message to conversation history
    setConversationHistory((prev) => [
      ...prev,
      { role: 'user', content: input },
    ]);

    try {
      // Call the OpenAI-powered chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSessionId(data.sessionId);
        setMessagesRemaining(data.messagesRemaining);
        setAgentResponse(data.response);

        // Add agent response to conversation history
        setConversationHistory((prev) => [
          ...prev,
          { role: 'agent', content: data.response },
        ]);

        if (data.sessionExpired) {
          setSessionExpired(true);
        }

        // Speak the response
        await speakResponse(data.response);
      } else {
        // Handle errors
        if (response.status === 429) {
          setSessionExpired(true);
          const expiredMessage =
            'Thanks for chatting! To continue our conversation, please click to start a new session.';
          setAgentResponse(expiredMessage);
          setConversationHistory((prev) => [
            ...prev,
            { role: 'agent', content: expiredMessage },
          ]);
          await speakResponse(expiredMessage);
        } else {
          const errorMessage =
            'Let me help you explore how Horizon Systems can transform your business. What challenges are you facing?';
          setAgentResponse(errorMessage);
          setConversationHistory((prev) => [
            ...prev,
            { role: 'agent', content: errorMessage },
          ]);
          await speakResponse(errorMessage);
        }
      }
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage =
        "I'd love to learn more about your business needs. What specific problems are you looking to solve?";
      setAgentResponse(errorMessage);
      setConversationHistory((prev) => [
        ...prev,
        { role: 'agent', content: errorMessage },
      ]);
      await speakResponse(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = async (text: string) => {
    setIsAgentSpeaking(true);

    try {
      // Use ElevenLabs for high-quality voice
      const ttsResponse = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (ttsResponse.ok) {
        const audioBlob = await ttsResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.onended = () => {
          setIsAgentSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          console.error('Audio playback failed');
          setIsAgentSpeaking(false);
          useBrowserTTS(text);
        };

        await audio.play();
      } else {
        console.warn('ElevenLabs TTS failed, using browser TTS');
        useBrowserTTS(text);
      }
    } catch (error) {
      console.error('TTS Error:', error);
      useBrowserTTS(text);
    }
  };

  // Browser TTS fallback function
  const useBrowserTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();

      // Prefer female voices for sales agent
      const preferredVoices = [
        'Google UK English Female',
        'Google US English Female',
        'Microsoft Zira - English (United States)',
        'Samantha',
        'Victoria',
      ];

      const selectedVoice =
        preferredVoices
          .map((name) => voices.find((v) => v.name.includes(name)))
          .find((v) => v) ||
        voices.find(
          (v) => v.lang.startsWith('en') && v.name.includes('Female')
        ) ||
        voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.volume = 0.9;

      utterance.onend = () => setIsAgentSpeaking(false);
      utterance.onerror = () => setIsAgentSpeaking(false);

      speechSynthesis.speak(utterance);
    } else {
      // No TTS available, just show text
      setTimeout(() => setIsAgentSpeaking(false), 3000);
    }
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex h-[500px] flex-col sm:h-[500px] sm:flex-row lg:h-[600px]">
          {/* Left Side / Top (Mobile) - Voice Orb */}
          <div className="flex h-[200px] w-full flex-col items-center justify-center border-b border-gray-100 p-4 sm:h-full sm:w-1/3 sm:border-b-0 sm:border-r sm:p-8">
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 sm:mb-6"
            >
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-2 py-1 backdrop-blur-md sm:px-3 sm:py-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                <span className="text-[10px] font-medium text-gray-600 sm:text-xs">
                  AI-Powered Sales Assistant
                </span>
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
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <AnimatePresence>
                    {(isListening || isAgentSpeaking || isProcessing) && (
                      <>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.2, opacity: 0.4 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                          className="absolute h-24 w-24 rounded-full bg-gradient-to-r from-blue-400 to-lime-400 blur-2xl sm:h-40 sm:w-40"
                        />
                        {/* Additional pulsing rings when speaking */}
                        {isAgentSpeaking && (
                          <>
                            <motion.div
                              initial={{ scale: 1, opacity: 0.6 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeOut',
                              }}
                              className="absolute h-20 w-20 rounded-full border-2 border-lime-400 sm:h-32 sm:w-32"
                            />
                            <motion.div
                              initial={{ scale: 1, opacity: 0.6 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeOut',
                                delay: 0.5,
                              }}
                              className="absolute h-20 w-20 rounded-full border-2 border-lime-500 sm:h-32 sm:w-32"
                            />
                          </>
                        )}
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Orb Button */}
                <motion.button
                  onClick={
                    sessionExpired
                      ? startNewSession
                      : isListening
                        ? stopListening
                        : startListening
                  }
                  disabled={isProcessing || isAgentSpeaking}
                  animate={{
                    scale: isAgentSpeaking
                      ? [1, 1.05, 1]
                      : isHovered
                        ? 1.05
                        : 1,
                  }}
                  transition={
                    isAgentSpeaking
                      ? {
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }
                      : {}
                  }
                  whileTap={{ scale: 0.95 }}
                  className="group relative h-20 w-20 overflow-hidden rounded-full shadow-xl sm:h-32 sm:w-32"
                >
                  <div className="absolute inset-0 rounded-full border-2 border-white/30 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl" />

                  <div
                    className={`absolute inset-2 rounded-full bg-gradient-to-br ${
                      sessionExpired
                        ? 'from-orange-400 to-red-400'
                        : isProcessing
                          ? 'from-purple-500 to-blue-500'
                          : isListening
                            ? 'from-blue-500 to-lime-500'
                            : isAgentSpeaking
                              ? 'from-lime-500 to-blue-500'
                              : 'from-blue-400 to-lime-400'
                    } transition-all duration-500`}
                  />

                  <div className="relative z-10 flex h-full w-full items-center justify-center">
                    {sessionExpired ? (
                      <svg
                        className="h-10 w-10 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-6l2.5 2.5L12 17l-4-4 4-4 1.5 1.5L11 8h6v5z" />
                      </svg>
                    ) : isProcessing ? (
                      <div className="border-3 h-10 w-10 animate-spin rounded-full border-white border-t-transparent" />
                    ) : (
                      <svg
                        className="h-10 w-10 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
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
                  className="mt-4 flex h-8 items-center justify-center gap-1"
                >
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={`wave-${i}`}
                      className="w-1 rounded-full bg-gradient-to-t from-lime-400 to-blue-400"
                      animate={{
                        height: [12, 24, 12],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut',
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
                {!isListening &&
                  !isAgentSpeaking &&
                  !isProcessing &&
                  !sessionExpired && (
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
                className="mt-4 rounded-full bg-blue-50 px-3 py-1"
              >
                <span className="text-xs text-blue-600">
                  {messagesRemaining}{' '}
                  {messagesRemaining === 1 ? 'message' : 'messages'} remaining
                </span>
              </motion.div>
            )}
          </div>

          {/* Right Side / Bottom (Mobile) - Chat Conversation */}
          <div className="flex h-[300px] flex-1 flex-col bg-white sm:h-auto">
            {/* Chat Header */}
            <div className="border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
              <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
                Sarah • Sales AI
              </h3>
              <p className="text-xs text-gray-500 sm:text-sm">
                Horizon Systems
              </p>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="max-h-[200px] flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:max-h-none sm:space-y-4 sm:px-6 sm:py-4"
            >
              {conversationHistory.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-center text-gray-400">
                    Click the microphone to start a conversation
                    <br />
                    <span className="text-sm">
                      Ask about our custom software solutions
                    </span>
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
                      <div
                        className={`max-w-[90%] rounded-2xl px-3 py-2 sm:max-w-[80%] sm:px-4 sm:py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-xs leading-relaxed sm:text-sm">
                          {message.content}
                        </p>
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
                  <div className="max-w-[90%] rounded-2xl bg-blue-100 px-3 py-2 text-blue-600 sm:max-w-[80%] sm:px-4 sm:py-3">
                    <p className="text-xs italic sm:text-sm">{transcript}</p>
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
        <BookMeetingButton />
        <p className="mt-3 text-sm text-gray-500">
          Schedule your free consultation • No credit card required
        </p>
      </motion.div>
    </div>
  );
};

export default VoiceSalesAgentV4;
