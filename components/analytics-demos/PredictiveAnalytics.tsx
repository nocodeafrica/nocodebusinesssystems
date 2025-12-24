'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp,
  Brain,
  Target,
  Calendar,
  DollarSign,
  Users,
  Package,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

// Sales forecast data
const forecastData = [
  { month: 'Jan', actual: 245000, forecast: null, upperBound: null, lowerBound: null },
  { month: 'Feb', actual: 265000, forecast: null, upperBound: null, lowerBound: null },
  { month: 'Mar', actual: 285000, forecast: null, upperBound: null, lowerBound: null },
  { month: 'Apr', actual: 298000, forecast: null, upperBound: null, lowerBound: null },
  { month: 'May', actual: 315000, forecast: null, upperBound: null, lowerBound: null },
  { month: 'Jun', actual: 342000, forecast: null, upperBound: null, lowerBound: null },
  { month: 'Jul', actual: null, forecast: 365000, upperBound: 380000, lowerBound: 350000 },
  { month: 'Aug', actual: null, forecast: 385000, upperBound: 405000, lowerBound: 365000 },
  { month: 'Sep', actual: null, forecast: 410000, upperBound: 435000, lowerBound: 385000 },
  { month: 'Oct', actual: null, forecast: 438000, upperBound: 466000, lowerBound: 410000 },
  { month: 'Nov', actual: null, forecast: 465000, upperBound: 495000, lowerBound: 435000 },
  { month: 'Dec', actual: null, forecast: 492000, upperBound: 524000, lowerBound: 460000 }
]

// Product demand prediction
const demandData = [
  { product: 'Smart Watch Pro', current: 1234, predicted: 1567, confidence: 92 },
  { product: 'Wireless Earbuds', current: 2456, predicted: 2890, confidence: 88 },
  { product: 'Fitness Tracker', current: 987, predicted: 1123, confidence: 85 },
  { product: 'Smart Home Hub', current: 567, predicted: 890, confidence: 79 },
  { product: 'VR Headset', current: 345, predicted: 567, confidence: 76 }
]

// Customer segments prediction
const segmentPrediction = [
  { segment: 'Acquisition', value: 85, predicted: 92 },
  { segment: 'Activation', value: 72, predicted: 78 },
  { segment: 'Retention', value: 68, predicted: 75 },
  { segment: 'Revenue', value: 58, predicted: 65 },
  { segment: 'Referral', value: 45, predicted: 52 }
]

// Risk factors
const riskFactors = [
  { factor: 'Supply Chain', current: 32, predicted: 45, trend: 'up' },
  { factor: 'Market Competition', current: 56, predicted: 52, trend: 'down' },
  { factor: 'Economic Conditions', current: 68, predicted: 72, trend: 'up' },
  { factor: 'Regulatory Changes', current: 25, predicted: 28, trend: 'stable' },
  { factor: 'Technology Disruption', current: 42, predicted: 38, trend: 'down' }
]

// Model confidence metrics
const modelMetrics = [
  { metric: 'Accuracy', value: 94.2 },
  { metric: 'Precision', value: 92.8 },
  { metric: 'Recall', value: 91.5 },
  { metric: 'F1 Score', value: 92.1 }
]

