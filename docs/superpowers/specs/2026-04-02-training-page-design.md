# Training Docs Page

## Overview

หน้าเว็บ training สำหรับทีม CyberRich Digital — single page scroll พร้อม sidebar เมนู แบ่งเป็น 2 ส่วน: Training (เนื้อหาเรียบเรียงเป็น session) และ Docs (ไฟล์ .md ดิบเป็น reference)

## Layout

```
┌──────────────────────────────────────────┐
│  Training Header                         │
│  "Claude Code Training"                  │
├────────────┬─────────────────────────────┤
│            │                             │
│ TRAINING   │  (render .md ที่เลือก)       │
│ > Session 1│                             │
│   Session 2│                             │
│   Session 3│                             │
│   Session 4│                             │
│   Cheat    │                             │
│            │                             │
│ DOCS       │                             │
│   Guide    │                             │
│   Rules    │                             │
│   Project  │                             │
│            │                             │
└────────────┴─────────────────────────────┘
```

- Sidebar sticky ด้านซ้าย — กดเมนูเปลี่ยนเนื้อหาขวา
- Content area render markdown เป็น HTML
- Header เฉพาะหน้านี้ (ไม่ใช้ header/footer เดิม)
- Responsive: มือถือซ่อน sidebar เป็น drawer

## Sidebar Menu

### TRAINING section

เนื้อหาที่เรียบเรียงแล้วเป็น session สอน — สร้าง markdown ใหม่:

| Menu | File |
|---|---|
| Session 1: พื้นฐาน | `docs/training/session-1-basics.md` |
| Session 2: CLAUDE.md & Rules | `docs/training/session-2-claudemd-rules.md` |
| Session 3: Token & Commands | `docs/training/session-3-token-commands.md` |
| Session 4: Superpowers | `docs/training/session-4-superpowers.md` |
| Cheat Sheet | `docs/training/cheat-sheet.md` |

### DOCS section

ไฟล์ .md ดิบที่มีอยู่แล้ว — อ่านเป็น reference:

| Menu | File |
|---|---|
| Claude Code Guide | `docs/claude-code-guide.md` |
| Team Coding Rules | `.claude/CLAUDE.md` |
| Project Architecture | `CLAUDE.md` |

## Route

- Path: `/training`
- Route group: `(docs)` — layout เฉพาะ ไม่ใช้ header/footer เดิม
- Public — ไม่ต้อง login

## Tech

| Package | Purpose |
|---|---|
| `react-markdown` | Render markdown → HTML |
| `remark-gfm` | Support tables, strikethrough, task lists |
| `rehype-highlight` | Syntax highlighting สำหรับ code blocks |

## Files

| File | Action | Description |
|---|---|---|
| `src/app/[locale]/(docs)/layout.tsx` | Create | Layout เฉพาะ docs — ไม่มี header/footer เดิม |
| `src/app/[locale]/(docs)/training/page.tsx` | Create | Server component อ่าน .md files ส่งให้ client |
| `src/components/training/training-layout.tsx` | Create | Client component — sidebar + content area |
| `src/components/training/training-header.tsx` | Create | Header เฉพาะหน้า training |
| `src/components/training/markdown-renderer.tsx` | Create | Render markdown ด้วย react-markdown + plugins |
| `src/lib/markdown.ts` | Create | Utility อ่าน .md file จาก filesystem |
| `docs/training/session-1-basics.md` | Create | เนื้อหา Session 1 |
| `docs/training/session-2-claudemd-rules.md` | Create | เนื้อหา Session 2 |
| `docs/training/session-3-token-commands.md` | Create | เนื้อหา Session 3 |
| `docs/training/session-4-superpowers.md` | Create | เนื้อหา Session 4 |
| `docs/training/cheat-sheet.md` | Create | Cheat sheet |

## Behavior

1. เปิด `/training` → default แสดง Session 1
2. กดเมนู sidebar → เนื้อหาขวาเปลี่ยนทันที (client-side, ไม่ reload)
3. เมนูที่ active highlight สีต่างจากปกติ
4. Markdown render: headings, tables, code blocks (syntax highlight), lists, bold/italic, links
5. Mobile: sidebar เป็น drawer กดปุ่มเปิด/ปิด

## Training Content Source

เนื้อหาแต่ละ session ดึงจาก `docs/claude-code-guide.md` ที่เขียนไว้แล้ว แบ่งเป็นไฟล์แยกตาม session:

- **Session 1**: หัวข้อ 1 (คำสั่งพื้นฐาน) + 4 (วิธีสั่ง AI) + keyboard shortcuts
- **Session 2**: หัวข้อ 2 (CLAUDE.md) + coding rules จาก `.claude/CLAUDE.md`
- **Session 3**: หัวข้อ 5 (ประหยัด Token) + 3 (Custom Commands) + 6 (เลือก Model) + 7 (Workflow)
- **Session 4**: หัวข้อ 8 (Superpowers ทั้งหมด)
- **Cheat Sheet**: สรุปรวมท้าย claude-code-guide.md

## Scope

- ไม่มี search
- ไม่มี dark mode (ใช้ theme เดิมของ project)
- ไม่มี i18n (เนื้อหาเป็นภาษาไทยเท่านั้น)
- ไม่มี edit/save — read-only
