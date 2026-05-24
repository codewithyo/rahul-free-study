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

    const response = await axios.get(
      `https://api.penpencil.co/v2/batches/${batchid}/subjects/${subjectid}/contents?contentType=${contentTypeMap[type]}&tag=all`,
      {
        headers: {
            "Authorization": authHeader,
            "Client-Id": "5eb393ee95fab7468a79d189",
            "client-type": "WEB",
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data.data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch contents" },
      { status: 500 }
    );
  }
}
