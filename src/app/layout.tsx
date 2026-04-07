import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

import { defaultSEO } from '@/configs/data-seo'

import '@fontsource-variable/noto-sans-thai'
import '@/styles/globals.css'

export const metadata: Metadata = defaultSEO

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
