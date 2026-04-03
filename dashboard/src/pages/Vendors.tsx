import { useQuery } from '@tanstack/react-query'
import { getVendors } from '../api/vendors'
import { format } from 'date-fns'

export default function Vendors() {
  const { data: vendors = [], isLoading, error } = useQuery({
    queryKey: ['vendors'],
    queryFn: getVendors,
  })

  return (
    <div>
      <div className="page-header">
        <h1>Vendors</h1>
        <p>Manage list of invoice senders and suppliers</p>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {isLoading ? (
          <div className="spinner-wrap"><div className="spinner" /><span>Loading vendors…</span></div>
        ) : error ? (
          <div style={{ padding: 20 }}>
            <div className="error-state">Failed to fetch vendors.</div>
          </div>
        ) : null}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Vendor ID</th>
                <th>Name</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length > 0 ? vendors.map((v) => (
                <tr key={v.id}>
                  <td className="font-semibold text-accent">{v.id}</td>
                  <td>{v.name}</td>
                  <td className="text-sm text-muted">
                    {v.created_at ? format(new Date(v.created_at), 'MMM d, yyyy HH:mm') : '—'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="table-empty">
                    <p>No vendors found.</p>
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
