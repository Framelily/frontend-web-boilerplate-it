'use client'

import { Typography } from 'antd'
import { useAuth } from '@/contexts/auth-context'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className='mx-auto max-w-4xl p-6'>
      <Typography.Title level={2}>Dashboard</Typography.Title>
      <Typography.Text>Welcome, {user?.name || 'User'}</Typography.Text>
    </div>
  )
}
