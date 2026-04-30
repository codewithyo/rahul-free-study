import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    // 2026 ULTIMATE BYPASS HEADERS
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "PhysicsWallah/4.4.1 (com.ape.physicswallah; build:108; Android 13; SM-S911B) Alamofire/5.4.4",
      "client-id": CLIENT_ID,
      "device-type": "android",
      "version": "54",
      "randomId": Math.random().toString(36).substring(7),
      "Authorization": ""
    };

    console.log(`Attempting OTP for: ${phone}`);

    // Multilayer Proxy Logic
    let response;
    try {
      // Try Direct first but with ultra-mobile headers
      response = await axios.post(
        "https://api.penpencil.co/v1/users/login-otp",
        { phone, countryCode: "+91", clientId: CLIENT_ID, mode: "login" },
        { headers, timeout: 5000 }
      );
    } catch (e) {
      console.log("Direct failed, trying Indian Proxy...");
      // PWSphere Secret 2026 Proxy Endpoint
      response = await axios.get(
        `https://pw.studyparcham.qzz.io/proxy.php?url=https://api.penpencil.co/v1/users/login-otp&method=POST&phone=${phone}&clientId=${CLIENT_ID}`
      );
    }

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("Critical Login Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: "PW API Blocked. Try with VPN or another number." },
      { status: 500 }
    );
  }
}
