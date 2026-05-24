import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ batchid: string; subjectid: string }> }) {
  try {
    const authHeader = req.headers.get("authorization");
    const { batchid, subjectid } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "lectures"; 

    const contentTypeMap: any = {
      "lectures": "video",
      "notes": "notes",
      "dpp": "dpp"
    };

    const API_BASE = process.env.PW_API_BASE || 'https://api.penpencil.co';
    const CLIENT_ID = process.env.PW_CLIENT_ID || '5eb393ee95fab7468a79d189';
    const ORG = process.env.PW_ORG || '5eb393ee95fab7468a79d189';
    const CLIENT_SECRET = process.env.PW_CLIENT_SECRET || '';

    const headers: any = {
      Authorization: authHeader,
      'client-id': CLIENT_ID,
      org: ORG,
      'client-type': 'WEB',
    };
    if (CLIENT_SECRET) headers['client-secret'] = CLIENT_SECRET;

    const response = await axios.get(`${API_BASE}/v2/batches/${batchid}/subjects/${subjectid}/contents?contentType=${contentTypeMap[type]}&tag=all`, { headers });

    return NextResponse.json({ success: true, data: response.data.data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch contents" },
      { status: 500 }
    );
  }
}
