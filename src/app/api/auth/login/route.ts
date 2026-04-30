import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    // 2026 Strategy: Direct call from INDIA REGION (bom1)
    // No proxy needed if we are in India!
    const response = await axios.post(
      "https://api.penpencil.co/v1/users/login-otp",
      {
        phone: phone,
        countryCode: "+91",
        clientId: CLIENT_ID,
        mode: "login"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
          "client-id": CLIENT_ID,
          "version": "54",
          "origin": "https://www.physicswallah.live",
          "referer": "https://www.physicswallah.live/"
        }
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Critical Login Error:", error.response?.data || error.message);
    
    // Detailed error for frontend
    const errorMsg = error.response?.data?.message || "PW API Blocked or Server Busy";
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
