"use client";

import { useEffect, useRef, useState, use } from "react";
import axios from "axios";
import Hls from "hls.js";
import { ArrowLeft, Lock, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function WatchPage({ params }: { params: Promise<{ videoid: string }> }) {
  const { videoid } = use(params);
  const videoRef = useRef(null as HTMLVideoElement | null);
  const [videoData, setVideoData] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const res = await axios.get('/api/AllBatches');
        if (res.data.success) {
          const all: any[] = res.data.data || [];
          // search for video by id across batches -> subjects -> lectures
          let found: any = null;
          for (const b of all) {
            if (!b.subjects) continue;
            for (const s of b.subjects) {
              const lectures = s.lectures || s.contents || [];
              const match = lectures.find((l: any) => String(l._id) === String(videoid));
              if (match) { found = match; break; }
            }
            if (found) break;
          }
          if (found) setVideoData(found);
          else setError(true);
        } else setError(true);
      } catch (err) {
        setError(true);
      } finally { setLoading(false); }
    };
    fetchVideoDetails();
  }, [videoid]);

  useEffect(() => {
    if (videoData && videoRef.current) {
      const video = videoRef.current;
      const url = videoData.videoUrl;

      // Handle Clearkey DRM for 2026 Security
      if (Hls.isSupported()) {
        const hls = new Hls({
          // This allows Hls.js to handle custom headers for key fetching in 2026
          xhrSetup: (xhr: any, url: string) => {
            if (url.includes('get-key')) {
              xhr.setRequestHeader('client-id', process.env.NEXT_PUBLIC_PW_CLIENT_ID || 'system-admin');
            }
          }
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      }
    }
  }, [videoData]);

  if (loading) return (
    <div className="bg-[#020617] min-h-screen flex items-center justify-center font-sans">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
        <p className="mt-6 text-blue-400 font-bold tracking-tighter animate-pulse">2026 ENCRYPTION BYPASS ACTIVE...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center p-6 text-center">
      <div className="glass-card p-12 max-w-md border-red-500/20">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">DRM Blocked</h2>
        <p className="text-slate-400 mb-8 font-medium">Physics Wallah has updated their security. Please refresh your session or re-login.</p>
        <Link href="/login" className="bg-blue-600 px-8 py-3 rounded-xl font-bold">RE-LOGIN</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/study" className="p-2 hover:bg-white/5 rounded-2xl transition-all"><ArrowLeft /></Link>
          <h1 className="font-bold tracking-tight text-lg line-clamp-1">{videoData?.topic}</h1>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20 text-xs font-black">
          <Lock className="w-3 h-3" /> SECURE STREAM
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border-4 border-white/5 relative group">
          <video ref={videoRef} controls className="w-full h-full object-contain" />
        </div>
        <div className="mt-10 p-10 glass-card">
          <h2 className="text-3xl font-black mb-4">{videoData?.topic}</h2>
          <div className="flex gap-6 text-slate-400 font-bold text-sm">
            <span>{videoData?.faculty || "Senior Faculty"}</span>
            <span className="text-blue-500">{videoData?.duration} Mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
