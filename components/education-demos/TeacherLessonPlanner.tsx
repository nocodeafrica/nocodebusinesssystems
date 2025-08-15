'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, Calendar, Users, Target, Clock, FileText,
  CheckCircle, AlertCircle, Star, Download, Share2,
  PlusCircle, Edit3, Trash2, Copy, Eye, BarChart3,
  Calculator, Atom, Globe, Beaker, BookA, TrendingUp,
  PlayCircle, Lightbulb, Award, MessageSquare, X
} from 'lucide-react'

// Subject data with CAPS curriculum alignment
const subjects = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: Calculator,
    color: 'from-blue-600 to-indigo-600',
    grade: 'Grade 11',
    term: 'Term 3',
    units: ['Functions', 'Trigonometry', 'Euclidean Geometry', 'Statistics'],
    upcomingDeadline: '2024-08-20'
  },
  {
    id: 'physics',
    name: 'Physical Sciences',
    icon: Atom,
    color: 'from-purple-600 to-pink-600',
    grade: 'Grade 11', 
    term: 'Term 3',
    units: ['Mechanics', 'Waves & Sound', 'Electricity', 'Matter & Materials'],
    upcomingDeadline: '2024-08-18'
  },
  {
    id: 'english',
    name: 'English Home Language',
    icon: BookA,
    color: 'from-green-600 to-teal-600',
    grade: 'Grade 11',
    term: 'Term 3', 
    units: ['Poetry', 'Novel Study', 'Language Structures', 'Writing Skills'],
    upcomingDeadline: '2024-08-25'
  }
]

// Current lesson plans
const lessonPlans = [
  {
    id: 1,
    subject: 'mathematics',
    title: 'Introduction to Quadratic Functions',
    duration: 60,
    date: '2024-08-12',
    status: 'completed',
    objectives: [
      'Define quadratic functions and their standard form',
      'Graph basic quadratic functions',
      'Identify key features: vertex, axis of symmetry, roots'
    ],
    activities: [
      'Warm-up: Review linear functions (10 min)',
      'Interactive demo: Parabola patterns (20 min)', 
      'Guided practice: Graphing exercises (20 min)',
      'Exit ticket assessment (10 min)'
    ],
    resources: ['Graphing calculator', 'Worksheet A', 'Interactive whiteboard'],
    assessment: 'Formative - Exit ticket and class participation',
    capsAlignment: 'Functions 4.1: Investigate and extend numeric and geometric patterns'
  },
  {
    id: 2,
    subject: 'physics',
    title: 'Newton\'s Laws of Motion',
    duration: 60,
    date: '2024-08-13',
    status: 'in_progress',
    objectives: [
      'State and explain Newton\'s three laws of motion',
      'Apply laws to real-world scenarios',
      'Calculate force, mass, and acceleration relationships'
    ],
    activities: [
      'Review: Forces and motion concepts (15 min)',
      'Demonstration: Cart and weights experiment (20 min)',
      'Problem solving workshop (20 min)',
      'Reflection and summary (5 min)'
    ],
    resources: ['Dynamics cart', 'Weights set', 'Timer', 'Worksheet B'],
    assessment: 'Practical assessment - Lab report due Friday',
    capsAlignment: 'Mechanics 1.2: Apply Newton\'s laws to describe motion'
  },
  {
    id: 3,
    subject: 'english',
    title: 'Poetry Analysis: Metaphor and Symbolism',
    duration: 45,
    date: '2024-08-14',
    status: 'planned',
    objectives: [
      'Identify metaphors and symbols in poetry',
      'Analyze how literary devices create meaning',
      'Write analytical paragraphs using evidence'
    ],
    activities: [
      'Read poem aloud with expression (10 min)',
      'Small group analysis activity (15 min)',
      'Class discussion and sharing (15 min)',
      'Independent writing task (5 min)'
    ],
    resources: ['Poetry anthology', 'Analysis worksheet', 'Highlighters'],
    assessment: 'Peer assessment of group presentations',
    capsAlignment: 'Reading 3.1: Respond to aesthetic, affective, cultural and social values'
  }
]

