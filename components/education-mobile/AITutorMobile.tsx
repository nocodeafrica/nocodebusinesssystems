'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Bot, User, Sparkles, BookOpen, Brain,
  Calculator, Lightbulb, HelpCircle, ChevronUp,
  Mic, Camera, Paperclip, History, Star,
  TrendingUp, Target, Award, Zap
} from 'lucide-react'

// Message type definition
type Message = {
  id: number
  type: string
  message: string
  time: string
  suggestions: string[]
  hasEquation?: boolean
  hasDiagram?: boolean
}

// Sample conversation history
const initialMessages: Message[] = [
  {
    id: 1,
    type: 'bot',
    message: "Hi! I'm your AI tutor. What subject would you like help with today?",
    time: '10:00 AM',
    suggestions: ['Mathematics', 'Science', 'English', 'History']
  }
]

// Subject topics for quick access
const subjectTopics = {
  Mathematics: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'],
  Science: ['Physics', 'Chemistry', 'Biology', 'Earth Science', 'Astronomy'],
  English: ['Grammar', 'Writing', 'Literature', 'Vocabulary', 'Essay Help'],
  History: ['World History', 'American History', 'Ancient Civilizations', 'Modern History']
}

// Learning modules
const learningModules = [
  { id: 1, title: 'Quadratic Equations', subject: 'Math', progress: 75, difficulty: 'Medium' },
  { id: 2, title: 'Photosynthesis', subject: 'Biology', progress: 60, difficulty: 'Easy' },
  { id: 3, title: 'Essay Structure', subject: 'English', progress: 90, difficulty: 'Easy' },
  { id: 4, title: 'World War II', subject: 'History', progress: 45, difficulty: 'Hard' }
]

const AITutorMobile = () => {
  const [messages, setMessages] = useState(initialMessages)
  const [inputText, setInputText] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [activeView, setActiveView] = useState<'chat' | 'modules' | 'progress'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputText.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      message: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [] as string[]
    }

    setMessages([...messages, newMessage])
    setInputText('')
    setIsTyping(true)
    setShowQuickActions(false)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'bot',
        message: "Let me help you with that! Here's a step-by-step explanation...",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [] as string[],
        hasEquation: inputText.toLowerCase().includes('equation') || inputText.toLowerCase().includes('solve'),
        hasDiagram: inputText.toLowerCase().includes('diagram') || inputText.toLowerCase().includes('show')
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action: string) => {
    setInputText(action)
    handleSend()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-600'
      case 'Medium': return 'bg-yellow-100 text-yellow-600'
      case 'Hard': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AI Tutor</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Online & ready to help
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-purple-100 rounded-lg"
          >
            <Sparkles className="w-5 h-5 text-purple-600" />
          </motion.button>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2">
          {(['chat', 'modules', 'progress'] as const).map(view => (
            <motion.button
              key={view}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView(view)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${
                activeView === view 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {view}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'chat' && (
          <>
            {/* Subject Selector */}
            {!selectedSubject && (
              <div className="px-4 py-3 bg-white border-b">
                <p className="text-sm text-gray-600 mb-2">Select a subject:</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {Object.keys(subjectTopics).map(subject => (
                    <motion.button
                      key={subject}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSubject(subject)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-medium whitespace-nowrap"
                    >
                      {subject}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                        : 'bg-white shadow-sm'
                    }`}>
                      <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                        {message.message}
                      </p>

                      {/* Equation Example */}
                      {message.hasEquation && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-2">Solution:</p>
                          <div className="font-mono text-sm text-gray-900">
                            x² + 5x + 6 = 0<br/>
                            (x + 2)(x + 3) = 0<br/>
                            x = -2 or x = -3
                          </div>
                        </div>
                      )}

                      {/* Diagram Placeholder */}
                      {message.hasDiagram && (
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                          <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Interactive diagram</p>
                        </div>
                      )}

                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, i) => (
                            <motion.button
                              key={i}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuickAction(suggestion)}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className={`text-xs mt-1 px-2 ${
                      message.type === 'user' ? 'text-right text-gray-500' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 px-4"
                >
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Topics */}
            {selectedSubject && showQuickActions && (
              <div className="px-4 py-3 bg-white border-t">
                <p className="text-xs text-gray-500 mb-2">Quick topics in {selectedSubject}:</p>
                <div className="flex gap-2 overflow-x-auto">
                  {subjectTopics[selectedSubject as keyof typeof subjectTopics].map(topic => (
                    <motion.button
                      key={topic}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickAction(`Help me with ${topic}`)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium whitespace-nowrap"
                    >
                      {topic}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeView === 'modules' && (
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Learning Modules</h3>
            {learningModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{module.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{module.subject}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{module.progress}%</p>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${module.progress}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeView === 'progress' && (
          <div className="p-4 space-y-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-xs text-gray-500">Questions Solved</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="text-xs text-green-600 font-medium">+12%</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">89%</p>
                <p className="text-xs text-gray-500">Accuracy Rate</p>
              </motion.div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Weekly Activity</h3>
              <div className="flex items-end justify-between gap-2 h-24">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                  const height = 30 + Math.random() * 70
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t"
                      />
                      <span className="text-xs text-gray-500">{day}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Recent Achievements</h3>
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-gray-600">Quick Learner</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-gray-600">Problem Solver</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-gray-600">Goal Achiever</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area (only for chat view) */}
      {activeView === 'chat' && (
        <div className="bg-white border-t px-4 py-3">
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500"
            >
              <Paperclip className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500"
            >
              <Camera className="w-5 h-5" />
            </motion.button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5"
              >
                <Mic className="w-4 h-4 text-gray-500" />
              </motion.button>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AITutorMobile