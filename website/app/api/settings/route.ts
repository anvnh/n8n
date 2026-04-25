import { NextResponse } from 'next/server'
import { pool } from '../../../lib/db'
import { verifyToken } from '../../../lib/auth'

const DEFAULT_SETTINGS = {
  autoApprovalThreshold: 500,
  emailNotifications: true,
  slackNotifications: false,
  maxInvoiceAmount: 100000,
  requireDoubleApproval: false,
  sessionTimeout: 24,
  maintenanceMode: false,
}

const mapRowToSettings = (row: any) => ({
  autoApprovalThreshold: Number(row.auto_approval_threshold ?? DEFAULT_SETTINGS.autoApprovalThreshold),
  emailNotifications: row.email_notifications ?? DEFAULT_SETTINGS.emailNotifications,
  slackNotifications: row.slack_notifications ?? DEFAULT_SETTINGS.slackNotifications,
  maxInvoiceAmount: Number(row.max_invoice_amount ?? DEFAULT_SETTINGS.maxInvoiceAmount),
  requireDoubleApproval: row.require_double_approval ?? DEFAULT_SETTINGS.requireDoubleApproval,
  sessionTimeout: Number(row.session_timeout_hours ?? DEFAULT_SETTINGS.sessionTimeout),
  maintenanceMode: row.maintenance_mode ?? DEFAULT_SETTINGS.maintenanceMode,
})

export async function GET(req: Request) {
  try {
    verifyToken(req)
    const result = await pool.query('SELECT * FROM system_settings WHERE id = 1')
    if (result.rows.length === 0) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS })
    }
    return NextResponse.json({ settings: mapRowToSettings(result.rows[0]) })
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PUT(req: Request) {
  try {
    const userPayload = verifyToken(req) as { role: string }
    if (userPayload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()

    const values = {
      autoApprovalThreshold: Number(body.autoApprovalThreshold ?? DEFAULT_SETTINGS.autoApprovalThreshold),
      maxInvoiceAmount: Number(body.maxInvoiceAmount ?? DEFAULT_SETTINGS.maxInvoiceAmount),
      requireDoubleApproval: !!body.requireDoubleApproval,
      emailNotifications: !!body.emailNotifications,
      slackNotifications: !!body.slackNotifications,
      sessionTimeout: Number(body.sessionTimeout ?? DEFAULT_SETTINGS.sessionTimeout),
      maintenanceMode: !!body.maintenanceMode,
    }

    const result = await pool.query(
      `INSERT INTO system_settings (
        id,
        auto_approval_threshold,
        max_invoice_amount,
        require_double_approval,
        email_notifications,
        slack_notifications,
        session_timeout_hours,
        maintenance_mode,
        updated_at
      ) VALUES (1, $1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (id) DO UPDATE SET
        auto_approval_threshold = EXCLUDED.auto_approval_threshold,
        max_invoice_amount = EXCLUDED.max_invoice_amount,
        require_double_approval = EXCLUDED.require_double_approval,
        email_notifications = EXCLUDED.email_notifications,
        slack_notifications = EXCLUDED.slack_notifications,
        session_timeout_hours = EXCLUDED.session_timeout_hours,
        maintenance_mode = EXCLUDED.maintenance_mode,
        updated_at = NOW()
      RETURNING *`,
      [
        values.autoApprovalThreshold,
        values.maxInvoiceAmount,
        values.requireDoubleApproval,
        values.emailNotifications,
        values.slackNotifications,
        values.sessionTimeout,
        values.maintenanceMode,
      ]
    )

    return NextResponse.json({ settings: mapRowToSettings(result.rows[0]) })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
