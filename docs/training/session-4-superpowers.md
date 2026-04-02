# Session 4: Superpowers — Workflow แบบมืออาชีพ

> **เป้าหมาย:** ทีมเข้าใจ Superpowers workflow ทั้ง 9 ขั้นตอน และใช้งานได้จริง
> **ระยะเวลา:** 1.5–2 ชั่วโมง

---

## 4.1 Superpowers คืออะไร?

**Superpowers** คือ plugin ที่เปลี่ยน Claude จาก "สั่งทีละอย่าง" → "กระบวนการพัฒนาแบบมืออาชีพ" — มีขั้นตอนชัดเจน มี review ทุก step ทำให้ได้งานที่ตรงใจตั้งแต่รอบแรก

### ติดตั้ง

```bash
claude /install-plugin superpowers
```

### ใช้งาน

**ไม่ต้องเรียก skill เอง** — แค่บอกว่าอยากทำอะไร Claude จะเข้า workflow อัตโนมัติ

```
You: "ทำหน้า order management พร้อม filter และ pagination"
```

Claude จะเดิน workflow 7 ขั้นตอนให้เอง:

```
1. Brainstorming         → ถาม-ตอบเพื่อเข้าใจ requirement ให้ชัด
2. Design                → เสนอ 2-3 แนวทาง ให้เราเลือก
3. Spec                  → เขียน spec document แล้วให้ review
4. Plan                  → แบ่งงานเป็น task ย่อยๆ พร้อม code ตัวอย่าง
5. Implementation (TDD)  → ทำทีละ task ด้วย TDD (test first)
6. Code Review           → review ทุก task ว่าตรง spec ไหม
7. Finish                → merge / สร้าง PR
```

---

## 4.2 ทำไมต้องใช้ Superpowers?

| ไม่ใช้ Superpowers | ใช้ Superpowers |
|---|---|
| Claude เขียน code ทันทีโดยไม่ถาม | คิดก่อนทำ มี brainstorm ก่อน |
| อาจได้ของไม่ตรงใจ ต้องแก้ซ้ำ | ตรงใจตั้งแต่รอบแรก |
| ไม่มี spec — ไม่รู้ว่าทำอะไร | มี spec ชัดเจน ทีมอ่านได้ |
| ไม่มี test | TDD — เขียน test ก่อน code |
| ไม่มี review | มี spec review + code quality review |
| แก้แล้วแก้อีก เสีย token | ทำถูกตั้งแต่รอบแรก ประหยัด token |

---

## 4.3 เมื่อไหร่ควรใช้ / ไม่ต้องใช้

| ควรใช้ Superpowers | ไม่ต้องใช้ |
|---|---|
| สร้าง feature ใหม่ | แก้ typo หรือ rename ตัวแปร |
| งานที่ต้องคิด design | เพิ่ม field 1 ตัว |
| งานที่กระทบหลายไฟล์ | แก้ bug ง่ายๆ ที่รู้ตำแหน่งแล้ว |
| งานที่ต้องมี test | ถามคำถาม / ขอคำอธิบาย |
| Debug ซับซ้อน ไม่รู้ root cause | งาน one-off ที่ไม่ต้อง maintain |

> **สรุปง่ายๆ:** ถ้างานนั้นคุ้มค่ากับการวางแผน ใช้ Superpowers ถ้างานเล็กมากและรู้ว่าต้องทำอะไรชัดเจน ทำตรงๆ ได้เลย

---

## 4.4 ขั้นตอนที่ 1: Brainstorming — คิดก่อนทำ

### คืออะไร?

Brainstorming คือขั้นตอนที่ Claude **ถามคำถามทีละข้อ** เพื่อเข้าใจสิ่งที่ต้องการให้ชัดก่อนเริ่มเขียน code — เหมือน BA (Business Analyst) สัมภาษณ์ requirement

### ทำงานยังไง?

