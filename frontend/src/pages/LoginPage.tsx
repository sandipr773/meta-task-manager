import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import apiRequest from '../services/api'
import type { LoginResponse } from '../types/auth'

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('admin@acme.test')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await apiRequest<LoginResponse>('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      localStorage.setItem('taskflow_token', response.token)
      localStorage.setItem('taskflow_user', JSON.stringify(response.user))

      navigate('/dashboard')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      {/* Left - Login */}
      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white shadow-sm">
              T
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-950">
                TaskFlow
              </h1>

              <p className="text-xs text-slate-500">
                Workspace task management
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Welcome back
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Sign in to your workspace
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Manage tasks, track progress, and keep your team aligned.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-slate-500 hover:text-slate-950"
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-700">
              Demo workspace
            </p>

            <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:gap-2">
              <span>admin@acme.test</span>
              <span className="hidden sm:block">•</span>
              <span>password</span>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Secure workspace access
          </p>
        </div>
      </section>

      {/* Right - Product showcase */}
      <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:min-h-screen lg:items-end">
        <div className="absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-slate-800/60 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-slate-800/50 blur-3xl" />
        </div>

        <div className="relative w-full px-12 py-14 xl:px-20 xl:py-20">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-slate-400">
              TEAM WORKSPACE
            </span>

            <h2 className="mt-6 text-5xl font-bold leading-[1.05] tracking-[-0.05em] text-white xl:text-6xl">
              Keep your team's work{' '}
              <span className="text-slate-500">moving forward.</span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400">
              Organize tasks, track progress, and keep everyone aligned from
              one focused workspace built for modern teams.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-800 pt-8">
              <div>
                <p className="text-2xl font-bold text-white">24</p>
                <p className="mt-1 text-xs text-slate-500">Active tasks</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">86%</p>
                <p className="mt-1 text-xs text-slate-500">Completed</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">8</p>
                <p className="mt-1 text-xs text-slate-500">Team members</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage