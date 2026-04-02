# Cheat Sheet — Claude Code

> สรุปคำสั่งและทริคสำคัญ — แจกทุก session

---

## คำสั่งพื้นฐาน

```
เปิด Session
  claude                    เปิดใน project ปัจจุบัน
  claude --resume           เปิด session ล่าสุด
  claude "prompt"           เปิดพร้อมสั่งงาน
  claude --auto-compact     เปิดพร้อม auto-compact

Slash Commands
  /help                     ดูคำสั่งทั้งหมด
  /clear                    ล้าง context (ใช้เมื่อเปลี่ยน topic)
  /undo                     ย้อนการแก้ไขไฟล์ล่าสุด
  /compact                  บีบ context ให้สั้นลง
  /model                    สลับ model
  /review                   ขอ code review
  /commit                   สร้าง git commit

ใน Session
  @filename                 อ้างอิงไฟล์ใน prompt
  ! command                 รัน shell command (เช่น ! git status)
  Shift+Tab                 เปิด/ปิด Plan Mode
  Esc                       หยุดการทำงาน / ยกเลิก
  Ctrl+C                    ออกจาก session
  ↑ / ↓                     เลื่อนดู prompt history
```

---

## เลือก Model

```
Haiku    → งานง่าย ถูกสุด เร็วสุด
           แก้ typo, rename, ถาม syntax, format code

Sonnet   → งานทั่วไป balanced (default)
           เขียน feature, แก้ bug, refactor

Opus     → งานซับซ้อน ฉลาดสุด แพงสุด
           design architecture, debug ซับซ้อน, code review ลึก
```

---

## ประหยัด Token

```
1.  ชี้ไฟล์ให้ชัด       @src/... ไม่ต้องให้ Claude ค้นหาเอง
2.  1 งาน = 1 session   ปิด session เมื่อเสร็จ เริ่มใหม่สำหรับงานถัดไป
3.  /compact             ใช้เมื่อ session ยาวมาก (20+ messages)
4.  บอกให้ตอบสั้น        "ตอบแค่ code ไม่ต้องอธิบาย"
5.  อย่าให้อ่านทั้งไฟล์  ระบุ section หรือบรรทัดที่สนใจ
6.  Paste error สั้นๆ    แค่ message + file + line number
7.  /clear เมื่อเปลี่ยน topic  ล้าง context ที่ไม่เกี่ยวข้อง
8.  เลือก model ให้เหมาะ  Haiku สำหรับงานง่าย
9.  Plan Mode ก่อนงานใหญ่  Shift+Tab — ดูแผนก่อนลงมือ
10. CLAUDE.md ครบถ้วน   Claude ทำถูกตั้งแต่รอบแรก = ไม่ต้องแก้ซ้ำ
```

---

## สั่งงานที่ดี

```
หลักการ: Context + เป้าหมาย + ขอบเขต

❌  "แก้ bug"
✅  "login แล้ว redirect ไม่ทำงาน ดู @src/contexts/auth-context.tsx
    บรรทัด 37 — หลัง login สำเร็จให้ redirect ไป /dashboard"

❌  "ทำหน้า order"
✅  "สร้างหน้า order list ที่ src/app/[locale]/(main)/orders/page.tsx
    ดึงจาก GET /v1/orders, Ant Design Table, server-side pagination
    ตาม convention ใน CLAUDE.md"

❌  "ทำ search"
✅  "เพิ่ม Input.Search ใน @src/.../orders/page.tsx
    state: searchKeyword, ส่งไปเป็น param ใน useQuery
    reset page=1 เมื่อ keyword เปลี่ยน — ตอบแค่ code diff"
```

---

## CLAUDE.md — 3 ชั้น

```
ชั้น 1  ~/.claude/CLAUDE.md          rule ส่วนตัว (ไม่เข้า git)
        → ภาษา, สไตล์การตอบ, personal preferences

ชั้น 2  project/.claude/CLAUDE.md    rule ทีม (เข้า git)
        → naming, patterns, styling rules, anti-patterns

ชั้น 3  project/CLAUDE.md            rule เฉพาะ project (เข้า git)
        → tech stack, commands, architecture, feature checklist

ชั้นที่เฉพาะกว่า override ชั้นที่กว้างกว่า
```

