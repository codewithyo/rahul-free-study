import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    
    // Master Token (If user is not logged in, we use this or proxy)
    const authHeader = req.headers.get("authorization") || process.env.MASTER_TOKEN;
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    // 2026 Multi-Proxy Strategy
    // Try 3 different proxy gateways to ensure 0% block rate
    const proxies = [
        `https://pw.studyparcham.qzz.io/proxy.php?url=https://api.penpencil.co/${pathStr}&${queryString}`,
        `https://apiserver-henna.vercel.app/api/v1/${pathStr}?${queryString}`,
        `https://api.penpencil.co/${pathStr}?${queryString}`
    ];

    let lastError;
    for (const url of proxies) {
        try {
            console.log(`Trying Proxy: ${url}`);
            const response = await axios.get(url, {
                headers: {
                    "Authorization": authHeader || "",
                    "Client-Id": CLIENT_ID,
                    "version": "54",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                },
                timeout: 5000
            });
            return NextResponse.json(response.data);
        } catch (e: any) {
            lastError = e;
            continue; // Try next proxy
        }
    }

    throw lastError;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "All proxies blocked. Try again in 1 min." }, { status: 500 });
  }
}
