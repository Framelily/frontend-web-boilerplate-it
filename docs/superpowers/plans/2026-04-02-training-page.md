# Training Docs Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a training docs page at `/training` with sidebar menu, markdown rendering, and content from `.md` files.

**Architecture:** Next.js server component reads `.md` files at build time, passes content to client component that renders markdown with `react-markdown`. Sidebar uses Ant Design Menu for navigation, client-side state switches displayed content. Separate `(docs)` route group with its own layout (no shared header/footer).

**Tech Stack:** react-markdown, remark-gfm, rehype-highlight, highlight.js, Ant Design Menu, styled-components

---

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/markdown.ts` | Read `.md` files from filesystem |
| `src/components/training/markdown-renderer.tsx` | Render markdown string → styled HTML |
| `src/components/training/training-header.tsx` | Header bar for training page |
| `src/components/training/training-layout.tsx` | Sidebar + content area layout |
| `src/app/[locale]/(docs)/layout.tsx` | Minimal layout for docs route group |
| `src/app/[locale]/(docs)/training/page.tsx` | Server component — reads files, passes to client |
| `docs/training/session-1-basics.md` | Training Session 1 content |
| `docs/training/session-2-claudemd-rules.md` | Training Session 2 content |
| `docs/training/session-3-token-commands.md` | Training Session 3 content |
| `docs/training/session-4-superpowers.md` | Training Session 4 content |
| `docs/training/cheat-sheet.md` | Cheat sheet content |

---

### Task 1: Install packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install markdown rendering packages**

```bash
pnpm add react-markdown remark-gfm rehype-highlight highlight.js
```

- [ ] **Step 2: Verify installation**

```bash
pnpm list react-markdown remark-gfm rehype-highlight highlight.js
```

Expected: all 4 packages listed

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add markdown rendering packages"
```

---

### Task 2: Create markdown utility

**Files:**
- Create: `src/lib/markdown.ts`

- [ ] **Step 1: Create the utility**

Create `src/lib/markdown.ts`:

```typescript
import fs from 'fs'
import path from 'path'

export function readMarkdownFile(filePath: string): string {
  const fullPath = path.join(process.cwd(), filePath)
  try {
    return fs.readFileSync(fullPath, 'utf-8')
  } catch {
    return `# File not found\n\nCould not read: \`${filePath}\``
  }
}

export interface IDocItem {
  key: string
  label: string
  filePath: string
}

export interface IDocGroup {
  label: string
  items: IDocItem[]
}

export const DOC_MENU: IDocGroup[] = [
  {
    label: 'TRAINING',
    items: [
      { key: 'session-1', label: 'Session 1: พื้นฐาน', filePath: 'docs/training/session-1-basics.md' },
      { key: 'session-2', label: 'Session 2: CLAUDE.md & Rules', filePath: 'docs/training/session-2-claudemd-rules.md' },
      { key: 'session-3', label: 'Session 3: Token & Commands', filePath: 'docs/training/session-3-token-commands.md' },
      { key: 'session-4', label: 'Session 4: Superpowers', filePath: 'docs/training/session-4-superpowers.md' },
      { key: 'cheat-sheet', label: 'Cheat Sheet', filePath: 'docs/training/cheat-sheet.md' },
    ],
  },
  {
    label: 'DOCS',
    items: [
      { key: 'guide', label: 'Claude Code Guide', filePath: 'docs/claude-code-guide.md' },
      { key: 'rules', label: 'Team Coding Rules', filePath: '.claude/CLAUDE.md' },
      { key: 'project', label: 'Project Architecture', filePath: 'CLAUDE.md' },
    ],
  },
]

export function loadAllDocs(): Record<string, string> {
  const docs: Record<string, string> = {}
  for (const group of DOC_MENU) {
    for (const item of group.items) {
      docs[item.key] = readMarkdownFile(item.filePath)
    }
  }
  return docs
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/markdown.ts
git commit -m "feat: add markdown file reader utility"
```

---

### Task 3: Create markdown renderer component

**Files:**
- Create: `src/components/training/markdown-renderer.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/training/markdown-renderer.tsx`:

```tsx
'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import styled from 'styled-components'

import 'highlight.js/styles/github.css'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <MarkdownWrapper>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </MarkdownWrapper>
  )
}

