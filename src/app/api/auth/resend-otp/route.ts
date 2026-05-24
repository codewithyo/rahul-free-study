import { NextResponse } from 'next/server';
import axios from 'axios';
import { CLIENT_ID, ORG, CLIENT_SECRET, API_BASE } from '../../../../lib/upstream';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = (body?.phone || body?.mobile || body?.msisdn || "").toString();
    const smsType = body?.smsType ?? 0;
    if (!CLIENT_ID) return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 });

    const headers: any = { 'client-id': CLIENT_ID, 'org': ORG, 'client-type': 'WEB', version: '54' };
    if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

    // Prefer dedicated resend endpoint; fallback to get-otp with smsType
    try {
      const res = await axios.post(`${API_BASE}/v1/users/resend-otp`, { phone, clientId: CLIENT_ID }, { timeout: 8000, headers });
      const message = res.data?.message || res.data?.data?.message || res.data?.msg || '';
      return NextResponse.json({ success: true, data: res.data, message });
    } catch (e) {
      // fallback: call get-otp with smsType
      const url = `${API_BASE}/v1/users/get-otp?smsType=${encodeURIComponent(String(smsType))}`;
      const response = await axios.get(url, { params: { phone, countryCode: '+91', clientId: CLIENT_ID }, headers });
      const message = response.data?.message || response.data?.data?.message || response.data?.msg || '';
      return NextResponse.json({ success: true, data: response.data, message });
    }
  } catch (error: any) {
    const err = error?.response?.data || error?.message || 'Failed to resend OTP';
    const msg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
