import { useLocation } from 'react-router-dom'

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/invoices': 'Invoices',
  '/workflows': 'Workflows',
  '/reports': 'Reports',
  '/logs': 'Logs',
}

export default function Topbar() {
  const location = useLocation()
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
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: 'white',
          }}
        >
          A
        </div>
      </div>
    </header>
  )
}
