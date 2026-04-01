# Custom Hooks

## Available Hooks

### useAuth

**File**: `src/contexts/auth-context.tsx`

Authentication state and methods. See [authentication.md](./authentication.md) for details.

```typescript
const { user, isAuthenticated, isLoading, login, logout, refreshUser } = useAuth()
```

### useIsMobile

**File**: `src/hooks/use-is-mobile.ts`

Detects mobile viewport using window resize listener.

```typescript
import { useIsMobile } from '@/hooks/use-is-mobile'

export default function MyComponent() {
  const isMobile = useIsMobile()       // default: < 768px
  const isSmall = useIsMobile(576)     // custom breakpoint

  return (
    <Table
      pagination={{
        size: isMobile ? 'small' : 'default',
      }}
    />
  )
}
```

## Hook Conventions

- **File naming**: `use-[name].ts` (kebab-case with `use-` prefix)
- **Location**: `src/hooks/`
- **Client-only**: Always add `'use client'` at the top
- **Naming**: Export as `useXxx` (camelCase with `use` prefix)

## Adding a New Hook

1. Create file: `src/hooks/use-[name].ts`
2. Add `'use client'` directive
3. Export named function with `use` prefix

Example:

```typescript
'use client'

import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```
