# Ask Start Repo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public `/ask-start-repo` page where developers fill in project details and receive a repo recommendation, clone command, setup prompt, and project brief prompt.

**Architecture:** All logic is client-side — no API calls. Pure generation functions live in `src/lib/ask-start-repo/generate-output.ts` for testability. A single client component handles form state and output rendering. The page file is a thin server component wrapper.

**Tech Stack:** Next.js App Router, React 19, Ant Design 6, styled-components 6, Vitest

---

## File Map

| Action | Path | Responsibility |
| ------ | ---- | -------------- |
| Create | `src/types/ask-start-repo.ts` | `IProjectFormData`, `IGeneratedOutput`, `ProjectType` |
| Create | `src/lib/ask-start-repo/generate-output.ts` | Pure functions: repo map, clone block, setup prompt, brief |
| Create | `src/lib/ask-start-repo/generate-output.test.ts` | Unit tests for generation logic |
| Create | `src/components/ask-start-repo/ask-start-repo-form.tsx` | Client component: form + output section |
| Create | `src/app/[locale]/(public)/ask-start-repo/page.tsx` | Server component page wrapper |

---

## Task 1: Types

**Files:**

- Create: `src/types/ask-start-repo.ts`

- [ ] **Step 1: Create the types file**

```typescript
// src/types/ask-start-repo.ts

export type ProjectType = 'web' | 'backoffice' | 'electron'

export interface IProjectFormData {
  name: string
  description: string
  type: ProjectType | null
  hasAuth: boolean
  hasSeo: boolean
  hasMultiLang: boolean
  languages: string
  hasRealtime: boolean
  notes: string
}

export interface IGeneratedOutput {
  repoName: string
  repoUrl: string
  cloneBlock: string
  setupPrompt: string
  projectBrief: string
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/ask-start-repo.ts
git commit -m "feat: add ask-start-repo types"
```

---

## Task 2: Generation Logic (TDD)

**Files:**

- Create: `src/lib/ask-start-repo/generate-output.ts`
- Create: `src/lib/ask-start-repo/generate-output.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/lib/ask-start-repo/generate-output.test.ts
import { describe, it, expect } from 'vitest'

import { generateOutput } from './generate-output'
import type { IProjectFormData } from '@/types/ask-start-repo'

const base: IProjectFormData = {
  name: 'My Project',
  description: 'Test description',
  type: 'web',
  hasAuth: false,
  hasSeo: false,
  hasMultiLang: false,
  languages: '',
  hasRealtime: false,
  notes: '',
}

describe('generateOutput', () => {
  it('returns correct repo for web type', () => {
    const result = generateOutput(base)
    expect(result.repoUrl).toBe('https://github.com/Cyber-Rich-Digital/frontend-web-boilerplate')
    expect(result.repoName).toBe('frontend-web-boilerplate')
  })

  it('returns correct repo for backoffice type', () => {
    const result = generateOutput({ ...base, type: 'backoffice' })
    expect(result.repoUrl).toBe('https://github.com/Cyber-Rich-Digital/frontend-backoffice-boilerplate')
    expect(result.repoName).toBe('frontend-backoffice-boilerplate')
  })

  it('returns correct repo for electron type', () => {
    const result = generateOutput({ ...base, type: 'electron' })
    expect(result.repoUrl).toBe('https://github.com/Cyber-Rich-Digital/frontend-electron-boilerplate')
    expect(result.repoName).toBe('frontend-electron-boilerplate')
  })

  it('converts project name to slug in clone command', () => {
    const result = generateOutput({ ...base, name: 'My Cool Project' })
    expect(result.cloneBlock).toContain('my-cool-project')
  })

  it('includes auth feature in both prompts when hasAuth is true', () => {
    const result = generateOutput({ ...base, hasAuth: true })
    expect(result.setupPrompt).toContain('Authentication')
    expect(result.projectBrief).toContain('Authentication')
  })

  it('omits auth feature when hasAuth is false', () => {
    const result = generateOutput({ ...base, hasAuth: false })
    expect(result.setupPrompt).not.toContain('Authentication')
  })

  it('includes SEO feature when hasSeo is true', () => {
    const result = generateOutput({ ...base, hasSeo: true })
    expect(result.setupPrompt).toContain('SEO')
    expect(result.projectBrief).toContain('SEO')
  })

  it('includes language list when hasMultiLang is true', () => {
    const result = generateOutput({ ...base, hasMultiLang: true, languages: 'th, en' })
    expect(result.setupPrompt).toContain('th, en')
    expect(result.projectBrief).toContain('th, en')
  })

  it('includes realtime feature when hasRealtime is true', () => {
    const result = generateOutput({ ...base, hasRealtime: true })
    expect(result.setupPrompt).toContain('WebSocket')
    expect(result.projectBrief).toContain('WebSocket')
  })

  it('includes notes in both prompts when notes is provided', () => {
    const result = generateOutput({ ...base, notes: 'ใช้ Oracle DB' })
    expect(result.setupPrompt).toContain('ใช้ Oracle DB')
    expect(result.projectBrief).toContain('ใช้ Oracle DB')
  })

  it('omits additional context section when notes is empty', () => {
    const result = generateOutput({ ...base, notes: '' })
    expect(result.setupPrompt).not.toContain('Additional context')
    expect(result.projectBrief).not.toContain('Additional context')
  })

  it('includes project name and description in setup prompt', () => {
    const result = generateOutput({ ...base, name: 'Shop X', description: 'E-commerce site' })
    expect(result.setupPrompt).toContain('Shop X')
    expect(result.setupPrompt).toContain('E-commerce site')
  })

  it('includes stack in project brief', () => {
    const result = generateOutput(base)
    expect(result.projectBrief).toContain('Next.js App Router')
    expect(result.projectBrief).toContain('Ant Design')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pnpm test src/lib/ask-start-repo/generate-output.test.ts
```

