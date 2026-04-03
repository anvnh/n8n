import { NavLink, useLocation } from 'react-router-dom'
import { useInvoices } from '../../hooks/useInvoices'

const navItems = [
  {
    group: 'Main',
    items: [
      { to: '/',          label: 'Dashboard' },
      { to: '/invoices',  label: 'Invoices' },
      { to: '/vendors',   label: 'Vendors' },
    ],
  },
  {
    group: 'Analytics & Tracking',
    items: [
      { to: '/reports',    label: 'Reports' },
      { to: '/error-logs', label: 'Error Logs' },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const { data: invoices } = useInvoices()
  const pendingCount = invoices?.filter((i) => i.status === 'Pending').length || 0

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="">
         
          <div>
            <div className="sidebar-brand-text">n8n Admin</div>
            <div className="sidebar-brand-sub">Dashboard v1.0</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.group}>
            <div className="sidebar-section-label">{group.group}</div>
            {group.items.map((item) => {
              const isActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to)
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <span style={{ marginLeft: isActive ? '8px' : '0', transition: 'margin 0.3s ease' }}>{item.label}</span>
                  {item.to === '/invoices' && pendingCount > 0 && (
                    <span className="sidebar-nav-badge">{pendingCount}</span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        n8n via VPS
      </div>
    </aside>
  )
}
