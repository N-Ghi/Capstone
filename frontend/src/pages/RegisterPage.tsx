import { useLocation, Navigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

type Role = "Tourist" | "Guide";

const RegisterPage: React.FC = () => {
  const location = useLocation();
  const role = location.state?.role as Role | undefined;

  // If user accesses /register directly without role
  if (!role) {
    return <Navigate to="/" replace />;
  }

  return <RegisterForm role={role} />;
};

export default RegisterPage;