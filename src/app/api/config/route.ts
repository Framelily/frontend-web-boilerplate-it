import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || '',
  })
}
