# Frontend Web Boilerplate IT

Standard project template for CyberRich Digital web applications.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** (with Compiler)
- **Ant Design 6** + **Tailwind CSS 4** + **styled-components 6**
- **TanStack React Query 5** + **Axios** (API Proxy pattern)
- **next-intl** (Thai/English)
- **TypeScript 5.7** (strict mode)
- **Vitest** + **Testing Library**

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # i18n locale routing
│   │   ├── (public)/     # Public pages
│   │   ├── (auth)/       # Login, register
│   │   └── (main)/       # Authenticated pages
│   └── api/              # API routes (proxy, auth, config)
├── components/            # React components
│   ├── common/           # Shared UI components
│   └── layout/           # Header, Footer
├── services/              # API service layer
├── types/                 # TypeScript types (.ts)
├── hooks/                 # Custom React hooks
├── contexts/              # React Context (auth)
├── lib/                   # Library configs & providers
├── styles/                # Global CSS + theme
├── i18n/                  # next-intl config
├── messages/              # Translation files (th, en)
├── configs/               # App constants
├── utils/                 # Utility functions
├── constants/             # Constants
└── proxy.ts               # Middleware (auth guard + i18n)
```

## Key Patterns

- **API Proxy**: All API calls go through `/api/proxy/[...path]` — backend URL hidden from client
- **httpOnly Cookie**: Auth token stored in secure httpOnly cookie, never exposed to JavaScript
- **3-Layer Styling**: Ant Design (components) → styled-components (custom layouts) → Tailwind (utility spacing)
- **Service Layer**: `_get`, `_post`, `_put`, `_patch`, `_delete` wrappers in `api-service.ts`

## Documentation

See [CLAUDE.md](./CLAUDE.md) for AI agent rules and coding conventions.