Expected: `Error: Cannot find module './generate-output'`

- [ ] **Step 3: Implement generate-output.ts**

```typescript
// src/lib/ask-start-repo/generate-output.ts
import type { IProjectFormData, IGeneratedOutput, ProjectType } from '@/types/ask-start-repo'

const REPO_MAP: Record<ProjectType, { name: string; url: string }> = {
  web: {
    name: 'frontend-web-boilerplate',
    url: 'https://github.com/Cyber-Rich-Digital/frontend-web-boilerplate',
  },
  backoffice: {
    name: 'frontend-backoffice-boilerplate',
    url: 'https://github.com/Cyber-Rich-Digital/frontend-backoffice-boilerplate',
  },
  electron: {
    name: 'frontend-electron-boilerplate',
    url: 'https://github.com/Cyber-Rich-Digital/frontend-electron-boilerplate',
  },
}

const TYPE_LABEL: Record<ProjectType, string> = {
  web: 'Web',
  backoffice: 'Backoffice',
  electron: 'Electron',
}

function toSlug(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}

function buildFeatures(form: IProjectFormData): string[] {
  const lines: string[] = []
  if (form.hasAuth) lines.push('- มี Authentication / Login')
  if (form.hasSeo) lines.push('- มี SEO (meta tags, sitemap, Open Graph)')
  if (form.hasMultiLang) lines.push(`- รองรับหลายภาษา: ${form.languages}`)
  if (form.hasRealtime) lines.push('- มี Real-time (WebSocket)')
  return lines
}

export function generateOutput(form: IProjectFormData): IGeneratedOutput {
  const type = form.type!
  const repo = REPO_MAP[type]
  const slug = toSlug(form.name)
  const typeLabel = TYPE_LABEL[type]
  const features = buildFeatures(form)
  const notesBlock = form.notes.trim() ? `\nAdditional context:\n${form.notes.trim()}` : ''
  const featuresBlock = features.length > 0 ? `\nFeature requirements:\n${features.join('\n')}` : ''

  const cloneBlock = [
    `แนะนำ: ${repo.name}`,
    repo.url,
    '',
    `git clone ${repo.url} ${slug}`,
    `cd ${slug}`,
    'cp .env.example .env',
    'pnpm install',
  ].join('\n')

  const setupPrompt = [
    `คุณคือ senior frontend developer ช่วย setup โปรเจค "${form.name}" จาก boilerplate นี้`,
    '',
    `คำอธิบาย: ${form.description}`,
    `ประเภท: ${typeLabel}`,
    featuresBlock,
    notesBlock,
    '',
    'กรุณา:',
    '1. เปลี่ยนชื่อโปรเจคในไฟล์ที่เกี่ยวข้อง (package.json, README, etc.)',
    '2. ลบ/ปิด feature ที่ไม่ได้ใช้ออกจาก boilerplate',
    '3. Config ค่าเริ่มต้นตาม requirements ที่ให้ไว้',
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const briefFeaturesBlock = features.length > 0 ? `\nFeatures:\n${features.join('\n')}` : ''

  const projectBrief = [
    `Project: ${form.name}`,
    `คำอธิบาย: ${form.description}`,
    `ประเภท: ${typeLabel}`,
    'Stack: Next.js App Router, React 19, Ant Design, Tailwind CSS, TanStack Query',
    briefFeaturesBlock,
    notesBlock,
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return { repoName: repo.name, repoUrl: repo.url, cloneBlock, setupPrompt, projectBrief }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test src/lib/ask-start-repo/generate-output.test.ts
```

