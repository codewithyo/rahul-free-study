import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const { searchParams } = new URL(req.url);
    
    const authHeader = req.headers.get("authorization");
    const API_BASE = "https://api.penpencil.co";
    const CLIENT_ID = "5eb393ee95fab7468a79d189";

    let targetUrl = "";

    // Map Rahul-free-study requests to PW APIs
    if (pathStr === "AllBatches") {
      targetUrl = `${API_BASE}/v3/batches/my-batches?mode=1&amount=all`;
    } else if (pathStr === "BatchInfo") {
      const batchId = searchParams.get("BatchId");
      targetUrl = `${API_BASE}/v2/batches/info/${batchId}`;
    } else if (pathStr === "SubjectInfo") {
      const batchId = searchParams.get("BatchId");
      const subjectId = searchParams.get("SubjectId");
      targetUrl = `${API_BASE}/v2/batches/${batchId}/subjects/${subjectId}/contents?contentType=video&tag=all`;
    } else if (pathStr === "TopicInfo") {
      const batchId = searchParams.get("BatchId");
      const subjectId = searchParams.get("SubjectId");
      const topicId = searchParams.get("TopicId");
      targetUrl = `${API_BASE}/v2/batches/${batchId}/subjects/${subjectId}/contents?contentType=video&tag=${topicId}`;
    } else {
      // Fallback for direct PW paths
      targetUrl = `${API_BASE}/${pathStr}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    }

    const response = await axios.get(targetUrl, {
      headers: {
        "Authorization": authHeader || "",
        "Client-Id": CLIENT_ID,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "version": "54"
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
