import axios from 'axios';

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
}