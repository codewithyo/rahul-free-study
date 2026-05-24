import { NextResponse } from 'next/server';
import axios from 'axios';
import { CLIENT_ID, ORG, CLIENT_SECRET, API_BASE } from '../../../../lib/upstream';

export async function POST(req: Request) {
  try {
    const { } = await req.json().catch(() => ({}));
    // attempt to logout upstream
    try {
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
