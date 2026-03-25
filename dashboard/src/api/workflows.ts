import n8nClient from './n8nClient'
import axios from 'axios'

export interface Workflow {
  id: string
  name: string
  active: boolean
  createdAt: string
  updatedAt: string
  tags: { name: string }[]
}

export const getWorkflows = async (): Promise<Workflow[]> => {
  const { data } = await n8nClient.get('/api/v1/workflows')
  return data.data || []
}

export const getWorkflow = async (id: string): Promise<Workflow> => {
  const { data } = await n8nClient.get(`/api/v1/workflows/${id}`)
  return data
}

export const toggleWorkflow = async (id: string, active: boolean): Promise<Workflow> => {
  if (active) {
    const { data } = await n8nClient.post(`/api/v1/workflows/${id}/activate`)
    return data
  } else {
    const { data } = await n8nClient.post(`/api/v1/workflows/${id}/deactivate`)
    return data
  }
}

export const triggerWorkflow = async (webhookPath: string, payload?: object): Promise<unknown> => {
  const { data } = await axios.post(`/webhook/${webhookPath}`, payload || {}, {
    headers: { 'ngrok-skip-browser-warning': '1' }
  })
  return data
}
