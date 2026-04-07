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
  // type is guaranteed non-null by caller validation before calling this function
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
