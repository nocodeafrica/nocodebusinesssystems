'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare,
  Send,
  FileText,
  Search,
  Brain,
  Upload,
  ChevronRight,
  Scale,
  Book,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Download,
  Eye,
  User,
  Bot,
  FileSearch,
  Paperclip,
  X,
  Info,
  Bookmark,
  History,
  Filter,
  Plus,
  Shield,
  Building2,
  Briefcase,
  FileCheck
} from 'lucide-react'

// Sample uploaded documents with SA context
const uploadedDocuments = [
  { 
    id: 1, 
    name: 'Employment Contract 2024.pdf', 
    pages: 45, 
    size: '2.3 MB', 
    type: 'contract',
    icon: Briefcase,
    description: 'Standard employment agreement under SA Labour Relations Act'
  },
  { 
    id: 2, 
    name: 'Companies Act 71 of 2008.pdf', 
    pages: 187, 
    size: '8.7 MB', 
    type: 'legislation',
    icon: Building2,
    description: 'South African Companies Act regulations and compliance'
  },
  { 
    id: 3, 
    name: 'King IV Report on Governance.pdf', 
    pages: 23, 
    size: '1.1 MB', 
    type: 'governance',
    icon: Shield,
    description: 'Corporate governance principles for South Africa'
  },
  { 
    id: 4, 
    name: 'POPIA Compliance Guide.pdf', 
    pages: 12, 
    size: '450 KB', 
    type: 'compliance',
    icon: FileCheck,
    description: 'Protection of Personal Information Act compliance'
  }
]

// Document-specific suggested questions
const documentQuestions = {
  1: [ // Employment Contract
    'What are the notice period requirements under SA law?',
    'Explain the restraint of trade clauses',
    'What are the mandatory benefits under BCEA?',
    'How does the probation period work in South Africa?'
  ],
  2: [ // Companies Act
    'What are the requirements for a private company (Pty) Ltd?',
    'Explain the duties of directors under Section 76',
    'What is the process for annual returns with CIPC?',
    'What are the requirements for a valid shareholders agreement?'
  ],
  3: [ // King IV Report
    'What are the 17 principles of King IV?',
    'How does King IV differ from King III?',
    'What are the governance outcomes in King IV?',
    'Explain the "apply and explain" approach'
  ],
  4: [ // POPIA
    'What are the 8 conditions for lawful processing?',
    'What are the penalties for non-compliance?',
    'How long do we have to respond to data subject requests?',
    'What constitutes personal information under POPIA?'
  ]
}

