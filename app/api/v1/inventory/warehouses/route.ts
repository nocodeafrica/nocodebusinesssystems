/**
 * Warehouses API - Collection Routes
 *
 * GET  /api/v1/inventory/warehouses - List all warehouses with pagination and filters
 * POST /api/v1/inventory/warehouses - Create a new warehouse
 *
 * Authentication: Required (Bearer token)
 * Authorization: Organization members with 'inventory' module access
 */

import { NextRequest } from 'next/server'
import {
  asyncHandler,
  formatSuccessResponse,
  ValidationError,
} from '@/lib/api/errors'
import { withModuleAuth } from '@/lib/api/middleware'
import {
  validateBody,
  validateSearchParams,
  warehouseQuerySchema,
  createWarehouseSchema,
  type CreateWarehouseInput,
  type WarehouseQuery,
} from '@/lib/api/validators'

/**
 * GET /api/v1/inventory/warehouses
 *
 * List warehouses with pagination, search, and filtering
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - search: string (searches name, code, address)
 * - city: string
 * - state: string
 * - is_active: boolean
 * - sort_by: string (default: 'created_at')
 * - sort_order: 'asc' | 'desc' (default: 'asc')
 *
 * Response: 200 OK
 * {
 *   "data": [
 *     {
 *       "id": "uuid",
 *       "organization_id": "uuid",
 *       "name": "Main Warehouse",
 *       "code": "WH-001",
 *       "address": "123 Main St",
 *       "city": "Johannesburg",
 *       "total_products": 150,
 *       "total_stock_value": 125000.50,
 *       ...
 *     }
 *   ],
 *   "meta": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 5,
 *     "total_pages": 1
 *   }
 * }
 */
export const GET = asyncHandler(async (request: NextRequest) => {
  // Authenticate and check module access
  const { supabase, auth } = await withModuleAuth(request, 'inventory')

  // Validate query parameters
  const searchParams = request.nextUrl.searchParams
  const query: WarehouseQuery = validateSearchParams(searchParams, warehouseQuerySchema)

  // Build base query with RLS enforcement
  let dbQuery = supabase
    .from('warehouses')
    .select('*, stock_levels(product_id, quantity)', { count: 'exact' })
    .eq('organization_id', auth.organizationId)

  // Apply search filter
  if (query.search) {
    dbQuery = dbQuery.or(
      `name.ilike.%${query.search}%,code.ilike.%${query.search}%,address.ilike.%${query.search}%,city.ilike.%${query.search}%`
    )
  }

  // Apply city filter
  if (query.city) {
    dbQuery = dbQuery.eq('city', query.city)
  }

  // Apply state filter
  if (query.state) {
    dbQuery = dbQuery.eq('state', query.state)
  }

  // Apply active status filter
  if (query.is_active !== undefined) {
    dbQuery = dbQuery.eq('is_active', query.is_active)
  }

  // Apply sorting
  const sortBy = query.sort_by || 'created_at'
  dbQuery = dbQuery.order(sortBy, { ascending: query.sort_order === 'asc' })

  // Apply pagination
  const offset = (query.page - 1) * query.limit
  dbQuery = dbQuery.range(offset, offset + query.limit - 1)

  // Execute query
  const { data: warehouses, error, count } = await dbQuery

  if (error) {
    throw error
  }

  // Enrich warehouses with calculated metrics
  const enrichedWarehouses = await Promise.all(
    (warehouses || []).map(async (warehouse) => {
      // Get unique product count
      const uniqueProducts = new Set(
        warehouse.stock_levels?.map((sl: any) => sl.product_id) || []
      ).size

      // Calculate total stock value (requires joining with products)
      const { data: stockValue } = await supabase
        .rpc('calculate_warehouse_stock_value', {
          warehouse_id_param: warehouse.id,
        })
        .single()

      return {
        ...warehouse,
        total_products: uniqueProducts,
        total_stock_value: stockValue?.total_value || 0,
        stock_levels: undefined, // Remove raw stock_levels from response
      }
    })
  )

  // Calculate total pages
  const totalPages = count ? Math.ceil(count / query.limit) : 0

  return formatSuccessResponse(enrichedWarehouses, {
    page: query.page,
    limit: query.limit,
    total: count || 0,
    total_pages: totalPages,
  })
})

/**
 * POST /api/v1/inventory/warehouses
 *
 * Create a new warehouse
 *
 * Request Body:
 * {
 *   "name": "Main Warehouse",
 *   "code": "WH-001",
 *   "address": "123 Main St",
 *   "city": "Johannesburg",
 *   "state": "Gauteng",
 *   "postal_code": "2000",
 *   "country": "ZA",
 *   "latitude": -26.2041,
 *   "longitude": 28.0473,
 *   "manager_name": "John Doe",
 *   "manager_email": "john@example.com",
 *   "manager_phone": "+27123456789",
 *   "capacity_sqm": 5000,
 *   "is_active": true,
 *   "metadata": {}
 * }
 *
 * Response: 201 Created
 * {
 *   "data": {
 *     "id": "uuid",
 *     "organization_id": "uuid",
 *     "name": "Main Warehouse",
 *     ...
 *   }
 * }
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  // Authenticate and check module access
  // Require 'admin' or 'manager' role to create warehouses
  const { supabase, auth } = await withModuleAuth(request, 'inventory', [
    'admin',
    'manager',
  ])

  // Validate request body
  const body: CreateWarehouseInput = await validateBody(request, createWarehouseSchema)

  // Check for duplicate warehouse code within organization
  const { data: existing, error: checkError } = await supabase
    .from('warehouses')
    .select('id')
    .eq('organization_id', auth.organizationId)
    .eq('code', body.code)
    .maybeSingle()

  if (checkError) {
    throw checkError
  }

  if (existing) {
    throw new ValidationError('Warehouse with this code already exists', {
      field: 'code',
      value: body.code,
    })
  }

  // Create warehouse with organization_id from auth context
  const { data: warehouse, error: createError } = await supabase
    .from('warehouses')
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

  return formatSuccessResponse(warehouse, undefined, 201)
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
