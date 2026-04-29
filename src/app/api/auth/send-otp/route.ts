import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const API_BASE = (process.env.PW_API_BASE || "https://api.penpencil.co").replace(/\/$/, "");
    const CLIENT_ID = process.env.PW_CLIENT_ID || "5eb393ee95fab7468a79d189";

    // PWSphere uses /v1/users/login-otp but sometimes PW requires v2
    const response = await axios.post(
      `${API_BASE}/v1/users/login-otp`,
      {
        phone: phone,
        countryCode: "+91",
        clientId: CLIENT_ID,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
          "client-id": CLIENT_ID,
          "version": "46"
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("OTP Proxy Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || "OTP endpoint error" },
      { status: 500 }
    );
  }
}
