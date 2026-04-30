import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    
    const MASTER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmU0YTIwZGU5MWJlMWY3NWM4NTMzYiIsImlhdCI6MTcxNDQwODQwNX0";
    const authHeader = req.headers.get("authorization") || `Bearer ${MASTER_TOKEN}`;
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    let targetUrl = "";
    if (pathStr === "AllBatches") {
        targetUrl = `https://api.penpencil.co/v3/batches/my-batches?mode=1&amount=all`;
    } else if (pathStr === "BatchInfo") {
        const batchId = searchParams.get("BatchId");
        targetUrl = `https://api.penpencil.co/v2/batches/info/${batchId}`;
    } else {
        targetUrl = `https://api.penpencil.co/${pathStr}?${searchParams.toString()}`;
    }

    // 2026 Verified Proxy Path
    const proxyUrl = `https://pw.studyparcham.qzz.io/proxy.php?url=${encodeURIComponent(targetUrl)}&method=GET`;

    const response = await axios.get(proxyUrl, {
      headers: {
        "Authorization": authHeader,
        "client-id": CLIENT_ID,
        "version": "54"
      },
      timeout: 10000
    });

    // TESTED: Studyparcham returns { success: true, data: { data: [...] } }
    const finalData = response.data.data?.data || response.data.data || response.data;
    
    return NextResponse.json({ success: true, data: finalData });

  } catch (error: any) {
    return NextResponse.json({ success: false, data: [] });
  }
}
