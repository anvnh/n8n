import { useState } from 'react'

interface SystemSettings {
  autoApprovalThreshold: number
  emailNotifications: boolean
  slackNotifications: boolean
  maxInvoiceAmount: number
  requireDoubleApproval: boolean
  sessionTimeout: number
  maintenanceMode: boolean
}

const DEFAULT_SETTINGS: SystemSettings = {
  autoApprovalThreshold: 500,
  emailNotifications: true,
  slackNotifications: false,
  maxInvoiceAmount: 100000,
  requireDoubleApproval: false,
  sessionTimeout: 24,
  maintenanceMode: false,
}

export default function Settings() {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const stored = localStorage.getItem('system_settings')
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      localStorage.setItem('system_settings', JSON.stringify(settings))
      setFeedback({ type: 'success', msg: 'Settings saved successfully.' })
      setSaving(false)
      setTimeout(() => setFeedback(null), 3000)
    }, 500)
  }

  const handleReset = () => {
    if (!confirm('Reset all settings to default values?')) return
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem('system_settings')
    setFeedback({ type: 'success', msg: 'Settings reset to defaults.' })
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h1>Settings</h1>
            <p>System configuration and preferences</p>
          </div>
          <div className="flex gap-8">
            <button className="btn btn-ghost" onClick={handleReset}>Reset to Defaults</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={feedback.type === 'success' ? 'feedback-success' : 'error-state'} style={{ marginBottom: 20 }}>
          {feedback.msg}
        </div>
      )}

      {/* Invoice Processing */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">Invoice Processing</h2>
          <p className="text-sm text-muted">Configure how invoices are processed and approved</p>
        </div>

        <div className="settings-group">
          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Auto-Approval Threshold</div>
              <div className="settings-item-desc">Invoices below this amount will be auto-approved if matching a rule</div>
            </div>
            <div className="settings-item-control">
              <div className="flex gap-8" style={{ alignItems: 'center' }}>
                <span className="text-sm text-muted">$</span>
                <input
                  type="number"
                  className="input"
                  style={{ width: 120 }}
                  value={settings.autoApprovalThreshold}
                  onChange={(e) => updateSetting('autoApprovalThreshold', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Max Invoice Amount</div>
              <div className="settings-item-desc">Maximum allowed amount for a single invoice</div>
            </div>
            <div className="settings-item-control">
              <div className="flex gap-8" style={{ alignItems: 'center' }}>
                <span className="text-sm text-muted">$</span>
                <input
                  type="number"
                  className="input"
                  style={{ width: 120 }}
                  value={settings.maxInvoiceAmount}
                  onChange={(e) => updateSetting('maxInvoiceAmount', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Require Double Approval</div>
              <div className="settings-item-desc">Require two admins to approve invoices above threshold</div>
            </div>
            <div className="settings-item-control">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.requireDoubleApproval}
                  onChange={(e) => updateSetting('requireDoubleApproval', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">Notifications</h2>
          <p className="text-sm text-muted">Configure notification channels</p>
        </div>

        <div className="settings-group">
          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Email Notifications</div>
              <div className="settings-item-desc">Send email alerts for invoice approvals and rejections</div>
            </div>
            <div className="settings-item-control">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Slack Notifications</div>
              <div className="settings-item-desc">Send notifications to Slack channel</div>
            </div>
            <div className="settings-item-control">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.slackNotifications}
                  onChange={(e) => updateSetting('slackNotifications', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">Security</h2>
          <p className="text-sm text-muted">Security and session settings</p>
        </div>

        <div className="settings-group">
          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Session Timeout</div>
              <div className="settings-item-desc">Auto-logout after inactivity (hours)</div>
            </div>
            <div className="settings-item-control">
              <div className="flex gap-8" style={{ alignItems: 'center' }}>
                <input
                  type="number"
                  className="input"
                  style={{ width: 80 }}
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value) || 1)}
                  min={1}
                  max={168}
                />
                <span className="text-sm text-muted">hours</span>
              </div>
            </div>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Maintenance Mode</div>
              <div className="settings-item-desc">Disable access for non-admin users during maintenance</div>
            </div>
            <div className="settings-item-control">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">System Information</h2>
        </div>
        <div className="settings-group">
          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Version</div>
            </div>
            <div className="settings-item-control text-sm text-muted">v2.0.0</div>
          </div>
          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Database</div>
            </div>
            <div className="settings-item-control text-sm text-muted">PostgreSQL 16</div>
          </div>
          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">API</div>
            </div>
            <div className="settings-item-control text-sm text-muted">PostgREST + Auth API</div>
          </div>
        </div>
      </div>
    </div>
  )
}
