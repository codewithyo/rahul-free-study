import { NextResponse } from 'next/server';
import axios from 'axios';
import { CLIENT_ID, ORG, CLIENT_SECRET, API_BASE } from '../../../../lib/upstream';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let token = body?.token || body?.access_token || body?.t || null;
    if (!token) {
      const auth = req.headers.get('authorization') || '';
      if (auth.startsWith('Bearer ')) token = auth.slice(7).trim();
    }

    if (!token) return NextResponse.json({ success: false, message: 'token required' }, { status: 400 });

    const headers: any = { 'client-id': CLIENT_ID, 'org': ORG, 'client-type': 'WEB' };
    if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

    const res = await axios.post(`${API_BASE}/v3/oauth/verify-token`, { token }, { timeout: 8000, headers });
    const data = res.data;

    const out = NextResponse.json({ success: true, data });
    // set cookie so subsequent requests use pw_token
    out.cookies.set('pw_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax'
    });
    return out;
  } catch (error: any) {
    const msg = error?.response?.data || error?.message || 'Token verify failed';
    return NextResponse.json({ success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) }, { status: 500 });
  }
}
