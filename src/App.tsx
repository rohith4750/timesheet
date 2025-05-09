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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </Router>
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
