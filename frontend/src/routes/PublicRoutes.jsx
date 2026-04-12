import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const PublicRoutes = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};