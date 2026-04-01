'use client'

import { Button, Space } from 'antd'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/auth-context'
import { Link } from '@/i18n/routing'
import LanguageSwitcher from '@/components/common/language-switcher'
import styled from 'styled-components'

export default function Header() {
  const t = useTranslations('nav')
  const { isAuthenticated, logout } = useAuth()

  return (
    <HeaderWrapper>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4'>
        <Link href='/'>
          <Logo>{t('home')}</Logo>
        </Link>

        <Space>
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Button onClick={logout}>{t('logout')}</Button>
          ) : (
            <>
              <Link href='/login'>
                <Button type='primary'>{t('login')}</Button>
              </Link>
              <Link href='/register'>
                <Button>{t('register')}</Button>
              </Link>
            </>
          )}
        </Space>
      </div>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.header`
  background: #fff;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
`

const Logo = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
`
