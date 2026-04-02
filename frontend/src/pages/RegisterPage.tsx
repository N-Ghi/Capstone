import { useLocation, Navigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';


type Role = "Tourist" | "Guide";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const role = location.state?.role as Role | undefined;

  // If user accesses /register directly without role
  if (!role) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{`${t(`pageTitles.${role}Register`)}`}</title>
      </Helmet>
      <RegisterForm role={role} />
    </>
  );
};

export default RegisterPage;