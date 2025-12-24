'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  Database,
  Shield,
  Zap
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

// Generate initial performance data
const generatePerformanceData = () => {
  const data = []
  const now = new Date()
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: time.getHours() + ':00',
      cpu: Math.floor(Math.random() * 30) + 35,
      memory: Math.floor(Math.random() * 20) + 45,
      requests: Math.floor(Math.random() * 2000) + 3000,
      responseTime: Math.floor(Math.random() * 50) + 80
    })
  }
  return data
}

// Server metrics
const servers = [
  { 
    id: 1, 
    name: 'API Server 1', 
    region: 'US-East', 
    status: 'healthy',
    cpu: 42, 
    memory: 68, 
    disk: 45,
    uptime: '45d 12h',
    requests: '1.2M/day'
  },
  { 
    id: 2, 
    name: 'API Server 2', 
    region: 'US-West', 
    status: 'healthy',
    cpu: 38, 
    memory: 62, 
    disk: 52,
    uptime: '45d 12h',
    requests: '980K/day'
  },
  { 
    id: 3, 
    name: 'Database Primary', 
    region: 'US-East', 
    status: 'healthy',
    cpu: 55, 
    memory: 78, 
    disk: 68,
    uptime: '120d 8h',
    requests: '5.2M/day'
  },
  { 
    id: 4, 
    name: 'Database Replica', 
    region: 'EU-West', 
    status: 'warning',
    cpu: 72, 
    memory: 85, 
    disk: 71,
    uptime: '120d 8h',
    requests: '2.8M/day'
  },
  { 
    id: 5, 
    name: 'CDN Edge', 
    region: 'Global', 
    status: 'healthy',
    cpu: 28, 
    memory: 45, 
    disk: 34,
    uptime: '180d 0h',
    requests: '12M/day'
  },
  { 
    id: 6, 
    name: 'Load Balancer', 
    region: 'US-East', 
    status: 'healthy',
    cpu: 15, 
    memory: 32, 
    disk: 22,
    uptime: '365d 0h',
    requests: '8.5M/day'
  }
]

// API endpoints performance
const apiEndpoints = [
  { endpoint: '/api/users', calls: 45234, avgTime: 124, p95: 245, errors: 12 },
  { endpoint: '/api/products', calls: 38921, avgTime: 89, p95: 156, errors: 8 },
  { endpoint: '/api/orders', calls: 28456, avgTime: 234, p95: 456, errors: 23 },
  { endpoint: '/api/auth', calls: 52134, avgTime: 45, p95: 89, errors: 3 },
  { endpoint: '/api/search', calls: 19234, avgTime: 567, p95: 890, errors: 45 }
]

// Traffic by region
const trafficData = [
  { region: 'North America', users: 42500, percentage: 35 },
  { region: 'Europe', users: 38200, percentage: 31 },
  { region: 'Asia', users: 28900, percentage: 24 },
  { region: 'South America', users: 7300, percentage: 6 },
  { region: 'Africa', users: 3100, percentage: 3 },
  { region: 'Oceania', users: 1200, percentage: 1 }
]

