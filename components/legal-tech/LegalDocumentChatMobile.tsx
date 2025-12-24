'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Send,
  Search,
  FileText,
  BookOpen,
  Scale,
  MessageCircle,
  Sparkles,
  PaperclipIcon,
  ChevronRight,
  Clock,
  Brain,
  AlertCircle,
  Briefcase,
  Building2,
  Shield,
  FileCheck,
  Bot,
  User
} from 'lucide-react'

interface LegalDocumentChatMobileProps {
  onBack?: () => void
}

// Pre-built questions for testing
const preBuiltQuestions = [
  'What are the notice period requirements under SA law?',
  'What are the requirements for a private company (Pty) Ltd?',
  'What are the 8 conditions for lawful processing?',
  'Explain the duties of directors under Section 76'
]

// Pre-generated responses for demo
const preGeneratedResponses: { [key: string]: string } = {
  'What are the notice period requirements under SA law?': `Under South African labour law, notice periods are governed by the Basic Conditions of Employment Act (BCEA):

• **First 6 months**: 1 week notice
• **6 months - 1 year**: 2 weeks notice  
• **More than 1 year**: 4 weeks notice

These are minimum requirements. Employment contracts can specify longer notice periods but cannot be less than the BCEA minimums.`,

  'What are the requirements for a private company (Pty) Ltd?': `To register a private company (Pty) Ltd in South Africa under the Companies Act 71 of 2008:

**Minimum Requirements:**
• At least 1 director (SA resident)
• At least 1 shareholder (can be same as director)
• Company name ending with "(Pty) Ltd"
• Registered office in South Africa
• Memorandum of Incorporation (MOI)

**Registration Process:**
• Reserve company name with CIPC
• Submit CoR 14.1 and supporting documents
• Pay prescribed fees (R175 for online registration)`,

  'What are the 8 conditions for lawful processing?': `Under POPIA, the 8 conditions for lawful processing of personal information are:

1. **Accountability** - Ensure compliance with all conditions
2. **Processing Limitation** - Process only with consent or justification
3. **Purpose Specification** - Collect for specific, lawful purpose
4. **Further Processing Limitation** - Use only for original purpose
5. **Information Quality** - Keep accurate and updated
6. **Openness** - Notify data subjects of collection
7. **Security Safeguards** - Protect against loss or damage
8. **Data Subject Participation** - Allow access and correction

Non-compliance can result in fines up to R10 million.`,

  'Explain the duties of directors under Section 76': `Section 76 of the Companies Act sets out directors' standards of conduct:

**Fiduciary Duties:**
• Act in good faith and for proper purpose
• Act in best interests of the company
• Not use position for personal gain

**Duty of Care and Skill:**
• Act with care, skill and diligence
• Make informed business judgments
• Take reasonably diligent steps to be informed

**Personal Liability:**
Directors can be held personally liable for breach of these duties.`
}

export default function LegalDocumentChatMobile({ onBack }: LegalDocumentChatMobileProps) {
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'chat' | 'documents' | 'citations'>('chat')
  const [chatMessages, setChatMessages] = useState<any[]>([
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleQuestionClick = (question: string) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: question,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const response = preGeneratedResponses[question] || 'I can help you with that question. Please provide more context or try one of the suggested questions.'
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: response,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        citations: ['Legal Database', 'SA Legislation']
      }
      setChatMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Check if it's one of the pre-built questions
    if (preGeneratedResponses[message]) {
      handleQuestionClick(message)
    } else {
      // Add user message
      const userMessage = {
        id: Date.now(),
        type: 'user',
        message: message,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      
      setChatMessages(prev => [...prev, userMessage])
      setMessage('')
      setIsTyping(true)

      // Simulate generic AI response
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          message: 'I understand your question. Let me search through the legal documents to provide you with an accurate answer. In a production environment, this would connect to your legal database and AI models.',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          citations: ['Legal Database']
        }
        setChatMessages(prev => [...prev, aiMessage])
        setIsTyping(false)
      }, 1500)
    }
  }

  // Sample documents
  const documents = [
    { id: 1, name: 'Service Agreement', pages: 28, lastAccessed: '2 hours ago' },
    { id: 2, name: 'Termination Policy', pages: 8, lastAccessed: '1 day ago' },
    { id: 3, name: 'Contract Addendum', pages: 4, lastAccessed: '3 days ago' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
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
                <h1 className="text-xl font-bold text-gray-900">Legal AI Assistant</h1>
                <p className="text-sm text-gray-600">Chat with your documents</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Capabilities Banner */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-semibold">AI-Powered Analysis</span>
          </div>
          <p className="text-xs opacity-90">
            Ask questions about contracts, cases, and legal documents
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b mt-4">
        <div className="px-4">
          <div className="flex gap-6">
            {[
              { id: 'chat', label: 'Chat', icon: MessageCircle },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'citations', label: 'Citations', icon: BookOpen }
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

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chat' && (
          <div className="px-4 py-4 space-y-4">
            {/* Pre-built Questions */}
            {chatMessages.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Try These Questions
                </h3>
                <div className="space-y-2">
                  {preBuiltQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleQuestionClick(question)}
                      className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 inline mr-2 text-gray-400" />
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {chatMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl' 
                    : 'bg-white shadow-sm rounded-tr-xl rounded-br-xl rounded-bl-xl'
                }`}>
                  <div className="p-3">
                    {msg.type === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">AI Assistant</span>
                      </div>
                    )}
                    <p className={`text-sm whitespace-pre-wrap ${
                      msg.type === 'user' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {msg.message}
                    </p>
                    {msg.citations && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Sources:</p>
                        <div className="flex flex-wrap gap-1">
                          {msg.citations.map((citation: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {citation}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`px-3 pb-2 text-xs ${
                    msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {msg.time}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white shadow-sm rounded-tr-xl rounded-br-xl rounded-bl-xl p-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="px-4 py-4 space-y-3">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.pages} pages • {doc.lastAccessed}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'citations' && (
          <div className="px-4 py-4 space-y-3">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Smith v. Jones (2023)</p>
                  <p className="text-sm text-gray-600 mt-1">
                    "Termination clauses must provide reasonable notice period..."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Constitutional Court • 2023 ZACC 15</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">TechCorp v. DataSys (2022)</p>
                  <p className="text-sm text-gray-600 mt-1">
                    "Force majeure clauses interpretation in digital services..."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">High Court • 2022 ZAGPPHC 234</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Only show in chat tab */}
      {activeTab === 'chat' && (
        <div className="bg-white border-t px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <PaperclipIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your legal documents..."
              className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSendMessage}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {/* Quick Suggestions */}
          {chatMessages.length > 0 && (
            <div className="flex items-center gap-2 mt-2 overflow-x-auto">
              {preBuiltQuestions.slice(0, 2).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 whitespace-nowrap"
                >
                  {question.substring(0, 30)}...
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}