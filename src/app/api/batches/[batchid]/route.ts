import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ batchid: string }> }) {
  try {
    const authHeader = req.headers.get("authorization");
    const { batchid } = await params;
    const API_BASE = process.env.PW_API_BASE || "https://api.penpencil.co";
    const CLIENT_ID = process.env.PW_CLIENT_ID || "5eb393ee95fab7468a79d189";

    const response = await axios.get(
      `${API_BASE}/v2/batches/info/${batchid}`,
      {
        headers: {
          "Authorization": authHeader,
          "Client-Id": CLIENT_ID,
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data.data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}
