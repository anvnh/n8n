export const config = {
  port: parseInt(process.env.AUTH_PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET || 'n8n_invoice_jwt_secret_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'finance_db',
    user: process.env.DB_USER || 'n8n_user',
    password: process.env.DB_PASSWORD || 'n8n_password',
  },
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:4173').split(','),
}
