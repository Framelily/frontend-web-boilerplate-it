# State Management

## Overview

| Type | Tool | Use Case |
| --- | --- | --- |
| **Server state** | TanStack React Query v5 | API data fetching, caching, invalidation |
| **Auth state** | React Context (AuthProvider) | User session, login/logout |
| **Client state** | React useState | UI state (modals, forms, tabs) |
| **Complex client state** | Zustand (if needed) | Cart, multi-step forms, shared UI state |

## TanStack React Query

Primary tool for all API data. **Never use useEffect + useState for data fetching.**

### Configuration

`src/utils/query-client.ts`:

```typescript
{
  queries: {
    retry: false,                // Don't retry failed requests
    refetchOnWindowFocus: false, // Don't refetch when tab gains focus
    staleTime: 60 * 1000,       // Data considered fresh for 60 seconds
  },
  mutations: {
    retry: false,
  },
}
```

### Fetching Data

```typescript
import { useQuery } from '@tanstack/react-query'
import { OrderService } from '@/services/order-service'

const { data, isLoading, error } = useQuery({
  queryKey: ['orders', currentPage, filters],
  queryFn: () => OrderService.getOrders({ page: currentPage, limit: PAGE_SIZE, ...filters }),
})
```

### Mutating Data

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

const createOrder = useMutation({
  mutationFn: OrderService.createOrder,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] })
    message.success('Order created')
  },
  onError: (error) => {
    message.error(error.response?.data?.message || 'Failed')
  },
})

// Usage
createOrder.mutate({ items: [...] })
```

### Query Key Convention

```typescript
// List with pagination/filters
queryKey: ['orders', currentPage, filters]

// Single item
queryKey: ['orders', orderId]

// Nested resource
queryKey: ['orders', orderId, 'items']
```

## Auth Context

See [authentication.md](./authentication.md).

```typescript
const { user, isAuthenticated, login, logout } = useAuth()
```

## When to Add Zustand

Add Zustand only if you have **client-side state shared across multiple components** that doesn't come from the server. Examples:

- Shopping cart state
- Multi-step form wizard progress
- Complex UI state (sidebar collapse, selected tabs across pages)

### Zustand Pattern

```typescript
// src/store/cart-store.ts
import { create } from 'zustand'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  reset: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  reset: () => set({ items: [] }),
}))
```

## Common Mistakes

- **Don't** store API data in useState → use React Query
- **Don't** use useEffect to fetch data → use useQuery
- **Don't** create Context for server data → use React Query
- **Don't** add Zustand for single-component state → use useState
- **Don't** forget to invalidate queries after mutations
