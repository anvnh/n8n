import axios from 'axios'
import type { LoginCredentials, LoginResponse, User } from '../auth/types'

const AUTH_BASE = '/api'

const authApi = axios.create({
  baseURL: AUTH_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request if available
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Auth Endpoints ─────────────────────────────────────────

export async function loginApi(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await authApi.post('/auth/login', credentials)
  return data
}

export async function getMeApi(): Promise<User> {
  const { data } = await authApi.get('/auth/me')
  return data.user
}

export async function getUsersApi(): Promise<User[]> {
  const { data } = await authApi.get('/auth/users')
  return data.users
}

export async function registerUserApi(payload: {
  email: string
  password: string
  name: string
  role: string
}): Promise<User> {
  const { data } = await authApi.post('/auth/register', payload)
  return data.user
}

export async function updateUserApi(
  id: number,
  payload: { name?: string; role?: string; is_active?: boolean }
): Promise<User> {
  const { data } = await authApi.patch(`/auth/users/${id}`, payload)
  return data.user
}

export async function deleteUserApi(id: number): Promise<void> {
  await authApi.delete(`/auth/users/${id}`)
}
