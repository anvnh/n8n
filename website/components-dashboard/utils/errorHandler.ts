// Centralized error handling utilities

import axios from 'axios'

/**
 * Extract user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      if (status === 404) return 'Resource not found'
      if (status === 401) return 'Unauthorized — please login again'
      if (status === 403) return 'Access denied — insufficient permissions'
      if (status === 500) return 'Internal server error'
      if (typeof data === 'object' && data?.message) return data.message
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Network error — check if the server is running'
    }
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

/**
 * Log error with context information
 */
export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error)
  if (axios.isAxiosError(error)) {
    console.error(`  Status: ${error.response?.status}`)
    console.error(`  Data:`, error.response?.data)
  }
}
