import PayoutDetails from '../components/payment/PayoutDetails';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';


const PayoutDetailsPage = () => {
    const { t } = useTranslation('common');
    return (
        <>
            <Helmet>
                <title>{t('pageTitles.payoutDetails')}</title>
            </Helmet>
            <PayoutDetails />
        </>
    );
};

export default PayoutDetailsPage;