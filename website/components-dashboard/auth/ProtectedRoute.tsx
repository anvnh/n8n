import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { UserRole } from './types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, systemSettings, settingsLoading } = useAuth()

  if (isLoading || settingsLoading) {
    return (
      <div className="spinner-wrap" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    )
  }
  if (systemSettings.maintenanceMode && user?.role && !['super_admin', 'admin'].includes(user.role)) {
    return (
      <div className="empty-state" style={{ minHeight: '100vh' }}>
        <div className="empty-icon">🛠️</div>
        <h2>Maintenance mode</h2>
        <p>System is under maintenance. Please try again later.</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
