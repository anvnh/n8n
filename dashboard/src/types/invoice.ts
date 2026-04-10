// Extended invoice type definitions

import type { InvoiceStatus, Priority } from './index'

/**
 * Invoice record from database
 */
export interface InvoiceRecord {
  id: string
  vendor_id?: number
  sender: string
  received_date: string
  amount: number | string
  drive_link?: string
  status: InvoiceStatus
  transaction_id?: string
  payment_date?: string
  created_at?: string
  priority?: Priority | string
  bank_name?: string
  bank_code?: string
  account_name?: string
  account_number?: string
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
}

/**
 * Invoice summary for dashboard stats
 */
export interface InvoiceSummary {
  total: number
  pending: number
  approved: number
  rejected: number
  paid: number
  totalAmount: number
  paidAmount: number
}
