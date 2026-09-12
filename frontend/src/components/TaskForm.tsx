import { useEffect, useState } from 'react'
import { createTask } from '../services/taskService'
import { getUsers } from '../services/userService'
import type {
  CreateTaskPayload,
  TaskPriority,
  TaskStatus,
  TaskUser,
} from '../types/task'

interface TaskFormProps {
  onSuccess: () => void
  onCancel: () => void
}

function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const [users, setUsers] = useState<TaskUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [assignedTo, setAssignedTo] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchUsers = async () => {
      try {
        const response = await getUsers()

        if (!cancelled) {
          setUsers(response)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load team members.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingUsers(false)
        }
      }
    }

    void fetchUsers()

    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const payload: CreateTaskPayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      assigned_to: assignedTo,
    }

    try {
      await createTask(payload)
      onSuccess()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create task.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="task-title"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Title <span className="text-red-500">*</span>
        </label>

        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Fix authentication flow"
          maxLength={255}
          required
          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </div>

      <div>
        <label
          htmlFor="task-description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe what needs to be done..."
          rows={4}
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="task-status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="task-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TaskStatus)
            }
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Completed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="task-priority"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Priority
          </label>

          <select
            id="task-priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TaskPriority)
            }
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="task-assignee"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Assigned to
        </label>

        <select
          id="task-assignee"
          value={assignedTo ?? ''}
          onChange={(event) =>
            setAssignedTo(
              event.target.value
                ? Number(event.target.value)
                : null,
            )
          }
          disabled={loadingUsers}
          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none disabled:bg-slate-50 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        >
          <option value="">
            {loadingUsers ? 'Loading team members...' : 'Unassigned'}
          </option>

          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-100 bg-red-50 px-3 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="h-10 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create task'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm