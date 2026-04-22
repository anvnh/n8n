import axios from 'axios'

export interface ApprovePayload {
  invoiceId: string
  action: 'approve' | 'reject'
  reason?: string
}

export const approveInvoice = async (invoiceId: string): Promise<unknown> => {
  const { data } = await axios.patch(`/api/invoices/${invoiceId}/status`, {
    status: 'Approved',
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  })
  return data
}

export const rejectInvoice = async (invoiceId: string, reason?: string): Promise<unknown> => {
  const { data } = await axios.patch(`/api/invoices/${invoiceId}/status`, {
    status: 'Rejected',
    reason: reason || 'Rejected by admin',
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  })
  return data
}

export const triggerManualWorkflow = async (workflowId: string): Promise<unknown> => {
  const { data } = await axios.post(`/webhook/trigger-workflow`, { workflowId }, {
    headers: { 'ngrok-skip-browser-warning': '1' }
  })
  return data
}
