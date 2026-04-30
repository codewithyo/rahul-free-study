import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();
    
    // 2026 Ultimate Strategy: Mirror PWSphere's High-Speed Henna Server
    // This server is built specifically to handle massive traffic and bypass all PW blocks
    let targetUrl = "";
    
    if (pathStr === "AllBatches") {
        targetUrl = `https://apiserver-henna.vercel.app/api/pw/batches`;
    } else if (pathStr === "BatchInfo") {
        const batchId = searchParams.get("BatchId");
        targetUrl = `https://apiserver-henna.vercel.app/api/pw/batchinfo?BatchId=${batchId}`;
    } else {
        // Fallback for other resources (Subjects, Lectures)
        targetUrl = `https://apiserver-henna.vercel.app/api/pw/${pathStr.toLowerCase()}?${query}`;
    }

    console.log(`Mirroring Henna Server: ${targetUrl}`);

    const response = await axios.get(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
        "Referer": "https://pwsphere.vercel.app/",
        "Origin": "https://pwsphere.vercel.app"
      },
      timeout: 10000
    });

    // Handle nested data structures correctly
    // Henna returns: { success: true, data: [...] } OR { success: true, data: { data: [...] } }
    const result = response.data.data || response.data;
    
    return NextResponse.json({ 
        success: true, 
        data: result.data || result 
    });

  } catch (error: any) {
    console.error("Henna Mirror Failed:", error.message);
    return NextResponse.json({ success: false, data: [], message: "Syncing..." });
  }
}
