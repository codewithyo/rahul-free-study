import { NextResponse } from 'next/server';
import upstream, { callUpstream } from '../../../../lib/upstream';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const data = await callUpstream('post', upstream.ENDPOINTS.SYNC_STATS(), { data: body });
    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Failed to sync stats' }, { status: 500 });
  }
}
