/**
 * Warehouses API - Individual Resource Routes
 *
 * GET    /api/v1/inventory/warehouses/:id - Get a single warehouse by ID
 * PATCH  /api/v1/inventory/warehouses/:id - Update a warehouse
 * DELETE /api/v1/inventory/warehouses/:id - Delete a warehouse (soft delete)
 *
 * Authentication: Required (Bearer token)
 * Authorization: Organization members with 'inventory' module access
 */

import { NextRequest } from 'next/server'
import {
  asyncHandler,
  formatSuccessResponse,
  NotFoundError,
  ValidationError,
} from '@/lib/api/errors'
import { withModuleAuth } from '@/lib/api/middleware'
import {
  validateBody,
  validateParams,
  updateWarehouseSchema,
  uuidSchema,
  type UpdateWarehouseInput,
} from '@/lib/api/validators'

/**
 * Route context type (Next.js 15 App Router)
 */
interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/v1/inventory/warehouses/:id
 *
 * Retrieve a single warehouse with stock details
 *
 * Response: 200 OK
 * {
 *   "data": {
 *     "id": "uuid",
 *     "organization_id": "uuid",
 *     "name": "Main Warehouse",
 *     "code": "WH-001",
 *     "stock_summary": {
 *       "total_products": 150,
 *       "total_items": 5000,
 *       "total_value": 125000.50,
 *       "low_stock_products": 12
 *     },
 *     "top_products": [
 *       {
 *         "product_id": "uuid",
 *         "product_name": "Product A",
 *         "quantity": 500,
 *         "value": 12500
 *       }
 *     ],
 *     ...
 *   }
 * }
 */
export const GET = asyncHandler(async (request: NextRequest, context: RouteContext) => {
  // Authenticate and check module access
  const { supabase, auth } = await withModuleAuth(request, 'inventory')

  // Validate and extract warehouse ID from route params
  const params = await context.params
  const warehouseId = validateParams({ id: params.id }, { id: uuidSchema }).id

  // Fetch warehouse
  const { data: warehouse, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('id', warehouseId)
    .eq('organization_id', auth.organizationId)
    .single()

  if (error || !warehouse) {
    throw new NotFoundError('Warehouse not found')
  }

  // Fetch stock summary using database function
  const { data: stockSummary } = await supabase
    .rpc('get_warehouse_stock_summary', {
      warehouse_id_param: warehouseId,
    })
    .single()

  // Fetch top products by quantity
  const { data: topProducts } = await supabase
    .from('stock_levels')
    .select(`
      quantity,
      products (
        id,
        name,
        sku,
        unit_price,
        category
      )
    `)
    .eq('warehouse_id', warehouseId)
    .order('quantity', { ascending: false })
    .limit(10)

  // Format top products with calculated value
  const formattedTopProducts = topProducts?.map((item: any) => ({
    product_id: item.products.id,
    product_name: item.products.name,
    sku: item.products.sku,
    category: item.products.category,
    quantity: item.quantity,
    unit_price: item.products.unit_price,
    total_value: item.quantity * item.products.unit_price,
  }))

  return formatSuccessResponse({
    ...warehouse,
    stock_summary: stockSummary || {
      total_products: 0,
      total_items: 0,
      total_value: 0,
      low_stock_products: 0,
    },
    top_products: formattedTopProducts || [],
  })
})

/**
 * PATCH /api/v1/inventory/warehouses/:id
 *
 * Update a warehouse's information
 *
 * Request Body (all fields optional):
 * {
 *   "name": "Updated Warehouse Name",
 *   "manager_name": "Jane Doe",
 *   "is_active": false,
 *   ...
 * }
 *
 * Response: 200 OK
 * {
 *   "data": {
 *     "id": "uuid",
 *     "name": "Updated Warehouse Name",
 *     ...
 *   }
 * }
 */
export const PATCH = asyncHandler(async (request: NextRequest, context: RouteContext) => {
  // Authenticate and check module access
  // Require 'admin' or 'manager' role to update warehouses
  const { supabase, auth } = await withModuleAuth(request, 'inventory', [
    'admin',
    'manager',
  ])

  // Validate warehouse ID
  const params = await context.params
  const warehouseId = validateParams({ id: params.id }, { id: uuidSchema }).id

  // Validate request body
  const updates: UpdateWarehouseInput = await validateBody(request, updateWarehouseSchema)

  // Check if warehouse exists and belongs to organization
  const { data: existing, error: fetchError } = await supabase
    .from('warehouses')
    .select('id, code')
    .eq('id', warehouseId)
    .eq('organization_id', auth.organizationId)
    .single()

  if (fetchError || !existing) {
    throw new NotFoundError('Warehouse not found')
  }

  // If code is being updated, check for duplicates
  if (updates.code && updates.code !== existing.code) {
    const { data: duplicate, error: checkError } = await supabase
      .from('warehouses')
      .select('id')
      .eq('organization_id', auth.organizationId)
      .eq('code', updates.code)
      .neq('id', warehouseId)
      .maybeSingle()

    if (checkError) {
      throw checkError
    }

    if (duplicate) {
      throw new ValidationError('Warehouse with this code already exists', {
        field: 'code',
        value: updates.code,
      })
    }
  }

  // Update warehouse
  const { data: warehouse, error: updateError } = await supabase
    .from('warehouses')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: auth.userId,
    })
    .eq('id', warehouseId)
    .eq('organization_id', auth.organizationId)
    .select()
    .single()

  if (updateError) {
    throw updateError
  }

  return formatSuccessResponse(warehouse)
})

