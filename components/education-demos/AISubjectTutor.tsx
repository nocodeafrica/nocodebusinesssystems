'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, Atom, BookOpen, Globe, Beaker, TrendingUp,
  Send, Lightbulb, Target, Award, Clock, Brain,
  ChevronRight, Play, CheckCircle, AlertCircle, Star,
  MessageSquare, Bot, User, FileText, BarChart3, Upload,
  Image, Paperclip, X, ArrowRight, ArrowLeft
} from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

// Helper component to render text with LaTeX
const MathText = ({ content, className = '', block = false }: { content: string; className?: string; block?: boolean }) => {
  const parts = content.split(/(\$[^$]+\$)/g)
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1)
          return block ? (
            <BlockMath key={index} math={math} />
          ) : (
            <InlineMath key={index} math={math} />
          )
        }
        return <span key={index}>{part}</span>
      })}
    </span>
  )
}

// Subject data
const subjects = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: Calculator,
    color: 'from-blue-600 to-indigo-600',
    topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
    level: 'Grade 11',
    progress: 75,
    currentTopic: 'Quadratic Functions'
  },
  {
    id: 'physics',
    name: 'Physical Sciences',
    icon: Atom,
    color: 'from-purple-600 to-pink-600', 
    topics: ['Mechanics', 'Electricity', 'Waves', 'Thermodynamics'],
    level: 'Grade 11',
    progress: 68,
    currentTopic: 'Newton\'s Laws'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: Beaker,
    color: 'from-green-600 to-teal-600',
    topics: ['Atomic Structure', 'Chemical Bonds', 'Organic Chemistry', 'Reactions'],
    level: 'Grade 11',
    progress: 82,
    currentTopic: 'Chemical Bonding'
  },
  {
    id: 'accounting',
    name: 'Accounting',
    icon: TrendingUp,
    color: 'from-orange-600 to-red-600',
    topics: ['Financial Statements', 'Journal Entries', 'Trial Balance', 'Cash Flow'],
    level: 'Grade 11',
    progress: 71,
    currentTopic: 'Balance Sheet'
  },
  {
    id: 'english',
    name: 'English',
    icon: BookOpen,
    color: 'from-indigo-600 to-blue-600',
    topics: ['Literature', 'Grammar', 'Essay Writing', 'Poetry'],
    level: 'Grade 11', 
    progress: 88,
    currentTopic: 'Shakespeare Analysis'
  }
]

