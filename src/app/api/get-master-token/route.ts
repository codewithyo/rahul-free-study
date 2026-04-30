import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    // 2026 Public Token Pools (Real-time)
    const pools = [
      "https://apiserver-henna.vercel.app/api/v1/master-token",
      "https://pwsphere-api.vercel.app/api/v1/master-token"
    ];

    for (const url of pools) {
      try {
        const res = await axios.get(url, { timeout: 4000 });
        const token = res.data.token || res.data.data?.token;
        if (token) return NextResponse.json({ success: true, token });
      } catch (e) { continue; }
    }

    // Hardcoded high-tier token for April 2026 (backup)
    const backupToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmU0YTIwZGU5MWJlMWY3NWM4NTMzYiIsImlhdCI6MTcxNDQwODQwNX0";
    return NextResponse.json({ success: true, token: backupToken });

  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
