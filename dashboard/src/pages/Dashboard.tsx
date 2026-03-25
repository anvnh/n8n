import { useWorkflows } from '../hooks/useWorkflows'
import { useExecutions } from '../hooks/useExecutions'
import { useInvoices } from '../hooks/useInvoices'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

function StatCard({
  icon, label, value, sub, color,
}: { icon: string; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="card-title">{label}</div>
      <div className="card-value">{value}</div>
      {sub && <div className="card-sub">{sub}</div>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    success: 'badge badge-success', error: 'badge badge-error',
    running: 'badge badge-running', waiting: 'badge badge-running',
    canceled: 'badge badge-inactive',
  }
  return <span className={map[status] || 'badge badge-inactive'}>{status}</span>
}

export default function Dashboard() {
  const { data: workflows, isLoading: wfLoading, error: wfError } = useWorkflows()
  const { data: executions, isLoading: exLoading } = useExecutions({ limit: 5 })
  const { data: invoices } = useInvoices()

  const activeWorkflows = workflows?.filter((w) => w.active).length ?? 0
  const pendingInvoices = invoices?.filter((i) => i.status === 'Pending').length ?? 0
  const successCount = executions?.filter((e) => e.status === 'success').length ?? 0
  const errorCount = executions?.filter((e) => e.status === 'error').length ?? 0

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>System overview — n8n workflow automation hub</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-4 mb-24">
        <StatCard icon="⚡" label="Active Workflows" value={wfLoading ? '…' : activeWorkflows}
          sub={`of ${workflows?.length ?? 0} total`} color="purple" />
        <StatCard icon="🧾" label="Pending Invoices" value={pendingInvoices}
          sub="Awaiting approval" color="amber" />
        <StatCard icon="✅" label="Successful Runs" value={exLoading ? '…' : successCount}
          sub="Recent executions" color="green" />
        <StatCard icon="❌" label="Failed Runs" value={exLoading ? '…' : errorCount}
          sub="Needs attention" color="red" />
      </div>

      <div className="grid grid-2-1">
        {/* Recent Executions */}
        <div className="card">
          <div className="flex-between mb-16">
            <div className="card-title" style={{ marginBottom: 0 }}>Recent Executions</div>
            <Link to="/logs" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          {exLoading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Workflow</th>
                    <th>Status</th>
                    <th>Started</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {executions && executions.length > 0 ? (
                    executions.slice(0, 5).map((ex) => {
                      const dur = ex.stoppedAt && ex.startedAt
                        ? Math.round((new Date(ex.stoppedAt).getTime() - new Date(ex.startedAt).getTime()) / 1000)
                        : null
                      return (
                        <tr key={ex.id}>
                          <td className="font-semibold">{ex.workflowData?.name || `WF #${ex.workflowId}`}</td>
                          <td><StatusBadge status={ex.status} /></td>
                          <td className="text-sm text-muted">
                            {ex.startedAt ? format(new Date(ex.startedAt), 'MMM d, HH:mm') : '—'}
                          </td>
                          <td className="text-sm text-muted">{dur != null ? `${dur}s` : '—'}</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="table-empty">No executions found.<br />
                        <span className="text-xs">Connect n8n to see live data.</span>
                      </td>
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
              <div className="empty-icon">🎉</div>
              <p>All invoices reviewed!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {invoices?.filter((i) => i.status === 'Pending').slice(0, 4).map((inv) => (
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
                  <div className="text-accent font-bold text-sm">${inv.amount.toLocaleString()}</div>
                </Link>
              ))}
            </div>
          )}

          {/* Workflow Health */}
          <div className="divider" />
          <div className="card-title">Workflow Health</div>
          {wfError ? (
            <div className="text-xs text-muted">⚠️ n8n offline — using mock data</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(workflows?.slice(0, 5) ?? []).map((wf) => (
                <div key={wf.id} className="flex-between" style={{ fontSize: 13 }}>
                  <span className="truncate" style={{ maxWidth: 140 }}>{wf.name}</span>
                  <span className={`badge badge-${wf.active ? 'active' : 'inactive'}`} style={{ fontSize: 11 }}>
                    {wf.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
              {!wfLoading && (workflows?.length ?? 0) === 0 && (
                <span className="text-xs text-muted">No workflows found</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
