import { env } from '@/config/env';

export function buildApiUrl(path) {
  const base = env.apiBaseUrl.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
