import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translateBatch, detectLanguage } from '../services/translateService';

export function useTranslatedData<T extends object>(
  items: T[],
  fields: (keyof T)[],
  getSourceLang?: (item: T) => string,
) {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<T[]>([]);
  const [translating, setTranslating] = useState(false);
  const runIdRef = useRef(0);
  const lastRunKey = useRef<string>('');

  // Single stable serialization — use this as the real dep for the effect
  const itemsKey = useMemo(() => JSON.stringify(items), [items]);

  // Stable callback ref so getSourceLang never triggers re-runs
  const getSourceLangRef = useRef(getSourceLang);
  useEffect(() => {
    getSourceLangRef.current = getSourceLang;
  });

  useEffect(() => {
    if (!items.length) {
      setTranslated([]);
      return;
    }

    const runKey = `${itemsKey}:${i18n.language}`;
    if (lastRunKey.current === runKey) return;
    lastRunKey.current = runKey;

    const runId = ++runIdRef.current;
    // Snapshot items at the time this effect fires
    const snapshot = items;

    const run = async () => {
      setTranslating(true);
      try {
        const sampleText = snapshot
          .flatMap((item) => fields.map((f) => item[f] as string))
          .find((v) => v?.trim());

        const sourceLang = getSourceLangRef.current
          ? getSourceLangRef.current(snapshot[0])
          : await detectLanguage(sampleText ?? '');

        if (runId !== runIdRef.current) return;

        if (sourceLang === i18n.language) {
          setTranslated(snapshot);
          return;
        }

        let translatedItems = snapshot.map((item) => ({ ...item }));

        for (const field of fields) {
          const texts = snapshot.map((item) => (item[field] as string) ?? '');
          const results = await translateBatch(texts, i18n.language, sourceLang);

          if (runId !== runIdRef.current) return;

          translatedItems = translatedItems.map((item, i) => ({
            ...item,
            [field]: results[i],
          }));
        }

        setTranslated(translatedItems);
      } catch (err) {
        console.error('Translation failed, falling back to originals:', err);
        if (runId === runIdRef.current) setTranslated(snapshot);
      } finally {
        if (runId === runIdRef.current) setTranslating(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey, i18n.language]);

  return { translated, translating };
}