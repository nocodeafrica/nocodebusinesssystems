# Mobile Design System for Location Systems

A comprehensive mobile-first design system optimized for map-based interfaces and location services. This system provides reusable components, interaction patterns, and performance optimizations specifically designed for mobile location applications.

## 🎯 Overview

This mobile design system addresses the unique challenges of location-based interfaces on mobile devices:

- **Limited screen real estate** - Smart use of bottom sheets and collapsible UI
- **Touch-first interactions** - 44px minimum touch targets and gesture support
- **Performance on mobile** - Optimized rendering and virtualization
- **Map integration** - Specialized controls and overlays for map interfaces
- **Location context** - GPS-aware components and user positioning

## 📱 Design Principles

### 1. **Touch-First Design**
- Minimum 44px touch targets
- Gesture support (swipe, pinch, long press)
- Haptic feedback integration
- Visual feedback for interactions

### 2. **Progressive Disclosure**
- Bottom sheets with multiple snap points
- Expandable content sections
- Collapsible filters and controls
- Contextual information reveal

### 3. **Map-Centric Layout**
- Map occupies 60-70% of viewport
- Floating controls and overlays
- Non-intrusive UI elements
- Spatial context preservation

### 4. **Performance Optimized**
- Virtual scrolling for large lists
- Lazy loading for images and data
- Debounced user inputs
- Efficient re-rendering patterns

## 🧩 Component Library

### Core Components

#### MobileBottomSheet
A swipeable bottom sheet with multiple snap points for displaying content over maps.

```tsx
import MobileBottomSheet from './mobile/MobileBottomSheet'

<MobileBottomSheet
  isOpen={showSheet}
  onClose={() => setShowSheet(false)}
  title="Store Details"
  snapPoints={[40, 70, 90]} // Percentage heights
  defaultSnapPoint={0}
  enableSwipeDown={true}
>
  <YourContent />
</MobileBottomSheet>
```

**Features:**
- Multiple snap points (peek, mid, full)
- Swipe gesture support
- Handle indicator
- Backdrop interaction
- Smooth animations

#### MobileFilterBar
An adaptive filter interface with search and collapsible filter groups.

```tsx
import MobileFilterBar from './mobile/MobileFilterBar'

<MobileFilterBar
  filters={filterGroups}
  onFilterChange={handleFilterChange}
  onReset={handleResetFilters}
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  activeFilterCount={activeFilters.length}
/>
```

**Features:**
- Horizontal scrolling filter chips
- Expandable filter groups
- Search integration
- Active filter indicators
- Reset functionality

#### MobileMapControls
Floating map controls optimized for touch interaction.

```tsx
import MobileMapControls from './mobile/MobileMapControls'

<MobileMapControls
  onZoomIn={handleZoomIn}
  onZoomOut={handleZoomOut}
  onResetView={handleResetView}
  onLocateUser={handleLocateUser}
  layers={mapLayers}
  onLayerToggle={handleLayerToggle}
  mapStyles={availableStyles}
  onMapStyleChange={handleStyleChange}
/>
```

**Features:**
- Zoom controls
- Layer management
- Style switching
- User location
- Compass integration

#### MobileInfoCard
Versatile information cards for displaying location and business data.

```tsx
import MobileInfoCard from './mobile/MobileInfoCard'

<MobileInfoCard
  title="Business Name"
  subtitle="Category"
  image="/image.jpg"
  rating={4.8}
  reviews={1250}
  address="123 Street Name"
  status="open"
  badges={infoBadges}
  actions={cardActions}
  expandable={true}
/>
```

**Features:**
- Multiple sizes (compact, normal, large)
- Rating and review display
- Status indicators
- Action buttons
- Expandable content

#### MobileTabNav
Touch-optimized tab navigation with multiple variants.

```tsx
import MobileTabNav from './mobile/MobileTabNav'

<MobileTabNav
  tabs={navigationTabs}
  activeTab={currentTab}
  onTabChange={setCurrentTab}
  variant="underline"
  scrollable={true}
/>
```

**Features:**
- Multiple variants (pills, underline, filled)
- Badge support
- Icon integration
- Horizontal scrolling
- Responsive sizing

## 🎮 Interaction Patterns

### Touch Interactions

#### Double Tap Hook
```tsx
import { useDoubleTap } from './mobile/TouchInteractionPatterns'

const handleDoubleTap = useDoubleTap(() => {
  // Handle double tap action
  zoomToLocation()
}, 300) // 300ms delay
```

