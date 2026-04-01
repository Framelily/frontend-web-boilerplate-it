import type { Metadata } from 'next'

export const defaultSEO: Metadata = {
  title: {
    default: 'Project Name',
    template: '%s | Project Name',
  },
  description: 'Project description goes here',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: 'Project Name',
  },
  robots: {
    index: true,
    follow: true,
  },
}