```
You: "ทำหน้า order management"
         │
         ▼
Claude: "order มี field อะไรบ้าง?"          ← คำถามที่ 1
         │
You: "id, name, status, total, createdAt"
         │
         ▼
Claude: "แสดงเป็น table หรือ card?"          ← คำถามที่ 2
         │
You: "table"
         │
         ▼
Claude: "ต้องมี filter ไหม?                  ← คำถามที่ 3
  1. แค่แสดง list + pagination
  2. มี filter ด้วย (status, date range)
  3. มี search + filter + export"
         │
You: "2"
         │
         ▼
Claude: "API endpoint เป็นยังไง?"            ← คำถามที่ 4
         │
You: "GET /v1/orders มี query params page, limit, status"
```

สังเกตว่า Claude ถาม **ทีละข้อ** ไม่ถามรวบ — ทำให้ตอบง่าย คิดทีละเรื่อง เหมือนคุยกับเพื่อนร่วมทีม

### ทำไมต้อง Brainstorm?

| ไม่ Brainstorm | Brainstorm |
|---|---|
| Claude เดาเอง อาจผิดทั้งหมด | Claude เข้าใจ requirement ชัดเจน |
| ได้ของไม่ตรงใจ ต้องแก้ซ้ำ | ตรงใจตั้งแต่รอบแรก |
| เสีย token ไปกับการ redo | ประหยัด token |

### ทริค

- **ตอบให้ชัดเจน** — ยิ่งตอบดี spec ยิ่งตรง
- **บอกสิ่งที่ไม่ต้องการด้วย** — "ไม่ต้องมี export" ช่วยจำกัดขอบเขต
- **ใช้ multiple choice** — Claude ชอบให้เลือก 1/2/3 ตอบง่ายกว่าเขียนเอง

---

## 4.5 ขั้นตอนที่ 2: Design — เสนอแนวทาง

### คืออะไร?

หลัง brainstorm เข้าใจ requirement แล้ว Claude จะเสนอ **2-3 approaches** พร้อมข้อดี-ข้อเสียของแต่ละแบบ ให้เราเลือกก่อน implement

### ตัวอย่าง

```
Claude: "มี 3 แนวทาง:"

1. Server-side pagination (แนะนำ)
   ข้อดี: เร็ว, รองรับข้อมูลเยอะ
   ข้อเสีย: ต้อง API รองรับ pagination

2. Client-side pagination
   ข้อดี: API ง่าย ไม่ต้องเปลี่ยน backend
   ข้อเสีย: ช้าถ้าข้อมูลเยอะ ดึงข้อมูลทั้งหมดมาพร้อมกัน

3. Infinite scroll
   ข้อดี: UX ดี รู้สึกลื่น
   ข้อเสีย: ซับซ้อน ยากต่อการจัดการ state

"แนะนำ option 1 เพราะรองรับ data scale ได้ดีในระยะยาว"

You: "1"
```

### ทำงานยังไง?

```
Brainstorm เสร็จ
      │
      ▼
Claude วิเคราะห์ options ที่เป็นไปได้
      │
      ▼
เสนอ 2-3 แนวทาง + ข้อดี/ข้อเสีย + คำแนะนำ
      │
      ▼
เราเลือก → ไป Spec
```

### ทำไมต้องมีขั้นตอนนี้?

เพราะไม่มี "วิธีเดียวที่ถูก" — Claude ให้เราเห็นทางเลือก แล้วตัดสินใจเอง แทนที่จะเลือกให้โดยเราไม่รู้ว่ามีทางอื่น ถ้าเลือกแบบผิด แก้ตอนนี้ถูกกว่าแก้หลัง implement เสร็จแล้วมาก

### ทริค

- ถ้าไม่แน่ใจ เลือกตามที่ Claude แนะนำก่อน — Claude มีเหตุผลเสมอ
- ถ้ามี constraint พิเศษ (เช่น ทีม backend ไม่ให้เปลี่ยน API) บอก Claude ด้วย

---

## 4.6 ขั้นตอนที่ 3: Spec — เขียน Specification

### คืออะไร?

