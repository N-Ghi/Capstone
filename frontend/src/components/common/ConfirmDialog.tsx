import { useTranslation } from 'react-i18next';
import React from 'react';
import styles from './ConfirmDialog.module.css';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmLabel?: string;
}

const ConfirmDialog: React.FC<Props> = ({ message, onConfirm, onCancel, loading, confirmLabel = 'Delete', }) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <p className={styles.dialogMsg}>{message}</p>
        <div className={styles.dialogActions}>
          <button className={styles.btnSecondary} onClick={onCancel} disabled={loading}>
            {t('confirmDialog.cancel')}
          </button>
          <button className={styles.btnDanger} onClick={onConfirm} disabled={loading}>
            {loading ? t('confirmDialog.deleting') : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;