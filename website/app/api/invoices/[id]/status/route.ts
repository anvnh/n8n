import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../../lib/auth'

type UpdateStatus = 'Approved' | 'Rejected'

const getPostgrestBaseUrl = () => {
  return (
    process.env.POSTGREST_BASE_URL ||
    process.env.NEXT_PUBLIC_POSTGREST_BASE_URL ||
    'http://localhost:3000'
  )
}

const parseJson = async (req: Request) => {
  try {
    return await req.json()
  } catch {
    return null
  }
}

const buildPatchUrl = (baseUrl: string, id: string) => {
  const url = new URL(`${baseUrl}/invoices`)
  url.searchParams.set('id', `eq.${id}`)
  url.searchParams.set('status', 'eq.Pending')
  url.searchParams.set('priority', 'eq.High')
  return url.toString()
}

const handleUpdate = async (req: Request, id?: string) => {
  if (!id) {
    return NextResponse.json({ error: 'Invoice id is required' }, { status: 400 })
  }

  try {
    const userPayload = verifyToken(req)
    if (!['super_admin', 'admin'].includes(userPayload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await parseJson(req)
  const status = payload?.status as UpdateStatus | undefined
  const reason = payload?.reason as string | undefined

  if (!status || (status !== 'Approved' && status !== 'Rejected')) {
    return NextResponse.json(
      { error: 'Status must be Approved or Rejected' },
      { status: 400 }
    )
  }

  const updateBody: Record<string, unknown> = { status }
  if (status === 'Rejected' && reason) {
    updateBody.rejection_reason = reason
  }

  const patchRes = await fetch(buildPatchUrl(getPostgrestBaseUrl(), id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(updateBody),
  })

  const raw = await patchRes.text()
  const data = raw ? JSON.parse(raw) : []

  if (!patchRes.ok) {
    return NextResponse.json(
      { error: data?.message || 'PostgREST update failed' },
      { status: patchRes.status }
    )
  }

  if (!Array.isArray(data) || data.length === 0) {
    return NextResponse.json(
      {
        error:
          'Invoice not eligible. Required: status Pending and priority High.',
      },
      { status: 409 }
    )
  }

  return NextResponse.json({ data: data[0] })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return handleUpdate(req, params?.id)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  return handleUpdate(req, params?.id)
}
