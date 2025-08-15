'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search,
  Filter,
  Grid3x3,
  Grid2x2,
  List,
  Plus,
  Heart,
  ShoppingCart,
  Star,
  TrendingUp,
  ChevronDown,
  X,
  Package,
  Sparkles,
  Zap,
  Shield,
  Award,
  Clock,
  Truck,
  ArrowUpDown,
  SlidersHorizontal,
  Eye,
  BarChart3,
  DollarSign,
  Palette,
  Ruler,
  Tag,
  Minus,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  ArrowRight,
  ShoppingBag,
  User,
  Lock
} from 'lucide-react'

// Enhanced product data
const products = [
  {
    id: 'PRD-001',
    sku: 'WBH-ELITE-001',
    name: 'Elite Wireless Headphones',
    tagline: 'Premium Sound Experience',
    category: 'Audio',
    subcategory: 'Headphones',
    brand: 'SoundMaster Pro',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop'
    ],
    colors: ['Midnight Black', 'Pearl White', 'Ocean Blue', 'Rose Gold'],
    sizes: null,
    stock: 156,
    rating: 4.8,
    reviews: 1234,
    sold: 3421,
    features: ['Noise Cancellation', '40hr Battery', 'Premium Leather', 'Hi-Res Audio'],
    badges: ['bestseller', 'premium'],
    availability: 'in-stock',
    shipping: 'free',
    returnPolicy: '30 days',
    warranty: '2 years'
  },
  {
    id: 'PRD-002',
    sku: 'SWT-ULTRA-002',
    name: 'UltraFit Smart Watch',
    tagline: 'Your Health Companion',
    category: 'Wearables',
    subcategory: 'Smart Watches',
    brand: 'FitTech Industries',
    price: 449.99,
    originalPrice: 549.99,
    discount: 18,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop'
    ],
    colors: ['Space Gray', 'Silver', 'Gold', 'Blue'],
    sizes: ['38mm', '42mm', '45mm'],
    stock: 89,
    rating: 4.7,
    reviews: 892,
    sold: 2156,
    features: ['GPS Tracking', 'Heart Monitor', 'Sleep Analysis', 'Water Resistant'],
    badges: ['new-arrival', 'trending'],
    availability: 'in-stock',
    shipping: 'express',
    returnPolicy: '45 days',
    warranty: '1 year'
  },
  {
    id: 'PRD-003',
    sku: 'LAP-PRO-003',
    name: 'ProBook X1 Laptop',
    tagline: 'Power Meets Portability',
    category: 'Computers',
    subcategory: 'Laptops',
    brand: 'TechVision',
    price: 1299.99,
    originalPrice: 1499.99,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop'
    ],
    colors: ['Silver', 'Space Black'],
    sizes: ['13"', '15"', '17"'],
    stock: 45,
    rating: 4.9,
    reviews: 567,
    sold: 892,
    features: ['Intel i7', '16GB RAM', '512GB SSD', '4K Display'],
    badges: ['editor-choice', 'premium'],
    availability: 'in-stock',
    shipping: 'free',
    returnPolicy: '14 days',
    warranty: '3 years'
  },
  {
    id: 'PRD-004',
    sku: 'CAM-MIRR-004',
    name: 'MirrorLess Pro Camera',
    tagline: 'Capture Every Moment',
    category: 'Photography',
    subcategory: 'Cameras',
    brand: 'PhotoMaster',
    price: 2199.99,
    originalPrice: 2499.99,
    discount: 12,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop'
    ],
    colors: ['Black', 'Silver'],
    sizes: null,
    stock: 23,
    rating: 4.9,
    reviews: 234,
    sold: 456,
    features: ['45MP Sensor', '8K Video', 'In-body Stabilization', 'Dual Card Slots'],
    badges: ['professional', 'limited-edition'],
    availability: 'low-stock',
    shipping: 'standard',
    returnPolicy: '30 days',
    warranty: '2 years'
  },
  {
    id: 'PRD-005',
    sku: 'SPK-BASS-005',
    name: 'BassMaster Speaker',
    tagline: 'Feel the Beat',
    category: 'Audio',
    subcategory: 'Speakers',
    brand: 'SoundWave',
    price: 179.99,
    originalPrice: 229.99,
    discount: 22,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop'
    ],
    colors: ['Jet Black', 'Arctic White', 'Forest Green', 'Sunset Orange'],
    sizes: null,
    stock: 234,
    rating: 4.6,
    reviews: 1567,
    sold: 4321,
    features: ['360° Sound', 'Waterproof', '24hr Battery', 'Party Mode'],
    badges: ['bestseller'],
    availability: 'in-stock',
    shipping: 'free',
    returnPolicy: '30 days',
    warranty: '1 year'
  },
  {
    id: 'PRD-006',
    sku: 'TAB-SLIM-006',
    name: 'SlimTab Pro',
    tagline: 'Creativity Unleashed',
    category: 'Tablets',
    subcategory: 'Pro Tablets',
    brand: 'DigitalCraft',
    price: 899.99,
    originalPrice: 999.99,
    discount: 10,
    images: [
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop'
    ],
    colors: ['Space Gray', 'Silver', 'Gold'],
    sizes: ['11"', '12.9"'],
    stock: 67,
    rating: 4.7,
    reviews: 789,
    sold: 1890,
    features: ['M2 Chip', 'ProMotion Display', 'Face ID', 'All-day Battery'],
    badges: ['new-arrival'],
    availability: 'in-stock',
    shipping: 'express',
    returnPolicy: '14 days',
    warranty: '1 year'
  },
  {
    id: 'PRD-007',
    sku: 'PHN-FLAG-007',
    name: 'Flagship Phone X',
    tagline: 'Future in Your Hands',
    category: 'Phones',
    subcategory: 'Smartphones',
    brand: 'MobileTech',
    price: 999.99,
    originalPrice: 1199.99,
    discount: 17,
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop'
    ],
    colors: ['Phantom Black', 'Mystic White', 'Deep Purple', 'Forest Green'],
    sizes: ['128GB', '256GB', '512GB', '1TB'],
    stock: 198,
    rating: 4.8,
    reviews: 2345,
    sold: 6789,
    features: ['5G', 'Triple Camera', 'Ceramic Shield', 'Wireless Charging'],
    badges: ['flagship', 'bestseller'],
    availability: 'in-stock',
    shipping: 'free',
    returnPolicy: '30 days',
    warranty: '2 years'
  },
  {
    id: 'PRD-008',
    sku: 'KBD-MECH-008',
    name: 'MechPro Keyboard',
    tagline: 'Type Like a Pro',
    category: 'Accessories',
    subcategory: 'Keyboards',
    brand: 'KeyMaster',
    price: 149.99,
    originalPrice: 179.99,
    discount: 17,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop'
    ],
    colors: ['Black', 'White', 'RGB'],
    sizes: ['TKL', 'Full Size', '60%'],
    stock: 145,
    rating: 4.7,
    reviews: 892,
    sold: 2134,
    features: ['Cherry MX Switches', 'RGB Backlight', 'USB-C', 'Hot-swappable'],
    badges: ['gaming'],
    availability: 'in-stock',
    shipping: 'standard',
    returnPolicy: '30 days',
    warranty: '2 years'
  },
  {
    id: 'PRD-009',
    sku: 'MSE-GAM-009',
    name: 'Gaming Mouse Pro',
    tagline: 'Precision Gaming',
    category: 'Accessories',
    subcategory: 'Mice',
    brand: 'GameTech',
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop'
    ],
    colors: ['Black', 'White'],
    sizes: null,
    stock: 201,
    rating: 4.6,
    reviews: 1123,
    sold: 3456,
    features: ['16000 DPI', 'RGB Lighting', 'Programmable Buttons', 'Ergonomic'],
    badges: ['gaming', 'popular'],
    availability: 'in-stock',
    shipping: 'free',
    returnPolicy: '30 days',
    warranty: '2 years'
  },
  {
    id: 'PRD-010',
    sku: 'MON-4K-010',
    name: '4K Ultra Monitor',
    tagline: 'Crystal Clear Display',
    category: 'Monitors',
    subcategory: 'Professional',
    brand: 'ViewMaster',
    price: 599.99,
    originalPrice: 799.99,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop'
    ],
    colors: ['Black', 'Silver'],
    sizes: ['27"', '32"'],
    stock: 34,
    rating: 4.8,
    reviews: 456,
    sold: 789,
    features: ['4K Resolution', 'HDR10', '144Hz', 'USB-C Hub'],
    badges: ['professional', 'sale'],
    availability: 'in-stock',
    shipping: 'free',
    returnPolicy: '30 days',
    warranty: '3 years'
  },
  {
    id: 'PRD-011',
    sku: 'WEB-CAM-011',
    name: 'HD Webcam Pro',
    tagline: 'Professional Video Calls',
    category: 'Accessories',
    subcategory: 'Webcams',
    brand: 'StreamTech',
    price: 129.99,
    originalPrice: 149.99,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&h=800&fit=crop'
    ],
    colors: ['Black'],
    sizes: null,
    stock: 178,
    rating: 4.5,
    reviews: 678,
    sold: 1234,
    features: ['1080p 60fps', 'Auto Focus', 'Noise Cancellation', 'Wide Angle'],
    badges: ['work-from-home'],
    availability: 'in-stock',
    shipping: 'express',
    returnPolicy: '30 days',
    warranty: '1 year'
  },
  {
    id: 'PRD-012',
    sku: 'CHR-WLS-012',
    name: 'Wireless Charger Pad',
    tagline: 'Effortless Charging',
    category: 'Accessories',
    subcategory: 'Chargers',
    brand: 'PowerTech',
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    images: [
      'https://images.unsplash.com/photo-1591290619762-6fde95255e95?w=800&h=800&fit=crop'
    ],
    colors: ['Black', 'White', 'Blue'],
    sizes: null,
    stock: 412,
    rating: 4.4,
    reviews: 2341,
    sold: 5678,
    features: ['Fast Charging', 'Multiple Devices', 'LED Indicator', 'Compact'],
    badges: ['bestseller'],
    availability: 'in-stock',
    shipping: 'free',
    returnPolicy: '30 days',
    warranty: '1 year'
  }
]

