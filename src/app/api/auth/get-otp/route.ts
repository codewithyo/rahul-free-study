import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = (body?.phone || body?.mobile || body?.msisdn || "").toString();
    const smsType = body?.smsType ?? 0;
    if (!phone || phone.replace(/\D/g, "").length < 6) {
      return NextResponse.json({ success: false, message: 'phone is required' }, { status: 400 });
    }
    const CLIENT_ID = process.env.PW_CLIENT_ID || 'system-admin';
    const ORG = process.env.PW_ORG || '5eb393ee95fab7468a79d189';
    const CLIENT_SECRET = process.env.PW_CLIENT_SECRET || '';
    if (!CLIENT_ID) return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 });

    const API_BASE = process.env.PW_API_BASE || 'https://api.penpencil.co';

    // upstream expects query param smsType for channel (0=sms,1=whatsapp)
    const url = `${API_BASE}/v1/users/get-otp?smsType=${encodeURIComponent(String(smsType))}`;

    const headers: any = { 'client-id': CLIENT_ID, 'org': ORG, 'client-type': 'WEB' };
    if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

    const response = await axios.get(url, {
      params: { phone: phone, countryCode: '+91', clientId: CLIENT_ID },
      headers,
      timeout: 8000,
    });

    // unify token id extraction
    const tokenId = response.data?.data?.t || response.data?.data?.token || response.data?.token || null;
    return NextResponse.json({ success: true, data: response.data, token: tokenId });
  } catch (error: any) {
    const msg = error?.response?.data || error?.message || 'Failed to get OTP';
    return NextResponse.json({ success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) }, { status: 500 });
  }
}
