import axios from 'axios'
import type { LoginCredentials, LoginResponse, User, StoredUserRole, UserRole } from '../auth/types'
import { normalizeRole, denormalizeRole } from '../auth/types'

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
  return {
    ...data,
    user: { ...data.user, role: normalizeRole(data.user.role as StoredUserRole) },
  }
}

export async function getMeApi(): Promise<User> {
  const { data } = await authApi.get('/auth/me')
  return { ...data.user, role: normalizeRole(data.user.role as StoredUserRole) }
}

export async function getUsersApi(): Promise<User[]> {
  const { data } = await authApi.get('/auth/users')
  return data.users.map((u: User) => ({
    ...u,
    role: normalizeRole(u.role as StoredUserRole),
  }))
}

export async function registerUserApi(payload: {
  email: string
  password: string
  name: string
  role: string
}): Promise<User> {
  const normalizedPayload = {
    ...payload,
    role: denormalizeRole(payload.role as UserRole),
  }
  const { data } = await authApi.post('/auth/register', normalizedPayload)
  return { ...data.user, role: normalizeRole(data.user.role as StoredUserRole) }
}

export async function signupApi(payload: {
  email: string
  password: string
  name: string
}): Promise<User> {
  const { data } = await authApi.post('/auth/signup', payload)
  return { ...data.user, role: normalizeRole(data.user.role as StoredUserRole) }
}

export async function updateUserApi(
  id: number,
  payload: { name?: string; role?: string; is_active?: boolean }
): Promise<User> {
  const normalizedPayload = payload.role
    ? { ...payload, role: denormalizeRole(payload.role as UserRole) }
    : payload
  const { data } = await authApi.patch(`/auth/users/${id}`, normalizedPayload)
  return { ...data.user, role: normalizeRole(data.user.role as StoredUserRole) }
}

export async function deleteUserApi(id: number): Promise<void> {
  await authApi.delete(`/auth/users/${id}`)
}