Spec คือ **เอกสารออกแบบ** ที่เขียนสิ่งที่จะทำทั้งหมดออกมาชัดเจน ก่อนเริ่ม code — เหมือน blueprint ของบ้านก่อนเริ่มสร้าง

### ทำงานยังไง?

```
Design เสร็จ → เราเลือก approach
      │
      ▼
Claude เขียน spec ลงไฟล์:
docs/superpowers/specs/2026-04-01-order-management-design.md
      │
      ▼
Claude: "Spec เสร็จแล้ว กรุณา review และ approve"
      │
      ▼
เราอ่าน → approve หรือขอแก้ไข
      │
      ▼
ไป Plan
```

### ตัวอย่างเนื้อหาใน Spec

```markdown
# Order Management Design

## Overview
หน้า order list แสดงรายการ order ในรูปแบบ table
มี filter ตาม status และ date range

## Architecture
Components → OrderService → API Proxy → Backend
                                  ↓
                          React Query cache

## Endpoints
- GET /v1/orders?page=1&limit=20&status=pending

## Files ที่จะสร้าง
| ไฟล์ | หน้าที่ |
|---|---|
| src/types/order.ts | Type definitions |
| src/services/order-service.ts | API service |
| src/app/[locale]/(main)/orders/page.tsx | Page component |
| src/components/orders/order-table.tsx | Table component |
| src/components/orders/order-filters.tsx | Filter component |

## Mock Data
- 10 mock orders สำหรับ development
```

### ทำไมต้องเขียน Spec?

| ไม่มี Spec | มี Spec |
|---|---|
| Claude เข้าใจในหัว อาจเข้าใจผิด | เขียนออกมาชัดเจน ตรวจสอบได้ |
| แก้ตอน code แพงมาก | แก้ตอน spec ถูกมาก |
| ทีมไม่รู้ว่าทำอะไร | ทีมอ่าน spec ย้อนหลังได้ |
| ไม่มีหลักฐานว่า design ทำไม | มีบันทึก design decision |

### ทริค

- **อ่าน spec ให้ดีก่อน approve** — ตรงนี้แก้ง่ายที่สุด ถ้าเจอสิ่งที่ไม่ต้องการ บอกเลย
- **ถ้าไม่เข้าใจส่วนไหน ถามเลย** — อย่า approve ถ้ายังไม่ชัวร์
- **เก็บไฟล์ spec ไว้** — ทีมอ่านย้อนหลังได้ว่าทำไมถึง design แบบนี้

---

## 4.7 ขั้นตอนที่ 4: Plan — แบ่งงานเป็น Task ย่อย

### คืออะไร?

Plan คือ **แผนปฏิบัติการ** ที่แบ่ง spec ออกเป็น task ย่อยๆ แต่ละ task ทำเสร็จภายใน 2-5 นาที พร้อม code ตัวอย่าง, test, และคำสั่ง commit ครบถ้วน

### ทำงานยังไง?

```
Spec approved
      │
      ▼
Claude แบ่งงานเป็น task → สร้างไฟล์:
docs/superpowers/plans/2026-04-01-order-management.md
      │
      ▼
Claude: "Plan เสร็จแล้ว เลือกวิธี execute:
  1. Subagent-Driven (แนะนำ)
  2. Inline"
      │
      ▼
เราเลือก → Claude เริ่ม implement
```

### หน้าตา Plan

```markdown
### Task 1: สร้าง Order Types

Files:
- Create: src/types/order.ts

Step 1: เขียน test ที่ fail
Step 2: รัน test ยืนยัน fail
Step 3: เขียน code
Step 4: รัน test ยืนยัน pass
Step 5: Commit

---

### Task 2: สร้าง Order Service

Files:
- Create: src/services/order-service.ts
- Test: src/services/__tests__/order-service.test.ts

Step 1: เขียน test ที่ fail
  [code ตัวอย่าง test ครบถ้วน]

Step 2: รัน test ยืนยัน fail
  $ pnpm vitest run src/services/__tests__/order-service.test.ts
  Expected: FAIL

Step 3: เขียน code
  [code ตัวอย่าง implementation ครบถ้วน]

Step 4: รัน test ยืนยัน pass
  $ pnpm vitest run src/services/__tests__/order-service.test.ts
  Expected: PASS

Step 5: Commit
  $ git commit -m "feat: add order service"
```

