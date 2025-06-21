import { api, handleApiError } from './config';

export interface TaskData {
  ut_sno: number;
  task_name: string;
  task_description: string;
  task_status: string;
  no_of_hours: number;
  user_sno: number;
  project_sno: number;
  created_at: string;
  updated_at: string;
}

export interface TaskResponse {
  tasks?: TaskData[];
  userTasks?: TaskData[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface TaskCreateResponse {
  message: string;
  task: TaskData;
}

// Get all tasks
export const getTasks = async (page: number = 1, limit: number = 10): Promise<TaskResponse> => {
  try {
    console.log('Fetching tasks...');
    const response = await api.get<TaskResponse>('/list/tasks', {
      params: { page, limit }
    });
    console.log('Tasks response:', response.data);
    
    if (!response.data) {
      throw new Error('No data received from tasks API');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
};

// Get user tasks
export const getUserTasks = async (page: number = 1, limit: number = 10): Promise<TaskResponse> => {
  try {
    console.log('Fetching user tasks...');
    const response = await api.get<TaskResponse>('/list/user_tasks', {
      params: { page, limit }
    });
    console.log('User tasks response:', response.data);
    
    if (!response.data) {
      throw new Error('No data received from user tasks API');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    throw new Error('Failed to fetch user tasks');
  }
};

// Get task by ID
export const getTaskById = async (id: number): Promise<TaskData> => {
  try {
    const response = await api.get<TaskData>(`/task/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw new Error('Failed to fetch task');
  }
};

// Create new task
export const createTask = async (taskData: Omit<TaskData, 'ut_sno' | 'created_at' | 'updated_at'>): Promise<TaskCreateResponse> => {
  try {
    const response = await api.post<TaskCreateResponse>('/create/task', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
};

// Update task
export const updateTask = async (id: number, taskData: Partial<TaskData>): Promise<TaskCreateResponse> => {
  try {
    const response = await api.put<TaskCreateResponse>(`/modify/task/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};

// Delete task
export const deleteTask = async (id: number): Promise<void> => {
  try {
    await api.delete(`/delete/task/${id}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
};

// Get tasks by project ID
export const getTasksByProjectId = async (projectId: number, page: number = 1, limit: number = 10): Promise<TaskResponse> => {
  try {
    const response = await api.get<TaskResponse>(`/project/${projectId}/tasks`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    throw new Error('Failed to fetch project tasks');
  }
};

// Get tasks by user ID
export const getTasksByUserId = async (userId: number, page: number = 1, limit: number = 10): Promise<TaskResponse> => {
  try {
    const response = await api.get<TaskResponse>(`/user/${userId}/tasks`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    throw new Error('Failed to fetch user tasks');
  }
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

// Approve task
export const approveTask = async (taskId: number): Promise<TaskResponse> => {
  const response = await api.patch<TaskResponse>(`/approve/user_task/${taskId}`);
  return response.data;
};

// Reject task
export const rejectTask = async (taskId: number): Promise<TaskResponse> => {
  const response = await api.patch<TaskResponse>(`/reject/user_task/${taskId}`);
  return response.data;
}; 