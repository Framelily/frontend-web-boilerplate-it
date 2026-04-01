# Styling

## 3-Layer Approach

| Layer | Use For | Example |
| --- | --- | --- |
| **Ant Design 6** | UI components (buttons, forms, tables, modals) | `<Button type='primary'>`, `<Table>`, `<Form>` |
| **styled-components 6** | Custom layout wrappers, complex CSS | `const HeaderWrapper = styled.header\`...\`` |
| **Tailwind CSS 4** | Spacing/alignment utilities only | `className="flex gap-4 mb-6 pt-2"` |

### Rules

- **Always** check Ant Design first. Don't create a custom button, input, select, modal, or table if Ant has one.
- **Use styled-components** when Ant can't handle the layout (custom wrappers, complex positioning, brand-specific sections).
- **Use Tailwind** only for quick spacing tweaks between components. Never build full layouts with Tailwind.
- **Never** style Ant components with Tailwind classes. Use Ant's props or theme tokens instead.

## Ant Design Theme

Configuration in `src/lib/antd-provider.tsx` and `src/styles/theme.ts`:

```typescript
{
  token: {
    colorPrimary: '#F7931E',      // Orange brand color
    colorError: '#E90A0E',        // Red for errors
    fontFamily: "'Noto Sans Thai Variable', sans-serif",
    borderRadius: 8,
    controlHeight: 40,
    colorBorder: '#E5E7EB',
  }
}
```

To change the brand color, update both:
- `src/lib/antd-provider.tsx` → `colorPrimary`
- `src/styles/globals.css` → `--color-primary`

## CSS Variables

Defined in `src/styles/globals.css` via Tailwind's `@theme`:

```css
--color-primary: #F7931E;
--color-secondary: #4F4F4F;
--color-error: #E90A0E;
--color-text: #1D2027;
--color-background-body: #F7F9FA;
--color-border: #E5E7EB;
```

Use in styled-components: `color: var(--color-primary);`

## styled-components Convention

### Naming

Use semantic PascalCase names based on function:

```typescript
// Good
const HeaderWrapper = styled.header`...`
const CardContainer = styled.div`...`
const PriceLabel = styled.span`...`

// Bad — don't use "Styled" prefix
const StyledHeader = styled.header`...`
const StyledDiv = styled.div`...`
```

### File Order

In every `.tsx` file, component logic comes first, styles at the bottom:

```typescript
// 1. Imports
import { Button } from 'antd'
import styled from 'styled-components'

// 2. Helper types/functions (if small)
interface Props { title: string }

// 3. Component (exported)
export default function FeatureCard({ title }: Props) {
  return (
    <CardWrapper>
      <h2>{title}</h2>
      <Button type='primary'>Action</Button>
    </CardWrapper>
  )
}

// 4. styled-components (at bottom)
const CardWrapper = styled.div`
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid var(--color-border);
`
```

## Tailwind CSS 4

Configured via PostCSS only (no `tailwind.config` file). Theme defined in `src/styles/globals.css` with `@theme` directive.

Use for utility classes:

```tsx
// Good — spacing and alignment
<div className='flex items-center gap-4 mb-6'>
  <Button>A</Button>
  <Button>B</Button>
</div>

// Bad — building full layouts with Tailwind
<div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
  // Use styled-components for this instead
</div>
```

## Font

**Noto Sans Thai Variable** — imported in `src/app/layout.tsx` via `@fontsource-variable/noto-sans-thai`.

Applied globally in `src/styles/globals.css`:

```css
body {
  font-family: var(--font-family-sans);
}
```
