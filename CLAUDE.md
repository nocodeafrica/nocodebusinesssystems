# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Horizon Systems is a Next.js 15 web application showcasing custom business systems for companies ready to scale. The application features interactive 3D visualizations, map-based location systems, real-time demos, and mobile-optimized interfaces for various industry verticals (real estate, recruitment, healthcare, hospitality, etc.).

**Key Characteristics:**
- B2B SaaS marketing website with interactive product demos
- Mobile-first responsive design with dedicated mobile components
- Heavy use of 3D models (GLTF/GLB), maps (Mapbox), and data visualizations
- Integration with Supabase for backend services and 3D model storage
- TypeScript/React with modern Next.js App Router architecture

## Development Commands

```bash
# Development
npm run dev                    # Start dev server on http://localhost:3000

# Production
npm run build                  # Build for production
npm start                      # Start production server
npm run lint                   # Run ESLint

# Model Management (Supabase Storage)
npm run upload-models          # Upload 3D models to Supabase
npm run upload-remaining       # Upload remaining models
```

## Project Structure

```
horizon-systems/
├── app/                       # Next.js 15 App Router
│   ├── page.tsx              # Landing page (composed of section components)
│   ├── layout.tsx            # Root layout with fonts and metadata
│   ├── globals.css           # Global Tailwind styles
│   └── api/                  # API routes (Edge functions)
├── components/               # React components
│   ├── *Carousel.tsx         # Industry-specific carousels
│   ├── mobile/               # Mobile-optimized components
│   ├── recruitment-demos/    # Recruitment system demos
│   ├── real-estate/          # Real estate system demos
│   └── location-demos/       # Location/map-based demos
├── hooks/                    # Custom React hooks (shared business logic)
├── lib/                      # Utilities and configurations
│   ├── supabase.ts          # Supabase client with auth helpers
│   └── models.ts            # 3D model management
├── data/                     # Static data (South African geo data)
├── public/                   # Static assets
│   ├── models/              # 3D models (GLB/GLTF files)
│   └── data/                # GeoJSON and location data
├── planning/                 # Project planning and documentation
└── scripts/                  # Utility scripts for model uploads
```

## Key Technologies

- **Next.js 15** (App Router) - React framework with server components
- **TypeScript** - Type safety across the application
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend services, authentication, and storage
  - Project ID: `sjbvvrjxsbqrgtpgdxwr`
- **Mapbox GL** - Interactive maps for location systems
- **React Three Fiber** - 3D rendering with Three.js
- **Google Model Viewer** - Alternative 3D model display
- **Framer Motion** - Animation library
- **Recharts** - Data visualization charts
- **Lucide React** - Icon library

## Architecture Patterns

### Component Organization

**Industry Carousels** - Each industry has a dedicated carousel component:
- `AnalyticsSystemsCarousel.tsx`, `EducationSystemsCarousel.tsx`, etc.
- Each carousel switches between multiple interactive demos
- Demos are in subdirectories: `components/recruitment-demos/`, `components/real-estate/`, etc.

**Mobile Strategy** - Hybrid approach with separate mobile versions for complex components:
- Desktop: Complex interactions, full data density, mouse/keyboard optimized
- Mobile: Touch-first, bottom sheets, simplified visualizations
- Shared business logic extracted to hooks in `/hooks` directory
- Dynamic loading based on device detection (see `MOBILE_STRATEGY.md`)

**3D Model Architecture:**
- Models stored in Supabase Storage bucket
- Local copies in `public/models/` for development
- Two rendering approaches:
  - `@google/model-viewer` for simple AR/3D views
  - `@react-three/fiber` for complex interactive 3D scenes
- DRACO compression support configured in `next.config.ts`

### Data Flow

1. **Static Data**: South African geo data (provinces, municipalities, wards, voting stations) in `public/data/` and `data/` directories
2. **Dynamic Data**: Generated mock data for demos (warehouses, properties, applicants) via custom hooks
3. **External APIs**: Mapbox for maps, Supabase for models/storage
4. **Real-time**: Supabase realtime subscriptions available via `lib/supabase.ts`

### Routing Structure

- **App Router** - All routes in `app/` directory
- **Main landing page** - `app/page.tsx` (composed of section components)
- **Legal pages** - `/privacy`, `/terms`, `/cookies`, `/data-protection`
- **API routes** - `app/api/*` for backend functionality

## Environment Configuration

