import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    
    // 2026 Ultimate Strategy: Mirroring the mirror
    // We use the exact proxy path found in your shared logs
    let targetUrl = "";
    if (pathStr === "AllBatches") {
        targetUrl = "https://apiserver-henna.vercel.app/api/pw/batches";
    } else if (pathStr === "BatchInfo") {
        const bid = searchParams.get("BatchId");
        targetUrl = `https://apiserver-henna.vercel.app/api/pw/batchinfo?BatchId=${bid}`;
    } else {
        targetUrl = `https://api.penpencil.co/${pathStr}?${searchParams.toString()}`;
    }

    // High-speed Indian Proxy Gateway
    const proxyUrl = `https://pw.studyparcham.qzz.io/proxy.php?url=${encodeURIComponent(targetUrl)}&method=GET`;

    console.log(`Bypassing via: ${proxyUrl}`);

    const response = await axios.get(proxyUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://pwsphere.vercel.app/"
      },
      timeout: 12000
    });

    // RECURSIVE DATA FINDER: Deeply search for the batches array
    const findArray = (obj: any): any[] | null => {
      if (Array.isArray(obj)) return obj;
      if (typeof obj !== 'object' || obj === null) return null;
      if (Array.isArray(obj.data)) return obj.data;
      if (obj.batches && Array.isArray(obj.batches)) return obj.batches;
      
      for (const key in obj) {
        const res = findArray(obj[key]);
        if (res) return res;
      }
      return null;
    };

    const batches = findArray(response.data);

    if (batches) {
      return NextResponse.json({ success: true, data: batches });
    }

    return NextResponse.json({ success: false, data: [], message: "Data format mismatch" });

  } catch (error: any) {
    console.error("Master Sync Error:", error.message);
    return NextResponse.json({ success: false, data: [] });
  }
}
