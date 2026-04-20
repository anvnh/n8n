import { NextResponse } from 'next/server'
import { pool } from '../../../../lib/db'
import { verifyToken } from '../../../../lib/auth'

export async function GET(req: Request) {
  try {
    const userPayload = verifyToken(req)
    const result = await pool.query(
      'SELECT id, email, name, role, is_active, created_at FROM users WHERE id = $1',
      [userPayload.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user: result.rows[0] })
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
