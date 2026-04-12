import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db'
import { config } from '../config'
import { requireAuth, requireRole } from '../middleware/authMiddleware'
import type { JwtPayload } from '../middleware/authMiddleware'

const router = Router()

// ─── POST /auth/login ───────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    // Find user by email
    const result = await pool.query(
      'SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const user = result.rows[0]

    if (!user.is_active) {
      res.status(403).json({ error: 'Account is deactivated. Contact administrator.' })
      return
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    // Generate JWT
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    }

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as string | number,
    } as jwt.SignOptions)

    // Log login event
    await pool.query(
      `INSERT INTO audit_logs (user_id, user_name, action, target_type, details)
       VALUES ($1, $2, 'login', 'user', $3)`,
      [user.id, user.name, JSON.stringify({ email: user.email })]
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('[AUTH] Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ─── GET /auth/me ───────────────────────────────────────────
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, is_active, created_at FROM users WHERE id = $1',
      [req.user!.userId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ user: result.rows[0] })
  } catch (err) {
    console.error('[AUTH] /me error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ─── GET /auth/users ────────────────────────────────────────
router.get('/users', requireAuth, requireRole('super_admin', 'admin'), async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
    )
    res.json({ users: result.rows })
  } catch (err) {
    console.error('[AUTH] List users error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ─── POST /auth/register ───────────────────────────────────
router.post('/register', requireAuth, requireRole('super_admin'), async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' })
      return
    }

    const validRoles = ['super_admin', 'admin', 'client']
    const userRole = role || 'client'
    if (!validRoles.includes(userRole)) {
      res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` })
      return
    }

    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()])
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Email already registered' })
      return
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, is_active, created_at`,
      [email.toLowerCase().trim(), passwordHash, name, userRole]
    )

    // Audit log
    await pool.query(
      `INSERT INTO audit_logs (user_id, user_name, action, target_type, target_id, details)
       VALUES ($1, $2, 'create_user', 'user', $3, $4)`,
      [req.user!.userId, req.user!.name, result.rows[0].id.toString(), JSON.stringify({ email, role: userRole })]
    )

    res.status(201).json({ user: result.rows[0] })
  } catch (err) {
    console.error('[AUTH] Register error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ─── PATCH /auth/users/:id ──────────────────────────────────
router.patch('/users/:id', requireAuth, requireRole('super_admin'), async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10)
    const { name, role, is_active } = req.body

    // Build dynamic update
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name)
    }
    if (role !== undefined) {
      const validRoles = ['super_admin', 'admin', 'client']
      if (!validRoles.includes(role)) {
        res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` })
        return
      }
      updates.push(`role = $${paramIndex++}`)
      values.push(role)
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`)
      values.push(is_active)
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' })
      return
    }

    updates.push(`updated_at = NOW()`)
    values.push(userId)

    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, email, name, role, is_active, created_at, updated_at`,
      values
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    // Audit log
    await pool.query(
      `INSERT INTO audit_logs (user_id, user_name, action, target_type, target_id, details)
       VALUES ($1, $2, 'update_user', 'user', $3, $4)`,
      [req.user!.userId, req.user!.name, userId.toString(), JSON.stringify(req.body)]
    )

    res.json({ user: result.rows[0] })
  } catch (err) {
    console.error('[AUTH] Update user error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ─── DELETE /auth/users/:id ─────────────────────────────────
router.delete('/users/:id', requireAuth, requireRole('super_admin'), async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10)

    // Prevent self-deletion
    if (userId === req.user!.userId) {
      res.status(400).json({ error: 'Cannot delete your own account' })
      return
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, email, name',
      [userId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    // Audit log
    await pool.query(
      `INSERT INTO audit_logs (user_id, user_name, action, target_type, target_id, details)
       VALUES ($1, $2, 'delete_user', 'user', $3, $4)`,
      [req.user!.userId, req.user!.name, userId.toString(), JSON.stringify(result.rows[0])]
    )

    res.json({ message: 'User deleted successfully', user: result.rows[0] })
  } catch (err) {
    console.error('[AUTH] Delete user error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
