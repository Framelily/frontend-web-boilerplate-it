'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { useQueryClient } from '@tanstack/react-query'
import type { IUser } from '@/types/base'
import type { AuthUser } from '@/types/auth'

interface AuthContextType {
  user: AuthUser
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    const userCookie = getCookie('user')
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie as string))
      } catch {
        deleteCookie('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Login failed')
    }

    const data = await res.json()
    setCookie('user', JSON.stringify(data.user), { sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24 * 7 })
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    deleteCookie('user')
    setUser(null)
    queryClient.clear()
    window.location.href = '/login'
  }, [queryClient])

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setCookie('user', JSON.stringify(data), { sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24 * 7 })
        setUser(data)
      }
    } catch {
      console.warn('Failed to refresh user')
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
