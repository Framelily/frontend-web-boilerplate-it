import { describe, it, expect } from 'vitest'

import { MOCK_TOKEN, MOCK_USERS } from '../data'

describe('mock data', () => {
  it('has at least one user', () => {
    expect(MOCK_USERS.length).toBeGreaterThan(0)
  })

  it('each user has required IUser fields', () => {
    for (const user of MOCK_USERS) {
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('password')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('role')
      expect(user).toHaveProperty('createdAt')
      expect(user).toHaveProperty('updatedAt')
    }
  })

  it('has a non-empty mock token', () => {
    expect(MOCK_TOKEN).toBeTruthy()
    expect(typeof MOCK_TOKEN).toBe('string')
  })
})
