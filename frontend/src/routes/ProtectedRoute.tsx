import { useTranslation } from 'react-i18next';
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../@types/auth.types";
import type { JSX } from "react/jsx-dev-runtime";

interface Props {
  children: JSX.Element;
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { t } = useTranslation('auth');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", {
        replace: true,
        state: {
          message: t('login.required'),
          from: location.pathname + location.search,
        },
      });
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;