'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, Award, Target, BookOpen,
  Clock, Calendar, ChevronRight, Star, AlertCircle,
  BarChart3, PieChart, Activity, Brain, Trophy
} from 'lucide-react'

// Student performance data
const performanceData = {
  overall: {
    grade: 'B+',
    percentage: 78,
    trend: 'up',
    change: 5,
    rank: 12,
    totalStudents: 45
  },
  subjects: [
    { name: 'Mathematics', grade: 'A', percentage: 85, trend: 'up', change: 3, strengths: ['Algebra', 'Geometry'], weaknesses: ['Statistics'] },
    { name: 'Science', grade: 'B+', percentage: 79, trend: 'up', change: 7, strengths: ['Physics', 'Biology'], weaknesses: ['Chemistry'] },
    { name: 'English', grade: 'B', percentage: 75, trend: 'down', change: -2, strengths: ['Writing', 'Grammar'], weaknesses: ['Vocabulary'] },
    { name: 'History', grade: 'A-', percentage: 82, trend: 'stable', change: 0, strengths: ['Modern History'], weaknesses: ['Ancient History'] },
    { name: 'Geography', grade: 'B', percentage: 73, trend: 'up', change: 4, strengths: ['Maps', 'Climate'], weaknesses: ['Economics'] },
  ],
  recentAssessments: [
    { subject: 'Mathematics', type: 'Quiz', score: 18, total: 20, date: '2 days ago' },
    { subject: 'Science', type: 'Test', score: 42, total: 50, date: '1 week ago' },
    { subject: 'English', type: 'Essay', score: 85, total: 100, date: '1 week ago' },
    { subject: 'History', type: 'Project', score: 45, total: 50, date: '2 weeks ago' },
  ],
  achievements: [
    { id: 1, title: 'Math Wizard', description: '5 perfect scores in a row', icon: '🧙‍♂️', date: '3 days ago', color: 'from-purple-500 to-pink-500' },
    { id: 2, title: 'Science Star', description: 'Top performer in lab work', icon: '⭐', date: '1 week ago', color: 'from-blue-500 to-cyan-500' },
    { id: 3, title: 'Essay Expert', description: 'Outstanding writing skills', icon: '✍️', date: '2 weeks ago', color: 'from-green-500 to-emerald-500' },
  ],
  studyTime: {
    today: 2.5,
    weekly: 18,
    monthly: 72,
    subjects: [
      { name: 'Mathematics', hours: 6 },
      { name: 'Science', hours: 5 },
      { name: 'English', hours: 4 },
      { name: 'History', hours: 3 },
    ]
  }
}

