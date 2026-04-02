# Session 2: CLAUDE.md & Coding Rules

> **เป้าหมาย:** ทีมเข้าใจระบบ CLAUDE.md 3 ชั้น และกฎการเขียน code ของทีม
> **ระยะเวลา:** 1–1.5 ชั่วโมง

---

## 2.1 CLAUDE.md คืออะไร?

`CLAUDE.md` คือไฟล์ที่ Claude อ่าน **ทุกครั้ง** ที่เปิด session ใหม่ — ทำหน้าที่เป็น **"คู่มือทีม"** ที่บอก AI ว่าต้องทำตามกฎอะไร

### ทำไมถึงสำคัญ?

```
ไม่มี CLAUDE.md:
  Claude: "ฉันจะสร้าง component ด้วย useEffect fetch และ useState ครับ"

มี CLAUDE.md ที่ดี:
  Claude: "ฉันจะสร้าง component ด้วย React Query, Ant Design Table,
           ตั้งชื่อตาม kebab-case, interface prefix ด้วย I ครับ"
```

ยิ่ง CLAUDE.md ดีและครบถ้วนมากเท่าไร → Claude ทำถูกตั้งแต่รอบแรกมากเท่านั้น → ประหยัด token และเวลาในการแก้ไข

---

## 2.2 ระบบ 3 ชั้น (Layer System)

CLAUDE.md มีลำดับชั้น 3 ระดับ โดย **ชั้นที่เฉพาะเจาะจงกว่า override ชั้นที่กว้างกว่า**:

| ชั้น | ไฟล์ | เข้า git | ใครเห็น | เนื้อหาที่ควรใส่ |
|---|---|---|---|---|
| 1 (กว้างสุด) | `~/.claude/CLAUDE.md` | ไม่ | เราคนเดียว | ภาษาที่ชอบ, สไตล์การตอบ, preferences ส่วนตัว |
| 2 (ทีม) | `project/.claude/CLAUDE.md` | ใช่ | ทั้งทีม | Naming conventions, patterns, styling rules |
| 3 (เฉพาะ project) | `project/CLAUDE.md` | ใช่ | ทั้งทีม | Tech stack, commands, architecture, feature checklist |

### ตัวอย่างแต่ละชั้น

**ชั้น 1 — Personal (`~/.claude/CLAUDE.md`):**
```markdown
- ตอบภาษาไทยก่อน ถ้าถามภาษาไทย
- อธิบาย reasoning สั้นๆ ก่อนลงมือทำ
- ถ้าไม่แน่ใจ requirement ให้ถามก่อน อย่า assume
```

**ชั้น 2 — Team (`.claude/CLAUDE.md`):**
```markdown
- Files: kebab-case
- Components: PascalCase
- Interfaces: prefix I
- Fetch data: React Query เท่านั้น ห้าม useEffect
- Styled-components: ไม่ prefix ด้วย Styled
```

**ชั้น 3 — Project (`CLAUDE.md`):**
```markdown
- Framework: Next.js 16 App Router
- UI: Ant Design 6, Tailwind CSS 4
- Route groups: (public), (auth), (main)
- API: ผ่าน /api/proxy/[...path]
```

---

### Workshop 2.2 — เปิดดูไฟล์ทั้ง 3 ชั้น

```bash
# ชั้น 1: personal
cat ~/.claude/CLAUDE.md

# ชั้น 2: team rules
cat .claude/CLAUDE.md

# ชั้น 3: project rules
cat CLAUDE.md
```

**แบบฝึกหัด:** ลองถาม Claude ว่ามันเข้าใจ rules อะไรบ้าง:
```
> "อธิบาย naming conventions ที่ต้องใช้ใน project นี้"
> "บอกหน่อยว่าห้ามทำอะไรใน project นี้บ้าง"
```

---

## 2.3 Coding Rules ของทีม

Rules เหล่านี้ Claude จะปฏิบัติตามอัตโนมัติ เพราะอยู่ใน CLAUDE.md — แต่ทีมต้องเข้าใจด้วยเพื่อ review ได้

---

### Naming Conventions

