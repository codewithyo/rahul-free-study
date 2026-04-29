"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { Book, ChevronRight, PlayCircle, Users, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BatchDetails({ params }: { params: Promise<{ batchid: string }> }) {
  const { batchid } = use(params);
  const [batchData, setBatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        // Updated to use the new universal proxy path
        const res = await axios.get(`/api/v1/v2/batches/info/${batchid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBatchData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch batch details");
      } finally {
        setLoading(false);
      }
    };
    fetchBatchDetails();
  }, [batchid]);

  if (loading) return <div className="p-20 text-center animate-pulse text-2xl font-bold text-blue-500">Connecting to Server...</div>;
  if (!batchData) return <div className="p-20 text-center text-red-500 font-bold">Content Locked or Not Found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/study" className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-all w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-slate-900/60 rounded-[40px] p-10 border border-white/5 flex flex-col md:flex-row gap-10 items-center mb-16 backdrop-blur-xl shadow-2xl">
        <div className="relative w-72 h-40 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <Image src={batchData.previewImage || "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/760dd986-5030-48dd-8ae3-3daeb0244b65.png"} alt={batchData.name} fill className="object-cover" unoptimized />
        </div>
        <div className="flex-1 text-center md:text-left">
          <span className="bg-blue-600/20 text-blue-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
            {batchData.batchType}
          </span>
          <h1 className="text-4xl font-black mb-4 leading-tight">{batchData.name}</h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">{batchData.description}</p>
        </div>
      </div>

      <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
        <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
        Course Subjects
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {batchData.subjects?.map((subject: any) => (
          <Link 
            href={`/study/batches/${batchid}/subjects/${subject._id}`}
            key={subject._id}
            className="group bg-slate-900/40 border border-white/5 p-8 rounded-[32px] hover:bg-slate-800/60 transition-all duration-500 flex items-center justify-between shadow-xl hover:border-blue-500/30"
          >
            <div className="flex items-center gap-6">
              <div className="bg-blue-600/10 group-hover:bg-blue-600 group-hover:scale-110 p-4 rounded-2xl text-blue-500 group-hover:text-white transition-all duration-500 shadow-inner">
                <PlayCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl group-hover:text-blue-400 transition-colors">{subject.subjectName}</h3>
                <p className="text-slate-500 font-semibold mt-1">{subject.instructorName || "Top Educator"}</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
