/**
 * Inventory Management API - Example Usage
 *
 * This file demonstrates how to use the Inventory Management API
 * from both server-side and client-side code.
 */

import { supabase } from '@/lib/supabase';

// =====================================================
// CLIENT-SIDE USAGE (React Components, Client Actions)
// =====================================================

/**
 * Get authenticated API client
 */
async function getAuthenticatedFetch() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const token = session.access_token;

  return async (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  };
}

/**
 * Example: List products with pagination and filtering
 */
export async function listProducts(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  lowStock?: boolean;
}) {
  const authenticatedFetch = await getAuthenticatedFetch();

  // Build query string
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.category) queryParams.append('category', params.category);
  if (params.lowStock) queryParams.append('low_stock', 'true');

  const response = await authenticatedFetch(
    `/api/v1/inventory/products?${queryParams.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}

/**
 * Example: Create a new product
 */
export async function createProduct(productData: {
  name: string;
  sku: string;
  unit_price: number;
  category?: string;
  reorder_point?: number;
}) {
  const authenticatedFetch = await getAuthenticatedFetch();

  const response = await authenticatedFetch('/api/v1/inventory/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}

/**
 * Example: Get a single product
 */
export async function getProduct(productId: string) {
  const authenticatedFetch = await getAuthenticatedFetch();

  const response = await authenticatedFetch(
    `/api/v1/inventory/products/${productId}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}

/**
 * Example: Update a product
 */
