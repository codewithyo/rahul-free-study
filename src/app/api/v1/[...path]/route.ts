import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    
    const authHeader = req.headers.get("authorization");
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    // PWSphere 2026 Strategy: Use their HIGH-SPEED Proxy Directly
    // This proxy has rotating residential IPs in India
    let targetUrl = "";
    
    if (pathStr === "AllBatches") {
        targetUrl = `https://api.penpencil.co/v3/batches/my-batches?mode=1&amount=all`;
    } else {
        targetUrl = `https://api.penpencil.co/${pathStr}?${queryString}`;
    }

    // Try through Studyparcham Proxy (Most Stable in 2026)
    try {
        const proxyUrl = `https://pw.studyparcham.qzz.io/proxy.php?url=${encodeURIComponent(targetUrl)}&method=GET`;
        const response = await axios.get(proxyUrl, {
            headers: {
                "Authorization": authHeader || "",
                "client-id": CLIENT_ID,
                "version": "54"
            },
            timeout: 8000
        });
        return NextResponse.json(response.data);
    } catch (proxyErr) {
        // Fallback to direct if proxy fails
        const directRes = await axios.get(targetUrl, {
            headers: {
                "Authorization": authHeader || "",
                "client-id": CLIENT_ID,
                "version": "54"
            }
        });
        return NextResponse.json(directRes.data);
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Server Busy" }, { status: 500 });
  }
}
