import { NavLink, useLocation } from 'react-router-dom'
import { useInvoices } from '../../hooks/useInvoices'
import { useAuth } from '../../auth/AuthContext'
import type { UserRole } from '../../auth/types'

interface NavItem {
  to: string
  label: string
  roles?: UserRole[]  // if undefined, all roles can see
}

interface NavGroup {
  group: string
  items: NavItem[]
}

const navItems: NavGroup[] = [
  {
    group: 'Main',
    items: [
      { to: '/',          label: 'Dashboard' },
      { to: '/invoices',  label: 'Invoices' },
      { to: '/vendors',   label: 'Vendors',   roles: ['super_admin', 'admin'] },
    ],
  },
  {
    group: 'Analytics & Tracking',
    items: [
      { to: '/reports',    label: 'Reports',    roles: ['super_admin', 'admin'] },
      { to: '/error-logs', label: 'Error Logs', roles: ['super_admin', 'admin'] },
    ],
  },
  {
    group: 'Administration',
    items: [
      { to: '/users',    label: 'Users',    roles: ['super_admin'] },
      { to: '/settings', label: 'Settings', roles: ['super_admin'] },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const { data: invoices } = useInvoices()
  const { user } = useAuth()
  const pendingCount = invoices?.filter((i) => i.status === 'Pending').length || 0

  const userRole = user?.role

  // Filter nav groups to only show items the user has access to
  const filteredGroups = navItems
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.roles) return true
        return userRole ? item.roles.includes(userRole) : false
      }),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="">
          <div>
            <div className="sidebar-brand-text">n8n Admin</div>
            <div className="sidebar-brand-sub">Dashboard v2.0</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {filteredGroups.map((group) => (
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
