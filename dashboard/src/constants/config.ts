// Application configuration constants

export const APP_CONFIG = {
  APP_NAME: 'n8n Admin',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Invoice automation dashboard',

  // API
  DEFAULT_PAGE_SIZE: 20,
  STALE_TIME: 30_000,
  RETRY_COUNT: 1,

  // UI
  SIDEBAR_WIDTH: 260,
  TOPBAR_HEIGHT: 64,
  TABLE_PAGE_SIZES: [10, 20, 50, 100],
  TOAST_DURATION: 5000,

  // Invoice
  INVOICE_STATUSES: ['Pending', 'Approved', 'Rejected', 'Paid'] as const,
  PRIORITY_LEVELS: ['High', 'Normal', 'Low'] as const,
} as const
