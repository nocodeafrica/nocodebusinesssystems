'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
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
  Tv,
  Dumbbell,
  Square,
  X,
  Grid,
  Fullscreen
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
  description: 'Magnificent villa with panoramic mountain views in the heart of Constantia wine valley'
}

// Real property images from Unsplash - Properly categorized
const propertyImages = {
  exterior: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200', // Modern house exterior
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', // Luxury villa exterior
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'  // Beautiful house exterior
  ],
  livingRoom: [
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200', // Modern living room
    'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1200', // Spacious living room
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200'  // Elegant living room
  ],
  kitchen: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200', // Modern kitchen
    'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200', // Clean kitchen design
    'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=1200'  // Luxury kitchen
  ],
  bedroom: [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200', // Master bedroom
    'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=1200', // Modern bedroom
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200'  // Hotel-style bedroom
  ],
  bathroom: [
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200', // Modern bathroom
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200', // Luxury bathroom
    'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=1200'  // Clean bathroom design
  ],
  pool: [
    'https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=1200', // Pool area
    'https://images.unsplash.com/photo-1572331165267-854da2b021fd?w=1200', // Swimming pool
    'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=1200'  // Pool with loungers
  ]
}

// Tour rooms
const tourRooms = [
  { id: 1, name: 'Exterior', icon: Home, images: propertyImages.exterior, hotspots: 3 },
  { id: 2, name: 'Living Room', icon: Sofa, images: propertyImages.livingRoom, hotspots: 4 },
  { id: 3, name: 'Kitchen', icon: ChefHat, images: propertyImages.kitchen, hotspots: 5 },
  { id: 4, name: 'Master Bedroom', icon: Bed, images: propertyImages.bedroom, hotspots: 3 },
  { id: 5, name: 'Master Bathroom', icon: Bath, images: propertyImages.bathroom, hotspots: 2 },
  { id: 6, name: 'Pool Area', icon: Trees, images: propertyImages.pool, hotspots: 4 }
]

// Floor plan images - Using actual floor plan style images
const floorPlanImages = {
  ground: 'https://images.unsplash.com/photo-1586281010691-f9da4be5b1f7?w=800', // Blueprint style floor plan
  first: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'   // Architectural drawing
}

// Video URL (sample property video)
const propertyVideoUrl = 'https://www.youtube.com/embed/zumJJUL_ruM'

