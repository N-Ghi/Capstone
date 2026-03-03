import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getPaymentMethods, getMobileProviders } from '../../services/choiceService';
import styles from './PaymentForm.module.css';
import { useTranslation } from 'react-i18next';


interface Props {
  onSubmit: (data: any) => void;
  loading: boolean;
}

const PaymentForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const { t } = useTranslation('payment');
  const [methods,  setMethods]  = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  const [selectedMethod,   setSelectedMethod]   = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [number, setNumber] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [methodsData, providersData] = await Promise.all([
          getPaymentMethods(),
          getMobileProviders(),
        ]);
        setMethods(methodsData);
        setProviders(providersData);
      } catch (err) {
        console.error('Failed to load payment options', err);
      }
    })();
  }, []);

  useEffect(() => {
    const method = methods.find((m) => m.id === selectedMethod);
    if (!method) return;
    if (method.name === 'Mobile') {
      setIsMobile(true);
    } else {
      setIsMobile(false);
      setSelectedProvider('');
    }
  }, [selectedMethod, methods]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      method_id: selectedMethod,
      provider_id: isMobile ? selectedProvider : null,
      number,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>

      {/* Payment method */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="pf-method">{t('paymentForm.methodLabel')}</label>
        <select
          id="pf-method"
          className={styles.select}
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          required
        >
          <option value="">{t('paymentForm.selectMethod')}</option>
          {methods.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Mobile provider */}
      {isMobile && (
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pf-provider">
            {t('paymentForm.providerLabel')}
          </label>
          <select
            id="pf-provider"
            className={styles.select}
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            required
          >
            <option value="">{t('paymentForm.selectProvider')}</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Number */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="pf-number">
          {isMobile ? t('paymentForm.phoneNumber') : t('paymentForm.cardNumber')}
        </label>
        <input
          id="pf-number"
          type="text"
          className={styles.input}
          placeholder={isMobile ? 'e.g. 0780000002' : 'e.g. 4111111111111112'}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading && <Loader2 size={15} className={styles.spin} />}
        {loading ? t('paymentForm.processing') : t('paymentForm.submitButton')}
      </button>

      {/* Test helper */}
      <div className={styles.testHelper}>
        <p className={styles.testHelperTitle}>Test numbers</p>
        <ul className={styles.testHelperList}>
          <li className={styles.success}>0780000002 — Mobile success</li>
          <li className={styles.failed}>0780000003 — Mobile failed</li>
          <li className={styles.success}>4111111111111112 — Card success</li>
        </ul>
      </div>

    </form>
  );
};

export default PaymentForm;