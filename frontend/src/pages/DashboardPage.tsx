import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import TaskModal from '../components/TaskModal'
import {
  getTasks,
  getTaskStats,
} from '../services/taskService'
import type { Task } from '../types/task'

function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    in_progress: 0,
    done: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const [tasksResponse, statsResponse] =
        await Promise.all([
          getTasks(),
          getTaskStats(),
        ])

      setTasks(tasksResponse.data)
      setStats(statsResponse)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load dashboard data.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // This effect synchronizes the dashboard with backend data.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchDashboardData()
  }, [fetchDashboardData])

  const handleTaskCreated = async () => {
    setShowCreateModal(false)
    await fetchDashboardData()
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Overview
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Here's what's happening with your workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <span className="mr-2 text-base">+</span>
            Create task
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total tasks"
            value={loading ? '—' : stats.total}
            description="Across this workspace"
          />

          <StatCard
            label="To do"
            value={loading ? '—' : stats.todo}
            description="Waiting to be started"
          />

          <StatCard
            label="In progress"
            value={loading ? '—' : stats.in_progress}
            description="Currently being worked on"
          />

          <StatCard
            label="Completed"
            value={loading ? '—' : stats.done}
            description="Finished tasks"
          />
        </section>

        {/* Recent tasks */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Recent tasks
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                The latest work in your workspace.
              </p>
            </div>

            <Link
              to="/tasks"
              className="self-start text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              View all
              <span className="ml-1">→</span>
            </Link>
          </div>

          {loading ? (
            <TaskSkeleton />
          ) : tasks.length === 0 ? (
            <EmptyTasks
              onCreate={() => setShowCreateModal(true)}
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {tasks.slice(0, 5).map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Create task modal */}
      {showCreateModal && (
        <TaskModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleTaskCreated}
        />
      )}
    </DashboardLayout>
  )
}

interface StatCardProps {
  label: string
  value: number | string
  description: string
}

function StatCard({
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
          {label.charAt(0)}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {description}
      </p>
    </div>
  )
}

function TaskRow({ task }: { task: Task }) {
  const statusLabel = {
    todo: 'To do',
    in_progress: 'In progress',
    done: 'Completed',
  }[task.status]

  const priorityLabel =
    task.priority.charAt(0).toUpperCase() +
    task.priority.slice(1)

  return (
    <div className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-900">
          {task.title}
        </h3>

        <p className="mt-1 truncate text-xs text-slate-500">
          {task.description || 'No description provided'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          {priorityLabel}
        </span>

        <StatusBadge status={statusLabel} />

        <button
          type="button"
          aria-label={`More options for ${task.title}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          ⋯
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    'To do': 'bg-slate-100 text-slate-600',
    'In progress': 'bg-amber-50 text-amber-700',
    Completed: 'bg-emerald-50 text-emerald-700',
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  )
}

function TaskSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex animate-pulse items-center gap-4 px-5 py-5 sm:px-6"
        >
          <div className="flex-1">
            <div className="h-4 w-48 rounded bg-slate-100" />

            <div className="mt-2 h-3 w-72 max-w-full rounded bg-slate-100" />
          </div>

          <div className="hidden h-6 w-16 rounded-full bg-slate-100 sm:block" />

          <div className="h-6 w-20 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

interface EmptyTasksProps {
  onCreate: () => void
}

function EmptyTasks({ onCreate }: EmptyTasksProps) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-500">
        ✓
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        No tasks yet
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
        Create your first task to start organizing work in
        this workspace.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        Create your first task
      </button>
    </div>
  )
}

export default DashboardPage