import { useTranslation } from "react-i18next";
import LoginForm from "../components/auth/LoginForm";
import {Helmet} from "react-helmet-async";
const LoginPage: React.FC = () => {
    const { t } = useTranslation('common');
    return (
        <div>
            <Helmet>
                <title>{`${t('pageTitles.login')}`}</title>
            </Helmet>
            <LoginForm />
        </div>
    );
};

export default LoginPage;