Expected: all 13 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/ask-start-repo/generate-output.ts src/lib/ask-start-repo/generate-output.test.ts
git commit -m "feat: add ask-start-repo generation logic with tests"
```

---

## Task 3: Form Component

**Files:**

- Create: `src/components/ask-start-repo/ask-start-repo-form.tsx`

- [ ] **Step 1: Create the form component**

```typescript
// src/components/ask-start-repo/ask-start-repo-form.tsx
'use client'

import { useRef, useState } from 'react'

import { App, Button, Checkbox, Divider, Input, Radio, Typography } from 'antd'
import styled from 'styled-components'

import { generateOutput } from '@/lib/ask-start-repo/generate-output'
import type { IGeneratedOutput, IProjectFormData, ProjectType } from '@/types/ask-start-repo'

const DEFAULT_FORM: IProjectFormData = {
  name: '',
  description: '',
  type: null,
  hasAuth: false,
  hasSeo: false,
  hasMultiLang: false,
  languages: '',
  hasRealtime: false,
  notes: '',
}

export default function AskStartRepoForm() {
  const { message } = App.useApp()
  const [form, setForm] = useState<IProjectFormData>(DEFAULT_FORM)
  const [output, setOutput] = useState<IGeneratedOutput | null>(null)
  const [errors, setErrors] = useState<{ name?: string; type?: string }>({})
  const outputRef = useRef<HTMLDivElement>(null)

  function validate(): boolean {
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = 'กรุณากรอกชื่อโปรเจค'
    if (!form.type) next.type = 'กรุณาเลือกประเภทโปรเจค'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const result = generateOutput(form)
    setOutput(result)
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  async function handleCopy(text: string, label: string) {
    await navigator.clipboard.writeText(text)
    message.success(`คัดลอก ${label} แล้ว`)
  }

  return (
    <PageContainer>
      <Typography.Title level={2}>เริ่มต้นโปรเจคใหม่</Typography.Title>
      <Typography.Text type='secondary'>
        ตอบคำถามด้านล่าง แล้วรับ repo recommendation และ AI prompt สำหรับ setup โปรเจค
      </Typography.Text>

      <FormCard>
        {/* Group 1 — Project Info */}
        <Divider orientation='left'>ข้อมูลโปรเจค</Divider>

        <FieldGroup>
          <label>
            <FieldLabel>ชื่อโปรเจค *</FieldLabel>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder='เช่น Smart Retail Dashboard'
              status={errors.name ? 'error' : ''}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </label>
        </FieldGroup>

        <FieldGroup>
          <label>
            <FieldLabel>คำอธิบายโปรเจค *</FieldLabel>
            <Input.TextArea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder='อธิบายสั้นๆ ว่าโปรเจคนี้ทำอะไร'
              rows={3}
            />
          </label>
        </FieldGroup>

        {/* Group 2 — Project Type */}
        <Divider orientation='left'>ประเภทโปรเจค *</Divider>

        <FieldGroup>
          <Radio.Group
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ProjectType }))}
          >
            <RadioOption value='web'>
              <span>🌐 Web</span>
              <RadioDesc>public-facing website</RadioDesc>
            </RadioOption>
            <RadioOption value='backoffice'>
              <span>🖥️ Backoffice</span>
              <RadioDesc>admin dashboard</RadioDesc>
            </RadioOption>
            <RadioOption value='electron'>
              <span>💻 Electron</span>
              <RadioDesc>desktop app</RadioDesc>
            </RadioOption>
          </Radio.Group>
          {errors.type && <ErrorText>{errors.type}</ErrorText>}
        </FieldGroup>

        {/* Group 3 — Core Features */}
        <Divider orientation='left'>Features ที่ต้องการ</Divider>

        <FieldGroup>
          <CheckRow>
            <Checkbox
              checked={form.hasAuth}
              onChange={(e) => setForm((f) => ({ ...f, hasAuth: e.target.checked }))}
            >
              Authentication / Login
            </Checkbox>
          </CheckRow>
          <CheckRow>
            <Checkbox
              checked={form.hasSeo}
              onChange={(e) => setForm((f) => ({ ...f, hasSeo: e.target.checked }))}
            >
              SEO (meta tags, sitemap, Open Graph)
            </Checkbox>
          </CheckRow>
          <CheckRow>
            <Checkbox
              checked={form.hasMultiLang}
              onChange={(e) => setForm((f) => ({ ...f, hasMultiLang: e.target.checked }))}
            >
              Multi-language
            </Checkbox>
            {form.hasMultiLang && (
              <LangInput
                value={form.languages}
                onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))}
                placeholder='เช่น th, en, zh'
                size='small'
              />
            )}
          </CheckRow>
          <CheckRow>
            <Checkbox
              checked={form.hasRealtime}
              onChange={(e) => setForm((f) => ({ ...f, hasRealtime: e.target.checked }))}
            >
              Real-time (WebSocket)
            </Checkbox>
          </CheckRow>
        </FieldGroup>

        {/* Group 4 — Notes */}
        <Divider orientation='left'>อื่นๆ</Divider>

        <FieldGroup>
          <Input.TextArea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder='อธิบาย requirements เพิ่มเติม เช่น ใช้ Oracle DB, ต้องรองรับ PWA, มี payment gateway'
            rows={4}
          />
        </FieldGroup>

        <Button type='primary' size='large' onClick={handleSubmit} className='mt-4'>
          Generate
        </Button>
      </FormCard>

      {/* Output Section */}
      {output && (
        <OutputSection ref={outputRef}>
          <Typography.Title level={3} className='mb-6'>
            ผลลัพธ์
          </Typography.Title>

          <OutputBlock>
            <BlockHeader>
              <Typography.Text strong>Repo + Clone Command</Typography.Text>
              <Button size='small' onClick={() => handleCopy(output.cloneBlock, 'clone command')}>
                Copy
              </Button>
            </BlockHeader>
            <pre>{output.cloneBlock}</pre>
          </OutputBlock>

          <OutputBlock>
            <BlockHeader>
              <Typography.Text strong>Setup Prompt</Typography.Text>
              <Typography.Text type='secondary' className='text-xs'>
                วางใน Claude ครั้งแรกหลัง clone
              </Typography.Text>
              <Button size='small' onClick={() => handleCopy(output.setupPrompt, 'setup prompt')}>
                Copy
              </Button>
            </BlockHeader>
            <pre>{output.setupPrompt}</pre>
          </OutputBlock>

          <OutputBlock>
            <BlockHeader>
              <Typography.Text strong>Project Brief</Typography.Text>
              <Typography.Text type='secondary' className='text-xs'>
                วางทุกครั้งที่เปิด session ใหม่
              </Typography.Text>
              <Button size='small' onClick={() => handleCopy(output.projectBrief, 'project brief')}>
                Copy
              </Button>
            </BlockHeader>
            <pre>{output.projectBrief}</pre>
          </OutputBlock>
        </OutputSection>
      )}
    </PageContainer>
  )
}