const StudentPerformanceMobile = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'progress' | 'insights'>('overview')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-500'
    if (grade.startsWith('B')) return 'text-blue-500'
    if (grade.startsWith('C')) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <div className="w-4 h-4 rounded-full bg-gray-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Performance</h1>
              <p className="text-sm text-gray-500">Sarah Johnson • Grade 10B</p>
            </div>
            <motion.div 
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-semibold">Rank #{performanceData.overall.rank}</span>
              </div>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {(['overview', 'subjects', 'progress', 'insights'] as const).map(tab => (
              <motion.button
                key={tab}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium capitalize transition-all ${
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
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Overall Performance Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 text-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Overall Grade</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{performanceData.overall.grade}</span>
                      <span className="text-xl opacity-80">{performanceData.overall.percentage}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 rounded-lg px-2 py-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+{performanceData.overall.change}%</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${performanceData.overall.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-100">Class Rank: {performanceData.overall.rank}/{performanceData.overall.totalStudents}</span>
                  <span className="text-blue-100">Top 27%</span>
                </div>
              </motion.div>

              {/* Study Time Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Study Time</h3>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{performanceData.studyTime.today}h</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{performanceData.studyTime.weekly}h</p>
                    <p className="text-xs text-gray-500">This Week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{performanceData.studyTime.monthly}h</p>
                    <p className="text-xs text-gray-500">This Month</p>
                  </div>
                </div>
              </motion.div>

              {/* Recent Assessments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Recent Assessments</h3>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {performanceData.recentAssessments.slice(0, 3).map((assessment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{assessment.subject}</p>
                          <p className="text-xs text-gray-500">{assessment.type} • {assessment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{assessment.score}/{assessment.total}</p>
                        <p className="text-xs text-gray-500">{Math.round((assessment.score/assessment.total) * 100)}%</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Recent Achievements</h3>
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {performanceData.achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-shrink-0 w-32 bg-gradient-to-br ${achievement.color} rounded-xl p-3 text-white`}
                    >
                      <div className="text-2xl mb-2">{achievement.icon}</div>
                      <h4 className="text-sm font-semibold mb-1">{achievement.title}</h4>
                      <p className="text-xs opacity-90">{achievement.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'subjects' && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {performanceData.subjects.map((subject, index) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSubject(subject.name === selectedSubject ? null : subject.name)}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        subject.grade.startsWith('A') ? 'bg-green-100' :
                        subject.grade.startsWith('B') ? 'bg-blue-100' :
                        'bg-yellow-100'
                      }`}>
                        <span className={`text-lg font-bold ${getGradeColor(subject.grade)}`}>{subject.grade}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">{subject.percentage}%</span>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(subject.trend, subject.change)}
                            {subject.change !== 0 && (
                              <span className={`text-xs font-medium ${
                                subject.change > 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {subject.change > 0 ? '+' : ''}{subject.change}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                      selectedSubject === subject.name ? 'rotate-90' : ''
                    }`} />
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`h-full rounded-full ${
                        subject.grade.startsWith('A') ? 'bg-green-500' :
                        subject.grade.startsWith('B') ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}
                    />
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedSubject === subject.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-2">Strengths</p>
                              <div className="space-y-1">
                                {subject.strengths.map((strength, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <Star className="w-3 h-3 text-green-500" />
                                    <span className="text-sm text-gray-700">{strength}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-2">Focus Areas</p>
                              <div className="space-y-1">
                                {subject.weaknesses.map((weakness, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3 text-orange-500" />
                                    <span className="text-sm text-gray-700">{weakness}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Progress Chart */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Monthly Progress</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="h-48 flex items-end justify-between gap-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                    const height = 60 + Math.random() * 40
                    return (
                      <div key={month} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg"
                        />
                        <span className="text-xs text-gray-500">{month}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Study Distribution */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Study Distribution</h3>
                  <PieChart className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {performanceData.studyTime.subjects.map((subject, index) => {
                    const percentage = (subject.hours / performanceData.studyTime.weekly) * 100
                    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500']
                    return (
                      <div key={subject.name} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700">{subject.name}</span>
                            <span className="text-sm font-medium text-gray-900">{subject.hours}h</span>
                          </div>
                          <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ delay: index * 0.1 }}
                              className={`h-full ${colors[index]}`}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* AI Insights */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Insights</h3>
                    <p className="text-xs text-gray-500">Personalized recommendations</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5" />
                      <div>
                        <p className="text-sm text-gray-700">Strong improvement in Science (+7%). Keep up the momentum with more lab practice.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5" />
                      <div>
                        <p className="text-sm text-gray-700">English needs attention. Consider spending 30 min daily on vocabulary exercises.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />
                      <div>
                        <p className="text-sm text-gray-700">Your study pattern shows best retention in morning sessions. Try scheduling difficult topics then.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals & Targets */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Goals & Targets</h3>
                  <Target className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Achieve 80% in Math</p>
                        <p className="text-xs text-gray-500">Completed last week</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">75%</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Read 20 books this term</p>
                        <p className="text-xs text-gray-500">15 of 20 completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">NEW</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Join Science Club</p>
                        <p className="text-xs text-gray-500">Starts next month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StudentPerformanceMobile