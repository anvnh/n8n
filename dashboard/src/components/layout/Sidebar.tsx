import { NavLink, useLocation } from 'react-router-dom'
import { useInvoices } from '../../hooks/useInvoices'

const navItems = [
  {
    group: 'Main',
    items: [
      { to: '/',          icon: '⊞', label: 'Dashboard' },
      { to: '/invoices',  icon: '🧾', label: 'Invoices' },
      { to: '/workflows', icon: '⚡', label: 'Workflows' },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { to: '/reports', icon: '📊', label: 'Reports' },
      { to: '/logs',    icon: '📋', label: 'Logs' },
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
        <div className="sidebar-brand-logo">
          <div className="sidebar-brand-icon">n8</div>
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
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
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
        <span className="sidebar-status-dot" />
        n8n @ localhost:5678
      </div>
    </aside>
  )
}
