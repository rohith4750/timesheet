import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
              <Route path="/" element={<Navigate to="/login" replace />} />
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
