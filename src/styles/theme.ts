import type { ThemeConfig } from 'antd'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#F7931E',
    colorError: '#E90A0E',
    fontFamily: "'Noto Sans Thai Variable', sans-serif",
    borderRadius: 8,
    controlHeight: 40,
    colorBorder: '#E5E7EB',
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
