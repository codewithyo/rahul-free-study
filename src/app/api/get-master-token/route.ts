import { NextResponse } from "next/server";

// Deprecated: master token endpoint removed. Use OTP flows instead.
export async function GET() {
  return NextResponse.json({ success: false, message: 'Deprecated. Use /api/auth/get-otp and /api/auth/verify-otp OTP flows.' }, { status: 410 });
}
