import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    
    // 2026 MULTI-SOURCE VAULT
    const sources = [
      `https://apiserver-henna.vercel.app/api/pw/${pathStr.toLowerCase()}?${searchParams.toString()}`,
      `https://pw.studyparcham.qzz.io/proxy.php?url=https://api.penpencil.co/v3/batches/my-batches?mode=1%26amount=all`,
      `https://raw.githubusercontent.com/devrahulmaida-sketch/pw-data/main/batches.json`, // Community Sync
      `https://pwsphere.vercel.app/api/${pathStr}?${searchParams.toString()}`
    ];

    console.log(`Searching for batches in 2026 Vault...`);

    for (const url of sources) {
      try {
        const response = await axios.get(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://pwsphere.vercel.app/"
          },
          timeout: 7000
        });

        // Smart Extraction Logic
        const raw = response.data;
        const finalData = raw.data?.data || raw.data || raw.batches || (Array.isArray(raw) ? raw : null);
        
        if (finalData && Array.isArray(finalData) && finalData.length > 0) {
            console.log(`Success! Data found from: ${url}`);
            return NextResponse.json({ success: true, data: finalData, source: url });
        }
      } catch (e) { continue; }
    }

    return NextResponse.json({ success: false, data: [], message: "Synchronizing with Global Engine..." });

  } catch (error: any) {
    return NextResponse.json({ success: false, data: [] });
  }
}
