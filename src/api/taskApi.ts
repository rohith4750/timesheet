import { api } from './config';

export interface TaskData {
  task_sno: number;
  task_name: string;
  task_description?: string;
  project_sno: number;
  assigned_to?: number;
  assigned_by?: number;
  priority?: string;
  status?: string;
  start_date?: string;
  due_date?: string;
  completed_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskResponse {
  message: string;
  data?: TaskData;
  task?: TaskData[];
  total?: number;
}

// Get all tasks
export const getTasks = async (page: number = 1, limit: number = 10): Promise<TaskResponse> => {
  const response = await api.get<TaskResponse>(`/list/tasks?page=${page}&limit=${limit}`);
  return response.data;
};

// Get task by ID
export const getTaskById = async (taskId: number): Promise<TaskResponse> => {
  const response = await api.get<TaskResponse>(`/task/${taskId}`);
  return response.data;
};

// Create new task
export const createTask = async (taskData: Omit<TaskData, 'task_sno'>): Promise<TaskResponse> => {
  const response = await api.post<TaskResponse>('/create/task', taskData);
  return response.data;
};

// Update task
export const updateTask = async (taskId: number, taskData: Partial<TaskData>): Promise<TaskResponse> => {
  const response = await api.put<TaskResponse>(`/modify/task/${taskId}`, taskData);
  return response.data;
};

// Delete task
export const deleteTask = async (taskId: number): Promise<TaskResponse> => {
  const response = await api.delete<TaskResponse>(`/delete/task/${taskId}`);
  return response.data;
};

// Get tasks by project ID
export const getTasksByProjectId = async (projectId: number, page: number = 1, limit: number = 10): Promise<TaskResponse> => {
  const response = await api.get<TaskResponse>(`/project/${projectId}/tasks?page=${page}&limit=${limit}`);
  return response.data;
};

// Get tasks by user ID
export const getTasksByUserId = async (userId: number, page: number = 1, limit: number = 10): Promise<TaskResponse> => {
  const response = await api.get<TaskResponse>(`/user/${userId}/tasks?page=${page}&limit=${limit}`);
  return response.data;
};

// Assign task to user
export const assignTaskToUser = async (taskId: number, userId: number): Promise<TaskResponse> => {
  const response = await api.post<TaskResponse>(`/task/${taskId}/assign/${userId}`);
  return response.data;
};

// Update task status
export const updateTaskStatus = async (taskId: number, status: string): Promise<TaskResponse> => {
  const response = await api.put<TaskResponse>(`/task/${taskId}/status`, { status });
  return response.data;
};

// Update task priority
export const updateTaskPriority = async (taskId: number, priority: string): Promise<TaskResponse> => {
  const response = await api.put<TaskResponse>(`/task/${taskId}/priority`, { priority });
  return response.data;
}; 