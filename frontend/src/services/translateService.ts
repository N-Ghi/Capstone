const AZURE_KEY      = import.meta.env.VITE_AZURE_TRANSLATOR_KEY;
const AZURE_REGION   = import.meta.env.VITE_AZURE_TRANSLATOR_REGION;
const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_TRANSLATOR_ENDPOINT;

const AZURE_BATCH_LIMIT = 100;

const translateCache = new Map<string, string>();
const detectCache   = new Map<string, string>();

export async function detectLanguage(text: string): Promise<string> {
  if (!text?.trim()) return 'en';

  const cached = detectCache.get(text);
  if (cached) return cached;

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

async function translateBatchChunk(
  texts: string[],
  toLang: string,
  fromLang: string | undefined,
  results: string[],
  originalIndexes: number[],
  sourceTexts: string[],
): Promise<void> {
  const params = new URLSearchParams({ 'api-version': '3.0', to: toLang });
  if (fromLang) params.append('from', fromLang);

  const response = await fetch(`${AZURE_ENDPOINT}/translate?${params}`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key':    AZURE_KEY,
      'Ocp-Apim-Subscription-Region': AZURE_REGION,
      'Content-Type':                 'application/json',
    },
    body: JSON.stringify(texts.map((text) => ({ text }))),
  });

  if (!response.ok) throw new Error(`Azure Translator error: ${response.statusText}`);

  const data = await response.json();

  originalIndexes.forEach((originalIndex, batchIndex) => {
    const translated = data[batchIndex].translations[0].text;
    const cacheKey   = `${fromLang ?? 'auto'}:${toLang}:${sourceTexts[originalIndex]}`;
    translateCache.set(cacheKey, translated);
    results[originalIndex] = translated;
  });
}

export async function translateBatch(
  texts: string[],
  toLang: string,
  fromLang?: string,
): Promise<string[]> {
  if (!texts.length) return texts;

  const results: string[] = new Array(texts.length).fill('');
  const uncachedIndexes: number[] = [];

  texts.forEach((text, i) => {
    // Don't translate empty strings — return them as-is
    if (!text?.trim()) {
      results[i] = text ?? '';
      return;
    }
    const key = `${fromLang ?? 'auto'}:${toLang}:${text}`;
    const hit = translateCache.get(key);
    if (hit !== undefined) {
      results[i] = hit;
    } else {
      uncachedIndexes.push(i);
    }
  });

  if (uncachedIndexes.length === 0) return results;

  // Respect Azure's 100-element batch limit
  for (let i = 0; i < uncachedIndexes.length; i += AZURE_BATCH_LIMIT) {
    const chunkIndexes = uncachedIndexes.slice(i, i + AZURE_BATCH_LIMIT);
    const chunkTexts   = chunkIndexes.map((idx) => texts[idx]);
    await translateBatchChunk(chunkTexts, toLang, fromLang, results, chunkIndexes, texts);
  }

  return results;
}

export function clearCaches() {
  translateCache.clear();
  detectCache.clear();
}