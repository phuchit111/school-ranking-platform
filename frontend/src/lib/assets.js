/**
 * Helpers to build absolute URLs for files served by the backend at /uploads.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export function resolveAssetUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE}${path}`;
}

export const API_BASE_URL = API_BASE;
