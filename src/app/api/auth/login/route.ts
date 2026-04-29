import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const API_BASE = "https://api.penpencil.co";
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    // PWSphere uses /api/auth/login which calls PW's /v1/users/login-otp
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
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
          "client-id": CLIENT_ID,
          "version": "46"
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || "Login service error" },
      { status: 500 }
    );
  }
}
