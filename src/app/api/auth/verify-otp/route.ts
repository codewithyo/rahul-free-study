import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    const response = await axios.post(
      "https://api.penpencil.co/v1/users/verify-otp",
      {
        phone: phone,
        otp: otp,
        countryCode: "+91",
        clientId: "5eb393ee95fab7468a79d189",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );

    // Extract the JWT token from response
    const token = response.data.data.token;

    return NextResponse.json({ success: true, token });
  } catch (error: any) {
    console.error("Verify Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.message || "Invalid OTP" },
      { status: 500 }
    );
  }
}
