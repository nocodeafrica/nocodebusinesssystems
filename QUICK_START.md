# Quick Start Guide - Horizon Systems

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm package manager
- Supabase account (free tier works)
- Mapbox account (free tier works)

## Setup (3 Steps)

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sjbvvrjxsbqrgtpgdxwr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key_here
SUPABASE_SECRET_KEY=your_secret_here
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Test production build
npm run lint             # Check code quality

# Formatting
npm run format           # Format all files
npm run lint:fix         # Fix linting issues

# Deployment
vercel --prod            # Deploy to Vercel
docker-compose up -d     # Run with Docker
```

## Project Structure

```
horizon-systems/
├── app/                 # Pages and API routes
├── components/          # React components
├── hooks/              # Custom hooks
├── lib/                # Utilities
└── public/             # Static assets
```

## Key Features

- Interactive 3D models
- Real-time maps with Mapbox
- Mobile-optimized interfaces
- Industry-specific demos
- Supabase backend

## Common Issues

**Build fails?**
```bash
npm run clean:install
```

**TypeScript errors?**
```bash
npm run type-check
```

**Environment not working?**
- Ensure `.env.local` exists
- Check variable names (client-side needs `NEXT_PUBLIC_` prefix)
- Restart dev server

## Get Help

- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide
- `CONTRIBUTING.md` - Development guidelines
- `SETUP_COMPLETE.md` - Detailed setup instructions

## Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

That's it! Happy coding! 🚀

---

**Need more help?** Check `INFRASTRUCTURE_SUMMARY.txt` for complete details.
