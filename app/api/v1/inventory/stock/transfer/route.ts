/**
 * Stock Transfer API
 *
 * POST /api/v1/inventory/stock/transfer - Transfer stock between warehouses
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
  BadRequestError,
} from '@/lib/api/errors'
import { withModuleAuth } from '@/lib/api/middleware'
import {
  validateBody,
  stockTransferSchema,
  type StockTransferInput,
} from '@/lib/api/validators'

/**
 * POST /api/v1/inventory/stock/transfer
 *
 * Transfer stock from one warehouse to another
 *
 * Request Body:
 * {
 *   "product_id": "uuid",
 *   "from_warehouse_id": "uuid",
 *   "to_warehouse_id": "uuid",
 *   "quantity": 50,
 *   "notes": "Monthly stock rebalancing",
 *   "scheduled_date": "2025-01-25T10:00:00Z"  // Optional - for future transfers
 * }
 *
 * Response: 200 OK
 * {
 *   "data": {
 *     "transfer_id": "uuid",
 *     "product_id": "uuid",
 *     "product_name": "Product A",
 *     "from_warehouse": {
 *       "id": "uuid",
 *       "name": "Main Warehouse",
 *       "previous_quantity": 150,
 *       "new_quantity": 100
 *     },
 *     "to_warehouse": {
 *       "id": "uuid",
 *       "name": "Branch Warehouse",
 *       "previous_quantity": 20,
 *       "new_quantity": 70
 *     },
 *     "quantity": 50,
 *     "status": "completed",
 *     "transferred_at": "2025-01-20T10:00:00Z",
 *     "transferred_by": "user_id"
 *   }
 * }
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  // Authenticate and check module access
  // Require 'admin' or 'manager' role to transfer stock
  const { supabase, auth } = await withModuleAuth(request, 'inventory', [
    'admin',
    'manager',
  ])

  // Validate request body
  const transfer: StockTransferInput = await validateBody(
    request,
    stockTransferSchema
  )

  // Validate transfer quantity is positive
  if (transfer.quantity <= 0) {
    throw new ValidationError('Transfer quantity must be positive', {
      quantity: transfer.quantity,
    })
  }

  // Prevent transferring to same warehouse
  if (transfer.from_warehouse_id === transfer.to_warehouse_id) {
    throw new BadRequestError('Cannot transfer stock to the same warehouse')
  }

  // Verify product exists and belongs to organization
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, sku, organization_id')
    .eq('id', transfer.product_id)
    .eq('organization_id', auth.organizationId)
    .single()

  if (productError || !product) {
    throw new NotFoundError('Product not found')
  }

  // Verify source warehouse exists and belongs to organization
  const { data: fromWarehouse, error: fromError } = await supabase
    .from('warehouses')
    .select('id, name, code, organization_id')
    .eq('id', transfer.from_warehouse_id)
    .eq('organization_id', auth.organizationId)
    .single()

  if (fromError || !fromWarehouse) {
    throw new NotFoundError('Source warehouse not found')
  }

  // Verify destination warehouse exists and belongs to organization
  const { data: toWarehouse, error: toError } = await supabase
    .from('warehouses')
    .select('id, name, code, organization_id')
    .eq('id', transfer.to_warehouse_id)
    .eq('organization_id', auth.organizationId)
    .single()

  if (toError || !toWarehouse) {
    throw new NotFoundError('Destination warehouse not found')
  }

  // Get current stock level in source warehouse
  const { data: fromStock, error: fromStockError } = await supabase
    .from('stock_levels')
    .select('quantity')
    .eq('product_id', transfer.product_id)
    .eq('warehouse_id', transfer.from_warehouse_id)
    .maybeSingle()

  if (fromStockError) {
    throw fromStockError
  }

  const fromQuantity = fromStock?.quantity || 0

  // Verify sufficient stock in source warehouse
  if (fromQuantity < transfer.quantity) {
    throw new ValidationError(
      `Insufficient stock in source warehouse. Available: ${fromQuantity}, requested: ${transfer.quantity}`,
      {
        product_id: transfer.product_id,
        warehouse_id: transfer.from_warehouse_id,
        available_quantity: fromQuantity,
        requested_quantity: transfer.quantity,
      }
    )
  }

  // Get current stock level in destination warehouse
  const { data: toStock, error: toStockError } = await supabase
    .from('stock_levels')
    .select('quantity')
    .eq('product_id', transfer.product_id)
    .eq('warehouse_id', transfer.to_warehouse_id)
    .maybeSingle()

  if (toStockError) {
    throw toStockError
  }

  const toQuantity = toStock?.quantity || 0

  // Calculate new quantities
  const newFromQuantity = fromQuantity - transfer.quantity
  const newToQuantity = toQuantity + transfer.quantity

  // Use database transaction for atomicity
  // Call stored procedure that handles the entire transfer
  const { data: result, error: transferError } = await supabase.rpc(
    'transfer_stock',
    {
      p_product_id: transfer.product_id,
      p_from_warehouse_id: transfer.from_warehouse_id,
      p_to_warehouse_id: transfer.to_warehouse_id,
      p_quantity: transfer.quantity,
      p_notes: transfer.notes || null,
      p_scheduled_date: transfer.scheduled_date || null,
      p_transferred_by: auth.userId,
      p_organization_id: auth.organizationId,
    }
  )

  if (transferError) {
    throw transferError
  }

  // If the stored procedure doesn't exist, fall back to manual implementation
  if (!result) {
    // Begin manual transaction simulation (Supabase doesn't support client-side transactions)
    // In production, this should be a database function

    // Update source warehouse stock
    const { error: updateFromError } = await supabase
      .from('stock_levels')
      .upsert({
        product_id: transfer.product_id,
        warehouse_id: transfer.from_warehouse_id,
        quantity: newFromQuantity,
        updated_at: new Date().toISOString(),
      })

    if (updateFromError) {
      throw updateFromError
    }

    // Update destination warehouse stock
    const { error: updateToError } = await supabase
      .from('stock_levels')
      .upsert({
        product_id: transfer.product_id,
        warehouse_id: transfer.to_warehouse_id,
        quantity: newToQuantity,
        updated_at: new Date().toISOString(),
      })

    if (updateToError) {
      // Rollback would happen here in a real transaction
      throw updateToError
    }

    // Create transfer record
    const { data: transferRecord, error: recordError } = await supabase
      .from('stock_transfers')
      .insert({
        organization_id: auth.organizationId,
        product_id: transfer.product_id,
        from_warehouse_id: transfer.from_warehouse_id,
        to_warehouse_id: transfer.to_warehouse_id,
        quantity: transfer.quantity,
        notes: transfer.notes,
        scheduled_date: transfer.scheduled_date,
        status: transfer.scheduled_date ? 'scheduled' : 'completed',
        transferred_by: auth.userId,
        transferred_at: transfer.scheduled_date ? null : new Date().toISOString(),
      })
      .select()
      .single()

    if (recordError) {
      throw recordError
    }

    // Create audit log entries for both warehouses
    const auditEntries = [
      {
        organization_id: auth.organizationId,
        product_id: transfer.product_id,
        warehouse_id: transfer.from_warehouse_id,
        previous_quantity: fromQuantity,
        quantity_change: -transfer.quantity,
        new_quantity: newFromQuantity,
        reason: 'transfer',
        notes: `Transfer to ${toWarehouse.name} (${toWarehouse.code})`,
        reference_number: `TRANSFER-${transferRecord.id}`,
        adjusted_by: auth.userId,
      },
      {
        organization_id: auth.organizationId,
        product_id: transfer.product_id,
        warehouse_id: transfer.to_warehouse_id,
        previous_quantity: toQuantity,
        quantity_change: transfer.quantity,
        new_quantity: newToQuantity,
        reason: 'transfer',
        notes: `Transfer from ${fromWarehouse.name} (${fromWarehouse.code})`,
        reference_number: `TRANSFER-${transferRecord.id}`,
        adjusted_by: auth.userId,
      },
    ]

    const { error: auditError } = await supabase
      .from('stock_adjustments')
      .insert(auditEntries)

    if (auditError) {
      // Log error but don't fail the transfer
      console.error('Failed to create audit log entries:', auditError)
    }

    return formatSuccessResponse({
      transfer_id: transferRecord.id,
      product_id: transfer.product_id,
      product_name: product.name,
      product_sku: product.sku,
      from_warehouse: {
        id: fromWarehouse.id,
        name: fromWarehouse.name,
        code: fromWarehouse.code,
        previous_quantity: fromQuantity,
        new_quantity: newFromQuantity,
      },
      to_warehouse: {
        id: toWarehouse.id,
        name: toWarehouse.name,
        code: toWarehouse.code,
        previous_quantity: toQuantity,
        new_quantity: newToQuantity,
      },
      quantity: transfer.quantity,
      status: transferRecord.status,
      notes: transfer.notes,
      scheduled_date: transfer.scheduled_date,
      transferred_at: transferRecord.transferred_at,
      transferred_by: auth.userId,
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
