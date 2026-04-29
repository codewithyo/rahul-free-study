import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: Promise<{ videoid: string }> }) {
  try {
    const authHeader = req.headers.get("authorization");
    const { videoid } = await params;

    const response = await axios.get(
      `https://api.penpencil.co/v2/lectures/get-video-details?videoId=${videoid}`,
      {
        headers: {
          "Authorization": authHeader,
          "Client-Id": "5eb393ee95fab7468a79d189",
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data.data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch video details" },
      { status: 500 }
    );
  }
}
