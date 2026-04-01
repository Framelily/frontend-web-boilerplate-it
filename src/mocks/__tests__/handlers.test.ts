import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'

import { handlers } from '../handlers'
import { MOCK_TOKEN, MOCK_USERS } from '../data'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('POST /v1/auth/login', () => {
  const url = 'http://localhost/v1/auth/login'

  it('returns token and user on valid credentials', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'password' }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.token).toBe(MOCK_TOKEN)
    expect(data.user.username).toBe('admin')
    expect(data.user).not.toHaveProperty('password')
  })

  it('returns 401 on invalid credentials', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrong' }),
    })

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.message).toBeTruthy()
  })
})

describe('GET /v1/auth/me', () => {
  const url = 'http://localhost/v1/auth/me'

  it('returns user when valid token is provided', async () => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${MOCK_TOKEN}` },
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.username).toBe(MOCK_USERS[0].username)
    expect(data).not.toHaveProperty('password')
  })

  it('returns 401 when no token is provided', async () => {
    const res = await fetch(url)

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.message).toBeTruthy()
  })

  it('returns 401 when invalid token is provided', async () => {
    const res = await fetch(url, {
      headers: { Authorization: 'Bearer invalid-token' },
    })

    expect(res.status).toBe(401)
  })
})
