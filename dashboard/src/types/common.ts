// Common/shared type definitions

/**
 * Generic table column definition
 */
export interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string | number
  render?: (item: T) => React.ReactNode
}

/**
 * Sort configuration
 */
export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

/**
 * Date range filter
 */
export interface DateRange {
  from: string
  to: string
}

/**
 * Select option type
 */
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}
