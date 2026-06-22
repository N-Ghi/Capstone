import CommonProfileComponent from "../components/CommonProfile";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';


const CommonProfilePage = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Helmet>
        <title>{t('pageTitles.commonProfile')}</title>
      </Helmet>
      <CommonProfileComponent />
    </>
  );
}

export default CommonProfilePage;