export async function updateProduct(
  productId: string,
  updates: Partial<{
    name: string;
    unit_price: number;
    is_active: boolean;
  }>
) {
  const authenticatedFetch = await getAuthenticatedFetch();

  const response = await authenticatedFetch(
    `/api/v1/inventory/products/${productId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}

/**
 * Example: Delete a product
 */
export async function deleteProduct(productId: string) {
  const authenticatedFetch = await getAuthenticatedFetch();

  const response = await authenticatedFetch(
    `/api/v1/inventory/products/${productId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}

/**
 * Example: List warehouses
 */
export async function listWarehouses(params: {
  page?: number;
  city?: string;
  is_active?: boolean;
}) {
  const authenticatedFetch = await getAuthenticatedFetch();

  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.city) queryParams.append('city', params.city);
  if (params.is_active !== undefined) {
    queryParams.append('is_active', params.is_active.toString());
  }

  const response = await authenticatedFetch(
    `/api/v1/inventory/warehouses?${queryParams.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}

/**
 * Example: Create a warehouse
 */
export async function createWarehouse(warehouseData: {
  name: string;
  code: string;
  city: string;
  address?: string;
}) {
  const authenticatedFetch = await getAuthenticatedFetch();

  const response = await authenticatedFetch('/api/v1/inventory/warehouses', {
    method: 'POST',
    body: JSON.stringify(warehouseData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}

/**
 * Example: List stock levels
 */
export async function listStock(params: {
  page?: number;
  warehouse_id?: string;
  low_stock?: boolean;
  out_of_stock?: boolean;
}) {
  const authenticatedFetch = await getAuthenticatedFetch();

  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.warehouse_id)
    queryParams.append('warehouse_id', params.warehouse_id);
  if (params.low_stock) queryParams.append('low_stock', 'true');
  if (params.out_of_stock) queryParams.append('out_of_stock', 'true');

  const response = await authenticatedFetch(
    `/api/v1/inventory/stock?${queryParams.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}

/**
 * Example: Adjust stock (receive inventory)
 */
export async function receiveInventory(
  productId: string,
  warehouseId: string,
  quantity: number,
  referenceNumber?: string
) {
  const authenticatedFetch = await getAuthenticatedFetch();

  const response = await authenticatedFetch('/api/v1/inventory/stock/adjust', {
    method: 'POST',
    body: JSON.stringify({
      product_id: productId,
      warehouse_id: warehouseId,
      quantity_change: quantity,
      reason: 'purchase',
      notes: 'Inventory received from supplier',
      reference_number: referenceNumber,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}

/**
 * Example: Adjust stock (record sale)
 */
export async function recordSale(
  productId: string,
  warehouseId: string,
  quantity: number,
  orderNumber: string
) {
  const authenticatedFetch = await getAuthenticatedFetch();

  const response = await authenticatedFetch('/api/v1/inventory/stock/adjust', {
    method: 'POST',
    body: JSON.stringify({
      product_id: productId,
      warehouse_id: warehouseId,
      quantity_change: -quantity,
      reason: 'sale',
      notes: `Order ${orderNumber}`,
      reference_number: orderNumber,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}

/**
 * Example: Transfer stock between warehouses
 */
export async function transferStock(
  productId: string,
  fromWarehouseId: string,
  toWarehouseId: string,
  quantity: number,
  notes?: string
) {
  const authenticatedFetch = await getAuthenticatedFetch();

  const response = await authenticatedFetch(
    '/api/v1/inventory/stock/transfer',
    {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        from_warehouse_id: fromWarehouseId,
        to_warehouse_id: toWarehouseId,
        quantity,
        notes,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}

// =====================================================
// REACT COMPONENT EXAMPLES
// =====================================================

/**
 * Example: React hook for fetching products
 */
export function useProducts(filters: {
  search?: string;
  category?: string;
  page?: number;
}) {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await listProducts(filters);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.search, filters.category, filters.page]);

  return { products, loading, error };
}

/**
 * Example: React component for product list
 */
export function ProductList() {
  const [search, setSearch] = React.useState('');
  const { products, loading, error } = useProducts({ search });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.sku}</td>
              <td>{product.name}</td>
              <td>${product.unit_price}</td>
              <td>{product.current_stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Example: React component for stock adjustment
 */
export function StockAdjustmentForm({
  productId,
  warehouseId,
  onSuccess,
}: {
  productId: string;
  warehouseId: string;
  onSuccess?: () => void;
}) {
  const [quantity, setQuantity] = React.useState(0);
  const [reason, setReason] = React.useState<string>('adjustment');
  const [notes, setNotes] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authenticatedFetch = await getAuthenticatedFetch();
      await authenticatedFetch('/api/v1/inventory/stock/adjust', {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          warehouse_id: warehouseId,
          quantity_change: quantity,
          reason,
          notes,
        }),
      });

      onSuccess?.();
    } catch (err) {
      alert('Error adjusting stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Quantity Change:
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </label>

      <label>
        Reason:
        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="purchase">Purchase</option>
          <option value="sale">Sale</option>
          <option value="damage">Damage</option>
          <option value="adjustment">Adjustment</option>
        </select>
      </label>

      <label>
        Notes:
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Adjusting...' : 'Adjust Stock'}
      </button>
    </form>
  );
}

// =====================================================
// SERVER-SIDE USAGE (API Routes, Server Actions)
// =====================================================

/**
 * Example: Server action for bulk product import
 */
export async function bulkImportProducts(csvData: string) {
  'use server';

  // This would run on the server side
  // Parse CSV and create multiple products
  const lines = csvData.split('\n');
  const results = [];

  for (const line of lines.slice(1)) {
    // Skip header
    const [name, sku, price] = line.split(',');

    try {
      const product = await createProduct({
        name: name.trim(),
        sku: sku.trim(),
        unit_price: parseFloat(price),
      });
      results.push({ success: true, product });
    } catch (error) {
      results.push({ success: false, error: (error as Error).message, sku });
    }
  }

  return results;
}

/**
 * Example: Generate low stock report
 */
export async function generateLowStockReport() {
  const authenticatedFetch = await getAuthenticatedFetch();

  const response = await authenticatedFetch(
    '/api/v1/inventory/stock?low_stock=true&limit=100'
  );

  const { data: lowStockItems } = await response.json();

  // Format as CSV
  const csv = [
    'Product,SKU,Warehouse,Current Stock,Reorder Point',
    ...lowStockItems.map(
      (item: any) =>
        `${item.product_name},${item.product_sku},${item.warehouse_name},${item.quantity},${item.reorder_point}`
    ),
  ].join('\n');

  return csv;
}

// Add React import for the component examples
import * as React from 'react';
