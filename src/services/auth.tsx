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
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
      // TODO: Fetch user data if needed
    }
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
      localStorage.setItem("accessToken", data.accessToken);
      setIsAuthenticated(true);
      setUser({ username: user_email });
      setAlerts([
        { type: "success", text: "Successfully logged in!", duration: 3000 },
      ]);
      // Add a small delay to ensure toast is visible before navigation
      setTimeout(() => {
        navigate("/home-page");
      }, 10000000);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
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
