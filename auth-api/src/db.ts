import { Pool } from 'pg'
import { config } from './config'

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message)
})

export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    console.log('[DB] ✅ PostgreSQL connected successfully')
    return true
  } catch (err) {
    console.error('[DB] ❌ PostgreSQL connection failed:', (err as Error).message)
    return false
  }
}
