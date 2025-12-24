/**
 * API Utilities - Central Export
 *
 * Import all API utilities from a single location:
 * import { asyncHandler, formatSuccessResponse, withModuleAuth } from '@/lib/api'
 */

// Error handling utilities
export {
  // Error classes
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
  // Response formatters
  formatErrorResponse,
  formatSuccessResponse,
  asyncHandler,
  assert,
  // Types
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from './errors'

// Middleware utilities
export {
  // Clients
  createServiceClient,
  createAuthenticatedClient,
  // Authentication
  authenticate,
  // Authorization
  checkModuleAccess,
  requireModuleAccess,
  requireRole,
  withModuleAuth,
  // Utilities
  checkRateLimit,
  withOrgFilter,
  // Types
  type AuthContext,
  type ModuleAccess,
} from './middleware'

// Validation utilities
export {
  // Common schemas
  uuidSchema,
  paginationSchema,
  searchSchema,
  dateRangeSchema,
  // Product schemas
  productSchema,
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  // Warehouse schemas
  warehouseSchema,
  createWarehouseSchema,
  updateWarehouseSchema,
  warehouseQuerySchema,
  // Stock schemas
  stockQuerySchema,
  stockAdjustmentSchema,
  stockTransferSchema,
  // Validation functions
  validateBody,
  validateSearchParams,
  validateParams,
  // Types
  type Product,
  type CreateProductInput,
  type UpdateProductInput,
  type ProductQuery,
  type Warehouse,
  type CreateWarehouseInput,
  type UpdateWarehouseInput,
  type WarehouseQuery,
  type StockQuery,
  type StockAdjustmentInput,
  type StockTransferInput,
} from './validators'