#### Long Press Hook
```tsx
import { useLongPress } from './mobile/TouchInteractionPatterns'

const longPressProps = useLongPress(
  () => console.log('Long pressed!'),
  () => console.log('Regular tap!'),
  500 // 500ms threshold
)

<div {...longPressProps}>Press and hold me</div>
```

#### Swipeable Component
```tsx
import { Swipeable } from './mobile/TouchInteractionPatterns'

<Swipeable
  onSwipeLeft={() => console.log('Swiped left!')}
  onSwipeRight={() => console.log('Swiped right!')}
  leftAction={<DeleteIcon />}
  rightAction={<FavoriteIcon />}
>
  <CardContent />
</Swipeable>
```

#### Pull to Refresh
```tsx
import { PullToRefresh } from './mobile/TouchInteractionPatterns'

<PullToRefresh
  onRefresh={async () => {
    await fetchNewData()
  }}
  threshold={80}
>
  <YourContent />
</PullToRefresh>
```

### Haptic Feedback
```tsx
import { useHapticFeedback } from './mobile/TouchInteractionPatterns'

const { triggerImpact, triggerSelection, triggerNotification } = useHapticFeedback()

// Light tap feedback
triggerImpact('light')

// Selection feedback
triggerSelection()

// Success notification
triggerNotification('success')
```

## ⚡ Performance Optimizations

### Lazy Loading Images
```tsx
import { OptimizedImage } from './mobile/PerformanceOptimizations'

<OptimizedImage
  src="/large-image.jpg"
  alt="Description"
  placeholder="/placeholder.jpg"
  blur={true}
  priority={false}
/>
```

### Virtual Scrolling
```tsx
import { VirtualScroll } from './mobile/PerformanceOptimizations'

<VirtualScroll
  items={largeDataSet}
  itemHeight={80}
  height={400}
  renderItem={(item, index) => <ListItem key={index} data={item} />}
  onEndReached={loadMoreData}
/>
```

### Debounced Inputs
```tsx
import { useDebouncedValue } from './mobile/PerformanceOptimizations'

const [searchTerm, setSearchTerm] = useState('')
const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)

useEffect(() => {
  // This will only run 300ms after the user stops typing
  performSearch(debouncedSearchTerm)
}, [debouncedSearchTerm])
```

### Performance Monitoring
```tsx
import { usePerformanceMonitor } from './mobile/PerformanceOptimizations'

const { metrics, startRender, endRender } = usePerformanceMonitor()

useEffect(() => {
  startRender()
  // Your rendering logic
  endRender()
}, [])

console.log(`Render time: ${metrics.renderTime}ms, FPS: ${metrics.fps}`)
```

## 🎨 Design Tokens

### Spacing
```css
/* Mobile-specific spacing */
mobile-padding: 16px
mobile-margin: 12px
touch-target: 44px
bottom-sheet-peek: 40vh
bottom-sheet-full: 90vh
map-min-height: 60vh
```

### Typography
```css
/* Mobile typography scale */
mobile-title: 18px / 24px, weight: 600
mobile-subtitle: 14px / 20px, weight: 500
mobile-body: 16px / 24px, weight: 400
mobile-caption: 12px / 16px, weight: 400
mobile-button: 14px / 20px, weight: 500
```

### Colors
```css
/* Status colors */
status-open: #10B981 (green)
status-closed: #EF4444 (red)
status-busy: #F59E0B (yellow)

/* Interactive colors */
primary: #007BFF (ncbs-blue)
secondary: #6B7280 (gray)
surface: #FFFFFF (white)
overlay: rgba(0, 0, 0, 0.5)
```

### Shadows
```css
mobile-card: 0 2px 8px rgba(0, 0, 0, 0.1)
mobile-bottom-sheet: 0 -4px 20px rgba(0, 0, 0, 0.15)
mobile-floating: 0 4px 12px rgba(0, 0, 0, 0.15)
mobile-pressed: inset 0 2px 4px rgba(0, 0, 0, 0.1)
```

## 📐 Layout Patterns

