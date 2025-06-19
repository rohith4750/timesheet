import { api, handleApiError } from './config';

export interface ProjectData {
  project_sno: number;
  project_name: string;
  project_description: string;
  project_status: string;
  project_manager: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectFormData {
  project_name: string;
  project_description: string;
  project_status: string;
  project_manager: number;
}

export interface ProjectResponse {
  success: boolean;
  statusCode: number;
  project: ProjectData[];
  message?: string;
}

// Get all projects
export const getProjects = async (page: number = 1, limit: number = 10): Promise<ProjectResponse> => {
  try {
    const response = await api.get<ProjectResponse>(`/list/projects`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error(handleApiError(error));
  }
};

// Get user projects
export const getUserProjects = async (page: number = 1, limit: number = 10): Promise<ProjectResponse> => {
  try {
    const response = await api.get<ProjectResponse>(`/list/user-projects`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw new Error(handleApiError(error));
  }
};

// Get project details
export const getProjectDetails = async (projectSno: number): Promise<ProjectData> => {
  try {
    const response = await api.get<ProjectData>(`/project/${projectSno}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw new Error(handleApiError(error));
  }
};

// Create project
export const createProject = async (formData: ProjectFormData): Promise<ProjectData> => {
  try {
    const response = await api.post<ProjectData>('/create/project', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error(handleApiError(error));
  }
};

// Update project
export const updateProject = async (projectId: number, projectData: Partial<ProjectData>): Promise<ProjectResponse> => {
  const response = await api.put<ProjectResponse>(`/modify/project/${projectId}`, projectData);
  return response.data;
};

// Delete project
export const deleteProject = async (projectSno: number): Promise<void> => {
  try {
    await api.delete(`/delete/project/${projectSno}`);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error(handleApiError(error));
  }
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