import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { } = await req.json().catch(() => ({}));
    const API_BASE = process.env.PW_API_BASE || 'https://api.penpencil.co';

    // attempt to logout upstream
    try { await axios.post(`${API_BASE}/v1/oauth/logout`, {}, { timeout: 5000, headers: { 'client-type': 'WEB' } }); } catch (e) { /* ignore */ }

    const res = NextResponse.json({ success: true });
    // clear cookie
    res.cookies.set('pw_token', '', { maxAge: 0, path: '/' });
    return res;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
}
