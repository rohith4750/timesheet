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
}

export interface UserResponse {
  data: UserData;
  message: string;
}

export interface UserListResponse {
  data: UserData[];
  total: number;
  message: string;
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