'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  badge?: number | string
  disabled?: boolean
}

interface MobileTabNavProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  position?: 'top' | 'bottom'
  variant?: 'pills' | 'underline' | 'filled'
  size?: 'small' | 'medium' | 'large'
  scrollable?: boolean
  centered?: boolean
  className?: string
}

const MobileTabNav = ({
  tabs,
  activeTab,
  onTabChange,
  position = 'top',
  variant = 'underline',
  size = 'medium',
  scrollable = true,
  centered = false,
  className = ''
}: MobileTabNavProps) => {
  const getTabHeight = () => {
    switch (size) {
      case 'small': return 'h-10'
      case 'large': return 'h-14'
      default: return 'h-mobile-tab'
    }
  }

  const getTabTextSize = () => {
    switch (size) {
      case 'small': return 'text-sm'
      case 'large': return 'text-mobile-body'
      default: return 'text-mobile-button'
    }
  }

  const getContainerClasses = () => {
    let classes = `
      ${getTabHeight()} bg-white border-gray-100 flex items-center
      ${position === 'bottom' ? 'border-t' : 'border-b'}
      ${className}
    `
    
    if (scrollable) {
      classes += ' mobile-hidden-scroll'
    }
    
    return classes
  }

  const getTabClasses = (tab: TabItem, isActive: boolean) => {
    let baseClasses = `
      relative flex items-center justify-center gap-2 px-4 transition-all
      min-h-touch-target touch-manipulation ${getTabTextSize()}
      ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `

    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-full mx-1 ${
          isActive 
            ? 'bg-ncbs-blue text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`
      
      case 'filled':
        return `${baseClasses} ${
          isActive 
            ? 'bg-ncbs-blue/10 text-ncbs-blue border-b-2 border-ncbs-blue' 
            : 'text-gray-600 hover:bg-gray-50'
        }`
      
      default: // underline
        return `${baseClasses} border-b-2 ${
          isActive 
            ? 'text-ncbs-blue border-ncbs-blue' 
            : 'text-gray-600 border-transparent hover:text-gray-900'
        }`
    }
  }

  const renderTab = (tab: TabItem) => {
    const isActive = activeTab === tab.id
    
    return (
      <button
        key={tab.id}
        onClick={() => !tab.disabled && onTabChange(tab.id)}
        disabled={tab.disabled}
        className={getTabClasses(tab, isActive)}
      >
        {/* Icon */}
        {tab.icon && (
          <div className="w-5 h-5 flex-shrink-0">
            {tab.icon}
          </div>
        )}
        
        {/* Label */}
        <span className={`font-medium whitespace-nowrap ${
          size === 'small' && tab.icon ? 'hidden xs:inline' : ''
        }`}>
          {tab.label}
        </span>
        
        {/* Badge */}
        {tab.badge && (
          <div className={`
            flex items-center justify-center min-w-[20px] h-5 px-1.5 
            text-xs font-bold rounded-full
            ${isActive 
              ? 'bg-white text-ncbs-blue' 
              : 'bg-red-500 text-white'
            }
          `}>
            {tab.badge}
          </div>
        )}

        {/* Active Indicator (for pills variant) */}
        {variant === 'pills' && isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-ncbs-blue rounded-full -z-10"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    )
  }

  if (scrollable) {
    return (
      <div className={getContainerClasses()}>
        <div className={`flex overflow-x-auto ${centered ? 'justify-center' : ''}`}>
          <div className="flex gap-1 px-mobile-padding">
            {tabs.map(renderTab)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={getContainerClasses()}>
      <div className={`flex w-full ${centered ? 'justify-center' : ''}`}>
        <div className={`flex ${tabs.length <= 3 ? 'w-full' : 'gap-1'}`}>
          {tabs.map((tab) => (
            <div 
              key={tab.id} 
              className={tabs.length <= 3 ? 'flex-1' : ''}
            >
              {renderTab(tab)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MobileTabNav