### Map-First Layout
```tsx
// Recommended structure for location apps
<div className="h-screen mobile-safe-area">
  {/* Fixed Header */}
  <header className="h-mobile-header bg-white border-b">
    <SearchBar />
  </header>
  
  {/* Tab Navigation */}
  <MobileTabNav />
  
  {/* Filter Bar */}
  <MobileFilterBar />
  
  {/* Map Container */}
  <div className="flex-1 relative">
    <Map />
    <MobileMapControls />
  </div>
  
  {/* Bottom Sheet */}
  <MobileBottomSheet>
    <ContentList />
  </MobileBottomSheet>
</div>
```

### Content Hierarchy
1. **Primary Action** - Most important action (directions, call)
2. **Secondary Actions** - Supporting actions (save, share)
3. **Information Display** - Details and metadata
4. **Progressive Disclosure** - Additional content

## 🔧 Usage Examples

### Complete Store Locator
See `MobileStoreLocator.tsx` for a full implementation example that demonstrates:
- Map integration with Mapbox
- GPS location services
- Bottom sheet with store list
- Filter system
- Touch-optimized markers
- Performance optimizations

### Quick Start Template
```tsx
import { useState } from 'react'
import Map from 'react-map-gl/mapbox'
import {
  MobileBottomSheet,
  MobileFilterBar,
  MobileMapControls,
  MobileInfoCard,
  MobileTabNav
} from './mobile'

const MyLocationApp = () => {
  const [showSheet, setShowSheet] = useState(true)
  const [activeTab, setActiveTab] = useState('list')
  
  return (
    <div className="h-screen mobile-safe-area">
      <MobileTabNav
        tabs={[
          { id: 'list', label: 'List' },
          { id: 'map', label: 'Map' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1 relative">
        <Map />
        <MobileMapControls
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onResetView={() => {}}
          onLocateUser={() => {}}
        />
      </div>
      
      <MobileBottomSheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
      >
        <div className="space-y-4">
          {locations.map(location => (
            <MobileInfoCard
              key={location.id}
              title={location.name}
              subtitle={location.category}
              address={location.address}
            />
          ))}
        </div>
      </MobileBottomSheet>
    </div>
  )
}
```

## 🧪 Testing Guidelines

### Touch Target Testing
- Ensure all interactive elements are at least 44px in height/width
- Test on actual devices with various screen sizes
- Verify thumb reachability in one-handed use

### Performance Testing
- Monitor render times with `usePerformanceMonitor`
- Test scrolling performance with large datasets
- Verify smooth animations at 60fps

### Accessibility Testing
- Test with screen readers
- Verify keyboard navigation
- Check color contrast ratios
- Test with voice control

## 📚 Best Practices

### Component Composition
```tsx
// ✅ Good - Compose smaller components
<MobileInfoCard
  title="Store Name"
  actions={[
    { id: 'directions', label: 'Directions', primary: true },
    { id: 'call', label: 'Call' }
  ]}
/>

// ❌ Avoid - Monolithic components
<ComplexStoreCard withDirections withCallButton withFavorites />
```

### State Management
```tsx
// ✅ Good - Local state for UI, global for data
const [isExpanded, setIsExpanded] = useState(false) // UI state
const { stores } = useStoreData() // Data state

// ❌ Avoid - Global state for everything
const { isExpanded, stores } = useGlobalState()
```

### Performance
```tsx
// ✅ Good - Memoize expensive calculations
const filteredStores = useMemo(() => 
  stores.filter(store => store.category === selectedCategory),
  [stores, selectedCategory]
)

// ❌ Avoid - Calculations in render
const filteredStores = stores.filter(store => store.category === selectedCategory)
```

## 🔄 Migration Guide

### From Desktop to Mobile
1. Replace fixed sidebars with bottom sheets
2. Convert dropdown menus to slide-up panels
3. Implement touch gestures for map interaction
4. Add haptic feedback to interactions
5. Optimize for thumb navigation zones

### Component Mapping
- `Sidebar` → `MobileBottomSheet`
- `DropdownMenu` → `MobileFilterBar`
- `TooltipPopup` → `MobileInfoCard`
- `TabPanel` → `MobileTabNav`
- `ImageGallery` → `OptimizedImage` with lazy loading

## 🔮 Future Enhancements

- **Voice Integration** - Voice search and commands
- **AR Integration** - Augmented reality overlays
- **Offline Support** - Local storage and sync
- **PWA Features** - Install prompts and notifications
- **Advanced Gestures** - Multi-touch and 3D touch support

## 📄 License

This mobile design system is part of the NCBS Location Systems platform and follows the same licensing terms as the main project.