const MarkdownWrapper = styled.div`
  max-width: 800px;
  line-height: 1.8;
  color: #1a1a1a;

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 32px 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e7eb;
  }

  h2 {
    font-size: 22px;
    font-weight: 600;
    margin: 28px 0 12px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 24px 0 8px;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 20px 0 8px;
  }

  p {
    margin: 12px 0;
  }

  ul,
  ol {
    margin: 12px 0;
    padding-left: 24px;
  }

  li {
    margin: 4px 0;
  }

  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }

  pre {
    background: #1e1e1e;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;

    code {
      background: none;
      padding: 0;
      color: #d4d4d4;
      font-size: 13px;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 14px;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
    text-align: left;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
  }

  td {
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
  }

  blockquote {
    border-left: 4px solid #f7931e;
    padding: 8px 16px;
    margin: 16px 0;
    background: #fff7ed;
    border-radius: 0 8px 8px 0;
  }

  a {
    color: #f7931e;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 32px 0;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
  }
`
```

- [ ] **Step 2: Commit**

```bash
git add src/components/training/markdown-renderer.tsx
git commit -m "feat: add markdown renderer component"
```

---

### Task 4: Create training header

**Files:**
- Create: `src/components/training/training-header.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/training/training-header.tsx`:

```tsx
'use client'

import { MenuOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import styled from 'styled-components'

interface TrainingHeaderProps {
  onMenuToggle?: () => void
}

export default function TrainingHeader({ onMenuToggle }: TrainingHeaderProps) {
  return (
    <Header>
      <LeftSection>
        {onMenuToggle && (
          <MenuButton className="mobile-menu">
            <Button type="text" icon={<MenuOutlined />} onClick={onMenuToggle} />
          </MenuButton>
        )}
        <Title>Claude Code Training</Title>
      </LeftSection>
      <Brand>CyberRich Digital</Brand>
    </Header>
  )
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const MenuButton = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
`

const Brand = styled.span`
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
`
```

- [ ] **Step 2: Commit**

```bash
git add src/components/training/training-header.tsx
git commit -m "feat: add training page header"
```

---

### Task 5: Create training layout with sidebar

**Files:**
- Create: `src/components/training/training-layout.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/training/training-layout.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Drawer, Menu } from 'antd'
import styled from 'styled-components'

import type { IDocGroup } from '@/lib/markdown'
import TrainingHeader from './training-header'
import MarkdownRenderer from './markdown-renderer'

interface TrainingLayoutProps {
  menu: IDocGroup[]
  docs: Record<string, string>
  defaultKey: string
}

export default function TrainingLayout({ menu, docs, defaultKey }: TrainingLayoutProps) {
  const [activeKey, setActiveKey] = useState(defaultKey)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const menuItems = menu.map((group) => ({
    key: group.label,
    label: <GroupLabel>{group.label}</GroupLabel>,
    type: 'group' as const,
    children: group.items.map((item) => ({
      key: item.key,
      label: item.label,
    })),
  }))

  const handleMenuClick = (key: string) => {
    setActiveKey(key)
    setDrawerOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sidebarContent = (
    <Menu
      mode="inline"
      selectedKeys={[activeKey]}
      items={menuItems}
      onClick={({ key }) => handleMenuClick(key)}
      style={{ border: 'none' }}
    />
  )

  return (
    <PageWrapper>
      <TrainingHeader onMenuToggle={() => setDrawerOpen(true)} />
      <ContentWrapper>
        <Sidebar>{sidebarContent}</Sidebar>
        <Drawer
          title="Menu"
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={280}
          styles={{ body: { padding: 0 } }}
        >
          {sidebarContent}
        </Drawer>
        <MainContent>
          <MarkdownRenderer content={docs[activeKey] || '# Not found'} />
        </MainContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #fff;
`

const ContentWrapper = styled.div`
  display: flex;
`

const Sidebar = styled.aside`
  width: 280px;
  min-width: 280px;
  border-right: 1px solid #e5e7eb;
  height: calc(100vh - 56px);
  position: sticky;
  top: 56px;
  overflow-y: auto;
  padding: 8px 0;

  @media (max-width: 768px) {
    display: none;
  }
`

const GroupLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #9ca3af;
`

const MainContent = styled.main`
  flex: 1;
  padding: 32px 48px;
  max-width: 100%;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`
```

- [ ] **Step 2: Commit**

```bash
git add src/components/training/training-layout.tsx
git commit -m "feat: add training layout with sidebar and mobile drawer"
```

---

### Task 6: Create docs route group and training page

**Files:**
- Create: `src/app/[locale]/(docs)/layout.tsx`
- Create: `src/app/[locale]/(docs)/training/page.tsx`

- [ ] **Step 1: Create docs layout**

Create `src/app/[locale]/(docs)/layout.tsx`:

```tsx
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2: Create training page**

Create `src/app/[locale]/(docs)/training/page.tsx`:

```tsx
import { DOC_MENU, loadAllDocs } from '@/lib/markdown'
import TrainingLayout from '@/components/training/training-layout'

export const metadata = {
  title: 'Claude Code Training — CyberRich Digital',
}

export default function TrainingPage() {
  const docs = loadAllDocs()

  return <TrainingLayout menu={DOC_MENU} docs={docs} defaultKey="session-1" />
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/\(docs\)/layout.tsx src/app/\[locale\]/\(docs\)/training/page.tsx
git commit -m "feat: add training page route and docs layout"
```

---

### Task 7: Create placeholder training markdown files

**Files:**
- Create: `docs/training/session-1-basics.md`
- Create: `docs/training/session-2-claudemd-rules.md`
- Create: `docs/training/session-3-token-commands.md`
- Create: `docs/training/session-4-superpowers.md`
- Create: `docs/training/cheat-sheet.md`

- [ ] **Step 1: Create session-1-basics.md**

Create `docs/training/session-1-basics.md`:

```markdown
# Session 1: พื้นฐาน Claude Code

> เป้าหมาย: ทีมเปิดใช้ Claude Code ได้ สั่งงานเป็น และรู้คำสั่งพื้นฐาน
> ระยะเวลา: 1-1.5 ชั่วโมง

---

(เนื้อหาจะเพิ่มใน Phase 2)
```

- [ ] **Step 2: Create session-2-claudemd-rules.md**

Create `docs/training/session-2-claudemd-rules.md`:

```markdown
# Session 2: CLAUDE.md & Coding Rules

> เป้าหมาย: ทีมเข้าใจระบบ CLAUDE.md 3 ชั้น และกฎการเขียน code ของทีม
> ระยะเวลา: 1-1.5 ชั่วโมง

---

(เนื้อหาจะเพิ่มใน Phase 2)
```

- [ ] **Step 3: Create session-3-token-commands.md**

Create `docs/training/session-3-token-commands.md`:

```markdown
# Session 3: ประหยัด Token & Custom Commands

> เป้าหมาย: ทีมใช้ token อย่างคุ้มค่า และสร้าง/ใช้ custom commands ได้
> ระยะเวลา: 1 ชั่วโมง

---

(เนื้อหาจะเพิ่มใน Phase 2)
```

- [ ] **Step 4: Create session-4-superpowers.md**

Create `docs/training/session-4-superpowers.md`:

```markdown
# Session 4: Superpowers — Workflow แบบมืออาชีพ

> เป้าหมาย: ทีมเข้าใจ Superpowers workflow ทั้ง 9 ขั้นตอน และใช้งานได้จริง
> ระยะเวลา: 1.5-2 ชั่วโมง

---

(เนื้อหาจะเพิ่มใน Phase 2)
```

- [ ] **Step 5: Create cheat-sheet.md**

Create `docs/training/cheat-sheet.md`:

```markdown
# Cheat Sheet

> สรุปคำสั่งและทริคสำคัญ — แจกทุก session

---

(เนื้อหาจะเพิ่มใน Phase 2)
```

- [ ] **Step 6: Commit**

```bash
git add docs/training/
git commit -m "feat: add placeholder training markdown files"
```

---

### Task 8: Verify and smoke test

- [ ] **Step 1: Build**

```bash
pnpm build
```

Expected: build succeeds, no errors

- [ ] **Step 2: Start dev server**

```bash
pnpm dev
```

- [ ] **Step 3: Test training page**

Navigate to `http://localhost:3000/training`:
- Page loads with header "Claude Code Training"
- Sidebar shows TRAINING (5 items) and DOCS (3 items)
- Default shows Session 1 content
- Click sidebar items → content changes
- DOCS section shows raw `.md` content (claude-code-guide.md, .claude/CLAUDE.md, CLAUDE.md)

- [ ] **Step 4: Test mobile**

Resize browser to mobile width:
- Sidebar hidden
- Hamburger menu appears in header
- Click hamburger → drawer opens with menu
- Click menu item → drawer closes, content changes

- [ ] **Step 5: Commit if fixes needed**

```bash
git add -A
git commit -m "fix: adjustments from smoke testing"
```

Only commit if changes were needed.