const PredictiveAnalytics = () => {
  const getTrendIcon = (current: number, predicted: number) => {
    const change = ((predicted - current) / current) * 100
    if (change > 5) return <ChevronUp className="w-4 h-4 text-green-500" />
    if (change < -5) return <ChevronDown className="w-4 h-4 text-red-500" />
    return <span className="w-4 h-4 text-gray-400">→</span>
  }

  const getChangePercentage = (current: number, predicted: number) => {
    const change = ((predicted - current) / current) * 100
    return change.toFixed(1)
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Predictive Analytics</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">AI-powered forecasting and insights</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl min-h-[44px] flex items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs md:text-sm font-medium text-gray-700">Model: XGBoost v4.2</span>
            </div>
          </div>
          <div className="px-4 py-2 bg-indigo-600 text-white rounded-xl min-h-[44px] flex items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="text-xs md:text-sm font-medium">94.2% Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Forecast */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Revenue Forecast</h3>
            <p className="text-xs md:text-sm text-gray-500">6-month prediction with 95% confidence interval</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full" />
              <span className="text-xs text-gray-600">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full" />
              <span className="text-xs text-gray-600">Forecast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 bg-purple-200 rounded" />
              <span className="text-xs text-gray-600">Confidence</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto"><ResponsiveContainer width="100%" height={250} minWidth={400}>
          <ComposedChart data={forecastData}>
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `R${value/1000}k`} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: any) => [`R${(value/1000).toFixed(0)}k`, '']}
            />
            <Area 
              type="monotone" 
              dataKey="upperBound" 
              fill="url(#confidenceGradient)"
              stroke="none"
            />
            <Area 
              type="monotone" 
              dataKey="lowerBound" 
              fill="white"
              stroke="none"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#6366f1" 
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#8b5cf6', r: 4 }}
            />
            <ReferenceLine x="Jun" stroke="#9ca3af" strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer></div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-6">
        {/* Product Demand Forecast */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Demand Forecast</h3>
          <div className="space-y-4">
            {demandData.map((product, index) => (
              <motion.div 
                key={product.product}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-50 pb-3 last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm font-medium text-gray-900">{product.product}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                      {product.confidence}% confidence
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs md:text-sm text-gray-500">Current: {product.current.toLocaleString()}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-xs md:text-sm font-medium text-gray-900">Predicted: {product.predicted.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(product.current, product.predicted)}
                    <span className={`text-xs md:text-sm font-medium ${
                      product.predicted > product.current ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {getChangePercentage(product.current, product.predicted)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customer Journey Prediction */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Customer Journey</h3>
          <div className="overflow-x-auto"><ResponsiveContainer width="100%" height={250} minWidth={300}>
            <RadarChart data={segmentPrediction}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="segment" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar 
                name="Current" 
                dataKey="value" 
                stroke="#6366f1" 
                fill="#6366f1" 
                fillOpacity={0.3}
              />
              <Radar 
                name="Predicted" 
                dataKey="predicted" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.3}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer></div>
        </div>

        {/* Model Performance */}
        <div className="lg:col-span-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-4 md:p-6 text-white">
          <h3 className="text-base md:text-lg font-semibold mb-4">Model Performance</h3>
          <div className="space-y-4">
            {modelMetrics.map((metric) => (
              <div key={metric.metric}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm opacity-90">{metric.metric}</span>
                  <span className="text-sm font-bold">{metric.value}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">Last trained</span>
              <span className="text-sm font-medium">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm opacity-90">Data points</span>
              <span className="text-sm font-medium">2.4M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Risk Assessment</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-lg">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">2 High Risk Factors</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {riskFactors.map((risk, index) => (
            <motion.div
              key={risk.factor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-3 md:p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs md:text-sm font-medium text-gray-900">{risk.factor}</span>
                {risk.trend === 'up' && <ChevronUp className="w-4 h-4 text-red-500" />}
                {risk.trend === 'down' && <ChevronDown className="w-4 h-4 text-green-500" />}
                {risk.trend === 'stable' && <span className="w-4 h-4 text-gray-400">→</span>}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Current</span>
                    <span className="text-xs font-medium text-gray-700">{risk.current}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        risk.current > 60 ? 'bg-red-500' : risk.current > 40 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${risk.current}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Predicted</span>
                    <span className="text-xs font-medium text-gray-700">{risk.predicted}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full opacity-60 ${
                        risk.predicted > 60 ? 'bg-red-500' : risk.predicted > 40 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${risk.predicted}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 md:p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-base md:text-lg font-semibold">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white/10 rounded-xl p-3 md:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4" />
              <span className="text-xs md:text-sm font-medium">Inventory</span>
            </div>
            <p className="text-xs md:text-sm opacity-90">Increase stock for Smart Watch Pro by 27% to meet predicted demand</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 md:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" />
              <span className="text-xs md:text-sm font-medium">Marketing</span>
            </div>
            <p className="text-xs md:text-sm opacity-90">Focus campaigns on retention segment for 15% revenue increase</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 md:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs md:text-sm font-medium">Risk Mitigation</span>
            </div>
            <p className="text-xs md:text-sm opacity-90">Diversify suppliers to reduce supply chain risk by 18%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictiveAnalytics