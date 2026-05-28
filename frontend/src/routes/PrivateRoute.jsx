import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { isAdminRole } from "@/utils/roles";

export const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role) &&
    !(allowedRoles.includes("admin") && isAdminRole(user.role))
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