// Student progress data
const studentProgress = [
  { name: 'Thabo M.', subject: 'mathematics', completion: 85, grade: 'A-', concerns: false },
  { name: 'Sarah V.', subject: 'mathematics', completion: 92, grade: 'A+', concerns: false },
  { name: 'Kwame A.', subject: 'mathematics', completion: 67, grade: 'C+', concerns: true },
  { name: 'Amara O.', subject: 'mathematics', completion: 88, grade: 'A-', concerns: false },
  { name: 'Daniel B.', subject: 'mathematics', completion: 45, grade: 'D', concerns: true },
]

// Resource library
const resourceLibrary = [
  { type: 'Worksheet', title: 'Quadratic Equations Practice', subject: 'mathematics', downloads: 24 },
  { type: 'Presentation', title: 'Forces in Action', subject: 'physics', downloads: 18 },
  { type: 'Video', title: 'Poetry Techniques Explained', subject: 'english', downloads: 31 },
  { type: 'Assessment', title: 'Functions Unit Test', subject: 'mathematics', downloads: 15 },
  { type: 'Lab Guide', title: 'Pendulum Experiment', subject: 'physics', downloads: 12 },
]

// Collaboration data
const collaborationData = [
  { teacher: 'Ms. Patel', subject: 'Physics', shared: 5, received: 3 },
  { teacher: 'Mr. Johnson', subject: 'Chemistry', shared: 2, received: 7 },
  { teacher: 'Mrs. Smith', subject: 'Mathematics', shared: 8, received: 4 },
]

