import axios from 'axios'
import type { SystemSettings } from '../constants/settings'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function getSystemSettings(): Promise<SystemSettings> {
  const { data } = await api.get('/settings')
  return data.settings
}

export async function saveSystemSettings(payload: SystemSettings): Promise<SystemSettings> {
  const { data } = await api.put('/settings', payload)
  return data.settings
}
