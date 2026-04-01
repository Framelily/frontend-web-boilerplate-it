import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('app')

  return (
    <div className='flex flex-col items-center justify-center py-20'>
      <h1 className='text-3xl font-bold'>{t('name')}</h1>
      <p className='mt-4 text-lg text-gray-500'>Frontend Web Boilerplate</p>
    </div>
  )
}
