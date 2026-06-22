import ExperienceForm from "../components/experiences/ExperienceForm";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';


const ExperienceFormPage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Helmet>
        <title>{t('pageTitles.experienceForm')}</title>
      </Helmet>
      <ExperienceForm />
    </>
    );
};

export default ExperienceFormPage;