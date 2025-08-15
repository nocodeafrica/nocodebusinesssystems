'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { 
  Camera,
  Move3d,
  Home,
  ChevronLeft,
  ChevronRight,
  Eye,
  Map,
  Layers,
  ZoomIn,
  ZoomOut,
  Info,
  Share2,
  Heart,
  Calendar,
  Phone,
  Download,
  Bed,
  Bath,
  Car,
  Trees,
  MapPin,
  Sofa,
  ChefHat,
  Square,
  X,
  Grid,
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  ArrowLeft
} from 'lucide-react'

// Property details
const propertyData = {
  id: 1,
  title: 'Luxury Villa in Constantia',
  location: 'Constantia, Cape Town',
  price: 12500000,
  type: 'Villa',
  bedrooms: 5,
  bathrooms: 4,
  parking: 3,
  size: 650,
  erf: 2000,
  description: 'Magnificent villa with panoramic mountain views in the heart of Constantia wine valley',
  agent: 'Sarah Johnson',
  agentPhone: '+27 82 555 0123'
}

// Real property images from Unsplash
const propertyImages = {
  exterior: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'
  ],
  livingRoom: [
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200',
    'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1200',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200'
  ],
  kitchen: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
    'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200',
    'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=1200'
  ],
  bedroom: [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200',
    'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=1200',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200'
  ],
  bathroom: [
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200',
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200',
    'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=1200'
  ],
  pool: [
    'https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=1200',
    'https://images.unsplash.com/photo-1572331165267-854da2b021fd?w=1200',
    'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=1200'
  ]
}

// Tour rooms
const tourRooms = [
  { id: 1, name: 'Exterior', icon: Home, images: propertyImages.exterior, hotspots: 3 },
  { id: 2, name: 'Living Room', icon: Sofa, images: propertyImages.livingRoom, hotspots: 4 },
  { id: 3, name: 'Kitchen', icon: ChefHat, images: propertyImages.kitchen, hotspots: 5 },
  { id: 4, name: 'Master Bedroom', icon: Bed, images: propertyImages.bedroom, hotspots: 3 },
  { id: 5, name: 'Master Bath', icon: Bath, images: propertyImages.bathroom, hotspots: 2 },
  { id: 6, name: 'Pool Area', icon: Trees, images: propertyImages.pool, hotspots: 4 }
]

interface VirtualTourMobileProps {
  onBack?: () => void
}

