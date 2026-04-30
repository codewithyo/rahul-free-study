"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Sparkles, LayoutGrid, GraduationCap, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Study() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const initApp = async () => {
      try {
        let token = localStorage.getItem("token");
        
        // 2026 Auto-Login Strategy: If no token, fetch from Master Pool
        if (!token) {
          const res = await axios.get("/api/v1/get-master-token");
          if (res.data.success) {
            token = res.data.token;
            localStorage.setItem("token", token as string);
          }
        }

        // Fetch batches using the token
        const batchRes = await axios.get("/api/v1/AllBatches", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBatches(batchRes.data.data || []);
      } catch (err) {
        console.error("Failed to initialize app");
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
    <div className="bg-[#020617] min-h-screen flex items-center justify-center font-sans">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
        <h2 className="text-xl font-black text-white tracking-widest animate-pulse uppercase">Syncing Premium Engine...</h2>
      </div>
    </div>
  );

  return (
    <div className="bg-[#020617] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[48px] p-12 text-white relative overflow-hidden shadow-[0_30px_100px_-20px_rgba(59,130,246,0.3)] border border-white/10">
             <div className="relative z-10">
                <h1 className="text-5xl font-black mb-6 leading-tight">Access Anything. <br/>Learn Everything.</h1>
                <p className="text-blue-100 text-xl font-medium max-w-xl opacity-90 leading-relaxed">No login required. Explore all premium Physics Wallah batches for free on Rahul-free-study.</p>
                <div className="mt-10 flex gap-6">
                   <div className="bg-white/10 backdrop-blur-xl px-8 py-4 rounded-[24px] flex items-center gap-4 border border-white/10">
                      <LayoutGrid className="w-6 h-6 text-blue-300" />
                      <span className="font-black text-lg tracking-tighter uppercase">{batches.length} Live Batches</span>
                   </div>
                </div>
             </div>
             <div className="absolute right-[-50px] bottom-[-50px] w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 shadow-2xl flex flex-col justify-center">
             <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                Search <Search className="w-6 h-6 text-blue-500" />
             </h2>
             <input
                type="text"
                placeholder="Ex: Lakshya JEE 2026"
                className="w-full bg-slate-950 border border-white/5 rounded-3xl py-6 px-8 focus:ring-4 focus:ring-blue-600/30 outline-none transition-all font-bold text-xl text-white placeholder:text-slate-700 shadow-inner"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-12 px-4">
           <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
           <h2 className="text-3xl font-black tracking-tight text-white uppercase">Premium Library</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 px-4">
            {filteredBatches.map((batch: any) => (
              <Link 
                href={`/study/batches/${batch._id}`} 
                key={batch._id}
                className="group relative bg-[#0f172a]/80 border border-white/5 rounded-[48px] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] hover:border-blue-500/30 hover:-translate-y-3"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={batch.previewImage || "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/760dd986-5030-48dd-8ae3-3daeb0244b65.png"}
                    alt={batch.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent"></div>
                  <div className="absolute top-6 left-6 bg-blue-600 text-white px-5 py-1.5 rounded-full shadow-2xl">
                     <span className="text-xs font-black uppercase tracking-widest">{batch.batchType}</span>
                  </div>
                </div>
                
                <div className="p-10">
                  <h3 className="text-2xl font-black mb-4 line-clamp-1 group-hover:text-blue-400 transition-colors leading-tight">
                    {batch.name}
                  </h3>
                  <p className="text-slate-500 text-sm font-bold line-clamp-2 leading-relaxed mb-10 opacity-80">
                    {batch.description || "Start your preparation with India's most advanced learning platform."}
                  </p>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest">
                       <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                          <GraduationCap className="w-5 h-5" />
                       </div>
                       PW Faculty
                    </div>
                    <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-2xl shadow-blue-600/50 group-hover:rotate-[360deg] transition-all duration-1000 transform group-hover:scale-110">
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
