import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Blocks access until the user is logged in
export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// Blocks access unless the user is an admin
export function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
