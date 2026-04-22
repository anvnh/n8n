import { NextResponse } from 'next/server'
import { verifyToken } from '../../../lib/auth'

type UserPayload = {
  userId: number
  email: string
  role: 'super_admin' | 'admin' | 'client' | 'user'
}

const getPostgrestBaseUrl = () => {
  return (
    process.env.POSTGREST_BASE_URL ||
    process.env.NEXT_PUBLIC_POSTGREST_BASE_URL ||
    'http://localhost:3000'
  )
}

export async function GET(req: Request) {
  try {
    const payload = verifyToken(req) as UserPayload
    const url = new URL(`${getPostgrestBaseUrl()}/invoices`)

    if (payload.role === 'client' || payload.role === 'user') {
      url.searchParams.set('sender', `eq.${payload.email}`)
    }

    const res = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const raw = await res.text()
      return NextResponse.json({ error: raw || 'PostgREST error' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
