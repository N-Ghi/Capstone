import { useTranslation } from 'react-i18next';
import React, { useState, useRef, useEffect } from 'react';
import styles from './MultiSelect.module.css';
import { DropdownIcon, CheckIcon } from './Icons';

export interface SelectOption {
  id: string;
  name: string;
  [key: string]: any;
}

interface MultiSelectProps {
  label: string;
  options: SelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label, options, selected, onChange, placeholder, loading = false, disabled = false, }) => {
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

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const selectedOptions = options.filter((o) => selected.includes(o.id));

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
          {selectedOptions.length === 0 ? (
            <span className={styles.placeholder}>
              {loading ? t('multiSelect.loading') : placeholder}
            </span>
          ) : (
            selectedOptions.map((o) => (
              <span key={o.id} className={styles.pill}>
                {o.name}
                <button
                  type="button"
                  className={styles.pillRemove}
                  onClick={(e) => { e.stopPropagation(); toggle(o.id); }}
                >
                  ×
                </button>
              </span>
            ))
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
              const isSelected = selected.includes(option.id);
              return (
                <div
                  key={option.id}
                  className={`${styles.option}${isSelected ? ` ${styles.optionSelected}` : ''}`}
                  onClick={() => toggle(option.id)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggle(option.id)}
                >
                  <span className={styles.check}>
                    {isSelected && (
                      <CheckIcon size={14} />
                    )}
                  </span>
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

export default MultiSelect;