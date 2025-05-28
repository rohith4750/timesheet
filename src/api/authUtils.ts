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
  return token ? JSON.parse(token) : null;
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if token is expired or will expire soon (within 5 seconds)
export const isTokenExpired = (token: AuthToken): boolean => {
  if (!token.expiresIn) return true;
  // Add 5 seconds buffer to prevent edge cases
  return Date.now() + 5000 >= token.expiresIn;
};

// Get authentication header
export const getAuthHeader = (): Record<string, string> => {
  const token = getAuthToken();
  if (!token) return { 'Content-Type': 'application/json' };
  
  return {
    'Authorization': `Bearer ${token.accessToken}`,
    'Content-Type': 'application/json'
  };
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