### วิธี Execute: Subagent-Driven vs Inline

**Subagent-Driven (แนะนำ):**
- Claude ส่ง "agent ย่อย" ไปทำแต่ละ task อัตโนมัติ
- Agent ย่อยแต่ละตัวเริ่มต้นใหม่ ไม่ปนกัน context ไม่ใหญ่
- มี reviewer ตรวจงานทุก task อัตโนมัติ
- เร็วกว่า เหมาะกับงาน 3 task ขึ้นไป

**Inline:**
- Claude ทำเองใน session ปัจจุบัน
- เหมาะกับงานเล็กๆ 2-3 tasks

### ทำไมต้องแบ่ง Task?

| ไม่แบ่ง Task | แบ่ง Task |
|---|---|
| ทำทุกอย่างพร้อมกัน สับสน | ทำทีละชิ้น ชัดเจน |
| พังแล้วไม่รู้พังตรงไหน | commit ทุก task — ย้อนกลับง่าย |
| ไม่มี checkpoint | ทุก task คือ checkpoint |

### ทริค

- **อ่าน plan ก่อน approve** — ถ้า task ไม่สมเหตุสมผล บอกแก้ก่อน
- **เลือก Subagent-Driven** เสมอสำหรับงาน feature จริง — เร็วกว่าและมี review อัตโนมัติ
- **เก็บไฟล์ plan ไว้** — ใช้อ้างอิงได้ถ้าต้องกลับมาแก้ทีหลัง

---

## 4.8 ขั้นตอนที่ 5: TDD — เขียน Test ก่อน Code

### คืออะไร?

TDD (Test-Driven Development) คือแนวคิด **เขียน test ก่อนเขียน code** เป็นหัวใจหลักของการ implement ใน Superpowers — ทุก task ใน plan จะทำตาม cycle นี้

### วงจร RED → GREEN → REFACTOR

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   RED              GREEN             REFACTOR           │
│   เขียน test   →   เขียน code    →   ปรับ code         │
│   ที่ fail         ให้ test ผ่าน      ให้สวยขึ้น        │
│                                                         │
│         ↑                                    │          │
│         └────────────────────────────────────┘          │
│                       ทำซ้ำ                             │
└─────────────────────────────────────────────────────────┘
```

### ตัวอย่างจริง — Mock Login Handler

#### RED — เขียน test ก่อน (ยังไม่มี code)

```typescript
// src/mocks/__tests__/handlers.test.ts
it('returns 401 on invalid credentials', async () => {
  const res = await fetch('http://localhost/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrong' }),
  })

  expect(res.status).toBe(401)
  const data = await res.json()
  expect(data.message).toBeTruthy()
})
```

รัน test → **FAIL** (ยังไม่มี handler)

```
FAIL  src/mocks/__tests__/handlers.test.ts
  ✗ returns 401 on invalid credentials
    → Cannot find module '../handlers'
```

#### GREEN — เขียน code น้อยที่สุดให้ test ผ่าน

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { MOCK_USERS } from './data'

export const handlers = [
  http.post('*/v1/auth/login', async ({ request }) => {
    const { username, password } = await request.json()
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password,
    )

    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 },
      )
    }
    // ... handle success
  }),
]
```

รัน test → **PASS**

```
PASS  src/mocks/__tests__/handlers.test.ts
  ✓ returns 401 on invalid credentials
```

#### REFACTOR — ปรับ code ให้ดีขึ้น (test ยังผ่านอยู่)

ปรับ naming, แยก function, ลด duplication — แล้วรัน test อีกครั้งเพื่อยืนยันว่ายังถูกต้อง ถ้า test ยังผ่าน แสดงว่า refactor ไม่ได้ทำให้ logic เสีย

