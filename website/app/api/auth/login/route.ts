import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool, config } from '../../../../lib/db'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const result = await pool.query(
      'SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = result.rows[0]

    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 })
    }

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const payload = { userId: user.id, email: user.email, role: user.role, name: user.name }
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any })

    try {
      await pool.query(
        `INSERT INTO audit_logs (user_id, user_name, action, target_type, details) VALUES ($1, $2, 'login', 'user', $3)`,
        [user.id, user.name, JSON.stringify({ email: user.email })]
      )
    } catch(e) {}

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