#### Files และ Folders — kebab-case

```
✅ ถูก:
  order-service.ts
  use-is-mobile.ts
  auth-context.tsx
  order-detail/

❌ ผิด:
  OrderService.ts
  useIsMobile.ts
  AuthContext.tsx
  orderDetail/
```

#### Components — PascalCase

```tsx
// ✅ ถูก
export default function OrderTable() { ... }
export default function LoginForm() { ... }

// ❌ ผิด
export default function orderTable() { ... }
export default function login_form() { ... }
```

#### Interfaces — Prefix ด้วย `I`

```typescript
// ✅ ถูก
interface IUser {
  id: number
  name: string
}

interface IOrderListResponse {
  data: IOrder[]
  total: number
}

// ❌ ผิด
interface User { ... }
interface OrderListResponse { ... }
type UserType = { ... }
```

#### Constants — UPPER_SNAKE_CASE

```typescript
// ✅ ถูก
const PAGE_SIZE = 20
const API_TIMEOUT = 5000
const MAX_RETRY = 3

// ❌ ผิด
const pageSize = 20
const apiTimeout = 5000
```

---

### Import Ordering

Import ต้องเรียงลำดับ 3 กลุ่ม โดยมีบรรทัดว่างคั่น:

```typescript
// ✅ ถูก — 3 กลุ่ม, มีบรรทัดว่างคั่น
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'
import { Table, Button, Form } from 'antd'
import styled from 'styled-components'

import type { IOrder } from '@/types/order'
import { OrderService } from '@/services/order-service'
import { useTranslations } from 'next-intl'

// ❌ ผิด — ปนกัน ไม่มีบรรทัดว่าง
import { useState } from 'react'
import { OrderService } from '@/services/order-service'
import { Table } from 'antd'
import { useRouter } from 'next/navigation'
```

**กลุ่มที่ 1:** React, Next.js core
**กลุ่มที่ 2:** External packages (antd, tanstack, styled-components, ฯลฯ)
**กลุ่มที่ 3:** Internal `@/` paths

---

### Component File Structure

ใน component file ให้เรียงลำดับดังนี้:

```typescript
// 1. Imports (ตาม ordering rules)
import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Table, Button } from 'antd'
import styled from 'styled-components'

import type { IOrder } from '@/types/order'
import { OrderService } from '@/services/order-service'

// 2. Helper types / local interfaces (ถ้ามีและเล็กพอ)
interface IProps {
  userId: number
}

// 3. Component (export default)
export default function OrderTable({ userId }: IProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['orders', userId],
    queryFn: () => OrderService.getOrders({ userId }),
  })

  return (
    <Container>
      <Table
        dataSource={data?.data}
        loading={isLoading}
        rowKey="id"
      />
    </Container>
  )
}

// 4. Styled-components (ล่างสุดเสมอ)
const Container = styled.div`
  padding: 24px;
`
```

---

### Data Fetching — React Query เท่านั้น

```typescript
// ✅ ถูก — React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['orders', currentPage, filters],
  queryFn: () => OrderService.getOrders({ page: currentPage, ...filters }),
})

// ❌ ผิด — useEffect fetch
useEffect(() => {
  fetch('/api/orders')
    .then(res => res.json())
    .then(data => setOrders(data))
}, [])

// ❌ ผิด — useState เก็บ server data
const [orders, setOrders] = useState([])
```

**เหตุผล:** React Query จัดการ caching, loading state, error state, refetch ให้อัตโนมัติ — เขียนน้อยกว่าและ bug น้อยกว่ามาก

---

### Pagination Convention

ทุก list page ที่ดึงข้อมูลจาก API **ต้องใช้ server-side pagination**:

```typescript
const PAGE_SIZE = 20
const [currentPage, setCurrentPage] = useState(1)

// Reset page เมื่อ filter เปลี่ยน
const handleFilterChange = (newFilters: IFilters) => {
  setFilters(newFilters)
  setCurrentPage(1)  // ← สำคัญ!
}

const { data } = useQuery({
  queryKey: ['orders', currentPage, filters],
  queryFn: () => OrderService.getOrders({
    page: currentPage,
    limit: PAGE_SIZE,
    ...filters,
  }),
})

<Table
  dataSource={data?.data}
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

---

### Styling — 3 Layers

ใช้ 3 เครื่องมือให้ถูกที่:

#### Layer 1: Ant Design — UI Components หลัก

ถ้า Ant Design มี component ให้ → **ใช้ Ant Design เท่านั้น** ห้ามสร้างเอง

```tsx
// ✅ ใช้ Ant Design
<Button type="primary" loading={isSubmitting}>บันทึก</Button>
<Input placeholder="ชื่อ" />
<Select options={options} />
<Table dataSource={data} columns={columns} />
<Modal open={isOpen} title="ยืนยัน">...</Modal>
<DatePicker format="DD/MM/YYYY" />

// ❌ อย่าสร้าง custom button/input/modal ถ้า Ant มีให้
```

#### Layer 2: styled-components — Layout Wrappers

ใช้สำหรับ layout custom ที่ Ant ทำไม่ได้:

```typescript
// ✅ ถูก — semantic PascalCase, ไม่ prefix Styled
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`

const HeaderSection = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`

// ❌ ผิด — prefix Styled
const StyledContainer = styled.div`...`
const StyledHeader = styled.header`...`

// ❌ ผิด — ใช้ styled-components style Ant components (ใช้ theme แทน)
const StyledButton = styled(Button)`color: red;`
```

#### Layer 3: Tailwind CSS — Utility เล็กๆ

ใช้สำหรับ spacing, alignment, flex เล็กๆ เท่านั้น:

```tsx
// ✅ ถูก — utility เล็กๆ
<div className="flex gap-4 mb-6">
<div className="pt-2 text-sm">
<div className="flex items-center justify-between">

// ❌ ผิด — full layout ด้วย Tailwind
<div className="flex flex-col min-h-screen bg-gray-100 px-4 py-8 max-w-6xl mx-auto">

// ❌ ผิด — ใช้ Tailwind style Ant components
<Button className="bg-orange-500 text-white rounded-lg px-6">
```

---

### Workshop 2.3 — เขียน Component ตาม Rules

**โจทย์:** สร้าง `ProductTable` component สำหรับแสดงรายการสินค้า

```typescript
// src/types/product.ts
interface IProduct {
  id: number
  name: string
  price: number
  stock: number
}
```

**ขั้นตอน:**

```bash
# 1. เปิด Claude Code
claude

# 2. สั่ง Claude สร้าง component
> "สร้าง component ProductTable ที่ src/components/products/product-table.tsx
   - รับ prop: products: IProduct[] และ loading: boolean
   - แสดงเป็น Ant Design Table มีคอลัมน์: ชื่อ, ราคา, จำนวนสต็อก
   - ทำตาม coding rules ใน CLAUDE.md ทุกข้อ"

# 3. Review ดูว่า Claude ทำตาม rules ไหม:
#    - import ordering ถูกต้อง?
#    - styled-component อยู่ล่างสุด?
#    - ไม่ใช้ Styled prefix?
#    - type มี I prefix?
```

---

## 2.4 Project Architecture

### Tech Stack

| Category | Technology | เหตุผลที่เลือก |
|---|---|---|
| Framework | Next.js 16+ (App Router) | SSR, routing, API routes |
| UI Components | Ant Design 6 | Component library สมบูรณ์ |
| Layout/Custom | styled-components 6 | Custom layout wrappers |
| Utility CSS | Tailwind CSS 4 | Spacing, alignment เร็ว |
| State/Cache | TanStack React Query v5 | Server state management |
| HTTP | Axios via API Proxy | Auth token injection |
| i18n | next-intl | Thai/English support |

---

### Route Groups

```
src/app/[locale]/
├── (public)/          ← หน้าสาธารณะ (navbar + footer)
│   └── page.tsx       → /
├── (auth)/            ← หน้า login/register (layout เรียบง่าย)
│   ├── login/
│   └── register/
└── (main)/            ← หน้า authenticated (full layout + sidebar)
    ├── dashboard/
    ├── orders/
    └── profile/