### ทำไมต้อง TDD?

| ไม่ใช้ TDD | ใช้ TDD |
|---|---|
| เขียน code เสร็จ ลืมเขียน test | test มีตั้งแต่แรก ไม่มีทางลืม |
| ไม่มั่นใจว่า code ทำงานถูก | test พิสูจน์ให้ทันที |
| Refactor แล้วพัง ไม่รู้ตัว | Refactor แล้ว test จับได้ทันที |
| แก้ bug แล้วเกิด bug ใหม่ | test เดิมคอยตรวจ regression |
| เขียน code เกินจำเป็น | เขียนแค่พอให้ test ผ่าน (YAGNI) |

### เมื่อไหร่ควรใช้ TDD / ไม่ต้องใช้

| ใช้ TDD | ไม่จำเป็น |
|---|---|
| Logic, service, utility functions | UI layout / styling |
| API handlers | Config files |
| State management | Static content |
| Data transformation | One-off scripts / POC |
| Feature ที่มี business logic | Prototype เร็วๆ ที่จะทิ้ง |

### ทริค

- ใน Superpowers Claude จัดการ TDD cycle ทั้งหมดอัตโนมัติ เราแค่ดูผลลัพธ์
- ถ้า test fail ใน GREEN step — Claude จะแก้ code จนผ่านก่อนไป step ถัดไป

---

## 4.9 ขั้นตอนที่ 6: Code Review — ตรวจสอบ 2 ชั้น

### คืออะไร?

หลัง implement แต่ละ task เสร็จ Superpowers จะส่ง **reviewer 2 ตัว** ตรวจสอบงาน — ไม่ใช่แค่ดูว่า code สวยหรือเปล่า แต่ดูว่า **ตรง spec ไหม** และ **code quality ดีไหม**

### Review 2 ชั้น

```
Task implement เสร็จ
         │
         ▼
┌────────────────────────────────────┐
│ ชั้นที่ 1: Spec Compliance         │
│ "code ที่เขียนตรงกับ spec ไหม?"   │
│ - ขาดอะไรไหม?                     │
│ - เกินไปไหม (ทำเกินที่ขอ)?        │
│ - เข้าใจ requirement ถูกไหม?      │
└────────────────┬───────────────────┘
                 │ ผ่าน
                 ▼
┌────────────────────────────────────┐
│ ชั้นที่ 2: Code Quality            │
│ "code เขียนดีไหม?"                │
│ - อ่านง่ายไหม?                    │
│ - test ครอบคลุมไหม?               │
│ - มี bug ซ่อนอยู่ไหม?             │
│ - ตาม convention ไหม?             │
└────────────────┬───────────────────┘
                 │ ผ่าน
                 ▼
           Task ผ่าน ✅
```

### ตัวอย่าง Spec Review

```
Spec Reviewer: Issues found:
  - Missing: ยังไม่มี filter ตาม date range (spec บอกว่าต้องมี)
  - Extra: เพิ่มปุ่ม export ที่ไม่ได้อยู่ใน spec

→ Claude แก้ไข → Reviewer ตรวจอีกครั้ง → ✅ ผ่าน
```

### ตัวอย่าง Code Quality Review

```
Code Reviewer: Issues (Important):
  - Magic number: PAGE_SIZE = 20 ควรเป็น constant ที่ชัดเจน
  - Missing error handling ใน OrderService.getOrders

Code Reviewer: Strengths:
  - Test coverage ดี ครอบคลุม edge cases
  - Naming ชัดเจน อ่านง่าย

→ Claude แก้ไข → Reviewer ตรวจอีกครั้ง → ✅ Approved
```

### ทำไมต้อง Review 2 ชั้น?

| ชั้นเดียว | 2 ชั้น |
|---|---|
| อาจตรง spec แต่ code ห่วย | ตรง spec + code ดี |
| อาจ code สวยแต่ผิด requirement | ไม่มี gap ระหว่าง spec กับ code |
| Review กว้างเกินไป focus ไม่ชัด | แต่ละชั้น focus เรื่องเดียว |

