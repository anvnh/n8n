import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { pool } from '../../../../lib/db'
import { verifyToken } from '../../../../lib/auth'

export async function POST(req: Request) {
  try {
    const userPayload = verifyToken(req)
    if (userPayload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { email, password, name, role } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 })
    }

    const validRoles = ['super_admin', 'admin', 'client', 'user']
    const incomingRole = role || 'client'
    if (!validRoles.includes(incomingRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    const userRole = incomingRole === 'user' ? 'client' : incomingRole

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()])
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, is_active, created_at`,
      [email.toLowerCase().trim(), passwordHash, name, userRole]
    )

    try {
      await pool.query(
        `INSERT INTO audit_logs (user_id, user_name, action, target_type, target_id, details) VALUES ($1, $2, 'create_user', 'user', $3, $4)`,
        [userPayload.userId, userPayload.name, result.rows[0].id.toString(), JSON.stringify({ email, role: userRole })]
      )
    } catch(e) {}

    return NextResponse.json({ user: result.rows[0] }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
