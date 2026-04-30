import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    
    // 2026 Stealth Strategy: Master Token + Indian Node Relay
    const MASTER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmU0YTIwZGU5MWJlMWY3NWM4NTMzYiIsImlhdCI6MTcxNDQwODQwNX0";
    const authHeader = req.headers.get("authorization") || `Bearer ${MASTER_TOKEN}`;
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    let targetUrl = "";
    if (pathStr === "AllBatches") {
        targetUrl = `https://api.penpencil.co/v3/batches/my-batches?mode=1&amount=all`;
    } else if (pathStr === "BatchInfo") {
        const bid = searchParams.get("BatchId");
        targetUrl = `https://api.penpencil.co/v2/batches/info/${bid}`;
    } else {
        targetUrl = `https://api.penpencil.co/${pathStr}?${searchParams.toString()}`;
    }

    // Tigdam: Instead of calling PW directly, we use a public CORS-Gateway
    // which has Indian IP rotation. This is what PWSphere does for free.
    const relayGateways = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
        `https://pw.studyparcham.qzz.io/proxy.php?url=${encodeURIComponent(targetUrl)}&method=GET`,
        targetUrl
    ];

    for (const gate of relayGateways) {
        try {
            const response = await axios.get(gate, {
                headers: {
                    "Authorization": authHeader,
                    "client-id": CLIENT_ID,
                    "version": "54",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                },
                timeout: 8000
            });

            // Data extraction from different proxy formats
            const finalData = response.data.data?.data || response.data.data || response.data;
            if (finalData) {
                return NextResponse.json({ success: true, data: finalData });
            }
        } catch (e) { continue; }
    }

    return NextResponse.json({ success: false, data: [] });

  } catch (error: any) {
    return NextResponse.json({ success: false, data: [] });
  }
}
