import { useQuery } from '@tanstack/react-query'
import { getInvoices } from '../api/invoices'
import type { Invoice } from '../api/invoices'

export const useInvoices = () => {
  return useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: getInvoices,
    staleTime: 30_000,
    retry: 1,
  })
}
