import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, LoginCredentials, AuthState, Permission, UserRole } from './types'
import { hasPermission } from './types'
import { loginApi, getMeApi } from '../api/auth'
import { getSystemSettings } from '../api/settings'
import { DEFAULT_SETTINGS, type SystemSettings } from '../constants/settings'

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  can: (permission: Permission) => boolean
  systemSettings: SystemSettings
  settingsLoading: boolean
  refreshSettings: () => Promise<void>
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
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SETTINGS)
  const [settingsLoading, setSettingsLoading] = useState(false)

  const isAuthenticated = !!token && !!user

  const refreshSettings = useCallback(async () => {
    setSettingsLoading(true)
    try {
      const settings = await getSystemSettings()
      setSystemSettings({ ...DEFAULT_SETTINGS, ...settings })
    } catch {
      setSystemSettings(DEFAULT_SETTINGS)
    } finally {
      setSettingsLoading(false)
    }
  }, [])

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
        await refreshSettings()
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
  }, [token, refreshSettings])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginApi(credentials)
    setToken(response.token)
    setUser(response.user)
    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    await refreshSettings()
  }, [refreshSettings])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }, [])

  useEffect(() => {
    if (!token) return
    let lastActive = Date.now()
    const updateActivity = () => {
      lastActive = Date.now()
    }
    const interval = setInterval(() => {
      const timeoutMs = systemSettings.sessionTimeout * 60 * 60 * 1000
      if (timeoutMs > 0 && Date.now() - lastActive > timeoutMs) {
        logout()
      }
    }, 60 * 1000)

    window.addEventListener('mousemove', updateActivity)
    window.addEventListener('keydown', updateActivity)
    window.addEventListener('click', updateActivity)

    return () => {
      clearInterval(interval)
      window.removeEventListener('mousemove', updateActivity)
      window.removeEventListener('keydown', updateActivity)
      window.removeEventListener('click', updateActivity)
    }
  }, [token, systemSettings.sessionTimeout, logout])

  const can = useCallback(
    (permission: Permission) => {
      if (!user) return false
      return hasPermission(user.role as UserRole, permission)
    },
    [user]
  )

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
      can,
      systemSettings,
      settingsLoading,
      refreshSettings,
    }}>
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