const RealtimeMonitoring = () => {
  const [performanceData, setPerformanceData] = useState(generatePerformanceData())
  const [selectedMetric, setSelectedMetric] = useState('requests')
  const [liveConnections, setLiveConnections] = useState(3847)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveConnections(prev => prev + Math.floor(Math.random() * 20) - 10)
      
      // Update performance data
      setPerformanceData(prev => {
        const newData = [...prev.slice(1)]
        const now = new Date()
        newData.push({
          time: now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0'),
          cpu: Math.floor(Math.random() * 30) + 35,
          memory: Math.floor(Math.random() * 20) + 45,
          requests: Math.floor(Math.random() * 2000) + 3000,
          responseTime: Math.floor(Math.random() * 50) + 80
        })
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'healthy': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'critical': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusBg = (status: string) => {
    switch(status) {
      case 'healthy': return 'bg-green-100'
      case 'warning': return 'bg-yellow-100'
      case 'critical': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
  }

  const metricConfig: any = {
    requests: { label: 'Requests/min', color: '#8b5cf6' },
    cpu: { label: 'CPU Usage %', color: '#3b82f6' },
    memory: { label: 'Memory Usage %', color: '#10b981' },
    responseTime: { label: 'Response Time (ms)', color: '#f59e0b' }
  }

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Infrastructure Monitoring</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Real-time system performance and health</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs md:text-sm text-gray-600">All Systems Operational</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-xs md:text-sm font-medium text-gray-900">{liveConnections.toLocaleString()}</span>
            <span className="text-xs text-gray-500">live users</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-green-600 font-medium">+12%</span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900">5.2M</p>
          <p className="text-xs text-gray-500">Total Requests</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-green-600 font-medium">-8ms</span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900">124ms</p>
          <p className="text-xs text-gray-500">Avg Response</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-600 font-medium">Good</span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900">99.98%</p>
          <p className="text-xs text-gray-500">Uptime</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-red-600 font-medium">+3</span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500">Errors (24h)</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <span className="text-xs text-gray-600 font-medium">68%</span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900">2.4TB</p>
          <p className="text-xs text-gray-500">Storage Used</p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-xl p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <Wifi className="w-5 h-5 text-pink-600" />
            <span className="text-xs text-green-600 font-medium">Good</span>
          </div>
          <p className="text-lg md:text-xl font-bold text-gray-900">842Mb/s</p>
          <p className="text-xs text-gray-500">Network I/O</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-50 rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
        <div className="mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(metricConfig).map(([key, config]: [string, any]) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${
                  selectedMetric === key 
                    ? 'bg-white text-gray-900 shadow-md border border-gray-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto"><ResponsiveContainer width="100%" height={250} minWidth={400}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id={`color${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricConfig[selectedMetric].color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={metricConfig[selectedMetric].color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke={metricConfig[selectedMetric].color}
              strokeWidth={2}
              fill={`url(#color${selectedMetric})`} 
            />
          </AreaChart>
        </ResponsiveContainer></div>
      </div>

      {/* Servers Grid */}
      <div className="mb-8">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Server Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {servers.map((server) => (
            <motion.div 
              key={server.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: server.id * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-gray-900">{server.name}</p>
                    <p className="text-xs text-gray-500">{server.region}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBg(server.status)} ${getStatusColor(server.status)}`}>
                  {server.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> CPU
                    </span>
                    <span className="text-xs font-medium text-gray-900">{server.cpu}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${server.cpu > 70 ? 'bg-red-500' : server.cpu > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${server.cpu}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <HardDrive className="w-3 h-3" /> Memory
                    </span>
                    <span className="text-xs font-medium text-gray-900">{server.memory}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${server.memory > 80 ? 'bg-red-500' : server.memory > 60 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                      style={{ width: `${server.memory}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Uptime: {server.uptime}</span>
                  <span className="text-xs text-gray-500">{server.requests}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Row - API Performance and Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* API Endpoints */}
        <div className="lg:col-span-7 bg-gray-50 rounded-2xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">API Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Calls</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Avg Time</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">P95</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Errors</th>
                </tr>
              </thead>
              <tbody>
                {apiEndpoints.map((endpoint, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {endpoint.endpoint}
                      </code>
                    </td>
                    <td className="text-right py-3">
                      <span className="text-xs md:text-sm text-gray-900">{endpoint.calls.toLocaleString()}</span>
                    </td>
                    <td className="text-right py-3">
                      <span className={`text-xs md:text-sm font-medium ${endpoint.avgTime > 200 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {endpoint.avgTime}ms
                      </span>
                    </td>
                    <td className="text-right py-3">
                      <span className={`text-xs md:text-sm ${endpoint.p95 > 400 ? 'text-red-600' : 'text-gray-600'}`}>
                        {endpoint.p95}ms
                      </span>
                    </td>
                    <td className="text-right py-3">
                      <span className={`text-xs md:text-sm font-medium ${endpoint.errors > 20 ? 'text-red-600' : endpoint.errors > 10 ? 'text-orange-600' : 'text-green-600'}`}>
                        {endpoint.errors}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic by Region */}
        <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Traffic by Region</h3>
          <div className="space-y-3">
            {trafficData.map((region, index) => (
              <div key={region.region}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm font-medium text-gray-700">{region.region}</span>
                  <span className="text-xs md:text-sm text-gray-900">{region.users.toLocaleString()} users</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${region.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  </div>
                  <span className="absolute right-0 -top-0.5 text-xs text-gray-500">
                    {region.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealtimeMonitoring