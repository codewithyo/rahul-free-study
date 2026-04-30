import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const API_BASE = "https://api.penpencil.co";
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    const response = await axios.post(
      `${API_BASE}/v2/users/login-otp`,
      {
        phone: phone,
        countryCode: "+91",
        clientId: CLIENT_ID,
        mode: "login" // Added mode as per 2026 PW requirements
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
          "client-id": CLIENT_ID,
          "version": "54", // 2026 latest app version
          "origin": "https://www.physicswallah.live",
          "referer": "https://www.physicswallah.live/"
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Login Proxy Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || "Service error" },
      { status: 500 }
    );
  }
}
