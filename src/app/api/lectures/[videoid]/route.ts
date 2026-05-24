import { NextResponse } from "next/server";
import upstream, { callUpstream } from "../../../../lib/upstream";

export async function GET(req: Request, { params }: { params: Promise<{ videoid: string }> }) {
  try {
    const { videoid } = await params;
    const data = await callUpstream('get', `v1/lectures/get-video-details`, { params: { videoId: videoid } });
    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error' }, { status: 500 });
  }
}
