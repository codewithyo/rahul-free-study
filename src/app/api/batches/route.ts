import { NextResponse } from 'next/server';
import upstream, { callUpstream } from '../../../lib/upstream';

export async function GET(req: Request) {
  try {
    const data = await callUpstream('get', 'v3/batches/my-batches', { params: { mode: 1, amount: 'all' } });
    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error' }, { status: 500 });
  }
}
