import n8nClient from './n8nClient'

export interface Execution {
  id: string
  workflowId: string
  workflowData?: { name: string }
  mode: string
  status: 'success' | 'error' | 'running' | 'waiting' | 'canceled'
  startedAt: string
  stoppedAt?: string
  finished: boolean
  data?: {
    resultData?: {
      error?: {
        message: string
        stack?: string
      }
    }
  }
}

export interface ExecutionListResponse {
  data: Execution[]
  nextCursor?: string
}

export const getExecutions = async (params?: {
  workflowId?: string
  status?: string
  limit?: number
}): Promise<Execution[]> => {
  const { data } = await n8nClient.get('/api/v1/executions', {
    params: { limit: 50, ...params },
  })
  return data.data || []
}

export const getExecutionDetail = async (id: string): Promise<Execution> => {
  const { data } = await n8nClient.get(`/api/v1/executions/${id}`)
  return data
}

export const retryExecution = async (id: string): Promise<unknown> => {
  const { data } = await n8nClient.post(`/api/v1/executions/${id}/retry`)
  return data
}

export const deleteExecution = async (id: string): Promise<void> => {
  await n8nClient.delete(`/api/v1/executions/${id}`)
}
