import { NextResponse } from 'next/server'
import { API_ENDPOINT, getAccessToken } from '@/lib/api-config'

export async function GET() {
  const token = await getAccessToken()

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${API_ENDPOINT}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ message: 'Failed to get user' }, { status: 500 })
  }
}
