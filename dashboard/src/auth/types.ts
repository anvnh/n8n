// ─── Role & Permission Types ──────────────────────────────────

export type UserRole = 'super_admin' | 'admin' | 'client'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

// ─── Permission Matrix ──────────────────────────────────────

export type Permission =
  | 'view_dashboard'
  | 'view_all_invoices'
  | 'approve_invoices'
  | 'manage_users'
  | 'manage_automation'
  | 'view_reports'
  | 'view_error_logs'
  | 'view_audit_trail'
  | 'manage_vendors'
  | 'manage_settings'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'view_dashboard',
    'view_all_invoices',
    'approve_invoices',
    'manage_users',
    'manage_automation',
    'view_reports',
    'view_error_logs',
    'view_audit_trail',
    'manage_vendors',
    'manage_settings',
  ],
  admin: [
    'view_dashboard',
    'view_all_invoices',
    'approve_invoices',
    'manage_automation',
    'view_reports',
    'view_error_logs',
    'view_audit_trail',
    'manage_vendors',
  ],
  client: [
    'view_dashboard',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    client: 'Client',
  }
  return labels[role] || role
}
