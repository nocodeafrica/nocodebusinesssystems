# Horizon Systems

A Next.js 15 web application showcasing custom business systems for companies ready to scale. Features interactive 3D visualizations, map-based location systems, real-time demos, and mobile-optimized interfaces for various industry verticals.

## Features

- Interactive 3D models and visualizations
- Real-time map-based location systems
- Industry-specific demo carousels (Real Estate, Recruitment, Healthcare, Hospitality, etc.)
- Mobile-first responsive design
- Supabase backend integration
- TypeScript throughout
- Tailwind CSS styling

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Maps**: Mapbox GL
- **3D Rendering**: React Three Fiber, Google Model Viewer
- **Animation**: Framer Motion
- **Charts**: Recharts

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Mapbox account

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd horizon-systems
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://sjbvvrjxsbqrgtpgdxwr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key_here
SUPABASE_SECRET_KEY=your_secret_key_here

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here

# OpenAI (Optional)
OPENAI_API_KEY=your_key_here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run upload-models        # Upload 3D models to Supabase
npm run upload-remaining     # Upload remaining models
```

## Project Structure

```
horizon-systems/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   └── api/                 # API routes
├── components/              # React components
│   ├── mobile/             # Mobile-optimized components
│   ├── recruitment-demos/  # Recruitment system demos
│   ├── real-estate/        # Real estate system demos
│   └── location-demos/     # Map-based demos
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and configs
│   ├── supabase.ts         # Supabase client
│   └── models.ts           # 3D model management
├── data/                    # Static data
├── public/                  # Static assets
│   ├── models/             # 3D models (GLB/GLTF)
│   └── data/               # GeoJSON data
├── planning/                # Project documentation
└── scripts/                 # Utility scripts
```

## Key Features

### Industry Carousels

Each industry has dedicated carousel components showcasing multiple interactive demos:
- Analytics Systems
- Education Systems
- Healthcare Systems
- Recruitment Systems
- Real Estate Systems
- And more...

### Mobile Optimization

Hybrid approach with separate mobile components for complex interfaces:
- Touch-first interactions
- Bottom sheet navigation
- Simplified visualizations
- Performance optimizations

### 3D Model Integration

Two rendering approaches:
- `@google/model-viewer` for simple AR/3D views
- `@react-three/fiber` for complex interactive scenes
- DRACO compression support

### Map-Based Systems

Interactive location systems using Mapbox:
- Fleet tracking
- Store analytics
- Real estate heat maps
- Voting station maps

## Configuration

### TypeScript

Path aliases configured in `tsconfig.json`:

```typescript
import Component from '@/components/Component'
```

### Tailwind CSS

Custom design tokens and mobile utilities in `tailwind.config.js`.

### Supabase

Configuration in `supabase/config.toml` and helpers in `lib/supabase.ts`.

## Development Guidelines

See `CLAUDE.md` for detailed development guidelines and patterns.

See `MOBILE_STRATEGY.md` for mobile development strategy.

See `SUPABASE_AUTH_SETUP.md` for authentication setup.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Build

```bash
npm run build
npm start
```

## Contributing

See `CONTRIBUTING.md` for contribution guidelines.

## License

Proprietary - All rights reserved

## Support

For issues or questions, please contact the development team.