// Subject-specific chat conversations
const subjectConversations: Record<string, any[]> = {
  mathematics: [
    {
      type: 'user',
      content: 'Can you help me solve this quadratic equation: x² + 5x + 6 = 0?',
      time: '2 min ago'
    },
    {
      type: 'ai',
      content: 'Of course! Let me walk you through solving this quadratic equation step by step.',
      time: '2 min ago',
      steps: [
        'First, let\'s identify the coefficients: $a = 1$, $b = 5$, $c = 6$',
        'We can factor this quadratic: $(x + 2)(x + 3) = 0$',
        'Using the zero product property: $x + 2 = 0$ or $x + 3 = 0$',
        'Therefore: $x = -2$ or $x = -3$'
      ],
      equation: 'x^2 + 5x + 6 = (x + 2)(x + 3) = 0'
    },
    {
      type: 'user', 
      content: 'How did you know to factor it that way?',
      time: '1 min ago'
    },
    {
      type: 'ai',
      content: 'Great question! I looked for two numbers that multiply to give $c = 6$ and add to give $b = 5$. Those numbers are $2$ and $3$, since $2 \times 3 = 6$ and $2 + 3 = 5$.',
      time: '1 min ago'
    }
  ],
  physics: [
    {
      type: 'user',
      content: 'What is Newton\'s second law and how do I apply it?',
      time: '5 min ago'
    },
    {
      type: 'ai',
      content: 'Newton\'s second law is one of the fundamental principles of mechanics.',
      time: '5 min ago',
      formula: 'F = ma',
      explanation: 'This means the net force acting on an object equals its mass times its acceleration.'
    },
    {
      type: 'user',
      content: 'Can you show me an example problem?',
      time: '4 min ago'
    },
    {
      type: 'ai',
      content: 'Sure! A 5 kg box is pushed with a force of 20 N. What is its acceleration?',
      time: '4 min ago',
      steps: [
        'Given: $m = 5\\text{ kg}$, $F = 20\\text{ N}$',
        'Using $F = ma$, we solve for $a$',
        '$a = \\frac{F}{m} = \\frac{20\\text{ N}}{5\\text{ kg}} = 4\\text{ m/s}^2$'
      ]
    }
  ],
  chemistry: [
    {
      type: 'user',
      content: 'Can you explain ionic bonding?',
      time: '3 min ago'
    },
    {
      type: 'ai',
      content: 'Ionic bonding occurs when electrons are transferred from metal atoms to non-metal atoms, creating oppositely charged ions that attract each other.',
      time: '3 min ago',
      steps: [
        'Metal atoms lose electrons to become positively charged cations',
        'Non-metal atoms gain electrons to become negatively charged anions',
        'Opposite charges attract, forming ionic bonds',
        'Example: $\\text{Na}^+ + \\text{Cl}^- \\rightarrow \\text{NaCl}$ (sodium chloride)'
      ]
    },
    {
      type: 'user',
      content: 'What about covalent bonds?',
      time: '2 min ago'
    },
    {
      type: 'ai',
      content: 'Covalent bonds form when atoms share electrons. This typically happens between non-metal atoms with similar electronegativity.',
      time: '2 min ago'
    }
  ],
  accounting: [
    {
      type: 'user',
      content: 'Can you explain the accounting equation?',
      time: '4 min ago'
    },
    {
      type: 'ai',
      content: 'The fundamental accounting equation is: Assets = Liabilities + Owner\'s Equity. This equation must always balance.',
      time: '4 min ago',
      formula: 'Assets = Liabilities + Owner\'s Equity',
      explanation: 'This shows that everything a business owns is financed by either debt or owner investment.'
    },
    {
      type: 'user',
      content: 'How do I prepare a balance sheet?',
      time: '3 min ago'
    },
    {
      type: 'ai',
      content: 'A balance sheet lists assets, liabilities, and equity at a specific point in time.',
      time: '3 min ago',
      steps: [
        'List all assets (current assets first, then fixed assets)',
        'List all liabilities (current liabilities first, then long-term)',
        'Calculate owner\'s equity (capital + retained earnings)',
        'Verify: Total Assets = Total Liabilities + Owner\'s Equity'
      ]
    }
  ],
  english: [
    {
      type: 'user',
      content: 'How do I analyze a poem effectively?',
      time: '5 min ago'
    },
    {
      type: 'ai',
      content: 'Poetry analysis involves examining literary devices, themes, and the poet\'s techniques to understand deeper meanings.',
      time: '5 min ago',
      steps: [
        'Read the poem multiple times for understanding',
        'Identify literary devices (metaphor, alliteration, rhyme scheme)',
        'Analyze the theme and mood',
        'Consider the historical and cultural context',
        'Examine how structure supports meaning'
      ]
    },
    {
      type: 'user',
      content: 'What about essay writing structure?',
      time: '4 min ago'
    },
    {
      type: 'ai',
      content: 'A good essay follows a clear structure: Introduction with thesis, body paragraphs with evidence, and conclusion that reinforces your argument.',
      time: '4 min ago'
    }
  ]
}

