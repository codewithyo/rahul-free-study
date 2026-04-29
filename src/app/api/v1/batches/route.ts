import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(
      "https://api.penpencil.co/v3/batches/my-batches?mode=1&amount=all",
      {
        headers: {
          "Authorization": authHeader,
          "Client-Id": "5eb393ee95fab7468a79d189",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data.data });
  } catch (error: any) {
    console.error("Batches Fetch Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}
