import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateBatch, detectLanguage } from '../services/translateService';

/**
 * Generic translation hook.
 *
 * @param items    - Array of any objects
 * @param fields   - Which string fields to translate (e.g. ['title', 'description'])
 *
 * @example
 * // Experiences
 * const { translated } = useTranslatedData(experiences, ['title', 'description']);
 *
 * @example
 * // Reviews
 * const { translated } = useTranslatedData(reviews, ['comment']);
 *
 * @example
 * // Profiles
 * const { translated } = useTranslatedData(profiles, ['bio']);
 */
export function useTranslatedData<T extends object>(
  items: T[],
  fields: (keyof T)[],
  getSourceLang?: (item: T) => string
) {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<T[]>([]);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (!items.length) { setTranslated([]); return; }

    const run = async () => {
      setTranslating(true);
      try {
        // Detect source language 
        const sourceLang = getSourceLang
        ? getSourceLang(items[0])
        : await detectLanguage(items[0][fields[0]] as string);

        // Already in the right language — pass through
        if (sourceLang === i18n.language) {
          setTranslated(items);
          return;
        }

        // Translate each requested field in a single batch per field
        const translatedItems = [...items];
        for (const field of fields) {
          const texts = items.map((item) => (item[field] as string) ?? '');
          const results = await translateBatch(texts, i18n.language, sourceLang);
          results.forEach((text, i) => {
            translatedItems[i] = { ...translatedItems[i], [field]: text };
          });
        }

        setTranslated(translatedItems);
      } catch (err) {
        console.error('Translation failed, falling back to originals:', err);
        setTranslated(items);
      } finally {
        setTranslating(false);
      }
    };

    run();
  }, [items, i18n.language]);

  return { translated, translating };
}