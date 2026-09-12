export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface TaskUser {
  id: number
  name: string
}

export interface Task {
  id: number
  tenant_id: number
  created_by: number
  assigned_to: number | null
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  created_at: string
  updated_at: string
  creator?: TaskUser
  assignee?: TaskUser | null
}

export interface TaskListResponse {
  current_page: number
  data: Task[]
  last_page: number
  per_page: number
  total: number
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigned_to?: number | null
}

export interface UpdateTaskPayload {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  assigned_to?: number | null
}