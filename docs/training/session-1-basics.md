# Session 1: พื้นฐาน Claude Code

> **เป้าหมาย:** ทีมเปิดใช้ Claude Code ได้ สั่งงานเป็น และรู้คำสั่งพื้นฐาน
> **ระยะเวลา:** 1–1.5 ชั่วโมง

---

## 1.1 Claude Code คืออะไร?

Claude Code คือ AI assistant ที่ทำงานอยู่ใน **terminal** หรือ **IDE** ของคุณโดยตรง — ไม่ใช่แค่ chatbot ที่ตอบคำถาม แต่เป็น **agent** ที่:

- **อ่าน code** ในโปรเจกต์ของคุณได้จริง — ทั้งไฟล์ โฟลเดอร์ โครงสร้างทั้งหมด
- **แก้ไขไฟล์** ได้โดยตรง — ไม่ต้อง copy-paste เอง
- **รัน command** ได้ — build, lint, test, git ได้ทุกอย่าง
- **คิดเป็นขั้นตอน** — วางแผนก่อนทำ แล้วทำจริง

### เปรียบเทียบให้เห็นภาพ

| ลักษณะ | ChatGPT / Copilot Chat | Claude Code |
|---|---|---|
| รู้จัก codebase จริง | ไม่ (ต้อง paste) | ใช่ (อ่านเองได้) |
| แก้ไขไฟล์โดยตรง | ไม่ | ใช่ |
| รัน command | ไม่ | ใช่ |
| ทำงานหลายไฟล์พร้อมกัน | จำกัด | ใช่ |

> **สรุป:** Claude Code เหมือนมี junior developer นั่งข้างๆ ที่เห็น code เดียวกันกับเรา และทำงานให้จริงๆ

---

## 1.2 เปิดใช้งาน Claude Code

### วิธีเปิด

```bash
# เปิดใน project ปัจจุบัน (ต้อง cd เข้า project ก่อน)
claude

# เปิด session ล่าสุดที่ค้างไว้
claude --resume

# เปิดพร้อมสั่งงานเลย (ข้าม prompt แรก)
claude "สร้าง component LoginForm"

# เปิดแบบไม่บันทึก session (เหมาะกับงานทดลอง)
claude --no-session
```

### สิ่งที่ Claude อ่านตอนเปิด session

เมื่อคุณรัน `claude` ใน project นี้ Claude จะอ่านไฟล์ต่อไปนี้อัตโนมัติ:

```
CLAUDE.md                    ← กฎ project (tech stack, architecture)
.claude/CLAUDE.md            ← กฎทีม (naming, patterns)
~/.claude/CLAUDE.md          ← กฎส่วนตัวของคุณ
```

นี่คือเหตุผลที่ Claude รู้ว่าต้องใช้ React Query, Ant Design, ไม่ใช้ useEffect fetch ฯลฯ

---

### Workshop 1.2 — เปิด Claude Code ใน Boilerplate

**ขั้นตอน:**

```bash
# 1. เข้า project
cd /path/to/frontend-web-boilerplate-it

# 2. เปิด Claude Code
claude

# 3. ถามว่า Claude เห็นอะไรบ้าง
> "อธิบาย structure ของ project นี้ให้ฟังสั้นๆ"
```

**สิ่งที่ต้องสังเกต:**
- Claude ตอบได้ถูกต้องโดยไม่ต้อง paste code ใดๆ เลย
- Claude รู้จัก tech stack, route groups, naming rules ของทีม

---

## 1.3 คำสั่งพื้นฐาน (Slash Commands)

ใน Claude Code session พิมพ์ `/` นำหน้าเพื่อใช้คำสั่งพิเศษ:

| คำสั่ง | หน้าที่ | เมื่อใช้ |
|---|---|---|
| `/help` | ดูคำสั่งทั้งหมด | ลืมคำสั่ง |
| `/clear` | ล้าง conversation context | เปลี่ยน topic ใหม่ |
| `/undo` | ย้อนการแก้ไขไฟล์ล่าสุด | Claude แก้ไขผิดพลาด |
| `/model` | สลับ AI model | ต้องการ model ที่ถูกกว่า/แรงกว่า |
| `/compact` | บีบ context ให้สั้นลง | session ยาวมาก เริ่มช้า |
| `/review` | ขอ code review | ก่อน commit |
| `/commit` | สร้าง git commit | หลัง implement เสร็จ |

**คำสั่ง shell ใน session:**

```bash
# ใช้ ! นำหน้าเพื่อรัน shell command โดยไม่ออกจาก session
! git status
! pnpm lint
! pnpm test
! ls src/components/
```

**อ้างอิงไฟล์ใน prompt:**

```
> แก้ bug ใน @src/contexts/auth-context.tsx บรรทัด 37
> อธิบาย @src/services/api-service.ts ให้ฟัง
> สร้าง service คล้ายกับ @src/services/user-service.ts
```

---

### Workshop 1.3 — ลองใช้แต่ละคำสั่ง

ทำตามลำดับใน session Claude ที่เปิดไว้:

```
1. พิมพ์ /help → ดูคำสั่งทั้งหมดที่มี
2. พิมพ์ ! git log --oneline -5 → ดู commit ล่าสุด
3. พิมพ์ ! pnpm lint → รัน lint ตรงๆ จาก session
4. พิมพ์ @src/app/[locale]/layout.tsx → Claude อธิบายไฟล์นั้น
5. พิมพ์ /clear → ล้าง context แล้วเริ่มใหม่
```

---

## 1.4 วิธีสั่ง AI ที่ดี

### หลักการ: Context + เป้าหมาย + ขอบเขต

Claude ทำได้ดีขึ้นมากเมื่อ prompt มีครบ 3 ส่วน:

```
[Context]   → นี่คือ feature อะไร, ไฟล์ไหน, บรรทัดไหน
[เป้าหมาย] → ต้องการให้ทำอะไร
[ขอบเขต]   → ไม่ต้องทำอะไร / แก้แค่ไหน
```

### ตัวอย่างเปรียบเทียบ

| ❌ สั่งแบบนี้ | ✅ สั่งแบบนี้ |
|---|---|
| "แก้ bug" | "login แล้ว redirect ไม่ทำงาน ดู `@src/contexts/auth-context.tsx` บรรทัด 37 — หลัง login สำเร็จให้ไปที่ `/dashboard`" |
| "ทำหน้า order" | "สร้างหน้า order list ที่ `src/app/[locale]/(main)/orders/page.tsx` — ดึงจาก `GET /v1/orders` แสดงเป็น Ant Design Table มี pagination server-side ตาม convention ใน CLAUDE.md" |
| "สร้าง service" | "สร้าง `src/services/order-service.ts` ตามรูปแบบเดียวกับ `@src/services/user-service.ts` สำหรับ endpoint `/v1/orders`" |
| "ทำไม build พัง" | "รัน `pnpm build` แล้วได้ error นี้: [paste error] ดูว่าปัญหาอยู่ที่ไหน" |

### เทคนิคสำคัญ

**1. ชี้ไฟล์ให้ชัด — ไม่ต้องให้ Claude ค้นหาเอง**

```
# ไม่ดี — Claude ต้องค้นหาเอง เสีย token
> "หา auth context แล้วแก้"

# ดี — ชี้ตรงเลย
> "แก้ @src/contexts/auth-context.tsx"
```

**2. สั่งให้ครบในรอบเดียว**

```
# ไม่ดี — 3 รอบ = 3 เท่าของ token
> "สร้าง type"
> "สร้าง service"
> "สร้าง page"

# ดี — รอบเดียว
> "สร้าง feature user profile: type ใน src/types/user.ts, 
   service ใน src/services/user-service.ts, 
   page ใน src/app/[locale]/(main)/profile/page.tsx"
```

**3. ใช้ @filename เพื่อ reference ไฟล์ที่มีอยู่**

```
> "สร้าง component ใหม่คล้ายกับ @src/components/orders/order-table.tsx 
   แต่สำหรับ invoices"
```

**4. Multi-turn เมื่อจำเป็น**

บางครั้งการแก้ทีละขั้นตอนดีกว่า — โดยเฉพาะเมื่องานซับซ้อนหรือต้องการ feedback ระหว่างทาง:

```
Turn 1: "วางโครงสร้าง component ก่อน ยังไม่ต้อง implement logic"
Turn 2: (ดู structure แล้ว) "ดีแล้ว ตอนนี้เพิ่ม useQuery hook"
Turn 3: "เพิ่ม error state และ loading state"
```

---

### Workshop 1.4 — สั่ง Claude แก้ Bug ง่ายๆ

**โจทย์:** แก้ button ใน login page ให้แสดง loading state ขณะส่ง form

**ขั้นตอน:**

```bash
# 1. เปิด Claude Code
claude

# 2. ลองสั่งแบบไม่ดีก่อน (สังเกตว่า Claude ถามกลับหรือทำผิด)
> "ทำให้ button loading"

# 3. สั่งแบบดี
> "ใน @src/app/[locale]/(auth)/login/page.tsx 
   ทำให้ submit button แสดง loading={true} ขณะที่ form กำลัง submit
   ใช้ Ant Design Button prop loading — ไม่ต้องแก้ไฟล์อื่น"

# 4. Review ก่อน accept
# 5. ถ้าไม่ถูกใจ ใช้ /undo แล้วลองใหม่
```

---

## 1.5 Keyboard Shortcuts

| ปุ่ม (Mac) | ปุ่ม (Windows/Linux) | หน้าที่ |
|---|---|---|
| `Enter` | `Enter` | ส่งข้อความ / confirm action |
| `Option+Enter` | `Ctrl+Enter` | ขึ้นบรรทัดใหม่ (ไม่ส่ง) |
| `Shift+Tab` | `Shift+Tab` | สลับ **Plan Mode** (Claude วางแผนก่อน ไม่ลงมือทันที) |
| `Esc` | `Esc` | ยกเลิก / หยุดการทำงานที่กำลังรัน |
| `Ctrl+C` | `Ctrl+C` | ออกจาก session |
| `↑` / `↓` | `↑` / `↓` | เลื่อนดู history ของ prompt ที่พิมพ์ไป |

### Plan Mode คืออะไร?

เมื่อกด `Shift+Tab` Claude จะ **วางแผนให้เห็นก่อน** โดยไม่แก้ไขไฟล์ใดๆ ทันที:

```
# ตัวอย่าง Plan Mode output:
"นี่คือสิ่งที่ฉันจะทำ:
1. สร้าง src/types/order.ts — define IOrder, IOrderListResponse
2. สร้าง src/services/order-service.ts — getOrders, getOrderById
3. สร้าง src/app/[locale]/(main)/orders/page.tsx — Table + pagination
4. เพิ่ม translation key ใน src/messages/th/common.json และ en/common.json

ต้องการให้ดำเนินการไหม?"
```

ใช้เมื่องานซับซ้อน หรือไม่แน่ใจว่า Claude จะทำถูกต้อง

---

## 1.6 ข้อควรระวัง

Claude ทำงานได้ดีมาก แต่ต้องมีวินัยในการใช้:

### สิ่งที่ต้องทำเสมอ

| ✅ ทำ | เหตุผล |
|---|---|
| Review code ก่อน accept | Claude อาจเข้าใจ requirement ผิด |
| ใช้ `/undo` เมื่อไม่ถูกใจ | ย้อนได้ง่ายกว่าแก้ทีหลัง |
| Commit บ่อยๆ | มี checkpoint ให้ rollback ได้ |
| ทดสอบก่อน commit | `pnpm lint` และ `pnpm build` ผ่านก่อนเสมอ |

### สิ่งที่ต้องหลีกเลี่ยง

| ❌ อย่าทำ | เหตุผล |
|---|---|
| Commit โดยไม่ review | Claude อาจสร้าง code ที่ดูถูกแต่ logic ผิด |
| Push ทันทีหลัง Claude แก้ | ต้อง test ก่อนเสมอ |
| ใส่ secrets, passwords ลงใน chat | ข้อมูลอาจถูก log |
| Blindly accept ทุก suggestion | คุณยังต้องเป็น reviewer หลัก |
| ปล่อย session ค้างไว้นานๆ | Context ยาวขึ้น = แพงขึ้ง เริ่ม session ใหม่เมื่อเปลี่ยนงาน |

---

## สรุป Session 1

| หัวข้อ | สิ่งสำคัญที่ต้องจำ |
|---|---|
| Claude Code คืออะไร | Agent ที่อ่าน/แก้ไฟล์/รัน command ได้จริง |
| เปิดใช้งาน | `claude` ใน project directory |
| คำสั่งพื้นฐาน | `/clear`, `/undo`, `/compact`, `/model`, `!cmd`, `@file` |
| สั่งงานที่ดี | Context + เป้าหมาย + ขอบเขต + ชี้ไฟล์ให้ชัด |
| ข้อควรระวัง | Review ก่อน accept, commit บ่อย, อย่า push โดยไม่ test |

---

**ถัดไป → [Session 2: CLAUDE.md & Coding Rules](session-2-claudemd-rules.md)**