// Pre-generated responses for demo
const preGeneratedResponses = {
  'What are the notice period requirements under SA law?': `Under South African labour law, notice periods are governed by the Basic Conditions of Employment Act (BCEA):

• **First 6 months**: 1 week notice
• **6 months - 1 year**: 2 weeks notice  
• **More than 1 year**: 4 weeks notice

These are minimum requirements. Employment contracts can specify longer notice periods but cannot be less than the BCEA minimums. Notice must be given in writing, except when given by an illiterate employee.`,

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
• Pay prescribed fees (R175 for online registration)
• Receive registration certificate and company number`,

  'What are the 8 conditions for lawful processing?': `Under POPIA, the 8 conditions for lawful processing of personal information are:

1. **Accountability** - Ensure compliance with all conditions
2. **Processing Limitation** - Process only with consent or justification
3. **Purpose Specification** - Collect for specific, lawful purpose
4. **Further Processing Limitation** - Use only for original purpose
5. **Information Quality** - Keep accurate and updated
6. **Openness** - Notify data subjects of collection
7. **Security Safeguards** - Protect against loss or damage
8. **Data Subject Participation** - Allow access and correction

Non-compliance can result in fines up to R10 million or imprisonment.`,

  'What are the 17 principles of King IV?': `King IV contains 17 principles organized under 4 governance outcomes:

**Ethical Culture (Principles 1-5)**
• Ethical leadership
• Organizational ethics
• Corporate citizenship
• Strategy and performance
• Reporting

**Performance & Value (Principles 6-10)**
• Board role and composition
• Board committees
• Performance evaluations
• Appointment of directors
• Risk governance

**Adequate Control (Principles 11-15)**
• Technology governance
• Compliance governance
• Remuneration governance
• Assurance
• Stakeholder relationships

**Trust & Legitimacy (Principles 16-17)**
• Institutional investors
• Integrated reporting`
}

const LegalDocumentChat = () => {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      type: 'bot',
      message: 'Hello! I\'m your AI legal assistant. Select a document to analyze and I can help you understand its contents, find specific clauses, and answer legal questions. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      citations: []
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedDoc, setSelectedDoc] = useState(uploadedDocuments[0])
  const [isTyping, setIsTyping] = useState(false)
  const [showDocuments, setShowDocuments] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update initial message when document changes
  useEffect(() => {
    const docMessage = {
      id: 2,
      type: 'bot',
      message: `I've loaded "${selectedDoc.name}". ${selectedDoc.description}. What would you like to know about this document?`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      citations: []
    }
    setMessages(prev => [prev[0], docMessage])
  }, [selectedDoc])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      citations: []
    }

    setMessages([...messages, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsTyping(true)

    // Check if it's a pre-generated question
    const response = preGeneratedResponses[currentInput as keyof typeof preGeneratedResponses]
    
    setTimeout(() => {
      if (response) {
        // Send pre-generated response
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          message: response,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          citations: [
            { 
              id: 1, 
              title: selectedDoc.type === 'legislation' ? 'Section Reference' : 'Document Reference',
              document: selectedDoc.name, 
              page: Math.floor(Math.random() * 50) + 1 
            }
          ]
        }
        setMessages(prev => [...prev, botResponse])
      } else {
        // Custom message response
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          message: `⚠️ This is a preview demo. In the full version, I would analyze "${selectedDoc.name}" to answer: "${currentInput}"\n\nFor this demo, try one of the suggested questions below to see how the AI legal assistant would respond with real document analysis, citations, and legal insights.`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          isWarning: true,
          citations: []
        }
        setMessages(prev => [...prev, botResponse])
      }
      setIsTyping(false)
    }, 1500)
  }

  const handleQuestionClick = (question: string) => {
    setInputMessage(question)
    // Automatically send the message
    setTimeout(() => {
      const sendButton = document.querySelector('[data-send-button]') as HTMLButtonElement
      if (sendButton) sendButton.click()
    }, 100)
  }

  const handleFileUpload = () => {
    // Simulate file upload
    const newDoc = {
      id: uploadedDocuments.length + 1,
      name: 'New Document.pdf',
      pages: 30,
      size: '1.5 MB',
      type: 'contract' as const,
      icon: FileText,
      description: 'Newly uploaded document'
    }
    uploadedDocuments.push(newDoc)
    setSelectedDoc(newDoc)
  }

  // Get current document's suggested questions
  const currentQuestions = documentQuestions[selectedDoc.id as keyof typeof documentQuestions] || []

  return (
    <div className="bg-white rounded-3xl p-6 min-h-[700px] border border-gray-200">
      <div className="grid grid-cols-12 gap-6 h-[650px]">
        {/* Left Sidebar - Documents */}
        <div className={`${showDocuments ? 'col-span-3' : 'col-span-0'} transition-all`}>
          {showDocuments && (
            <div className="h-full bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Legal Documents</h3>
                <button
                  onClick={handleFileUpload}
                  className="p-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Document List */}
              <div className="space-y-2 overflow-y-auto max-h-[500px]">
                {uploadedDocuments.map((doc) => (
                  <motion.div
                    key={doc.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedDoc?.id === doc.id
                        ? 'bg-indigo-50 border border-indigo-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <doc.icon className="w-4 h-4 text-indigo-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.pages} pages • {doc.size}</p>
                        <p className="text-xs text-gray-600 mt-1">{doc.type}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className={`${showDocuments ? 'col-span-9' : 'col-span-12'} flex flex-col`}>
          {/* Chat Header */}
          <div className="bg-white border border-gray-200 rounded-t-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDocuments(!showDocuments)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h3 className="font-semibold text-gray-900">Legal Document Assistant</h3>
                  {selectedDoc && (
                    <p className="text-sm text-gray-500">Analyzing: {selectedDoc.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <History className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bookmark className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-gray-50 border-x border-gray-200 p-4 overflow-y-auto max-h-[400px]">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-start gap-3">
                      {msg.type === 'bot' && (
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div>
                        <div className={`p-4 rounded-2xl ${
                          msg.type === 'user'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                            : msg.isWarning 
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-white border border-gray-200'
                        }`}>
                          <p className={`text-sm whitespace-pre-line ${
                            msg.type === 'user' ? 'text-white' : 
                            msg.isWarning ? 'text-gray-700' : 'text-gray-800'
                          }`}>
                            {msg.message}
                          </p>
                        </div>
                        
                        {/* Citations */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.citations.map((citation: any) => (
                              <motion.div
                                key={citation.id}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                              >
                                <Book className="w-3 h-3 text-indigo-600" />
                                <span className="text-xs text-indigo-700">{citation.title}</span>
                                {citation.page && (
                                  <span className="text-xs text-indigo-500">p.{citation.page}</span>
                                )}
                                <Eye className="w-3 h-3 text-indigo-500 ml-auto" />
                              </motion.div>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
                      </div>
                      {msg.type === 'user' && (
                        <div className="p-2 bg-gray-200 rounded-lg">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="px-4 py-3 bg-gray-50 border-x border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Suggested questions for {selectedDoc.name}:</p>
            <div className="flex flex-wrap gap-2">
              {currentQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleQuestionClick(question)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-2xl p-4 shadow-sm">
            <div className="flex items-end gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={`Ask about ${selectedDoc.name}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                data-send-button
                className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5 text-white" />
              </motion.button>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                AI-powered analysis
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Secure & confidential
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Smart citations
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LegalDocumentChat