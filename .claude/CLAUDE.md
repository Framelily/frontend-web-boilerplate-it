# Team Coding Rules — CyberRich Digital Frontend

> ไฟล์นี้คือกฎการเขียน code สำหรับทีม commit เข้า git ทุกคนในทีมต้องทำตาม
> Claude Code จะอ่านไฟล์นี้ทุกครั้งที่เปิด session

## Naming Conventions

### Files & Folders

ใช้ **kebab-case** เสมอ:

```
src/services/order-service.ts      ✅
src/services/OrderService.ts       ❌
src/services/orderService.ts       ❌

src/hooks/use-is-mobile.ts         ✅
src/hooks/useIsMobile.ts           ❌

src/components/order-detail/       ✅
src/components/OrderDetail/        ❌
```

### Components

ใช้ **PascalCase** สำหรับชื่อ function:

```typescript
// file: src/components/order/order-table.tsx
export default function OrderTable() { ... }    ✅
export default function orderTable() { ... }    ❌
export default function order_table() { ... }   ❌
```

### Types & Interfaces

prefix **`I`** สำหรับ interfaces:

```typescript
export interface IUser { ... }          ✅
export interface ILoginPayload { ... }  ✅
export interface IResponse<T> { ... }   ✅

export interface User { ... }           ❌
export interface LoginPayload { ... }   ❌
```

Type aliases ไม่ต้อง prefix:

```typescript
export type AuthUser = IUser | null     ✅
export type OrderStatus = 'pending' | 'completed'  ✅
```

### Variables & Functions

ใช้ **camelCase**:

```typescript
const currentPage = 1                   ✅
const isLoading = true                  ✅
function getOrderList() { ... }         ✅

const current_page = 1                  ❌
const IsLoading = true                  ❌
```

### Constants

ใช้ **UPPER_SNAKE_CASE** สำหรับค่าคงที่:

```typescript
const PAGE_SIZE = 20                    ✅
const API_TIMEOUT = 30000               ✅
const MAX_RETRY_COUNT = 3               ✅
```

## Code Style

### Formatting (Prettier)

```
No semicolons
Single quotes
Trailing commas
120 character width
2-space indent
```

### Imports — เรียงลำดับเสมอ

```typescript
// 1. React / Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. External packages
import { useQuery } from '@tanstack/react-query'
import { Button, Table } from 'antd'

// 3. Internal (path alias @/)
import { OrderService } from '@/services/order-service'
import type { IOrder } from '@/types/order'
```

แต่ละกลุ่มคั่นด้วย **blank line**

### Type Imports

แยก type import เสมอ:

```typescript
import { Button } from 'antd'
import type { ButtonProps } from 'antd'          ✅

import { Button, type ButtonProps } from 'antd'  ❌
```

## Component Pattern

### File Structure ภายใน Component

```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from 'antd'
import styled from 'styled-components'

// 2. Types (ถ้าเล็ก ใส่ในไฟล์เดียวกัน)
interface OrderTableProps {
  orders: IOrder[]
}

// 3. Component
export default function OrderTable({ orders }: OrderTableProps) {
  const [page, setPage] = useState(1)

  return (
    <Container>
      <Table dataSource={orders} />
    </Container>
  )
}

// 4. Styled Components (ล่างสุดเสมอ)
const Container = styled.div`
  padding: 24px;
`
```

### Data Fetching — ใช้ React Query เท่านั้น

```typescript
// ✅ ถูก
const { data, isLoading } = useQuery({
  queryKey: ['orders', filters],
  queryFn: () => OrderService.getOrders(filters),
})

// ❌ ผิด — ห้ามใช้ useEffect fetch data
useEffect(() => {
  fetch('/api/orders').then(...)
}, [])

// ❌ ผิด — ห้ามเก็บ server data ใน useState
const [orders, setOrders] = useState([])
```

### Mutation — ใช้ useMutation

```typescript
const { mutate, isPending } = useMutation({
  mutationFn: (data: ICreateOrder) => OrderService.createOrder(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] })
    message.success('สร้าง order สำเร็จ')
  },
})
```

## Service Layer Pattern

### สร้าง Service ใหม่

