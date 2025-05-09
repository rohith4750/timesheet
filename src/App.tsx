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

function App() {
  const renderRoutes = (routes: any[]) => {
    return routes.map((route) => (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };

  return (
    <div>
      {/* Placeholder content until you're ready to uncomment the router setup */}
      <h1>App Component</h1>
    </div>
  );
}

export default App;
// <Router>
//   <AuthProvider>
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/" element={<Navigate to="/login" replace />} />
//       <Route element={<Layout />}>
//         {renderRoutes(routes.filter((route) => route.path !== "/login"))}
//       </Route>
//     </Routes>
//   </AuthProvider>
// </Router>
