import { NextResponse } from 'next/server'
import { pool } from '../../../../lib/db'
import { verifyToken } from '../../../../lib/auth'

export async function GET(req: Request) {
  try {
    const userPayload = verifyToken(req)
    if (!['super_admin', 'admin'].includes(userPayload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await pool.query(
      'SELECT id, email, name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
    )
    return NextResponse.json({ users: result.rows })
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
