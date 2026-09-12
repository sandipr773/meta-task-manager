import apiRequest from './api'
import type { TaskUser } from '../types/task'

export const getUsers = async (): Promise<TaskUser[]> => {
  return apiRequest<TaskUser[]>('/api/users')
}