// Subject-specific assessment questions
const assessmentQuestions: Record<string, any[]> = {
  mathematics: [
    {
      question: 'Solve: $2x^2 - 8x + 6 = 0$',
      options: ['$x = 1, x = 3$', '$x = 2, x = 4$', '$x = 1, x = 6$', '$x = 3, x = 2$'],
      correct: 0,
      explanation: 'Factor out 2: $2(x^2 - 4x + 3) = 0$, then factor: $2(x-1)(x-3) = 0$'
    },
    {
      question: 'What is the vertex of $y = x^2 - 4x + 3$?',
      options: ['$(2, -1)$', '$(1, 0)$', '$(3, 0)$', '$(2, 1)$'],
      correct: 0,
      explanation: 'Complete the square: $y = (x-2)^2 - 1$, so vertex is at $(2, -1)$'
    },
    {
      question: 'Simplify: $\\frac{x^2 - 9}{x - 3}$',
      options: ['$x + 3$', '$x - 3$', '$x^2 + 3$', '$\\frac{x + 3}{3}$'],
      correct: 0,
      explanation: 'Factor numerator: $\\frac{(x-3)(x+3)}{x-3} = x + 3$ for $x \\neq 3$'
    },
    {
      question: 'Find the discriminant of $3x^2 - 7x + 2 = 0$',
      options: ['$25$', '$49$', '$-24$', '$73$'],
      correct: 0,
      explanation: 'Using $\\Delta = b^2 - 4ac = (-7)^2 - 4(3)(2) = 49 - 24 = 25$'
    }
  ],
  physics: [
    {
      question: 'A car accelerates from 0 to 30 m/s in 10 seconds. What is its acceleration?',
      options: ['$3 \\text{ m/s}^2$', '$300 \\text{ m/s}^2$', '$0.33 \\text{ m/s}^2$', '$30 \\text{ m/s}^2$'],
      correct: 0,
      explanation: 'Using $a = \\frac{v_f - v_i}{t} = \\frac{30 - 0}{10} = 3 \\text{ m/s}^2$'
    },
    {
      question: 'What is the momentum of a 5 kg object moving at 10 m/s?',
      options: ['$50 \\text{ kg} \\cdot \\text{m/s}$', '$2 \\text{ kg} \\cdot \\text{m/s}$', '$15 \\text{ kg} \\cdot \\text{m/s}$', '$0.5 \\text{ kg} \\cdot \\text{m/s}$'],
      correct: 0,
      explanation: 'Momentum $p = mv = 5 \\text{ kg} \\times 10 \\text{ m/s} = 50 \\text{ kg} \\cdot \\text{m/s}$'
    },
    {
      question: 'Calculate the kinetic energy of a 2 kg object moving at 5 m/s',
      options: ['$25 \\text{ J}$', '$10 \\text{ J}$', '$50 \\text{ J}$', '$5 \\text{ J}$'],
      correct: 0,
      explanation: 'Using $KE = \\frac{1}{2}mv^2 = \\frac{1}{2}(2)(5^2) = \\frac{1}{2}(2)(25) = 25 \\text{ J}$'
    }
  ],
  chemistry: [
    {
      question: 'What is the electron configuration of Carbon (atomic number 6)?',
      options: ['$1s^2 2s^2 2p^2$', '$1s^2 2s^4$', '$1s^2 2p^4$', '$2s^2 2p^4$'],
      correct: 0,
      explanation: 'Carbon has 6 electrons: 2 in $1s$, 2 in $2s$, and 2 in $2p$ orbitals'
    },
    {
      question: 'What type of bond forms between Na and Cl?',
      options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
      correct: 0,
      explanation: 'Na (metal) transfers an electron to Cl (non-metal), forming an ionic bond: $\\text{Na}^+ + \\text{Cl}^- \\rightarrow \\text{NaCl}$'
    },
    {
      question: 'Balance this chemical equation: $\\text{C}_3\\text{H}_8 + \\text{O}_2 \\rightarrow \\text{CO}_2 + \\text{H}_2\\text{O}$',
      options: [
        '$\\text{C}_3\\text{H}_8 + 5\\text{O}_2 \\rightarrow 3\\text{CO}_2 + 4\\text{H}_2\\text{O}$',
        '$\\text{C}_3\\text{H}_8 + 3\\text{O}_2 \\rightarrow 3\\text{CO}_2 + 4\\text{H}_2\\text{O}$',
        '$\\text{C}_3\\text{H}_8 + 7\\text{O}_2 \\rightarrow 3\\text{CO}_2 + 4\\text{H}_2\\text{O}$',
        '$\\text{C}_3\\text{H}_8 + 4\\text{O}_2 \\rightarrow 3\\text{CO}_2 + 4\\text{H}_2\\text{O}$'
      ],
      correct: 0,
      explanation: 'Products need: 3 C atoms = $3\\text{CO}_2$, 8 H atoms = $4\\text{H}_2\\text{O}$. Total O needed: $3(2) + 4(1) = 10$ atoms = $5\\text{O}_2$'
    }
  ],
  accounting: [
    {
      question: 'Sibongile\'s business has the following transactions in January: Cash R15,000, Bank loan R8,000, Equipment R12,000. Calculate the Owner\'s Equity.',
      options: ['R19,000', 'R7,000', 'R35,000', 'R23,000'],
      correct: 0,
      explanation: 'Using A = L + OE: R27,000 (Cash + Equipment) = R8,000 (Loan) + OE, therefore OE = R19,000',
      type: 'calculation'
    },
    {
      question: 'Complete this trial balance: If total debits are R45,500 and Credits show: Capital R25,000, Bank Loan R12,000, what should Creditors be?',
      options: ['R8,500', 'R20,500', 'R37,000', 'R82,500'],
      correct: 0,
      explanation: 'Total Credits must equal Total Debits: R25,000 + R12,000 + Creditors = R45,500, so Creditors = R8,500',
      type: 'completion'
    },
    {
      question: 'Journal Entry Problem: Thabo bought inventory for R3,200 on credit from Ace Suppliers. What is the correct journal entry?',
      options: [
        'Dr. Purchases R3,200; Cr. Ace Suppliers R3,200',
        'Dr. Ace Suppliers R3,200; Cr. Purchases R3,200', 
        'Dr. Inventory R3,200; Cr. Cash R3,200',
        'Dr. Cash R3,200; Cr. Purchases R3,200'
      ],
      correct: 0,
      explanation: 'Purchases (expense) increases with debit, Ace Suppliers (creditor/liability) increases with credit',
      type: 'journal'
    },
    {
      question: 'If a business shows a net loss of R4,500 this year, how does this affect the Balance Sheet?',
      options: [
        'Decreases Owner\'s Equity by R4,500',
        'Increases Owner\'s Equity by R4,500',
        'Decreases Assets by R4,500',
        'Has no effect on Balance Sheet'
      ],
      correct: 0,
      explanation: 'Net loss reduces Owner\'s Equity because expenses exceeded income, reducing the owner\'s claim on business assets',
      type: 'conceptual'
    }
  ],
  english: [
    {
      question: 'Read this line from a poem: "The wind whispered secrets through the trees." Identify and explain the literary device used.',
      type: 'analysis',
      answer: 'Personification - the wind is given human qualities (whispering), making nature seem alive and mysterious',
      options: ['Personification', 'Metaphor', 'Alliteration', 'Simile'],
      correct: 0,
      explanation: 'Personification gives human characteristics to non-human things. Here, wind "whispers" like a person would.'
    },
    {
      question: 'Essay Writing: Which thesis statement is STRONGEST for an essay about social media\'s impact on teenagers?',
      type: 'evaluation',
      options: [
        'Social media platforms like Instagram and TikTok negatively impact teenagers by promoting unrealistic beauty standards, decreasing face-to-face social skills, and contributing to anxiety disorders.',
        'Social media is bad for teenagers.',
        'This essay will discuss social media and teenagers.',
        'Many teenagers use social media every day.'
      ],
      correct: 0,
      explanation: 'Option A is specific, arguable, and provides clear points that can be developed in body paragraphs. It takes a clear stance with supporting reasons.'
    },
    {
      question: 'Creative Writing: Complete this story opening with exactly 50 words: "The old library held more than books..."',
      type: 'creative',
      isOpenEnded: true,
      sampleAnswer: 'The old library held more than books. Between dusty shelves, Sarah discovered handwritten letters from 1943, revealing a wartime love story. As she read, the letters glowed softly. Suddenly, she heard footsteps from the past, and a young soldier appeared, searching desperately for his beloved.',
      explanation: 'Look for: creative plot development, atmospheric description, engaging hook, exact word count, proper grammar and punctuation.'
    },
    {
      question: 'Poetry Analysis: In this stanza, identify the rhyme scheme and explain how it contributes to the mood:\n\n"The raven black against the sky (A)\nDoth spread his wings so wide (B)\nWhile shadows fall and daylight dies (A)\nAnd darkness doth abide" (B)',
      type: 'analysis',
      options: ['ABAB - creates steady, ominous rhythm', 'AABB - creates playful, light tone', 'ABBA - creates circular, contemplative feel', 'Free verse - creates chaotic energy'],
      correct: 0,
      explanation: 'ABAB rhyme scheme (sky/dies, wide/abide) creates a steady, predictable rhythm that mirrors the inevitable approach of darkness, reinforcing the ominous mood.'
    }
  ]
}

