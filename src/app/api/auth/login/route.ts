import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    const CLIENT_ID = process.env.PW_CLIENT_ID || "";

    if (!CLIENT_ID) {
      return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 });
    }

    // Proxy the request to upstream using server-side client id
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
          "User-Agent": "Server",
          "client-id": CLIENT_ID,
          "version": "54",
          "client-type": "WEB"
        },
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