### สิ่งที่เราต้องทำ

**ไม่ต้องทำอะไร** — Claude จัดการ review อัตโนมัติ ถ้ามีปัญหา Claude จะแก้แล้ว review ซ้ำจนผ่าน เราจะเห็นผลสรุปของแต่ละ task เมื่อเสร็จ

---

## 4.10 ขั้นตอนที่ 7: Systematic Debugging — แก้ Bug อย่างเป็นระบบ

### คืออะไร?

เมื่อเจอ bug หรือ error แทนที่จะเดาแล้วแก้ส่งเดช Superpowers จะใช้กระบวนการ **วิเคราะห์ root cause อย่างเป็นระบบ** ก่อนแก้ — สังเกต → สมมุติฐาน → พิสูจน์ → แก้ root cause

### ทำงานยังไง?

```
เจอ bug / error
         │
         ▼
┌────────────────────────────────────┐
│ 1. สังเกตอาการ                     │
│    error คืออะไร? เกิดที่ไหน?      │
└────────────────┬───────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│ 2. ตั้งสมมุติฐาน                   │
│    สาเหตุที่เป็นไปได้:             │
│    - A: token หมดอายุ?             │
│    - B: API endpoint เปลี่ยน?      │
│    - C: cookie ไม่ถูก set?         │
└────────────────┬───────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│ 3. พิสูจน์ทีละข้อ                  │
│    ✗ A: token ยังอยู่ — ไม่ใช่    │
│    ✓ B: API เปลี่ยนจาก v1 → v2   │
│    — C: ไม่ต้องเช็ค เจอแล้ว      │
└────────────────┬───────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│ 4. แก้ root cause                  │
│    เปลี่ยน endpoint → test → fix   │
└────────────────────────────────────┘
```

### เทียบกับการ debug แบบปกติ

| Debug แบบเดา | Systematic Debugging |
|---|---|
| "ลอง restart server ดู" | "error คืออะไร? เกิดที่ไหน?" |
| แก้ได้ แต่ไม่รู้ว่าทำไมมันพัง | รู้ root cause — ไม่เกิดซ้ำ |
| ถ้าไม่หาย ก็ลองอย่างอื่น | ทดสอบสมมุติฐานทีละข้อ |
| เสีย token ไปกับ trial-and-error | ตรงประเด็น ประหยัด token |

### ตัวอย่างการใช้งาน

แค่บอก Claude ว่าเจอ bug:

```
You: "login แล้ว redirect ไม่ทำงาน error 401"

Claude: [เข้า Systematic Debugging อัตโนมัติ]
        "ขอตรวจสอบ..."
        1. อ่าน error log
        2. ตรวจ auth flow
        3. พบว่า cookie ไม่ถูก set เพราะ sameSite config
        4. แก้ไข → test → ยืนยันว่าหาย
```

### ทริค

- ให้ข้อมูล error ที่ชัดเจน — paste error message เต็มๆ ดีกว่า "มัน error"
- ถ้า debug นานแล้วไม่เจอ บอก Claude ให้รีเซ็ตสมมุติฐานใหม่

---

## 4.11 ขั้นตอนที่ 8: Git Worktrees — ทำงานแยก ไม่กระทบ Code หลัก

### คืออะไร?

Git Worktree คือการ **สร้าง workspace แยก** จาก repo เดียวกัน — ทำงาน feature ใหม่ได้โดย **ไม่กระทบ code ที่ทำอยู่** ใน branch หลัก

### ปัญหาที่แก้ได้

ปกติถ้าอยู่กลาง feature A แล้วต้องไปทำ feature B:

```bash
# แบบปกติ (ลำบาก)
git stash              # เก็บงาน A ไว้ก่อน
git checkout -b feat-B # สลับ branch
# ...ทำ B เสร็จ...
git checkout feat-A    # กลับมา
git stash pop          # ดึงงาน A กลับ (อาจ conflict)
```

