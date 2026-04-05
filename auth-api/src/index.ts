import express from 'express'
import cors from 'cors'
import { config } from './config'
import { testConnection } from './db'
import authRoutes from './routes/auth'

const app = express()

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// ─── Routes ─────────────────────────────────────────────────
app.use('/auth', authRoutes)

// Health check
app.get('/health', async (_req, res) => {
  const dbOk = await testConnection()
  res.json({
    status: dbOk ? 'ok' : 'degraded',
    service: 'auth-api',
    version: '1.0.0',
    database: dbOk ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

// ─── Start server ───────────────────────────────────────────
async function start() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  n8n Auth API Service')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await testConnection()

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[AUTH] ✅ Server running on port ${config.port}`)
    console.log(`[AUTH] Health: http://localhost:${config.port}/health`)
    console.log(`[AUTH] CORS origins: ${config.corsOrigins.join(', ')}`)
  })
}

start().catch((err) => {
  console.error('[AUTH] Failed to start:', err)
  process.exit(1)
})
