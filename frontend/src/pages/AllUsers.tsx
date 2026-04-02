import AllUsersComponent from "../components/admin/AllUsers";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';


const AllUsersPage: React.FC = () => {
    const { t } = useTranslation('common'); 
    return (
        <>
            <Helmet>
                <title>{t('pageTitles.allUsers')}</title>
            </Helmet>
            <AllUsersComponent />
        </>
    );
};

export default AllUsersPage;