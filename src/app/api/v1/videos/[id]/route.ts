import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Mock video data (using a public HLS stream for testing)
  const data = {
    _id: id,
    title: 'Modern Physics - Lecture 01',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://telegra.ph/file/cef3ef6ee69126c23bfe3.jpg',
    description: 'Detailed explanation of Photoelectric Effect and dual nature of matter.',
    date: 'April 20, 2026'
  };

  return NextResponse.json({ 
    success: true, 
    data: data 
  });
}
