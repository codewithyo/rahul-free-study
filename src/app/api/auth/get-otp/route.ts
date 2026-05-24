import { NextResponse } from 'next/server';
import axios from 'axios';
import { CLIENT_ID, ORG, CLIENT_SECRET, API_BASE } from '../../../../lib/upstream';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = (body?.phone || body?.mobile || body?.msisdn || "").toString();
    const smsType = body?.smsType ?? 0;
    if (!phone || phone.replace(/\D/g, "").length < 6) {
      return NextResponse.json({ success: false, message: 'phone is required' }, { status: 400 });
    }
    if (!CLIENT_ID) return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 });

    // upstream expects query param smsType for channel (0=sms,1=whatsapp)
    const url = `${API_BASE}/v1/users/get-otp?smsType=${encodeURIComponent(String(smsType))}`;

    const headers: any = { 'client-id': CLIENT_ID, 'org': ORG, 'client-type': 'WEB', version: '54' };
    if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

    const response = await axios.get(url, {
      params: { phone: phone, countryCode: '+91', clientId: CLIENT_ID },
      headers,
      timeout: 8000,
    });

    // unify token id extraction
    const tokenId = response.data?.data?.t || response.data?.data?.token || response.data?.token || response.data?.access_token || null;
    const message = response.data?.message || response.data?.data?.message || response.data?.msg || '';
    return NextResponse.json({ success: true, data: response.data, token: tokenId, message });
  } catch (error: any) {
    const err = error?.response?.data || error?.response?.data?.message || error?.message || 'Failed to get OTP';
    const msg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