const PageContainer = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 24px;
`

const FormCard = styled.div`
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
`

const FieldGroup = styled.div`
  margin-bottom: 16px;
`

const FieldLabel = styled.div`
  font-weight: 500;
  margin-bottom: 6px;
`

const ErrorText = styled.div`
  color: var(--ant-color-error, #ff4d4f);
  font-size: 12px;
  margin-top: 4px;
`

const RadioOption = styled(Radio)`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const RadioDesc = styled.span`
  color: var(--color-text-secondary, #888);
  font-size: 12px;
  margin-left: 6px;
`

const CheckRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`

const LangInput = styled(Input)`
  width: 200px;
`

const OutputSection = styled.div`
  margin-top: 40px;
`

const OutputBlock = styled.div`
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  pre {
    background: #f5f5f5;
    border-radius: 4px;
    padding: 12px;
    margin-top: 12px;
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-x: auto;
  }
`

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ask-start-repo/ask-start-repo-form.tsx
git commit -m "feat: add AskStartRepoForm component"
```

---

## Task 4: Page

**Files:**

- Create: `src/app/[locale]/(public)/ask-start-repo/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// src/app/[locale]/(public)/ask-start-repo/page.tsx
import AskStartRepoForm from '@/components/ask-start-repo/ask-start-repo-form'

export default function AskStartRepoPage() {
  return <AskStartRepoForm />
}
```

- [ ] **Step 2: Run dev server and verify the page loads**

```bash
pnpm dev
```

Open: `http://localhost:3000/th/ask-start-repo`

Expected:
- Form shows with all 4 groups
- Submit without name or type → shows error messages
- Fill all fields → Generate → output section scrolls into view with 3 blocks
- Copy buttons → `message.success` toast appears

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/\(public\)/ask-start-repo/page.tsx
git commit -m "feat: add /ask-start-repo page"
```