const VirtualPropertyTourV2 = () => {
  const [currentRoom, setCurrentRoom] = useState(tourRooms[0])
  const [viewMode, setViewMode] = useState<'photos' | 'video' | 'floorplan' | '360' | 'schedule'>('360')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedFloor, setSelectedFloor] = useState<'ground' | 'first'>('ground')
  const [savedTour, setSavedTour] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState('')
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  })

  const navigateRoom = (direction: 'prev' | 'next') => {
    const currentIndex = tourRooms.findIndex(r => r.id === currentRoom.id)
    if (direction === 'next' && currentIndex < tourRooms.length - 1) {
      setCurrentRoom(tourRooms[currentIndex + 1])
      setCurrentImageIndex(0)
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentRoom(tourRooms[currentIndex - 1])
      setCurrentImageIndex(0)
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

  const openImageModal = (image: string) => {
    setModalImage(image)
    setShowImageModal(true)
  }

  return (
    <div className="bg-white rounded-3xl p-6 min-h-[700px] border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{propertyData.title}</h2>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {propertyData.location}
            </span>
            <span className="text-indigo-600 font-semibold">
              R {propertyData.price.toLocaleString('en-ZA')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSavedTour(!savedTour)}
            className={`p-2 rounded-lg transition-colors ${
              savedTour ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${savedTour ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Tour View */}
        <div className="col-span-9">
          {/* View Mode Tabs */}
          <div className="flex items-center gap-2 mb-4">
            {[
              { mode: 'photos', label: 'Photos', icon: Camera },
              { mode: 'video', label: 'Video Tour', icon: Play },
              { mode: 'floorplan', label: 'Floor Plan', icon: Layers },
              { mode: '360', label: '360° View', icon: Move3d },
              { mode: 'schedule', label: 'Schedule Viewing', icon: Calendar }
            ].map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  viewMode === mode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Tour Container */}
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden" style={{ height: '500px' }}>
            {viewMode === 'photos' && (
              <>
                {/* Main Image Display */}
                <div className="relative h-full">
                  <img
                    src={currentRoom.images[currentImageIndex]}
                    alt={`${currentRoom.name} - View ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openImageModal(currentRoom.images[currentImageIndex])}
                  />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Room Info Overlay */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="font-semibold text-gray-900">{currentRoom.name}</p>
                    <p className="text-sm text-gray-600">
                      Photo {currentImageIndex + 1} of {currentRoom.images.length}
                    </p>
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={() => openImageModal(currentRoom.images[currentImageIndex])}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                  >
                    <Fullscreen className="w-5 h-5" />
                  </button>

                  {/* Thumbnail Strip */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                    {currentRoom.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? 'border-indigo-500' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {viewMode === 'video' && (
              <div className="w-full h-full">
                <iframe
                  src={propertyVideoUrl}
                  title="Property Video Tour"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {viewMode === 'floorplan' && (
              <div className="w-full h-full p-8 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Floor Plans</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedFloor('ground')}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        selectedFloor === 'ground'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Ground Floor
                    </button>
                    <button
                      onClick={() => setSelectedFloor('first')}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        selectedFloor === 'first'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      First Floor
                    </button>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-xl h-[380px] flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedFloor === 'ground' ? floorPlanImages.ground : floorPlanImages.first}
                    alt={`${selectedFloor} floor plan`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}

            {viewMode === '360' && (
              <div className="w-full h-full relative overflow-hidden">
                {/* Using working Matterport tour */}
                <iframe
                  src="https://my.matterport.com/show/?m=ayuqVW15yq6&play=1"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  allow="xr-spatial-tracking; gyroscope; accelerometer; vr; fullscreen"
                  className="rounded-xl"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="font-semibold text-gray-900">360° Virtual Tour</p>
                  <p className="text-sm text-gray-600">Click and drag to look around</p>
                </div>
              </div>
            )}

            {viewMode === 'schedule' && (
              <div className="w-full h-full p-8 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule a Property Viewing</h3>
                <div className="max-w-2xl mx-auto">
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={scheduleForm.name}
                          onChange={(e) => setScheduleForm({...scheduleForm, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          value={scheduleForm.email}
                          onChange={(e) => setScheduleForm({...scheduleForm, email: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          value={scheduleForm.phone}
                          onChange={(e) => setScheduleForm({...scheduleForm, phone: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="+27 82 555 0123"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                        <input
                          type="date"
                          value={scheduleForm.date}
                          onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                      <select
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a time</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">01:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="17:00">05:00 PM</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                      <textarea
                        value={scheduleForm.message}
                        onChange={(e) => setScheduleForm({...scheduleForm, message: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={4}
                        placeholder="Any specific requirements or questions?"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-sm text-gray-500">* Required fields</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          alert('Viewing request submitted! We will contact you shortly.')
                        }}
                      >
                        Submit Request
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Property Quick Stats */}
          <div className="grid grid-cols-5 gap-4 mt-4">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Bed className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <p className="text-lg font-semibold text-gray-900">{propertyData.bedrooms}</p>
              <p className="text-xs text-gray-500">Bedrooms</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Bath className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <p className="text-lg font-semibold text-gray-900">{propertyData.bathrooms}</p>
              <p className="text-xs text-gray-500">Bathrooms</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Car className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <p className="text-lg font-semibold text-gray-900">{propertyData.parking}</p>
              <p className="text-xs text-gray-500">Parking</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Square className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <p className="text-lg font-semibold text-gray-900">{propertyData.size}m²</p>
              <p className="text-xs text-gray-500">House</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Trees className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <p className="text-lg font-semibold text-gray-900">{propertyData.erf}m²</p>
              <p className="text-xs text-gray-500">Erf Size</p>
            </div>
          </div>
        </div>

        {/* Sidebar - Room Navigation */}
        <div className="col-span-3 space-y-4">
          {/* Room List */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Tour Navigation</h3>
            <div className="space-y-2">
              {tourRooms.map((room) => (
                <motion.div
                  key={room.id}
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    setCurrentRoom(room)
                    setCurrentImageIndex(0)
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    currentRoom.id === room.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <room.icon className="w-5 h-5" />
                    <span className="font-medium">{room.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs opacity-70">{room.images.length} photos</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">All Photos</h3>
            <div className="grid grid-cols-3 gap-2">
              {currentRoom.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index)
                    setViewMode('photos')
                  }}
                  className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Contact Agent */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">Our agent is available for a live guided tour</p>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Agent
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={modalImage}
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VirtualPropertyTourV2