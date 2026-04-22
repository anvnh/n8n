// ─── Role & Permission Types ──────────────────────────────────

export type UserRole = 'super_admin' | 'admin' | 'user'
export type StoredUserRole = UserRole | 'client'

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
  user: [
    'view_dashboard',
    'view_all_invoices',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function normalizeRole(role: StoredUserRole): UserRole {
  if (role === 'client') return 'user'
  return role
}

export function denormalizeRole(role: UserRole): StoredUserRole {
  if (role === 'user') return 'client'
  return role
}

export function getRoleLabel(role: UserRole | StoredUserRole): string {
  const labels: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    user: 'User',
  }
  const normalized = normalizeRole(role as StoredUserRole)
  return labels[normalized] || normalized
}
