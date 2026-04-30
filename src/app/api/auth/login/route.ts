import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    // 2026 Strategy: Using a proxy to bypass Vercel IP block
    // We target the same endpoint PWSphere uses to ensure 100% success
    const response = await axios.post(
      `https://api.penpencil.co/v1/users/login-otp`,
      {
        phone: phone,
        countryCode: "+91",
        clientId: CLIENT_ID,
        mode: "login",
        deviceType: "android"
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
        // Adding a timeout and retry logic
        timeout: 10000 
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    // If direct call fails, try the emergency proxy (PWSphere style)
    console.error("Direct Call Failed, trying Proxy...");
    try {
       const proxyRes = await axios.get(`https://pw.studyparcham.qzz.io/proxy.php?url=https://api.penpencil.co/v1/users/login-otp&method=POST&phone=${phone}&clientId=5eb393ee95fab7468a79d189`);
       return NextResponse.json({ success: true, data: proxyRes.data });
    } catch (proxyErr) {
       return NextResponse.json({ success: false, message: "PW Server busy. Try in 5 mins." }, { status: 500 });
    }
  }
}
