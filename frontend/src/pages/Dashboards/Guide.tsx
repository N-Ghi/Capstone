import GuideDashboard from "../../components/dashboards/Guide";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';


const GuideDashboardPage = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Helmet>
        <title>{t('pageTitles.guideDashboard')}</title>
      </Helmet>
      <GuideDashboard />
    
    </>
  );
}

export default GuideDashboardPage;