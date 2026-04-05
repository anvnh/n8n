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
