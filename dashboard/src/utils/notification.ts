// Simple notification/toast utility

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
}

let notificationCounter = 0

/**
 * Create a notification object
 */
export function createNotification(
  type: NotificationType,
  message: string,
  duration = 5000
): Notification {
  return {
    id: `notification_${++notificationCounter}_${Date.now()}`,
    type,
    message,
    duration,
  }
}

/**
 * Success notification shorthand
 */
export function successNotification(message: string): Notification {
  return createNotification('success', message)
}

/**
 * Error notification shorthand
 */
export function errorNotification(message: string): Notification {
  return createNotification('error', message, 8000)
}
