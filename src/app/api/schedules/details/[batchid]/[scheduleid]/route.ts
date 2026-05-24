import { NextResponse } from 'next/server';
import upstream, { callUpstream } from '../../../../../../lib/upstream';

export async function GET(req: Request, { params }: { params: Promise<{ batchid: string; scheduleid: string }> }) {
  try {
    const { batchid, scheduleid } = await params;
    const { searchParams } = new URL(req.url);
    const sl = searchParams.get('sl') || ''; // subject slug expected as `sl`
    const endpoint = upstream.ENDPOINTS.GET_SCHEDULE_DETAILS(batchid, scheduleid, sl);
    const data = await callUpstream('get', endpoint);
    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to fetch schedule details' }, { status: 500 });
  }
}
