import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { signupApi } from '../api/auth'
import { getRoleLabel } from '../auth/types'

const DEMO_ACCOUNTS = [
  { email: 'super@demo.com', password: 'super123', role: 'super_admin' as const, name: 'Nguyễn Văn Anh' },
  { email: 'admin@demo.com', password: 'admin123', role: 'admin' as const, name: 'Trần Minh Tuấn' },
  { email: 'client@demo.com', password: 'client123', role: 'user' as const, name: 'Lê Thị Hoa' },
]

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          setError('Mật khẩu không khớp.')
          setLoading(false)
          return
        }
        await signupApi({ name, email, password })
      }
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
            <h1 className="login-title">{isSignup ? 'Create account' : 'Welcome back'}</h1>
            <p className="login-subtitle">
              {isSignup ? 'Sign up to access the Invoice Dashboard' : 'Sign in to access the Invoice Dashboard'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {isSignup && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  className="input form-input"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
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
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />
            </div>
            {isSignup && (
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="input form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading || !email || !password || (isSignup && !name)}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  {isSignup ? 'Creating…' : 'Signing in…'}
                </>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>{isSignup ? 'Already have an account?' : 'Need an account?'}</span>
          </div>
          <button
            type="button"
            className="btn btn-ghost login-btn"
            onClick={() => {
              setIsSignup((prev) => !prev)
              setError('')
            }}
          >
            {isSignup ? 'Back to Sign In' : 'Create new account'}
          </button>

        </div>

        <div className="login-footer">
          <p>n8n Invoice Dashboard • Powered by PostgreSQL & PostgREST</p>
        </div>
      </div>
    </div>
  )
}
