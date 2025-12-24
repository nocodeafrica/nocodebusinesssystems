'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X, ChevronDown } from 'lucide-react'

interface FilterOption {
  id: string
  label: string
  value: string
  count?: number
}

interface MobileFilterBarProps {
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  filters?: {
    id: string
    label: string
    options: FilterOption[]
  }[]
  activeFilters?: string[]
  onFilterChange?: (filterId: string, optionId: string) => void
  onClearFilters?: () => void
  className?: string
}

const MobileFilterBar = ({
  searchPlaceholder = 'Search...',
  onSearch,
  filters = [],
  activeFilters = [],
  onFilterChange,
  onClearFilters,
  className = ''
}: MobileFilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const hasActiveFilters = activeFilters.length > 0

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
              isFilterOpen ? 'bg-blue-50 border-blue-300 text-blue-600' : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Quick Filter Chips */}
          {filters.map(filter => (
            <div key={filter.id} className="flex gap-2">
              {filter.options.slice(0, 3).map(option => {
                const isActive = activeFilters.includes(option.id)
                return (
                  <button
                    key={option.id}
                    onClick={() => onFilterChange?.(filter.id, option.id)}
                    className={`px-3 py-1.5 rounded-lg border text-sm whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                    {option.count !== undefined && (
                      <span className={`ml-1 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                        ({option.count})
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {isFilterOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-200 bg-gray-50"
        >
          <div className="px-4 py-4 space-y-3">
            {filters.map(filter => (
              <div key={filter.id}>
                <button
                  onClick={() => setExpandedFilter(expandedFilter === filter.id ? null : filter.id)}
                  className="flex items-center justify-between w-full py-2 text-left"
                >
                  <span className="text-sm font-medium text-gray-900">{filter.label}</span>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      expandedFilter === filter.id ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {expandedFilter === filter.id && (
                  <div className="mt-2 space-y-2">
                    {filter.options.map(option => {
                      const isActive = activeFilters.includes(option.id)
                      return (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 py-1.5 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => onFilterChange?.(filter.id, option.id)}
                            className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                          {option.count !== undefined && (
                            <span className="text-xs text-gray-500">({option.count})</span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default MobileFilterBar