```bash
# แบบ Worktree (สะดวก)
git worktree add ../feat-B  # สร้าง folder แยก
# feat-A ไม่ถูกแตะต้องเลย
# ทำงาน feat-B ใน folder ใหม่
# เสร็จแล้ว merge กลับมา
```

### โครงสร้าง

```
~/projects/
├── my-project/            ← workspace หลัก (main branch)
│   └── src/...
├── my-project-feat-B/     ← worktree แยก (feat-B branch)
│   └── src/...            ← copy ของ repo แต่คนละ branch
```

ทั้ง 2 folder **ใช้ `.git` เดียวกัน** — commit ที่ไหนก็เห็นเหมือนกัน ไม่ต้อง clone ใหม่

### Worktree กับ Superpowers

เมื่อ Superpowers เริ่มทำงาน feature ใหม่:

```
1. สร้าง worktree อัตโนมัติ  → แยก branch ให้
2. Implement ใน worktree     → code หลักไม่ถูกแตะ
3. ทำเสร็จ → merge กลับ      → หรือสร้าง PR
```

### ทำไมต้องใช้ Worktree?

| ไม่ใช้ Worktree | ใช้ Worktree |
|---|---|
| code หลักถูกแก้ไขระหว่างทำ | code หลักปลอดภัย 100% |
| stash แล้ว conflict | ไม่ต้อง stash เลย |
| ถ้า implement ล้มเหลว ต้อง revert | ลบ worktree ทิ้ง จบ |
| ทำได้ทีละ feature | ทำหลาย feature พร้อมกัน (คนละ worktree) |

### ทริค

- **ถ้า implement ไม่สำเร็จ** — ลบ worktree ทิ้งได้เลย code หลักไม่เสียหาย
- **ทำหลาย feature พร้อมกัน** — สร้าง worktree คนละตัว ไม่กระทบกัน

---

## 4.12 ขั้นตอนที่ 9: Finishing Branch — ปิดงาน

### คืออะไร?

เมื่อ implement + review ผ่านครบทุก task แล้ว Superpowers จะเสนอทางเลือกในการปิดงาน

### ตัวเลือก

```
Claude: "งานเสร็จแล้ว เลือกวิธีปิดงาน:"

1. Merge เข้า main     → merge branch เข้า main ตรงๆ
2. สร้าง Pull Request  → สร้าง PR บน GitHub ให้ทีม review
3. Keep branch         → เก็บ branch ไว้ก่อน ยังไม่ merge
```

### เลือกอะไรดี?

```
ทำงานคนเดียว + มั่นใจ   → Merge เข้า main
ทำงานในทีม              → สร้าง PR ให้คนอื่น review
ยังไม่พร้อม              → Keep branch ไว้ก่อน
```

### สิ่งที่ Claude ทำก่อนปิดงาน

1. **รัน test ทั้งหมด** — ยืนยันว่า pass ครบ
2. **ตรวจ lint** — ไม่มี warning/error
3. **Final code review** — review รวมทั้ง feature ครั้งสุดท้าย
4. **สร้าง PR** (ถ้าเลือก) — พร้อม title, description, test plan

### ทริค

- ถ้าทำงานในทีม เลือก PR เสมอ — มีบันทึก discussion และ review ไว้อ้างอิง
- PR description ที่ Claude สร้างจะมี summary และ test plan ครบ ไม่ต้องเขียนเอง

---

## สรุป Flow ทั้งหมด

```
You: "ทำหน้า order management"
            │
            ▼
   ┌──────────────────┐
   │   Brainstorm     │  Claude ถามคำถามทีละข้อ
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │     Design       │  เสนอ 2-3 approaches ให้เลือก
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │      Spec        │  เขียน spec → เรา review → approve
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │      Plan        │  แบ่งเป็น task ย่อย พร้อม code + test
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │  Implement (TDD) │  ทำทีละ task — RED → GREEN → REFACTOR → Commit
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │   Code Review    │  Spec compliance + Code quality (อัตโนมัติทุก task)
   │    (2 ชั้น)      │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │     Finish       │  Merge / PR / Keep branch
   └──────────────────┘
```

