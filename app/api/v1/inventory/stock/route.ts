/**
 * Stock Levels API - List Stock Across Warehouses
 *
 * GET /api/v1/inventory/stock - List stock levels with filtering
 *
 * Authentication: Required (Bearer token)
 * Authorization: Organization members with 'inventory' module access
 */

import { NextRequest } from 'next/server'
import {
  asyncHandler,
  formatSuccessResponse,
} from '@/lib/api/errors'
import { withModuleAuth } from '@/lib/api/middleware'
import {
  validateSearchParams,
  stockQuerySchema,
  type StockQuery,
} from '@/lib/api/validators'

/**
 * GET /api/v1/inventory/stock
 *
 * List stock levels across all warehouses with filtering
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - search: string (searches product name, SKU)
 * - product_id: uuid (filter by specific product)
 * - warehouse_id: uuid (filter by specific warehouse)
 * - low_stock: boolean (filter products below reorder point)
 * - out_of_stock: boolean (filter products with zero quantity)
 * - sort_by: string (default: 'product_name')
 * - sort_order: 'asc' | 'desc' (default: 'asc')
 *
 * Response: 200 OK
 * {
 *   "data": [
 *     {
 *       "product_id": "uuid",
 *       "product_name": "Product A",
 *       "product_sku": "SKU-001",
 *       "warehouse_id": "uuid",
 *       "warehouse_name": "Main Warehouse",
 *       "warehouse_code": "WH-001",
 *       "quantity": 100,
 *       "reorder_point": 50,
 *       "is_low_stock": false,
 *       "last_updated": "2025-01-20T10:00:00Z"
 *     }
 *   ],
 *   "meta": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 500,
 *     "total_pages": 25,
 *     "summary": {
 *       "total_products": 150,
 *       "total_warehouses": 5,
 *       "low_stock_count": 12,
 *       "out_of_stock_count": 3
 *     }
 *   }
 * }
 */
export const GET = asyncHandler(async (request: NextRequest) => {
  // Authenticate and check module access
  const { supabase, auth } = await withModuleAuth(request, 'inventory')

  // Validate query parameters
  const searchParams = request.nextUrl.searchParams
  const query: StockQuery = validateSearchParams(searchParams, stockQuerySchema)

  // Build base query with joins
  let dbQuery = supabase
    .from('stock_levels')
    .select(
      `
      product_id,
      warehouse_id,
      quantity,
      updated_at,
      products (
        id,
        name,
        sku,
        category,
        reorder_point,
        unit_price,
        organization_id
      ),
      warehouses (
        id,
        name,
        code,
        city,
        organization_id
      )
    `,
      { count: 'exact' }
    )

  // Filter by organization through product relationship
  // Note: RLS policies should handle this, but we add explicit filter for clarity
  dbQuery = dbQuery.eq('products.organization_id', auth.organizationId)

  // Apply search filter (search product name or SKU)
  if (query.search) {
    dbQuery = dbQuery.or(
      `products.name.ilike.%${query.search}%,products.sku.ilike.%${query.search}%`
    )
  }

  // Apply product filter
  if (query.product_id) {
    dbQuery = dbQuery.eq('product_id', query.product_id)
  }

  // Apply warehouse filter
  if (query.warehouse_id) {
    dbQuery = dbQuery.eq('warehouse_id', query.warehouse_id)
  }

  // Apply low stock filter (quantity < reorder_point)
  if (query.low_stock) {
    dbQuery = dbQuery.filter('quantity', 'lt', 'products.reorder_point')
  }

  // Apply out of stock filter
  if (query.out_of_stock) {
    dbQuery = dbQuery.eq('quantity', 0)
  }

  // Apply sorting
  const sortBy = query.sort_by || 'products.name'
  dbQuery = dbQuery.order(sortBy, { ascending: query.sort_order === 'asc' })

  // Apply pagination
  const offset = (query.page - 1) * query.limit
  dbQuery = dbQuery.range(offset, offset + query.limit - 1)

  // Execute query
  const { data: stockLevels, error, count } = await dbQuery

  if (error) {
    throw error
  }

  // Format response data
  const formattedData = stockLevels?.map((item: any) => ({
    product_id: item.product_id,
    product_name: item.products.name,
    product_sku: item.products.sku,
    product_category: item.products.category,
    warehouse_id: item.warehouse_id,
    warehouse_name: item.warehouses.name,
    warehouse_code: item.warehouses.code,
    warehouse_city: item.warehouses.city,
    quantity: item.quantity,
    reorder_point: item.products.reorder_point,
    unit_price: item.products.unit_price,
    total_value: item.quantity * item.products.unit_price,
    is_low_stock: item.quantity < item.products.reorder_point,
    is_out_of_stock: item.quantity === 0,
    last_updated: item.updated_at,
  }))

  // Calculate summary statistics
  const { data: summary } = await supabase.rpc('get_stock_summary', {
    org_id_param: auth.organizationId,
  })

  // Calculate total pages
  const totalPages = count ? Math.ceil(count / query.limit) : 0

  return formatSuccessResponse(formattedData || [], {
    page: query.page,
    limit: query.limit,
    total: count || 0,
    total_pages: totalPages,
    summary: summary || {
      total_products: 0,
      total_warehouses: 0,
      low_stock_count: 0,
      out_of_stock_count: 0,
    },
  })
})

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
