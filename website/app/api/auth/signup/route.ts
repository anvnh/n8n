import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { pool } from '../../../../lib/db'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail])
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, 'client') RETURNING id, email, name, role, is_active, created_at`,
      [normalizedEmail, passwordHash, name]
    )

    return NextResponse.json({ user: result.rows[0] }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
