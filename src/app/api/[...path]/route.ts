import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    
    // 2026 HIGH-PRIORITY TOKEN (Khazana Premium)
    const MASTER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmU0YTIwZGU5MWJlMWY3NWM4NTMzYiIsImlhdCI6MTcxNDQwODQwNX0";
    const authHeader = req.headers.get("authorization") || `Bearer ${MASTER_TOKEN}`;
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    // PWSphere 2026 Direct Proxy Routes
    let targetUrl = "";
    if (pathStr === "AllBatches") {
        // This is the most stable 2026 endpoint that returns 100+ batches
        targetUrl = `https://apiserver-henna.vercel.app/api/pw/batches`;
    } else if (pathStr === "BatchInfo") {
        const batchId = searchParams.get("BatchId");
        targetUrl = `https://apiserver-henna.vercel.app/api/pw/batchinfo?BatchId=${batchId}`;
    } else {
        targetUrl = `https://api.penpencil.co/${pathStr}?${searchParams.toString()}`;
    }

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                "Authorization": authHeader,
                "Client-Id": CLIENT_ID,
                "version": "54"
            },
            timeout: 15000
        });

        // Some proxies return data directly, some wrap it in {data: ...}
        const finalData = response.data.data || response.data;
        return NextResponse.json({ success: true, data: finalData });

    } catch (e) {
        // Emergency Direct Fallback
        const directRes = await axios.get(`https://api.penpencil.co/v3/batches/my-batches?mode=1&amount=all`, {
            headers: { "Authorization": authHeader, "Client-Id": CLIENT_ID, "version": "54" }
        });
        return NextResponse.json({ success: true, data: directRes.data.data });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, data: [] });
  }
}
