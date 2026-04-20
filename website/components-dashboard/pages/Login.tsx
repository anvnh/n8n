import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getRoleLabel } from '../auth/types'

const DEMO_ACCOUNTS = [
  { email: 'super@demo.com', password: 'super123', role: 'super_admin' as const, name: 'Nguyễn Văn Anh' },
  { email: 'admin@demo.com', password: 'admin123', role: 'admin' as const, name: 'Trần Minh Tuấn' },
  { email: 'client@demo.com', password: 'client123', role: 'client' as const, name: 'Lê Thị Hoa' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
    <div className="login-page">
      <div className="login-bg-pattern" />
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <div className="login-logo-icon">n8n</div>
            </div>
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to access the Invoice Dashboard</p>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="login-divider">
            <span>Demo Accounts</span>
          </div>
          <div className="demo-accounts">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                className="demo-account-btn"
                onClick={() => quickLogin(acc)}
              >
                <div className="demo-account-avatar">
                  {acc.name.charAt(0)}
                </div>
                <div className="demo-account-info">
                  <div className="demo-account-name">{acc.name}</div>
                  <div className="demo-account-role">
                    <span className={`badge badge-role-${acc.role}`}>{getRoleLabel(acc.role)}</span>
                  </div>
                </div>
                <div className="demo-account-arrow">→</div>
              </button>
            ))}
          </div>
        </div>

        <div className="login-footer">
          <p>n8n Invoice Dashboard • Powered by PostgreSQL & PostgREST</p>
        </div>
      </div>
    </div>
  )
}
