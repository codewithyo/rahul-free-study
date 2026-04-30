import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    // 2026 Emergency Pool
    const poolUrls = [
      "https://apiserver-henna.vercel.app/api/v1/master-token",
      "https://raw.githubusercontent.com/PWSphere/Pool/main/token.json"
    ];

    for (const url of poolUrls) {
      try {
        const res = await axios.get(url, { timeout: 3000 });
        const token = res.data.token || res.data.data?.token;
        if (token) return NextResponse.json({ success: true, token });
      } catch (e) { continue; }
    }

    // FINAL FALLBACK: If pools fail, use a common public token used by RolexCoderZ
    const publicToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTVjMWYwZWQ5MWJlMWY3NWM4NTMzYiIsImlhdCI6MTYyMTU0ODQwNX0";
    return NextResponse.json({ success: true, token: publicToken });

  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
