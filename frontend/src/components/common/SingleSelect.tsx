import { useTranslation } from 'react-i18next';
import React, { useState, useRef, useEffect } from 'react';
import styles from './MultiSelect.module.css';
import { DropdownIcon } from './Icons';

export interface SelectOption {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface SingleSelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  label, options, value, onChange, placeholder, loading = false, disabled = false,
}) => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!placeholder) {
    placeholder = t('multiSelect.placeholder');
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedOption = options.find((o) => o.id === value);

  const controlClass = [
    styles.control,
    open ? styles.controlOpen : '',
    disabled ? styles.controlDisabled : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <label className={styles.label}>{label}</label>

      <div
        className={controlClass}
        onClick={() => !disabled && !loading && setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && setOpen((v) => !v)}
      >
        <div className={styles.pills}>
          {selectedOption ? (
            <span className={styles.pill}>
              {selectedOption.name}
              <button
                type="button"
                className={styles.pillRemove}
                onClick={(e) => { e.stopPropagation(); onChange(''); }}
              >
                ×
              </button>
            </span>
          ) : (
            <span className={styles.placeholder}>
              {loading ? t('multiSelect.loading') : placeholder}
            </span>
          )}
        </div>
        <span className={`${styles.chevron}${open ? ` ${styles.chevronUp}` : ''}`}>
          <DropdownIcon size={14} />
        </span>
      </div>

      {open && (
        <div className={styles.dropdown}>
          {options.length === 0 ? (
            <p className={styles.empty}>No options available</p>
          ) : (
            options.map((option) => {
              const isSelected = value === option.id;
              return (
                <div
                  key={option.id}
                  className={`${styles.option}${isSelected ? ` ${styles.optionSelected}` : ''}`}
                  onClick={() => { onChange(option.id); setOpen(false); }}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && (onChange(option.id), setOpen(false))}
                >
                  <span className={styles.check} />
                  <span className={styles.optionName}>{option.name}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SingleSelect;