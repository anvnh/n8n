import axios from 'axios'

export interface Invoice {
  invoiceId: string
  vendor: string
  sender: string
  receivedDate: string
  amount: number
  driveLink: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid'
  transactionId?: string
}

// Read invoices via a webhook that reads Google Sheet
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const { data } = await axios.get('/webhook/get-invoices', {
      headers: { 'ngrok-skip-browser-warning': '1' }
    })
    if (Array.isArray(data)) {
      return data.map((row: Record<string, string>) => ({
        invoiceId: row['Invoice ID'] || row.invoiceId || '',
        vendor: row['Vendor'] || row.vendor || '',
        sender: row['Sender'] || row.sender || '',
        receivedDate: row['Received Date'] || row.receivedDate || '',
        amount: parseFloat(row['Amount'] || row.amount || '0'),
        driveLink: row['Drive Link'] || row.driveLink || '',
        status: (row['Status'] || row.status || 'Pending') as Invoice['status'],
        transactionId: row['Transaction ID'] || row.transactionId || undefined,
      }))
    }
    console.warn('[invoices.ts] Webhook returned success, but data is NOT an array:', data)
    return []
  } catch (err: unknown) {
    console.error('[invoices.ts] Webhook call failed with error:', err)
    if (axios.isAxiosError(err)) {
      console.error('[invoices.ts] Axios Error Details:', err.response?.status, err.response?.data)
    }
    // Return mock data when webhook not available
    return getMockInvoices()
  }
}

// Mock data for development/demo
export const getMockInvoices = (): Invoice[] => [
  {
    invoiceId: 'INV-001',
    vendor: 'Example Corp',
    sender: 'vendor@example.com',
    receivedDate: '2026-03-25',
    amount: 1500.00,
    driveLink: 'https://drive.google.com/file/d/sample1',
    status: 'Pending',
  },
  {
    invoiceId: 'INV-002',
    vendor: 'Supplier Inc',
    sender: 'supplier@company.com',
    receivedDate: '2026-03-24',
    amount: 3200.50,
    driveLink: 'https://drive.google.com/file/d/sample2',
    status: 'Approved',
  },
  {
    invoiceId: 'INV-003',
    vendor: 'Contractor Ltd',
    sender: 'contractor@firm.com',
    receivedDate: '2026-03-23',
    amount: 850.00,
    driveLink: 'https://drive.google.com/file/d/sample3',
    status: 'Paid',
    transactionId: 'TXN-1742860000000',
  },
  {
    invoiceId: 'INV-004',
    vendor: 'Service Provider',
    sender: 'service@provider.io',
    receivedDate: '2026-03-22',
    amount: 420.75,
    driveLink: 'https://drive.google.com/file/d/sample4',
    status: 'Rejected',
  },
  {
    invoiceId: 'INV-005',
    vendor: 'Billing Agency',
    sender: 'billing@agency.net',
    receivedDate: '2026-03-28',
    amount: 2100.00,
    driveLink: 'https://drive.google.com/file/d/sample5',
    status: 'Pending',
  },
  {
    invoiceId: 'INV-006',
    vendor: 'Partner Co',
    sender: 'accounts@partner.co',
    receivedDate: '2026-03-27',
    amount: 750.25,
    driveLink: 'https://drive.google.com/file/d/sample6',
    status: 'Paid',
    transactionId: 'TXN-1742950000000',
  },
]
