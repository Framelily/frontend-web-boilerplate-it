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
