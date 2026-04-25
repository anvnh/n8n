export interface SystemSettings {
  autoApprovalThreshold: number
  emailNotifications: boolean
  slackNotifications: boolean
  maxInvoiceAmount: number
  requireDoubleApproval: boolean
  sessionTimeout: number
  maintenanceMode: boolean
}

export const DEFAULT_SETTINGS: SystemSettings = {
  autoApprovalThreshold: 500,
  emailNotifications: true,
  slackNotifications: false,
  maxInvoiceAmount: 100000,
  requireDoubleApproval: false,
  sessionTimeout: 24,
  maintenanceMode: false,
}