```

### Request Flow

```
Component
  ↓ useQuery / useMutation
src/services/[feature]-service.ts
  ↓ _get() / _post() จาก api-service.ts
  ↓ Axios (base URL = /api/proxy)
src/app/api/proxy/[...path]/route.ts
  ↓ อ่าน httpOnly cookie "access-token"
  ↓ ใส่ Authorization: Bearer <token>
Backend API (API_ENDPOINT)
```

**ทำไมต้องผ่าน proxy?**
- Token อยู่ใน httpOnly cookie → JavaScript ใน browser อ่านไม่ได้
- Proxy ที่ server-side อ่านได้และใส่ header ให้

---

### Service Layer Pattern

```typescript
// src/services/order-service.ts
import { _get, _post, _put, _delete } from './api-service'
import type { IOrder, IOrderListResponse, ICreateOrderPayload } from '@/types/order'

export const OrderService = {
  // GET /v1/orders?page=1&limit=20
  getOrders: (params: { page: number; limit: number }) =>
    _get<IOrderListResponse>('/v1/orders', { params }),

  // GET /v1/orders/:id
  getOrderById: (id: number) =>
    _get<IOrder>(`/v1/orders/${id}`),

  // POST /v1/orders
  createOrder: (data: ICreateOrderPayload) =>
    _post<IOrder>('/v1/orders', data),
}
```

---

### Adding a New Feature — Checklist

เมื่อต้องสร้าง feature ใหม่ ทำตามลำดับ:

```
1. src/types/[feature].ts          ← define IFeature, IFeatureListResponse
2. src/services/[feature]-service.ts ← API calls
3. src/app/[locale]/(main)/[feature]/page.tsx ← page component
4. src/components/[feature]/       ← sub-components (ถ้ามี)
5. src/messages/th/common.json     ← Thai translations
6. src/messages/en/common.json     ← English translations
7. src/proxy.ts                    ← route protection (ถ้า authenticated)
8. Navigation menu                 ← เพิ่ม link (ถ้าจำเป็น)
```

---

### Workshop 2.4 — สร้าง Feature ตาม Checklist

**โจทย์:** สร้าง feature "รายงาน" (reports) แบบ minimal

```bash
# สั่ง Claude แบบครบในรอบเดียว
> "สร้าง feature reports ตาม checklist ใน CLAUDE.md:
   1. src/types/report.ts — IReport { id, title, createdAt }
   2. src/services/report-service.ts — getReports() → GET /v1/reports
   3. src/app/[locale]/(main)/reports/page.tsx — Table + pagination
   4. เพิ่ม key 'reports' ใน src/messages/th/common.json และ en/common.json
   ใช้ PAGE_SIZE = 20, React Query, Ant Design Table ตาม convention"
```

**หลังจาก Claude ทำเสร็จ ตรวจสอบ:**
- [ ] Types มี `I` prefix ทุกตัว?
- [ ] File names เป็น kebab-case?
- [ ] Import ordering ถูกต้อง?
- [ ] ใช้ React Query ไม่ใช้ useEffect?
- [ ] Pagination ตาม convention (PAGE_SIZE, hideOnSinglePage, showSizeChanger: false)?
- [ ] styled-components อยู่ล่างสุด?

---

## สรุป Session 2

| หัวข้อ | สิ่งสำคัญที่ต้องจำ |
|---|---|
| CLAUDE.md | ไฟล์ที่ Claude อ่านทุก session — ยิ่งครบ Claude ยิ่งทำถูก |
| 3 ชั้น | Personal > Team > Project — เฉพาะกว่า override กว้างกว่า |
| Naming | kebab-case files, PascalCase components, I prefix interfaces |
| Data fetching | React Query เท่านั้น — ห้าม useEffect fetch |
| Styling | Ant Design → styled-components → Tailwind (ตามลำดับ) |
| Feature checklist | types → service → page → components → i18n → proxy → nav |

---

**ถัดไป → [Session 3: ประหยัด Token & Custom Commands](session-3-token-commands.md)**
