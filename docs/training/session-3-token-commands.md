# Session 3: ประหยัด Token & Custom Commands

> **เป้าหมาย:** ทีมใช้ token อย่างคุ้มค่า และสร้าง/ใช้ custom commands ได้
> **ระยะเวลา:** 1 ชั่วโมง

---

## 3.1 Token คืออะไร และทำไมต้องประหยัด?

### Token คือหน่วยวัดการใช้งาน AI

ทุกครั้งที่ Claude ทำงาน มันต้องอ่าน (input) และเขียน (output) — ทั้งสองส่วนนับเป็น **token** ซึ่งเท่ากับค่าใช้จ่าย:

```
ส่ง 1 message สั้นๆ   ≈ 100–500 tokens
Claude อ่าน 1 ไฟล์ใหญ่ ≈ 2,000–10,000 tokens
Claude search ทั้ง project ≈ 5,000–20,000 tokens
```

### ทำไม Session ยาว = แพงกว่า?

Claude ไม่มี "memory" ระหว่าง message — ทุกครั้งที่คุณส่ง message ใหม่ มันต้องอ่าน **conversation ทั้งหมดตั้งแต่ต้น** อีกครั้ง:

```
Message 1: ส่ง 100 tokens → Claude อ่าน 100 tokens
Message 2: ส่ง 100 tokens → Claude อ่าน 200 tokens (รวม message 1)
Message 3: ส่ง 100 tokens → Claude อ่าน 300 tokens (รวม 1+2)
...
Message 20: Claude อ่าน 2,000 tokens เพื่อตอบ 100 tokens
```

**ผลลัพธ์:** session ยาว = ทุก message แพงขึ้นเรื่อยๆ

---

## 3.2 กฎ 10 ข้อประหยัด Token

### กฎที่ 1: ชี้ไฟล์ให้ชัด — ไม่ต้องให้ Claude ค้นหาเอง

```
❌ เปลือง — Claude ต้องค้นหาเองทั้ง project:
> "หา auth context แล้วดูว่า login ทำงานยังไง"

✅ ประหยัด — ชี้ตรงเลย:
> "ดู @src/contexts/auth-context.tsx ฟังก์ชัน login ทำงานยังไง"
```

**ทำไม:** การค้นหาทั้ง project = อ่านไฟล์หลายสิบไฟล์ = token จำนวนมาก

---

### กฎที่ 2: 1 งาน = 1 Session

```
❌ เปลือง — session ยาว ทำหลายงาน:
Session เดียว: แก้ bug order → สร้าง feature report → refactor auth → แก้ typo UI

✅ ประหยัด — แยก session ตามงาน:
Session 1: แก้ bug order (เสร็จ → ปิด)
Session 2: สร้าง feature report (เสร็จ → ปิด)
Session 3: refactor auth (เสร็จ → ปิด)
```

---

### กฎที่ 3: `/compact` เมื่อ Session ยาว

```bash
# เมื่อ session ยาวมาก Claude จะช้าลงและแพงขึ้น
# ใช้ /compact เพื่อบีบ conversation ให้สั้นลงโดยยังจำ context สำคัญไว้

/compact

# หรือเปิด auto-compact ตั้งแต่ต้น
claude --auto-compact
```

**เมื่อไรใช้:** เมื่อ session มีมากกว่า 20–30 message หรือเริ่มรู้สึกว่า Claude ตอบช้าลง

---

### กฎที่ 4: บอกให้ตอบสั้น

```
❌ เปลือง — Claude อธิบายยาวเกินจำเป็น:
> "สร้าง function validate email"
(Claude อธิบาย 3 วิธี, trade-off แต่ละวิธี, ตัวอย่างการใช้งาน, test cases...)

✅ ประหยัด — บอกให้ตอบตรงๆ:
> "สร้าง function validate email — ตอบแค่ code ไม่ต้องอธิบาย"
> "สร้าง function validate email — บอกสั้นๆ ว่าใช้ regex หรือ library"
```

---

### กฎที่ 5: อย่าให้อ่านไฟล์ใหญ่ทั้งไฟล์

