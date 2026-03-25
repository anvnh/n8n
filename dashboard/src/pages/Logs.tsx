import { useState } from 'react'
import { useExecutions } from '../hooks/useExecutions'
import { useWorkflows } from '../hooks/useWorkflows'
import { retryExecution } from '../api/executions'
import { format } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    success: 'badge-success', error: 'badge-error',
    running: 'badge-running', waiting: 'badge-running', canceled: 'badge-inactive',
  }
  return <span className={`badge ${cls[status] || 'badge-inactive'}`}>{status}</span>
}

export default function Logs() {
  const { data: workflows = [] } = useWorkflows()
  const [wfFilter, setWfFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [retrying, setRetrying] = useState<string | null>(null)
  const qc = useQueryClient()

  const { data: executions = [], isLoading, error } = useExecutions({
    workflowId: wfFilter || undefined,
    status: statusFilter || undefined,
    limit: 50,
  })

  const doRetry = async (id: string) => {
    setRetrying(id)
    try {
      await retryExecution(id)
      qc.invalidateQueries({ queryKey: ['executions'] })
    } catch {
      alert('Retry failed — check n8n connection.')
    } finally {
      setRetrying(null)
    }
  }

  // Mock executions for demo
  const mockExecutions = [
    { id: 'ex-001', workflowId: 'kbiLZPcUNfpIeQqH', workflowData: { name: 'Workflow 5-6' }, mode: 'trigger', status: 'success' as const, startedAt: '2026-03-29T08:05:00Z', stoppedAt: '2026-03-29T08:05:12Z', finished: true },
    { id: 'ex-002', workflowId: 'kbiLZPcUNfpIeQqH', workflowData: { name: 'Workflow 5-6' }, mode: 'trigger', status: 'error' as const, startedAt: '2026-03-28T17:01:00Z', stoppedAt: '2026-03-28T17:01:05Z', finished: true, data: { resultData: { error: { message: 'Google Sheets API quota exceeded. Retry after 60 seconds.' } } } },
    { id: 'ex-003', workflowId: 'MtJRrBHM56sP8S6I', workflowData: { name: 'Invoice Intake' }, mode: 'webhook', status: 'success' as const, startedAt: '2026-03-29T14:30:00Z', stoppedAt: '2026-03-29T14:30:08Z', finished: true },
    { id: 'ex-004', workflowId: 'Tsbq2M7v1pboOkpq', workflowData: { name: 'Invoice Approval' }, mode: 'webhook', status: 'success' as const, startedAt: '2026-03-29T15:00:00Z', stoppedAt: '2026-03-29T15:00:11Z', finished: true },
    { id: 'ex-005', workflowId: 'aDd7rzeCGIpHSc2X', workflowData: { name: 'Weekly Report Generator' }, mode: 'schedule', status: 'error' as const, startedAt: '2026-03-28T17:00:00Z', stoppedAt: '2026-03-28T17:00:03Z', finished: true, data: { resultData: { error: { message: 'SMTP connection refused. Check email credentials in n8n.' } } } },
  ]

  const displayExecutions = executions.length > 0 ? executions : mockExecutions

  return (
    <div>
      <div className="page-header">
        <h1>Execution Logs</h1>
        <p>Full history of all workflow runs — filter, inspect errors, retry failures</p>
      </div>

      {error && (
        <div className="error-state mb-16">⚠️ Showing mock data — n8n not reachable.</div>
      )}

      {/* Filters */}
      <div className="filter-bar mb-24" style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <select
          className="select"
          value={wfFilter}
          onChange={(e) => setWfFilter(e.target.value)}
          style={{ minWidth: 200 }}
        >
          <option value="">All Workflows</option>
          {workflows.map((wf) => (
            <option key={wf.id} value={wf.id}>{wf.name}</option>
          ))}
          {workflows.length === 0 && mockExecutions.map((e) => (
            <option key={e.workflowId} value={e.workflowId}>{e.workflowData.name}</option>
          ))}
        </select>

        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
          <option value="running">Running</option>
          <option value="waiting">Waiting</option>
        </select>

        <span className="text-sm text-muted" style={{ marginLeft: 'auto' }}>
          {displayExecutions.length} execution{displayExecutions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {isLoading ? (
          <div className="spinner-wrap"><div className="spinner" /><span>Loading logs…</span></div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Workflow</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayExecutions.length > 0 ? displayExecutions.map((ex) => {
                  const dur = ex.stoppedAt && ex.startedAt
                    ? Math.round((new Date(ex.stoppedAt).getTime() - new Date(ex.startedAt).getTime()) / 1000) + 's'
                    : '—'
                  const hasError = ex.status === 'error' && ex.data?.resultData?.error
                  const isOpen = expanded === ex.id
                  return (
                    <>
                      <tr key={ex.id} className={ex.status === 'error' ? 'execution-row-error' : ''}>
                        <td className="text-xs text-muted" style={{ fontFamily: 'monospace' }}>{ex.id.slice(0, 8)}…</td>
                        <td className="font-semibold text-sm">{ex.workflowData?.name || `WF #${ex.workflowId.slice(0, 8)}`}</td>
                        <td><span className="badge badge-inactive" style={{ textTransform: 'capitalize' }}>{ex.mode}</span></td>
                        <td><StatusBadge status={ex.status} /></td>
                        <td className="text-sm text-muted">{format(new Date(ex.startedAt), 'MMM d, HH:mm:ss')}</td>
                        <td className="text-sm text-muted">{dur}</td>
                        <td>
                          <div className="flex gap-8">
                            {hasError && (
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setExpanded(isOpen ? null : ex.id)}
                              >
                                {isOpen ? '▲ Hide' : '▼ Error'}
                              </button>
                            )}
                            {ex.status === 'error' && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => doRetry(ex.id)}
                                disabled={retrying === ex.id}
                              >
                                {retrying === ex.id ? '⏳' : '↺ Retry'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isOpen && hasError && (
                        <tr>
                          <td colSpan={7} style={{ padding: '0 16px 16px' }}>
                            <div className="error-detail">
                              {ex.data?.resultData?.error?.message}
                              {('stack' in (ex.data?.resultData?.error ?? {})) && (
                                <div style={{ marginTop: 8, opacity: 0.7 }}>{(ex.data?.resultData?.error as {stack?: string})?.stack}</div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                }) : (
                  <tr>
                    <td colSpan={7} className="table-empty">
                      <div className="empty-icon">📋</div>
                      <p>No executions found for selected filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
