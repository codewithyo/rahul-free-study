import { NextResponse } from 'next/server';
import upstream, { callUpstream } from '../../../../../../../lib/upstream';

export async function GET(req: Request, { params }: { params: Promise<{ batchid: string; subjectid: string }> }) {
  try {
    const { batchid, subjectid } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'lectures';
    const contentTypeMap: any = { lectures: 'video', notes: 'notes', dpp: 'dpp' };
    const endpoint = upstream.ENDPOINTS.GET_CONTENT_LIST(batchid, subjectid);
    const data = await callUpstream('get', endpoint, { params: { contentType: contentTypeMap[type], tag: 'all' } });
    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to fetch contents' }, { status: 500 });
  }
}
