# Supabase JWT Authentication Setup Guide

## Project Information
- **Project ID**: `sjbvvrjxsbqrgtpgdxwr`
- **Project URL**: `https://sjbvvrjxsbqrgtpgdxwr.supabase.co`

## Understanding JWT Signing Keys

Supabase has moved from legacy API keys (anon key and service role key) to JWT signing keys for enhanced security. Here's what you need to know:

### What are JWT Signing Keys?

1. **Current Key**: The active key used to sign all new JWTs
2. **Standby Key**: A backup key that can be promoted to current if needed

These keys use modern cryptographic standards (RS256 or HS256) to sign and verify JSON Web Tokens.

## Setup Instructions

### Step 1: Get Your Anon Key (JWT)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/sjbvvrjxsbqrgtpgdxwr)
2. Navigate to **Settings** → **API**
3. Under **Project API keys**, find the **anon/public** key
4. Copy this key and add it to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 2: Understanding the Keys

The anon key is actually a JWT token that's pre-signed with your project's JWT signing key. It contains:
- Claims about what operations are allowed
- Expiration information
- Role-based permissions (anon role)

### Step 3: Configure Authentication Providers (Optional)

1. Go to **Authentication** → **Providers**
2. Enable desired providers:
   - Email/Password (recommended for basic auth)
   - Google OAuth
   - GitHub OAuth
   - Microsoft Azure AD
   - LinkedIn

### Step 4: Set Up JWT Configuration

1. Go to **Settings** → **Auth**
2. Configure JWT settings:
   - **JWT Secret**: Already configured (uses your signing keys)
   - **JWT Expiry**: Set token lifetime (default: 3600 seconds)
   - **JWT Algorithm**: RS256 (recommended) or HS256

### Step 5: Configure Auth Policies

1. Go to **Authentication** → **Policies**
2. Set up Row Level Security (RLS) policies
3. Example policy for authenticated users:

```sql
-- Enable RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users
CREATE POLICY "Users can view own data" ON your_table
    FOR SELECT USING (auth.uid() = user_id);
```

## Using Authentication in Your App

### Basic Usage

```typescript
import { supabase, auth } from '@/lib/supabase'

// Sign up
const { data, error } = await auth.signUp(email, password)

// Sign in
const { data, error } = await auth.signIn(email, password)

// Sign out
await auth.signOut()

// Get current user
const { user } = await auth.getUser()

// Listen to auth changes
const { data: authListener } = auth.onAuthStateChange((event, session) => {
  console.log(event, session)
})
```

### Protected API Routes

```typescript
// app/api/protected/route.ts
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Get the authorization header
  const authorization = request.headers.get('authorization')
  
  if (!authorization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Verify the JWT token
  const token = authorization.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  
  // User is authenticated
  return NextResponse.json({ user })
}
```

### Client-Side Authentication Check

```typescript
// app/components/ProtectedRoute.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/supabase'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    checkAuth()
  }, [])
  
  async function checkAuth() {
    const { user } = await auth.getUser()
    
    if (!user) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return <>{children}</>
}
```

## JWT Key Rotation

If you need to rotate your JWT signing keys:

1. Go to **Settings** → **API**
2. Click on **Roll JWT Signing Secret**
3. Your standby key becomes the current key
4. A new standby key is generated
5. Update your `.env.local` with the new anon key

**Note**: Existing tokens will remain valid until they expire.

## Security Best Practices

1. **Never expose service role keys** in client-side code
2. **Use Row Level Security (RLS)** for all tables
3. **Implement proper CORS settings** in your API routes
4. **Set appropriate JWT expiry times**
5. **Use HTTPS only** in production
6. **Implement rate limiting** for auth endpoints
7. **Enable MFA** for sensitive operations

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Ensure you're using the anon key, not the service role key
   - Check that the key is properly set in `.env.local`

2. **"JWT expired" error**
   - Tokens have expired, need to refresh
   - Use `auth.refreshSession()` to get new tokens

3. **"User not authenticated" error**
   - Check if session exists: `auth.getSession()`
   - Verify auth state: `auth.getUser()`

4. **CORS errors**
   - Add your domain to allowed origins in Supabase dashboard
   - Settings → API → CORS Allowed Origins

## Support Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [JWT.io Debugger](https://jwt.io/) - Decode and verify JWTs
- [Supabase Discord](https://discord.supabase.com/)
- [Project Dashboard](https://supabase.com/dashboard/project/sjbvvrjxsbqrgtpgdxwr)

## Next Steps

1. Add the anon key to `.env.local`
2. Test authentication flow
3. Set up RLS policies for your tables
4. Configure auth providers as needed
5. Implement protected routes