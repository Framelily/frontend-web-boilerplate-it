# Authentication

## Overview

Cookie-based JWT authentication with server-side API proxy. Token is stored in httpOnly cookie — never accessible to client-side JavaScript.

## Login Flow

```
1. User submits credentials (username, password)
        │
2. POST /api/auth/login (Next.js API route)
        │
3. Server calls backend: POST {API_ENDPOINT}/v1/auth/login
        │
4. Backend returns { token, user }
        │
5. Server sets httpOnly cookie "access-token" (7-day, Secure in prod)
        │
6. Client sets regular cookie "user" (JSON, for UI display)
        │
7. AuthContext updates → user redirected to dashboard
```

## Logout Flow

```
1. User clicks logout
        │
2. POST /api/auth/logout (Next.js API route)
        │
3. Server deletes "access-token" cookie
        │
4. Client deletes "user" cookie
        │
5. React Query cache cleared
        │
6. Redirect to /login
```

## Key Files

| File | Role |
| --- | --- |
| `src/contexts/auth-context.tsx` | AuthProvider + useAuth() hook |
| `src/app/api/auth/login/route.ts` | Login endpoint — sets httpOnly cookie |
| `src/app/api/auth/logout/route.ts` | Logout endpoint — deletes cookie |
| `src/app/api/auth/me/route.ts` | Get current user from backend |
| `src/proxy.ts` | Route guard middleware |

## AuthContext API

```typescript
const { user, isAuthenticated, isLoading, login, logout, refreshUser } = useAuth()
```

| Property | Type | Description |
| --- | --- | --- |
| `user` | `IUser \| null` | Current user object |
| `isAuthenticated` | `boolean` | Whether user is logged in |
| `isLoading` | `boolean` | Initial load state |
| `login(username, password)` | `async` | Authenticate and set cookies |
| `logout()` | `async` | Clear auth state and redirect |
| `refreshUser()` | `async` | Re-fetch user data from API |

## Cookie Configuration

| Cookie | httpOnly | Secure | SameSite | Max Age |
| --- | --- | --- | --- | --- |
| `access-token` | Yes | Production only | lax | 7 days |
| `user` | No | No | strict | 7 days |

## Route Protection

Protected routes are defined in `src/proxy.ts`:

```typescript
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/account']
const AUTH_ROUTES = ['/login', '/register', '/forgot']
```

- Unauthenticated + protected route → redirect to `/login`
- Authenticated + auth route → redirect to `/`

## Token Injection

API requests go through `/api/proxy/[...path]` which reads the httpOnly `access-token` cookie server-side and injects it as `Authorization: Bearer {token}` header to the backend.

Client-side JavaScript never sees the token.
