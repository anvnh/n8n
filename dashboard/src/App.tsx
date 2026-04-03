import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'
import Invoices from './pages/Invoices'
import InvoiceDetail from './pages/InvoiceDetail'
import Vendors from './pages/Vendors'
import Reports from './pages/Reports'
import ErrorLogs from './pages/ErrorLogs'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar />
          <div className="app-main">
            <Topbar />
            <main className="app-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/invoices/:id" element={<InvoiceDetail />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/error-logs" element={<ErrorLogs />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
