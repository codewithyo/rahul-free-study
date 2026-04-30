"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Sparkles, GraduationCap, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Study() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        // Call our INTERNAL server route to avoid CORS errors
        const res = await axios.get("/api/AllBatches");
        if (res.data.success && res.data.data.length > 0) {
          setBatches(res.data.data);
        } else {
          setError("Synchronizing Global Library...");
          // Background retry
          setTimeout(fetchPortalData, 5000);
        }
      } catch (err) {
        setError("Retrying connection...");
        setTimeout(fetchPortalData, 5000);
      } finally {
        setLoading(false);
      }
    };
    fetchPortalData();
  }, []);

  const filteredBatches = batches.filter(batch => 
    batch.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && batches.length === 0) return (
    <div className="bg-[#020617] min-h-screen flex items-center justify-center font-sans">
      <div className="text-center">
        <div className="w-24 h-24 border-t-4 border-blue-600 rounded-full animate-spin mx-auto mb-10 shadow-[0_0_50px_rgba(59,130,246,0.5)]"></div>
        <h2 className="text-2xl font-black text-white tracking-[0.3em] animate-pulse">INITIATING HYPER-SYNC...</h2>
      </div>
    </div>
  );

  return (
    <div className="bg-[#020617] min-h-screen pb-20 selection:bg-blue-600/30">
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[60px] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
             <div className="relative z-10">
                <h1 className="text-7xl font-black mb-8 tracking-tighter leading-[0.8] uppercase">Premium <br/>Content. <br/>Unlocked.</h1>
                <p className="text-blue-100 text-xl font-medium max-w-lg opacity-80 mb-10 leading-relaxed">No login, No limits. Directly synced with PWSphere VIP Node.</p>
                <div className="flex gap-4">
                   <div className="bg-white/10 backdrop-blur-xl px-8 py-5 rounded-[28px] border border-white/10 flex items-center gap-4 shadow-2xl">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_20px_#22c55e]"></div>
                      <span className="font-black text-lg tracking-wider uppercase">Online: {batches.length} Batches</span>
                   </div>
                </div>
             </div>
             <Sparkles className="absolute right-[-40px] top-[-40px] w-96 h-96 opacity-10 animate-float" />
          </div>

          <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[60px] p-12 flex flex-col justify-center shadow-inner relative overflow-hidden">
             <h2 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase tracking-widest text-blue-500">
                Portal Search
             </h2>
             <div className="relative mb-10">
                <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full bg-slate-950 border border-white/10 rounded-[32px] py-7 px-10 focus:ring-4 focus:ring-blue-600/30 outline-none transition-all font-black text-xl text-white placeholder:text-slate-700 shadow-2xl"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
             </div>
          </div>
        </div>

        {error && batches.length === 0 && (
            <div className="mb-12 bg-blue-500/5 border border-blue-500/20 p-8 rounded-[40px] flex flex-col items-center gap-4 text-blue-400 font-bold justify-center animate-pulse">
                <Loader2 className="w-10 h-10 animate-spin" />
                <span className="text-xl tracking-widest uppercase">{error}</span>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12 px-2">
            {filteredBatches.map((batch: any) => (
              <Link 
                href={`/study/batches/${batch._id}`} 
                key={batch._id}
                className="group relative bg-[#0f172a]/60 border border-white/5 rounded-[64px] overflow-hidden transition-all duration-700 hover:scale-[1.05] hover:border-blue-500/40 hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)]"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={batch.previewImage || "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/760dd986-5030-48dd-8ae3-3daeb0244b65.png"}
                    alt={batch.name}
                    fill
                    className="object-cover group-hover:scale-150 transition-transform duration-[3000ms]"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90"></div>
                </div>
                
                <div className="p-10">
                  <h3 className="text-3xl font-black mb-6 line-clamp-1 group-hover:text-blue-400 transition-colors tracking-tighter uppercase">{batch.name}</h3>
                  
                  <div className="flex items-center justify-between pt-10 border-t border-white/5">
                    <div className="flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                       <GraduationCap className="w-7 h-7 text-blue-500" /> SYNCED SYSTEM
                    </div>
                    <div className="bg-blue-600 p-5 rounded-[28px] text-white shadow-2xl shadow-blue-600/40 group-hover:rotate-[360deg] transition-all duration-[2000ms] transform group-hover:scale-125">
                      <Sparkles className="w-8 h-8 fill-current text-white" />
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
