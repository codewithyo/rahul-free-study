import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { token, otp } = await req.json();
    const CLIENT_ID = process.env.PW_CLIENT_ID || 'system-admin';
    const ORG = process.env.PW_ORG || '5eb393ee95fab7468a79d189';
    const CLIENT_SECRET = process.env.PW_CLIENT_SECRET || '';

    if (!CLIENT_ID) return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 });

    // POST to v1 users verify-otp endpoint using token in path
    const API_BASE = process.env.PW_API_BASE || 'https://api.penpencil.co';
    const headers: any = { 'Content-Type': 'application/json', 'client-id': CLIENT_ID, 'org': ORG, 'client-type': 'WEB' };
    if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

    const response = await axios.post(
      `${API_BASE}/v1/users/${token}/verify-otp`,
      { otp: otp, clientId: CLIENT_ID },
      { headers }
    );

    const authToken = response.data?.data?.token || response.data?.token;
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
    return NextResponse.json({ success: false, message: error.response?.data?.message || 'Invalid OTP' }, { status: 500 });
  }
}
