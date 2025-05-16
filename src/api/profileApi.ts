import axios from 'axios';
import { getAuthToken, isTokenExpired, refreshAuthToken, removeAuthToken } from './authUtils';

const API_BASE_URL = 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests and handle token refresh
axiosInstance.interceptors.request.use(
  async (config: any) => {
    let token = getAuthToken();
    if (!token) return config;

    try {
      if (isTokenExpired(token) && !config.url?.includes('/auth/refresh')) {
        token = await refreshAuthToken();
      }
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token.accessToken}`;
      return config;
    } catch (error) {
      if (!config.url?.includes('/auth/refresh')) {
        removeAuthToken();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface UserProfile {
  user_sno: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  email: string;
}

export const checkIsSuperAdmin = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get<boolean>('/check/is_super_admin');
    return response.data;
  } catch (error) {
    throw new Error('Failed to check admin status');
  }
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get<UserProfile>('/fetch/user');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user profile');
  }
};

export const updateSuperAdminProfile = async (userData: {
  user_sno: string;
  user_id: string;
  user_name: string;
  user_phone: string;
}) => {
  try {
    const response = await axiosInstance.put(
      `/superadmin/profile/${userData.user_sno}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to update super admin profile');
  }
};

export const updateUserProfile = async (userData: {
  user_sno: string;
  user_name: string;
  user_phone: string;
}) => {
  try {
    const response = await axiosInstance.put(
      `/profile/${userData.user_sno}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user profile');
  }
};

export const changePassword = async (passwordData: {
  current_password: string;
  new_password: string;
  confirm_newpassword: string;
}) => {
  try {
    const response = await axiosInstance.put('/changepassword', passwordData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to change password');
  }
};