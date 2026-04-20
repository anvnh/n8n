// CSV export utility functions

interface CsvColumn<T> {
  header: string
  accessor: (item: T) => string | number
}

/**
 * Generate and download a CSV file
 */
export function exportToCsv<T>(
  filename: string,
  data: T[],
  columns: CsvColumn<T>[]
): void {
  const header = columns.map(c => c.header).join(',')
  const rows = data.map(item =>
    columns.map(c => {
      const value = c.accessor(item)
      // Escape commas and quotes in values
      const str = String(value)
      return str.includes(',') || str.includes('"')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }).join(',')
  )

  const csvContent = [header, ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}
