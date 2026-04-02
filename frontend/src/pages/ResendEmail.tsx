import ResendEmail from "../components/auth/ResendEmail";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const ResendEmailPage: React.FC = () => {
    const { t } = useTranslation('common');
    return (
        <div>
            <Helmet>
                <title>{`${t('pageTitles.resendEmail')}`}</title>
            </Helmet>
            <ResendEmail />
        </div>
    );
};

export default ResendEmailPage;