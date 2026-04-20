import axios from 'axios'

export interface ErrorLog {
  id: string | number
  invoice_id?: string
  error_message: string
  created_at: string
}

export const getErrorLogs = async (): Promise<ErrorLog[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_POSTGREST_BASE_URL || 'http://localhost:3000'
    // Ensure we encode space in the URL, but the user named it "error logs". In PostgreSQL it's usually "error_logs".
    // I'll query what the user exactly asked or fallback. They wrote "error logs". I'll use "error_logs" as it's standard syntax or "error logs" encoded.
    const { data } = await axios.get(`${baseUrl}/error_logs`)
    return data
  } catch (err) {
    console.error('[errorLogs.ts] PostgREST call failed', err)
    return []
  }
}
