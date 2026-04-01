# API Services

## Request Flow

```
Component (useQuery / useMutation)
    ↓
Domain Service (src/services/[feature]-service.ts)
    ↓
Base Service (src/services/api-service.ts)
    ↓
Axios Instance (src/lib/axios.ts) → baseURL: /api/proxy
    ↓
API Proxy Route (src/app/api/proxy/[...path]/route.ts)
    ↓ injects Bearer token from httpOnly cookie
Backend API (API_ENDPOINT)
```

## Base Service Methods

`src/services/api-service.ts` provides 5 HTTP method wrappers:

```typescript
_get(url, config?)      // GET request
_post(url, data?, config?)   // POST request
_put(url, data?, config?)    // PUT request
_patch(url, data?, config?)  // PATCH request
_delete(url, data?, config?) // DELETE request
```

All methods return `response.data` directly (unwrapped from Axios response).

## Creating a New Domain Service

1. Add types in `src/types/[feature].ts`:

```typescript
export interface IOrder {
  id: string
  status: string
  total: number
  createdAt: string
}

export interface ICreateOrderPayload {
  items: { productId: string; quantity: number }[]
}
```

2. Add service in `src/services/[feature]-service.ts`:

```typescript
import { _get, _post, _put, _delete } from './api-service'
import type { IOrder, ICreateOrderPayload } from '@/types/order'
import type { IPaginatedData, IPaginationParams } from '@/types/base'

export const OrderService = {
  getOrders: (params: IPaginationParams): Promise<IPaginatedData<IOrder>> =>
    _get('/v1/orders', { params }),

  getOrder: (id: string): Promise<IOrder> =>
    _get(`/v1/orders/${id}`),

  createOrder: (data: ICreateOrderPayload): Promise<IOrder> =>
    _post('/v1/orders', data),

  updateOrder: (id: string, data: Partial<IOrder>): Promise<IOrder> =>
    _put(`/v1/orders/${id}`, data),

  deleteOrder: (id: string): Promise<void> =>
    _delete(`/v1/orders/${id}`),
}
```

3. Use in component with React Query:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { OrderService } from '@/services/order-service'

// Fetch list
const { data, isLoading } = useQuery({
  queryKey: ['orders', currentPage],
  queryFn: () => OrderService.getOrders({ page: currentPage, limit: PAGE_SIZE }),
})

// Create
const queryClient = useQueryClient()
const createMutation = useMutation({
  mutationFn: OrderService.createOrder,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
})
```

## API Proxy

`src/app/api/proxy/[...path]/route.ts` acts as a server-side proxy:

- Reads `access-token` from httpOnly cookie
- Injects `Authorization: Bearer {token}` header
- Forwards request to `{API_ENDPOINT}/{path}`
- Preserves query parameters
- Handles both JSON and FormData (multipart uploads)
- Returns 401 for non-public endpoints without token

### Public Endpoints (no auth required)

Defined in `PUBLIC_ENDPOINTS` array inside the proxy route:

```typescript
const PUBLIC_ENDPOINTS = ['/v1/auth/login', '/v1/auth/register', '/v1/banks']
```

Add new public endpoints here when needed.

## Axios Configuration

`src/lib/axios.ts`:

| Setting | Value |
| --- | --- |
| Base URL | `/api/proxy` |
| Timeout | 30 seconds |
| Content-Type | `application/json` |

### Response Interceptors

| Status | Action |
| --- | --- |
| 401 | Delete cookies, redirect to `/login` |
| 403 | Log warning to console |

## Error Handling

Services throw errors on failure. Handle in components:

```typescript
const mutation = useMutation({
  mutationFn: OrderService.createOrder,
  onError: (error) => {
    message.error(error.response?.data?.message || 'Something went wrong')
  },
})
```