Required environment variables (`.env.local`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://sjbvvrjxsbqrgtpgdxwr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
SUPABASE_SECRET_KEY=your_secret_key_here

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# Optional
OPENAI_API_KEY=your_openai_key_here  # For AI features
```

## Mobile Development Guidelines

This project follows a **hybrid mobile strategy** (see `MOBILE_STRATEGY.md`):

### Components Requiring Separate Mobile Versions
- Complex map interfaces (fleet tracking, store analytics, real estate heat maps)
- 3D model viewers (property tours, product visualizations)
- Complex dashboards (hospital operations, warehouse management)

### Components Using Responsive Refactoring
- Navigation and layout components
- Content sections (FAQ, team, pricing)
- Simple interactive elements (buttons, forms, carousels)

### Mobile Component Pattern
```
/components/feature-name/
  Desktop.tsx        # Desktop version
  Mobile.tsx         # Mobile version
  index.tsx         # Smart loader with device detection
  shared.ts         # Shared business logic
```

### Mobile-Specific Components (`components/mobile/`)
- `MobileBottomSheet` - Swipeable content overlay for maps
- `MobileFilterBar` - Touch-optimized filters
- `MobileMapControls` - Floating map controls
- `MobileInfoCard` - Compact information display
- `MobileTabNav` - Touch-friendly tab navigation
- `TouchInteractionPatterns` - Gesture hooks (swipe, long press, double tap)
- `PerformanceOptimizations` - Virtual scroll, lazy loading, debouncing

## Supabase Integration

Authentication and database helpers are in `lib/supabase.ts`:

```typescript
import { auth, db, supabase } from '@/lib/supabase'

// Authentication
await auth.signUp(email, password)
await auth.signIn(email, password)
const { user } = await auth.getUser()

// Database
const { data } = await db.from('table_name').select('*')

// Storage
const url = db.storage.getPublicUrl('bucket', 'path/to/file')
```

See `SUPABASE_AUTH_SETUP.md` for detailed authentication setup.

## Performance Considerations

1. **3D Models**: Use DRACO compression, lazy load with dynamic imports
2. **Maps**: Virtualize markers for large datasets, debounce user interactions
3. **Mobile**:
   - Max 200KB JS bundle (gzipped) for mobile components
   - Virtual scrolling for long lists
   - Progressive image loading
   - Simplified animations on mobile
4. **Code Splitting**: Dynamic imports for heavy components (3D viewers, maps)
5. **Bundle Optimization**: `transpilePackages: ['three']` in next.config.ts

## Testing Considerations

- Test mobile components on actual devices (iOS Safari, Android Chrome)
- Verify 44px minimum touch targets on mobile
- Test map performance with large datasets (1000+ markers)
- Validate 3D model loading across devices
- Check responsive breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

## Important Files

- `app/page.tsx` - Main landing page composition
- `lib/supabase.ts` - Backend integration layer
- `next.config.ts` - Webpack config for 3D models and DRACO
- `tailwind.config.js` - Design system tokens
- `components/SystemsNavigationComplete.tsx` - Main product showcase navigation
- `MOBILE_STRATEGY.md` - Mobile implementation strategy
- `SUPABASE_AUTH_SETUP.md` - Authentication setup guide

## Path Aliases

TypeScript path alias configured in `tsconfig.json`:
```typescript
import Component from '@/components/Component'  // Resolves to /components/Component
```

## Common Development Tasks

### Adding a New Industry Showcase
1. Create carousel component: `components/[Industry]SystemsCarousel.tsx`
2. Create demo components in: `components/[industry]-demos/`
3. Extract shared logic to hooks in: `hooks/use[Feature]Data.ts`
4. Add mobile version if complex (maps, 3D, dashboards)
5. Import and add to `SystemsNavigationComplete.tsx`

### Adding a New 3D Model
1. Place GLB/GLTF file in `public/models/`
2. Optionally upload to Supabase: `npm run upload-models`
3. Use with ModelViewer or Three.js components
4. Ensure DRACO compression for large models

### Adding a New Map Feature
1. Create demo component in `components/location-demos/`
2. If complex, create mobile version with `MobileBottomSheet`
3. Use `react-map-gl` for Mapbox integration
4. Extract data logic to custom hook
5. Implement touch optimizations for mobile (pinch-zoom, tap clusters)

### Creating Mobile-Optimized Component
1. Analyze desktop component for mobile UX requirements
2. Extract business logic to custom hook in `/hooks`
3. Create mobile version using components from `components/mobile/`
4. Implement smart loader with device detection
5. Test on real devices (not just browser DevTools)
