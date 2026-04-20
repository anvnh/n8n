import { useInvoices } from '../hooks/useInvoices'
import { useQuery } from '@tanstack/react-query'
import { getVendors } from '../api/vendors'
import { getErrorLogs } from '../api/errorLogs'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

function StatCard({
  label, value, sub
}: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card">
      <div className="card-title">{label}</div>
      <div className="card-value">{value}</div>
      {sub && <div className="card-sub">{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const { data: invoices, isLoading: invLoading } = useInvoices()
  const { data: vendors, isLoading: venLoading } = useQuery({ queryKey: ['vendors'], queryFn: getVendors })
  const { data: errorLogs, isLoading: errLoading } = useQuery({ queryKey: ['error_logs'], queryFn: getErrorLogs })

  const pendingInvoices = invoices?.filter((i) => i.status === 'Pending').length || 0
  const vendorsCount = vendors?.length || 0
  const errorLogsCount = errorLogs?.length || 0

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Finance Data overview synced from Postgres</p>
      </div>

      <div className="grid grid-4 mb-24">
        <StatCard label="Registered Vendors" value={venLoading ? '…' : vendorsCount} sub="Synced from Postgres" />
        <StatCard label="Pending Invoices" value={pendingInvoices} sub="Awaiting approval" />
        <StatCard label="Total Invoices" value={invLoading ? '…' : (invoices?.length || 0)} sub="All time record" />
        <StatCard label="System Errors" value={errLoading ? '…' : errorLogsCount} sub="Check logs for details" />
      </div>

      <div className="grid grid-2 mb-24" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
        {/* Recent Error Logs */}
        <div className="card">
          <div className="flex-between mb-16">
            <div className="card-title" style={{ marginBottom: 0 }}>Recent Error Logs</div>
            <Link to="/error-logs" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          {errLoading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Message</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {errorLogs && errorLogs.length > 0 ? (
                    errorLogs.slice(0, 5).map((log) => (
                      <tr key={log.id}>
                        <td className="font-semibold text-accent">{log.invoice_id || '—'}</td>
                        <td className="text-sm truncate" style={{ maxWidth: 200 }}>{log.error_message}</td>
                        <td className="text-sm text-muted">
                          {log.created_at ? format(new Date(log.created_at), 'MMM d, HH:mm') : '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="table-empty">No errors found. System is healthy.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Approvals quick-access */}
        <div className="card">
          <div className="flex-between mb-16">
            <div className="card-title" style={{ marginBottom: 0 }}>Pending Approvals</div>
            <Link to="/invoices" className="btn btn-ghost btn-sm">All →</Link>
          </div>
          {pendingInvoices === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>
              <p>All invoices reviewed.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {invoices?.filter((i) => i.status === 'Pending').slice(0, 6).map((inv) => (
                <Link
                  key={inv.invoiceId}
                  to={`/invoices/${inv.invoiceId}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                    transition: 'border-color .2s',
                  }}
                >
                  <div>
                    <div className="font-semibold text-sm">{inv.invoiceId}</div>
                    <div className="text-xs text-muted">{inv.sender}</div>
                  </div>
                  <div className="text-accent font-bold text-sm">
                    ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
