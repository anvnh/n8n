// API endpoint constants

const POSTGREST_BASE = import.meta.env.VITE_POSTGREST_BASE_URL || 'http://localhost:3000'
const WEBHOOK_BASE = import.meta.env.VITE_WEBHOOK_BASE_URL || 'http://localhost:5678/webhook'

export const API_ENDPOINTS = {
  // PostgREST
  INVOICES: `${POSTGREST_BASE}/invoices`,
  VENDORS: `${POSTGREST_BASE}/vendors`,
  ERROR_LOGS: `${POSTGREST_BASE}/error_logs`,

  // n8n Webhooks
  APPROVE_INVOICE: `${WEBHOOK_BASE}/approve-invoice`,
  TRIGGER_WORKFLOW: `${WEBHOOK_BASE}/trigger-workflow`,
} as const

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': '1',
} as const