```
❌ เปลือง:
> "อ่าน @src/services/api-service.ts แล้วบอกว่า _post ทำงานยังไง"
(Claude อ่านทั้งไฟล์ 200+ บรรทัด)

✅ ประหยัด:
> "ใน @src/services/api-service.ts ฟังก์ชัน _post (ประมาณบรรทัด 30-50) ทำงานยังไง"
```

---

### กฎที่ 6: อย่า Paste Stack Trace ทั้งหมด

```
❌ เปลือง — paste error ทั้งหมด (อาจยาว 100+ บรรทัด):
> "Error:
   TypeError: Cannot read properties of undefined (reading 'data')
       at OrderTable (./src/components/orders/order-table.tsx:45:23)
       at renderWithHooks (.../react-dom/cjs/react-dom.development.js:...)
       at mountIndeterminateComponent (...)
       ... (80 บรรทัดถัดไป)
   "

✅ ประหยัด — paste แค่ส่วนสำคัญ:
> "Error: Cannot read properties of undefined (reading 'data')
   ที่ @src/components/orders/order-table.tsx บรรทัด 45
   data มาจาก useQuery ซึ่ง query ยังไม่ return"
```

---

### กฎที่ 7: `/clear` เมื่อเปลี่ยน Topic

```bash
# ทำงาน feature A เสร็จแล้ว จะเริ่ม feature B

/clear    # ← ล้าง context เก่าทั้งหมด

# จากนั้นค่อยเริ่ม topic ใหม่
> "สร้าง feature notifications..."
```

**ทำไม:** context เก่าเกี่ยวกับ feature A ไม่มีประโยชน์สำหรับ feature B แต่ยังเพิ่ม token cost

---

### กฎที่ 8: เลือก Model ให้เหมาะกับงาน

| Model | ราคาสัมพัทธ์ | เหมาะกับ |
|---|---|---|
| **Haiku** | ถูกสุด (~5x ถูกกว่า Sonnet) | แก้ typo, rename variable, ถาม syntax, format code |
| **Sonnet** | ปานกลาง (default) | เขียน feature, แก้ bug ทั่วไป, refactor |
| **Opus** | แพงสุด (~3x แพงกว่า Sonnet) | Design architecture, debug ซับซ้อน, code review ลึก |

```bash
# สลับ model ใน session
/model

# หรือระบุตอนเปิด
claude --model claude-haiku-4
claude --model claude-opus-4
```

**กฎง่ายๆ:**
- งานง่าย ไม่ต้องคิดมาก → Haiku
- งานทั่วไป → Sonnet (default)
- งานที่ต้องการ reasoning ลึก → Opus

---

### กฎที่ 9: ใช้ Plan Mode สำหรับงานใหญ่

```
สถานการณ์: ต้องการ refactor authentication system ทั้งหมด

❌ ไม่ใช้ Plan Mode:
> "refactor auth system"
Claude ลงมือแก้ไฟล์ 10 ไฟล์เลย → แก้ไปครึ่งทาง → พบว่าทิศทางผิด
→ ต้องใช้ /undo หลายครั้ง + ใช้ token สูญเปล่า

✅ ใช้ Plan Mode (Shift+Tab):
> "refactor auth system"
[กด Shift+Tab เข้า Plan Mode]
Claude: "นี่คือแผน: 1)... 2)... 3)... ต้องการให้ทำไหม?"
คุณ: "แผนดีแต่อย่าแตะ proxy.ts — ทำแค่ context กับ service"
Claude: [แก้เฉพาะที่ตกลงกัน]
```

---

### กฎที่ 10: ใส่ CLAUDE.md ให้ครบถ้วน

```
❌ ไม่มี CLAUDE.md หรือครบน้อย:
> "สร้าง order page"
Claude: ใช้ useState fetch, className สุ่มตั้งชื่อ, ไม่มี pagination
→ ต้องสั่งแก้หลายรอบ = token เพิ่ม

✅ มี CLAUDE.md ครบ:
> "สร้าง order page"
Claude: ใช้ React Query, Ant Design Table, PAGE_SIZE=20, server pagination
→ ถูกตั้งแต่รอบแรก = ประหยัด token
```

---

### สรุปกฎ 10 ข้อ

| # | กฎ | ประหยัดได้ |
|---|---|---|
| 1 | ชี้ไฟล์ให้ชัด | ลด search cost |
| 2 | 1 งาน = 1 session | ลด context overhead |
| 3 | `/compact` เมื่อยาว | ลด context size |
| 4 | บอกให้ตอบสั้น | ลด output token |
| 5 | อย่าให้อ่านทั้งไฟล์ | ลด input token |
| 6 | Paste แค่ส่วนสำคัญของ error | ลด input token |
| 7 | `/clear` เมื่อเปลี่ยน topic | ลด context overhead |
| 8 | เลือก model ให้เหมาะ | ลดราคาต่อ token |
| 9 | Plan Mode สำหรับงานใหญ่ | ลด rework token |
| 10 | CLAUDE.md ครบถ้วน | ลด correction rounds |

---

## 3.3 Custom Commands

### คืออะไร?

Custom commands คือ **slash commands ที่คุณสร้างเอง** สำหรับงานที่ทำบ่อย เก็บไว้เป็น markdown file ใน `.claude/commands/`

### วิธีสร้าง

```
project/
└── .claude/
    └── commands/
        ├── review.md       → /review
        ├── commit.md       → /commit
        ├── new-feature.md  → /new-feature
        └── debug.md        → /debug
```

**รูปแบบไฟล์:**

```markdown
# /commit

สร้าง git commit message ตาม conventional commits:
- feat: สำหรับ feature ใหม่
- fix: สำหรับ bug fix
- docs: สำหรับ documentation
- refactor: สำหรับ refactor

ขั้นตอน:
1. รัน `git diff --staged` เพื่อดูว่า stage อะไรไว้บ้าง
2. รัน `git status` เพื่อดู unstaged files
3. เสนอ commit message ตามรูปแบบ
4. ถามยืนยันก่อน commit จริง
```

### วิธีเรียกใช้

```
> /review     ← Claude review code ตาม command นั้น
> /commit     ← Claude สร้าง commit message
> /new-feature orders  ← Claude scaffold feature ตาม template
```

### ตัวอย่าง Custom Commands ที่ใช้บ่อย

**`/new-feature` — Scaffold feature ใหม่:**

```markdown
# /new-feature

สร้าง feature ใหม่ตาม checklist ใน CLAUDE.md:

รับ argument: ชื่อ feature (เช่น `/new-feature orders`)

สร้างไฟล์:
1. `src/types/[feature].ts` — IFeature interface
2. `src/services/[feature]-service.ts` — CRUD methods
3. `src/app/[locale]/(main)/[feature]/page.tsx` — list page + pagination
4. เพิ่ม translation key ใน th/common.json และ en/common.json

ใช้:
- React Query สำหรับ data fetching
- Ant Design Table + pagination convention (PAGE_SIZE=20)
- Naming conventions ตาม CLAUDE.md
```

**`/review` — Code review ก่อน commit:**

```markdown
# /review

Review code ที่ staged (`git diff --staged`) ตามกฎเหล่านี้:

Checklist:
- [ ] Naming conventions ถูกต้อง (kebab-case files, PascalCase components, I prefix)
- [ ] Import ordering ถูกต้อง (React/Next → external → internal)
- [ ] ไม่มี useEffect fetch — ใช้ React Query เท่านั้น
- [ ] ไม่มี console.log — ใช้ console.info/warn/error
- [ ] ไม่มี any type
- [ ] styled-components อยู่ล่างสุดของไฟล์
- [ ] ไม่มี secrets หรือ hardcoded credentials

รายงานปัญหาที่พบพร้อม line number และวิธีแก้ไข
```

---

## 3.4 Workflow แนะนำ 3 แบบ

### Workflow 1: งานปกติ (Feature / Bug Fix ทั่วไป)

```
1. เปิด session
   $ claude

2. สั่งงาน (ชี้ไฟล์ + context ครบ)
   > "แก้ bug ใน @src/... บรรทัด X — อธิบายว่า..."

3. Review code ที่ Claude แก้
   ! git diff

4. ทดสอบ
   ! pnpm lint
   ! pnpm build

5. Commit
   /commit    ← ใช้ custom command
   หรือ ! git add [files] && git commit -m "fix: ..."

6. ปิด session
   Ctrl+C
```

---

### Workflow 2: งานใหญ่ (New Feature / Refactor)

```
1. เปิด session
   $ claude

2. เข้า Plan Mode (Shift+Tab)
   > "สร้าง feature order management ตาม checklist ใน CLAUDE.md"

3. ดู plan ที่ Claude เสนอ
   → ตรวจสอบว่าทิศทางถูกต้อง
   → ปรับ scope ถ้าจำเป็น

4. Approve plan
   > "ดีแล้ว ดำเนินการได้เลย"

5. ระหว่าง implement ตรวจสอบเป็นระยะ
   ! git diff
   ! pnpm lint

6. Commit เมื่อแต่ละส่วนเสร็จ (ไม่รอจนเสร็จทั้งหมด)
   ! git add src/types/order.ts && git commit -m "feat: add order types"
   ! git add src/services/ && git commit -m "feat: add order service"

7. ปิด session
   Ctrl+C
```

---

### Workflow 3: Debug

```
1. เปิด session
   $ claude

2. Paste error (แค่ส่วนสำคัญ) + ชี้ไฟล์
   > "Error: [ข้อความ error สั้นๆ]
      ที่ @src/components/orders/order-table.tsx บรรทัด 45
      เกิดเมื่อ... [อธิบาย context]"

3. ให้ Claude วิเคราะห์ก่อน ยังไม่ต้องแก้
   > "วิเคราะห์ก่อน อย่าแก้ไฟล์ยัง — บอกว่า root cause น่าจะเป็นอะไร"

4. หลังเข้าใจ root cause → สั่งแก้
   > "ดีแล้ว แก้ตามที่วิเคราะห์ได้เลย"

5. ทดสอบ
   ! pnpm dev   (หรือ test case ที่เกี่ยวข้อง)

6. Commit
   ! git add [file] && git commit -m "fix: [description]"

7. ปิด session
   Ctrl+C
```

---

### Workshop 3 — ทำงานเดียวกัน 2 รอบ

**โจทย์:** เพิ่ม feature "ค้นหา order ด้วย keyword" ใน order page

**รอบที่ 1 — ไม่ใช้เทคนิคประหยัด token:**

```bash
claude
> "ทำ search"
# (Claude ถามกลับ, ค้นหาไฟล์เอง, ตอบยาว)
> "ใน order page"
> "ใช้ input"
> "เชื่อม API"
# นับจำนวน message ที่ใช้
```

**รอบที่ 2 — ใช้เทคนิค:**

```bash
claude
> "เพิ่ม search bar ใน @src/app/[locale]/(main)/orders/page.tsx:
   - Ant Design Input.Search component
   - state: searchKeyword (string, default '')
   - ส่ง keyword ไปเป็น param ใน useQuery: { page, limit, keyword }
   - reset currentPage เป็น 1 เมื่อ keyword เปลี่ยน
   - ตอบแค่ code diff ไม่ต้องอธิบาย"
# รอบเดียวจบ
```

**สังเกตความแตกต่าง:** จำนวน message, ความถูกต้องตั้งแต่รอบแรก, เวลาที่ใช้

---

## สรุป Session 3

| หัวข้อ | สิ่งสำคัญที่ต้องจำ |
|---|---|
| Token คืออะไร | ทุก message อ่าน context ทั้งหมดซ้ำ — session ยาว = แพงขึ้น |
| ประหยัด token | ชี้ไฟล์, 1 งาน 1 session, /compact, บอกให้ตอบสั้น |
| เลือก model | Haiku (ง่าย) → Sonnet (ทั่วไป) → Opus (ซับซ้อน) |
| Custom commands | `.claude/commands/[name].md` → เรียกด้วย `/name` |
| Workflow | งานปกติ / งานใหญ่ (Plan Mode) / Debug — แต่ละแบบต่างกัน |

---

**ถัดไป → [Session 4: Superpowers](session-4-superpowers.md)**
