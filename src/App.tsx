import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.scss";
// import Layout from "./component/layout/layout";
// import Login from "./pages/login/login";
// import { routes } from "./constants/routes";
// import { AuthProvider } from "./services/auth";
import { routes } from "./constants/routes";
import Layout from "./pages/layout/layout";
import { AuthProvider } from "./services/auth";
import Login from "./pages/loginpage/login";
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
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<Layout />}>
            {renderRoutes(routes.filter((route) => route.path !== "/login"))}
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;
