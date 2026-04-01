import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_ENDPOINT = process.env.API_ENDPOINT || ''

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = ['/v1/auth/login', '/v1/auth/register', '/v1/banks']

function isPublicEndpoint(path: string): boolean {
  return PUBLIC_ENDPOINTS.some((endpoint) => path.startsWith(endpoint))
}

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const targetPath = '/' + path.join('/')
  const url = new URL(targetPath, API_ENDPOINT)

  // Preserve query parameters
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const cookieStore = await cookies()
  const token = cookieStore.get('access-token')?.value

  // Check auth for non-public endpoints
  if (!isPublicEndpoint(targetPath) && !token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const headers: Record<string, string> = {}

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Handle Content-Type
  const contentType = req.headers.get('content-type')
  if (contentType && !contentType.includes('multipart/form-data')) {
    headers['Content-Type'] = contentType
  }

  let body: BodyInit | undefined
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (contentType?.includes('multipart/form-data')) {
      body = await req.formData()
    } else {
      body = await req.text()
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body,
    })

    const responseContentType = response.headers.get('content-type') || ''

    if (responseContentType.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    }

    const blob = await response.blob()
    return new NextResponse(blob, {
      status: response.status,
      headers: { 'Content-Type': responseContentType },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ message: 'Internal proxy error' }, { status: 502 })
  }
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const PATCH = proxyRequest
export const DELETE = proxyRequest