// Subject-specific practice exercises
const practiceExercises: Record<string, any[]> = {
  mathematics: [
    { title: 'Quadratic Equations', problems: 12, completed: 8, difficulty: 'Medium' },
    { title: 'Linear Functions', problems: 10, completed: 10, difficulty: 'Easy' },
    { title: 'Trigonometry', problems: 15, completed: 3, difficulty: 'Hard' }
  ],
  physics: [
    { title: 'Forces & Motion', problems: 10, completed: 6, difficulty: 'Hard' },
    { title: 'Energy & Work', problems: 8, completed: 8, difficulty: 'Medium' },
    { title: 'Momentum', problems: 12, completed: 4, difficulty: 'Medium' }
  ],
  chemistry: [
    { title: 'Molecular Structure', problems: 15, completed: 12, difficulty: 'Easy' },
    { title: 'Chemical Reactions', problems: 10, completed: 7, difficulty: 'Medium' },
    { title: 'Organic Chemistry', problems: 8, completed: 2, difficulty: 'Hard' }
  ],
  accounting: [
    { title: 'Financial Ratios', problems: 8, completed: 5, difficulty: 'Medium' },
    { title: 'Journal Entries', problems: 12, completed: 9, difficulty: 'Easy' },
    { title: 'Balance Sheet', problems: 6, completed: 3, difficulty: 'Hard' }
  ],
  english: [
    { title: 'Poetry Analysis', problems: 10, completed: 7, difficulty: 'Medium' },
    { title: 'Essay Writing', problems: 8, completed: 6, difficulty: 'Hard' },
    { title: 'Grammar & Syntax', problems: 15, completed: 12, difficulty: 'Easy' }
  ]
}

