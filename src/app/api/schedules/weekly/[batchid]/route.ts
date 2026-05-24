import { NextResponse } from 'next/server';
import upstream, { callUpstream } from '../../../../../lib/upstream';

export async function GET(req: Request, { params }: { params: Promise<{ batchid: string }> }) {
  try {
    const { batchid } = await params;
    const data = await callUpstream('get', upstream.ENDPOINTS.GET_WEEKLY_SCHEDULE(batchid));
    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to fetch weekly schedule' }, { status: 500 });
  }
}
