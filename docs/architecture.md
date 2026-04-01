# Architecture

## Application Layers

```
┌─────────────────────────────────────────────┐
│  Pages (src/app/[locale]/)                  │
│  Route Groups: (public), (auth), (main)     │
├─────────────────────────────────────────────┤
│  Components (src/components/)               │
│  layout/, common/, [feature]/               │
├─────────────────────────────────────────────┤
│  Hooks (src/hooks/)                         │
│  Custom React hooks                         │
├─────────────────────────────────────────────┤
│  Services (src/services/)                   │
│  api-service.ts → [feature]-service.ts      │
├─────────────────────────────────────────────┤
│  Axios (src/lib/axios.ts)                   │
│  Base URL: /api/proxy, 30s timeout          │
├─────────────────────────────────────────────┤
│  API Proxy (src/app/api/proxy/[...path]/)   │
│  Injects Bearer token from httpOnly cookie  │
├─────────────────────────────────────────────┤
│  Backend API (API_ENDPOINT)                 │
└─────────────────────────────────────────────┘
```

## Provider Hierarchy

Defined in `src/lib/providers.tsx`, wrapping all pages inside `src/app/[locale]/layout.tsx`:

```
NextIntlClientProvider (i18n messages + locale)
  └─ QueryClientProvider (TanStack React Query)
       └─ AuthProvider (login/logout/user state)
            └─ AntdRegistry (Ant Design SSR)
                 └─ StyledComponentsRegistry (styled-components SSR)
                      └─ ConfigProvider + App (Ant Design theme + locale)
```

### Key Provider Files

| File | Role |
| --- | --- |
| `src/lib/providers.tsx` | Orchestrates all client-side providers |
| `src/lib/query-provider.tsx` | React Query client + DevTools |
| `src/lib/antd-provider.tsx` | Ant Design theme (colors, fonts, component tokens) |
| `src/lib/styled-component-registry.tsx` | SSR support for styled-components |
| `src/contexts/auth-context.tsx` | Auth state + cookie management |

## Route Groups

All pages live under `src/app/[locale]/` for i18n locale routing:

| Group | Layout | Auth Required | Use Case |
| --- | --- | --- | --- |
| `(public)/` | Header + Footer | No | Landing, about, blog, contact |
| `(auth)/` | Centered card | No (redirects if logged in) | Login, register, forgot password |
| `(main)/` | Header + Footer | Yes (redirects to /login) | Dashboard, profile, settings |

## Middleware

`src/proxy.ts` runs on every request (except API/static):

1. Strips locale prefix for route matching
2. Checks `access-token` + `user` cookies
3. Redirects unauthenticated users from protected routes to `/login`
4. Redirects authenticated users away from auth routes to `/`
5. Delegates to next-intl middleware for locale detection
