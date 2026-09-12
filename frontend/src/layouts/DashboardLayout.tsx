import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface DashboardLayoutProps {
  children: ReactNode
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const user = JSON.parse(
    localStorage.getItem('taskflow_user') || '{"name":"User"}',
  )

  const navigation = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: '⌂',
    },
    {
      label: 'Tasks',
      path: '/tasks',
      icon: '✓',
    },
  ]

  const handleLogout = async () => {
    const token = localStorage.getItem('taskflow_token')

    try {
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } finally {
      localStorage.removeItem('taskflow_token')
      localStorage.removeItem('taskflow_user')
      navigate('/login')
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-200
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="flex h-18 items-center border-b border-slate-100 px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
              T
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight">TaskFlow</p>
              <p className="text-[10px] text-slate-400">
                Workspace
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Workspace
          </p>

          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5
                text-sm font-medium transition
                ${
                  isActive(item.path)
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }
              `}
            >
              <span className="flex h-5 w-5 items-center justify-center text-sm">
                {item.icon}
              </span>

              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex h-5 w-5 items-center justify-center">
              ↪
            </span>

            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              ☰
            </button>

            <div className="hidden sm:block">
              <p className="text-xs text-slate-400">
                Workspace
              </p>
              <p className="text-sm font-semibold">
                Task management
              </p>
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 sm:flex"
              aria-label="Notifications"
            >
              ♧
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout