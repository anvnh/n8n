import { NextResponse } from 'next/server'
import { pool } from '../../../../../lib/db'
import { verifyToken } from '../../../../../lib/auth'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const userPayload = verifyToken(req)
    if (userPayload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { name, role, is_active } = await req.json()
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name)
    }
    if (role !== undefined) {
      updates.push(`role = $${paramIndex++}`)
      values.push(role)
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`)
      values.push(is_active)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updates.push(`updated_at = NOW()`)
    values.push(resolvedParams.id)

    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, name, role, is_active, created_at, updated_at`,
      values
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    try {
      await pool.query(
        `INSERT INTO audit_logs (user_id, user_name, action, target_type, target_id, details) VALUES ($1, $2, 'update_user', 'user', $3, $4)`,
        [userPayload.userId, userPayload.name, resolvedParams.id.toString(), JSON.stringify({ name, role, is_active })]
      )
    } catch(e) {}

    return NextResponse.json({ user: result.rows[0] })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const userPayload = verifyToken(req)
    if (userPayload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (resolvedParams.id === userPayload.userId.toString()) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, email, name', [resolvedParams.id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    try {
      await pool.query(
        `INSERT INTO audit_logs (user_id, user_name, action, target_type, target_id, details) VALUES ($1, $2, 'delete_user', 'user', $3, $4)`,
        [userPayload.userId, userPayload.name, resolvedParams.id.toString(), JSON.stringify(result.rows[0])]
      )
    } catch(e) {}

    return NextResponse.json({ message: 'User deleted successfully', user: result.rows[0] })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
