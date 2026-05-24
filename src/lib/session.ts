export function saveSession(mobile: string | null, userData: any | null, randomId?: string) {
  try {
    const item = { mobile, randomId, userData, ts: Date.now() };
    localStorage.setItem('pw_session', JSON.stringify(item));
  } catch (e) { /* ignore */ }
}

export function loadSession(): { mobile?: string; randomId?: string; userData?: any; ts?: number } | null {
  try {
    const s = localStorage.getItem('pw_session');
    return s ? JSON.parse(s) : null;
  } catch (e) { return null; }
}

export function clearSession() {
  try { localStorage.removeItem('pw_session'); } catch (e) { }
}

export function generateRandomId() {
  // simple RFC4122 v4-like generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getRandomId(): string {
  try {
    const s = loadSession();
    if (s?.randomId) return s.randomId;
    const stored = localStorage.getItem('randomId') || localStorage.getItem('uuid');
    if (stored) return stored;
    const id = generateRandomId();
    try { localStorage.setItem('randomId', id); } catch {}
    return id;
  } catch (e) {
    const id = generateRandomId();
    try { localStorage.setItem('randomId', id); } catch {}
    return id;
  }
}