const AISubjectTutor = () => {
  const [selectedSubject, setSelectedSubject] = useState(0)
  const [selectedTab, setSelectedTab] = useState('chat')
  const [chatInput, setChatInput] = useState('')
  const [showEquation, setShowEquation] = useState(true)
  const [userScore, setUserScore] = useState(0)
  const [showUpload, setShowUpload] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [practiceMode, setPracticeMode] = useState(false)
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0)
  const [openEndedAnswer, setOpenEndedAnswer] = useState('')

  const currentSubject = subjects[selectedSubject]
  const currentSubjectId = currentSubject.id
  const currentConversation = subjectConversations[currentSubjectId] || []

  useEffect(() => {
    // Animate user score
    const timer = setTimeout(() => {
      setUserScore(847)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const SubjectIcon = currentSubject.icon

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100' 
      case 'Hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">AI Subject Tutor</h2>
          <p className="text-sm text-gray-600 mt-1">Personalized learning with intelligent assistance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-gray-900">{userScore.toLocaleString()} XP</span>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
            View Progress Report
          </button>
        </div>
      </div>

      {/* Subject Selector */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {subjects.map((subject, index) => {
          const IconComponent = subject.icon
          return (
            <motion.div
              key={subject.id}
              onClick={() => setSelectedSubject(index)}
              className={`relative p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                selectedSubject === index 
                  ? 'border-emerald-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${subject.color} flex items-center justify-center text-white mb-3`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{subject.name}</h3>
              <p className="text-xs text-gray-600 mb-2">{subject.level}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{subject.progress}%</span>
                <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${subject.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>

              {selectedSubject === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Current Topic Banner */}
      <div className={`bg-gradient-to-r ${currentSubject.color} rounded-2xl p-6 mb-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SubjectIcon className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">{currentSubject.name}</h3>
              <p className="opacity-90">Currently studying: {currentSubject.currentTopic}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{currentSubject.progress}%</p>
            <p className="opacity-90">Complete</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'chat', label: 'AI Chat', icon: MessageSquare },
          { id: 'practice', label: 'Practice', icon: Target },
          { id: 'assessment', label: 'Assessment', icon: Award }
        ].map(tab => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {selectedTab === 'chat' && (
          <>
            <div className="col-span-8">
              <div className="bg-white rounded-2xl border border-emerald-200 h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className={`bg-gradient-to-r ${currentSubject.color} p-4 rounded-t-2xl text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{currentSubject.name} AI Tutor</p>
                      <p className="text-sm opacity-90">Ready to help with {currentSubject.currentTopic}</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {currentConversation.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                        {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        
                        {message.equation && (
                          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                            <div className="text-center text-lg">
                              <BlockMath math={message.equation} />
                            </div>
                          </div>
                        )}

                        {message.formula && (
                          <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                            <div className="text-center text-xl">
                              <BlockMath math={message.formula} />
                            </div>
                            {message.explanation && (
                              <p className="text-xs mt-2 text-center opacity-90">{message.explanation}</p>
                            )}
                          </div>
                        )}
                        
                        {message.steps && (
                          <div className="mt-3 space-y-2">
                            {message.steps.map((step: string, stepIndex: number) => (
                              <div key={stepIndex} className="flex items-start gap-2">
                                <div className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                  {stepIndex + 1}
                                </div>
                                <div className="text-sm flex-1">
                                  <MathText content={step} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs opacity-70 mt-2">{message.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200">
                  {showUpload && (
                    <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-xl text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload images, documents, or worksheets</p>
                      <div className="flex items-center justify-center gap-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 flex items-center gap-1">
                          <Image className="w-4 h-4" />
                          Image
                        </button>
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          Document
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowUpload(!showUpload)}
                      className={`p-2 rounded-xl transition-colors ${
                        showUpload ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={`Ask about ${currentSubject.name.toLowerCase()}...`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-4 space-y-6">
              {/* Quick Topics */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Topics</h3>
                <div className="space-y-2">
                  {currentSubject.topics.map((topic, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <span className="text-sm text-gray-900">{topic}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Tips */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Practice Daily</p>
                      <p className="text-xs text-gray-600">Spend 30 minutes daily on problem solving</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Understand Concepts</p>
                      <p className="text-xs text-gray-600">Focus on understanding, not just memorizing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'practice' && (
          <div className="col-span-12">
            {!practiceMode ? (
              <div className="bg-white rounded-2xl p-6 border border-emerald-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Practice Exercises</h3>
                <div className="grid grid-cols-3 gap-6">
                  {(practiceExercises[currentSubjectId] || []).map((exercise, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{exercise.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">
                          {exercise.completed} / {exercise.problems} completed
                        </span>
                        <span className="text-sm font-medium text-emerald-600">
                          {Math.round((exercise.completed / exercise.problems) * 100)}%
                        </span>
                      </div>
                      
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-1000"
                          style={{ width: `${(exercise.completed / exercise.problems) * 100}%` }}
                        />
                      </div>
                      
                      <button 
                        onClick={() => {
                          setPracticeMode(true)
                          setCurrentPracticeIndex(index)
                          setCurrentQuestionIndex(0)
                          setSelectedAnswer(null)
                          setShowResult(false)
                        }}
                        className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Start Practice
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-emerald-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {practiceExercises[currentSubjectId][currentPracticeIndex].title}
                  </h3>
                  <button 
                    onClick={() => setPracticeMode(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {assessmentQuestions[currentSubjectId] && assessmentQuestions[currentSubjectId][currentQuestionIndex] && (
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">
                          Question {currentQuestionIndex + 1} of {assessmentQuestions[currentSubjectId].length}
                        </span>
                        <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${((currentQuestionIndex + 1) / assessmentQuestions[currentSubjectId].length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <div className="mb-6">
                        <MathText 
                          content={assessmentQuestions[currentSubjectId][currentQuestionIndex].question} 
                          className="text-xl font-medium text-gray-900"
                          block
                        />
                        {assessmentQuestions[currentSubjectId][currentQuestionIndex].type && (
                          <div className="mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assessmentQuestions[currentSubjectId][currentQuestionIndex].type === 'creative' ? 'bg-purple-100 text-purple-700' :
                              assessmentQuestions[currentSubjectId][currentQuestionIndex].type === 'analysis' ? 'bg-blue-100 text-blue-700' :
                              assessmentQuestions[currentSubjectId][currentQuestionIndex].type === 'calculation' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {assessmentQuestions[currentSubjectId][currentQuestionIndex].type.charAt(0).toUpperCase() + assessmentQuestions[currentSubjectId][currentQuestionIndex].type.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Special handling for open-ended questions */}
                      {assessmentQuestions[currentSubjectId][currentQuestionIndex].isOpenEnded ? (
                        <div className="mb-6">
                          <textarea
                            value={openEndedAnswer}
                            onChange={(e) => setOpenEndedAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                          />
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-500">
                              {openEndedAnswer.split(' ').filter(w => w.length > 0).length} words
                            </span>
                            {assessmentQuestions[currentSubjectId][currentQuestionIndex].type === 'creative' && (
                              <span className="text-xs text-gray-500">
                                Target: 50 words exactly
                              </span>
                            )}
                          </div>
                          {showResult && assessmentQuestions[currentSubjectId][currentQuestionIndex].sampleAnswer && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h5 className="font-medium text-blue-900 mb-2">Sample Answer:</h5>
                              <p className="text-sm text-blue-800">{assessmentQuestions[currentSubjectId][currentQuestionIndex].sampleAnswer}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 mb-6">
                        {assessmentQuestions[currentSubjectId][currentQuestionIndex].options.map((option: string, optionIndex: number) => {
                          const isSelected = selectedAnswer === optionIndex
                          const isCorrect = optionIndex === assessmentQuestions[currentSubjectId][currentQuestionIndex].correct
                          const showCorrect = showResult && isCorrect
                          const showIncorrect = showResult && isSelected && !isCorrect
                          
                          return (
                            <button
                              key={optionIndex}
                              onClick={() => !showResult && setSelectedAnswer(optionIndex)}
                              disabled={showResult}
                              className={`p-4 border-2 rounded-xl text-left transition-all ${
                                showCorrect ? 'border-green-500 bg-green-50' :
                                showIncorrect ? 'border-red-500 bg-red-50' :
                                isSelected ? 'border-emerald-500 bg-emerald-50' :
                                'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  showCorrect ? 'border-green-500 bg-green-500' :
                                  showIncorrect ? 'border-red-500 bg-red-500' :
                                  isSelected ? 'border-emerald-500 bg-emerald-500' :
                                  'border-gray-300'
                                }`}>
                                  {(showCorrect || (isSelected && !showResult)) && (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  )}
                                  {showIncorrect && (
                                    <X className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                                <MathText content={option} />
                              </div>
                            </button>
                          )
                        })}
                        </div>
                      )}

                      {showResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-blue-50 rounded-lg mb-6"
                        >
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-900">Explanation:</p>
                              <p className="text-sm text-blue-700">
                                {assessmentQuestions[currentSubjectId][currentQuestionIndex].explanation}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            if (currentQuestionIndex > 0) {
                              setCurrentQuestionIndex(prev => prev - 1)
                              setSelectedAnswer(null)
                              setOpenEndedAnswer('')
                              setShowResult(false)
                            }
                          }}
                          disabled={currentQuestionIndex === 0}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Previous
                        </button>

                        {!showResult ? (
                          <button
                            onClick={() => setShowResult(true)}
                            disabled={
                              assessmentQuestions[currentSubjectId][currentQuestionIndex].isOpenEnded 
                                ? openEndedAnswer.trim().length === 0 
                                : selectedAnswer === null
                            }
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Check Answer
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (currentQuestionIndex < assessmentQuestions[currentSubjectId].length - 1) {
                                setCurrentQuestionIndex(prev => prev + 1)
                                setSelectedAnswer(null)
                                setOpenEndedAnswer('')
                                setShowResult(false)
                              } else {
                                setPracticeMode(false)
                                setCurrentQuestionIndex(0)
                                setSelectedAnswer(null)
                                setOpenEndedAnswer('')
                              }
                            }}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                          >
                            {currentQuestionIndex < assessmentQuestions[currentSubjectId].length - 1 ? (
                              <>
                                Next
                                <ArrowRight className="w-4 h-4" />
                              </>
                            ) : (
                              'Finish Practice'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedTab === 'assessment' && (
          <div className="col-span-12">
            <div className="bg-white rounded-2xl p-6 border border-emerald-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Quick Assessment</h3>
                <div className="text-sm text-gray-600">
                  {assessmentQuestions[currentSubjectId] ? assessmentQuestions[currentSubjectId].length : 0} questions available
                </div>
              </div>
              
              {assessmentQuestions[currentSubjectId] && assessmentQuestions[currentSubjectId].length > 0 ? (
                <div className="max-w-3xl mx-auto">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">
                        Question {currentQuestionIndex + 1} of {assessmentQuestions[currentSubjectId].length}
                      </span>
                      <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${((currentQuestionIndex + 1) / assessmentQuestions[currentSubjectId].length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="mb-6">
                      <MathText 
                        content={assessmentQuestions[currentSubjectId][currentQuestionIndex].question} 
                        className="text-xl font-medium text-gray-900"
                        block
                      />
                      {assessmentQuestions[currentSubjectId][currentQuestionIndex].type && (
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            assessmentQuestions[currentSubjectId][currentQuestionIndex].type === 'creative' ? 'bg-purple-100 text-purple-700' :
                            assessmentQuestions[currentSubjectId][currentQuestionIndex].type === 'analysis' ? 'bg-blue-100 text-blue-700' :
                            assessmentQuestions[currentSubjectId][currentQuestionIndex].type === 'calculation' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {assessmentQuestions[currentSubjectId][currentQuestionIndex].type.charAt(0).toUpperCase() + assessmentQuestions[currentSubjectId][currentQuestionIndex].type.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Special handling for open-ended questions */}
                    {assessmentQuestions[currentSubjectId][currentQuestionIndex].isOpenEnded ? (
                      <div className="mb-6">
                        <textarea
                          value={openEndedAnswer}
                          onChange={(e) => setOpenEndedAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-500">
                            {openEndedAnswer.split(' ').filter(w => w.length > 0).length} words
                          </span>
                          {assessmentQuestions[currentSubjectId][currentQuestionIndex].type === 'creative' && (
                            <span className="text-xs text-gray-500">
                              Target: 50 words exactly
                            </span>
                          )}
                        </div>
                        {showResult && assessmentQuestions[currentSubjectId][currentQuestionIndex].sampleAnswer && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h5 className="font-medium text-blue-900 mb-2">Sample Answer:</h5>
                            <p className="text-sm text-blue-800">{assessmentQuestions[currentSubjectId][currentQuestionIndex].sampleAnswer}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 mb-6">
                      {assessmentQuestions[currentSubjectId][currentQuestionIndex].options.map((option: string, optionIndex: number) => {
                        const isSelected = selectedAnswer === optionIndex
                        const isCorrect = optionIndex === assessmentQuestions[currentSubjectId][currentQuestionIndex].correct
                        const showCorrect = showResult && isCorrect
                        const showIncorrect = showResult && isSelected && !isCorrect
                        
                        return (
                          <button
                            key={optionIndex}
                            onClick={() => !showResult && setSelectedAnswer(optionIndex)}
                            disabled={showResult}
                            className={`p-4 border-2 rounded-lg text-left transition-all ${
                              showCorrect ? 'border-green-500 bg-green-50' :
                              showIncorrect ? 'border-red-500 bg-red-50' :
                              isSelected ? 'border-emerald-500 bg-emerald-50' :
                              'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                showCorrect ? 'border-green-500 bg-green-500' :
                                showIncorrect ? 'border-red-500 bg-red-500' :
                                isSelected ? 'border-emerald-500 bg-emerald-500' :
                                'border-gray-300'
                              }`}>
                                {(showCorrect || (isSelected && !showResult)) && (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                )}
                                {showIncorrect && (
                                  <X className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                              <MathText content={option} />
                            </div>
                          </button>
                        )
                      })}
                      </div>
                    )}

                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-blue-50 rounded-lg mb-4"
                      >
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">Explanation:</p>
                            <div className="text-sm text-blue-700">
                              <MathText content={assessmentQuestions[currentSubjectId][currentQuestionIndex].explanation} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          if (currentQuestionIndex > 0) {
                            setCurrentQuestionIndex(prev => prev - 1)
                            setSelectedAnswer(null)
                            setOpenEndedAnswer('')
                            setShowResult(false)
                          }
                        }}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </button>

                      {!showResult ? (
                        <button
                          onClick={() => setShowResult(true)}
                          disabled={
                            assessmentQuestions[currentSubjectId][currentQuestionIndex].isOpenEnded 
                              ? openEndedAnswer.trim().length === 0 
                              : selectedAnswer === null
                          }
                          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Check Answer
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (currentQuestionIndex < assessmentQuestions[currentSubjectId].length - 1) {
                              setCurrentQuestionIndex(prev => prev + 1)
                              setSelectedAnswer(null)
                              setOpenEndedAnswer('')
                              setShowResult(false)
                            } else {
                              // Reset to first question
                              setCurrentQuestionIndex(0)
                              setSelectedAnswer(null)
                              setOpenEndedAnswer('')
                              setShowResult(false)
                            }
                          }}
                          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                        >
                          {currentQuestionIndex < assessmentQuestions[currentSubjectId].length - 1 ? (
                            <>
                              Next Question
                              <ArrowRight className="w-4 h-4" />
                            </>
                          ) : (
                            'Restart Assessment'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No assessment questions available for {currentSubject.name}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AISubjectTutor