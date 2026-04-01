# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frontend Web Boilerplate — standard project template for CyberRich Digital web applications. Built on **Next.js 16 App Router** with React 19.

## Commands

- `pnpm dev` — Dev server on port 3000
- `pnpm build` — Production build
- `pnpm start` — Production server
- `pnpm lint` — ESLint
- `pnpm lint:fix` — ESLint with auto-fix
- `pnpm test` — Run tests (Vitest)

## Code Style

- **Prettier**: no semicolons, single quotes, trailing commas, 120 char width, 2-space indent
- **Imports**: react/next first → external packages → internal `@/` last, with blank lines between groups
- **Type imports**: prefer `import type { X } from '...'` for type-only imports
- **Path alias**: `@/*` → `./src/*`
- **No console.log**: use `console.info`, `console.warn`, `console.error` instead
- **Commit messages**: English only
- **File naming**: kebab-case for files/folders (e.g., `auth-service.ts`, `use-is-mobile.ts`)
- **Component naming**: PascalCase for component functions (e.g., `LoginForm`, `OrderDetail`)
- **Type naming**: prefix with `I` for interfaces (e.g., `IUser`, `IResponse<T>`)

## Architecture

### Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16+ (App Router) |
| UI | React 19, Ant Design 6, Tailwind CSS 4 |
| State | TanStack React Query v5 |
| HTTP | Axios via API Proxy |
| i18n | next-intl (Thai default, English) |
| Styling | Tailwind CSS 4, Ant Design 6, styled-components 6 |

### Route Groups

Routes are organized into layout groups under `src/app/[locale]/`:

| Group | Paths | Description |
| --- | --- | --- |
| `(public)/` | `/` | Public pages with navbar/footer |
| `(auth)/` | `/login`, `/register` | Auth pages with minimal layout |
| `(main)/` | `/dashboard`, etc. | Authenticated pages with full layout |

### Provider Stack

```text
QueryClientProvider (TanStack Query)
  └─ AuthProvider (authentication context)
       └─ AntdRegistry + StyledComponentsRegistry
            └─ ConfigProvider (Ant Design theme)
                 └─ App
```

### Request Flow

```text
Components → services (src/services/) via Axios
  → Next.js API route /api/proxy/[...path]
    → backend API (API_ENDPOINT) with Bearer token from httpOnly cookie
```

Public endpoints bypass auth.

### Authentication

- `src/contexts/auth-context.tsx` — AuthProvider with login/logout/refreshUser
- `src/proxy.ts` — Route guard: unauthenticated → `/login`
- Token: httpOnly cookie `access-token` (Secure in prod, SameSite=lax)
- User metadata: regular cookie `user` (JSON)

### i18n

- Locales: `th` (default), `en` — configured in `src/i18n/routing.ts`
- Messages: `src/messages/{locale}/common.json`
- Use via `useTranslations('namespace')`

## Styling Rules

**Important — use the correct layer:**

1. **Ant Design** — primary UI components: `Button`, `Input`, `Select`, `Table`, `Modal`, `Form`, `DatePicker`, etc. Don't build custom components if Ant provides them.
2. **styled-components** — custom layout wrappers that Ant can't do. Use semantic PascalCase names (`HeaderWrapper`, `CardContainer`). No `Styled` prefix.
3. **Tailwind CSS** — utility spacing/alignment only (`className="flex gap-4 mb-6 pt-2"`). Don't use for full layouts or to style Ant components.

### File Order in Components

```text
imports
→ helper types/functions (if small)
→ export default function Component()
→ styled-components (at bottom)
```

### Ant Design Theme

- Theme config: `src/lib/antd-provider.tsx` and `src/styles/theme.ts`
- Primary color: `#F7931E` (orange) — change per brand
- Font: Noto Sans Thai Variable
- Use CSS variables: `var(--color-primary)`, `var(--color-text)`, etc.

## API Service Layer

### Pattern

```typescript
// src/services/api-service.ts — base methods
export async function _get(url: string, config?) { return axios.get(url, config) }
export async function _post(url: string, data?, config?) { return axios.post(url, data, config) }

// src/services/[feature]-service.ts — domain service
import { _get, _post } from './api-service'
export const OrderService = {
  getOrders: (params) => _get('/v1/orders', { params }),
  createOrder: (data) => _post('/v1/orders', data),
}
```

### Adding a New API

1. Add types in `src/types/[feature].ts`
2. Add service in `src/services/[feature]-service.ts`
3. Use via React Query in component:

```typescript
const { data } = useQuery({
  queryKey: ['orders', filters],
  queryFn: () => OrderService.getOrders(filters),
})
```

## Adding a New Feature (Checklist)

1. Create page: `src/app/[locale]/(main)/[feature]/page.tsx`
2. Add types: `src/types/[feature].ts`
3. Add service: `src/services/[feature]-service.ts`
4. Add components: `src/components/[feature]/`
5. Add translations: `src/messages/th/common.json` + `src/messages/en/common.json`
6. Add route protection in `src/proxy.ts` (if authenticated)
7. Update navigation menu (if needed)

## Pagination Convention

All list pages with API data **must** use server-side pagination:

```typescript
const PAGE_SIZE = 20
const [currentPage, setCurrentPage] = useState(1)

const { data } = useQuery({
  queryKey: ['items', currentPage, filters],
  queryFn: () => ItemService.getItems({ page: currentPage, limit: PAGE_SIZE, ...filters }),
})

<Table
  pagination={{
    current: currentPage,
    pageSize: PAGE_SIZE,
    total: data?.total ?? 0,
    hideOnSinglePage: true,
    onChange: (page) => setCurrentPage(page),
    showSizeChanger: false,
  }}
/>
```

Reset `setCurrentPage(1)` when filters change.

## Common Mistakes to Avoid

- **Don't** use `useEffect` to fetch data → use React Query
- **Don't** store server data in useState → let React Query manage cache
- **Don't** call `process.env` directly → import from `@/configs`
- **Don't** create custom button/input/modal if Ant Design has it
- **Don't** use Tailwind for full layouts → use styled-components
- **Don't** prefix styled-components with `Styled` → use semantic names
- **Don't** use `.d.ts` for feature types → use `.ts` with explicit exports
- **Don't** commit `.env` with secrets → use `.env.example`
- **Don't** use `any` type → define proper types in `src/types/`
- **Don't** use `console.log` → use `console.info`, `console.warn`, `console.error`

## Environment

- `API_ENDPOINT` — Backend API base URL (server-only, not NEXT_PUBLIC)
- `NEXT_PUBLIC_URL` — Public site URL

Access via `@/configs`:

```typescript
import { API_ENDPOINT, PUBLIC_URL } from '@/configs'
```

## Detailed Documentation

| File | Content |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | Application layers, route groups, provider hierarchy |
| [docs/authentication.md](docs/authentication.md) | Login/logout flow, token management, route protection |
| [docs/api-services.md](docs/api-services.md) | Service layer, API proxy, creating new services |
| [docs/state-management.md](docs/state-management.md) | React Query, Context, Zustand usage |
| [docs/styling.md](docs/styling.md) | 3-layer approach, Ant Design theme, CSS variables |
| [docs/i18n.md](docs/i18n.md) | next-intl setup, translations, language switching |
| [docs/hooks.md](docs/hooks.md) | Custom React hooks and conventions |
