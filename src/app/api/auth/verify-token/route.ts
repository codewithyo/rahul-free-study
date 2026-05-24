import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const API_BASE = process.env.PW_API_BASE || 'https://api.penpencil.co';
    const ORG = process.env.PW_ORG || '5eb393ee95fab7468a79d189';
    const CLIENT_ID = process.env.PW_CLIENT_ID || 'system-admin';
    const CLIENT_SECRET = process.env.PW_CLIENT_SECRET || '';

    const headers: any = { 'client-id': CLIENT_ID, 'org': ORG, 'client-type': 'WEB' };
    if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

    const res = await axios.post(`${API_BASE}/v3/oauth/verify-token`, { token }, { timeout: 8000, headers });
    return NextResponse.json({ success: true, data: res.data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.response?.data?.message || 'Token verify failed' }, { status: 500 });
  }
}
