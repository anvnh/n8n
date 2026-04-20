import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface AutoRule {
  id: number
  name: string
  description: string | null
  rule_type: 'auto_approve' | 'auto_reject' | 'auto_flag'
  conditions: Record<string, any>
  is_active: boolean
  created_by: number | null
  created_at: string
  updated_at: string
}

const POSTGREST = process.env.NEXT_PUBLIC_POSTGREST_BASE_URL || 'http://localhost:3000'

const fetchRules = async (): Promise<AutoRule[]> => {
  const { data } = await axios.get(`${POSTGREST}/auto_rules?order=created_at.desc`)
  return data
}

const RULE_TYPE_LABELS: Record<string, string> = {
  auto_approve: 'Auto Approve',
  auto_reject: 'Auto Reject',
  auto_flag: 'Auto Flag',
}

export default function AutomationRules() {
  const qc = useQueryClient()
  const { data: rules = [], isLoading } = useQuery({ queryKey: ['auto_rules'], queryFn: fetchRules })
  const [showModal, setShowModal] = useState(false)
  const [editRule, setEditRule] = useState<AutoRule | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Form state
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formType, setFormType] = useState<AutoRule['rule_type']>('auto_approve')
  const [formMaxAmount, setFormMaxAmount] = useState('')
  const [formVendor, setFormVendor] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)

  const clearFeedback = () => setTimeout(() => setFeedback(null), 4000)

  const openCreateModal = () => {
    setEditRule(null)
    setFormName('')
    setFormDesc('')
    setFormType('auto_approve')
    setFormMaxAmount('')
    setFormVendor('')
    setShowModal(true)
  }

  const openEditModal = (rule: AutoRule) => {
    setEditRule(rule)
    setFormName(rule.name)
    setFormDesc(rule.description || '')
    setFormType(rule.rule_type)
    setFormMaxAmount(rule.conditions?.max_amount?.toString() || '')
    setFormVendor(rule.conditions?.vendor || '')
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitting(true)
    const conditions: Record<string, any> = {}
    if (formMaxAmount) conditions.max_amount = parseFloat(formMaxAmount)
    if (formVendor) conditions.vendor = formVendor

    try {
      if (editRule) {
        await axios.patch(`${POSTGREST}/auto_rules?id=eq.${editRule.id}`, {
          name: formName,
          description: formDesc || null,
          rule_type: formType,
          conditions,
          updated_at: new Date().toISOString(),
        })
        setFeedback({ type: 'success', msg: `Rule "${formName}" updated.` })
      } else {
        await axios.post(`${POSTGREST}/auto_rules`, {
          name: formName,
          description: formDesc || null,
          rule_type: formType,
          conditions,
        })
        setFeedback({ type: 'success', msg: `Rule "${formName}" created.` })
      }
      setShowModal(false)
      qc.invalidateQueries({ queryKey: ['auto_rules'] })
      clearFeedback()
    } catch {
      setFeedback({ type: 'error', msg: 'Failed to save rule.' })
      clearFeedback()
    } finally {
      setFormSubmitting(false)
    }
  }

  const toggleActive = async (rule: AutoRule) => {
    try {
      await axios.patch(`${POSTGREST}/auto_rules?id=eq.${rule.id}`, {
        is_active: !rule.is_active,
        updated_at: new Date().toISOString(),
      })
      setFeedback({ type: 'success', msg: `Rule "${rule.name}" ${rule.is_active ? 'disabled' : 'enabled'}.` })
      qc.invalidateQueries({ queryKey: ['auto_rules'] })
      clearFeedback()
    } catch {
      setFeedback({ type: 'error', msg: 'Failed to toggle rule.' })
      clearFeedback()
    }
  }

  const deleteRule = async (rule: AutoRule) => {
    if (!confirm(`Delete rule "${rule.name}"?`)) return
    try {
      await axios.delete(`${POSTGREST}/auto_rules?id=eq.${rule.id}`)
      setFeedback({ type: 'success', msg: `Rule "${rule.name}" deleted.` })
      qc.invalidateQueries({ queryKey: ['auto_rules'] })
      clearFeedback()
    } catch {
      setFeedback({ type: 'error', msg: 'Failed to delete rule.' })
      clearFeedback()
    }
  }

  const activeCount = rules.filter((r) => r.is_active).length

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1>Automation Rules</h1>
            <p>Configure automatic invoice processing rules</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + New Rule
          </button>
        </div>
      </div>

      {feedback && (
        <div className={feedback.type === 'success' ? 'feedback-success' : 'error-state'} style={{ marginBottom: 16 }}>
          {feedback.msg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-3 mb-24">
        <div className="card">
          <div className="card-title">Total Rules</div>
          <div className="card-value">{rules.length}</div>
        </div>
        <div className="card">
          <div className="card-title">Active</div>
          <div className="card-value">{activeCount}</div>
          <div className="card-sub">Currently running</div>
        </div>
        <div className="card">
          <div className="card-title">Inactive</div>
          <div className="card-value">{rules.length - activeCount}</div>
          <div className="card-sub">Paused rules</div>
        </div>
      </div>

      {isLoading ? (
        <div className="spinner-wrap"><div className="spinner" /><span>Loading rules…</span></div>
      ) : rules.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">⚡</div>
            <p>No automation rules yet.</p>
            <p className="text-sm text-muted mt-4">Create your first rule to automate invoice processing.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rules.map((rule) => (
            <div key={rule.id} className="card" style={{ padding: '20px 24px' }}>
              <div className="flex-between">
                <div style={{ flex: 1 }}>
                  <div className="flex gap-8" style={{ alignItems: 'center', marginBottom: 6 }}>
                    <span className="font-semibold" style={{ fontSize: 15 }}>{rule.name}</span>
                    <span className={`badge ${rule.is_active ? 'badge-active' : 'badge-inactive'}`}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`badge badge-role-${rule.rule_type === 'auto_approve' ? 'admin' : rule.rule_type === 'auto_reject' ? 'super_admin' : 'client'}`}>
                      {RULE_TYPE_LABELS[rule.rule_type]}
                    </span>
                  </div>
                  {rule.description && (
                    <div className="text-sm text-muted" style={{ marginBottom: 8 }}>{rule.description}</div>
                  )}
                  <div className="text-xs text-muted">
                    Conditions: {Object.entries(rule.conditions || {}).map(([k, v]) => `${k}: ${v}`).join(', ') || 'None'}
                  </div>
                </div>
                <div className="flex gap-8">
                  <label className="toggle">
                    <input type="checkbox" checked={rule.is_active} onChange={() => toggleActive(rule)} />
                    <span className="toggle-slider" />
                  </label>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(rule)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteRule(rule)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{editRule ? 'Edit Rule' : 'Create Automation Rule'}</div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Rule Name</label>
                  <input
                    className="input form-input"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="e.g. Auto approve small invoices"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    className="input form-input"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Optional description"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rule Type</label>
                  <select
                    className="select form-input"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as AutoRule['rule_type'])}
                  >
                    <option value="auto_approve">Auto Approve</option>
                    <option value="auto_reject">Auto Reject</option>
                    <option value="auto_flag">Auto Flag</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Max Amount (condition)</label>
                  <input
                    className="input form-input"
                    type="number"
                    value={formMaxAmount}
                    onChange={(e) => setFormMaxAmount(e.target.value)}
                    placeholder="e.g. 500"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Vendor Name (condition)</label>
                  <input
                    className="input form-input"
                    value={formVendor}
                    onChange={(e) => setFormVendor(e.target.value)}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving…' : (editRule ? 'Update Rule' : 'Create Rule')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
