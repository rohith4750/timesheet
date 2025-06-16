import { api } from './config';

export interface UserData {
  user_sno: number;
  emp_id: string;
  user_firstname: string;
  user_middlename: string;
  user_lastname: string;
  user_fullname: string;
  user_phone: string;
  user_email: string;
  actions?: boolean;
  user_status?: string;
  role: string;
}

interface UserResponse {
  userDetails: UserData;
  message?: string;
}

interface UserListResponse {
  users: UserData[];
  total: number;
  message?: string;
}

// Get all users
export const getUsers = async (page: number = 1, limit: number = 10): Promise<UserListResponse> => {
  try {
    const response = await api.get<UserListResponse>(`/list/users`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: number): Promise<UserResponse> => {
  const response = await api.get<UserResponse>(`/user/${userId}`);
  return response.data;
};

// Create new user
export const createUser = async (userData: Omit<UserData, 'user_sno'>): Promise<UserResponse> => {
  const response = await api.post<UserResponse>('/create/user', userData);
  return response.data;
};

// Update user
export const updateUser = async (userId: number, userData: Partial<UserData>): Promise<UserResponse> => {
  const response = await api.put<UserResponse>(`/modify/user/${userId}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (userId: number): Promise<UserResponse> => {
  const response = await api.delete<UserResponse>(`/delete/user/${userId}`);
  return response.data;
};

// Get logged-in user details
export const getLoggedInUser = async (): Promise<UserResponse> => {
  try {
    const response = await api.get<UserResponse>('/logged-in-user');
    return response.data;
  } catch (error) {
    console.error('Error fetching logged-in user:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userId: number, profileData: Partial<UserData>): Promise<UserResponse> => {
  const response = await api.put<UserResponse>(`/profile/${userId}`, profileData);
  return response.data;
};

// Update super admin profile
export const updateSuperAdminProfile = async (userId: number, profileData: Partial<UserData>): Promise<UserResponse> => {
  const response = await api.put<UserResponse>(`/super-admin/profile/${userId}`, profileData);
  return response.data;
};

// Change password
export const changePassword = async (passwordData: { currentPassword: string; newPassword: string }): Promise<UserResponse> => {
  const response = await api.put<UserResponse>('/change-password', passwordData);
  return response.data;
};

// Check if user is super admin
export const checkSuperAdmin = async (): Promise<boolean> => {
  try {
    const response = await api.get<{ is_super_admin: boolean }>('/check/is_super_admin');
    return response.data.is_super_admin;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

// Fetch single user
export const fetchUser = async (): Promise<UserResponse> => {
  try {
    const response = await api.get<UserResponse>('/fetch/user');
    if (!response.data || !response.data.userDetails) {
      throw new Error('Invalid response format from server');
    }
    return response.data;
  } catch (error: any) {
    if (error?.response) {
      const message = error.response.data?.message || 'Failed to fetch user data';
      console.error('API Error:', message);
      throw new Error(message);
    } else if (error?.request) {
      console.error('Network Error: No response received');
      throw new Error('No response received from server');
    }
    console.error('Error:', error?.message || 'Unknown error');
    throw new Error(error?.message || 'Failed to load user data');
  }
}; 