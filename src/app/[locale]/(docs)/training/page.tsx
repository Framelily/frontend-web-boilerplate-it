import { DOC_MENU, loadAllDocs } from '@/lib/markdown'
import TrainingLayout from '@/components/training/training-layout'

export const metadata = {
  title: 'Claude Code Training — CyberRich Digital',
}

export default function TrainingPage() {
  const docs = loadAllDocs()

  return <TrainingLayout menu={DOC_MENU} docs={docs} defaultKey="session-1" />
}
