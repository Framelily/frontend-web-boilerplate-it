'use client'

import { Button, Form, Input, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export default function RegisterPage() {
  const t = useTranslations('auth')

  return (
    <>
      <Typography.Title level={2} className='text-center'>
        {t('registerTitle')}
      </Typography.Title>

      <Form layout='vertical' autoComplete='off'>
        <Form.Item name='username' label={t('username')} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name='password' label={t('password')} rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item name='confirmPassword' label={t('confirmPassword')} rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' block>
            {t('registerButton')}
          </Button>
        </Form.Item>
      </Form>

      <div className='mt-4 text-center'>
        <Link href='/login'>{t('loginButton')}</Link>
      </div>
    </>
  )
}
