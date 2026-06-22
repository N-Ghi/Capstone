import BookingDetails from '../components/booking/BookingDetails';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';


const BookingDetailsPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{t('pageTitles.bookingDetails')}</title>
      </Helmet>
      <BookingDetails />
    </>
  );
};

export default BookingDetailsPage;