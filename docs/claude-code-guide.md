# Claude Code Guide — คู่มือการใช้งานสำหรับทีม

## สารบัญ

1. [คำสั่งพื้นฐาน](#1-คำสั่งพื้นฐาน)
2. [CLAUDE.md — กำหนดพฤติกรรม AI](#2-claudemd--กำหนดพฤติกรรม-ai)
3. [Custom Commands](#3-custom-commands)
4. [วิธีสั่ง AI ที่ดี](#4-วิธีสั่ง-ai-ที่ดี)
5. [ประหยัด Token](#5-ประหยัด-token)
6. [เลือก Model ให้เหมาะกับงาน](#6-เลือก-model-ให้เหมาะกับงาน)
7. [Workflow แนะนำ](#7-workflow-แนะนำ)
8. [Superpowers Plugin](#8-superpowers-plugin)
9. [คำสั่งลัดที่ควรจำ](#9-คำสั่งลัดที่ควรจำ)
10. [ข้อควรระวัง](#10-ข้อควรระวัง)

---

## 1. คำสั่งพื้นฐาน

### เปิดใช้งาน

```bash
# เปิด Claude Code ใน project ปัจจุบัน
claude

# เปิดพร้อมสั่งงานเลย
claude "สร้าง component Button"

# Resume session ล่าสุด
claude --resume
```

### คำสั่งใน Session

| คำสั่ง | หน้าที่ |
|---|---|
| `/help` | ดูคำสั่งทั้งหมด |
| `/clear` | ล้าง context ปัจจุบัน |
| `/compact` | บีบ context ให้เล็กลง |
| `/undo` | ย้อนการแก้ไขล่าสุด |
| `/model` | สลับโมเดล (Haiku/Sonnet/Opus) |
| `Shift+Tab` | เข้า Plan Mode (วางแผนก่อนทำ) |
| `Esc` | ยกเลิก / หยุดการทำงาน |
| `! command` | รัน shell command ใน session |

### อ้างอิงไฟล์

พิมพ์ `@` ตามด้วยชื่อไฟล์เพื่อบอกให้ Claude โฟกัสไฟล์นั้น:

```
แก้ bug login ใน @src/contexts/auth-context.tsx
```

---

## 2. CLAUDE.md — กำหนดพฤติกรรม AI

ไฟล์ `CLAUDE.md` คือ "คู่มือ" ที่ Claude อ่านทุกครั้งที่เปิด session ใช้กำหนด:

- Code style, conventions
- คำสั่งที่ใช้บ่อย (dev, build, test)
- Architecture rules
- สิ่งที่ห้ามทำ

### ระดับของ CLAUDE.md

| ระดับ | ตำแหน่ง | ใช้สำหรับ |
|---|---|---|
| User | `~/.claude/CLAUDE.md` | preferences ส่วนตัว (ภาษา, สไตล์การตอบ) |
| Project | `CLAUDE.md` ใน root project | conventions ของ project |

### ตัวอย่างสิ่งที่ควรใส่

```markdown
## Commands
- `pnpm dev` — Dev server
- `pnpm build` — Production build
- `pnpm lint:fix` — Fix lint errors

## Code Style
- No semicolons, single quotes, 2-space indent
- Commit messages: English only
- ตอบสั้น กระชับ ไม่ต้อง recap สิ่งที่ทำ

## ห้ามทำ
- อย่าใช้ any type
- อย่าใช้ console.log → ใช้ console.info, console.warn, console.error
- อย่าสร้าง custom component ถ้า Ant Design มี
```

---

## 3. Custom Commands

สร้าง command ที่ทีมใช้บ่อย เก็บใน `.claude/commands/`:

```
.claude/
  commands/
    commit.md       → เรียกด้วย /commit
    new-feature.md  → เรียกด้วย /new-feature
    review.md       → เรียกด้วย /review
```

ทุกคนใน project ได้ workflow เดียวกัน — ลดความผิดพลาด ลดเวลาสอน

---

## 4. วิธีสั่ง AI ที่ดี

### หลักการ: Context + เป้าหมาย + ขอบเขต

#### ไม่ดี (กว้างเกินไป)

```
แก้ bug
```

#### ดี (ชี้เฉพาะเจาะจง)

```
login แล้ว redirect ไม่ทำงาน
ดู src/contexts/auth-context.tsx บรรทัด 37
ควรจะ redirect ไป / หลัง login สำเร็จ
```

### ตัวอย่างเพิ่มเติม

| สถานการณ์ | วิธีสั่งที่ดี |
|---|---|
| สร้าง feature ใหม่ | "สร้างหน้า order list ดึงจาก /v1/orders แสดงเป็น Table มี pagination ตาม convention ใน CLAUDE.md" |
| แก้ bug | "API /v1/users return 401 ดู error ใน src/services/user-service.ts น่าจะ token หมดอายุ" |
| Refactor | "แยก OrderService ออกจาก api-service.ts เป็น src/services/order-service.ts" |
| อธิบาย code | "อธิบาย auth flow สั้นๆ 5 บรรทัด ดูจาก auth-context.tsx" |

### สั่งให้ครบในรอบเดียว

```
# เปลือง (3 messages = ส่ง context ซ้ำ 3 รอบ)
Message 1: "สร้างไฟล์ type"
Message 2: "สร้าง service ด้วย"
Message 3: "สร้าง page ด้วย"

# ประหยัด (1 message)
Message 1: "สร้าง type, service, และ page สำหรับ order ตาม checklist ใน CLAUDE.md"
```

### Multi-turn เมื่อจำเป็น

งานใหญ่ สั่งทีละ step แล้ว review:

```
You: "สร้าง type สำหรับ order"
Claude: [สร้างไฟล์]
You: "ok ต่อ สร้าง service"
Claude: [สร้างไฟล์]
You: "ไม่ใช่ ใช้ POST ไม่ใช่ PUT"
Claude: [แก้ไข]
```

---

## 5. ประหยัด Token

### Token คืออะไร?

ทุกครั้งที่ Claude อ่านไฟล์, search code, หรือตอบกลับ = ใช้ token = ใช้เงิน ยิ่ง session ยาว ยิ่งแพง เพราะส่ง context ทั้งหมดซ้ำทุก message

### กฎ 10 ข้อ ใช้ Token ให้คุ้ม

#### 1. ชี้ไฟล์ให้ชัด ไม่ต้องให้ค้นหา

```
# เปลือง — Claude ต้อง Glob + Grep หลายรอบ
"หา function ที่ handle order"

# ประหยัด — Claude อ่านไฟล์เดียวจบ
"ดู OrderService.getOrders ใน src/services/order-service.ts"
```

#### 2. หนึ่งงาน = หนึ่ง session

```
# เปลือง
ทำ 5 features ใน session เดียว → context ใหญ่ขึ้นเรื่อยๆ

# ประหยัด
เสร็จงาน → commit → เปิด session ใหม่
```

#### 3. /compact เมื่อ session ยาว

```
/compact                          # compact ทั้งหมด
/compact เก็บแค่เรื่อง auth flow   # compact แบบเจาะจง
```

หรือเปิด auto-compact:

```bash
claude --auto-compact
```

#### 4. บอกให้ตอบสั้น

```
# เปลือง
"อธิบาย auth flow ของ project นี้"

# ประหยัด
"อธิบาย auth flow สั้นๆ 5 บรรทัด"
"แก้ error นี้เลย ไม่ต้องอธิบาย"
```

#### 5. อย่าให้อ่านไฟล์ใหญ่ทั้งไฟล์

```
# เปลือง
"อ่าน package.json"

# ประหยัด
"ดู devDependencies ใน package.json"
```

#### 6. อย่า paste stack trace ทั้งหมด

```
# เปลือง — paste 100 บรรทัด

# ประหยัด — paste แค่ส่วนสำคัญ
"error: Module not found '@mswjs/interceptors/ClientRequest'
ใน src/instrumentation.ts บรรทัด 3"
```

#### 7. /clear เมื่อเปลี่ยน topic

เปลี่ยนเรื่องแต่ไม่อยากเปิด session ใหม่ → `/clear` ล้าง context

#### 8. เลือก Model ให้เหมาะ (ดูหัวข้อถัดไป)

#### 9. ใช้ Plan Mode สำหรับงานใหญ่

`Shift+Tab` → Claude วางแผนก่อน ไม่เสีย token ไปกับการ trial-and-error

#### 10. ใส่ CLAUDE.md ให้ครบ

ยิ่ง CLAUDE.md ดี Claude ยิ่งทำถูกตั้งแต่รอบแรก = ไม่ต้องแก้ซ้ำ = ประหยัด token

---

## 6. เลือก Model ให้เหมาะกับงาน

สลับด้วย `/model` ระหว่าง session ได้เลย

| Model | ราคา | ความเร็ว | เหมาะกับ |
|---|---|---|---|
| **Haiku** | ถูกสุด | เร็วสุด | แก้ typo, rename, งานง่ายๆ, ถาม syntax |
| **Sonnet** | ปานกลาง | ปานกลาง | เขียน feature ทั่วไป, แก้ bug, refactor |
| **Opus** | แพงสุด | ช้าสุด | Design architecture, debug ซับซ้อน, งานหลายไฟล์ |

### หลักการเลือก

```
ถามคำถามสั้นๆ → Haiku
เขียน code 1-2 ไฟล์ → Sonnet
งานซับซ้อน หลายไฟล์ ต้องคิด → Opus
```

**ไม่จำเป็นต้องใช้ Opus ตลอด** — ใช้ Haiku/Sonnet ให้เป็นจะประหยัดมาก

---

## 7. Workflow แนะนำ

### งานปกติ (feature/bugfix)

```
1. เปิด session ใหม่
2. สั่งงานให้ชัดเจน พร้อมชี้ไฟล์
3. Review ผลลัพธ์
4. ถ้า ok → /commit
5. ปิด session
```

### งานใหญ่

```
1. เปิด session ใหม่
2. Shift+Tab เข้า Plan Mode
3. อธิบายสิ่งที่ต้องการ
4. Review plan → approve
5. Claude ทำตาม plan ทีละ step
6. Review แต่ละ step
7. /commit
8. ปิด session
```

### Debug

```
1. เปิด session ใหม่
2. Paste error message (แค่ส่วนสำคัญ)
3. ชี้ไฟล์ที่เกี่ยวข้อง
4. "แก้ error นี้เลย"
5. ทดสอบ → /commit → ปิด session
```

---

## 8. Superpowers Plugin

Superpowers คือ plugin ที่เพิ่ม **workflow อัตโนมัติ** ให้ Claude Code — เปลี่ยนจาก "สั่งทีละอย่าง" เป็น "กระบวนการพัฒนาแบบมืออาชีพ" ที่มีขั้นตอนชัดเจน มี review ทุก step

### ติดตั้ง

```bash
claude /install-plugin superpowers
```

### Superpowers ทำอะไร?

โดยปกติเมื่อสั่ง Claude ว่า "ทำหน้า login" → Claude จะเขียน code ทันที ซึ่งอาจได้ผลลัพธ์ที่ไม่ตรงใจ

**เมื่อใช้ Superpowers** → Claude จะเข้ากระบวนการ 7 ขั้นตอน:

```
1. Brainstorming         → ถาม-ตอบเพื่อเข้าใจ requirement ให้ชัด
2. Design                → เสนอ 2-3 แนวทาง ให้เราเลือก
3. Spec                  → เขียน spec document แล้วให้ review
4. Plan                  → แบ่งงานเป็น task ย่อยๆ พร้อม code ตัวอย่าง
5. Implementation (TDD)  → ทำทีละ task ด้วย TDD (test first)
6. Code Review           → review ทุก task ว่าตรง spec ไหม
7. Finish                → merge / สร้าง PR
```

### ทำไมต้องใช้?

| ไม่ใช้ Superpowers | ใช้ Superpowers |
|---|---|
| Claude เขียน code ทันที | คิดก่อนทำ มี spec ชัดเจน |
| ไม่มี test | TDD — เขียน test ก่อน code |
| อาจได้สิ่งที่ไม่ตรงใจ | Brainstorm ก่อน ตรงใจตั้งแต่แรก |
| ไม่มี review | มี spec review + code quality review |
| แก้แล้วแก้อีก | ทำถูกตั้งแต่รอบแรก |

### เมื่อไหร่ควรใช้ / ไม่ใช้

| ใช้ Superpowers | ไม่ต้องใช้ |
|---|---|
| สร้าง feature ใหม่ | แก้ typo |
| งานที่ต้องคิด design | rename ตัวแปร |
| งานหลายไฟล์ | แก้ bug ง่ายๆ ที่รู้ตำแหน่งแล้ว |
| งานที่ต้องมี test | เพิ่ม field 1 ตัว |
| Debug ซับซ้อน | ถามคำถาม |

### วิธีใช้งาน

ไม่ต้องเรียก skill เอง — **แค่บอกว่าอยากทำอะไร** Claude จะเข้า workflow อัตโนมัติ

---

### ขั้นตอนที่ 1: Brainstorming — คิดก่อนทำ

#### คืออะไร?

Brainstorming คือขั้นตอนที่ Claude **ถามคำถามทีละข้อ** เพื่อเข้าใจสิ่งที่เราต้องการให้ชัดก่อนเริ่มเขียน code — เหมือน BA (Business Analyst) สัมภาษณ์ requirement

#### ทำงานยังไง?

```
You: "ทำหน้า order management"

Claude: "order มี field อะไรบ้าง?"          ← คำถามที่ 1

You: "id, name, status, total, createdAt"

Claude: "แสดงเป็น table หรือ card?"          ← คำถามที่ 2

You: "table"

Claude: "ต้องมี filter ไหม?"                ← คำถามที่ 3
  1. แค่แสดง list + pagination
  2. มี filter ด้วย (status, date range)
  3. มี search + filter + export

You: "2"

Claude: "API endpoint เป็นยังไง?"            ← คำถามที่ 4

You: "GET /v1/orders มี query params page, limit, status"
```

**สังเกต:** Claude ถาม **ทีละข้อ** ไม่ถามรวบ — ทำให้ตอบง่าย คิดทีละเรื่อง เหมือนคุยกับเพื่อนร่วมทีม

#### ทำไมต้อง Brainstorm?

| ไม่ Brainstorm | Brainstorm |
|---|---|
| Claude เดาเอง อาจผิด | Claude เข้าใจ requirement ชัด |
| ได้ของไม่ตรงใจ ต้องแก้ซ้ำ | ตรงใจตั้งแต่รอบแรก |
| เสีย token ไปกับการ redo | ประหยัด token |

#### ทริค

- **ตอบให้ชัดเจน** — ยิ่งตอบดี spec ยิ่งตรง
- **บอกสิ่งที่ไม่ต้องการด้วย** — "ไม่ต้องมี export" ช่วยจำกัดขอบเขต
- **ใช้ multiple choice** — Claude ชอบให้เลือก 1/2/3 ตอบง่ายกว่าเขียนเอง

---

### ขั้นตอนที่ 2: Design — เสนอแนวทาง

#### คืออะไร?

หลังจาก brainstorm เข้าใจ requirement แล้ว Claude จะเสนอ **2-3 approaches** พร้อมข้อดี-ข้อเสียของแต่ละแบบ ให้เราเลือก

#### ตัวอย่าง

```
Claude: "มี 3 แนวทาง:"

1. Server-side pagination (แนะนำ)
   - ดึงข้อมูลทีละ page จาก API
   - ข้อดี: เร็ว, รองรับข้อมูลเยอะ
   - ข้อเสีย: ต้อง API รองรับ pagination

2. Client-side pagination
   - ดึงข้อมูลทั้งหมดมาก่อน แล้ว paginate ใน browser
   - ข้อดี: API ง่าย
   - ข้อเสีย: ช้าถ้าข้อมูลเยอะ

3. Infinite scroll
   - โหลดเพิ่มเมื่อ scroll ลง
   - ข้อดี: UX ดี
   - ข้อเสีย: ซับซ้อน, ยากต่อการจัดการ state

"แนะนำ option 1 เพราะ..."

You: "1"
```

#### ทำไมต้องมีขั้นตอนนี้?

เพราะไม่มี "วิธีเดียวที่ถูก" — Claude ให้เราเห็นทางเลือก แล้วตัดสินใจเอง แทนที่จะเลือกให้โดยเราไม่รู้ว่ามีทางอื่น

---

### ขั้นตอนที่ 3: Spec — เขียน Specification

#### คืออะไร?

Spec คือ **เอกสารออกแบบ** ที่เขียนสิ่งที่จะทำทั้งหมด ก่อนเริ่ม code — เหมือน blueprint ของบ้านก่อนเริ่มสร้าง

#### Claude สร้างไฟล์อะไร?

```
docs/superpowers/specs/2026-04-01-order-management-design.md
```

#### เนื้อหาใน Spec มีอะไร?

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

#### ทำไมต้องเขียน Spec?

| ไม่มี Spec | มี Spec |
|---|---|
| Claude เข้าใจในหัว อาจเข้าใจผิด | เขียนออกมาชัดเจน ตรวจสอบได้ |
| แก้ตอน code แพงมาก | แก้ตอน spec ถูกมาก |
| ทีมไม่รู้ว่าทำอะไร | ทีมอ่าน spec ย้อนหลังได้ |

#### ทริค

- **อ่าน spec ให้ดีก่อน approve** — ตรงนี้แก้ง่ายที่สุด ถ้าเจอสิ่งที่ไม่ต้องการ บอกเลย
- **ถ้าไม่เข้าใจส่วนไหน ถามเลย** — อย่า approve ถ้ายังไม่ชัวร์

---

### ขั้นตอนที่ 4: Plan — แบ่งงานเป็น Task ย่อย

#### คืออะไร?

Plan คือ **แผนปฏิบัติการ** ที่แบ่ง spec ออกเป็น task ย่อยๆ แต่ละ task ทำเสร็จภายใน 2-5 นาที พร้อม code ตัวอย่าง, test, และคำสั่ง commit ครบถ้วน

#### Claude สร้างไฟล์อะไร?

```
docs/superpowers/plans/2026-04-01-order-management.md
```

#### หน้าตา Plan

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

---

### Task 3: สร้าง Order Table Component
...
```

#### ทำไมต้องแบ่ง Task?

| ไม่แบ่ง Task | แบ่ง Task |
|---|---|
| ทำทุกอย่างพร้อมกัน สับสน | ทำทีละชิ้น ชัดเจน |
| พังแล้วไม่รู้พังตรงไหน | commit ทุก task — ย้อนกลับง่าย |
| ไม่มี checkpoint | ทุก task คือ checkpoint |

#### วิธี Execute

หลังเขียน plan เสร็จ Claude จะถาม:

```
Claude: "Plan เสร็จแล้ว เลือกวิธี execute:"
  1. Subagent-Driven (แนะนำ) — ส่ง agent ย่อยทำทีละ task
  2. Inline — ทำใน session นี้เลย
```

**Subagent-Driven (แนะนำ):**
- Claude ส่ง "agent ย่อย" (subagent) ไปทำแต่ละ task
- Agent ย่อยแต่ละตัวเริ่มต้นใหม่ ไม่ปนกัน
- มี reviewer ตรวจงานทุก task
- เร็วกว่า เพราะ context ไม่ใหญ่

**Inline:**
- Claude ทำเองใน session ปัจจุบัน
- เหมาะกับงานเล็กๆ 2-3 tasks

---

### ขั้นตอนที่ 5: TDD (Test-Driven Development) — เขียน Test ก่อน Code

#### คืออะไร?

TDD คือแนวคิด **เขียน test ก่อนเขียน code** เป็นหัวใจหลักของการ implement ใน Superpowers

#### วงจร RED → GREEN → REFACTOR

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   RED        →   GREEN       →   REFACTOR       │
│   เขียน test     เขียน code      ปรับ code       │
│   ที่ fail       ให้ test ผ่าน    ให้สวยขึ้น      │
│                                                 │
│          ↑                            │          │
│          └────────────────────────────┘          │
│                  ทำซ้ำ                           │
└─────────────────────────────────────────────────┘
```

#### ตัวอย่างจริง — Mock Login Handler

**RED — เขียน test ก่อน (ยังไม่มี code)**

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

**GREEN — เขียน code น้อยที่สุดให้ test ผ่าน**

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

**REFACTOR — ปรับ code ให้ดีขึ้น (test ยังผ่านอยู่)**

ปรับ naming, แยก function, ลด duplication — แล้วรัน test อีกครั้งเพื่อยืนยันว่ายังถูกต้อง

#### ทำไมต้อง TDD?

| ไม่ใช้ TDD | ใช้ TDD |
|---|---|
| เขียน code เสร็จ ลืมเขียน test | test มีตั้งแต่แรก ไม่มีทางลืม |
| ไม่มั่นใจว่า code ทำงานถูก | test พิสูจน์ให้ทันที |
| Refactor แล้วพัง ไม่รู้ตัว | Refactor แล้ว test จับได้ทันที |
| แก้ bug แล้วเกิด bug ใหม่ | test เดิมคอยตรวจ regression |
| เขียน code เกินจำเป็น | เขียนแค่พอให้ test ผ่าน (YAGNI) |

#### TDD กับ Superpowers

เมื่อใช้ Superpowers ทุก task ใน plan จะมีโครงสร้างแบบ TDD:

```
Task N: สร้าง Order Service

Step 1: เขียน test ที่ fail           ← RED
Step 2: รัน test ยืนยันว่า fail
Step 3: เขียน code ให้ test ผ่าน       ← GREEN
Step 4: รัน test ยืนยันว่า pass
Step 5: Commit
```

Claude จะทำตาม cycle นี้โดยอัตโนมัติ — เราแค่ review ผลลัพธ์

#### เมื่อไหร่ควรใช้ TDD / ไม่ต้องใช้

| ใช้ TDD | ไม่ต้อง TDD |
|---|---|
| Logic, service, utility functions | UI layout / styling |
| API handlers | Config files |
| State management | Static content |
| Data transformation | One-off scripts |
| Feature ที่มี business logic | Prototype / POC เร็วๆ |

---

### ขั้นตอนที่ 6: Code Review — ตรวจสอบ 2 ชั้น

#### คืออะไร?

หลัง implement แต่ละ task เสร็จ Superpowers จะส่ง **reviewer 2 ตัว** ตรวจสอบงาน — ไม่ใช่แค่ดูว่า code สวยหรือเปล่า แต่ดูว่า **ตรง spec ไหม** และ **code quality ดีไหม**

#### Review 2 ชั้น

```
Task เสร็จ
    ↓
┌─────────────────────────────────┐
│ ชั้นที่ 1: Spec Compliance      │
│ "code ที่เขียนตรงกับ spec ไหม?"  │
│ - ขาดอะไรไหม?                   │
│ - เกินไปไหม (ทำเกินที่ขอ)?       │
│ - เข้าใจ requirement ถูกไหม?     │
└─────────────────┬───────────────┘
                  ↓ ผ่าน
┌─────────────────────────────────┐
│ ชั้นที่ 2: Code Quality         │
│ "code เขียนดีไหม?"              │
│ - อ่านง่ายไหม?                  │
│ - test ครอบคลุมไหม?             │
│ - มี bug ซ่อนอยู่ไหม?            │
│ - ตาม convention ไหม?           │
└─────────────────┬───────────────┘
                  ↓ ผ่าน
          Task ผ่าน ✅
```

#### ตัวอย่าง Spec Review

```
Spec Reviewer: ❌ Issues found:
  - Missing: ยังไม่มี filter ตาม date range (spec บอกว่าต้องมี)
  - Extra: เพิ่มปุ่ม export ที่ไม่ได้อยู่ใน spec

→ Claude แก้ไข → Reviewer ตรวจอีกครั้ง → ✅ ผ่าน
```

#### ตัวอย่าง Code Quality Review

```
Code Reviewer: Issues (Important):
  - Magic number: PAGE_SIZE = 20 ควรเป็น constant
  - Missing error handling ใน OrderService.getOrders

Code Reviewer: Strengths:
  - Test coverage ดี ครอบคลุม edge cases
  - Naming ชัดเจน อ่านง่าย

→ Claude แก้ไข → Reviewer ตรวจอีกครั้ง → ✅ Approved
```

#### ทำไมต้อง Review 2 ชั้น?

| ชั้นเดียว | 2 ชั้น |
|---|---|
| อาจตรง spec แต่ code ห่วย | ตรง spec + code ดี |
| อาจ code สวยแต่ผิด requirement | ไม่มี gap ระหว่าง spec กับ code |
| Review กว้างเกินไป focus ไม่ชัด | แต่ละชั้น focus เรื่องเดียว |

#### สิ่งที่เราต้องทำ

ไม่ต้องทำอะไร — **Claude จัดการ review อัตโนมัติ** ถ้ามีปัญหา Claude จะแก้แล้ว review ซ้ำจนผ่าน เราจะเห็นผลสรุปของแต่ละ task

---

### ขั้นตอนที่ 7: Systematic Debugging — แก้ Bug อย่างเป็นระบบ

#### คืออะไร?

เมื่อเจอ bug หรือ error แทนที่จะเดาแล้วแก้ส่งเดช Superpowers จะใช้กระบวนการ **วิเคราะห์ root cause อย่างเป็นระบบ** ก่อนแก้

#### ทำงานยังไง?

```
┌─────────────────────────────────┐
│ 1. สังเกตอาการ                   │
│    error คืออะไร? เกิดที่ไหน?     │
└─────────────────┬───────────────┘
                  ↓
┌─────────────────────────────────┐
│ 2. ตั้งสมมุติฐาน                 │
│    สาเหตุที่เป็นไปได้:           │
│    - A: token หมดอายุ?           │
│    - B: API endpoint เปลี่ยน?    │
│    - C: cookie ไม่ถูก set?       │
└─────────────────┬───────────────┘
                  ↓
┌─────────────────────────────────┐
│ 3. พิสูจน์ทีละข้อ                │
│    ✗ A: token ยังอยู่ — ไม่ใช่   │
│    ✓ B: API เปลี่ยนจาก v1 → v2  │
│    — C: ไม่ต้องเช็ค เจอแล้ว     │
└─────────────────┬───────────────┘
                  ↓
┌─────────────────────────────────┐
│ 4. แก้ root cause               │
│    เปลี่ยน endpoint → test → fix │
└─────────────────────────────────┘
```

#### เทียบกับการ debug แบบปกติ

| Debug แบบเดา | Systematic Debugging |
|---|---|
| "ลอง restart server ดู" | "error คืออะไร? เกิดที่ไหน?" |
| แก้ได้ แต่ไม่รู้ว่าทำไมมันพัง | รู้ root cause — ไม่เกิดซ้ำ |
| ถ้าไม่หาย ก็ลองอย่างอื่น | ทดสอบสมมุติฐานทีละข้อ |
| เสีย token ไปกับ trial-and-error | ตรงประเด็น ประหยัด token |

#### วิธีใช้

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

---

### ขั้นตอนที่ 8: Git Worktrees — ทำงานแยก ไม่กระทบ Code หลัก

#### คืออะไร?

Git Worktree คือการ **สร้าง workspace แยก** จาก repo เดียวกัน — ทำงาน feature ใหม่ได้โดย **ไม่กระทบ code ที่ทำอยู่**

#### ปัญหาที่แก้ได้

ปกติถ้าอยู่กลาง feature A แล้วต้องไปทำ feature B:

```
# แบบปกติ (ลำบาก)
git stash              ← เก็บงาน A ไว้ก่อน
git checkout -b feat-B ← สลับ branch
# ...ทำ B เสร็จ...
git checkout feat-A    ← กลับมา
git stash pop          ← ดึงงาน A กลับ (อาจ conflict)
```

```
# แบบ Worktree (สะดวก)
git worktree add ../feat-B  ← สร้าง folder แยก
# feat-A ไม่ถูกแตะต้องเลย
# ทำงาน feat-B ใน folder ใหม่
# เสร็จแล้ว merge กลับมา
```

#### โครงสร้าง

```
~/projects/
├── my-project/          ← workspace หลัก (main branch)
│   └── src/...
├── my-project-feat-B/   ← worktree แยก (feat-B branch)
│   └── src/...          ← copy ของ repo แต่คนละ branch
```

ทั้ง 2 folder **ใช้ `.git` เดียวกัน** — commit ที่ไหนก็เห็นเหมือนกัน ไม่ต้อง clone ใหม่

#### Worktree กับ Superpowers

เมื่อ Superpowers เริ่มทำงาน feature ใหม่:

```
1. สร้าง worktree อัตโนมัติ  → แยก branch ให้
2. Implement ใน worktree    → code หลักไม่ถูกแตะ
3. ทำเสร็จ → merge กลับ     → หรือสร้าง PR
```

#### ข้อดี

| ไม่ใช้ Worktree | ใช้ Worktree |
|---|---|
| code หลักถูกแก้ไขระหว่างทำ | code หลักปลอดภัย 100% |
| stash แล้ว conflict | ไม่ต้อง stash เลย |
| ถ้า implement ล้มเหลว ต้อง revert | ลบ worktree ทิ้ง จบ |
| ทำได้ทีละ feature | ทำหลาย feature พร้อมกัน (คนละ worktree) |

#### ทริค

- **ถ้า implement ไม่สำเร็จ** — ลบ worktree ทิ้งได้เลย code หลักไม่เสียหาย
- **ทำหลาย feature พร้อมกัน** — สร้าง worktree คนละตัว ไม่กระทบกัน

---

### ขั้นตอนที่ 9: Finishing Branch — ปิดงาน

#### คืออะไร?

เมื่อ implement + review ผ่านครบทุก task แล้ว Superpowers จะเสนอทางเลือกในการปิดงาน

#### ตัวเลือก

```
Claude: "งานเสร็จแล้ว เลือกวิธีปิดงาน:"

1. Merge เข้า main     → merge branch เข้า main ตรงๆ
2. สร้าง Pull Request  → สร้าง PR บน GitHub ให้ทีม review
3. Keep branch         → เก็บ branch ไว้ก่อน ยังไม่ merge
```

#### Flow ทั่วไป

```
ทำงานคนเดียว + มั่นใจ   → Merge เข้า main
ทำงานในทีม              → สร้าง PR ให้คนอื่น review
ยังไม่พร้อม              → Keep branch ไว้ก่อน
```

#### สิ่งที่ Claude ทำก่อนปิดงาน

1. **รัน test ทั้งหมด** — ยืนยันว่า pass ครบ
2. **ตรวจ lint** — ไม่มี warning/error
3. **Final code review** — review รวมทั้ง feature ครั้งสุดท้าย
4. **สร้าง PR** (ถ้าเลือก) — พร้อม title, description, test plan

---

### สรุป Flow ทั้งหมด

```
You: "ทำหน้า order management"
         │
         ▼
    ┌─────────────┐
    │ Brainstorm  │  Claude ถามคำถามทีละข้อ
    └──────┬──────┘
           ▼
    ┌─────────────┐
    │   Design    │  เสนอ 2-3 approaches ให้เลือก
    └──────┬──────┘
           ▼
    ┌─────────────┐
    │    Spec     │  เขียน spec → เรา review → approve
    └──────┬──────┘
           ▼
    ┌─────────────┐
    │    Plan     │  แบ่งเป็น task ย่อย พร้อม code + test
    └──────┬──────┘
           ▼
    ┌─────────────┐
    │ Implement   │  ทำทีละ task ด้วย TDD
    │  (TDD)      │  RED → GREEN → REFACTOR → Commit
    └──────┬──────┘
           ▼
    ┌─────────────┐
    │ Code Review │  Spec compliance + Code quality
    │  (2 ชั้น)   │  (ทำอัตโนมัติทุก task)
    └──────┬──────┘
           ▼
    ┌─────────────┐
    │   Finish    │  Merge / PR / Keep branch
    └─────────────┘
```

### ทริครวม

- **ตอบ Brainstorm ให้ชัด** — ยิ่งตอบดี spec ยิ่งตรง ยิ่งประหยัดเวลา
- **Review spec ให้ดี** — แก้ตอน spec ง่ายกว่าแก้ตอน code 10 เท่า
- **เลือก Subagent-Driven** — เร็วกว่า มี review อัตโนมัติ
- **อ่าน plan ก่อน approve** — ถ้า task ไม่สมเหตุสมผล บอกแก้ก่อน
- **Spec + Plan เก็บเป็น doc** — ทีมอ่านย้อนหลังได้ว่าทำไมถึง design แบบนี้
- **ใช้ Worktree สำหรับ feature ใหญ่** — code หลักปลอดภัย ลบทิ้งได้ถ้าไม่สำเร็จ

---

## 9. คำสั่งลัดที่ควรจำ

### Keyboard Shortcuts

| ปุ่ม (Mac) | ปุ่ม (Windows/Linux) | หน้าที่ |
|---|---|---|
| `Enter` | `Enter` | ส่งข้อความ |
| `Option+Enter` | `Ctrl+Enter` | ขึ้นบรรทัดใหม่ (ไม่ส่ง) |
| `Shift+Tab` | `Shift+Tab` | สลับ Plan Mode |
| `Esc` | `Esc` | ยกเลิก / หยุด |
| `Ctrl+C` | `Ctrl+C` | ออกจาก session |
| `Up/Down Arrow` | `Up/Down Arrow` | เลือก message เก่า |

### Slash Commands

| คำสั่ง | หน้าที่ |
|---|---|
| `/help` | ดูคำสั่งทั้งหมด |
| `/clear` | ล้าง context |
| `/compact` | บีบ context |
| `/undo` | ย้อนการแก้ไข |
| `/model` | สลับ model |
| `/commit` | สร้าง git commit (custom command) |

### CLI Flags

| Flag | หน้าที่ |
|---|---|
| `--resume` | เปิด session ล่าสุด |
| `--auto-compact` | auto compact เมื่อ context เต็ม |
| `--model sonnet` | เลือก model ตั้งแต่เปิด |
| `-p "prompt"` | สั่งงานแบบ one-shot (ไม่ interactive) |

---

## 10. ข้อควรระวัง

### อย่าทำ

- **อย่า commit โดยไม่ review** — ดู diff ก่อนเสมอ
- **อย่า push ทันที** — commit ก่อน ดูให้ชัวร์ แล้วค่อย push
- **อย่าให้ Claude แก้ไฟล์ที่ไม่เกี่ยว** — สั่งให้ชัดว่าแก้ไฟล์ไหน
- **อย่าใส่ secrets** — อย่า paste API key, password ลงใน chat
- **อย่า blindly accept** — อ่าน code ที่ Claude เขียนเสมอ

### ควรทำ

- **Review ทุกครั้ง** — Claude เก่งแต่ไม่ perfect
- **ใช้ /undo** — ถ้าไม่ถูกต้อง ย้อนได้ทันที
- **ใช้ git** — commit บ่อยๆ เพื่อ checkpoint
- **ถามกลับ** — ถ้า Claude ทำไม่ตรง บอกว่าผิดตรงไหน
- **อัพเดต CLAUDE.md** — เจอ pattern ใหม่ที่ดี ใส่เพิ่มเข้าไป
