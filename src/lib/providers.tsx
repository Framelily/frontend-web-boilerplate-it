'use client'

import type { ReactNode } from 'react'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import QueryProvider from '@/lib/query-provider'
import AntdProvider from '@/lib/antd-provider'
import StyledComponentsRegistry from '@/lib/styled-component-registry'
import { AuthProvider } from '@/contexts/auth-context'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <AntdRegistry>
          <StyledComponentsRegistry>
            <AntdProvider>{children}</AntdProvider>
          </StyledComponentsRegistry>
        </AntdRegistry>
      </AuthProvider>
    </QueryProvider>
  )
}
