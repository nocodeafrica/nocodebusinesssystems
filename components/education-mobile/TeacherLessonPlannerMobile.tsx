'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, Clock, Users, BookOpen, FileText,
  Plus, ChevronRight, Target, CheckCircle, AlertCircle,
  Download, Share2, Edit3, Trash2, Copy,
  BarChart3, Grid, List, Filter, Search
} from 'lucide-react'

// Lesson plans data
const lessonPlans = [
  {
    id: 1,
    title: 'Introduction to Algebra',
    subject: 'Mathematics',
    grade: 'Grade 10',
    date: 'Mon, Mar 18',
    time: '09:00 - 10:30',
    status: 'upcoming',
    students: 32,
    completion: 100,
    objectives: ['Understand variables', 'Solve basic equations', 'Apply to real problems'],
    resources: ['Textbook Ch. 5', 'Interactive whiteboard', 'Practice worksheets']
  },
  {
    id: 2,
    title: 'Photosynthesis Process',
    subject: 'Biology',
    grade: 'Grade 9',
    date: 'Tue, Mar 19',
    time: '11:00 - 12:30',
    status: 'draft',
    students: 28,
    completion: 65,
    objectives: ['Explain photosynthesis', 'Identify plant parts', 'Lab experiment'],
    resources: ['Lab equipment', 'Microscopes', 'Plant samples']
  },
  {
    id: 3,
    title: 'Creative Writing Workshop',
    subject: 'English',
    grade: 'Grade 11',
    date: 'Wed, Mar 20',
    time: '14:00 - 15:30',
    status: 'upcoming',
    students: 25,
    completion: 100,
    objectives: ['Story structure', 'Character development', 'Peer review'],
    resources: ['Writing prompts', 'Example stories', 'Peer review sheets']
  }
]

// Weekly schedule
const weekSchedule = [
  { day: 'Mon', lessons: 4, hours: 6 },
  { day: 'Tue', lessons: 3, hours: 4.5 },
  { day: 'Wed', lessons: 5, hours: 7.5 },
  { day: 'Thu', lessons: 3, hours: 4.5 },
  { day: 'Fri', lessons: 2, hours: 3 }
]

// CAPS curriculum topics
const curriculumTopics = [
  { id: 1, topic: 'Algebra & Equations', term: 1, completed: true },
  { id: 2, topic: 'Geometry Basics', term: 1, completed: true },
  { id: 3, topic: 'Data Handling', term: 2, completed: false },
  { id: 4, topic: 'Probability', term: 2, completed: false }
]

const TeacherLessonPlannerMobile = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'schedule' | 'curriculum' | 'resources'>('plans')
  const [selectedPlan, setSelectedPlan] = useState<typeof lessonPlans[0] | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-green-100 text-green-600'
      case 'draft': return 'bg-yellow-100 text-yellow-600'
      case 'completed': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getCompletionColor = (completion: number) => {
    if (completion === 100) return 'bg-green-500'
    if (completion >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Lesson Planner</h1>
              <p className="text-sm text-gray-500">CAPS Aligned Curriculum</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-blue-500 text-white rounded-lg"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500"
            >
              <Filter className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {(['plans', 'schedule', 'curriculum', 'resources'] as const).map(tab => (
              <motion.button
                key={tab}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-2 rounded-md text-xs font-medium capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'plans' && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {/* View Mode Toggle */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">{lessonPlans.length} lessons this week</p>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <List className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid className="w-4 h-4 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* Lesson Plans List/Grid */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
                {lessonPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPlan(plan)}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{plan.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{plan.subject} • {plan.grade}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{plan.date}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{plan.time}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>{plan.students} students</span>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Preparation</span>
                          <span className="text-xs font-medium text-gray-700">{plan.completion}%</span>
                        </div>
                        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${plan.completion}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`h-full ${getCompletionColor(plan.completion)}`}
                          />
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 pt-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Share2 className="w-3 h-3" />
                          Share
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Selected Plan Details */}
              <AnimatePresence>
                {selectedPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl p-4 z-20 max-h-[70vh] overflow-y-auto"
                  >
                    <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedPlan.title}</h3>
                        <p className="text-sm text-gray-500">{selectedPlan.subject} • {selectedPlan.grade}</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPlan(null)}
                        className="p-2 text-gray-500"
                      >
                        ✕
                      </motion.button>
                    </div>

                    {/* Learning Objectives */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        Learning Objectives
                      </h4>
                      <div className="space-y-2">
                        {selectedPlan.objectives.map((objective, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span className="text-sm text-gray-700">{objective}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        Resources Needed
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlan.resources.map((resource, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
                      >
                        Start Class
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                      >
                        Duplicate
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                      >
                        Export
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Week Overview */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">This Week</h3>
                <div className="space-y-3">
                  {weekSchedule.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <span className="text-xs font-bold">{day.day}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{day.lessons} lessons</p>
                          <p className="text-xs text-gray-500">{day.hours} hours</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Time Distribution */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Time Distribution</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {['Teaching', 'Preparation', 'Assessment', 'Admin'].map((activity, index) => {
                    const hours = [20, 10, 8, 5][index]
                    const percentage = (hours / 43) * 100
                    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500']
                    
                    return (
                      <div key={activity}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{activity}</span>
                          <span className="text-sm font-medium text-gray-900">{hours}h</span>
                        </div>
                        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: index * 0.1 }}
                            className={colors[index]}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'curriculum' && (
            <motion.div
              key="curriculum"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* CAPS Alignment */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">CAPS Progress</h3>
                  <span className="text-2xl font-bold">65%</span>
                </div>
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-white"
                  />
                </div>
                <p className="text-sm mt-2 opacity-90">Term 2 • Week 8 of 12</p>
              </div>

              {/* Curriculum Topics */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Curriculum Topics</h3>
                <div className="space-y-3">
                  {curriculumTopics.map((topic, index) => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          topic.completed ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {topic.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{topic.topic}</p>
                          <p className="text-xs text-gray-500">Term {topic.term}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        topic.completed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {topic.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Resource Library */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Resource Library</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Worksheets', count: 45, icon: FileText, color: 'bg-blue-100 text-blue-600' },
                    { name: 'Videos', count: 23, icon: FileText, color: 'bg-purple-100 text-purple-600' },
                    { name: 'Presentations', count: 18, icon: FileText, color: 'bg-green-100 text-green-600' },
                    { name: 'Templates', count: 12, icon: FileText, color: 'bg-yellow-100 text-yellow-600' }
                  ].map((resource, index) => {
                    const Icon = resource.icon
                    return (
                      <motion.button
                        key={resource.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-4 bg-gray-50 rounded-xl"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${resource.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                        <p className="text-xs text-gray-500">{resource.count} items</p>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Recent Downloads */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Recent Downloads</h3>
                  <Download className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  {['Algebra Worksheet.pdf', 'Lab Instructions.docx', 'Term 2 Calendar.xlsx'].map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{file}</span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-600"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TeacherLessonPlannerMobile