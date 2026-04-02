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
