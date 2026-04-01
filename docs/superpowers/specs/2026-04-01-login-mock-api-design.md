# Login Page with MSW Mock API

## Overview

Add MSW (Mock Service Worker) to mock auth API endpoints during development, allowing the login flow to work end-to-end without a real backend.

## Architecture

```
Browser → fetch('/api/auth/login') → Next.js API Route
                                        ↓
                              fetch(API_ENDPOINT/v1/auth/login)
                                        ↓
                              MSW intercepts (dev only) ← mock handlers
                                        ↓
                              return mock response
```

MSW intercepts at the **server-side** (Node.js) using `msw/node` (setupServer), because Next.js API routes run on the server.

## Mock Endpoints

### POST `/v1/auth/login`

- Accepts `{ username, password }`
- Mock credentials: `admin` / `password` → returns token + user data
- Wrong credentials → 401 Unauthorized

### GET `/v1/auth/me`

- Checks Bearer token in Authorization header
- Valid token → returns mock user data
- Missing/invalid token → 401 Unauthorized

## Files

| File | Action | Description |
|---|---|---|
| `src/mocks/data.ts` | Create | Mock user data and credentials |
| `src/mocks/handlers.ts` | Create | MSW request handlers for auth endpoints |
| `src/mocks/server.ts` | Create | MSW server setup (Node.js) |
| `src/mocks/index.ts` | Create | Conditional initialization — dev only |
| `src/instrumentation.ts` | Create | Next.js instrumentation hook to start MSW server |
| `.env.development` | Create | `NEXT_PUBLIC_MOCK_API=true` |
| `.env.example` | Update | Add `NEXT_PUBLIC_MOCK_API` documentation |

## Enabling/Disabling Mock

- Environment variable: `NEXT_PUBLIC_MOCK_API=true`
- MSW starts only when flag is `true` AND `NODE_ENV !== 'production'`
- Production builds have zero mock code running

## Mock Data

```typescript
// src/mocks/data.ts
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

export const MOCK_TOKEN = 'mock-access-token-xyz'
```

## Auth Flow (Mock)

1. User submits login form → `auth-context.tsx` calls `fetch('/api/auth/login')`
2. API route `/api/auth/login/route.ts` forwards to `API_ENDPOINT/v1/auth/login`
3. MSW intercepts the request, validates credentials against `MOCK_USERS`
4. On success: returns `{ token, user }` — API route sets httpOnly cookie
5. On failure: returns 401 — login page shows error message
6. `refreshUser()` calls `/api/auth/me` → MSW validates token → returns user

## MSW Server Integration

### Next.js Instrumentation

```typescript
// src/instrumentation.ts
export async function register() {
  if (process.env.NEXT_PUBLIC_MOCK_API === 'true' && process.env.NODE_ENV !== 'production') {
    const { initMocks } = await import('./mocks')
    await initMocks()
  }
}
```

Next.js calls `register()` once when the server starts — this is the official hook for server-side initialization.

### Vitest Integration

The same MSW server can be reused in tests:

```typescript
// vitest.setup.ts
import { server } from '@/mocks/server'
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Scope

- Login page UI: **no changes** (already implemented)
- Auth context: **no changes**
- API routes: **no changes**
- Middleware: **no changes**
- Only adding mock infrastructure that runs in development
