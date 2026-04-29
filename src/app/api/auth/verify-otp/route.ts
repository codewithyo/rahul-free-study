import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();
    const API_BASE = process.env.PW_API_BASE || "https://api.penpencil.co";
    const CLIENT_ID = process.env.PW_CLIENT_ID || "5eb393ee95fab7468a79d189";

    const response = await axios.post(
      `${API_BASE}/v1/users/verify-otp`,
      { phone, otp, countryCode: "+91", clientId: CLIENT_ID },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
        },
      }
    );

    return NextResponse.json({ success: true, token: response.data.data.token });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 500 });
  }
}