---

## Naming Conventions

```
Files/Folders:   kebab-case       order-service.ts    auth-context.tsx
Components:      PascalCase       OrderTable          LoginForm
Interfaces:      prefix I         IUser               IOrderListResponse
Constants:       UPPER_SNAKE      PAGE_SIZE           API_TIMEOUT
```

---

## Import Ordering

```typescript
// กลุ่ม 1: React / Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// กลุ่ม 2: External packages
import { useQuery } from '@tanstack/react-query'
import { Table, Button } from 'antd'

// กลุ่ม 3: Internal @/
import type { IOrder } from '@/types/order'
import { OrderService } from '@/services/order-service'
```

---

## Styling — 3 Layers

```
1. Ant Design      UI components หลัก
                   Button, Input, Table, Modal, Form, Select, DatePicker
                   → ถ้า Ant มีให้ ใช้ Ant อย่าสร้างเอง

2. styled-components  layout wrappers custom
                      PascalCase semantic (PageContainer, HeaderSection)
                      ห้าม prefix Styled
                      วางไว้ล่างสุดของไฟล์เสมอ

3. Tailwind        utility เล็กๆ เท่านั้น
                   flex, gap, mb, pt, items-center, justify-between
                   ห้ามใช้ทำ full layout
```

---

## Data Fetching

```typescript
// ✅ React Query เท่านั้น
const { data, isLoading } = useQuery({
  queryKey: ['orders', currentPage],
  queryFn: () => OrderService.getOrders({ page: currentPage }),
})

// ❌ ห้าม useEffect fetch
// ❌ ห้าม useState เก็บ server data
```

---

## Pagination Convention

```typescript
const PAGE_SIZE = 20
const [currentPage, setCurrentPage] = useState(1)

// Reset เมื่อ filter เปลี่ยน
setCurrentPage(1)

// Table props
pagination={{
  current: currentPage,
  pageSize: PAGE_SIZE,
  total: data?.total ?? 0,
  hideOnSinglePage: true,
  onChange: (page) => setCurrentPage(page),
  showSizeChanger: false,
}}
```

---

## Workflow สั้นๆ

```
งานปกติ:
  claude → สั่ง → review → ! pnpm lint → ! git add → /commit → Ctrl+C

งานใหญ่:
  claude → Shift+Tab (Plan Mode) → ดูแผน → approve
  → implement → ! git add → /commit ทีละส่วน → Ctrl+C

Debug:
  claude → paste error (สั้นๆ) + @file:line
  → วิเคราะห์ก่อน ("อย่าแก้ยัง") → เข้าใจแล้ว → แก้ → test → /commit
```

---

## Custom Commands

```
ที่เก็บ:  .claude/commands/[name].md
เรียกใช้: /name ใน session

ตัวอย่าง:
  /review       → review staged code ตาม rules
  /commit       → สร้าง commit message
  /new-feature  → scaffold feature ใหม่ตาม checklist
```

---

## Feature Checklist

```
เมื่อสร้าง feature ใหม่ ทำตามลำดับ:

1. src/types/[feature].ts           IFeature interface
2. src/services/[feature]-service.ts  API calls
3. src/app/[locale]/(main)/[feature]/page.tsx  page
4. src/components/[feature]/        sub-components (ถ้ามี)
5. src/messages/th/common.json      Thai translations
6. src/messages/en/common.json      English translations
7. src/proxy.ts                     route protection
8. Navigation menu                  เพิ่ม link
```

---

## แผนการอบรม

```
Session 1  พื้นฐาน Claude Code       1–1.5 ชม.
Session 2  CLAUDE.md & Rules         1–1.5 ชม.
Session 3  Token & Commands          1 ชม.
Session 4  Superpowers               1.5–2 ชม.
```

---

## ข้อควรระวัง

```
✅ ทำเสมอ                    ❌ อย่าทำ
Review ก่อน accept           Commit โดยไม่ review
/undo เมื่อไม่ถูกใจ          Push ทันทีหลัง Claude แก้
Commit บ่อย (checkpoint)     ใส่ secrets ลงใน chat
pnpm lint ก่อน commit        Blindly accept ทุก suggestion
ปิด session เมื่อเสร็จงาน    ปล่อย session ค้างข้ามวัน
```
