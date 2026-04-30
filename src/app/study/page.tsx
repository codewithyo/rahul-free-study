"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Sparkles, GraduationCap, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Study() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        // Call our internal mirror route
        const res = await axios.get("/api/AllBatches");
        const batchList = res.data.data || [];
        
        if (Array.isArray(batchList)) {
          setBatches(batchList);
        } else if (batchList.data && Array.isArray(batchList.data)) {
          setBatches(batchList.data);
        }
      } catch (err) {
        console.error("Master Sync Failed");
      } finally {
        setLoading(false);
      }
    };
    fetchPortalData();
  }, []);

  const filteredBatches = batches.filter(batch => 
    batch.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="bg-[#020617] min-h-screen flex items-center justify-center font-sans">
      <div className="text-center">
        <div className="w-20 h-20 border-b-4 border-blue-600 rounded-full animate-spin mx-auto mb-10 shadow-[0_0_40px_rgba(59,130,246,0.5)]"></div>
        <h2 className="text-xl font-black text-white tracking-[0.4em] animate-pulse">UPGRADING SYSTEM...</h2>
      </div>
    </div>
  );

  return (
    <div className="bg-[#020617] min-h-screen pb-20 selection:bg-blue-600/30">
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        
        {/* Banner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 bg-gradient-to-br from-[#1e3a8a] to-[#020617] rounded-[56px] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
             <div className="relative z-10">
                <span className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-widest mb-6 inline-block uppercase shadow-lg shadow-blue-600/30 italic">High Performance Engine 2026</span>
                <h1 className="text-7xl font-black mb-8 tracking-tighter leading-[0.8] uppercase">Premium <br/>Content. <br/>Zero Cost.</h1>
                <p className="text-blue-100/60 text-lg font-bold max-w-lg mb-10 leading-relaxed">No phone number, No OTP. Simply browse and start learning from India's elite educators.</p>
                <div className="bg-white/5 backdrop-blur-2xl px-10 py-5 rounded-3xl border border-white/10 w-fit flex items-center gap-5">
                   <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_20px_#22c55e]"></div>
                   <span className="font-black text-lg tracking-wider italic uppercase">MASTER SYNC: {batches.length} BATCHES</span>
                </div>
             </div>
             <Sparkles className="absolute right-[-20px] top-[-20px] w-80 h-80 opacity-5" />
          </div>

          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[56px] p-12 flex flex-col justify-center shadow-inner group">
             <h2 className="text-2xl font-black mb-10 flex items-center gap-4 uppercase tracking-widest text-blue-500 group-hover:scale-105 transition-all origin-left">
                Direct Search <Search className="w-7 h-7" />
             </h2>
             <div className="relative shadow-2xl">
                <input
                    type="text"
                    placeholder="Search by ID or Name..."
                    className="w-full bg-[#020617] border-2 border-white/5 rounded-[32px] py-8 px-10 focus:ring-4 focus:ring-blue-600/20 focus:border-blue-500/50 outline-none transition-all font-black text-2xl text-white placeholder:text-slate-800"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12 px-2">
            {filteredBatches.map((batch: any) => (
              <Link 
                href={`/study/batches/${batch._id}`} 
                key={batch._id}
                className="group relative bg-[#0f172a]/60 border border-white/5 rounded-[64px] overflow-hidden transition-all duration-700 hover:scale-[1.05] hover:border-blue-500/40 hover:shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)]"
              >
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={batch.previewImage || "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/760dd986-5030-48dd-8ae3-3daeb0244b65.png"}
                    alt={batch.name}
                    fill
                    className="object-cover group-hover:scale-150 transition-transform duration-[3000ms] ease-in-out"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                  <div className="absolute top-10 left-10 bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 shadow-2xl">
                     <span className="text-[10px] font-black tracking-widest text-white uppercase">{batch.batchType}</span>
                  </div>
                </div>
                
                <div className="p-12">
                  <h3 className="text-2xl font-black mb-4 line-clamp-1 group-hover:text-blue-400 transition-colors tracking-tighter uppercase">{batch.name}</h3>
                  <p className="text-slate-600 text-xs font-black line-clamp-2 leading-loose mb-10 opacity-60 uppercase tracking-widest italic">{batch.description || "Premium PW Elite Course"}</p>
                  
                  <div className="flex items-center justify-between pt-10 border-t border-white/5">
                    <div className="flex items-center gap-4 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                       <GraduationCap className="w-5 h-5 text-blue-500" /> SYNCED SYSTEM
                    </div>
                    <div className="bg-blue-600 p-5 rounded-[28px] text-white shadow-2xl shadow-blue-600/50 group-hover:rotate-[360deg] transition-all duration-[2000ms] transform group-hover:scale-125">
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
