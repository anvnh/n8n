// Base API configuration and interceptors

import axios from 'axios'

/**
 * Create configured axios instance for PostgREST
 */
export const postgrestClient = axios.create({
  baseURL: import.meta.env.VITE_POSTGREST_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Create configured axios instance for n8n webhooks
 */
export const webhookClient = axios.create({
  baseURL: import.meta.env.VITE_WEBHOOK_BASE_URL || 'http://localhost:5678/webhook',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
  },
})

// Response interceptor for error logging
postgrestClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[PostgREST Error]', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

webhookClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[Webhook Error]', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)
