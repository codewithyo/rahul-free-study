import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ videoid: string }> }) {
  try {
    const authHeader = req.headers.get("authorization");
    const { videoid } = await params;
    const API_BASE = process.env.PW_API_BASE || "https://api.penpencil.co";
    const CLIENT_ID = process.env.PW_CLIENT_ID || "5eb393ee95fab7468a79d189";
    const ORG = process.env.PW_ORG || '5eb393ee95fab7468a79d189';
    const CLIENT_SECRET = process.env.PW_CLIENT_SECRET || '';

    const headers: any = {
      Authorization: authHeader,
      'client-id': CLIENT_ID,
      org: ORG,
      'client-type': 'WEB',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
    };
    if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

    const response = await axios.get(`${API_BASE}/v1/lectures/get-video-details?videoId=${videoid}`, { headers });

    return NextResponse.json({ success: true, data: response.data.data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}
