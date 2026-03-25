import axios from 'axios'

const apiKey = import.meta.env.VITE_N8N_API_KEY || ''

const n8nClient = axios.create({
  baseURL: '/n8n-api',
  headers: {
    'X-N8N-API-KEY': apiKey,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1'
  },
})

// ── Request logging ────────────────────────────────────────────
n8nClient.interceptors.request.use((config) => {
  const fullUrl = (config.baseURL || '') + (config.url || '')
  console.group(`[n8n] ▶ ${config.method?.toUpperCase()} ${fullUrl}`)
  console.log('API Key present:', !!apiKey, '| length:', apiKey.length)
  console.log('Headers:', config.headers)
  console.groupEnd()
  return config
})

// ── Response logging ───────────────────────────────────────────
n8nClient.interceptors.response.use(
  (response) => {
    console.log(`[n8n] ✅ ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.group(`[n8n] ❌ ERROR`)
    console.error('URL:', error.config?.baseURL + error.config?.url)
    console.error('Status:', error.response?.status)
    console.error('Response body:', error.response?.data)
    console.error('Request headers sent:', error.config?.headers)
    console.groupEnd()
    return Promise.reject(error)
  }
)

export default n8nClient
