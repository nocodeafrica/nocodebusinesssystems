/**
 * API Middleware Utilities
 *
 * Reusable middleware for authentication, authorization, and organization context.
 * Enforces platform-wide security policies with Row-Level Security (RLS).
 */

import { createClient } from '@supabase/supabase-js'
import { UnauthorizedError, ForbiddenError } from './errors'

/**
 * Authentication context from middleware
 */
export interface AuthContext {
  userId: string
  organizationId: string
  userEmail: string
  userRole: string
  session: any
}

/**
 * Module subscription status
 */
export interface ModuleAccess {
  hasAccess: boolean
  subscriptionTier: 'free' | 'starter' | 'professional' | 'enterprise'
  moduleEnabled: boolean
}

/**
 * Create server-side Supabase client with service role key
 * USE WITH CAUTION - Bypasses RLS for admin operations
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Create server-side Supabase client with user's auth token
 * Automatically enforces RLS based on authenticated user
 */
export function createAuthenticatedClient(authToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    global: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Extract and validate authentication from request headers
 * Returns authenticated Supabase client and auth context
 */
export async function authenticate(request: Request): Promise<{
  supabase: ReturnType<typeof createAuthenticatedClient>
  auth: AuthContext
}> {
  // Extract Bearer token from Authorization header
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header')
  }

  const token = authHeader.substring(7) // Remove 'Bearer ' prefix

  // Create authenticated client
  const supabase = createAuthenticatedClient(token)

  // Verify token and get user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new UnauthorizedError('Invalid or expired token')
  }

  // Get user's organization (assuming users belong to one organization)
  // Adjust this query based on your actual organization schema
  const { data: orgMembership, error: orgError } = await supabase
    .from('organization_members')
    .select('organization_id, role, organizations(id, name)')
    .eq('user_id', user.id)
    .single()

  if (orgError || !orgMembership) {
    throw new ForbiddenError(
      'User not associated with any organization'
    )
  }

  return {
    supabase,
    auth: {
      userId: user.id,
      organizationId: orgMembership.organization_id,
      userEmail: user.email || '',
      userRole: orgMembership.role,
      session: user,
    },
  }
}

/**
 * Check if organization has access to a specific module
 *
 * @param supabase - Authenticated Supabase client
 * @param organizationId - Organization UUID
 * @param moduleName - Module identifier (e.g., 'inventory', 'recruitment', 'real_estate')
 */
export async function checkModuleAccess(
  supabase: ReturnType<typeof createAuthenticatedClient>,
  organizationId: string,
  moduleName: string
): Promise<ModuleAccess> {
  // Query organization subscription
  const { data: subscription, error } = await supabase
    .from('organization_subscriptions')
    .select('tier, enabled_modules, is_active')
    .eq('organization_id', organizationId)
    .single()

  if (error || !subscription) {
    return {
      hasAccess: false,
      subscriptionTier: 'free',
      moduleEnabled: false,
    }
  }

  // Check if subscription is active
  if (!subscription.is_active) {
    return {
      hasAccess: false,
      subscriptionTier: subscription.tier,
      moduleEnabled: false,
    }
  }

  // Check if module is enabled in subscription
  const moduleEnabled =
    Array.isArray(subscription.enabled_modules) &&
    subscription.enabled_modules.includes(moduleName)

  return {
    hasAccess: moduleEnabled,
    subscriptionTier: subscription.tier,
    moduleEnabled,
  }
}

/**
 * Require module access or throw forbidden error
 */
export async function requireModuleAccess(
  supabase: ReturnType<typeof createAuthenticatedClient>,
  organizationId: string,
  moduleName: string
): Promise<void> {
  const access = await checkModuleAccess(supabase, organizationId, moduleName)

  if (!access.hasAccess) {
    throw new ForbiddenError(
      `Organization does not have access to ${moduleName} module. ` +
        `Please upgrade your subscription or enable the module.`
    )
  }
}

/**
 * Check if user has required role
 *
 * @param userRole - User's role in organization
 * @param requiredRoles - Array of roles that have access
 */
export function requireRole(
  userRole: string,
  requiredRoles: string[]
): void {
  if (!requiredRoles.includes(userRole)) {
    throw new ForbiddenError(
      `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`
    )
  }
}

/**
 * Combined middleware: authenticate + check module access
 *
 * Usage in API routes:
 * const { supabase, auth } = await withModuleAuth(request, 'inventory')
 */
export async function withModuleAuth(
  request: Request,
  moduleName: string,
  requiredRoles?: string[]
) {
  // Authenticate user
  const { supabase, auth } = await authenticate(request)

  // Check role if specified
  if (requiredRoles) {
    requireRole(auth.userRole, requiredRoles)
  }

  // Check module access
  await requireModuleAccess(supabase, auth.organizationId, moduleName)

  return { supabase, auth }
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * For production, use Redis or a dedicated rate limiting service
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetAt) {
    // New window
    const resetAt = now + windowMs
    rateLimitStore.set(identifier, { count: 1, resetAt })
    return { allowed: true, remaining: maxRequests - 1, resetAt }
  }

  if (record.count >= maxRequests) {
    // Limit exceeded
    return { allowed: false, remaining: 0, resetAt: record.resetAt }
  }

  // Increment count
  record.count++
  rateLimitStore.set(identifier, record)

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  }
}

/**
 * Add organization_id filter to RLS-enabled queries
 * Ensures users only access data from their organization
 */
export function withOrgFilter<T>(
  query: any,
  organizationId: string
): any {
  return query.eq('organization_id', organizationId)
}
