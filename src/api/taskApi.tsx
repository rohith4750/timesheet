import axios from 'axios';
import { getAuthHeader } from './authUtils';

const API_BASE_URL = 'http://localhost:3001/api';
const STATUS_URL = `${API_BASE_URL}/status`;

export interface TaskData {
  id?: number;
  ut_sno?: number;
  user_sno: string;
  project_name: string;
  task: string;
  task_description: string;
  ut_status: 'draft' | 'pending' | 'approved' | 'rejected';
  task_start_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface ValidationErrors {
  user_sno?: string;
  project_name?: string;
  task?: string;
  task_description?: string;
  task_start_at?: string;
}

export interface TaskResponse {
  data: TaskData;
  message: string;
}

interface TaskListResponse {
  task: TaskData[];
  total: number;
  message?: string;
}

const BASE_URL = '/api/tasks';

// Validate task data
export const validateTaskData = (taskData: Partial<TaskData>): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!taskData.user_sno) errors.user_sno = 'User sno is required';
  if (!taskData.project_name) errors.project_name = 'Project name is required';
  if (!taskData.task) errors.task = 'Task is required';
  if (!taskData.task_description) errors.task_description = 'Task description is required';
  if (!taskData.task_start_at) errors.task_start_at = 'Task start date is required';

  return errors;
};

// Submit a new task
export const submitTask = async (taskData: Omit<TaskData, 'id' | 'ut_sno'>) => {
  try {
    const response = await axios.put<TaskResponse>(
      `${STATUS_URL}/submit`,
      taskData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Withdraw a task
export const withdrawTask = async (taskId: number) => {
  try {
    const response = await axios.put<TaskResponse>(
      `${STATUS_URL}/withdraw/${taskId}`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all tasks with pagination
export const getTasks = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await axios.get<TaskListResponse>(
      `${API_BASE_URL}/list/tasks`,
      {
        params: {
          page,
          limit
        },
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (id: number) => {
  try {
    const response = await axios.get<TaskResponse>(`${BASE_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData: Omit<TaskData, 'id' | 'ut_sno'>) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/create/task`,
      taskData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId: number, taskData: Partial<TaskData>) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update/task/${taskId}`,
      taskData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: number) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/delete/task/${taskId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (
  id: number,
  status: TaskData['ut_status']
) => {
  try {
    const response = await axios.patch<TaskResponse>(
      `${BASE_URL}/${id}/status`,
      { ut_status: status },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};