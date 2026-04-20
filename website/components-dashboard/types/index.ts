// Core type definitions for the dashboard application

export type InvoiceStatus = 'Pending' | 'Approved' | 'Rejected' | 'Paid'
export type Priority = 'High' | 'Normal' | 'Low'

export interface PaginationParams {
  page: number
  limit: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface FilterOptions {
  status?: InvoiceStatus
  search?: string
  dateFrom?: string
  dateTo?: string
}

// Re-export all type modules
export type { InvoiceRecord, InvoiceSummary } from './invoice'
export type { Vendor, VendorStats } from './vendor'
export type { ErrorLogEntry, ErrorLogFilters } from './errorLog'
export type { ApiError, WebhookPayload } from './api'
export type { TableColumn, SortConfig, DateRange, SelectOption } from './common'
