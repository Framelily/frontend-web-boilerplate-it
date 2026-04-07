# Ask Start Repo — Design Spec

**Date:** 2026-04-07
**Status:** Approved

## Overview

A public web page `/ask-start-repo` that guides developers through project setup by asking questions about the project, then generating a repo recommendation, clone command, setup prompt, and project brief prompt for use with Claude AI.

## Route

```text
src/app/[locale]/(public)/ask-start-repo/page.tsx
```

Public page — no authentication required. Follows existing `(public)` layout group convention.

## Form

### Group 1 — Project Info

| Field            | Type     | Required |
| ---------------- | -------- | -------- |
| ชื่อโปรเจค      | text     | yes      |
| คำอธิบายโปรเจค  | textarea | yes      |

### Group 2 — Project Type

Radio group (required). Selection determines which repo to recommend.

| Option      | Label                              | Repo                               |
| ----------- | ---------------------------------- | ---------------------------------- |
| `web`       | Web — public-facing website        | `frontend-web-boilerplate`         |
| `backoffice`| Backoffice — admin dashboard       | `frontend-backoffice-boilerplate`  |
| `electron`  | Electron — desktop app             | `frontend-electron-boilerplate`    |

### Group 3 — Core Features

Checkboxes (all optional):

- Authentication / Login
- SEO (meta tags, sitemap, Open Graph)
- Multi-language — if checked, shows a text input for the developer to type languages (e.g. `th, en, zh`)
- Real-time (WebSocket)

### Group 4 — อื่นๆ (optional)

Free-form textarea — developer can describe any additional requirements, constraints, or context in their own words. This text is appended as-is into both the setup prompt and project brief under an "Additional context" section.

## Submit Behavior

- Validate: ชื่อโปรเจค and Project Type are required
- Generation is client-side only — no API calls
- After submit: output section renders below the form and page scrolls to it automatically

## Output

Three blocks, each with a copy button.

### Block 1 — Repo + Clone

```text
แนะนำ: frontend-web-boilerplate
https://github.com/Cyber-Rich-Digital/frontend-web-boilerplate

git clone https://github.com/Cyber-Rich-Digital/frontend-web-boilerplate <project-name>
cd <project-name>
cp .env.example .env
pnpm install
```

Repo URLs per type:

- `web` → `https://github.com/Cyber-Rich-Digital/frontend-web-boilerplate`
- `backoffice` → `https://github.com/Cyber-Rich-Digital/frontend-backoffice-boilerplate`
- `electron` → `https://github.com/Cyber-Rich-Digital/frontend-electron-boilerplate`

### Block 2 — Setup Prompt

Prompt for the **first Claude session** — instructs Claude to configure the boilerplate to match project requirements.

Template (generated from form values):

```text
คุณคือ senior frontend developer ช่วย setup โปรเจค "{name}" จาก boilerplate นี้

คำอธิบาย: {description}
ประเภท: {type}

Feature requirements:
{- มี Authentication / Login}
{- มี SEO (meta tags, sitemap, Open Graph)}
{- รองรับหลายภาษา: {languages}}
{- มี Real-time (WebSocket)}

{Additional context:
{notes}}

กรุณา:
1. เปลี่ยนชื่อโปรเจคในไฟล์ที่เกี่ยวข้อง (package.json, README, etc.)
2. ลบ/ปิด feature ที่ไม่ได้ใช้ออกจาก boilerplate
3. Config ค่าเริ่มต้นตาม requirements ที่ให้ไว้
```

Lines wrapped in `{}` are conditional — only included if the related feature is checked or field is filled.

### Block 3 — Project Brief

Prompt for **every new Claude session** — gives Claude full project context.

```text
Project: {name}
คำอธิบาย: {description}
ประเภท: {type}
Stack: Next.js App Router, React 19, Ant Design, Tailwind CSS, TanStack Query

Features:
{- Authentication / Login}
{- SEO}
{- Multi-language: {languages}}
{- Real-time (WebSocket)}

{Additional context:
{notes}}
```

## UI/UX

- **Ant Design** for all form components: `Input`, `Checkbox`, `Radio`, `Button`, `Divider`, `Typography`
- **styled-components** for page layout wrapper and output section container
- **Tailwind** for small spacing utilities only
- Form groups separated by `Divider` with section label
- Output section uses `Card` per block with a copy button (`Button` + `message.success`)
- No loading state — generation is instant

## Styling Note

Page lives in `(public)` group which has navbar/footer. The form should be centered with a max-width container (styled-components), not full-width.

## Out of Scope

- Saving/persisting form state
- Sharing generated output via URL
- API calls of any kind
- Authentication
