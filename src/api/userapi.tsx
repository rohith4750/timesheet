import axios from 'axios';
import { getAuthToken } from './authUtils';

const API_BASE_URL = 'http://localhost:3001/api';

export interface UserData {
  id?: string;
  user_sno: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  actions?: boolean;
  user_status?: string;
  is_super_admin?: boolean;
}

export interface UserResponse {
  userDetails: UserData;
  message: string;
}

export interface UserListResponse {
  success: boolean;
  statusCode: number;
  user: UserData[];
}

export interface SuperAdminResponse {
  is_super_admin: boolean;
}

const getAuthHeader = () => {
  const token = getAuthToken();
  if (!token) throw new Error('No authentication token found');
  return {
    'Authorization': `Bearer ${token.accessToken}`,
    'Content-Type': 'application/json'
  };
};

// Get all users
export const getUsers = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await axios.get<UserListResponse>(
      `${API_BASE_URL}/list/users?page=${page}&limit=${limit}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check if user is super admin
export const checkSuperAdmin = async (): Promise<boolean> => {
  try {
    const response = await axios.get<SuperAdminResponse>(
      `${API_BASE_URL}/check/is_super_admin`,
      { headers: getAuthHeader() }
    );
    return response.data.is_super_admin;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

// Update user
export const updateUser = async (id: string, userData: Omit<UserData, 'id'>) => {
  try {
    const response = await axios.put<UserResponse>(
      `${API_BASE_URL}/modify/user/${id}`,
      userData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create user
export const createUser = async (userData: Omit<UserData, 'id' | 'user_sno'>) => {
  try {
    const response = await axios.post<UserResponse>(
      `${API_BASE_URL}/create/user`,
      userData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete user
export const deleteUser = async (userSno: string) => {
  try {
    const response = await axios.delete<UserResponse>(
      `${API_BASE_URL}/delete/user/${userSno}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch single user
export const fetchUser = async () => {
  try {
    // Check if we have a valid auth token before making the request
    const token = getAuthToken();
    if (!token || !token.accessToken) {
      throw new Error('No valid authentication token found');
    }

    const response = await axios.get<UserResponse>(
      `${API_BASE_URL}/fetch/user`,
      { headers: getAuthHeader() }
    );
    
    if (!response.data || !response.data.userDetails) {
      throw new Error('Invalid response format from server');
    }
    
    return {
      data: response.data.userDetails,
      message: response.data.message
    };
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