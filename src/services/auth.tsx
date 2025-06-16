import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES, getPermissionsForRole } from '../constants/permissions';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
  alerts: Array<{
    type: "error" | "warning" | "success" | "info";
    text: string;
    duration?: number;
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [alerts, setAlerts] = useState<Array<{
    type: "error" | "warning" | "success" | "info";
    text: string;
    duration?: number;
  }>>([]);
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('auth_token');
      const isLogin = localStorage.getItem('isLogin');
      const userRole = localStorage.getItem('userRole');

      if (token && isLogin === 'true' && userRole) {
        const parsedToken = JSON.parse(token);
        const isExpired = Date.now() >= parsedToken.expiresIn;

        if (!isExpired && parsedToken.accessToken) {
          setIsAuthenticated(true);
          setUser({ 
            username: parsedToken.username,
            role: userRole
          });
          return true;
        }
      }
      // Clear invalid auth state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('isLogin');
      localStorage.removeItem('userRole');
      localStorage.removeItem('permissions');
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const login = (token: string, userData: any) => {
    try {
      // Store auth token
      const tokenData = {
        accessToken: token,
        expiresIn: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
      };
      localStorage.setItem('auth_token', JSON.stringify(tokenData));
      localStorage.setItem('isLogin', 'true');
      
      // Store user role
      const userRole = userData.role || ROLES.USER;
      localStorage.setItem('userRole', userRole);
      
      // Get and store permissions for the role
      const permissions = getPermissionsForRole(userRole as keyof typeof ROLES);
      localStorage.setItem('permissions', permissions.join(','));
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      setAlerts([{
        type: "error",
        text: "Failed to login. Please try again.",
        duration: 3000
      }]);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userRole');
    localStorage.removeItem('permissions');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    // Check auth status on mount
    checkAuthStatus();

    // Add event listener for storage changes
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, alerts }}>
      {/* <Alerts alerts={alerts} setAlerts={setAlerts} /> */}
      {children}
    </AuthContext.Provider>
  );
};
