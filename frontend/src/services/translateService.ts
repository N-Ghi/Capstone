const AZURE_KEY      = import.meta.env.VITE_AZURE_TRANSLATOR_KEY;
const AZURE_REGION   = import.meta.env.VITE_AZURE_TRANSLATOR_REGION;
const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_TRANSLATOR_ENDPOINT;

const translateCache = new Map<string, string>();
const detectCache   = new Map<string, string>();

// ── Detect ────────────────────────────────────────────────────────────────

export async function detectLanguage(text: string): Promise<string> {
  if (!text) return 'en';
  if (detectCache.has(text)) return detectCache.get(text)!;

  const response = await fetch(`${AZURE_ENDPOINT}/detect?api-version=3.0`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key':    AZURE_KEY,
      'Ocp-Apim-Subscription-Region': AZURE_REGION,
      'Content-Type':                 'application/json',
    },
    body: JSON.stringify([{ text }]),
  });

  if (!response.ok) throw new Error(`Azure Detect error: ${response.statusText}`);

  const data = await response.json();
  const lang: string = data[0].language;
  detectCache.set(text, lang);
  return lang;
}

// ── Translate ─────────────────────────────────────────────────────────────

export async function translateBatch(
  texts: string[],
  toLang: string,
  fromLang?: string   // if omitted, Azure auto-detects per item
): Promise<string[]> {
  if (!texts.length) return texts;

  const params = new URLSearchParams({ 'api-version': '3.0', to: toLang });
  if (fromLang) params.append('from', fromLang);

  // Split into cached / uncached
  const results: string[] = new Array(texts.length).fill('');
  const uncachedIndexes: number[] = [];

  texts.forEach((text, i) => {
    const key = `${fromLang ?? 'auto'}:${toLang}:${text}`;
    if (translateCache.has(key)) {
      results[i] = translateCache.get(key)!;
    } else {
      uncachedIndexes.push(i);
    }
  });

  if (uncachedIndexes.length === 0) return results;

  const response = await fetch(`${AZURE_ENDPOINT}/translate?${params}`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key':    AZURE_KEY,
      'Ocp-Apim-Subscription-Region': AZURE_REGION,
      'Content-Type':                 'application/json',
    },
    body: JSON.stringify(uncachedIndexes.map((i) => ({ text: texts[i] }))),
  });

  if (!response.ok) throw new Error(`Azure Translator error: ${response.statusText}`);

  const data = await response.json();
  uncachedIndexes.forEach((originalIndex, batchIndex) => {
    const text      = data[batchIndex].translations[0].text;
    const cacheKey  = `${fromLang ?? 'auto'}:${toLang}:${texts[originalIndex]}`;
    translateCache.set(cacheKey, text);
    results[originalIndex] = text;
  });

  return results;
}