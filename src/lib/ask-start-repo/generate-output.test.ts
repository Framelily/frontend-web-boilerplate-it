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
