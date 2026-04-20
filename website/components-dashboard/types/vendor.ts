// Vendor-related type definitions

export interface Vendor {
  id: string | number
  name: string
  email?: string
  phone?: string
  address?: string
  is_active?: boolean
  total_invoices?: number
  total_paid?: number
  created_at?: string
  updated_at?: string
}

export interface VendorStats {
  vendorId: string | number
  vendorName: string
  invoiceCount: number
  totalAmount: number
  paidAmount: number
  pendingCount: number
}
