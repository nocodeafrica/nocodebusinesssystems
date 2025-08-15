'use client'

import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Star, 
  MapPin, 
  Clock, 
  Phone,
  Heart,
  Share2,
  ExternalLink,
  Navigation,
  Info,
  X
} from 'lucide-react'

interface InfoAction {
  id: string
  label: string
  icon: ReactNode
  primary?: boolean
  onClick: () => void
}

interface InfoBadge {
  id: string
  label: string
  value: string | number
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'gray'
  icon?: ReactNode
}

interface MobileInfoCardProps {
  title: string
  subtitle?: string
  description?: string
  image?: string
  rating?: number
  reviews?: number
  address?: string
  phone?: string
  hours?: string
  website?: string
  status?: 'open' | 'closed' | 'busy'
  badges?: InfoBadge[]
  actions?: InfoAction[]
  expandable?: boolean
  expanded?: boolean
  onExpandToggle?: () => void
  onClose?: () => void
  showCloseButton?: boolean
  children?: ReactNode
  className?: string
  size?: 'compact' | 'normal' | 'large'
}

const MobileInfoCard = ({
  title,
  subtitle,
  description,
  image,
  rating,
  reviews,
  address,
  phone,
  hours,
  website,
  status,
  badges = [],
  actions = [],
  expandable = false,
  expanded = false,
  onExpandToggle,
  onClose,
  showCloseButton = false,
  children,
  className = '',
  size = 'normal'
}: MobileInfoCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-600'
      case 'closed': return 'bg-red-100 text-red-600'
      case 'busy': return 'bg-yellow-100 text-yellow-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getBadgeColor = (color?: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-700'
      case 'blue': return 'bg-blue-100 text-blue-700'
      case 'red': return 'bg-red-100 text-red-700'
      case 'yellow': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const cardHeight = size === 'compact' ? 'min-h-mobile-card' : 
                   size === 'large' ? 'min-h-mobile-popup' : 
                   'min-h-[160px]'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`
        bg-white rounded-mobile-card shadow-mobile-card overflow-hidden
        ${cardHeight} ${className}
      `}
    >
      {/* Header with Image */}
      {(image || showCloseButton) && (
        <div className="relative">
          {image && !imageError && (
            <div className={`relative overflow-hidden ${
              size === 'compact' ? 'h-20' : 
              size === 'large' ? 'h-32' : 'h-24'
            }`}>
              <motion.img
                src={image}
                alt={title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          )}

          {/* Close Button */}
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-mobile-padding">
        {/* Title and Status */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 truncate ${
              size === 'compact' ? 'text-mobile-subtitle' : 'text-mobile-title'
            }`}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-mobile-caption text-gray-500 truncate">{subtitle}</p>
            )}
          </div>
          
          {status && (
            <span className={`px-2 py-1 rounded-full text-mobile-caption font-medium whitespace-nowrap ml-2 ${getStatusColor(status)}`}>
              {status === 'open' ? '● Open' : status === 'closed' ? '● Closed' : '● Busy'}
            </span>
          )}
        </div>

        {/* Rating and Reviews */}
        {(rating || reviews) && (
          <div className="flex items-center gap-2 mb-2">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-mobile-button font-medium">{rating}</span>
              </div>
            )}
            {reviews && (
              <span className="text-mobile-caption text-gray-500">({reviews} reviews)</span>
            )}
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {badges.slice(0, expanded ? badges.length : 3).map((badge) => (
              <div
                key={badge.id}
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${getBadgeColor(badge.color)}`}
              >
                {badge.icon && (
                  <div className="w-3 h-3">{badge.icon}</div>
                )}
                <span className="text-mobile-caption font-medium">{badge.label}</span>
                <span className="text-mobile-caption">{badge.value}</span>
              </div>
            ))}
            {badges.length > 3 && !expanded && (
              <button
                onClick={onExpandToggle}
                className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-mobile-caption"
              >
                +{badges.length - 3} more
              </button>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className={`text-mobile-body text-gray-600 mb-3 ${
            expanded ? '' : 'line-clamp-2'
          }`}>
            {description}
          </p>
        )}

        {/* Contact Info */}
        {(address || phone || hours || website) && (
          <div className="space-y-2 mb-4">
            {address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-mobile-button text-gray-600">{address}</span>
              </div>
            )}
            {hours && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-mobile-button text-gray-600">{hours}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-mobile-button text-gray-600">{phone}</span>
              </div>
            )}
            {website && (
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-mobile-button text-ncbs-blue">{website}</span>
              </div>
            )}
          </div>
        )}

        {/* Custom Content */}
        <AnimatePresence>
          {(children && expanded) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        {actions.length > 0 && (
          <div className={`flex gap-2 ${actions.length > 2 ? 'flex-col' : ''}`}>
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`
                  flex items-center justify-center gap-2 px-4 py-2.5 rounded-mobile-button
                  text-mobile-button font-medium transition-colors min-h-touch-target
                  ${action.primary
                    ? 'bg-ncbs-blue text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                  ${actions.length > 2 ? 'flex-1' : actions.length === 1 ? 'w-full' : 'flex-1'}
                `}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Expand Toggle */}
        {expandable && onExpandToggle && (
          <button
            onClick={onExpandToggle}
            className="flex items-center justify-center w-full py-2 mt-3 text-mobile-button text-gray-500 hover:text-gray-700 transition-colors"
          >
            {expanded ? (
              <>
                <span>Show Less</span>
                <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                <span>Show More</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default MobileInfoCard