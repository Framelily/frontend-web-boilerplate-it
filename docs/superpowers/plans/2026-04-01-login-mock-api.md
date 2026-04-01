# Login Mock API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add MSW mock API so the login flow works end-to-end without a real backend.

**Architecture:** MSW server intercepts outgoing `fetch` calls from Next.js API routes (server-side). Enabled via `NEXT_PUBLIC_MOCK_API=true` env var + Next.js instrumentation hook. Mock data provides one test user (`admin`/`password`).

**Tech Stack:** MSW 2.x, Next.js 16 instrumentation API, Vitest

---

## File Structure

| File | Responsibility |
|---|---|
| `src/mocks/data.ts` | Mock user data and token constant |
| `src/mocks/handlers.ts` | MSW request handlers for `/v1/auth/login` and `/v1/auth/me` |
| `src/mocks/server.ts` | MSW `setupServer()` instance |
| `src/mocks/index.ts` | Conditional init function — starts MSW only when mock flag is on |
| `src/instrumentation.ts` | Next.js instrumentation hook — calls mock init on server start |
| `.env.development` | Sets `NEXT_PUBLIC_MOCK_API=true` and dummy `API_ENDPOINT` |
| `src/mocks/__tests__/handlers.test.ts` | Tests for mock handlers |

---

### Task 1: Install MSW

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install MSW as a dev dependency**

```bash
pnpm add -D msw
```

- [ ] **Step 2: Verify installation**

```bash
pnpm list msw
```

Expected: `msw 2.x.x` listed under devDependencies

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add msw for API mocking"
```

---

### Task 2: Create mock data

**Files:**
- Create: `src/mocks/data.ts`

- [ ] **Step 1: Write the failing test**

Create `src/mocks/__tests__/data.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

import { MOCK_TOKEN, MOCK_USERS } from '../data'

