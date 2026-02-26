import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../@types/auth.types";
import type { JSX } from "react/jsx-dev-runtime";

interface Props {
  children: JSX.Element;
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role restriction
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;