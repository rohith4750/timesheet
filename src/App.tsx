import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.scss";
import { routes } from "./constants/routes";
import Layout from "./pages/layout/layout";
import { AuthProvider, useAuth } from "./services/auth";
import { ToastProvider } from "./components/toast/ToastContext";
import { ModalProvider } from "./components/modal/ModalContext";
import Login from "./pages/loginpage/login";
import Verification from "./pages/forgotpassword/verification/verify";
import ResetPassword from "./pages/forgotpassword/reset-password/reset-password";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const isLogin = localStorage.getItem('isLogin');
        const userRole = localStorage.getItem('userRole');

        if (token && isLogin === 'true' && userRole) {
          const parsedToken = JSON.parse(token);
          const isExpired = Date.now() >= parsedToken.expiresIn;

          if (!isExpired && parsedToken.accessToken) {
            setIsValid(true);
          } else {
            // Clear invalid auth state
            localStorage.removeItem('auth_token');
            localStorage.removeItem('isLogin');
            localStorage.removeItem('userRole');
            localStorage.removeItem('permissions');
            setIsValid(false);
          }
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsValid(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location]);

  if (isChecking) {
    return null; // or a loading spinner
  }

  if (!isValid || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  const renderRoutes = (routes: any[]) => {
    return routes.map((route) => (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };

  return (
    <Router>
      <ToastProvider>
        <ModalProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password/verification" element={<Verification />} />
              <Route path="/forgot-password/reset" element={<ResetPassword />} />
              <Route path="/" element={<Navigate to="/home-page" replace />} />
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                {renderRoutes(routes.filter((route) => !["/login", "/forgot-password/verification", "/forgot-password/reset"].includes(route.path)))}
              </Route>
            </Routes>
          </AuthProvider>
        </ModalProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
