'use client'

import { useState } from 'react'
import { Button, Form, Input, Typography, App } from 'antd'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from '@/i18n/routing'

export default function LoginPage() {
  const t = useTranslations('auth')
  const { login } = useAuth()
  const router = useRouter()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      await login(values.username, values.password)
      router.push('/')
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Typography.Title level={2} className='text-center'>
        {t('loginTitle')}
      </Typography.Title>

      <Form layout='vertical' onFinish={onFinish} autoComplete='off'>
        <Form.Item name='username' label={t('username')} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name='password' label={t('password')} rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' loading={loading} block>
            {t('loginButton')}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
