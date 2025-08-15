import { createClient } from '@supabase/supabase-js'

// Supabase configuration using NEW API Keys System (2025)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

// For server-side operations only (API routes, server components)
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // JWT configuration
    flowType: 'pkce', // Use PKCE flow for enhanced security
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'ncbs-auth-token',
    // Configure JWT settings
    debug: process.env.NODE_ENV === 'development',
  },
  global: {
    headers: {
      'x-application-name': 'ncbs-website'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper functions for authentication
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign in with OAuth provider
  signInWithProvider: async (provider: 'google' | 'github' | 'azure' | 'linkedin') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: provider === 'github' ? 'read:user user:email' : undefined
      }
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Refresh session token
  refreshSession: async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession()
    return { session, error }
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { data, error }
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { data, error }
  },

  // Verify OTP
  verifyOtp: async (email: string, token: string, type: 'signup' | 'recovery' | 'email_change' | 'email') => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type
    })
    return { data, error }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const db = {
  // Generic query builder
  from: (table: string) => supabase.from(table),
  
  // Storage operations
  storage: {
    upload: async (bucket: string, path: string, file: File) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })
      return { data, error }
    },
    
    download: async (bucket: string, path: string) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path)
      return { data, error }
    },
    
    getPublicUrl: (bucket: string, path: string) => {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)
      return data.publicUrl
    },
    
    remove: async (bucket: string, paths: string[]) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove(paths)
      return { data, error }
    }
  },
  
  // Realtime subscriptions
  realtime: {
    subscribe: (table: string, callback: (payload: any) => void) => {
      return supabase
        .channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
        .subscribe()
    },
    
    unsubscribe: async (channel: any) => {
      await supabase.removeChannel(channel)
    }
  }
}

// RPC (Remote Procedure Call) helper
export const rpc = async (functionName: string, params?: any) => {
  const { data, error } = await supabase.rpc(functionName, params)
  return { data, error }
}

export default supabase