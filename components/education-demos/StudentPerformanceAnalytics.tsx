'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  BookOpen, Clock, Target, Award, Users, Calendar,
  BarChart3, Activity, Brain, Star, ArrowUp, ArrowDown,
  Eye, FileText, MessageSquare, Lightbulb, AlertCircle,
  Calculator, Atom, BookA, Globe, Beaker
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

// Realistic student data - mixed performance
const studentProfile = {
  name: 'Thabo Mthembu',
  grade: '11A',
  id: 'TM2024001',
  photo: 'TM',
  overallAverage: 76.2,
  classRank: 8,
  gradeRank: 24,
  totalStudents: 180,
  strengths: ['English', 'Life Sciences'],
  weaknesses: ['Mathematics', 'Physical Sciences'],
  trend: 'improving'
}

// Realistic performance data with mixed results
const subjectPerformance = [
  { 
    subject: 'Mathematics', 
    current: 65, 
    previous: 62, 
    trend: 'up',
    classAvg: 71,
    teacher: 'Mr. Johnson',
    nextTest: '2024-08-15',
    concern: true,
    icon: Calculator,
    color: '#ef4444'
  },
  { 
    subject: 'Physical Sciences', 
    current: 68, 
    previous: 72, 
    trend: 'down',
    classAvg: 74,
    teacher: 'Ms. Patel',
    nextTest: '2024-08-18',
    concern: true,
    icon: Atom,
    color: '#f97316'
  },
  { 
    subject: 'Life Sciences', 
    current: 87, 
    previous: 84, 
    trend: 'up',
    classAvg: 79,
    teacher: 'Dr. Nkomo',
    nextTest: '2024-08-20',
    concern: false,
    icon: Beaker,
    color: '#10b981'
  },
  { 
    subject: 'English', 
    current: 89, 
    previous: 88, 
    trend: 'up',
    classAvg: 82,
    teacher: 'Mrs. van Der Merwe',
    nextTest: '2024-08-22',
    concern: false,
    icon: BookA,
    color: '#10b981'
  },
  { 
    subject: 'Geography', 
    current: 74, 
    previous: 76, 
    trend: 'down',
    classAvg: 77,
    teacher: 'Mr. Mokoena',
    nextTest: '2024-08-25',
    concern: false,
    icon: Globe,
    color: '#f59e0b'
  }
]

// Term progress with realistic variation
const termProgress = [
  { month: 'Feb', mathematics: 58, physics: 75, lifeSci: 82, english: 85, geography: 78 },
  { month: 'Mar', mathematics: 61, physics: 73, lifeSci: 84, english: 87, geography: 76 },
  { month: 'Apr', mathematics: 59, physics: 71, lifeSci: 86, english: 88, geography: 75 },
  { month: 'May', mathematics: 63, physics: 69, lifeSci: 85, english: 89, geography: 73 },
  { month: 'Jun', mathematics: 65, physics: 68, lifeSci: 87, english: 89, geography: 74 },
]

// Learning path with realistic struggles
const learningPath = {
  mathematics: [
    { skill: 'Basic Algebra', mastery: 85, status: 'mastered' },
    { skill: 'Linear Functions', mastery: 78, status: 'proficient' },
    { skill: 'Quadratic Equations', mastery: 45, status: 'struggling', focus: true },
    { skill: 'Trigonometry', mastery: 30, status: 'developing' },
    { skill: 'Calculus Basics', mastery: 0, status: 'not_started' }
  ],
  english: [
    { skill: 'Creative Writing', mastery: 92, status: 'mastered' },
    { skill: 'Poetry Analysis', mastery: 88, status: 'mastered' },
    { skill: 'Essay Structure', mastery: 85, status: 'proficient' },
    { skill: 'Grammar & Syntax', mastery: 90, status: 'mastered' },
    { skill: 'Oral Presentation', mastery: 82, status: 'proficient' }
  ]
}

// Assessment history with mixed results
const assessmentHistory = [
  { date: '2024-07-15', subject: 'Mathematics', type: 'Test', score: 58, class_avg: 71, grade: 'D+' },
  { date: '2024-07-18', subject: 'English', type: 'Essay', score: 89, class_avg: 82, grade: 'A-' },
  { date: '2024-07-22', subject: 'Life Sciences', type: 'Practical', score: 91, class_avg: 79, grade: 'A+' },
  { date: '2024-07-25', subject: 'Physical Sciences', type: 'Test', score: 65, class_avg: 74, grade: 'C+' },
  { date: '2024-08-01', subject: 'Geography', type: 'Assignment', score: 76, class_avg: 77, grade: 'B' },
]

// Attendance and behavior data
const attendanceData = [
  { week: 'Week 1', attendance: 100, punctuality: 90, behavior: 85 },
  { week: 'Week 2', attendance: 80, punctuality: 75, behavior: 88 },
  { week: 'Week 3', attendance: 100, punctuality: 95, behavior: 92 },
  { week: 'Week 4', attendance: 90, punctuality: 85, behavior: 90 },
  { week: 'Week 5', attendance: 100, punctuality: 100, behavior: 95 },
]

