import { useState } from 'react'
import { useWorkflows } from '../hooks/useWorkflows'
import { toggleWorkflow, triggerWorkflow } from '../api/workflows'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'

const TRIGGER_PATHS: Record<string, string> = {
  'Workflow 5-6': 'trigger-weekly-report',
  'Workflow 1': 'trigger-wf1',
  'Workflow 2': 'trigger-wf2',
  'Workflow 3': 'trigger-wf3',
  'Workflow 4': 'trigger-wf4',
}

export default function Workflows() {
  const { data: workflows = [], isLoading, error } = useWorkflows()
  const qc = useQueryClient()
  const [toggling, setToggling] = useState<string | null>(null)
  const [triggering, setTriggering] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  const doToggle = async (id: string, currentActive: boolean) => {
    setToggling(id)
    try {
      await toggleWorkflow(id, !currentActive)
      qc.invalidateQueries({ queryKey: ['workflows'] })
      setFeedback((f) => ({ ...f, [id]: `Workflow ${!currentActive ? 'activated' : 'deactivated'}.` }))
    } catch {
      setFeedback((f) => ({ ...f, [id]: 'Failed — check n8n connection.' }))
    } finally {
      setToggling(null)
    }
  }

  const doTrigger = async (id: string, name: string) => {
    setTriggering(id)
    const path = TRIGGER_PATHS[name] || `trigger-${id}`
    try {
      await triggerWorkflow(path)
      setFeedback((f) => ({ ...f, [id]: '✅ Workflow triggered successfully!' }))
    } catch {
      setFeedback((f) => ({ ...f, [id]: '❌ Trigger failed — add a webhook trigger node in n8n.' }))
    } finally {
      setTriggering(null)
    }
  }

  // Merge with mock if API returns empty
  const displayWorkflows = workflows.length > 0 ? workflows : [
    { id: 'kbiLZPcUNfpIeQqH', name: 'Workflow 5-6 (Payment + Report)', active: false, updatedAt: '2026-03-20T14:50:16Z', createdAt: '2026-03-19T16:14:04Z', tags: [] },
    { id: 'MtJRrBHM56sP8S6I', name: 'Invoice Intake', active: false, updatedAt: '2026-03-18T09:00:00Z', createdAt: '2026-03-15T10:00:00Z', tags: [] },
    { id: 'Tsbq2M7v1pboOkpq', name: 'Invoice Approval', active: false, updatedAt: '2026-03-18T09:00:00Z', createdAt: '2026-03-15T10:00:00Z', tags: [] },
    { id: 'Vc9p8xlwHuMX9Hzj', name: 'Payment Processing', active: false, updatedAt: '2026-03-18T09:00:00Z', createdAt: '2026-03-15T10:00:00Z', tags: [] },
    { id: 'aDd7rzeCGIpHSc2X', name: 'Weekly Report Generator', active: false, updatedAt: '2026-03-20T14:00:00Z', createdAt: '2026-03-15T10:00:00Z', tags: [] },
  ]

  return (
    <div>
      <div className="page-header">
        <h1>Workflows</h1>
        <p>Manage and trigger your n8n automation workflows</p>
      </div>

      {error && (
        <div className="error-state mb-16">⚠️ Could not reach n8n — showing local workflow definitions.</div>
      )}

      <div className="grid grid-3" style={{ gap: 16 }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card">
              <div className="shimmer" style={{ width: '60%' }} />
              <div className="shimmer" style={{ width: '40%' }} />
              <div className="shimmer" style={{ width: '80%' }} />
            </div>
          ))
          : displayWorkflows.map((wf) => (
            <div key={wf.id} className="workflow-card">
              <div className="workflow-card-header">
                <div>
                  <div className="workflow-card-name">{wf.name}</div>
                  <div className="workflow-card-meta">ID: {wf.id.slice(0, 12)}…</div>
                </div>
                <label className="toggle" title={wf.active ? 'Deactivate' : 'Activate'}>
                  <input
                    type="checkbox"
                    checked={wf.active}
                    onChange={() => doToggle(wf.id, wf.active)}
                    disabled={toggling === wf.id}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="flex gap-8 mt-8">
                <span className={`badge badge-${wf.active ? 'active' : 'inactive'}`}>
                  {wf.active ? '● Active' : '○ Inactive'}
                </span>
              </div>

              <div className="text-xs text-muted mt-8">
                Last modified: {format(new Date(wf.updatedAt), 'MMM d, yyyy HH:mm')}
              </div>

              {feedback[wf.id] && (
                <div className="text-xs mt-8" style={{ color: feedback[wf.id].startsWith('✅') ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                  {feedback[wf.id]}
                </div>
              )}

              <div className="workflow-card-footer">
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => doTrigger(wf.id, wf.name)}
                  disabled={triggering === wf.id}
                >
                  {triggering === wf.id ? '⏳ Running…' : '▶ Trigger Now'}
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="card mt-24">
        <div className="card-title">Quick Reference</div>
        <div className="grid grid-2" style={{ gap: 12 }}>
          <div style={{ padding: 14, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div className="text-sm font-semibold mb-8">REST API (read data)</div>
            <div className="text-xs text-muted" style={{ fontFamily: 'monospace', lineHeight: 2 }}>
              GET /api/v1/workflows<br />
              GET /api/v1/executions<br />
              POST /api/v1/workflows/:id/activate
            </div>
          </div>
          <div style={{ padding: 14, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div className="text-sm font-semibold mb-8">Webhooks (actions)</div>
            <div className="text-xs text-muted" style={{ fontFamily: 'monospace', lineHeight: 2 }}>
              POST /webhook/approve-invoice<br />
              POST /webhook/trigger-workflow<br />
              POST /webhook/get-invoices
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
