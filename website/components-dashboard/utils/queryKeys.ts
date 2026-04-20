// React Query key factory for consistent cache key management

export const queryKeys = {
  invoices: {
    all: ['invoices'] as const,
    detail: (id: string) => ['invoices', id] as const,
    filtered: (filters: Record<string, unknown>) => ['invoices', filters] as const,
  },
  vendors: {
    all: ['vendors'] as const,
    detail: (id: string | number) => ['vendors', id] as const,
  },
  errorLogs: {
    all: ['error_logs'] as const,
  },
} as const
