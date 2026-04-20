import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, LoginCredentials, AuthState, Permission, UserRole } from './types'
import { hasPermission } from './types'
import { loginApi, getMeApi } from '../api/auth'

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  can: (permission: Permission) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!token && !!user

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const me = await getMeApi()
        setUser(me)
        localStorage.setItem(USER_KEY, JSON.stringify(me))
      } catch {
        // Token expired or invalid
        setToken(null)
        setUser(null)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      } finally {
        setIsLoading(false)
      }
    }
    verify()
  }, [token])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginApi(credentials)
    setToken(response.token)
    setUser(response.user)
    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }, [])

  const can = useCallback(
    (permission: Permission) => {
      if (!user) return false
      return hasPermission(user.role as UserRole, permission)
    },
    [user]
  )

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
