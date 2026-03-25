import { useQuery } from '@tanstack/react-query'
import { getExecutions } from '../api/executions'
import type { Execution } from '../api/executions'

export const useExecutions = (params?: { workflowId?: string; status?: string; limit?: number }) => {
  return useQuery<Execution[]>({
    queryKey: ['executions', params],
    queryFn: () => getExecutions(params),
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: 1,
  })
}
