import { useQuery } from '@tanstack/react-query'
import { getErrorLogs } from '../api/errorLogs'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

export default function ErrorLogs() {
  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ['error_logs'],
    queryFn: getErrorLogs,
  })

  return (
    <div>
      <div className="page-header">
        <h1>Error Logs</h1>
        <p>System tracking issues and payment errors</p>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {isLoading ? (
          <div className="spinner-wrap"><div className="spinner" /><span>Loading error logs…</span></div>
        ) : error ? (
          <div style={{ padding: 20 }}>
            <div className="error-state">Failed to fetch error logs from Postgres.</div>
          </div>
        ) : null}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Invoice ID</th>
                <th>Error Message</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? logs.map((log) => (
                <tr key={log.id}>
                  <td className="font-semibold text-accent">{log.id}</td>
                  <td>
                    {log.invoice_id ? (
                      <Link to={`/invoices/${log.invoice_id}`} className="font-bold underline">
                        {log.invoice_id}
                      </Link>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="text-sm" style={{ color: '#ef4444', fontWeight: 500 }}>
                    {log.error_message}
                  </td>
                  <td className="text-sm text-muted">
                    {log.created_at ? format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss') : '—'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="table-empty">
                    <p>No error logs found. The system is healthy.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
