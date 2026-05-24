import { NextResponse } from 'next/server';
import axios from 'axios';
import { CLIENT_ID, ORG, CLIENT_SECRET, API_BASE } from '../../../../lib/upstream';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    // token may be provided in body, Authorization header, or cookie
    let token = body?.token || body?.access_token || body?.t || null;
    if (!token) {
      const auth = req.headers.get('authorization') || req.headers.get('Authorization') || '';
      if (auth.startsWith('Bearer ')) token = auth.slice(7).trim();
    }
    if (!token) {
      const cookie = req.headers.get('cookie') || '';
      const match = cookie.split(';').map(s => s.trim()).find(s => s.startsWith('pw_token='));
      if (match) token = match.split('=')[1];
    }
    const headers: any = { 'client-id': CLIENT_ID, 'org': ORG, 'client-type': 'WEB' };
    if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;
    if (!token) return NextResponse.json({ success: false, message: 'token required' }, { status: 400 });

    const res = await axios.post(`${API_BASE}/v3/oauth/verify-token`, { token }, { timeout: 8000, headers });
    return NextResponse.json({ success: true, data: res.data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.response?.data?.message || 'Token verify failed' }, { status: 500 });
  }
}
