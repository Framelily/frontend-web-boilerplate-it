import type { Metadata } from 'next'
import { defaultSEO } from '@/configs/data-seo'

import '@fontsource-variable/noto-sans-thai'
import '@/styles/globals.css'

export const metadata: Metadata = defaultSEO

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
