import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.split(';').map(s => s.trim()).find(s => s.startsWith('pw_token='));
    const token = match ? match.split('=')[1] : null;

    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

    const API_BASE = process.env.PW_API_BASE || 'https://api.penpencil.co';

    // verify token with upstream
    try {
      const CLIENT_ID = process.env.PW_CLIENT_ID || 'system-admin';
      const ORG = process.env.PW_ORG || '5eb393ee95fab7468a79d189';
      const CLIENT_SECRET = process.env.PW_CLIENT_SECRET || '';
      const headers: any = { 'client-id': CLIENT_ID, 'org': ORG, 'client-type': 'WEB' };
      if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

      const res = await axios.post(`${API_BASE}/v3/oauth/verify-token`, { token }, { timeout: 8000, headers });
      const data = res.data;
      return NextResponse.json({ success: true, data });
    } catch (e: any) {
      return NextResponse.json({ success: false, message: e.response?.data?.message || 'Invalid token' }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error' }, { status: 500 });
  }
}
