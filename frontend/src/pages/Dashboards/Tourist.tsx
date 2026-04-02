import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import TouristDashboard from '../../components/dashboards/Tourist';

const TouristDashboardPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.touristDashboard')}</title>
      </Helmet>
      <TouristDashboard />
    </>
  );
};

export default TouristDashboardPage;