import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body?.token || body?.t || null;
    const otp = body?.otp || body?.code || body?.pin || '';
    const username = body?.username || body?.mobile || body?.phone || null;

    const CLIENT_ID = process.env.PW_CLIENT_ID || 'system-admin';
    const ORG = process.env.PW_ORG || '5eb393ee95fab7468a79d189';
    const CLIENT_SECRET = process.env.PW_CLIENT_SECRET || '';

    if (!CLIENT_ID) return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 });

    const API_BASE = process.env.PW_API_BASE || 'https://api.penpencil.co';
    const headers: any = { 'Content-Type': 'application/json', 'client-id': CLIENT_ID, 'org': ORG, 'client-type': 'WEB' };
    if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

    // Two supported verify flows:
    // 1) token-based: POST /v1/users/{token}/verify-otp  (frontend supplies token)
    // 2) oauth-style: POST /v3/oauth/token with username+otp to obtain access token
    let authToken: string | null = null;

    if (token) {
      const response = await axios.post(
        `${API_BASE}/v1/users/${token}/verify-otp`,
        { otp: otp, clientId: CLIENT_ID },
        { headers }
      );
      authToken = response.data?.data?.token || response.data?.token || null;
    } else if (username) {
      // oauth token flow
      const payload = {
        username: username,
        otp: String(otp),
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET || undefined,
        grant_type: 'otp',
        organizationId: ORG,
        latitude: 0, longitude: 0,
      };
      const response = await axios.post(`${API_BASE}/v3/oauth/token`, payload, { headers });
      authToken = response.data?.data?.token || response.data?.token || response.data?.access_token || null;
    } else {
      return NextResponse.json({ success: false, message: 'token or username required' }, { status: 400 });
    }

    if (!authToken) return NextResponse.json({ success: false, message: 'Invalid upstream response' }, { status: 500 });

    const res = NextResponse.json({ success: true });
    res.cookies.set('pw_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax'
    });

    return res;
  } catch (error: any) {
    const msg = error?.response?.data || error?.message || 'Invalid OTP';
    return NextResponse.json({ success: false, message: typeof msg === 'string' ? msg : JSON.stringify(msg) }, { status: 500 });
  }
}
