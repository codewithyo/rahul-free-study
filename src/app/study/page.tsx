"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Sparkles, LayoutGrid, GraduationCap, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Study() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const initApp = async () => {
      try {
        let token = localStorage.getItem("token");
        
        // 1. Get Master Token if missing
        if (!token) {
          const res = await axios.get("/api/get-master-token");
          if (res.data.success) {
            token = res.data.token;
            localStorage.setItem("token", token as string);
          }
        }

        // 2. Fetch Batches (Updated PWSphere URL)
        const batchRes = await axios.get("/api/AllBatches", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (batchRes.data.success || batchRes.data.data) {
          setBatches(batchRes.data.data || []);
        } else {
          setError("Failed to fetch library. Please refresh.");
        }
      } catch (err: any) {
        console.error("Initialization failed:", err);
        setError("PW Server Busy. Refreshing in 10s...");
        setTimeout(() => window.location.reload(), 10000);
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, []);

  const filteredBatches = batches.filter(batch => 
    batch.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="bg-[#020617] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
        <h2 className="text-xl font-black text-white tracking-[0.2em] animate-pulse uppercase">Syncing Library...</h2>
      </div>
    </div>
  );

  return (
    <div className="bg-[#020617] min-h-screen pb-20 selection:bg-blue-600/30">
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
             <div className="relative z-10">
                <h1 className="text-6xl font-black mb-6 tracking-tighter">Your Education <br/>Revolution.</h1>
                <p className="text-blue-100 text-xl font-medium max-w-xl opacity-80 leading-relaxed mb-10">No login required. Access India's top educators for free on Rahul-free-study.</p>
                <div className="flex gap-4">
                   <div className="bg-white/10 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-3">
                      <LayoutGrid className="w-6 h-6 text-blue-300" />
                      <span className="font-black text-lg">{batches.length} BATCHES LIVE</span>
                   </div>
                </div>
             </div>
             <Sparkles className="absolute right-[-40px] top-[-40px] w-80 h-80 opacity-10 animate-float" />
          </div>

          <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 flex flex-col justify-center shadow-inner">
             <h2 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-blue-500">
                Quick Search
             </h2>
             <input
                type="text"
                placeholder="Search batches..."
                className="w-full bg-slate-950/50 border border-white/10 rounded-[32px] py-6 px-10 focus:ring-4 focus:ring-blue-600/30 outline-none transition-all font-black text-xl text-white placeholder:text-slate-700 shadow-2xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          </div>
        </div>

        {error && (
            <div className="mb-12 bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 text-red-500 font-black justify-center animate-pulse">
                <AlertCircle className="w-6 h-6" /> {error}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10">
            {filteredBatches.map((batch: any) => (
              <Link 
                href={`/study/batches/${batch._id}`} 
                key={batch._id}
                className="group relative bg-[#0f172a]/60 border border-white/5 rounded-[56px] overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-blue-500/30 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={batch.previewImage || "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/760dd986-5030-48dd-8ae3-3daeb0244b65.png"}
                    alt={batch.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80"></div>
                  <div className="absolute top-8 left-8 bg-blue-600 text-white px-5 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase shadow-2xl">
                     {batch.batchType}
                  </div>
                </div>
                
                <div className="p-10">
                  <h3 className="text-2xl font-black mb-4 line-clamp-1 group-hover:text-blue-400 transition-colors">{batch.name}</h3>
                  <p className="text-slate-500 text-sm font-bold line-clamp-2 leading-relaxed mb-10">{batch.description || "Premium PW Content"}</p>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                       <GraduationCap className="w-5 h-5 text-blue-500" /> TOP FACULTY
                    </div>
                    <div className="bg-blue-600 p-4 rounded-[20px] text-white shadow-xl group-hover:rotate-[360deg] transition-all duration-700">
                      <Sparkles className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
