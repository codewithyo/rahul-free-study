import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const API_BASE = "https://api.penpencil.co";
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    // V1 is more stable for mobile login in April 2026
    const response = await axios.post(
      `${API_BASE}/v1/users/login-otp`,
      {
        phone: phone,
        countryCode: "+91",
        clientId: CLIENT_ID
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
          "client-id": CLIENT_ID,
          "version": "54",
          "origin": "https://www.physicswallah.live",
          "referer": "https://www.physicswallah.live/"
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Final Login Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
