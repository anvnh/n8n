import axios from 'axios'

export interface Invoice {
  invoiceId: string
  vendorId?: number
  sender: string
  receivedDate: string
  amount: number
  driveLink: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid'
  transactionId?: string
  paymentDate?: string
  createdAt?: string
  priority?: 'High' | 'Low' | 'Normal' | string
  bankName?: string
  bankCode?: string
  accountName?: string
  accountNumber?: string
}

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_POSTGREST_BASE_URL || 'http://localhost:3000'
    const { data } = await axios.get(`${baseUrl}/invoices`)
    
    // Fallback parsing just in case DB schema differs from the mock interface
    if (Array.isArray(data)) {
      return data.map((row: any) => ({
        invoiceId: row.id || row.invoice_id || row.invoiceId || '',
        vendorId: row.vendor_id,
        sender: row.sender || '',
        receivedDate: row.received_date || row.receivedDate || '',
        amount: parseFloat(row.amount || '0'),
        driveLink: row.drive_link || row.driveLink || '',
        status: row.status || 'Pending',
        transactionId: row.transaction_id || row.transactionId || undefined,
        paymentDate: row.payment_date || row.paymentDate || undefined,
        createdAt: row.created_at || row.createdAt || undefined,
        priority: row.priority || undefined,
        bankName: row.bank_name || row.bankName || undefined,
        bankCode: row.bank_code || row.bankCode || undefined,
        accountName: row.account_name || row.accountName || undefined,
        accountNumber: row.account_number || row.accountNumber || undefined,
      }))
    }
    console.warn('[invoices.ts] API returned success, but data is NOT an array:', data)
    return []
  } catch (err: unknown) {
    console.error('[invoices.ts] PostgREST call failed with error:', err)
    if (axios.isAxiosError(err)) {
      console.error('[invoices.ts] Axios Error Details:', err.response?.status, err.response?.data)
    }
    // Return empty data
    return []
  }
}


