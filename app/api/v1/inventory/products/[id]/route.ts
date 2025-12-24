/**
 * Products API - Individual Resource Routes
 *
 * GET    /api/v1/inventory/products/:id - Get a single product by ID
 * PATCH  /api/v1/inventory/products/:id - Update a product
 * DELETE /api/v1/inventory/products/:id - Delete a product (soft delete)
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
  updateProductSchema,
  uuidSchema,
  type UpdateProductInput,
} from '@/lib/api/validators'

/**
 * Route context type (Next.js 15 App Router)
 */
interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/v1/inventory/products/:id
 *
 * Retrieve a single product with stock levels across all warehouses
 *
 * Response: 200 OK
 * {
 *   "data": {
 *     "id": "uuid",
 *     "organization_id": "uuid",
 *     "name": "Product Name",
 *     "sku": "SKU-001",
 *     "stock_levels": [
 *       {
 *         "warehouse_id": "uuid",
 *         "warehouse_name": "Main Warehouse",
 *         "quantity": 100
 *       }
 *     ],
 *     "total_stock": 250,
 *     ...
 *   }
 * }
 */
export const GET = asyncHandler(async (request: NextRequest, context: RouteContext) => {
  // Authenticate and check module access
  const { supabase, auth } = await withModuleAuth(request, 'inventory')

  // Validate and extract product ID from route params
  const params = await context.params
  const productId = validateParams({ id: params.id }, { id: uuidSchema }).id

  // Fetch product with related stock levels
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      stock_levels (
        warehouse_id,
        quantity,
        warehouses (
          id,
          name,
          code
        )
      )
    `)
    .eq('id', productId)
    .eq('organization_id', auth.organizationId)
    .single()

  if (error || !product) {
    throw new NotFoundError('Product not found')
  }

  // Calculate total stock across all warehouses
  const totalStock = product.stock_levels?.reduce(
    (sum: number, level: any) => sum + (level.quantity || 0),
    0
  ) || 0

  return formatSuccessResponse({
    ...product,
    total_stock: totalStock,
  })
})

/**
 * PATCH /api/v1/inventory/products/:id
 *
 * Update a product's information
 *
 * Request Body (all fields optional):
 * {
 *   "name": "Updated Name",
 *   "unit_price": 109.99,
 *   "is_active": false,
 *   ...
 * }
 *
 * Response: 200 OK
 * {
 *   "data": {
 *     "id": "uuid",
 *     "name": "Updated Name",
 *     ...
 *   }
 * }
 */
export const PATCH = asyncHandler(async (request: NextRequest, context: RouteContext) => {
  // Authenticate and check module access
  // Require 'admin' or 'manager' role to update products
  const { supabase, auth } = await withModuleAuth(request, 'inventory', [
    'admin',
    'manager',
  ])

  // Validate product ID
  const params = await context.params
  const productId = validateParams({ id: params.id }, { id: uuidSchema }).id

  // Validate request body
  const updates: UpdateProductInput = await validateBody(request, updateProductSchema)

  // Check if product exists and belongs to organization
  const { data: existing, error: fetchError } = await supabase
    .from('products')
    .select('id, sku')
    .eq('id', productId)
    .eq('organization_id', auth.organizationId)
    .single()

  if (fetchError || !existing) {
    throw new NotFoundError('Product not found')
  }

  // If SKU is being updated, check for duplicates
  if (updates.sku && updates.sku !== existing.sku) {
    const { data: duplicate, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('organization_id', auth.organizationId)
      .eq('sku', updates.sku)
      .neq('id', productId)
      .maybeSingle()

    if (checkError) {
      throw checkError
    }

    if (duplicate) {
      throw new ValidationError('Product with this SKU already exists', {
        field: 'sku',
        value: updates.sku,
      })
    }
  }

  // Update product
  const { data: product, error: updateError } = await supabase
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: auth.userId,
    })
    .eq('id', productId)
    .eq('organization_id', auth.organizationId)
    .select()
    .single()

  if (updateError) {
    throw updateError
  }

  return formatSuccessResponse(product)
})

/**
 * DELETE /api/v1/inventory/products/:id
 *
 * Soft delete a product (sets is_active to false)
 * Hard deletion is not allowed if product has stock levels
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
  // Require 'admin' role to delete products
  const { supabase, auth } = await withModuleAuth(request, 'inventory', ['admin'])

  // Validate product ID
  const params = await context.params
  const productId = validateParams({ id: params.id }, { id: uuidSchema }).id

  // Check if product exists and belongs to organization
  const { data: existing, error: fetchError } = await supabase
    .from('products')
    .select('id, name')
    .eq('id', productId)
    .eq('organization_id', auth.organizationId)
    .single()

  if (fetchError || !existing) {
    throw new NotFoundError('Product not found')
  }

  // Check if product has stock levels
  const { data: stockLevels, error: stockError } = await supabase
    .from('stock_levels')
    .select('quantity')
    .eq('product_id', productId)

  if (stockError) {
    throw stockError
  }

  const hasStock = stockLevels?.some((level) => level.quantity > 0)

  if (hasStock) {
    throw new ValidationError(
      'Cannot delete product with existing stock. Please transfer or adjust stock to zero first.',
      {
        product_id: productId,
        has_stock: true,
      }
    )
  }

  // Soft delete: deactivate the product
  const { data: product, error: deleteError } = await supabase
    .from('products')
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
      deleted_by: auth.userId,
    })
    .eq('id', productId)
    .eq('organization_id', auth.organizationId)
    .select()
    .single()

  if (deleteError) {
    throw deleteError
  }

  return formatSuccessResponse({
    id: product.id,
    is_active: product.is_active,
    deleted_at: product.deleted_at,
    message: 'Product successfully deactivated',
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
