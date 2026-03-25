import { useQuery } from '@tanstack/react-query'
import { getWorkflows } from '../api/workflows'
import type { Workflow } from '../api/workflows'

export const useWorkflows = () => {
  return useQuery<Workflow[]>({
    queryKey: ['workflows'],
    queryFn: getWorkflows,
    staleTime: 30_000,
    retry: 1,
  })
}