export default function VirtualTourMobile({ onBack }: VirtualTourMobileProps) {
  const [currentRoom, setCurrentRoom] = useState(tourRooms[0])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'tour' | 'rooms' | 'gallery' | 'floorplan'>('tour')
  const [savedTour, setSavedTour] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-100, 100], [-10, 10])
  const opacity = useTransform(x, [-100, -50, 0, 50, 100], [0.5, 1, 1, 1, 0.5])

  // Handle swipe gestures
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextImage()
    } else if (isRightSwipe) {
      prevImage()
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      (prev + 1) % currentRoom.images.length
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? currentRoom.images.length - 1 : prev - 1
    )
  }

  const formatPrice = (price: number) => {
    return `R ${price.toLocaleString('en-ZA')}`
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="p-2 text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSavedTour(!savedTour)}
                className="p-2 text-white"
              >
                <Heart className={`w-6 h-6 ${savedTour ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button className="p-2 text-white">
                <Share2 className="w-6 h-6" />
              </button>
              <button
                onClick={() => setShowInfo(true)}
                className="p-2 text-white"
              >
                <Info className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tour View */}
      {viewMode === 'tour' && (
        <div className="absolute inset-0">
          {/* Matterport 3D Tour */}
          <iframe
            src="https://my.matterport.com/show/?m=ayuqVW15yq6&play=1&qs=1"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="xr-spatial-tracking; gyroscope; accelerometer; vr; fullscreen"
          />
          
          {/* Overlay hint */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
            <p className="text-white text-sm">Tap & drag to look around • Tap circles to move</p>
          </div>
        </div>
      )}

      {/* Rooms View - Swipeable Photos */}
      {viewMode === 'rooms' && (
        <div className="absolute inset-0 bg-black">
          {/* Current Room Image */}
          <motion.div
            className="relative h-full w-full"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x
              if (swipe < -10000) {
                nextImage()
              } else if (swipe > 10000) {
                prevImage()
              }
            }}
          >
            <img
              src={currentRoom.images[currentImageIndex]}
              alt={currentRoom.name}
              className="w-full h-full object-cover"
            />
            
            {/* Room Name Overlay */}
            <div className="absolute top-20 left-0 right-0 text-center">
              <h3 className="text-white text-2xl font-bold drop-shadow-lg">{currentRoom.name}</h3>
              <p className="text-white/80 text-sm mt-1">
                Photo {currentImageIndex + 1} of {currentRoom.images.length}
              </p>
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
            <button
              onClick={prevImage}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Room Selector */}
          <div className="absolute bottom-32 left-0 right-0 z-20">
            <div className="px-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-lg">Room Gallery</h3>
                  <div className="flex items-center gap-1">
                    {currentRoom.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Room Thumbnails */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {tourRooms.map((room) => {
                    const Icon = room.icon
                    return (
                      <button
                        key={room.id}
                        onClick={() => {
                          setCurrentRoom(room)
                          setCurrentImageIndex(0)
                        }}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all flex-shrink-0 ${
                          currentRoom.id === room.id
                            ? 'bg-white text-black'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs whitespace-nowrap">{room.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 to-transparent">
        <div className="px-4 py-4">
          {/* View Mode Selector */}
          <div className="flex justify-center gap-1 mb-4">
            <button
              onClick={() => setViewMode('tour')}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                viewMode === 'tour'
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white'
              }`}
            >
              <Move3d className="w-4 h-4 inline mr-1" />
              3D Tour
            </button>
            <button
              onClick={() => setViewMode('rooms')}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                viewMode === 'rooms'
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white'
              }`}
            >
              <Camera className="w-4 h-4 inline mr-1" />
              Rooms
            </button>
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                viewMode === 'gallery'
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white'
              }`}
            >
              <Grid className="w-4 h-4 inline mr-1" />
              Gallery
            </button>
            <button
              onClick={() => setViewMode('floorplan')}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                viewMode === 'floorplan'
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-1" />
              Floor
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowSchedule(true)}
              className="flex-1 py-3 bg-white text-black rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Schedule Viewing
            </button>
            <button className="p-3 bg-indigo-600 text-white rounded-xl">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery View */}
      {viewMode === 'gallery' && (
        <div className="absolute inset-0 bg-black pt-20 pb-40 overflow-y-auto">
          <div className="px-4 py-4">
            {tourRooms.map((room) => (
              <div key={room.id} className="mb-6">
                <h3 className="text-white font-semibold mb-3">{room.name}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {room.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${room.name} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floor Plan View */}
      {viewMode === 'floorplan' && (
        <div className="absolute inset-0 bg-black pt-20 pb-40 flex items-center justify-center">
          <div className="px-4 w-full">
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold mb-3">Floor Plan</h3>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <Map className="w-12 h-12 text-gray-400" />
                <p className="text-gray-500 ml-2">Floor plan view</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{propertyData.size}m²</p>
                  <p className="text-sm text-gray-600">Living Area</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{propertyData.erf}m²</p>
                  <p className="text-sm text-gray-600">Plot Size</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 z-40"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{propertyData.title}</h2>
                  <button
                    onClick={() => setShowInfo(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 flex items-center gap-1 mb-4">
                  <MapPin className="w-4 h-4" />
                  {propertyData.location}
                </p>

                <p className="text-2xl font-bold text-indigo-600 mb-4">
                  {formatPrice(propertyData.price)}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bed className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <p className="text-lg font-semibold">{propertyData.bedrooms}</p>
                    <p className="text-xs text-gray-600">Bedrooms</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bath className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <p className="text-lg font-semibold">{propertyData.bathrooms}</p>
                    <p className="text-xs text-gray-600">Bathrooms</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Car className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <p className="text-lg font-semibold">{propertyData.parking}</p>
                    <p className="text-xs text-gray-600">Parking</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{propertyData.description}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div>
                        <p className="font-medium">{propertyData.agent}</p>
                        <p className="text-sm text-gray-600">{propertyData.agentPhone}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium">
                      Contact Agent
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Viewing Modal */}
      <AnimatePresence>
        {showSchedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 z-40"
            onClick={() => setShowSchedule(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Schedule Viewing</h2>
                  <button
                    onClick={() => setShowSchedule(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your email"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Time</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>2:00 PM</option>
                        <option>3:00 PM</option>
                        <option>4:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Message (Optional)</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      placeholder="Any specific questions or requirements?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowSchedule(false)
                    }}
                  >
                    Schedule Viewing
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}