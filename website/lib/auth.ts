import jwt from 'jsonwebtoken'
import { config } from './db'

export function verifyToken(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized')
  }

  const token = authHeader.substring(7)
  return jwt.verify(token, config.jwtSecret) as any
}
