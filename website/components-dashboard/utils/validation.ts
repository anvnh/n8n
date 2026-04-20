// Input validation utility functions

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Validate invoice amount (must be positive)
 */
export function isValidAmount(amount: number): boolean {
  return !isNaN(amount) && amount > 0
}

/**
 * Validate required string field
 */
export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Validate Google Drive link format
 */
export function isValidDriveLink(url: string): boolean {
  if (!url) return true // optional field
  return url.includes('drive.google.com') || url.includes('docs.google.com')
}

/**
 * Validate bank account number (digits only, 6-20 chars)
 */
export function isValidAccountNumber(accountNum: string): boolean {
  if (!accountNum) return true // optional
  return /^\d{6,20}$/.test(accountNum)
}
