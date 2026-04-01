'use client'

import { ConfigProvider, App } from 'antd'
import thTH from 'antd/locale/th_TH'
import type { ReactNode } from 'react'

const theme = {
  token: {
    colorPrimary: '#F7931E',
    colorError: '#E90A0E',
    fontFamily: "'Noto Sans Thai Variable', sans-serif",
    borderRadius: 8,
    controlHeight: 40,
  },
  components: {
    Button: {
      controlHeight: 40,
      paddingInline: 24,
    },
    Input: {
      controlHeight: 40,
    },
    Table: {
      headerBg: '#FAFAFA',
    },
  },
}

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={theme} locale={thTH}>
      <App>{children}</App>
    </ConfigProvider>
  )
}
