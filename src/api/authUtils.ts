import axios from 'axios';

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Store token in localStorage
const TOKEN_KEY = 'auth_token';

// Save auth token to localStorage
export const saveAuthToken = (token: AuthToken): void => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
};

// Get auth token from localStorage
export const getAuthToken = (): AuthToken | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    return JSON.parse(token);
  } catch (error) {
    console.error('Error parsing auth token:', error);
    return null;
  }
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('isLogin');
  localStorage.removeItem('userRole');
  localStorage.removeItem('permissions');
};

// Get auth header for API requests
export const getAuthHeader = () => {
  const token = getAuthToken();
  if (!token?.accessToken) {
    throw new Error("No authentication token found");
  }
  return {
    Authorization: `Bearer ${token.accessToken}`,
    "Content-Type": "application/json",
  };
};

// Check if token is expired or will expire soon (within 5 seconds)
export const isTokenExpired = (token: AuthToken): boolean => {
  if (!token.expiresIn) return true;
  // Add 5 seconds buffer to prevent edge cases
  return Date.now() + 5000 >= token.expiresIn;
};

// Refresh token
export const refreshAuthToken = async (): Promise<AuthToken> => {
  const token = getAuthToken();
  if (!token?.refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post<AuthToken>('/api/auth/refresh', {
      refreshToken: token.refreshToken
    });
    
    const newToken = response.data;
    saveAuthToken(newToken);
    return newToken;
  } catch (error) {
    removeAuthToken();
    throw error;
  }
};