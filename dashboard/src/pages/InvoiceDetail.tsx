import { useParams, useNavigate } from 'react-router-dom'
import { useInvoices } from '../hooks/useInvoices'
import { approveInvoice, rejectInvoice } from '../api/webhooks'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { data: invoices = [] } = useInvoices()
  const invoice = invoices.find((i) => i.invoiceId === id)
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  if (!invoice) {
    return (
      <div>
        <button className="btn btn-ghost btn-sm mb-16" onClick={() => navigate(-1)}>← Back</button>
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ color: 'var(--text-muted)' }}>Invoice <strong>{id}</strong> not found.</p>
        </div>
      </div>
    )
  }

  const doAction = async (action: 'approve' | 'reject') => {
    setLoading(action)
    setFeedback(null)
    try {
      if (action === 'approve') await approveInvoice(invoice.invoiceId)
      else await rejectInvoice(invoice.invoiceId)
      setFeedback(`Invoice ${action}d. n8n workflow triggered.`)
      setTimeout(() => { qc.invalidateQueries({ queryKey: ['invoices'] }); navigate('/invoices') }, 1500)
    } catch {
      setFeedback(`Failed — check n8n webhook at /webhook/approve-invoice`)
    } finally {
      setLoading(null)
    }
  }

  const statusCls = { Pending: 'badge-pending', Approved: 'badge-approved', Rejected: 'badge-rejected', Paid: 'badge-paid' }

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-16" onClick={() => navigate(-1)}>← Back to Invoices</button>

      <div className="page-header">
        <h1>{invoice.invoiceId}</h1>
        <p>Invoice detail view</p>
      </div>

      {feedback && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
          {feedback}
        </div>
      )}

      <div className="grid grid-2">
        {/* Main info */}
        <div className="card">
          <div className="card-title">Invoice Information</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Invoice ID', value: invoice.invoiceId },
              { label: 'Sender Email', value: invoice.sender },
              { label: 'Received Date', value: invoice.receivedDate },
              { label: 'Amount', value: `$${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              { label: 'Priority', value: invoice.priority || 'Normal' },
              { label: 'Payment Date', value: invoice.paymentDate || '—' },
              { label: 'Transaction ID', value: invoice.transactionId || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
                <span className="text-muted text-sm">{label}</span>
                <span className="font-semibold text-sm">{value}</span>
              </div>
            ))}
            
            <div className="card-title mt-16 mb-8" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>Banking Info</div>
            {[
              { label: 'Bank Name', value: invoice.bankName || '—' },
              { label: 'Bank Code', value: invoice.bankCode || '—' },
              { label: 'Account Name', value: invoice.accountName || '—' },
              { label: 'Account #', value: invoice.accountNumber || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                <span className="text-muted text-sm">{label}</span>
                <span className="font-semibold text-sm">{value}</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span className="text-muted text-sm">Status</span>
              <span className={`badge ${statusCls[invoice.status]}`}>{invoice.status}</span>
            </div>
          </div>
        </div>

        {/* Attachment + Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-title">File Attachment</div>
            {invoice.driveLink ? (
              <div>
                <div style={{
                  background: 'var(--bg-primary)', border: '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)', padding: '32px', textAlign: 'center',
                  marginBottom: 16,
                }}>
                  <div className="text-muted text-sm">Invoice document on Google Drive</div>
                </div>
                <a href={invoice.driveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Open in Google Drive
                </a>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No attachment found</div>
            )}
          </div>

          {invoice.status === 'Pending' && (
            <div className="card">
              <div className="card-title">Actions</div>
              <p className="text-sm text-muted mb-16">
                Approving will trigger the n8n flow to process payment and send confirmation email.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  className="btn btn-success"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => doAction('approve')}
                  disabled={!!loading}
                >
                  {loading === 'approve' ? 'Processing…' : 'Approve Invoice'}
                </button>
                <button
                  className="btn btn-danger"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => doAction('reject')}
                  disabled={!!loading}
                >
                  {loading === 'reject' ? 'Processing…' : 'Reject Invoice'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
