import { useState, useEffect } from 'react'
import { getUsersApi, registerUserApi, updateUserApi, deleteUserApi } from '../api/auth'
import { getRoleLabel } from '../auth/types'
import type { User, UserRole } from '../auth/types'
import { useAuth } from '../auth/AuthContext'

export default function Users() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')

  // Form state
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRole, setFormRole] = useState<UserRole>('user')
  const [formSubmitting, setFormSubmitting] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsersApi()
      setUsers(data)
    } catch {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const clearFeedback = () => setTimeout(() => setFeedback(null), 4000)

  const openCreateModal = () => {
    setEditUser(null)
    setFormName('')
    setFormEmail('')
    setFormPassword('')
    setFormRole('user')
    setShowModal(true)
  }

  const openEditModal = (user: User) => {
    setEditUser(user)
    setFormName(user.name)
    setFormEmail(user.email)
    setFormPassword('')
    setFormRole(user.role)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)
    try {
      if (editUser) {
        await updateUserApi(editUser.id, { name: formName, role: formRole })
        setFeedback({ type: 'success', msg: `User "${formName}" updated successfully.` })
      } else {
        await registerUserApi({ name: formName, email: formEmail, password: formPassword, role: formRole })
        setFeedback({ type: 'success', msg: `User "${formName}" created successfully.` })
      }
      setShowModal(false)
      fetchUsers()
      clearFeedback()
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.response?.data?.error || 'Operation failed.' })
      clearFeedback()
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleToggleActive = async (user: User) => {
    try {
      await updateUserApi(user.id, { is_active: !user.is_active })
      setFeedback({ type: 'success', msg: `User "${user.name}" ${user.is_active ? 'deactivated' : 'activated'}.` })
      fetchUsers()
      clearFeedback()
    } catch {
      setFeedback({ type: 'error', msg: 'Failed to update user status.' })
      clearFeedback()
    }
  }

  const handleToggleRole = async (user: User) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin'
    const label = nextRole === 'admin' ? 'Admin' : 'User'
    if (!confirm(`Change role of "${user.name}" to ${label}?`)) return
    try {
      await updateUserApi(user.id, { role: nextRole })
      setFeedback({ type: 'success', msg: `User "${user.name}" updated to ${label}.` })
      fetchUsers()
      clearFeedback()
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.response?.data?.error || 'Failed to update user role.' })
      clearFeedback()
    }
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete "${user.name}"? This action cannot be undone.`)) return
    try {
      await deleteUserApi(user.id)
      setFeedback({ type: 'success', msg: `User "${user.name}" deleted.` })
      fetchUsers()
      clearFeedback()
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.response?.data?.error || 'Failed to delete user.' })
      clearFeedback()
    }
  }

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const roleCounts = {
    all: users.length,
    super_admin: users.filter((u) => u.role === 'super_admin').length,
    admin: users.filter((u) => u.role === 'admin').length,
    user: users.filter((u) => u.role === 'user').length,
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1>User Management</h1>
            <p>Manage system users and their roles</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Add User
          </button>
        </div>
      </div>

      {feedback && (
        <div className={feedback.type === 'success' ? 'feedback-success' : 'error-state'} style={{ marginBottom: 16 }}>
          {feedback.msg}
        </div>
      )}

      {/* Role filter tabs */}
      <div className="flex gap-8 mb-24" style={{ flexWrap: 'wrap' }}>
        {(['all', 'super_admin', 'admin', 'user'] as const).map((r) => (
          <button
            key={r}
            className={roleFilter === r ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
            onClick={() => setRoleFilter(r)}
          >
            {r === 'all' ? 'All' : getRoleLabel(r)} <span style={{ opacity: 0.7 }}>({roleCounts[r]})</span>
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="filter-bar" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <div className="search-wrap">
            <input
              className="input search-input"
              style={{ paddingLeft: 14 }}
              placeholder="Search by name or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /><span>Loading users…</span></div>
        ) : error ? (
          <div style={{ padding: 20 }}><div className="error-state">{error}</div></div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="font-semibold">{u.name}</td>
                    <td className="text-sm text-muted">{u.email}</td>
                    <td>
                      <span className={`badge badge-role-${u.role}`}>{getRoleLabel(u.role)}</span>
                    </td>
                    <td>
                      <span className={`badge ${u.is_active ? 'badge-approved' : 'badge-rejected'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-sm text-muted">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div className="flex gap-8">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(u)}>Edit</button>
                        {currentUser?.role === 'super_admin' && u.role !== 'super_admin' && (
                          <button className="btn btn-ghost btn-sm" onClick={() => handleToggleRole(u)}>
                            {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                          </button>
                        )}
                        <button className="btn btn-ghost btn-sm" onClick={() => handleToggleActive(u)}>
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="table-empty">No users match your filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{editUser ? 'Edit User' : 'Create New User'}</div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    className="input form-input"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="Full name"
                  />
                </div>
                {!editUser && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        className="input form-input"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        required
                        placeholder="user@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input
                        className="input form-input"
                        type="password"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="Min 6 characters"
                      />
                    </div>
                  </>
                )}
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="select form-input"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving…' : (editUser ? 'Update' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
