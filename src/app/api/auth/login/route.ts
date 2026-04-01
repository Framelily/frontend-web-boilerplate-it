import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { API_ENDPOINT, COOKIE_CONFIG } from '@/lib/api-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = await fetch(`${API_ENDPOINT}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    // Set httpOnly cookie with access token
    const cookieStore = await cookies()
    cookieStore.set('access-token', data.token, COOKIE_CONFIG)

    return NextResponse.json({ user: data.user })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Login failed' }, { status: 500 })
  }
}
