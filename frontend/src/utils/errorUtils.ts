import axios from 'axios';

export type ApiError =
  | { kind: 'field'; fields: Record<string, string> }
  | { kind: 'message'; message: string };

const NON_FIELD_KEYS = new Set(['detail', 'error', 'message', 'non_field_errors']);

function isFieldErrorMap(data: unknown): data is Record<string, unknown> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const keys = Object.keys(data);
  return (
    keys.length > 0 &&
    keys.every(k => !NON_FIELD_KEYS.has(k)) &&
    Object.values(data as Record<string, unknown>).every(
      v => typeof v === 'string' || Array.isArray(v)
    )
  );
}

export function getApiError(err: unknown, fallback: string): ApiError {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return { kind: 'message', message: 'Network error, please check your connection.' };
    }

    const { status, data } = err.response;

    if (status === 429) {
      return { kind: 'message', message: 'Too many attempts. Please wait and try again.' };
    }
    if (status >= 500) {
      return { kind: 'message', message: 'Something went wrong on our end. Please try again.' };
    }

    // Nested: { errors: { field: [...] } }
    if (data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
      const fields: Record<string, string> = {};
      for (const [key, val] of Object.entries(data.errors as Record<string, unknown>)) {
        fields[key] = Array.isArray(val) ? val[0] : String(val);
      }
      return { kind: 'field', fields };
    }

    // Root-level: { username: [...], email: [...] }
    if (isFieldErrorMap(data)) {
      const fields: Record<string, string> = {};
      for (const [key, val] of Object.entries(data)) {
        fields[key] = Array.isArray(val) ? val[0] : String(val);
      }
      return { kind: 'field', fields };
    }

    // Single error string: { error: "..." } or { detail: "..." }
    const message = data?.error ?? data?.detail ?? data?.message;
    if (typeof message === 'string' && message.trim()) {
      return { kind: 'message', message };
    }
  }

  if (err instanceof Error) console.error('[Unexpected error]', err);
  return { kind: 'message', message: fallback };
}

export function getApiErrorString(err: unknown, fallback: string): string {
  const result = getApiError(err, fallback);
  return result.kind === 'field'
    ? Object.values(result.fields).join(', ')
    : result.message;
}