import React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (user_email: string, password: string) => Promise<void>;
  logout: () => void;
  user: any | null;
  alerts: Array<{
    type: "error" | "warning" | "success" | "info";
    text: string;
    duration?: number;
  }>;
  setAlerts: (
    alerts: Array<{
      type: "error" | "warning" | "success" | "info";
      text: string;
      duration?: number;
    }>
  ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('isLogin') === 'true'
  );
  const [user, setUser] = useState<any | null>(null);
  const [alerts, setAlerts] = useState<
    Array<{
      type: "error" | "warning" | "success" | "info";
      text: string;
      duration?: number;
    }>
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('auth_token');
      const isLogin = localStorage.getItem('isLogin');
      if (token && isLogin === 'true') {
        try {
          const parsedToken = JSON.parse(token);
          const isExpired = Date.now() >= parsedToken.expiresIn;
          
          if (!parsedToken.accessToken) {
            throw new Error('Invalid token format');
          }
          
          if (!isExpired) {
            setIsAuthenticated(true);
            setUser({ username: parsedToken.username });
            return;
          }
        } catch (error) {
          console.error('Error parsing auth token:', error);
          // Clear invalid auth state
          localStorage.removeItem('auth_token');
          localStorage.removeItem('isLogin');
        }
      }
      // If we get here, either token is invalid, expired, or missing
      setIsAuthenticated(false);
      setUser(null);
    };

    checkAuthStatus();
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const login = async (user_email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText);
      }

      const data = await response.json();
      const authToken = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
        username: user_email
      };
      localStorage.setItem('auth_token', JSON.stringify(authToken));
      localStorage.setItem('isLogin', 'true');
      setIsAuthenticated(true);
      setUser({ username: user_email });
      setAlerts([
        { type: "success", text: "Successfully logged in!", duration: 3000 },
      ]);
      navigate("/home-page");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred");
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('isLogin');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, user, alerts, setAlerts }}
    >
      {/* <Alerts alerts={alerts} setAlerts={setAlerts} /> */}
      {children}
    </AuthContext.Provider>
  );
};
