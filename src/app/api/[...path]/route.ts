import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    
    // 2026 Mirror Strategy: Instead of PW, we proxy PWSphere's stable API
    // This allows us to use their already-bypassed endpoints
    const MIRROR_BASE = "https://pwsphere.vercel.app";
    
    // Exact mapping as per the data you shared
    let targetUrl = `${MIRROR_BASE}/api/${pathStr}?${searchParams.toString()}`;

    console.log(`Mirroring PWSphere: ${targetUrl}`);

    const response = await axios.get(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://pwsphere.vercel.app/study",
      },
      timeout: 15000
    });

    // PWSphere usually returns data directly or in a .data field
    const finalData = response.data.data || response.data;
    return NextResponse.json({ success: true, data: finalData });

  } catch (error: any) {
    console.error("Mirror Error:", error.message);
    
    // Fallback: Try their other mirror if main is down
    try {
        const fallbackRes = await axios.get(`https://pw.studyparcham.qzz.io/proxy.php?url=https://apiserver-henna.vercel.app/api/pw/${pathStr.toLowerCase()}`);
        return NextResponse.json({ success: true, data: fallbackRes.data.data || fallbackRes.data });
    } catch (e) {
        return NextResponse.json({ success: false, data: [], message: "Synchronizing with Global Pool..." });
    }
  }
}
