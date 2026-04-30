import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    
    const authHeader = req.headers.get("authorization") || `Bearer ${process.env.MASTER_TOKEN}`;
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    // 2026 Strategy: Use the most stable proxy discovered in research
    let targetUrl = "";
    if (pathStr === "AllBatches") {
        targetUrl = `https://api.penpencil.co/v3/batches/my-batches?mode=1&amount=all`;
    } else if (pathStr === "BatchInfo") {
        const batchId = searchParams.get("BatchId");
        targetUrl = `https://api.penpencil.co/v2/batches/info/${batchId}`;
    } else {
        targetUrl = `https://api.penpencil.co/${pathStr}?${searchParams.toString()}`;
    }

    try {
        // Use PWSphere's primary proxy provider
        const proxyUrl = `https://pw.studyparcham.qzz.io/proxy.php?url=${encodeURIComponent(targetUrl)}&method=GET`;
        const response = await axios.get(proxyUrl, {
            headers: {
                "Authorization": authHeader,
                "client-id": CLIENT_ID,
                "version": "54"
            },
            timeout: 10000
        });
        return NextResponse.json(response.data);
    } catch (e) {
        // Fallback to direct call with mobile fingerprinting
        const directRes = await axios.get(targetUrl, {
            headers: {
                "Authorization": authHeader,
                "client-id": CLIENT_ID,
                "version": "54",
                "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            },
            timeout: 10000
        });
        return NextResponse.json(directRes.data);
    }
  } catch (error: any) {
    // Avoid circular reference in JSON response (prevents 500 error)
    return NextResponse.json({ 
        success: false, 
        message: "PW Server is busy. Please refresh in 5 seconds.",
        error: error.message 
    }, { status: 500 });
  }
}
