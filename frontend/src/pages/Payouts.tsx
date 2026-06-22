import GuidePayouts from '../components/payment/Payouts';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';


const PayoutsPage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Helmet>
        <title>{t('pageTitles.payouts')}</title>
      </Helmet>
      <GuidePayouts />
    </>
  );
};

export default PayoutsPage;