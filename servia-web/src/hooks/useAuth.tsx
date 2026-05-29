'use client'
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User } from '@/types'
import { api } from '@/lib/api'

interface AuthCtx {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('servia_token')
    if (stored) {
      setToken(stored)
      api.get<{ user: User }>('/auth/me')
        .then(r => setUser(r.user))
        .catch(() => localStorage.removeItem('servia_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function login(email: string, password: string) {
    const res = await api.post<{ user: User; token: string }>('/auth/login', { email, password })
    localStorage.setItem('servia_token', res.token)
    setToken(res.token)
    setUser(res.user)
  }

  async function register(name: string, email: string, password: string, role = 'client') {
    const res = await api.post<{ user: User; token: string }>('/auth/register', { name, email, password, role })
    localStorage.setItem('servia_token', res.token)
    setToken(res.token)
    setUser(res.user)
  }

  function logout() {
    localStorage.removeItem('servia_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
