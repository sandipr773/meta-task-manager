import apiRequest from './api'
import type {
  CreateTaskPayload,
  Task,
  TaskListResponse,
  UpdateTaskPayload,
} from '../types/task'

export interface TaskFilters {
  search?: string
  status?: string
  priority?: string
  page?: number
}

export const getTasks = async (
  filters: TaskFilters = {},
): Promise<TaskListResponse> => {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.status) {
    params.set('status', filters.status)
  }

  if (filters.priority) {
    params.set('priority', filters.priority)
  }

  if (filters.page) {
    params.set('page', String(filters.page))
  }

  const queryString = params.toString()

  return apiRequest<TaskListResponse>(
    `/api/tasks${queryString ? `?${queryString}` : ''}`,
  )
}

export const getTask = async (id: number): Promise<Task> => {
  return apiRequest<Task>(`/api/tasks/${id}`)
}

export const createTask = async (
  payload: CreateTaskPayload,
): Promise<{ message: string; task: Task }> => {
  return apiRequest<{ message: string; task: Task }>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const updateTask = async (
  id: number,
  payload: UpdateTaskPayload,
): Promise<{ message: string; task: Task }> => {
  return apiRequest<{ message: string; task: Task }>(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export const deleteTask = async (
  id: number,
): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(`/api/tasks/${id}`, {
    method: 'DELETE',
  })
}

export interface TaskStats {
  total: number
  todo: number
  in_progress: number
  done: number
}

export const getTaskStats = async (): Promise<TaskStats> =>
  apiRequest<TaskStats>('/api/tasks/stats')