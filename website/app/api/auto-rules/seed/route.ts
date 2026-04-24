import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'
import { pool } from '../../../../lib/db'

export async function POST(req: Request) {
  try {
    const userPayload = verifyToken(req) as { userId: number; role: string; name?: string }
    if (!['super_admin', 'admin'].includes(userPayload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const seedRules = [
      {
        name: 'Auto approve small invoices',
        description: 'Approve invoices <= 500 when priority is High',
        rule_type: 'auto_approve',
        conditions: { max_amount: 500, priority: 'High' },
      },
      {
        name: 'Flag missing transaction',
        description: 'Flag invoices missing transaction_id after approval',
        rule_type: 'auto_flag',
        conditions: { transaction_id: 'missing' },
      },
    ]

    const inserts = await Promise.all(
      seedRules.map((rule) =>
        pool.query(
          `INSERT INTO auto_rules (name, description, rule_type, conditions, is_active, created_by)
           VALUES ($1, $2, $3, $4, true, $5)
           RETURNING id, name, rule_type`,
          [rule.name, rule.description, rule.rule_type, rule.conditions, userPayload.userId]
        )
      )
    )

    return NextResponse.json({ data: inserts.map((r) => r.rows[0]) }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