// Filter options
const categories = ['All', 'Audio', 'Wearables', 'Computers', 'Photography', 'Tablets', 'Phones', 'Accessories', 'Monitors']
const brands = ['All Brands', 'SoundMaster Pro', 'FitTech Industries', 'TechVision', 'PhotoMaster', 'SoundWave', 'DigitalCraft', 'MobileTech', 'KeyMaster', 'GameTech', 'ViewMaster', 'StreamTech', 'PowerTech']
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $200', min: 0, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: '$1000 - $2000', min: 1000, max: 2000 },
  { label: 'Over $2000', min: 2000, max: Infinity }
]
const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Best Selling', value: 'bestselling' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Top Rated', value: 'rating' }
]

interface CartItem {
  product: typeof products[0]
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

const ModernProductCatalogV2 = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All Brands')
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid-large' | 'grid-small' | 'list'>('grid-small') // Changed default
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  // Checkout form state
  const [checkoutForm, setCheckoutForm] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: ''
  })

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesBrand = selectedBrand === 'All Brands' || product.brand === selectedBrand
    const matchesPrice = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesBrand && matchesPrice && matchesSearch
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'bestselling':
        return b.sold - a.sold
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.id < a.id ? -1 : 1
      default:
        return 0
    }
  })

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, {
        product,
        quantity: 1,
        selectedColor: product.colors?.[0],
        selectedSize: product.sizes?.[0]
      }]
    })
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId))
    } else {
      setCart(prev => prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    setShowCart(false)
    setShowCheckout(true)
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock payment processing
    setTimeout(() => {
      setShowCheckout(false)
      setOrderComplete(true)
      setCart([])
      setTimeout(() => setOrderComplete(false), 5000)
    }, 2000)
  }

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'bestseller':
        return <TrendingUp className="w-3 h-3" />
      case 'new-arrival':
        return <Sparkles className="w-3 h-3" />
      case 'premium':
        return <Award className="w-3 h-3" />
      case 'limited-edition':
        return <Zap className="w-3 h-3" />
      case 'editor-choice':
        return <Star className="w-3 h-3" />
      default:
        return null
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'bestseller':
        return 'bg-gradient-to-r from-orange-500 to-red-500'
      case 'new-arrival':
        return 'bg-gradient-to-r from-blue-500 to-purple-500'
      case 'premium':
        return 'bg-gradient-to-r from-gray-700 to-gray-900'
      case 'limited-edition':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500'
      case 'sale':
        return 'bg-gradient-to-r from-red-500 to-pink-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="bg-gray-50 rounded-3xl overflow-hidden relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Product Catalog</h2>
            <p className="text-sm text-gray-500 mt-1">
              {sortedProducts.length} products found
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="relative p-2 sm:p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              <Heart className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 sm:p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm sm:text-base font-medium hover:shadow-lg transition-all flex-1 sm:flex-initial justify-center">
              <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-200 transition-colors flex-1 sm:flex-initial justify-center"
            >
              <SlidersHorizontal className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">Filters</span>
              {(selectedCategory !== 'All' || selectedBrand !== 'All Brands' || selectedPriceRange.label !== 'All Prices') && (
                <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {selectedCategory !== 'All' || selectedBrand !== 'All Brands' || selectedPriceRange.label !== 'All Prices' ? 'Active' : ''}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid-small')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid-small' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Small Grid"
              >
                <Grid3x3 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setViewMode('grid-large')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid-large' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Large Grid"
              >
                <Grid2x2 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="List View"
              >
                <List className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 rounded-xl text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-initial"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Category</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedCategory === category
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Brand</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {brands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedBrand === brand
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Price Range</label>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange(range)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedPriceRange.label === range.label
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Filters */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Quick Filters</label>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Free Shipping
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      On Sale
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      4+ Stars
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      New Arrivals
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedCategory('All')
                    setSelectedBrand('All Brands')
                    setSelectedPriceRange(priceRanges[0])
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className={`grid gap-4 sm:gap-6 ${
          viewMode === 'grid-large' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
          viewMode === 'grid-small' ? 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4' :
          'grid-cols-1'
        }`}>
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="group"
            >
              {viewMode !== 'list' ? (
                // Grid View
                <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all group">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4">
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-full py-2 bg-white/90 backdrop-blur text-gray-900 font-medium rounded-lg hover:bg-white transition-colors"
                        >
                          Quick Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.discount > 0 && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                          -{product.discount}%
                        </span>
                      )}
                      {viewMode === 'grid-large' && product.badges.slice(0, 2).map(badge => (
                        <span
                          key={badge}
                          className={`px-2 py-1 text-xs font-medium text-white rounded-lg flex items-center gap-1 ${getBadgeColor(badge)}`}
                        >
                          {getBadgeIcon(badge)}
                          {badge.replace('-', ' ')}
                        </span>
                      ))}
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
                        wishlist.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 backdrop-blur text-gray-700 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className={`${viewMode === 'grid-small' ? 'p-4' : 'p-5'}`}>
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                      <h3 className={`font-bold text-gray-900 line-clamp-1 ${
                        viewMode === 'grid-large' ? 'text-lg' : 'text-base'
                      }`}>
                        {product.name}
                      </h3>
                      {viewMode === 'grid-large' && (
                        <p className="text-sm text-gray-600 line-clamp-1 mt-1">{product.tagline}</p>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={`font-bold text-gray-900 ${
                          viewMode === 'grid-large' ? 'text-xl' : 'text-lg'
                        }`}>
                          ${product.price.toFixed(2)}
                        </p>
                        {product.originalPrice > product.price && (
                          <p className="text-xs text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                      {viewMode === 'grid-large' && (
                        <span className={`text-xs font-medium ${
                          product.availability === 'in-stock' ? 'text-green-600' :
                          product.availability === 'low-stock' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {product.stock} left
                        </span>
                      )}
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={() => addToCart(product)}
                      className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        cart.some(item => item.product.id === product.id)
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {cart.some(item => item.product.id === product.id) ? 'In Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ) : (
                // List View
                <div className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all flex gap-6">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{product.brand} • {product.category}</p>
                        <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.tagline}</p>
                      </div>
                      <div className="flex gap-2">
                        {product.badges.map(badge => (
                          <span
                            key={badge}
                            className={`px-2 py-1 text-xs font-medium text-white rounded-full flex items-center gap-1 ${getBadgeColor(badge)}`}
                          >
                            {getBadgeIcon(badge)}
                            {badge.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {product.sold.toLocaleString()} sold
                      </span>
                      <span className={`text-sm font-medium ${
                        product.availability === 'in-stock' ? 'text-green-600' :
                        product.availability === 'low-stock' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.originalPrice > product.price && (
                        <p className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-2 rounded-lg transition-all ${
                          wishlist.includes(product.id)
                            ? 'bg-red-50 text-red-500'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          cart.some(item => item.product.id === product.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {cart.some(item => item.product.id === product.id) ? 'In Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Shopping Cart</h3>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{cartItemsCount} items</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <button
                      onClick={() => setShowCart(false)}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.product.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                            <p className="text-sm text-gray-500">{item.product.brand}</p>
                            {item.selectedColor && (
                              <p className="text-xs text-gray-500 mt-1">Color: {item.selectedColor}</p>
                            )}
                            {item.selectedSize && (
                              <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 bg-white rounded font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, 0)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-6">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 sm:p-8"
              onClick={() => setShowCheckout(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Checkout</h3>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handlePayment} className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Shipping Address</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Address</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="123 Main Street"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">City</label>
                            <input
                              type="text"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="New York"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">ZIP Code</label>
                            <input
                              type="text"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="10001"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Payment Information</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Card Number</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="4242 4242 4242 4242"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">CVV</label>
                            <input
                              type="text"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-6">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal ({cartItemsCount} items)</span>
                          <span className="font-medium">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shipping</span>
                          <span className="font-medium text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tax</span>
                          <span className="font-medium">${(cartTotal * 0.08).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                          <span>Total</span>
                          <span>${(cartTotal * 1.08).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      Complete Order
                    </button>

                    <p className="text-xs text-center text-gray-500">
                      This is a demo checkout. No real payment will be processed.
                    </p>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Order Complete Notification */}
      <AnimatePresence>
        {orderComplete && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Order Placed Successfully!</p>
              <p className="text-sm opacity-90">Thank you for your purchase</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ModernProductCatalogV2