```typescript
// src/services/order-service.ts
import { _get, _post, _put, _delete } from './api-service'
import type { IOrder, ICreateOrder } from '@/types/order'
import type { IPaginatedData, IPaginationParams } from '@/types/base'

export const OrderService = {
  getOrders: (params: IPaginationParams) =>
    _get<IPaginatedData<IOrder>>('/v1/orders', { params }),

  getOrder: (id: string) =>
    _get<IOrder>(`/v1/orders/${id}`),

  createOrder: (data: ICreateOrder) =>
    _post<IOrder>('/v1/orders', data),

  updateOrder: (id: string, data: Partial<ICreateOrder>) =>
    _put<IOrder>(`/v1/orders/${id}`, data),

  deleteOrder: (id: string) =>
    _delete(`/v1/orders/${id}`),
}
```

### สร้าง Types ใหม่

```typescript
// src/types/order.ts
export interface IOrder {
  id: string
  name: string
  status: OrderStatus
  total: number
  createdAt: string
  updatedAt: string
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export interface ICreateOrder {
  name: string
  items: IOrderItem[]
}
```

## Styling Rules — 3 Layers

### Layer 1: Ant Design (ใช้ก่อนเสมอ)

ถ้า Ant Design มี component → ใช้ Ant Design **ห้ามสร้าง custom**:

```typescript
// ✅ ใช้ Ant Design
<Button type="primary">Submit</Button>
<Input placeholder="Search..." />
<Table dataSource={data} columns={columns} />
<Modal open={isOpen} onCancel={onClose}>...</Modal>
<DatePicker onChange={onDateChange} />

// ❌ ห้ามสร้าง custom ถ้า Ant มี
<button className="btn-primary">Submit</button>
<input className="search-input" />
```

### Layer 2: styled-components (layout ที่ Ant ทำไม่ได้)

ใช้ชื่อ **PascalCase แบบ semantic** ห้ามใช้ prefix `Styled`:

```typescript
// ✅
const PageContainer = styled.div`...`
const HeaderWrapper = styled.header`...`
const CardGrid = styled.div`...`

// ❌
const StyledDiv = styled.div`...`
const StyledHeader = styled.header`...`
const Wrapper = styled.div`...`    // ไม่ semantic พอ
```

### Layer 3: Tailwind CSS (utility เล็กๆ เท่านั้น)

ใช้แค่ spacing, alignment, flex:

```typescript
// ✅ utility เล็กๆ
<div className="flex gap-4 mb-6 pt-2">
<span className="text-sm text-gray-500">

// ❌ ห้ามใช้ Tailwind ทำ layout เต็มรูปแบบ
<div className="w-full max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md">
```

## Pagination — Server-side เสมอ

ทุกหน้า list ที่มี API data **ต้อง** ใช้ server-side pagination:

```typescript
const PAGE_SIZE = 20
const [currentPage, setCurrentPage] = useState(1)

const { data } = useQuery({
  queryKey: ['orders', currentPage, filters],
  queryFn: () => OrderService.getOrders({
    page: currentPage,
    limit: PAGE_SIZE,
    ...filters,
  }),
})

// Reset page เมื่อ filter เปลี่ยน
useEffect(() => {
  setCurrentPage(1)
}, [filters])

<Table
  pagination={{
    current: currentPage,
    pageSize: PAGE_SIZE,
    total: data?.total ?? 0,
    hideOnSinglePage: true,
    onChange: (page) => setCurrentPage(page),
    showSizeChanger: false,
  }}
/>
```

## Environment Variables

```typescript
// ❌ ห้ามเรียก process.env ตรง
const api = process.env.API_ENDPOINT

// ✅ import จาก config
import { API_ENDPOINT } from '@/configs'
```

## Things to NEVER Do

- ใช้ `any` type → กำหนด type ให้ชัดเจน
- ใช้ `console.log` → ใช้ `console.info`, `console.warn`, `console.error`
- ใช้ `useEffect` fetch data → ใช้ React Query
- เก็บ server data ใน `useState` → ให้ React Query จัดการ cache
- สร้าง custom component ที่ Ant Design มีอยู่แล้ว
- ใช้ `.d.ts` สำหรับ feature types → ใช้ `.ts` + explicit exports
- Commit `.env` ที่มี secrets → ใช้ `.env.example`
- ใช้ Tailwind ทำ full layout → ใช้ styled-components
- ตั้งชื่อ styled-components ด้วย prefix `Styled` → ใช้ชื่อ semantic
