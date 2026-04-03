import axios from 'axios'

export interface Vendor {
  id: string | number
  name: string
  created_at?: string
}

export const getVendors = async (): Promise<Vendor[]> => {
  try {
    const baseUrl = import.meta.env.VITE_POSTGREST_BASE_URL || 'http://localhost:3000'
    const { data } = await axios.get(`${baseUrl}/vendors`)
    return data
  } catch (err) {
    console.error('[vendors.ts] PostgREST call failed', err)
    return []
  }
}
