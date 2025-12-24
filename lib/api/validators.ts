/**
 * API Input Validation Schemas
 *
 * Zod schemas for validating API request bodies, query parameters, and route params.
 * Provides type-safe validation with automatic TypeScript type inference.
 */

import { z } from 'zod'

/**
 * Common validation schemas
 */

// UUID validation
export const uuidSchema = z.string().uuid({ message: 'Invalid UUID format' })

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// Search/filter schema
export const searchSchema = z.object({
  search: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
})

// Date range schema
export const dateRangeSchema = z.object({
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
})

/**
 * Product Validation Schemas
 */

export const productSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  sku: z.string().min(1).max(100),
  barcode: z.string().optional(),
  category: z.string().optional(),
  unit_price: z.number().min(0),
  cost_price: z.number().min(0).optional(),
  reorder_point: z.number().int().min(0).default(10),
  reorder_quantity: z.number().int().min(1).default(50),
  unit_of_measure: z.string().default('unit'),
  is_active: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
})

export const createProductSchema = productSchema

export const updateProductSchema = productSchema.partial()

export const productQuerySchema = paginationSchema.merge(searchSchema).merge(
  z.object({
    category: z.string().optional(),
    is_active: z.coerce.boolean().optional(),
    low_stock: z.coerce.boolean().optional(), // Filter products below reorder point
  })
)

/**
 * Warehouse Validation Schemas
 */

export const warehouseSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string().min(1).max(50),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().default('ZA'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  manager_name: z.string().optional(),
  manager_email: z.string().email().optional(),
  manager_phone: z.string().optional(),
  capacity_sqm: z.number().min(0).optional(),
  is_active: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
})

export const createWarehouseSchema = warehouseSchema

export const updateWarehouseSchema = warehouseSchema.partial()

export const warehouseQuerySchema = paginationSchema.merge(searchSchema).merge(
  z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    is_active: z.coerce.boolean().optional(),
  })
)

/**
 * Stock Validation Schemas
 */

export const stockQuerySchema = paginationSchema.merge(searchSchema).merge(
  z.object({
    product_id: z.string().uuid().optional(),
    warehouse_id: z.string().uuid().optional(),
    low_stock: z.coerce.boolean().optional(), // Below reorder point
    out_of_stock: z.coerce.boolean().optional(), // Zero quantity
  })
)

export const stockAdjustmentSchema = z.object({
  product_id: z.string().uuid(),
  warehouse_id: z.string().uuid(),
  quantity_change: z.number().int(),
  reason: z.enum([
    'purchase',
    'sale',
    'return',
    'damage',
    'loss',
    'found',
    'adjustment',
    'transfer',
  ]),
  notes: z.string().optional(),
  reference_number: z.string().optional(),
})

export const stockTransferSchema = z.object({
  product_id: z.string().uuid(),
  from_warehouse_id: z.string().uuid(),
  to_warehouse_id: z.string().uuid(),
  quantity: z.number().int().min(1),
  notes: z.string().optional(),
  scheduled_date: z.string().datetime().optional(),
})

/**
 * Type exports for use in API routes
 */

export type Product = z.infer<typeof productSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductQuery = z.infer<typeof productQuerySchema>

export type Warehouse = z.infer<typeof warehouseSchema>
export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>
export type WarehouseQuery = z.infer<typeof warehouseQuerySchema>

export type StockQuery = z.infer<typeof stockQuerySchema>
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>
export type StockTransferInput = z.infer<typeof stockTransferSchema>

/**
 * Validate request body against schema
 */
export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error // Will be handled by error formatter
    }
    throw new Error('Invalid JSON body')
  }
}

/**
 * Validate URL search params against schema
 */
export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries())
  return schema.parse(params)
}

/**
 * Validate route params (e.g., [id])
 */
export function validateParams<T>(
  params: Record<string, string>,
  schema: z.ZodSchema<T>
): T {
  return schema.parse(params)
}
