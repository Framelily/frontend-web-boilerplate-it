'use client'

import { Button } from 'antd'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = () => {
    const nextLocale = locale === 'th' ? 'en' : 'th'
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Button size='small' onClick={switchLocale}>
      {locale === 'th' ? 'EN' : 'TH'}
    </Button>
  )
}
