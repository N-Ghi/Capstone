import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchIcon, CloseIcon } from './Icons';
import { useSearch } from '../../hooks/useSearch';
import type { SearchType } from '../../store/slices/searchSlice';
import styles from './SearchTrigger.module.css';

const SearchTrigger: React.FC = () => {
  const { t } = useTranslation('common');
  const { isSearching, handleSearch, handleClear } = useSearch();

  const [open, setOpen]           = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [localType, setLocalType]   = useState<SearchType>('experience');

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const commit = () => {
    if (!localQuery.trim()) return;
    handleSearch(localQuery.trim(), localType);
    setOpen(false);
  };

  const clear = () => {
    handleClear();
    setLocalQuery('');
    setLocalType('experience');
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {/* Trigger */}
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label="Search"
      >
        <SearchIcon size={18} className={styles.triggerIcon} />
        {isSearching && <span className={styles.badge}>{t('search.active')}</span>}
      </button>

      {/* Dropdown */}
      {open && (
        <div className={styles.dropdown}>
          {/* Type toggle */}
          <div className={styles.toggle}>
            <button
              className={`${styles.toggleBtn} ${localType === 'experience' ? styles.toggleBtnActive : ''}`}
              onClick={() => setLocalType('experience')}
            >
              {t('search.experience')}
            </button>
            <button
              className={`${styles.toggleBtn} ${localType === 'guide' ? styles.toggleBtnActive : ''}`}
              onClick={() => setLocalType('guide')}
            >
              {t('search.guide')}
            </button>
          </div>

          {/* Input row */}
          <div className={styles.inputRow}>
            <input
              autoFocus
              type="text"
              placeholder={
                localType === 'guide'
                  ? t('search.guidePlaceholder')
                  : t('search.experiencePlaceholder')
              }
              value={localQuery}
              className={styles.input}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commit()}
            />
            <SearchIcon size={15} className={styles.searchIcon} onClick={commit} />
            {isSearching && (
              <CloseIcon size={15} className={styles.clearIcon} onClick={clear} />
            )}
          </div>

          <small className={styles.hint}>{t('search.hint')}</small>
        </div>
      )}
    </div>
  );
};

export default SearchTrigger;