import { Pool } from 'pg'

export const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'finance_db',
  user: process.env.DB_USER || 'n8n_user',
  password: process.env.DB_PASSWORD || 'n8n_password',
  max: 10,
})

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message)
})

export const config = {
  jwtSecret: process.env.JWT_SECRET || 'n8n_invoice_jwt_secret_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
}
