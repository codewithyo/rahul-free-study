import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { phone, smsType = 0 } = await req.json();
    const CLIENT_ID = process.env.PW_CLIENT_ID || 'system-admin';
    const ORG = process.env.PW_ORG || '5eb393ee95fab7468a79d189';
    const CLIENT_SECRET = process.env.PW_CLIENT_SECRET || '';
    if (!CLIENT_ID) return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 });

    const API_BASE = process.env.PW_API_BASE || 'https://api.penpencil.co';

    const headers: any = { 'client-id': CLIENT_ID, 'org': ORG, 'client-type': 'WEB' };
    if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

    // Prefer dedicated resend endpoint; fallback to get-otp with smsType
    try {
      const res = await axios.post(`${API_BASE}/v1/users/resend-otp`, { phone, clientId: CLIENT_ID }, { timeout: 8000, headers });
      return NextResponse.json({ success: true, data: res.data });
    } catch (e) {
      // fallback: call get-otp with smsType
      const url = `${API_BASE}/v1/users/get-otp?smsType=${encodeURIComponent(String(smsType))}`;
      const response = await axios.get(url, { params: { phone, countryCode: '+91', clientId: CLIENT_ID }, headers });
      return NextResponse.json({ success: true, data: response.data });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.response?.data?.message || 'Failed to resend OTP' }, { status: 500 });
  }
}
