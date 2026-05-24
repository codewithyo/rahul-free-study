import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { } = await req.json().catch(() => ({}));
    const API_BASE = process.env.PW_API_BASE || 'https://api.penpencil.co';

    // attempt to logout upstream
    try {
      const CLIENT_ID = process.env.PW_CLIENT_ID || 'system-admin';
      const ORG = process.env.PW_ORG || '5eb393ee95fab7468a79d189';
      const CLIENT_SECRET = process.env.PW_CLIENT_SECRET || '';
      const headers: any = { 'client-type': 'WEB', 'client-id': CLIENT_ID, org: ORG };
      if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;
      await axios.post(`${API_BASE}/v1/oauth/logout`, {}, { timeout: 5000, headers });
    } catch (e) { /* ignore */ }

    const res = NextResponse.json({ success: true });
    // clear cookie
    res.cookies.set('pw_token', '', { maxAge: 0, path: '/' });
    return res;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
}