describe('mock data', () => {
  it('has at least one user', () => {
    expect(MOCK_USERS.length).toBeGreaterThan(0)
  })

  it('each user has required IUser fields', () => {
    for (const user of MOCK_USERS) {
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('password')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('role')
      expect(user).toHaveProperty('createdAt')
      expect(user).toHaveProperty('updatedAt')
    }
  })

  it('has a non-empty mock token', () => {
    expect(MOCK_TOKEN).toBeTruthy()
    expect(typeof MOCK_TOKEN).toBe('string')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm vitest run src/mocks/__tests__/data.test.ts
```

Expected: FAIL — cannot find module `../data`

- [ ] **Step 3: Write the implementation**

Create `src/mocks/data.ts`:

```typescript
export const MOCK_TOKEN = 'mock-access-token-xyz'

export const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'password',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
]
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm vitest run src/mocks/__tests__/data.test.ts
```

Expected: all 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/mocks/data.ts src/mocks/__tests__/data.test.ts
git commit -m "feat: add mock user data for MSW"
```

---

### Task 3: Create MSW handlers

**Files:**
- Create: `src/mocks/handlers.ts`
- Test: `src/mocks/__tests__/handlers.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/mocks/__tests__/handlers.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'

import { handlers } from '../handlers'
import { MOCK_TOKEN, MOCK_USERS } from '../data'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('POST /v1/auth/login', () => {
  const url = 'http://localhost/v1/auth/login'

  it('returns token and user on valid credentials', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'password' }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.token).toBe(MOCK_TOKEN)
    expect(data.user.username).toBe('admin')
    expect(data.user).not.toHaveProperty('password')
  })

  it('returns 401 on invalid credentials', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrong' }),
    })

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.message).toBeTruthy()
  })
})

describe('GET /v1/auth/me', () => {
  const url = 'http://localhost/v1/auth/me'

  it('returns user when valid token is provided', async () => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${MOCK_TOKEN}` },
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.username).toBe(MOCK_USERS[0].username)
    expect(data).not.toHaveProperty('password')
  })

  it('returns 401 when no token is provided', async () => {
    const res = await fetch(url)

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.message).toBeTruthy()
  })

  it('returns 401 when invalid token is provided', async () => {
    const res = await fetch(url, {
      headers: { Authorization: 'Bearer invalid-token' },
    })

    expect(res.status).toBe(401)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm vitest run src/mocks/__tests__/handlers.test.ts
```

Expected: FAIL — cannot find module `../handlers`

- [ ] **Step 3: Write the implementation**

Create `src/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw'

import { MOCK_TOKEN, MOCK_USERS } from './data'

export const handlers = [
  http.post('*/v1/auth/login', async ({ request }) => {
    const { username, password } = (await request.json()) as { username: string; password: string }

    const user = MOCK_USERS.find((u) => u.username === username && u.password === password)

    if (!user) {
      return HttpResponse.json({ message: 'Invalid username or password' }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user

    return HttpResponse.json({
      token: MOCK_TOKEN,
      user: userWithoutPassword,
    })
  }),

  http.get('*/v1/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || authHeader !== `Bearer ${MOCK_TOKEN}`) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = MOCK_USERS[0]

    return HttpResponse.json(userWithoutPassword)
  }),
]
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm vitest run src/mocks/__tests__/handlers.test.ts
```

Expected: all 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/mocks/handlers.ts src/mocks/__tests__/handlers.test.ts
git commit -m "feat: add MSW handlers for auth endpoints"
```

---

### Task 4: Create MSW server and init

**Files:**
- Create: `src/mocks/server.ts`
- Create: `src/mocks/index.ts`

- [ ] **Step 1: Create MSW server**

Create `src/mocks/server.ts`:

```typescript
import { setupServer } from 'msw/node'

import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

- [ ] **Step 2: Create conditional init**

Create `src/mocks/index.ts`:

```typescript
export async function initMocks() {
  if (typeof window === 'undefined') {
    const { server } = await import('./server')
    server.listen({ onUnhandledRequest: 'bypass' })
    console.info('[MSW] Mock server started')
  }
}
```

- [ ] **Step 3: Verify modules compile**

```bash
pnpm vitest run src/mocks/__tests__/handlers.test.ts
```

Expected: all tests still PASS (server.ts is used by the test via setupServer)

- [ ] **Step 4: Commit**

```bash
git add src/mocks/server.ts src/mocks/index.ts
git commit -m "feat: add MSW server setup and conditional init"
```

---

### Task 5: Wire up Next.js instrumentation and env

**Files:**
- Create: `src/instrumentation.ts`
- Create: `.env.development`
- Modify: `.env.example`

- [ ] **Step 1: Create instrumentation hook**

Create `src/instrumentation.ts`:

```typescript
export async function register() {
  if (process.env.NEXT_PUBLIC_MOCK_API === 'true' && process.env.NODE_ENV !== 'production') {
    const { initMocks } = await import('./mocks')
    await initMocks()
  }
}
```

- [ ] **Step 2: Create .env.development**

Create `.env.development`:

```
# Mock API — set to 'true' to use MSW mock server (no backend needed)
NEXT_PUBLIC_MOCK_API=true

# Dummy backend URL (MSW intercepts these requests)
API_ENDPOINT=http://localhost:3001/api
```

- [ ] **Step 3: Update .env.example**

Add to the end of `.env.example`:

```
# Mock API (development only — MSW intercepts backend requests)
# NEXT_PUBLIC_MOCK_API=true
```

- [ ] **Step 4: Verify dev server starts with MSW**

```bash
pnpm dev
```

Expected: console output includes `[MSW] Mock server started`

Open browser → navigate to `/login` → login with `admin` / `password` → should redirect to home page.

- [ ] **Step 5: Commit**

```bash
git add src/instrumentation.ts .env.development .env.example
git commit -m "feat: wire MSW to Next.js via instrumentation hook"
```

---

### Task 6: Manual smoke test

- [ ] **Step 1: Start dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Test login success**

Navigate to `http://localhost:3000/login`, enter `admin` / `password`, submit. Should redirect to home page and header should show user info.

- [ ] **Step 3: Test login failure**

Navigate to `http://localhost:3000/login`, enter `admin` / `wrongpassword`, submit. Should show error message.

- [ ] **Step 4: Test route protection**

Navigate to `http://localhost:3000/dashboard` without logging in. Should redirect to `/login`.

- [ ] **Step 5: Test logout**

Click logout button. Should clear session and redirect to `/login`.

- [ ] **Step 6: Commit final state (if any fixes needed)**

```bash
git add -A
git commit -m "fix: adjustments from smoke testing"
```

Only commit if changes were needed. Skip if everything worked.
