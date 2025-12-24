/**
 * Stock Adjustment API
 *
 * POST /api/v1/inventory/stock/adjust - Adjust stock levels (add/remove inventory)
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
  stockAdjustmentSchema,
  type StockAdjustmentInput,
} from '@/lib/api/validators'

/**
 * POST /api/v1/inventory/stock/adjust
 *
 * Adjust stock levels for a product in a warehouse
 *
 * Request Body:
 * {
 *   "product_id": "uuid",
 *   "warehouse_id": "uuid",
 *   "quantity_change": -10,  // Negative for removal, positive for addition
 *   "reason": "sale",  // purchase|sale|return|damage|loss|found|adjustment|transfer
 *   "notes": "Damaged goods removed from inventory",
 *   "reference_number": "ADJ-2025-001"  // Optional reference (PO, invoice, etc.)
 * }
 *
 * Response: 200 OK
 * {
 *   "data": {
 *     "adjustment_id": "uuid",
 *     "product_id": "uuid",
 *     "warehouse_id": "uuid",
 *     "previous_quantity": 100,
 *     "quantity_change": -10,
 *     "new_quantity": 90,
 *     "reason": "damage",
 *     "adjusted_at": "2025-01-20T10:00:00Z",
 *     "adjusted_by": "user_id"
 *   }
 * }
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  // Authenticate and check module access
  // Require 'admin', 'manager', or 'staff' role to adjust stock
  const { supabase, auth } = await withModuleAuth(request, 'inventory', [
    'admin',
    'manager',
    'staff',
  ])

  // Validate request body
  const adjustment: StockAdjustmentInput = await validateBody(
    request,
    stockAdjustmentSchema
  )

  // Verify product exists and belongs to organization
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, sku, organization_id')
    .eq('id', adjustment.product_id)
    .eq('organization_id', auth.organizationId)
    .single()

  if (productError || !product) {
    throw new NotFoundError('Product not found')
  }

  // Verify warehouse exists and belongs to organization
  const { data: warehouse, error: warehouseError } = await supabase
    .from('warehouses')
    .select('id, name, code, organization_id')
    .eq('id', adjustment.warehouse_id)
    .eq('organization_id', auth.organizationId)
    .single()

  if (warehouseError || !warehouse) {
    throw new NotFoundError('Warehouse not found')
  }

  // Get current stock level
  const { data: currentStock, error: stockError } = await supabase
    .from('stock_levels')
    .select('quantity')
    .eq('product_id', adjustment.product_id)
    .eq('warehouse_id', adjustment.warehouse_id)
    .maybeSingle()

  if (stockError) {
    throw stockError
  }

  const previousQuantity = currentStock?.quantity || 0
  const newQuantity = previousQuantity + adjustment.quantity_change

  // Prevent negative stock
  if (newQuantity < 0) {
    throw new ValidationError(
      `Insufficient stock. Current quantity: ${previousQuantity}, attempted change: ${adjustment.quantity_change}`,
      {
        product_id: adjustment.product_id,
        warehouse_id: adjustment.warehouse_id,
        current_quantity: previousQuantity,
        requested_change: adjustment.quantity_change,
      }
    )
  }

  // Use database transaction to ensure atomicity
  // Call stored procedure that handles both stock_levels update and audit log
  const { data: result, error: adjustError } = await supabase.rpc(
    'adjust_stock_level',
    {
      p_product_id: adjustment.product_id,
      p_warehouse_id: adjustment.warehouse_id,
      p_quantity_change: adjustment.quantity_change,
      p_reason: adjustment.reason,
      p_notes: adjustment.notes || null,
      p_reference_number: adjustment.reference_number || null,
      p_adjusted_by: auth.userId,
      p_organization_id: auth.organizationId,
    }
  )

  if (adjustError) {
    throw adjustError
  }

  // If the stored procedure doesn't exist, fall back to manual implementation
  if (!result) {
    // Update or insert stock level
    const { data: updatedStock, error: updateError } = await supabase
      .from('stock_levels')
      .upsert({
        product_id: adjustment.product_id,
        warehouse_id: adjustment.warehouse_id,
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // Create audit log entry
    const { data: auditLog, error: auditError } = await supabase
      .from('stock_adjustments')
      .insert({
        organization_id: auth.organizationId,
        product_id: adjustment.product_id,
        warehouse_id: adjustment.warehouse_id,
        previous_quantity: previousQuantity,
        quantity_change: adjustment.quantity_change,
        new_quantity: newQuantity,
        reason: adjustment.reason,
        notes: adjustment.notes,
        reference_number: adjustment.reference_number,
        adjusted_by: auth.userId,
      })
      .select()
      .single()

    if (auditError) {
      throw auditError
    }

    return formatSuccessResponse({
      adjustment_id: auditLog.id,
      product_id: auditLog.product_id,
      product_name: product.name,
      product_sku: product.sku,
      warehouse_id: auditLog.warehouse_id,
      warehouse_name: warehouse.name,
      warehouse_code: warehouse.code,
      previous_quantity: previousQuantity,
      quantity_change: adjustment.quantity_change,
      new_quantity: newQuantity,
      reason: adjustment.reason,
      notes: adjustment.notes,
      reference_number: adjustment.reference_number,
      adjusted_at: auditLog.created_at,
      adjusted_by: auth.userId,
    })
  }

  // Return result from stored procedure
  return formatSuccessResponse(result)
})

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
