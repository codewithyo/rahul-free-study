import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    const response = await axios.post(
      "https://api.penpencil.co/v1/users/login-otp",
      {
        phone: phone,
        countryCode: "+91",
        clientId: "5eb393ee95fab7468a79d189", // PW Client ID
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("OTP Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}
