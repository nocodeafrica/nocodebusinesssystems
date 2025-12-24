'use client';

import { motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Download,
  Filter,
  MoreVertical,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Revenue trend data - 12 months
const revenueData = [
  { month: 'Jan', revenue: 124500, orders: 1245, avgOrder: 100 },
  { month: 'Feb', revenue: 145200, orders: 1389, avgOrder: 105 },
  { month: 'Mar', revenue: 162300, orders: 1502, avgOrder: 108 },
  { month: 'Apr', revenue: 178900, orders: 1634, avgOrder: 109 },
  { month: 'May', revenue: 195400, orders: 1756, avgOrder: 111 },
  { month: 'Jun', revenue: 208700, orders: 1845, avgOrder: 113 },
  { month: 'Jul', revenue: 224300, orders: 1934, avgOrder: 116 },
  { month: 'Aug', revenue: 241200, orders: 2045, avgOrder: 118 },
  { month: 'Sep', revenue: 256800, orders: 2134, avgOrder: 120 },
  { month: 'Oct', revenue: 273400, orders: 2256, avgOrder: 121 },
  { month: 'Nov', revenue: 289600, orders: 2367, avgOrder: 122 },
  { month: 'Dec', revenue: 312400, orders: 2489, avgOrder: 125 },
];

// Product categories
const categoryData = [
  { name: 'Electronics', value: 32, revenue: 'R892K', growth: 12 },
  { name: 'Clothing', value: 28, revenue: 'R756K', growth: 8 },
  { name: 'Home & Garden', value: 18, revenue: 'R512K', growth: 15 },
  { name: 'Sports', value: 12, revenue: 'R334K', growth: -3 },
  { name: 'Books', value: 10, revenue: 'R278K', growth: 5 },
];

// Top products
const topProducts = [
  { name: 'MacBook Pro 16"', sales: 342, revenue: 'R1.2M', change: 12 },
  { name: 'iPhone 15 Pro', sales: 892, revenue: 'R892K', change: 24 },
  { name: 'AirPods Pro', sales: 1234, revenue: 'R432K', change: -5 },
  { name: 'Nike Air Max', sales: 567, revenue: 'R234K', change: 18 },
  { name: 'Samsung TV 65"', sales: 234, revenue: 'R198K', change: 7 },
];

// Geographic data
const geoData = [
  { country: 'Gauteng', value: 42, revenue: 'R1.2M' },
  { country: 'Western Cape', value: 18, revenue: 'R512K' },
  { country: 'KwaZulu-Natal', value: 15, revenue: 'R428K' },
  { country: 'Eastern Cape', value: 12, revenue: 'R342K' },
  { country: 'Mpumalanga', value: 8, revenue: 'R228K' },
  { country: 'Other', value: 5, revenue: 'R142K' },
];

const colors = [
  '#8b5cf6',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#6b7280',
];

const BusinessIntelligence = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center md:mb-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 md:text-xl lg:text-2xl">
            Business Overview
          </h2>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            Real-time business metrics and insights
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 md:text-sm">
            <Calendar className="h-4 w-4" />
            Last 12 Months
          </button>
          <button className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 md:text-sm">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-purple-700 md:text-sm">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:gap-4 lg:grid-cols-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              24%
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 md:text-xl lg:text-2xl">
            R2.8M
          </p>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">Total Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              18%
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 md:text-xl lg:text-2xl">
            21,549
          </p>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">Total Orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              12%
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 md:text-xl lg:text-2xl">
            48,292
          </p>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            Active Customers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <span className="flex items-center text-sm font-medium text-red-600">
              <ArrowDownRight className="h-4 w-4" />
              3%
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 md:text-xl lg:text-2xl">
            R118
          </p>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            Avg Order Value
          </p>
        </motion.div>
      </div>

      {/* Main Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 lg:grid-cols-12 lg:gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6 lg:col-span-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900 md:text-lg">
                Revenue Trend
              </h3>
              <p className="text-xs text-gray-500 md:text-sm">
                Monthly revenue over the last year
              </p>
            </div>
            <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={250} minWidth={400}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickFormatter={(value) => `R${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: any) => [
                    `R${(value / 1000).toFixed(1)}k`,
                    'Revenue',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6 lg:col-span-4"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 md:text-lg">
              Sales by Category
            </h3>
            <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={200} minWidth={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {categoryData.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="text-xs text-gray-700 md:text-sm">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-900 md:text-sm">
                    {category.revenue}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      category.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {category.growth > 0 ? '+' : ''}
                    {category.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        {/* Top Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6 lg:col-span-7"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 md:text-lg">
              Top Products
            </h3>
            <button className="text-xs font-medium text-purple-600 hover:text-purple-700 md:text-sm">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Product
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Sales
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Revenue
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                          <span className="text-xs font-medium text-gray-600">
                            #{index + 1}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-900 md:text-sm">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-xs text-gray-700 md:text-sm">
                        {product.sales.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-medium text-gray-900 md:text-sm">
                        {product.revenue}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center text-xs font-medium md:text-sm ${
                          product.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {product.change > 0 ? (
                          <ArrowUpRight className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="mr-1 h-4 w-4" />
                        )}
                        {Math.abs(product.change)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6 lg:col-span-5"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 md:text-lg">
              Geographic Distribution
            </h3>
            <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <div className="space-y-4">
            {geoData.map((country, index) => (
              <div key={country.country}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 md:text-sm">
                    {country.country}
                  </span>
                  <span className="text-xs font-medium text-gray-900 md:text-sm">
                    {country.revenue}
                  </span>
                </div>
                <div className="relative">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${country.value}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: colors[index] }}
                    />
                  </div>
                  <span className="absolute -top-0.5 right-0 text-xs text-gray-500">
                    {country.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessIntelligence;
