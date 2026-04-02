import AdminDashboard from "../../components/dashboards/Admin";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const AdminDashboardPage = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Helmet>
        <title>{t('pageTitles.adminDashboard')}</title>
      </Helmet>
      <AdminDashboard />
    </>
  );
}

export default AdminDashboardPage;