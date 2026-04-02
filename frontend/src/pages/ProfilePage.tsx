import ProfileComponent from './../components/Profile';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';


const ProfilePage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{`${t('pageTitles.profile')}`}</title>
      </Helmet>
      <ProfileComponent />
    </>
  );
};

export default ProfilePage;