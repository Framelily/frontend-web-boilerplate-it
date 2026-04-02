'use client'

import { ConfigProvider, App } from 'antd'
import thTH from 'antd/locale/th_TH'
import type { ReactNode } from 'react'

const theme = {
  token: {
    colorPrimary: '#2E7D5B',
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
    Menu: {
      itemSelectedBg: '#e6f4ee',
      itemSelectedColor: '#1a4d36',
      itemActiveBg: '#e6f4ee',
      activeBarBorderWidth: 3,
      itemBorderRadius: 0,
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
