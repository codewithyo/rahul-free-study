import { getRandomId } from './session';

const PUBLIC_CLIENT_ID = process.env.NEXT_PUBLIC_PW_CLIENT_ID || '';
const PUBLIC_ORG = process.env.NEXT_PUBLIC_PW_ORG || '';

export function hdrs(auth = false, contentType = 'application/json') {
  const randomId = getRandomId();
  const h: any = {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': contentType,
    'client-id': PUBLIC_CLIENT_ID,
    'client-type': 'WEB',
    'randomId': randomId,
    'organizationId': PUBLIC_ORG,
  };
  // Do NOT place sensitive tokens in localStorage. Server should set HttpOnly pw_token cookie.
  // When auth is true we still rely on the browser to send the cookie (credentials: 'include').
  return h;
}

export function buildUrl(path: string, params?: Record<string, any>) {
  // Prefer relative API paths (server proxies) like '/api/auth/get-otp' or '/api/AllBatches'
  let url = path.startsWith('/') ? path : '/' + path;
  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;
  }
  return url;
}

export async function api(method: string, path: string, body?: any, auth = false, params?: Record<string, any>) {
  const url = buildUrl(path, params);
  const opts: RequestInit = {
    method,
    headers: hdrs(auth, 'application/json'),
    credentials: 'include', // ensure cookies (pw_token) are sent
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  const j = await r.json().catch(() => ({ message: 'HTTP ' + r.status }));
  if (!r.ok) throw new Error(
    j?.message || j?.error || j?.error_description || j?.data?.message || 'HTTP ' + r.status
  );
  return j;
}

export async function apiForm(method: string, path: string, body?: Record<string, any>, auth = false, params?: Record<string, any>) {
  const url = buildUrl(path, params);
  const headers = hdrs(auth, 'application/x-www-form-urlencoded');
  const opts: RequestInit = { method, headers, credentials: 'include' };
  if (body) {
    opts.body = Object.entries(body)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
  }
  const r = await fetch(url, opts);
  const j = await r.json().catch(() => ({ message: 'HTTP ' + r.status }));
  if (!r.ok) throw new Error(j?.message || 'HTTP ' + r.status);
  return j;
}
