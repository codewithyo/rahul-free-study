import { NextResponse } from 'next/server';
import axios from 'axios';

let cache: { ts: number; data: any } | null = null;

export async function GET() {
  try {
    const REMOTE = process.env.BATCHES_JSON_URL || 'https://rarestudy.github.io/rarestudy/batches.json';

    // simple in-memory cache for 30s
    if (cache && Date.now() - cache.ts < 30_000) {
      return NextResponse.json({ success: true, data: cache.data });
    }

    const res = await axios.get(REMOTE, { timeout: 8000 });
    const data = res.data || [];
    cache = { ts: Date.now(), data };
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch batches' }, { status: 500 });
  }
}
