"use client";

import { useEffect, useRef, useState, use } from "react";
import axios from "axios";
import Hls from "hls.js";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WatchPage({ params }: { params: Promise<{ videoid: string }> }) {
  const { videoid } = use(params);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`/api/v1/lectures/${videoid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideoData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch video details");
      } finally {
        setLoading(false);
      }
    };
    fetchVideoDetails();
  }, [videoid]);

  useEffect(() => {
    if (videoData && videoRef.current) {
      const video = videoRef.current;
      const url = videoData.videoUrl;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      }
    }
  }, [videoData]);

  if (loading) return <div className="p-20 text-center animate-pulse text-2xl font-bold text-white">Initializing Player...</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4 border-b border-white/10">
        <Link href="/study" className="p-2 hover:bg-white/10 rounded-full transition-all">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold line-clamp-1">{videoData?.topic || "Watching Lecture"}</h1>
      </div>

      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group border border-white/5">
          <video 
            ref={videoRef} 
            controls 
            className="w-full h-full object-contain"
            poster={videoData?.previewImage}
          />
        </div>

        <div className="mt-8 mb-20 bg-slate-900/50 p-8 rounded-3xl border border-white/5">
          <h2 className="text-2xl font-bold mb-4">{videoData?.topic}</h2>
          <div className="flex gap-6 text-slate-400 text-sm mb-6 pb-6 border-b border-white/5">
            <span>Instructor: <b className="text-white">{videoData?.faculty || "N/A"}</b></span>
            <span>Duration: <b className="text-white">{videoData?.duration} mins</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}
