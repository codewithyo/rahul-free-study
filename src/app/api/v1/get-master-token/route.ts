import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    // 2026 Strategy: Fetching a working Master Token from the public ed-tech pools
    // These are updated in real-time by the community
    const poolUrls = [
      "https://pwsphere-api.vercel.app/api/v1/master-token",
      "https://api.rolexcoderz.in/public/token",
      "https://raw.githubusercontent.com/rolexcoderz/tokens/main/active.json"
    ];

    for (const url of poolUrls) {
      try {
        const res = await axios.get(url, { timeout: 3000 });
        const token = res.data.token || res.data.data?.token || res.data[0]?.token;
        if (token) return NextResponse.json({ success: true, token });
      } catch (e) { continue; }
    }

    return NextResponse.json({ success: false, message: "No active token found" });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
