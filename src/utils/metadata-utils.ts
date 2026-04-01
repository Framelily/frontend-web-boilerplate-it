import type { Metadata } from 'next'

interface GenerateMetadataOptions {
  title: string
  description?: string
  path?: string
  image?: string
}

export function generatePageMetadata({ title, description, path = '', image }: GenerateMetadataOptions): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_URL || ''
  const url = `${baseUrl}${path}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      ...(image && { images: [{ url: image }] }),
    },
    alternates: {
      canonical: url,
    },
  }
}
