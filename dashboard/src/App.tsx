import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Invoices from './pages/Invoices'
import InvoiceDetail from './pages/InvoiceDetail'
import Vendors from './pages/Vendors'
import Reports from './pages/Reports'
import ErrorLogs from './pages/ErrorLogs'
import Users from './pages/Users'
import AutomationRules from './pages/AutomationRules'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login — no sidebar/topbar */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes — with layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout><Dashboard /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <AppLayout><Invoices /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute>
                  <AppLayout><InvoiceDetail /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendors"
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                  <AppLayout><Vendors /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                  <AppLayout><Reports /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/error-logs"
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                  <AppLayout><ErrorLogs /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRoles={['super_admin']}>
                  <AppLayout><Users /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/automation"
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                  <AppLayout><AutomationRules /></AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
