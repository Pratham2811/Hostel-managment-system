// src/components/auth/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // or wherever you store your auth info

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // adjust according to your auth state

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