const TeacherLessonPlanner = () => {
  const [selectedSubject, setSelectedSubject] = useState(0)
  const [selectedTab, setSelectedTab] = useState('planner')
  const [totalPlans, setTotalPlans] = useState(0)
  const [weeklyHours, setWeeklyHours] = useState(0)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    duration: 60,
    date: '',
    objectives: [''],
    activities: [''],
    resources: [''],
    assessment: '',
    capsAlignment: ''
  })

  const currentSubject = subjects[selectedSubject]
  const subjectLessons = lessonPlans.filter(plan => plan.subject === currentSubject.id)

  useEffect(() => {
    // Animate metrics
    setTotalPlans(lessonPlans.length)
    setWeeklyHours(18)
  }, [])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200' 
      case 'planned': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />
      case 'planned': return <Calendar className="w-4 h-4 text-yellow-600" />
      default: return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const SubjectIcon = currentSubject.icon

  return (
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Teacher Lesson Planner</h2>
          <p className="text-sm text-gray-600 mt-1">CAPS-aligned curriculum planning and resource management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200">
            <Calendar className="w-4 h-4 text-rose-600" />
            <span className="font-medium text-gray-900">Week 5, Term 3</span>
          </div>
          <button 
            onClick={() => {
              setShowCreateForm(true)
              setEditingLesson(null)
              setFormData({
                title: '',
                duration: 60,
                date: '',
                objectives: [''],
                activities: [''],
                resources: [''],
                assessment: '',
                capsAlignment: ''
              })
            }}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            New Lesson Plan
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 border border-rose-200"
        >
          <FileText className="w-5 h-5 text-rose-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalPlans}</p>
          <p className="text-xs text-gray-500">Total Plans</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-rose-200"
        >
          <Clock className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{weeklyHours}</p>
          <p className="text-xs text-gray-500">Weekly Hours</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-rose-200"
        >
          <Users className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">85%</p>
          <p className="text-xs text-gray-500">Class Average</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-rose-200"
        >
          <Target className="w-5 h-5 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">92%</p>
          <p className="text-xs text-gray-500">Objectives Met</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 border border-rose-200"
        >
          <Download className="w-5 h-5 text-orange-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">156</p>
          <p className="text-xs text-gray-500">Resources Used</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-4 border border-rose-200"
        >
          <Share2 className="w-5 h-5 text-indigo-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">23</p>
          <p className="text-xs text-gray-500">Shared Plans</p>
        </motion.div>
      </div>

      {/* Subject Selector */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {subjects.map((subject, index) => {
          const IconComponent = subject.icon
          return (
            <motion.div
              key={subject.id}
              onClick={() => setSelectedSubject(index)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                selectedSubject === index 
                  ? 'border-rose-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${subject.color} flex items-center justify-center text-white`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.grade} • {subject.term}</p>
                  <p className="text-xs text-gray-500">Next deadline: {subject.upcomingDeadline}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'planner', label: 'Lesson Plans', icon: FileText },
          { id: 'resources', label: 'Resources', icon: BookOpen },
          { id: 'students', label: 'Student Progress', icon: Users },
          { id: 'collaborate', label: 'Collaborate', icon: Share2 }
        ].map(tab => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedTab === tab.id
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Lesson Plan Creation/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingLesson ? 'Edit Lesson Plan' : 'Create New Lesson Plan'}
                </h3>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter lesson title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* CAPS Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CAPS Alignment</label>
                <input
                  type="text"
                  value={formData.capsAlignment}
                  onChange={(e) => setFormData({...formData, capsAlignment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="e.g., Functions 4.1: Investigate and extend numeric patterns"
                />
              </div>

              {/* Learning Objectives */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Learning Objectives</label>
                  <button
                    onClick={() => setFormData({...formData, objectives: [...formData.objectives, '']})}
                    className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-sm hover:bg-rose-200 flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Objective
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => {
                          const newObjectives = [...formData.objectives]
                          newObjectives[index] = e.target.value
                          setFormData({...formData, objectives: newObjectives})
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder={`Objective ${index + 1}`}
                      />
                      {formData.objectives.length > 1 && (
                        <button
                          onClick={() => {
                            const newObjectives = formData.objectives.filter((_, i) => i !== index)
                            setFormData({...formData, objectives: newObjectives})
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Activities</label>
                  <button
                    onClick={() => setFormData({...formData, activities: [...formData.activities, '']})}
                    className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-sm hover:bg-rose-200 flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Activity
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.activities.map((activity, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={activity}
                        onChange={(e) => {
                          const newActivities = [...formData.activities]
                          newActivities[index] = e.target.value
                          setFormData({...formData, activities: newActivities})
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder={`Activity ${index + 1} (include timing, e.g., 'Warm-up exercise (10 min)')`}
                      />
                      {formData.activities.length > 1 && (
                        <button
                          onClick={() => {
                            const newActivities = formData.activities.filter((_, i) => i !== index)
                            setFormData({...formData, activities: newActivities})
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Required Resources</label>
                  <button
                    onClick={() => setFormData({...formData, resources: [...formData.resources, '']})}
                    className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-sm hover:bg-rose-200 flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Resource
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.resources.map((resource, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={resource}
                        onChange={(e) => {
                          const newResources = [...formData.resources]
                          newResources[index] = e.target.value
                          setFormData({...formData, resources: newResources})
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder={`Resource ${index + 1} (e.g., 'Graphing calculator', 'Worksheet A')`}
                      />
                      {formData.resources.length > 1 && (
                        <button
                          onClick={() => {
                            const newResources = formData.resources.filter((_, i) => i !== index)
                            setFormData({...formData, resources: newResources})
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Method</label>
                <textarea
                  value={formData.assessment}
                  onChange={(e) => setFormData({...formData, assessment: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Describe how student learning will be assessed (e.g., 'Formative - Exit ticket and class participation')"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here you would typically save the lesson plan
                  console.log('Saving lesson plan:', formData)
                  setShowCreateForm(false)
                  // Reset form
                  setFormData({
                    title: '',
                    duration: 60,
                    date: '',
                    objectives: [''],
                    activities: [''],
                    resources: [''],
                    assessment: '',
                    capsAlignment: ''
                  })
                }}
                disabled={!formData.title.trim()}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {editingLesson ? 'Update Lesson Plan' : 'Create Lesson Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {selectedTab === 'planner' && (
          <>
            <div className="col-span-8">
              <div className="space-y-4">
                {subjectLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl border border-rose-200 p-6"
                  >
                    {/* Lesson Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <SubjectIcon className="w-8 h-8 text-rose-600" />
                        <div>
                          <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-sm text-gray-600">{lesson.date}</p>
                            <p className="text-sm text-gray-600">{lesson.duration} minutes</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lesson.status)}`}>
                              {getStatusIcon(lesson.status)}
                              <span className="ml-1">{lesson.status.replace('_', ' ').toUpperCase()}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setEditingLesson(lesson)
                            setShowCreateForm(true)
                            setFormData({
                              title: lesson.title,
                              duration: lesson.duration,
                              date: lesson.date,
                              objectives: lesson.objectives,
                              activities: lesson.activities,
                              resources: lesson.resources,
                              assessment: lesson.assessment,
                              capsAlignment: lesson.capsAlignment
                            })
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit lesson plan"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Copy lesson plan">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="View details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* CAPS Alignment */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">CAPS Alignment</p>
                      <p className="text-sm text-blue-700">{lesson.capsAlignment}</p>
                    </div>

                    {/* Learning Objectives */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-rose-600" />
                        Learning Objectives
                      </h4>
                      <ul className="space-y-1">
                        {lesson.objectives.map((objective, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Activities Timeline */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <PlayCircle className="w-4 h-4 text-rose-600" />
                        Activities
                      </h4>
                      <div className="space-y-2">
                        {lesson.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </div>
                            <p className="text-sm text-gray-700">{activity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources & Assessment */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-rose-600" />
                          Resources
                        </h4>
                        <ul className="space-y-1">
                          {lesson.resources.map((resource, idx) => (
                            <li key={idx} className="text-sm text-gray-700">• {resource}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-rose-600" />
                          Assessment
                        </h4>
                        <p className="text-sm text-gray-700">{lesson.assessment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="col-span-4">
              <div className="bg-white rounded-2xl p-5 border border-rose-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Unit Progress</h3>
                <div className="space-y-4">
                  {currentSubject.units.map((unit, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{unit}</span>
                        <span className="text-xs text-gray-600">{Math.floor(Math.random() * 30) + 60}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-rose-500 transition-all duration-1000"
                          style={{ width: `${Math.floor(Math.random() * 30) + 60}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-900">Teaching Tip</span>
                  </div>
                  <p className="text-xs text-gray-700">Use visual aids when introducing new mathematical concepts. Students retain 65% more when they can see the concept illustrated.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'resources' && (
          <div className="col-span-12">
            <div className="bg-white rounded-2xl p-6 border border-rose-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Resource Library</h3>
                <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm hover:bg-rose-700 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Upload Resource
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {resourceLibrary.map((resource, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-rose-600" />
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{resource.type}</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">{resource.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">Subject: {resource.subject}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{resource.downloads} downloads</span>
                      <button className="text-rose-600 hover:text-rose-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'students' && (
          <div className="col-span-12">
            <div className="bg-white rounded-2xl p-6 border border-rose-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Progress Tracking</h3>
              <div className="space-y-3">
                {studentProgress.map((student, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{currentSubject.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Completion</p>
                        <p className="font-bold text-gray-900">{student.completion}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Grade</p>
                        <p className="font-bold text-gray-900">{student.grade}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {student.concerns ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <span className={`text-sm font-medium ${student.concerns ? 'text-red-600' : 'text-green-600'}`}>
                          {student.concerns ? 'Needs Support' : 'On Track'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'collaborate' && (
          <div className="col-span-12">
            <div className="bg-white rounded-2xl p-6 border border-rose-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Teacher Collaboration</h3>
              <div className="grid grid-cols-3 gap-6">
                {collaborationData.map((collab, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{collab.teacher}</p>
                        <p className="text-sm text-gray-600">{collab.subject}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{collab.shared}</p>
                        <p className="text-xs text-gray-500">Shared</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{collab.received}</p>
                        <p className="text-xs text-gray-500">Received</p>
                      </div>
                    </div>
                    <button className="w-full mt-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherLessonPlanner