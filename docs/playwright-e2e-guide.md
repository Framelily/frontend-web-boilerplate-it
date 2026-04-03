# Playwright E2E Testing Guide

คู่มือการเขียน End-to-End Test ด้วย Playwright สำหรับโปรเจกต์ Next.js + Ant Design

---

## สารบัญ

**Part 1: ทำไมต้อง Test?**

1. [Playwright คืออะไร?](#1-playwright-คืออะไร)
2. [ทำไมต้องเขียน E2E Test?](#2-ทำไมต้องเขียน-e2e-test)
3. [ประเภทของ Testing ในโปรเจกต์](#3-ประเภทของ-testing-ในโปรเจกต์)
4. [ระดับความลึกของ E2E Test](#4-ระดับความลึกของ-e2e-test)

**Part 2: วิธีเขียน Test ในโปรเจกต์นี้**

5. [โครงสร้างไฟล์ในโปรเจกต์](#5-โครงสร้างไฟล์ในโปรเจกต์)
6. [การตั้งค่า Config](#6-การตั้งค่า-config)
7. [ระบบ Authentication](#7-ระบบ-authentication)
8. [คำสั่งที่ใช้งาน](#8-คำสั่งที่ใช้งาน)
9. [วิธีเลือก Selector](#9-วิธีเลือก-selector)
10. [โครงสร้างไฟล์ Test](#10-โครงสร้างไฟล์-test)
11. [Pattern สำหรับ CRUD](#11-pattern-สำหรับ-crud)
12. [Pattern สำหรับ Filter](#12-pattern-สำหรับ-filter)
13. [Pattern สำหรับ Modal / Form](#13-pattern-สำหรับ-modal--form)
14. [Pattern สำหรับ Table](#14-pattern-สำหรับ-table)
15. [การจัดการ Wait / Timeout](#15-การจัดการ-wait--timeout)
16. [การจัดการ Edge Cases](#16-การจัดการ-edge-cases)

**Part 3: Reference**

17. [Checklist ก่อนเขียน Test ใหม่](#17-checklist-ก่อนเขียน-test-ใหม่)
18. [ปัญหาที่พบบ่อยและวิธีแก้](#18-ปัญหาที่พบบ่อยและวิธีแก้)

---

## 1. Playwright คืออะไร?

Playwright เป็น E2E testing framework จาก Microsoft ที่จำลองการใช้งานจริงของผู้ใช้ผ่าน browser เหมือนมีคนมานั่งคลิกจริง ๆ

**ทำไมถึงใช้ Playwright?**

- **Auto-wait** — รอ element พร้อมก่อนคลิกให้อัตโนมัติ ไม่ต้องเขียน sleep เอง
- **รองรับหลาย browser** — Chromium, Firefox, WebKit
- **Codegen** — บันทึกการคลิกแล้วสร้าง code ให้
- **Trace Viewer** — debug test ที่ fail ได้ง่ายด้วย screenshot + network log
- **HTML Report** — ดูผลการทดสอบเป็นรายงาน

---

## 2. ทำไมต้องเขียน E2E Test?

### เปรียบเทียบ: มี E2E Test vs ไม่มี

| สถานการณ์ | ไม่มี E2E Test | มี E2E Test |
| --- | --- | --- |
| แก้ code แล้ว deploy | ต้องเปิด browser คลิกเช็คทุกหน้าเอง | รัน `pnpm test:e2e` รอ 1 นาที ผ่านหมด = มั่นใจ |
| QA ทดสอบ | ใช้เวลา 30-60 นาทีต่อรอบ ทำซ้ำทุก sprint | ใช้เวลา 1-2 นาที รันได้ไม่จำกัดรอบ |
| แก้ component ที่ใช้หลายหน้า | ไม่รู้ว่าหน้าไหนพังบ้าง จนลูกค้าแจ้ง | test fail ทันทีตรงหน้าที่พัง |
| คนใหม่เข้าทีม | ต้องอ่าน code + ถามคนเก่า ว่าระบบทำอะไรได้ | อ่าน test file = เข้าใจ flow ทั้งหมด |
| Production bug | รู้ตอนลูกค้าเจอ | รู้ก่อน deploy (ถ้าเขียน test ครอบคลุม) |

### ข้อดี

- **ป้องกัน regression** — แก้จุดนึงแล้วที่อื่นไม่พัง
- **ทดสอบ flow จริง** — ครอบคลุม frontend + API + database ตั้งแต่คลิกจนถึง response
- **ประหยัดเวลา** — 30 test cases รันจบใน 1-2 นาที (vs คนคลิก 30-60 นาที)
- **เป็น living documentation** — อ่าน test แล้วรู้ว่าระบบทำอะไรได้
- **มั่นใจก่อน deploy** — รันผ่านหมด = ระบบหลักยังทำงานปกติ

### ข้อเสีย

- **ใช้เวลาเขียนเพิ่ม** — ต้องลงทุนเวลาเขียน test นอกเหนือจาก feature
- **ต้องดูแล** — UI เปลี่ยน → test ต้องแก้ตาม
- **ช้ากว่า unit test** — รัน browser จริงใช้เวลามากกว่า
- **Flaky test** — อาจ fail เพราะ network ช้า, animation ไม่ทัน (แต่แก้ได้ด้วย pattern ที่ดี)
- **ต้องมี dev server รัน** — ต้องเปิด `pnpm dev` ก่อนรัน test

### เมื่อไหร่ควรเขียน / ไม่ควรเขียน

| ควรเขียน E2E Test | ไม่จำเป็นต้องเขียน |
| --- | --- |
| Flow หลักที่ลูกค้าใช้ทุกวัน (จอง, ชำระเงิน) | หน้า static ที่แทบไม่เปลี่ยน (About Us) |
| CRUD ที่มีหลายขั้นตอน | UI tweak เล็ก ๆ (เปลี่ยนสี, ขยับ margin) |
| Form ที่มี validation ซับซ้อน | Prototype / POC ที่ยังไม่แน่ใจว่าจะใช้ |
| ระบบ permission / auth | Feature ที่กำลังจะถูกรื้อใหม่ทั้งหมด |
| Flow ที่เคยมี bug ซ้ำ ๆ | |

---

## 3. ประเภทของ Testing ในโปรเจกต์

```
              ▲  น้อยกว่า แต่ครอบคลุมกว้าง
             /🔺\
            / E2E \          ← Playwright (เรากำลังเรียนตัวนี้)
           /--------\           ทดสอบ flow ทั้งหมดผ่าน browser จริง
          /Integration\      ← API test, component + API
         /--------------\       ทดสอบหลาย unit ทำงานร่วมกัน
        /   Unit Tests    \  ← Vitest / Jest
       /--------------------\   ทดสอบ function เดียว
              ▼  เยอะกว่า แต่ scope เล็ก
```

### เปรียบเทียบทุกประเภท

| | Unit Test | Integration Test | E2E Test |
| --- | --- | --- | --- |
| **เครื่องมือ** | Vitest / Jest | Vitest + MSW | Playwright |
| **ทดสอบอะไร** | function / hook เดียว | component + API ทำงานร่วมกัน | flow ทั้งหมดผ่าน browser |
| **ความเร็ว** | เร็วมาก (ms) | ปานกลาง (100ms-1s) | ช้าสุด (วินาที) |
| **ความมั่นใจ** | ต่ำ (ทดสอบแค่ส่วนเล็ก) | กลาง | สูง (เหมือนผู้ใช้จริง) |
| **ค่าดูแล** | ต่ำ | กลาง | สูง (UI เปลี่ยนต้องแก้) |
| **ตัวอย่าง** | `formatDate()` return ถูก | `<LoginForm>` ส่ง API แล้ว redirect | เปิด browser → กรอก login → เห็น dashboard |
| **ใช้ browser จริงไหม** | ไม่ | ไม่ (ใช้ jsdom) | ใช่ |
| **เข้าถึง database ไหม** | ไม่ | อาจจะ (mock ได้) | ใช่ (ผ่าน API จริง) |

### แนวทางที่แนะนำสำหรับโปรเจกต์นี้

- **Unit test** — utility functions (`parser.ts`, `status-helpers.tsx`)
- **E2E test** — flow หลักทุกหน้า (ที่เราทำอยู่ตอนนี้)
- **Integration test** — ไม่จำเป็นในตอนนี้ เพราะ E2E ครอบคลุมได้แล้ว

---

## 4. ระดับความลึกของ E2E Test

E2E test เขียนได้หลายระดับ แต่ละระดับครอบคลุมต่างกัน:

### Level 1: Smoke Test (พื้นฐาน) ✅ ที่ทำไปแล้ว

> "ระบบเปิดได้ไหม? หน้าหลัก ๆ ทำงานปกติไหม?"

**ทดสอบอะไร:**

- หน้าโหลดได้ ไม่ขึ้น error
- ตารางแสดงข้อมูล
- CRUD ทำงานครบ (สร้าง, แก้ไข, ลบ)
- Filter ค้นหาและล้างได้
- Modal เปิด/ปิดถูกต้อง
- Login สำเร็จ/ล้มเหลว

**ตัวอย่างจากโปรเจกต์:**

```ts
// ตรวจว่าหน้า room โหลดได้ ตารางมีข้อมูล
test('should display room list with table data', async ({ page }) => {
  await page.goto('/th/room')
  await page.locator('.ant-table').waitFor({ timeout: 15000 })
  await expect(page.getByRole('heading', { name: 'จัดการห้องเก็บของ' })).toBeVisible()
})
```

| ข้อดี | ข้อเสีย |
| --- | --- |
| เขียนเร็ว ใช้เวลาน้อย | ไม่ครอบคลุม edge case |
| จับ bug หยาบ ๆ ได้ (หน้าพัง, API ล่ม) | ไม่ตรวจ validation, permission |
| คุ้มค่าที่สุด (effort vs coverage) | อาจพลาด bug ที่ซ่อนอยู่ |

---

### Level 2: Validation & Form Testing (กลาง)

> "ถ้าผู้ใช้กรอกผิด ระบบแจ้ง error ถูกต้องไหม?"

**ทดสอบอะไร:**

- กดบันทึกโดยไม่กรอกข้อมูล → แสดง error message
- กรอก format ผิด (เบอร์โทรสั้นเกินไป, email ไม่ถูก format)
- กรอกข้อมูลซ้ำ (เลขห้องซ้ำ, username ซ้ำ) → API แจ้ง error
- ค่า default ถูกต้อง, ค่า pre-fill ถูกต้องเมื่อแก้ไข

**ตัวอย่าง:**

```ts
test('should show validation errors on empty submit', async ({ page }) => {
  await page.goto('/th/room')
  await page.getByRole('button', { name: 'เพิ่มห้องใหม่' }).click()
  await page.locator('.ant-modal').waitFor({ timeout: 5000 })

  // กดบันทึกโดยไม่กรอกอะไร
  await page.locator('.ant-modal').getByRole('button', { name: 'เพิ่มห้อง' }).click()

  // ตรวจว่ามี error message แสดง
  await expect(page.locator('.ant-form-item-explain-error').first()).toBeVisible()
})

test('should reject duplicate room number', async ({ page }) => {
  await page.goto('/th/room')
  await page.getByRole('button', { name: 'เพิ่มห้องใหม่' }).click()
  await page.locator('.ant-modal').waitFor({ timeout: 5000 })

  // กรอกเลขห้องที่มีอยู่แล้ว
  await page.locator('.ant-modal').getByPlaceholder('เช่น A001').fill('A001')
  await page.locator('.ant-modal').getByLabel('ชั้น').click()
  await page.locator('.ant-select-dropdown:visible .ant-select-item').first().click()
  await page.locator('.ant-modal').getByRole('button', { name: 'เพิ่มห้อง' }).click()

  // ตรวจว่า API แจ้ง error (notification หรือ form error)
  const error = page.locator('.ant-notification-notice, .ant-form-item-explain-error')
  await expect(error.first()).toBeVisible({ timeout: 10000 })
})
```

| ข้อดี | ข้อเสีย |
| --- | --- |
| จับ bug ที่ผู้ใช้เจอบ่อย (กรอกผิด) | ใช้เวลาเขียนเพิ่มพอสมควร |
| ครอบคลุม happy + unhappy path | form เปลี่ยนบ่อย → test ต้องแก้บ่อย |
| ตรวจสอบว่า UX ดี (error message ชัดเจน) | ต้องรู้ business rule แต่ละ field |

---

### Level 3: Permission & Security Testing (กลาง-สูง)

> "ถ้า user ไม่มีสิทธิ์ ระบบบล็อกถูกต้องไหม?"

**ทดสอบอะไร:**

- Login ด้วย user ที่มีสิทธิ์จำกัด → เมนูที่ไม่มีสิทธิ์ไม่แสดง
- เข้า URL ตรง ๆ โดยไม่มีสิทธิ์ → redirect หรือแสดง 403
- Token หมดอายุ → redirect ไปหน้า login
- ไม่มี token → เข้าหน้า protected ไม่ได้

**ตัวอย่าง:**

```ts
test('should redirect to login when token expired', async ({ page }) => {
  // ล้าง session ออก
  await page.context().clearCookies()

  await page.goto('/th/room')

  // ต้อง redirect ไปหน้า login
  await expect(page).toHaveURL(/\/th\/login/)
})

test('should hide menu items without permission', async ({ page }) => {
  // Login ด้วย user ที่มีสิทธิ์จำกัด (ต้องมี test account แยก)
  // ...login with limited user...

  // เมนูที่ไม่มีสิทธิ์ต้องไม่แสดง
  await expect(page.getByText('จัดการแอดมิน')).not.toBeVisible()
})
```

| ข้อดี | ข้อเสีย |
| --- | --- |
| จับช่องโหว่ด้านความปลอดภัย | ต้องมี test account หลายระดับสิทธิ์ |
| ป้องกัน permission bug (เห็นข้อมูลที่ไม่ควรเห็น) | ตั้งค่า test data ซับซ้อนกว่า |
| สำคัญมากสำหรับระบบที่มี role-based access | |

---

### Level 4: Cross-page Flow Testing (สูง)

> "flow ที่ข้ามหลายหน้า ทำงานต่อเนื่องถูกต้องไหม?"

**ทดสอบอะไร:**

- สร้างการจอง → ไปหน้าชำระเงิน → อัปโหลดสลิป → ยืนยัน → สถานะเปลี่ยน
- สร้างสมาชิก → จองให้สมาชิก → ดูประวัติการจอง
- เปลี่ยนสถานะการจอง → badge count ที่ sidebar เปลี่ยนตาม

**ตัวอย่าง:**

```ts
test('should complete full booking-to-payment flow', async ({ page }) => {
  await test.step('Create a booking', async () => {
    await page.goto('/th/booking')
    // ...สร้างการจอง...
    await expect(page.locator('.ant-notification-notice').first()).toBeVisible({ timeout: 15000 })
  })

  await test.step('Navigate to payment page', async () => {
    await page.goto('/th/payment')
    await page.locator('.ant-table').waitFor({ timeout: 15000 })
    // ค้นหาการจองที่เพิ่งสร้าง
  })

  await test.step('Confirm payment', async () => {
    // คลิกยืนยันชำระเงิน
    // ...
  })

  await test.step('Verify booking status changed', async () => {
    await page.goto('/th/booking')
    // ค้นหาการจองเดิม ตรวจว่าสถานะเปลี่ยนแล้ว
  })
})
```

| ข้อดี | ข้อเสีย |
| --- | --- |
| ทดสอบ business flow จริง ครบวงจร | เขียนยาก ใช้เวลามาก |
| จับ bug ที่เกิดจากการเชื่อมต่อหลายระบบ | test รันนาน (หลายนาทีต่อ test) |
| มั่นใจสูงสุดว่าระบบทำงานถูกต้อง | ถ้า fail ต้อง debug หลายจุด |
| | ต้องจัดการ test data cleanup ที่ซับซ้อน |

---

### Level 5: Edge Case & Stress Testing (สูงมาก)

> "ถ้าผู้ใช้ทำอะไรแปลก ๆ ระบบรับไหวไหม?"

**ทดสอบอะไร:**

- กรอกข้อความยาวมาก ๆ (10,000 ตัวอักษร)
- Upload ไฟล์ผิดประเภท / เกิน size limit
- กดบันทึกซ้ำหลายครั้งติด ๆ (double submit)
- เปิด 2 tab แก้ข้อมูลเดียวกัน (race condition)
- Internet ช้า / API timeout

**ตัวอย่าง:**

```ts
test('should prevent double submit', async ({ page }) => {
  await page.goto('/th/room')
  await page.getByRole('button', { name: 'เพิ่มห้องใหม่' }).click()
  await page.locator('.ant-modal').waitFor({ timeout: 5000 })

  // กรอก form
  await page.locator('.ant-modal').getByPlaceholder('เช่น A001').fill(`E2E-${Date.now()}`)
  await page.locator('.ant-modal').getByLabel('ชั้น').click()
  await page.locator('.ant-select-dropdown:visible .ant-select-item').first().click()

  // กดบันทึก 3 ครั้งติด ๆ
  const submitBtn = page.locator('.ant-modal').getByRole('button', { name: 'เพิ่มห้อง' })
  await submitBtn.click()
  await submitBtn.click()
  await submitBtn.click()

  // ควรมีข้อมูลสร้างแค่ 1 ชุด (ไม่ซ้ำ)
  await expect(page.locator('.ant-notification-notice').first()).toBeVisible({ timeout: 15000 })
})
```

| ข้อดี | ข้อเสีย |
| --- | --- |
| จับ bug ที่ทดสอบปกติไม่เจอ | ใช้เวลาเขียนมาก คุ้มค่าน้อยที่สุด |
| ป้องกัน data corruption | scenario เฉพาะทาง เกิดไม่บ่อย |
| สำคัญสำหรับระบบที่เกี่ยวกับเงิน | ตั้งค่า test ยาก (จำลอง network ช้า ฯลฯ) |

---

### สรุป: ควรทำระดับไหน?

```
Level 1: Smoke Test          ★★★★★  ต้องทำ (ทำแล้ว ✅)
Level 2: Validation          ★★★★☆  แนะนำทำต่อ — จับ bug ที่ผู้ใช้เจอบ่อย
Level 3: Permission          ★★★☆☆  ทำเมื่อมีเวลา — สำคัญถ้ามีหลาย role
Level 4: Cross-page Flow     ★★★☆☆  ทำเมื่อมีเวลา — ครอบคลุม business flow
Level 5: Edge Case           ★★☆☆☆  ทำเฉพาะจุดสำคัญ (เช่น flow เงิน)
```

**คำแนะนำ:** เริ่มจาก Level 1 (ทำแล้ว) → ทำ Level 2 ต่อ (validation) เพราะคุ้มค่าที่สุด ส่วน Level 3-5 ค่อย ๆ เพิ่มเมื่อทีมคุ้นเคยกับการเขียน test แล้ว

---

---

# Part 2: วิธีเขียน Test ในโปรเจกต์นี้

---

## 5. โครงสร้างไฟล์ในโปรเจกต์

```text
e2e/
├── playwright.config.ts          # ตั้งค่า Playwright
├── auth/
│   └── login.setup.ts            # Login อัตโนมัติก่อนรัน test
├── tests/
│   ├── login-flow.spec.ts        # ทดสอบหน้า Login
│   ├── dashboard-flow.spec.ts    # ทดสอบ Dashboard
│   ├── room-flow.spec.ts         # ทดสอบจัดการห้อง (CRUD)
│   ├── booking-flow.spec.ts      # ทดสอบการจอง
│   ├── member-flow.spec.ts       # ทดสอบสมาชิก
│   ├── payment-flow.spec.ts      # ทดสอบชำระเงิน
│   ├── discount-flow.spec.ts     # ทดสอบส่วนลด
│   ├── article-flow.spec.ts      # ทดสอบบทความ
│   ├── admin-flow.spec.ts        # ทดสอบจัดการแอดมิน (CRUD)
│   └── settings-flow.spec.ts     # ทดสอบตั้งค่า
└── .auth/
    └── user.json                 # Session ที่ cache ไว้ (gitignored)
```

**หลักการตั้งชื่อไฟล์:** `<module>-flow.spec.ts` — ตั้งตาม module ในระบบ

---

## 6. การตั้งค่า Config

```ts
// e2e/playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',           // โฟลเดอร์ที่เก็บไฟล์ test
  fullyParallel: false,         // รันทีละ test (ไม่ parallel) — ป้องกัน data conflict
  retries: 0,                   // ไม่ retry — ถ้า fail ให้ไปแก้
  workers: 1,                   // ใช้ 1 worker เท่านั้น
  reporter: 'html',             // สร้าง HTML report
  use: {
    baseURL: 'http://localhost:9005',  // URL ของ dev server
    actionTimeout: 10000,              // timeout ต่อ action (10 วินาที)
    trace: 'on-first-retry',          // บันทึก trace เมื่อ retry
    screenshot: 'only-on-failure',     // screenshot เฉพาะตอน fail
  },
  projects: [
    {
      name: 'setup',                       // Project แรก: Login
      testDir: '.',                        // ต้องเป็น '.' เพื่อหา auth/ ได้
      testMatch: /.*\.setup\.ts/,          // จับเฉพาะไฟล์ .setup.ts
    },
    {
      name: 'chromium',                    // Project หลัก: รัน test
      use: {
        browserName: 'chromium',
        storageState: 'e2e/.auth/user.json',  // ใช้ session ที่ login ไว้
      },
      dependencies: ['setup'],            // ต้อง login ก่อนเสมอ
    },
  ],
})
```

**จุดสำคัญ:**
- `workers: 1` — ใช้ worker เดียวเพราะ test บางตัวสร้าง/ลบข้อมูลจริง ถ้ารัน parallel จะชนกัน
- `dependencies: ['setup']` — ทำให้ chromium project รอ setup (login) เสร็จก่อน
- `testDir: '.'` ใน setup project — ถ้าไม่ใส่จะหา `auth/login.setup.ts` ไม่เจอ

---

## 7. ระบบ Authentication

Test ทุกตัว (ยกเว้น login-flow) ต้อง login ก่อน ระบบ auth ทำงานดังนี้:

```
รันครั้งแรก:
  login.setup.ts → เปิด /th/login → กรอก username/password → ได้ session → บันทึก .auth/user.json

รันครั้งถัดไป (ภายใน 1 ชม.):
  login.setup.ts → เช็คอายุ .auth/user.json → ยังไม่หมดอายุ → ข้าม login → รัน test เลย

หลัง 1 ชม.:
  login.setup.ts → session หมดอายุ → login ใหม่ → บันทึกทับ
```

**ไฟล์ login.setup.ts:**

```ts
import { test as setup } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const AUTH_DIR = path.join(__dirname, '..', '.auth')
const STORAGE_STATE_PATH = path.join(AUTH_DIR, 'user.json')

setup('authenticate', async ({ page }) => {
  // สร้างโฟลเดอร์ .auth ถ้ายังไม่มี
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true })
  }

  // ข้าม login ถ้า session ยังไม่หมดอายุ (< 1 ชม.)
  if (fs.existsSync(STORAGE_STATE_PATH)) {
    const stat = fs.statSync(STORAGE_STATE_PATH)
    const ageMs = Date.now() - stat.mtimeMs
    const oneHour = 60 * 60 * 1000
    if (ageMs < oneHour) {
      return
    }
  }

  // เปิดหน้า login
  await page.goto('http://localhost:9005/th/login')

  // กรอก form — ใช้ regex รองรับทั้ง Thai/English label
  await page.getByLabel(/ชื่อผู้ใช้|Username/i).fill('jame')
  await page.getByLabel(/รหัสผ่าน|Password/i).fill('1815688741aA')

  // กดปุ่ม login
  await page.getByRole('button', { name: /เข้าสู่ระบบ|Sign In/i }).click()

  // รอ redirect ไปหน้า authenticated
  await page.waitForURL('**/th/**', { timeout: 30000 })

  // ยืนยันว่าเข้าหน้า authenticated แล้ว (มี sidebar)
  await page.locator('.ant-layout-sider').first().waitFor({ timeout: 10000 })

  // บันทึก session (cookies + localStorage)
  await page.context().storageState({ path: STORAGE_STATE_PATH })
})
```

**ถ้าต้องการทดสอบหน้า Login โดยเฉพาะ** — ต้อง bypass auth ที่ cache ไว้:

```ts
// login-flow.spec.ts
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Login Flow', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/th/login')
    // ...
  })
})
```

---

## 8. คำสั่งที่ใช้งาน

| คำสั่ง | ใช้ทำอะไร |
|---|---|
| `pnpm test:e2e` | รัน test ทั้งหมด (headless — ไม่เห็น browser) |
| `pnpm test:e2e:headed` | รัน test แบบเห็น browser เปิดจริง ๆ |
| `pnpm test:e2e:codegen` | เปิด Codegen — คลิกหน้าจอแล้ว generate code ให้ |
| `pnpm test:e2e:report` | เปิด HTML report ดูผลการทดสอบ |

**เวลาพัฒนา test ใหม่ ให้ใช้ `--headed` เสมอ** เพื่อดูว่า browser ทำอะไรอยู่

**Codegen เหมาะสำหรับ:**
- เริ่มเขียน test ใหม่ — ให้ Codegen สร้าง selector ให้ก่อน แล้วค่อย refine
- หา selector ที่ถูกต้อง — คลิก element ใน Codegen แล้วดู selector ที่มันเลือก

---

## 9. วิธีเลือก Selector

**ลำดับความสำคัญ:** เลือกจากบนลงล่าง ใช้ตัวบนสุดที่ใช้ได้

### 1. Role-based (ดีที่สุด)

เลือก element ตาม semantic role — ทนทานต่อการเปลี่ยน UI มากที่สุด

```ts
// ปุ่ม
page.getByRole('button', { name: 'เพิ่มห้องใหม่' })
page.getByRole('button', { name: 'ยกเลิก' })

// หัวข้อ
page.getByRole('heading', { name: 'จัดการห้องเก็บของ' })

// หัวคอลัมน์ตาราง
page.getByRole('columnheader', { name: 'เลขห้อง' })

// Tab
page.getByRole('tab', { name: 'ตั้งค่าทั่วไป' })

// Checkbox
page.getByRole('checkbox')
```

### 2. Label-based (ดีสำหรับ form)

เลือก input ด้วย `<label>` — เหมาะกับ Ant Design Form

```ts
// Ant Design Form ใช้ <label> กับทุก field
page.getByLabel('ชั้น')
page.getByLabel('ชื่อ-นามสกุล ในใบสัญญา')

// รองรับหลายภาษาด้วย regex
page.getByLabel(/ชื่อผู้ใช้|Username/i)
```

### 3. Placeholder-based (ดีสำหรับ search)

```ts
page.getByPlaceholder('ค้นหาเลขห้อง')
page.getByPlaceholder('ค้นหาชื่อลูกค้า, เบอร์โทรศัพท์, เลขที่สัญญา')
```

### 4. Text-based (ใช้เมื่อไม่มี role/label)

```ts
page.getByText('ล้างตัวกรอง')
page.getByText('เข้าสู่ระบบ').first()  // .first() กรณีข้อความซ้ำ

// Regex สำหรับ pattern matching
page.getByText(/ลูกค้า|ชื่อ/i)
```

### 5. CSS Selector (ใช้เป็นทางเลือกสุดท้าย)

สำหรับ Ant Design component ที่ไม่มี role/label เช่น Table, Modal, Notification

```ts
// Ant Design components
page.locator('.ant-table')
page.locator('.ant-modal')
page.locator('.ant-dropdown')
page.locator('.ant-notification-notice')
page.locator('.ant-layout-sider')

// :visible สำคัญมากเมื่อใช้กับ table (ดูเพิ่มที่ section 11)
page.locator('.ant-table-tbody tr:visible')

// :visible สำหรับ dropdown ที่ mount นอก modal
page.locator('.ant-select-dropdown:visible .ant-select-item')
```

### ข้อควรระวัง

| ทำ | ไม่ทำ |
|---|---|
| `getByRole('button', { name: 'บันทึก' })` | `locator('.btn-primary')` |
| `getByLabel('ชั้น')` | `locator('#floor-input')` |
| `getByPlaceholder('ค้นหา...')` | `locator('input.search-box')` |
| `locator('.ant-modal')` (Ant Design) | `locator('div[class*="modal"]')` |
| `getByRole('button', { name: 'ถัดไป', exact: true })` | `getByText('ถัดไป')` ถ้ามีหลายที่ |

---

## 10. โครงสร้างไฟล์ Test

ทุกไฟล์ test ใช้โครงสร้างเดียวกัน:

```ts
import { test, expect } from '@playwright/test'

test.describe('ชื่อ Module', () => {
  // Test 1: แสดงหน้ารายการ
  test('should display list with table data', async ({ page }) => {
    await test.step('Navigate to page', async () => {
      await page.goto('/th/xxx')
      await page.locator('.ant-table').waitFor({ timeout: 15000 })
      await expect(page.getByRole('heading', { name: 'ชื่อหน้า' })).toBeVisible()
    })

    await test.step('Verify table columns and data', async () => {
      await expect(page.getByRole('columnheader', { name: 'คอลัมน์ 1' })).toBeVisible()
      await expect(page.getByRole('columnheader', { name: 'คอลัมน์ 2' })).toBeVisible()

      const visibleRows = page.locator('.ant-table-tbody tr:visible')
      await expect(visibleRows.first()).toBeVisible({ timeout: 10000 })
    })
  })

  // Test 2: ใช้ filter
  test('should use filters', async ({ page }) => { /* ... */ })

  // Test 3: เปิด modal เพิ่มข้อมูล
  test('should open add modal', async ({ page }) => { /* ... */ })

  // Test 4: CRUD เต็ม flow
  test('should create, edit, and delete', async ({ page }) => { /* ... */ })
})
```

**หลักการ:**
- ใช้ `test.describe()` จัดกลุ่ม test ตาม module
- ใช้ `test.step()` แบ่ง test เป็นขั้นตอน — ทำให้ debug ง่ายเมื่อ fail
- เริ่มจาก test ง่าย ๆ (แสดงรายการ) → ซับซ้อนขึ้น (CRUD)
- แต่ละ test ต้อง **independent** — ไม่พึ่ง test อื่น

---

## 11. Pattern สำหรับ CRUD

### Create (สร้างข้อมูล)

```ts
test('should create, edit, and delete a room', async ({ page }) => {
  // ใช้ timestamp เป็น unique identifier — ป้องกันชื่อซ้ำ
  const roomNumber = `E2E-${Date.now()}`

  await test.step('Create a new room', async () => {
    // 1. เปิด modal
    await page.getByRole('button', { name: 'เพิ่มห้องใหม่' }).click()
    await page.locator('.ant-modal').waitFor({ timeout: 5000 })

    // 2. กรอก form
    await page.locator('.ant-modal').getByPlaceholder('เช่น A001').fill(roomNumber)

    // 3. เลือก dropdown (Ant Design Select)
    await page.locator('.ant-modal').getByLabel('ชั้น').click()
    await page.locator('.ant-select-dropdown:visible .ant-select-item').first().click()

    // 4. กดบันทึก
    await page.locator('.ant-modal').getByRole('button', { name: 'เพิ่มห้อง' }).click()

    // 5. ตรวจ notification สำเร็จ
    await expect(page.locator('.ant-notification-notice').first()).toBeVisible({ timeout: 15000 })
  })
```

### Read (ดูข้อมูล)

```ts
  await test.step('View booking detail', async () => {
    // 1. หาแถวในตาราง
    const visibleRow = page.locator('.ant-table-tbody tr:visible').first()
    await visibleRow.waitFor({ timeout: 15000 })

    // 2. คลิก action dropdown (คอลัมน์สุดท้าย)
    const actionCell = visibleRow.locator('td').last()
    await actionCell.locator('button, svg, .ant-dropdown-trigger').first().click()

    // 3. เลือกเมนูจาก dropdown
    await page.getByText('ข้อมูลการจอง').click()

    // 4. ตรวจ modal/หน้ารายละเอียด
    const modal = page.locator('.ant-modal')
    if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(modal.getByText(/ลูกค้า|ชื่อ/i)).toBeVisible()
    }
  })
```

### Update (แก้ไขข้อมูล)

```ts
  await test.step('Edit the created room', async () => {
    // 1. ค้นหาข้อมูลที่สร้างไว้
    await page.getByPlaceholder('ค้นหาเลขห้อง').fill(roomNumber)
    await page.waitForTimeout(1000) // debounce delay

    // 2. คลิก action → แก้ไข
    const row = page.locator('.ant-table-tbody tr:visible').first()
    await row.locator('td').last().locator('button, svg').first().click()
    await page.getByText('แก้ไข').click()

    // 3. ตรวจว่า modal มีข้อมูลเดิมอยู่
    await page.locator('.ant-modal').waitFor({ timeout: 5000 })
    await expect(page.locator('.ant-modal').getByPlaceholder('เช่น A001')).toHaveValue(roomNumber)

    // 4. กดบันทึก
    await page.locator('.ant-modal').getByRole('button', { name: 'บันทึก' }).click()
    await expect(page.locator('.ant-notification-notice').first()).toBeVisible({ timeout: 15000 })
  })
```

### Delete (ลบข้อมูล)

```ts
  await test.step('Delete the created room', async () => {
    // 1. ค้นหาข้อมูล
    const searchInput = page.getByPlaceholder('ค้นหาเลขห้อง')
    await searchInput.clear()
    await searchInput.fill(roomNumber)
    await page.waitForTimeout(1000)

    // 2. คลิก action → ลบ
    const row = page.locator('.ant-table-tbody tr:visible').first()
    await row.locator('td').last().locator('button, svg').first().click()
    await page.getByText('ลบ').click()

    // 3. ยืนยัน dialog
    await expect(page.getByText('ต้องการลบห้องเก็บของ')).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: 'ยืนยัน' }).click()

    // 4. ตรวจ notification
    await expect(page.locator('.ant-notification-notice').first()).toBeVisible({ timeout: 15000 })
  })
})
```

**หลักการ CRUD test:**
- ใช้ `Date.now()` สร้างชื่อไม่ซ้ำ — ป้องกัน test ชนกัน
- **Create → Edit → Delete** อยู่ใน test เดียวกัน — ลบข้อมูลที่สร้างทิ้ง (cleanup)
- ตรวจ notification หลังทุก action — ใช้ `.first()` เพราะ notification อาจซ้อนกัน

---

## 12. Pattern สำหรับ Filter

```ts
test('should use filters to search rooms', async ({ page }) => {
  await test.step('Navigate to page', async () => {
    await page.goto('/th/room')
    await page.locator('.ant-table').waitFor({ timeout: 15000 })
  })

  await test.step('Search by keyword', async () => {
    const searchInput = page.getByPlaceholder('ค้นหาเลขห้อง')
    await expect(searchInput).toBeVisible()

    // กรอกคำค้นหา — FilterForm ใช้ debounced search
    await searchInput.fill('A')
    await page.waitForTimeout(1000) // ⚠️ รอ debounce (จำเป็น)

    // ตรวจว่าตารางยังแสดงอยู่ (อาจไม่มีข้อมูลก็ได้)
    await expect(page.locator('.ant-table')).toBeVisible()
  })

  await test.step('Clear filters', async () => {
    const clearButton = page.getByText('ล้างตัวกรอง')
    if (await clearButton.isVisible()) {
      await clearButton.click()
      await page.waitForTimeout(500)
    }

    // ตรวจว่า input ถูก clear แล้ว
    await expect(page.getByPlaceholder('ค้นหาเลขห้อง')).toHaveValue('')
  })
})
```

**จุดสำคัญ:**
- `waitForTimeout(1000)` หลัง `fill()` — **จำเป็น** เพราะ FilterForm ใช้ debounced search
- เช็ค `clearButton.isVisible()` ก่อนคลิก — ปุ่มล้างจะซ่อนถ้ายังไม่เคย filter

---

## 13. Pattern สำหรับ Modal / Form

### เปิด Modal

```ts
// คลิกปุ่มเปิด
await page.getByRole('button', { name: 'เพิ่มห้องใหม่' }).click()

// รอ modal แสดง
await page.locator('.ant-modal').waitFor({ timeout: 5000 })

// ตรวจ title
await expect(page.locator('.ant-modal').getByText('เพิ่มห้องเก็บของใหม่')).toBeVisible()
```

### กรอก Form Fields

```ts
const modal = page.locator('.ant-modal')

// Text input
await modal.getByPlaceholder('เช่น A001').fill('A101')

// Input ที่มีค่าเดิม — clear ก่อน fill
await modal.getByPlaceholder('กรอกชื่อ-นามสกุล').clear()
await modal.getByPlaceholder('กรอกชื่อ-นามสกุล').fill('New Name')

// Ant Design Select
await modal.getByLabel('ชั้น').click()
await page.locator('.ant-select-dropdown:visible .ant-select-item').first().click()

// DatePicker (ปฏิทินพุทธศักราช)
const datePicker = modal.locator('.ant-picker').first()
const dateInput = datePicker.locator('input')
await dateInput.click()
const today = new Date()
const day = String(today.getDate()).padStart(2, '0')
const month = String(today.getMonth() + 1).padStart(2, '0')
const year = today.getFullYear() + 543  // พ.ศ. = ค.ศ. + 543
await dateInput.fill(`${day}/${month}/${year}`)
await page.keyboard.press('Enter')
```

### ปิด Modal

```ts
// ปุ่มยกเลิก
await modal.getByRole('button', { name: 'ยกเลิก' }).click()

// ปุ่ม X
await modal.locator('.ant-modal-close').click()

// ตรวจว่าปิดแล้ว
await expect(page.locator('.ant-modal')).toBeHidden({ timeout: 3000 })
```

### Scroll ใน Modal

```ts
// Scroll ขึ้นบนสุด
await page.locator('.ant-modal .ant-modal-body').evaluate((el) => el.scrollTo(0, 0))

// Scroll ลงล่างสุด
await page.locator('.ant-modal .ant-modal-body').evaluate((el) => el.scrollTo(0, el.scrollHeight))

// Scroll ให้ element มองเห็น
await element.scrollIntoViewIfNeeded()
```

---

## 14. Pattern สำหรับ Table

### ResponsiveTable กับ `:visible`

โปรเจกต์นี้ใช้ `ResponsiveTable` ที่ render ทั้ง desktop และ mobile table พร้อมกัน ทำให้ DOM มี element ซ้ำ **ต้องใช้ `:visible` เสมอ** เมื่อหา row:

```ts
// ✅ ถูก — ได้เฉพาะ row ที่แสดงบนหน้าจอ
const rows = page.locator('.ant-table-tbody tr:visible')

// ❌ ผิด — จะได้ row ซ้ำจาก desktop + mobile table
const rows = page.locator('.ant-table-tbody tr')
```

### รอ Table โหลด

```ts
// รอ table element แสดง
await page.locator('.ant-table').waitFor({ timeout: 15000 })

// รอจนมี row อย่างน้อย 1 แถว
const visibleRows = page.locator('.ant-table-tbody tr:visible')
await visibleRows.first().waitFor({ timeout: 15000 })
```

### ตรวจ Column Header

```ts
// ใช้ columnheader role — ไม่จับซ้ำจาก responsive table
await expect(page.getByRole('columnheader', { name: 'เลขห้อง' })).toBeVisible()
await expect(page.getByRole('columnheader', { name: 'ชั้น' })).toBeVisible()
```

### คลิก Action ในแถว

```ts
// หาแถวแรกที่มองเห็น
const row = page.locator('.ant-table-tbody tr:visible').first()

// คลิกปุ่ม action ที่คอลัมน์สุดท้าย
await row.locator('td').last().locator('button, svg').first().click()

// รอ dropdown แสดง แล้วเลือกเมนู
await page.locator('.ant-dropdown').waitFor({ timeout: 5000 })
await page.getByText('แก้ไข').click()
```

### หาแถวจากข้อความ

```ts
// หาแถวที่มีข้อความตรงกัน
const row = page.locator('.ant-table-tbody tr').filter({ hasText: 'E2E-1234' })
```

### จัดการกรณีตารางว่าง

```ts
const visibleRows = page.locator('.ant-table-tbody tr:visible')
const emptyIndicator = page.getByText('ไม่มีข้อมูล')

await Promise.race([
  visibleRows.first().waitFor({ timeout: 10000 }).catch(() => {}),
  emptyIndicator.waitFor({ timeout: 10000 }).catch(() => {}),
])

if (await emptyIndicator.isVisible().catch(() => false)) {
  test.skip(true, 'No data available — skipping test')
}
```

---

## 15. การจัดการ Wait / Timeout

### เมื่อไหร่ต้อง wait

| สถานการณ์ | วิธี wait | timeout |
|---|---|---|
| เปิดหน้าใหม่ (มีตาราง) | `.ant-table` waitFor | 15 วินาที |
| เปิด modal | `.ant-modal` waitFor | 5 วินาที |
| กรอก search (debounce) | `waitForTimeout(1000)` | 1 วินาที |
| สลับ tab | `waitForTimeout(500)` | 0.5 วินาที |
| Ant Design animation | `waitForTimeout(300)` | 0.3 วินาที |
| Login redirect | `waitForURL()` | 30 วินาที |
| Notification แสดง | `.ant-notification-notice` | 15 วินาที |
| Loading spinner หายไป | `waitFor({ state: 'hidden' })` | 15 วินาที |

### ไม่ควรใช้

```ts
// ❌ ไม่ดี — networkidle จะ hang ถ้ามี polling/analytics
await page.waitForLoadState('networkidle')

// ✅ ดี — รอ element ที่ต้องการเห็นจริง ๆ
await page.locator('.ant-table').waitFor({ timeout: 15000 })
```

---

## 16. การจัดการ Edge Cases

### Notification ซ้อนกัน

```ts
// ใช้ .first() เสมอ เพราะ notification อาจมีหลายตัวซ้อนกัน
await expect(page.locator('.ant-notification-notice').first()).toBeVisible({ timeout: 15000 })
```

### Element อาจมีหรือไม่มี

```ts
// เช็คก่อนว่ามองเห็นไหม ถ้ามีค่อยคลิก
if (await clearButton.isVisible()) {
  await clearButton.click()
}

// หรือใช้ .catch() กรณีรอแล้วไม่เจอ
const isVisible = await modal.isVisible({ timeout: 3000 }).catch(() => false)
```

### ข้อความซ้ำในหน้า

```ts
// ใช้ .first() เลือกตัวแรก
page.getByText('เข้าสู่ระบบ').first()

// หรือใช้ exact: true จับเฉพาะตรงเป๊ะ
page.getByRole('button', { name: 'ถัดไป', exact: true })

// หรือ scope ภายใน container
page.locator('.ant-modal').getByText('เพิ่มห้องเก็บของใหม่')
```

### Multi-step Form

```ts
// ปิด dropdown/picker ก่อนกดปุ่มถัดไป
await page.locator('.ant-modal .ant-modal-body').click({ position: { x: 10, y: 10 } })
await page.waitForTimeout(300)

// กดถัดไป
await page.getByRole('button', { name: 'ถัดไป', exact: true }).click()
```

---

---

# Part 3: Reference

---

## 17. Checklist ก่อนเขียน Test ใหม่

- [ ] เปิดหน้าที่จะ test ด้วย `pnpm test:e2e:codegen` ลองคลิกดู selector ก่อน
- [ ] ใช้ `test.describe()` จัดกลุ่มตาม module
- [ ] ใช้ `test.step()` แบ่งขั้นตอนชัดเจน
- [ ] ใช้ selector ตามลำดับ: role → label → placeholder → text → CSS
- [ ] scope selector ด้วย `.ant-modal` เมื่อทำงานใน modal
- [ ] ใช้ `:visible` กับ table row เสมอ
- [ ] ใช้ `.first()` กับ notification
- [ ] รอ debounce หลัง filter input (`waitForTimeout(1000)`)
- [ ] CRUD test สร้างชื่อไม่ซ้ำด้วย `Date.now()` และลบข้อมูลทิ้งตอนท้าย
- [ ] รัน `pnpm test:e2e:headed` ดูว่าผ่านหมด

---

## 18. ปัญหาที่พบบ่อยและวิธีแก้

| ปัญหา | สาเหตุ | วิธีแก้ |
|---|---|---|
| Test fail แบบ random (flaky) | selector จับ element ซ้ำจาก responsive table | ใช้ `:visible` filter กับ table row |
| `waitForLoadState('networkidle')` ค้าง | หน้ามี polling หรือ analytics ทำให้ network ไม่ idle | รอ element ที่ต้องการแทน |
| `waitForURL` ผ่านเร็วเกินไป | URL pattern ตรงกับหน้า login ด้วย | ใช้ regex ที่ exclude login: `/\/th\/(?!login)/` |
| Setup project หา auth file ไม่เจอ | `testDir: './tests'` ไม่ครอบ `auth/` | ใส่ `testDir: '.'` ใน setup project |
| Select dropdown คลิกไม่ได้ | dropdown อยู่นอก modal ใน DOM | ใช้ `.ant-select-dropdown:visible` |
| Notification หายก่อน assert | notification มี duration 3 วินาที | ใช้ `.first()` + timeout ยาวพอ |
| DatePicker ใส่วันผิด | ใช้ ค.ศ. แทน พ.ศ. | ปี = `getFullYear() + 543` |
| Modal scroll ไม่ได้ | ใช้ native scroll API ผิด target | ใช้ `.ant-modal .ant-modal-body` + `.evaluate()` |
| ปุ่มถูกซ่อนอยู่ด้านล่าง | modal content ยาวเกินหน้าจอ | `scrollIntoViewIfNeeded()` ก่อนคลิก |
| Port 9323 ค้าง (EADDRINUSE) | `playwright show-report` เปิดค้างอยู่ | ปิด process เดิม หรือใช้ port อื่น |

---

## ตัวอย่างไฟล์ Test ที่สมบูรณ์

ไฟล์ `e2e/tests/room-flow.spec.ts` เป็นตัวอย่างที่ครบที่สุด ครอบคลุม:
- แสดงรายการ + ตรวจ column
- ใช้ filter + ล้าง filter
- เปิด modal + ตรวจ form fields + ปิด
- CRUD เต็ม flow (Create → Edit → Delete)

**แนะนำให้อ่านไฟล์นี้เป็นอันดับแรก** แล้วใช้เป็น template สำหรับเขียน test module อื่น
