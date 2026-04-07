// Invoice status constants and color mappings

export const STATUS_COLORS = {
  Pending: {
    bg: '#fdfdfd',
    text: '#52525b',
    border: '#d4d4d8',
    label: 'Pending Review',
  },
  Approved: {
    bg: '#fafafa',
    text: '#18181b',
    border: '#a1a1aa',
    label: 'Approved',
  },
  Rejected: {
    bg: '#000000',
    text: '#ffffff',
    border: '#000000',
    label: 'Rejected',
  },
  Paid: {
    bg: '#f4f4f5',
    text: '#000000',
    border: '#d4d4d8',
    label: 'Payment Completed',
  },
} as const

export const STATUS_ORDER = ['Pending', 'Approved', 'Rejected', 'Paid'] as const

export type StatusKey = keyof typeof STATUS_COLORS
