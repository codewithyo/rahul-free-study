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
        // 2026 Mirror Strategy: We don't need a token for AllBatches anymore
        // because we are mirroring PWSphere's public response
        const batchRes = await axios.get("/api/AllBatches");
        
        const data = batchRes.data.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setBatches(data);
        } else {
          // If mirror fails, try the backup pool
          const backupRes = await axios.get("https://raw.githubusercontent.com/rolexcoderz/tokens/main/batches.json");
          setBatches(backupRes.data || []);
        }
      } catch (err: any) {
        console.error("Mirror sync failed:", err);
        setError("Connecting to Global Library...");
        // Final Fallback: Direct PW (sometimes works in certain hours)
        try {
           const direct = await axios.get("https://api.penpencil.co/v3/batches/my-batches?mode=1&amount=all");
           setBatches(direct.data.data || []);
        } catch (e) {}
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
        <div className="w-24 h-24 border-t-4 border-blue-600 rounded-full animate-spin mx-auto mb-10 shadow-[0_0_50px_rgba(59,130,246,0.5)]"></div>
        <h2 className="text-2xl font-black text-white tracking-[0.3em] animate-pulse">CONNECTING TO PW ENGINE...</h2>
      </div>
    </div>
  );

  return (
    <div className="bg-[#020617] min-h-screen pb-20 selection:bg-blue-600/30">
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[60px] p-16 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(59,130,246,0.4)] border border-white/10">
             <div className="relative z-10">
                <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest mb-6 inline-block uppercase">Official Partner Engine</span>
                <h1 className="text-7xl font-black mb-8 tracking-tighter leading-[0.9]">Free <br/>Education <br/>Forever.</h1>
                <p className="text-blue-100 text-xl font-medium max-w-lg opacity-80 leading-relaxed mb-10 text-pretty">Explore premium Physics Wallah content with zero restrictions. No login, no limits.</p>
                <div className="flex gap-4">
                   <div className="bg-white/10 backdrop-blur-xl px-8 py-5 rounded-[28px] border border-white/10 flex items-center gap-4 shadow-2xl">
                      <LayoutGrid className="w-8 h-8 text-blue-300" />
                      <div className="flex flex-col">
                         <span className="text-3xl font-black">{batches.length}</span>
                         <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest font-sans">Active Batches</span>
                      </div>
                   </div>
                </div>
             </div>
             <Sparkles className="absolute right-[-40px] top-[-40px] w-96 h-96 opacity-10 animate-float" />
             <div className="absolute left-[-100px] bottom-[-100px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[60px] p-12 flex flex-col justify-center shadow-inner relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
             <h2 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase tracking-widest text-blue-500">
                Quick Portal
             </h2>
             <div className="relative mb-10">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full bg-slate-950/80 border border-white/10 rounded-[32px] py-7 px-16 focus:ring-4 focus:ring-blue-600/30 outline-none transition-all font-black text-xl text-white placeholder:text-slate-700 shadow-2xl"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <p className="text-slate-500 text-xs font-bold leading-relaxed text-center px-4">
                Tip: Type the year (e.g. 2026) to find the latest batches immediately.
             </p>
          </div>
        </div>

        {error && (
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
                className="group relative bg-[#0f172a]/60 border border-white/5 rounded-[64px] overflow-hidden transition-all duration-700 hover:scale-[1.04] hover:border-blue-500/40 hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)]"
              >
                <div className="relative h-72 w-full">
                  <Image
                    src={batch.previewImage || "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/760dd986-5030-48dd-8ae3-3daeb0244b65.png"}
                    alt={batch.name}
                    fill
                    className="object-cover group-hover:scale-125 transition-transform duration-[2000ms] ease-in-out"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90"></div>
                  <div className="absolute bottom-8 left-8 flex gap-3">
                     <span className="bg-blue-600 text-white px-5 py-2 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-2xl">
                        {batch.batchType}
                     </span>
                     {batch.isLive && <span className="bg-red-500 text-white px-5 py-2 rounded-2xl font-black text-[10px] tracking-widest uppercase animate-pulse">LIVE</span>}
                  </div>
                </div>
                
                <div className="p-10">
                  <h3 className="text-3xl font-black mb-6 line-clamp-1 group-hover:text-blue-400 transition-colors leading-tight tracking-tight">{batch.name}</h3>
                  
                  <div className="flex items-center justify-between pt-10 border-t border-white/5">
                    <div className="flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                       <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-inner">
                          <GraduationCap className="w-7 h-7" />
                       </div>
                       PW ELITE FACULTY
                    </div>
                    <div className="bg-blue-600 p-5 rounded-[28px] text-white shadow-2xl shadow-blue-600/40 group-hover:rotate-[360deg] transition-all duration-[1500ms] transform group-hover:scale-110">
                      <Sparkles className="w-8 h-8 fill-current" />
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
