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
  // Track the last input we processed so we don't re-run for the same data
  const lastRunKey = useRef<string>('');

  const itemsKey = useMemo(() => JSON.stringify(items), [items]);
  const stableItems = useMemo(() => items, [itemsKey]);

  useEffect(() => {
    if (!stableItems.length) {
      setTranslated([]);
      return;
    }

    const runKey = `${itemsKey}:${i18n.language}`;
    if (lastRunKey.current === runKey) return; // already processed this exact input
    lastRunKey.current = runKey;

    const runId = ++runIdRef.current;

    const run = async () => {
      setTranslating(true);
      try {
        const sampleText = stableItems
          .flatMap((item) => fields.map((f) => item[f] as string))
          .find((v) => v?.trim());

        const sourceLang = getSourceLang
          ? getSourceLang(stableItems[0])
          : await detectLanguage(sampleText ?? '');

        if (runId !== runIdRef.current) return;

        if (sourceLang === i18n.language) {
          setTranslated(stableItems);
          return;
        }

        const translatedItems = stableItems.map((item) => ({ ...item }));

        for (const field of fields) {
          const texts   = stableItems.map((item) => (item[field] as string) ?? '');
          const results = await translateBatch(texts, i18n.language, sourceLang);

          if (runId !== runIdRef.current) return;

          results.forEach((text, i) => {
            translatedItems[i] = { ...translatedItems[i], [field]: text };
          });
        }

        setTranslated(translatedItems);
      } catch (err) {
        console.error('Translation failed, falling back to originals:', err);
        if (runId === runIdRef.current) setTranslated(stableItems);
      } finally {
        if (runId === runIdRef.current) setTranslating(false);
      }
    };

    run();
  }, [stableItems, i18n.language, getSourceLang]);

  return { translated, translating };
}