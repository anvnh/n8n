// API-related type definitions

/**
 * PostgREST API response headers
 */
export interface PostgRESTHeaders {
  'Content-Range'?: string
  'Content-Type': string
}

/**
 * PostgREST filter operators
 */
export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'in'
  | 'is'

/**
 * API error response
 */
export interface ApiError {
  message: string
  details?: string
  hint?: string
  code?: string
}

/**
 * Webhook payload for invoice actions
 */
export interface WebhookPayload {
  invoiceId: string
  action: 'approve' | 'reject'
  reason?: string
  timestamp?: string
}