/**
 * DELETE /api/v1/inventory/warehouses/:id
 *
 * Soft delete a warehouse (sets is_active to false)
 * Cannot delete warehouse with existing stock
 *
 * Response: 200 OK
 * {
 *   "data": {
 *     "id": "uuid",
 *     "is_active": false,
 *     "deleted_at": "2025-01-20T10:00:00Z"
 *   }
 * }
 */
export const DELETE = asyncHandler(async (request: NextRequest, context: RouteContext) => {
  // Authenticate and check module access
  // Require 'admin' role to delete warehouses
  const { supabase, auth } = await withModuleAuth(request, 'inventory', ['admin'])

  // Validate warehouse ID
  const params = await context.params
  const warehouseId = validateParams({ id: params.id }, { id: uuidSchema }).id

  // Check if warehouse exists and belongs to organization
  const { data: existing, error: fetchError } = await supabase
    .from('warehouses')
    .select('id, name')
    .eq('id', warehouseId)
    .eq('organization_id', auth.organizationId)
    .single()

  if (fetchError || !existing) {
    throw new NotFoundError('Warehouse not found')
  }

  // Check if warehouse has stock
  const { data: stockLevels, error: stockError } = await supabase
    .from('stock_levels')
    .select('quantity')
    .eq('warehouse_id', warehouseId)

  if (stockError) {
    throw stockError
  }

  const hasStock = stockLevels?.some((level) => level.quantity > 0)

  if (hasStock) {
    throw new ValidationError(
      'Cannot delete warehouse with existing stock. Please transfer all stock first.',
      {
        warehouse_id: warehouseId,
        has_stock: true,
      }
    )
  }

  // Soft delete: deactivate the warehouse
  const { data: warehouse, error: deleteError } = await supabase
    .from('warehouses')
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
      deleted_by: auth.userId,
    })
    .eq('id', warehouseId)
    .eq('organization_id', auth.organizationId)
    .select()
    .single()

  if (deleteError) {
    throw deleteError
  }

  return formatSuccessResponse({
    id: warehouse.id,
    is_active: warehouse.is_active,
    deleted_at: warehouse.deleted_at,
    message: 'Warehouse successfully deactivated',
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
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