---

## Workshop: ลองใช้ Superpowers ตั้งแต่ต้นจนจบ

### โจทย์

สร้าง feature "Profile Page" สำหรับแสดงข้อมูลผู้ใช้ — ชื่อ, อีเมล, รูปโปรไฟล์, วันที่สมัคร ดึงข้อมูลจาก `GET /v1/me`

### ขั้นตอน

1. เปิด session ใหม่
2. บอก Claude ว่าต้องการทำ feature profile page
3. ตอบ Brainstorm ให้ชัดเจน (ดูทริปด้านล่าง)
4. เลือก Design approach
5. Review spec ก่อน approve
6. อ่าน plan ก่อน approve
7. เลือก Subagent-Driven
8. รอ implement + review เสร็จ
9. เลือก Finish → Keep branch (สำหรับ workshop นี้)

### ตัวอย่างการตอบ Brainstorm

```
Q: "หน้า profile แสดง field อะไรบ้าง?"
A: "ชื่อ (name), อีเมล (email), รูป (avatar), วันที่สมัคร (createdAt)"

Q: "มีปุ่ม edit profile ไหม?"
A: "ไม่ต้อง แค่ดูอย่างเดียวก่อน"

Q: "layout เป็นแบบไหน?"
A: "card กลางหน้า มี avatar ข้างบน ข้อมูลข้างล่าง"

Q: "API endpoint?"
A: "GET /v1/me ไม่มี params"
```

### สิ่งที่ควรสังเกตระหว่าง workshop

- Claude ถามทีละข้อ ไม่ถามรวบ
- Spec มีรายชื่อไฟล์ที่จะสร้างครบ
- Plan แบ่ง task ชัดเจน แต่ละ task มี test
- Code Review เกิดขึ้นอัตโนมัติหลังทุก task

---

## ทริครวม

| ทริค | รายละเอียด |
|---|---|
| **ตอบ Brainstorm ให้ชัด** | ยิ่งตอบดี spec ยิ่งตรง ยิ่งประหยัดเวลา |
| **Review spec ให้ดี** | แก้ตอน spec ง่ายกว่าแก้ตอน code 10 เท่า |
| **เลือก Subagent-Driven** | เร็วกว่า มี review อัตโนมัติทุก task |
| **อ่าน plan ก่อน approve** | ถ้า task ไม่สมเหตุสมผล บอกแก้ก่อน |
| **เก็บ Spec + Plan เป็น doc** | ทีมอ่านย้อนหลังได้ว่าทำไมถึง design แบบนี้ |
| **ใช้ Worktree สำหรับ feature ใหญ่** | code หลักปลอดภัย ลบทิ้งได้ถ้าไม่สำเร็จ |
| **บอกสิ่งที่ไม่ต้องการด้วย** | "ไม่ต้องมี export" ช่วยจำกัดขอบเขตชัด |

---

## สรุป Session 4

Superpowers เปลี่ยน Claude จาก "assistant ที่รับคำสั่ง" เป็น "กระบวนการพัฒนาแบบมืออาชีพ" ที่มี:

- **Brainstorm** — เข้าใจ requirement ก่อนทำ
- **Design** — เห็นทางเลือก ตัดสินใจก่อน implement
- **Spec** — blueprint ชัดเจน review ได้
- **Plan** — task ย่อย มี test ทุก step
- **TDD** — test ก่อน code เสมอ
- **Code Review** — 2 ชั้น spec + quality
- **Systematic Debugging** — หา root cause ไม่ใช่เดา
- **Git Worktrees** — code หลักปลอดภัย
- **Finishing** — ปิดงานอย่างถูกต้อง

**กฎสำคัญ:** ใช้ Superpowers ทุกครั้งที่สร้าง feature ใหม่ — ประหยัดเวลามากกว่าที่คิด

---

*ต่อไป: [Session 5 — Best Practices และ Common Pitfalls](session-5-best-practices.md)*
