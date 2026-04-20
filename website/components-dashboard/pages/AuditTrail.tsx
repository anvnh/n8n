import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { format } from 'date-fns'

interface AuditLog {
  id: number
  user_id: number | null
  user_name: string | null
  action: string
  target_type: string | null
  target_id: string | null
  details: Record<string, any> | null
  created_at: string
}

const POSTGREST = process.env.NEXT_PUBLIC_POSTGREST_BASE_URL || 'http://localhost:3000'

const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  const { data } = await axios.get(`${POSTGREST}/audit_logs?order=created_at.desc&limit=200`)
  return data
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  login:        { label: 'Login',        color: '#3b82f6' },
  create_user:  { label: 'Create User',  color: '#10b981' },
  update_user:  { label: 'Update User',  color: '#f59e0b' },
  delete_user:  { label: 'Delete User',  color: '#ef4444' },
  approve:      { label: 'Approve',      color: '#10b981' },
  reject:       { label: 'Reject',       color: '#ef4444' },
}

function getActionInfo(action: string) {
  return ACTION_LABELS[action] || { label: action, color: '#71717a' }
}

export default function AuditTrail() {
  const { data: logs = [], isLoading } = useQuery({ queryKey: ['audit_logs'], queryFn: fetchAuditLogs })
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const actions = ['all', ...new Set(logs.map((l) => l.action))]

  const filtered = logs.filter((log) => {
    const matchAction = actionFilter === 'all' || log.action === actionFilter
    const matchSearch = searchQuery === '' ||
      (log.user_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.target_type || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchAction && matchSearch
  })

  return (
    <div>
      <div className="page-header">
        <h1>Audit Trail</h1>
        <p>Track all system activities and user actions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-4 mb-24">
        <div className="card">
          <div className="card-title">Total Events</div>
          <div className="card-value">{logs.length}</div>
        </div>
        <div className="card">
          <div className="card-title">Today</div>
          <div className="card-value">
            {logs.filter((l) => {
              const today = new Date().toDateString()
              return new Date(l.created_at).toDateString() === today
            }).length}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Unique Users</div>
          <div className="card-value">{new Set(logs.map((l) => l.user_id)).size}</div>
        </div>
        <div className="card">
          <div className="card-title">Action Types</div>
          <div className="card-value">{new Set(logs.map((l) => l.action)).size}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-8 mb-24" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
        {actions.map((a) => (
          <button
            key={a}
            className={actionFilter === a ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
            onClick={() => setActionFilter(a)}
          >
            {a === 'all' ? 'All' : getActionInfo(a).label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="filter-bar" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <div className="search-wrap">
            <input
              className="input search-input"
              style={{ paddingLeft: 14 }}
              placeholder="Search by user, action, or target…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted">
            {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {isLoading ? (
          <div className="spinner-wrap"><div className="spinner" /><span>Loading audit logs…</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No audit events found.</p>
          </div>
        ) : (
          <div className="audit-timeline">
            {filtered.map((log) => {
              const info = getActionInfo(log.action)
              return (
                <div key={log.id} className="audit-item">
                  <div className="audit-dot" style={{ background: info.color }} />
                  <div className="audit-content">
                    <div className="audit-header">
                      <span className="audit-action" style={{ color: info.color }}>
                        {info.label}
                      </span>
                      <span className="audit-time">
                        {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                      </span>
                    </div>
                    <div className="audit-desc">
                      <span className="font-semibold">{log.user_name || 'System'}</span>
                      {' performed '}
                      <span className="font-semibold">{info.label.toLowerCase()}</span>
                      {log.target_type && (
                        <>
                          {' on '}
                          <span className="text-muted">{log.target_type}</span>
                          {log.target_id && <span className="text-muted"> #{log.target_id}</span>}
                        </>
                      )}
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="audit-details">
                        {Object.entries(log.details).map(([key, val]) => (
                          <span key={key} className="audit-detail-tag">
                            {key}: {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
