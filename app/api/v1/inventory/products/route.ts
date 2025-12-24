/**
 * Products API - Collection Routes
 *
 * GET  /api/v1/inventory/products - List all products with pagination and filters
 * POST /api/v1/inventory/products - Create a new product
 *
 * Authentication: Required (Bearer token)
 * Authorization: Organization members with 'inventory' module access
 */

import { NextRequest } from 'next/server'
import {
  asyncHandler,
  formatSuccessResponse,
  BadRequestError,
  ValidationError,
} from '@/lib/api/errors'
import { withModuleAuth } from '@/lib/api/middleware'
import {
  validateBody,
  validateSearchParams,
  productQuerySchema,
  createProductSchema,
  type CreateProductInput,
  type ProductQuery,
} from '@/lib/api/validators'

/**
 * GET /api/v1/inventory/products
 *
 * List products with pagination, search, and filtering
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - search: string (searches name, SKU, description)
 * - category: string
 * - is_active: boolean
 * - low_stock: boolean (filter products below reorder point)
 * - sort_by: string (default: 'created_at')
 * - sort_order: 'asc' | 'desc' (default: 'asc')
 *
 * Response: 200 OK
 * {
 *   "data": [
 *     {
 *       "id": "uuid",
 *       "organization_id": "uuid",
 *       "name": "Product Name",
 *       "sku": "SKU-001",
 *       "unit_price": 99.99,
 *       "reorder_point": 10,
 *       "current_stock": 45,
 *       "created_at": "2025-01-20T10:00:00Z",
 *       ...
 *     }
 *   ],
 *   "meta": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 150,
 *     "total_pages": 8
 *   }
 * }
 */
export const GET = asyncHandler(async (request: NextRequest) => {
  // Authenticate and check module access
  const { supabase, auth } = await withModuleAuth(request, 'inventory')

  // Validate query parameters
  const searchParams = request.nextUrl.searchParams
  const query: ProductQuery = validateSearchParams(searchParams, productQuerySchema)

  // Build base query with RLS enforcement (organization_id filter)
  let dbQuery = supabase
    .from('products')
    .select('*, stock_levels(warehouse_id, quantity)', { count: 'exact' })
    .eq('organization_id', auth.organizationId)

  // Apply search filter
  if (query.search) {
    dbQuery = dbQuery.or(
      `name.ilike.%${query.search}%,sku.ilike.%${query.search}%,description.ilike.%${query.search}%`
    )
  }

  // Apply category filter
  if (query.category) {
    dbQuery = dbQuery.eq('category', query.category)
  }

  // Apply active status filter
  if (query.is_active !== undefined) {
    dbQuery = dbQuery.eq('is_active', query.is_active)
  }

  // Apply low stock filter (products below reorder point)
  if (query.low_stock) {
    dbQuery = dbQuery.filter('current_stock', 'lt', 'reorder_point')
  }

  // Apply sorting
  const sortBy = query.sort_by || 'created_at'
  dbQuery = dbQuery.order(sortBy, { ascending: query.sort_order === 'asc' })

  // Apply pagination
  const offset = (query.page - 1) * query.limit
  dbQuery = dbQuery.range(offset, offset + query.limit - 1)

  // Execute query
  const { data: products, error, count } = await dbQuery

  if (error) {
    throw error
  }

  // Calculate total pages
  const totalPages = count ? Math.ceil(count / query.limit) : 0

  return formatSuccessResponse(products || [], {
    page: query.page,
    limit: query.limit,
    total: count || 0,
    total_pages: totalPages,
  })
})

/**
 * POST /api/v1/inventory/products
 *
 * Create a new product
 *
 * Request Body:
 * {
 *   "name": "Product Name",
 *   "sku": "SKU-001",
 *   "description": "Product description",
 *   "category": "Electronics",
 *   "unit_price": 99.99,
 *   "cost_price": 50.00,
 *   "reorder_point": 10,
 *   "reorder_quantity": 50,
 *   "unit_of_measure": "unit",
 *   "is_active": true,
 *   "metadata": {}
 * }
 *
 * Response: 201 Created
 * {
 *   "data": {
 *     "id": "uuid",
 *     "organization_id": "uuid",
 *     "name": "Product Name",
 *     ...
 *   }
 * }
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  // Authenticate and check module access
  // Require 'admin' or 'manager' role to create products
  const { supabase, auth } = await withModuleAuth(request, 'inventory', [
    'admin',
    'manager',
  ])

  // Validate request body
  const body: CreateProductInput = await validateBody(request, createProductSchema)

  // Check for duplicate SKU within organization
  const { data: existing, error: checkError } = await supabase
    .from('products')
    .select('id')
    .eq('organization_id', auth.organizationId)
    .eq('sku', body.sku)
    .maybeSingle()

  if (checkError) {
    throw checkError
  }

  if (existing) {
    throw new ValidationError('Product with this SKU already exists', {
      field: 'sku',
      value: body.sku,
    })
  }

  // Create product with organization_id from auth context
  const { data: product, error: createError } = await supabase
    .from('products')
    .insert({
      ...body,
      organization_id: auth.organizationId,
      created_by: auth.userId,
    })
    .select()
    .single()

  if (createError) {
    throw createError
  }

  return formatSuccessResponse(product, undefined, 201)
})

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
