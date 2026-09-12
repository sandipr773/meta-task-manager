import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import TaskModal from '../components/TaskModal'
import {
  deleteTask,
  getTasks,
  updateTask,
} from '../services/taskService'
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from '../types/task'

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [search, setSearch] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchTasks = useCallback(
    async (page = 1) => {
      try {
        setLoading(true)
        setError('')

        const response = await getTasks({
            page,
            search: search.trim() || undefined,
            status: statusFilter || undefined,
            priority: priorityFilter || undefined,
        })

        setTasks(response.data)
        setCurrentPage(response.current_page)
        setLastPage(response.last_page)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load tasks.',
        )
      } finally {
        setLoading(false)
      }
    },
    [search, statusFilter, priorityFilter],
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTasks(1)
  }, [fetchTasks])

  const handleTaskCreated = async () => {
    setShowCreateModal(false)
    await fetchTasks(1)
  }

  const handleStatusChange = async (
    task: Task,
    status: TaskStatus,
  ) => {
    try {
      setError('')

      await updateTask(task.id, { status })

      await fetchTasks(currentPage)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update task.',
      )
    }
  }

  const handleDelete = async (task: Task) => {
    const confirmed = window.confirm(
      `Delete "${task.title}"? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(task.id)
      setError('')

      await deleteTask(task.id)

      const pageToLoad =
        currentPage > 1 && tasks.length === 1
          ? currentPage - 1
          : currentPage

      await fetchTasks(pageToLoad)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete task.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Workspace
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Tasks
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage and track your team's work.
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

        {/* Filters */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                ⌕
              </span>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value)
                setCurrentPage(1)
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              <option value="">All statuses</option>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(event) => {
                setPriorityFilter(event.target.value)
                setCurrentPage(1)
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              <option value="">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </section>

        {/* Task list */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <LoadingState />
          ) : tasks.length === 0 ? (
            <EmptyState
              hasSearch={Boolean(search)}
              onCreate={() => setShowCreateModal(true)}
            />
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Task
                      </th>

                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Assignee
                      </th>

                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Priority
                      </th>

                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Status
                      </th>

                      <th className="w-20 px-4 py-3" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {tasks.map((task) => (
                      <TaskTableRow
                        key={task.id}
                        task={task}
                        deleting={deletingId === task.id}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-100 md:hidden">
                {tasks.map((task) => (
                  <TaskMobileCard
                    key={task.id}
                    task={task}
                    deleting={deletingId === task.id}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && tasks.length > 0 && lastPage > 1 && (
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={fetchTasks}
            />
          )}
        </section>
      </div>

      {showCreateModal && (
        <TaskModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleTaskCreated}
        />
      )}
    </DashboardLayout>
  )
}

interface TaskTableRowProps {
  task: Task
  deleting: boolean
  onStatusChange: (
    task: Task,
    status: TaskStatus,
  ) => Promise<void>
  onDelete: (task: Task) => Promise<void>
}

function TaskTableRow({
  task,
  deleting,
  onStatusChange,
  onDelete,
}: TaskTableRowProps) {
  return (
    <tr className="transition hover:bg-slate-50">
      <td className="max-w-md px-6 py-4">
        <p className="truncate text-sm font-semibold text-slate-900">
          {task.title}
        </p>

        <p className="mt-1 truncate text-xs text-slate-500">
          {task.description || 'No description provided'}
        </p>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Avatar name={task.assignee?.name || 'Unassigned'} />

          <span className="text-xs font-medium text-slate-600">
            {task.assignee?.name || 'Unassigned'}
          </span>
        </div>
      </td>

      <td className="px-4 py-4">
        <PriorityBadge priority={task.priority} />
      </td>

      <td className="px-4 py-4">
        <StatusSelect
          status={task.status}
          disabled={deleting}
          onChange={(status) => onStatusChange(task, status)}
        />
      </td>

      <td className="px-4 py-4">
        <button
          type="button"
          onClick={() => onDelete(task)}
          disabled={deleting}
          className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </td>
    </tr>
  )
}

function TaskMobileCard({
  task,
  deleting,
  onStatusChange,
  onDelete,
}: TaskTableRowProps) {
  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">
            {task.title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {task.description || 'No description provided'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onDelete(task)}
          disabled={deleting}
          className="shrink-0 text-xs font-medium text-slate-400 hover:text-red-600"
        >
          {deleting ? '...' : 'Delete'}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />

        <StatusSelect
          status={task.status}
          disabled={deleting}
          onChange={(status) => onStatusChange(task, status)}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
        <Avatar name={task.assignee?.name || 'Unassigned'} />

        <span className="text-xs text-slate-500">
          {task.assignee?.name || 'Unassigned'}
        </span>
      </div>
    </div>
  )
}

function StatusSelect({
  status,
  disabled,
  onChange,
}: {
  status: TaskStatus
  disabled: boolean
  onChange: (status: TaskStatus) => void
}) {
  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(event) =>
        onChange(event.target.value as TaskStatus)
      }
      className="rounded-full border-0 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
    >
      <option value="todo">To do</option>
      <option value="in_progress">In progress</option>
      <option value="done">Completed</option>
    </select>
  )
}

function PriorityBadge({
  priority,
}: {
  priority: TaskPriority
}) {
  const styles = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-blue-50 text-blue-700',
    high: 'bg-red-50 text-red-700',
  }

  const label =
    priority.charAt(0).toUpperCase() +
    priority.slice(1)

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[priority]}`}
    >
      {label}
    </span>
  )
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex animate-pulse items-center gap-4 px-6 py-5"
        >
          <div className="flex-1">
            <div className="h-4 w-48 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-72 rounded bg-slate-100" />
          </div>

          <div className="hidden h-7 w-20 rounded-full bg-slate-100 md:block" />
          <div className="h-7 w-20 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({
  hasSearch,
  onCreate,
}: {
  hasSearch: boolean
  onCreate: () => void
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-500">
        {hasSearch ? '⌕' : '✓'}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {hasSearch ? 'No matching tasks' : 'No tasks yet'}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
        {hasSearch
          ? 'Try changing your search or filters.'
          : 'Create your first task to start organizing work.'}
      </p>

      {!hasSearch && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-5 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Create your first task
        </button>
      )}
    </div>
  )
}

function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 sm:px-6">
      <p className="text-xs text-slate-500">
        Page {currentPage} of {lastPage}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default TasksPage