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
    login: (login_username: string, login_password: string) => Promise<void>;
    logout: () => void;
    user: any | null;
    alerts: Array<{ type: "error" | "warning" | "success" | "info"; text: string; duration?: number }>;
    setAlerts: (alerts: Array<{ type: "error" | "warning" | "success" | "info"; text: string; duration?: number }>) => void;
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any | null>(null);
    const [alerts, setAlerts] = useState<Array<{ type: "error" | "warning" | "success" | "info"; text: string; duration?: number }>>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            // TODO: Fetch user data if needed
        }
    }, []);

    const login = async (login_username: string, login_password: string) => {
        try {
            // Static credential validation
            if (login_username === "admin@pycube.com" && login_password === "Pycube123$") {
                // Mock successful login
                const mockToken = "mock-token-" + Date.now();
                localStorage.setItem("token", mockToken);
                setIsAuthenticated(true);
                setUser({ username: login_username });
                setAlerts([{ type: "success", text: "Successfully logged in!", duration: 3000 }]);
                navigate("/home");
            } else {
                throw new Error("Invalid credentials");
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error("An unexpected error occurred");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, alerts, setAlerts }}>
            {/* <Alerts alerts={alerts} setAlerts={setAlerts} /> */}
            {children}
        </AuthContext.Provider>
    );
};