import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();
    
    const MASTER_TOKEN = process.env.PW_BACKUP_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmU0YTIwZGU5MWJlMWY3NWM4NTMzYiIsImlhdCI6MTcxNDQwODQwNX0";
    const authHeader = req.headers.get("authorization") || `Bearer ${MASTER_TOKEN}`;
    const CLIENT_ID = process.env.PW_CLIENT_ID || "5eb393ee95fab7468a79d189";
    const ORG = process.env.PW_ORG || '5eb393ee95fab7468a79d189';
    const CLIENT_SECRET = process.env.PW_CLIENT_SECRET || '';

    // 2026 Global Fallback Chain
    let targetUrl = "";
    if (pathStr === "AllBatches") {
        targetUrl = "https://api.penpencil.co/v3/batches/my-batches?mode=1&amount=all";
    } else if (pathStr === "BatchInfo") {
        const bid = searchParams.get("BatchId");
        targetUrl = `https://api.penpencil.co/v2/batches/info/${bid}`;
    } else {
        targetUrl = `https://api.penpencil.co/${pathStr}?${query}`;
    }

    // Try multiple proxy gateways sequentially (Server-to-Server - No CORS)
    const gateways = [
        `https://pw.studyparcham.qzz.io/proxy.php?url=${encodeURIComponent(targetUrl)}&method=GET`,
        `https://apiserver-henna.vercel.app/api/pw/${pathStr.toLowerCase()}?${query}`,
        targetUrl
    ];

    for (const url of gateways) {
        try {
            console.log(`Trying: ${url}`);
            const headers: any = {
                Authorization: authHeader,
                'client-id': CLIENT_ID,
                org: ORG,
                version: '54',
                'client-type': 'WEB',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            };
            if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

            const response = await axios.get(url, { headers, timeout: 10000 });

            // Smart Data Cleaner: Finds the array in any nested structure
            const findData = (obj: any): any => {
                if (Array.isArray(obj)) return obj;
                if (!obj || typeof obj !== 'object') return null;
                if (obj.data && Array.isArray(obj.data)) return obj.data;
                if (obj.data?.data && Array.isArray(obj.data.data)) return obj.data.data;
                for (let k in obj) {
                    let res = findData(obj[k]);
                    if (res) return res;
                }
                return null;
            };

            const cleanData = findData(response.data);
            if (cleanData) {
                return NextResponse.json({ success: true, data: cleanData });
            }
        } catch (e) { continue; }
    }

    return NextResponse.json({ success: false, data: [] });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] });
  }
}
