import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    
    const authHeader = req.headers.get("authorization");
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    // 2026 Most Stable Proxy (Direct from PWSphere Network)
    const API_BASE = "https://api.penpencil.co";
    let targetUrl = `${API_BASE}/${pathStr.replace("AllBatches", "v3/batches/my-batches")}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    
    if (pathStr === "AllBatches" && !targetUrl.includes("mode=1")) {
        targetUrl += (targetUrl.includes("?") ? "&" : "?") + "mode=1&amount=all";
    }

    try {
        // Ultimate Proxy Strategy: Using Henna Server
        const hennaUrl = `https://apiserver-henna.vercel.app/api/pw/${pathStr.toLowerCase()}?${searchParams.toString()}`;
        const response = await axios.get(hennaUrl, {
            headers: {
                "Authorization": authHeader || "",
                "Client-Id": CLIENT_ID
            },
            timeout: 12000
        });
        return NextResponse.json(response.data);
    } catch (e) {
        // Fallback to direct call if Henna is down
        const directRes = await axios.get(targetUrl, {
            headers: {
                "Authorization": authHeader || "",
                "Client-Id": CLIENT_ID,
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
                "version": "54"
            }
        });
        return NextResponse.json(directRes.data);
    }
  } catch (error: any) {
    console.error("Proxy Failure:", error.message);
    // Return a clean error instead of a 500 crash
    return NextResponse.json({ 
        success: false, 
        data: [], 
        message: "Synchronizing with PW... Please wait." 
    });
  }
}