// AI recommendations based on performance
const recommendations = [
  {
    type: 'urgent',
    subject: 'Mathematics',
    title: 'Quadratic Equations Support Needed',
    description: 'Thabo is struggling with quadratic equations. Recommend extra tutoring sessions.',
    action: 'Schedule 1-on-1 tutoring'
  },
  {
    type: 'positive',
    subject: 'English',
    title: 'Excellent Writing Skills',
    description: 'Consider entering Thabo in the district writing competition.',
    action: 'Discuss with English teacher'
  },
  {
    type: 'watch',
    subject: 'Physical Sciences',
    title: 'Declining Performance',
    description: 'Physics grades have dropped 4 points. Monitor closely.',
    action: 'Parent-teacher meeting'
  }
]

const StudentPerformanceAnalytics = () => {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedSubject, setSelectedSubject] = useState('mathematics')
  const [overallGrade, setOverallGrade] = useState(0)

  useEffect(() => {
    // Animate overall grade
    const timer = setTimeout(() => {
      setOverallGrade(studentProfile.overallAverage)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ArrowUp className="w-4 h-4 text-green-600" />
    ) : trend === 'down' ? (
      <ArrowDown className="w-4 h-4 text-red-600" />
    ) : null
  }

  const getGradeColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getMasteryColor = (status: string) => {
    switch(status) {
      case 'mastered': return 'bg-green-500'
      case 'proficient': return 'bg-blue-500'
      case 'struggling': return 'bg-red-500'
      case 'developing': return 'bg-yellow-500'
      case 'not_started': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8">
      {/* Student Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {studentProfile.photo}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{studentProfile.name}</h2>
            <p className="text-gray-600">Grade {studentProfile.grade} • Student ID: {studentProfile.id}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-600">Class Rank: #{studentProfile.classRank}</span>
              <span className="text-sm text-gray-600">Grade Rank: #{studentProfile.gradeRank} / {studentProfile.totalStudents}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                studentProfile.trend === 'improving' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {studentProfile.trend === 'improving' ? '📈 Improving' : '📉 Declining'}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-gray-900">{overallGrade.toFixed(1)}%</div>
          <p className="text-gray-600">Overall Average</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${overallGrade}%` }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'subjects', label: 'Subject Analysis', icon: BookOpen },
          { id: 'learning', label: 'Learning Path', icon: Target },
          { id: 'assessments', label: 'Assessment History', icon: FileText },
          { id: 'attendance', label: 'Attendance & Behavior', icon: Users },
          { id: 'recommendations', label: 'AI Insights', icon: Brain }
        ].map(tab => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
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
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Term Performance Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={termProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} domain={[40, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px'
                    }}
                  />
                  <Line type="monotone" dataKey="mathematics" stroke="#ef4444" strokeWidth={2} name="Mathematics" />
                  <Line type="monotone" dataKey="physics" stroke="#f97316" strokeWidth={2} name="Physical Sciences" />
                  <Line type="monotone" dataKey="lifeSci" stroke="#10b981" strokeWidth={2} name="Life Sciences" />
                  <Line type="monotone" dataKey="english" stroke="#3b82f6" strokeWidth={2} name="English" />
                  <Line type="monotone" dataKey="geography" stroke="#f59e0b" strokeWidth={2} name="Geography" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {studentProfile.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {studentProfile.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Grades</h3>
              <div className="space-y-3">
                {subjectPerformance.map((subject, index) => {
                  const IconComponent = subject.icon
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5" style={{ color: subject.color }} />
                        <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getGradeColor(subject.current)}`}>
                          {subject.current}%
                        </span>
                        {getTrendIcon(subject.trend)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Attendance</span>
                  <span className="text-sm font-bold text-green-600">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Assignments Submitted</span>
                  <span className="text-sm font-bold text-blue-600">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Behavior Score</span>
                  <span className="text-sm font-bold text-green-600">Good</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Parent Meetings</span>
                  <span className="text-sm font-bold text-orange-600">1 Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'subjects' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Subject</h3>
              <div className="space-y-2">
                {subjectPerformance.map((subject, index) => {
                  const IconComponent = subject.icon
                  return (
                    <button
                      key={subject.subject.toLowerCase().replace(' ', '')}
                      onClick={() => setSelectedSubject(subject.subject.toLowerCase().replace(' ', ''))}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        selectedSubject === subject.subject.toLowerCase().replace(' ', '')
                          ? 'bg-blue-100 border border-blue-200' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: subject.color }} />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{subject.subject}</p>
                        <p className="text-xs text-gray-600">{subject.teacher}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${getGradeColor(subject.current)}`}>
                          {subject.current}%
                        </p>
                        {subject.concern && (
                          <AlertCircle className="w-4 h-4 text-red-500 ml-auto" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="col-span-8">
            {subjectPerformance.find(s => s.subject.toLowerCase().replace(' ', '') === selectedSubject) && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {subjectPerformance.find(s => s.subject.toLowerCase().replace(' ', '') === selectedSubject)?.subject} Analysis
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    subjectPerformance.find(s => s.subject.toLowerCase().replace(' ', '') === selectedSubject)?.concern
                      ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {subjectPerformance.find(s => s.subject.toLowerCase().replace(' ', '') === selectedSubject)?.concern ? 'Needs Attention' : 'On Track'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {subjectPerformance.find(s => s.subject.toLowerCase().replace(' ', '') === selectedSubject)?.current}%
                    </p>
                    <p className="text-sm text-gray-600">Current Grade</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {subjectPerformance.find(s => s.subject.toLowerCase().replace(' ', '') === selectedSubject)?.classAvg}%
                    </p>
                    <p className="text-sm text-gray-600">Class Average</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {subjectPerformance.find(s => s.subject.toLowerCase().replace(' ', '') === selectedSubject)?.nextTest}
                    </p>
                    <p className="text-sm text-gray-600">Next Assessment</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Teacher Feedback</h4>
                  <p className="text-sm text-blue-800">
                    {selectedSubject === 'mathematics' && "Thabo shows good understanding of basic concepts but struggles with complex problem-solving. Recommend additional practice with quadratic equations."}
                    {selectedSubject === 'physicalsciences' && "Recent decline in performance noted. Thabo may benefit from review of fundamental physics principles and extra support."}
                    {selectedSubject === 'lifesciences' && "Excellent practical work and strong conceptual understanding. Thabo is performing above class average consistently."}
                    {selectedSubject === 'english' && "Outstanding writing skills and literary analysis. Consider advanced extension work and writing competitions."}
                    {selectedSubject === 'geography' && "Solid understanding of concepts but could improve map work and data analysis skills."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTab === 'learning' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mathematics Learning Path</h3>
              <div className="space-y-4">
                {learningPath.mathematics.map((skill, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${skill.focus ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-300'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getMasteryColor(skill.status)}`} />
                        <span className="text-sm text-gray-600">{skill.mastery}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getMasteryColor(skill.status)}`}
                        style={{ width: `${skill.mastery}%` }}
                      />
                    </div>
                    {skill.focus && (
                      <p className="text-sm text-red-600 mt-2">🎯 Priority Focus Area</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">English Learning Path</h3>
              <div className="space-y-4">
                {learningPath.english.map((skill, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getMasteryColor(skill.status)}`} />
                        <span className="text-sm text-gray-600">{skill.mastery}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getMasteryColor(skill.status)}`}
                        style={{ width: `${skill.mastery}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'assessments' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Assessment History</h3>
          <div className="space-y-4">
            {assessmentHistory.map((assessment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{assessment.subject}</p>
                    <p className="text-sm text-gray-600">{assessment.type} • {assessment.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className={`text-lg font-bold ${getGradeColor(assessment.score)}`}>
                      {assessment.score}%
                    </p>
                    <p className="text-xs text-gray-600">Your Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-600">{assessment.class_avg}%</p>
                    <p className="text-xs text-gray-600">Class Avg</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{assessment.grade}</p>
                    <p className="text-xs text-gray-600">Grade</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'attendance' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorPunctuality" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} domain={[60, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="attendance" stroke="#10b981" fill="url(#colorAttendance)" />
                  <Area type="monotone" dataKey="punctuality" stroke="#3b82f6" fill="url(#colorPunctuality)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Present</span>
                    <span className="text-sm font-bold text-green-600">94%</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Late Arrivals</span>
                    <span className="text-sm font-bold text-yellow-600">3 days</span>
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Absences</span>
                    <span className="text-sm font-bold text-red-600">2 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'recommendations' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-6 rounded-2xl border-l-4 ${
                  rec.type === 'urgent' ? 'bg-red-50 border-red-500' :
                  rec.type === 'positive' ? 'bg-green-50 border-green-500' :
                  'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      rec.type === 'urgent' ? 'bg-red-100' :
                      rec.type === 'positive' ? 'bg-green-100' :
                      'bg-yellow-100'
                    }`}>
                      {rec.type === 'urgent' ? <AlertTriangle className="w-5 h-5 text-red-600" /> :
                       rec.type === 'positive' ? <Star className="w-5 h-5 text-green-600" /> :
                       <Eye className="w-5 h-5 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                      <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        rec.type === 'urgent' ? 'bg-red-600 text-white' :
                        rec.type === 'positive' ? 'bg-green-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                        {rec.action}
                      </button>
                    </div>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                      {rec.subject}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Study Pattern</span>
                  </div>
                  <p className="text-xs text-blue-800">Thabo performs better on assessments scheduled on Wednesdays and Thursdays.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Learning Style</span>
                  </div>
                  <p className="text-xs text-purple-800">Visual learner - responds well to diagrams and concept maps.</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900">Goal Setting</span>
                  </div>
                  <p className="text-xs text-indigo-800">Target 70% in Mathematics by end of term - achievable with focused effort.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentPerformanceAnalytics