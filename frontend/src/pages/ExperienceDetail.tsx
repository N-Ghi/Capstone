import ExperienceDetailComponent from "../components/experiences/ExperienceDetails";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const ExperienceDetailPage = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Helmet>
        <title>{t('pageTitles.experienceDetail')}</title>
      </Helmet>
      <ExperienceDetailComponent />
    </>
    
  );
}

export default ExperienceDetailPage;