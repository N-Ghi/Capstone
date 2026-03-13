import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectLanguage, translateBatch, clearCaches } from '../services/translateService';

// Helpers

function mockFetchResponse(body: unknown, ok = true, statusText = 'OK') {
  return vi.fn().mockResolvedValue({
    ok,
    statusText,
    json: () => Promise.resolve(body),
  });
}

function makeDetectResponse(language: string) {
  return [{ language, score: 1.0 }];
}

function makeTranslateResponse(translations: string[]) {
  return translations.map((text) => ({ translations: [{ text, to: 'en' }] }));
}

// detectLanguage

describe('detectLanguage', () => {
  beforeEach(() => {
    clearCaches();
    vi.stubGlobal('fetch', mockFetchResponse(makeDetectResponse('rw')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns detected language from Azure', async () => {
    const lang = await detectLanguage('Mwiriwe mwese hano');
    expect(lang).toBe('rw');
  });

  it('calls Azure detect endpoint with correct headers and body', async () => {
    await detectLanguage('Mwiriwe mwese hano');
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('/detect');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(options.body)).toEqual([{ text: 'Mwiriwe mwese hano' }]);
  });

  it('returns "en" immediately for empty string without calling fetch', async () => {
    const lang = await detectLanguage('');
    expect(lang).toBe('en');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('throws when Azure detect returns a non-ok response', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(null, false, 'Unauthorized'));
    await expect(detectLanguage('Hello')).rejects.toThrow('Azure Detect error: Unauthorized');
  });

  it('returns cached result on second call without hitting fetch again', async () => {
    await detectLanguage('Mwiriwe mwese hano');
    await detectLanguage('Mwiriwe mwese hano');
    expect((fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1);
  });
});

// translateBatch

describe('translateBatch', () => {
  beforeEach(() => {
    clearCaches();
    vi.stubGlobal('fetch', mockFetchResponse(makeTranslateResponse(['Hello', 'World'])));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns translated texts in original order', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(makeTranslateResponse(['Hello', 'World'])));
    const result = await translateBatch(['Bonjour', 'Monde'], 'en', 'fr');
    expect(result).toEqual(['Hello', 'World']);
  });

  it('returns empty array immediately for empty input without calling fetch', async () => {
    const result = await translateBatch([], 'en');
    expect(result).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('includes "from" param in URL when fromLang is provided', async () => {
    const fetchMock = mockFetchResponse(makeTranslateResponse(['Hello']));
    vi.stubGlobal('fetch', fetchMock);

    await translateBatch(['Bonjour'], 'en', 'fr');

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('from=fr');
    expect(url).toContain('to=en');
  });

  it('omits "from" param when fromLang is not provided (auto-detect)', async () => {
    const fetchMock = mockFetchResponse(makeTranslateResponse(['Hello']));
    vi.stubGlobal('fetch', fetchMock);

    await translateBatch(['Bonjour'], 'en');

    const [url] = fetchMock.mock.calls[0];
    expect(url).not.toContain('from=');
    expect(url).toContain('to=en');
  });

  it('throws when Azure translate returns a non-ok response', async () => {
    vi.stubGlobal('fetch', mockFetchResponse(null, false, 'Bad Request'));
    await expect(translateBatch(['Hello'], 'fr')).rejects.toThrow(
      'Azure Translator error: Bad Request'
    );
  });

  it('only sends uncached texts to Azure on repeated calls', async () => {
    const firstFetch = mockFetchResponse(makeTranslateResponse(['Hello', 'World']));
    vi.stubGlobal('fetch', firstFetch);
    await translateBatch(['Bonjour', 'Monde'], 'en', 'fr');

    const secondFetch = mockFetchResponse(makeTranslateResponse([]));
    vi.stubGlobal('fetch', secondFetch);
    const result = await translateBatch(['Bonjour', 'Monde'], 'en', 'fr');

    expect(secondFetch).not.toHaveBeenCalled();
    expect(result).toEqual(['Hello', 'World']);
  });

  it('sends only uncached items when batch is partially cached', async () => {
    // Populate cache with first text only
    const firstFetch = mockFetchResponse(makeTranslateResponse(['Hello']));
    vi.stubGlobal('fetch', firstFetch);
    await translateBatch(['Bonjour'], 'en', 'fr');

    // Second call — 'Bonjour' is cached, only 'Monde' should be sent
    const secondFetch = mockFetchResponse(makeTranslateResponse(['World']));
    vi.stubGlobal('fetch', secondFetch);
    const result = await translateBatch(['Bonjour', 'Monde'], 'en', 'fr');

    expect(result).toEqual(['Hello', 'World']);
    const body = JSON.parse(secondFetch.mock.calls[0][1].body);
    expect(body).toEqual([{ text: 'Monde' }]);
  });

  it('uses auto cache key when fromLang is omitted', async () => {
    const firstFetch = mockFetchResponse(makeTranslateResponse(['Hello']));
    vi.stubGlobal('fetch', firstFetch);
    await translateBatch(['Bonjour'], 'en');

    const secondFetch = mockFetchResponse(makeTranslateResponse([]));
    vi.stubGlobal('fetch', secondFetch);
    await translateBatch(['Bonjour'], 'en');

    expect(secondFetch).not.toHaveBeenCalled();
  });
});