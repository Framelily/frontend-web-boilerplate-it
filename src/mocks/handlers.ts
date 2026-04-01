import { http, HttpResponse } from 'msw'

import { MOCK_TOKEN, MOCK_USERS } from './data'

export const handlers = [
  http.post('*/v1/auth/login', async ({ request }) => {
    const { username, password } = (await request.json()) as { username: string; password: string }

    const user = MOCK_USERS.find((u) => u.username === username && u.password === password)

    if (!user) {
      return HttpResponse.json({ message: 'Invalid username or password' }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user

    return HttpResponse.json({
      token: MOCK_TOKEN,
      user: userWithoutPassword,
    })
  }),

  http.get('*/v1/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || authHeader !== `Bearer ${MOCK_TOKEN}`) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = MOCK_USERS[0]

    return HttpResponse.json(userWithoutPassword)
  }),
]
