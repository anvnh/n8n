// Application route constants

export const ROUTES = {
  DASHBOARD: '/',
  INVOICES: '/invoices',
  INVOICE_DETAIL: '/invoices/:id',
  VENDORS: '/vendors',
  REPORTS: '/reports',
  ERROR_LOGS: '/error-logs',
} as const

export const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/invoices': 'Invoices',
  '/vendors': 'Vendors',
  '/reports': 'Reports',
  '/error-logs': 'Error Logs',
}
