import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();
    const API_BASE = "https://api.penpencil.co";
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    const response = await axios.post(
      `${API_BASE}/v2/users/verify-otp`,
      {
        phone: phone,
        otp: otp,
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
        },
      }
    );

    return NextResponse.json({ 
      success: true, 
      token: response.data.data.token 
    });
  } catch (error: any) {
    console.error("Verify Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || "Invalid OTP" },
      { status: 500 }
    );
  }
}
