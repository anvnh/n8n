import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { getRoleLabel } from '../../auth/types'

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/invoices': 'Invoices',
  '/vendors': 'Vendors',
  '/reports': 'Reports',
  '/error-logs': 'Error Logs',
  '/audit-trail': 'Audit Trail',
  '/automation': 'Automation Rules',
  '/users': 'User Management',
  '/settings': 'Settings',
}

export default function Topbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const basePath = '/' + location.pathname.split('/')[1]
  const pageName = pageNames[basePath] || 'Dashboard'

  const now = new Date()
  const timeStr = now.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <div className="topbar-page-title">{pageName}</div>
          <div className="topbar-breadcrumb">n8n Admin / {pageName}</div>
        </div>
      </div>
      <div className="topbar-right">
        <span className="text-xs text-muted">{timeStr}</span>

        {/* User dropdown */}
        <div className="topbar-user" ref={dropdownRef}>
          <button
            className="topbar-user-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-user-info">
              <div className="topbar-user-name">{user?.name || 'User'}</div>
              <span className={`badge badge-role-${user?.role || 'client'}`}>
                {getRoleLabel(user?.role || 'client')}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="topbar-dropdown">
              <div className="topbar-dropdown-header">
                <div className="text-sm font-semibold">{user?.name}</div>
                <div className="text-xs text-muted">{user?.email}</div>
              </div>
              <div className="topbar-dropdown-divider" />
              <button className="topbar-dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
