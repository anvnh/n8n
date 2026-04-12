// Error log type definitions

export interface ErrorLogEntry {
  id: string | number
  invoice_id?: string
  error_type?: 'payment' | 'parsing' | 'network' | 'validation' | 'unknown'
  error_message: string
  error_stack?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  resolved?: boolean
  resolved_by?: string
  resolved_at?: string
  created_at: string
}

export interface ErrorLogFilters {
  severity?: string
  resolved?: boolean
  dateFrom?: string
  dateTo?: string
  invoiceId?: string
}
