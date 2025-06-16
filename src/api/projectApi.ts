import { api } from './config';

export interface ProjectData {
  project_sno: number;
  project_name: string;
  project_description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectResponse {
  message: string;
  data?: ProjectData;
  project?: ProjectData[];
  total?: number;
}

// Get all projects
export const getProjects = async (page: number = 1, limit: number = 10): Promise<ProjectResponse> => {
  const response = await api.get<ProjectResponse>(`/list/projects?page=${page}&limit=${limit}`);
  return response.data;
};

// Get project by ID
export const getProjectById = async (projectId: number): Promise<ProjectResponse> => {
  const response = await api.get<ProjectResponse>(`/project/${projectId}`);
  return response.data;
};

// Create new project
export const createProject = async (projectData: Omit<ProjectData, 'project_sno'>): Promise<ProjectResponse> => {
  const response = await api.post<ProjectResponse>('/create/project', projectData);
  return response.data;
};

// Update project
export const updateProject = async (projectId: number, projectData: Partial<ProjectData>): Promise<ProjectResponse> => {
  const response = await api.put<ProjectResponse>(`/modify/project/${projectId}`, projectData);
  return response.data;
};

// Delete project
export const deleteProject = async (projectId: number): Promise<ProjectResponse> => {
  const response = await api.delete<ProjectResponse>(`/delete/project/${projectId}`);
  return response.data;
};

// Get projects by user ID
export const getProjectsByUserId = async (userId: number, page: number = 1, limit: number = 10): Promise<ProjectResponse> => {
  const response = await api.get<ProjectResponse>(`/user/${userId}/projects?page=${page}&limit=${limit}`);
  return response.data;
};

// Assign user to project
export const assignUserToProject = async (projectId: number, userId: number): Promise<ProjectResponse> => {
  const response = await api.post<ProjectResponse>(`/project/${projectId}/assign/${userId}`);
  return response.data;
};

// Remove user from project
export const removeUserFromProject = async (projectId: number, userId: number): Promise<ProjectResponse> => {
  const response = await api.delete<ProjectResponse>(`/project/${projectId}/remove/${userId}`);
  return response.data;
}; 