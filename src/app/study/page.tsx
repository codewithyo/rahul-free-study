"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Sparkles, LayoutGrid, GraduationCap, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Study() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Direct call to our TESTED Proxy route
        const res = await axios.get("/api/AllBatches");
        
        // Handling both possible PWSphere response formats
        const batchData = res.data.data || [];
        if (Array.isArray(batchData)) {
          setBatches(batchData);
        } else if (batchData.data && Array.isArray(batchData.data)) {
          setBatches(batchData.data);
        }
      } catch (err) {
        console.error("Fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const filteredBatches = batches.filter(batch => 
    batch.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="bg-[#020617] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
        <h2 className="text-xl font-black text-white tracking-widest animate-pulse">BOOTING MASTER ENGINE...</h2>
      </div>
    </div>
  );

  return (
    <div className="bg-[#020617] min-h-screen pb-20">
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[50px] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
             <div className="relative z-10">
                <h1 className="text-6xl font-black mb-6 leading-[0.9] tracking-tighter uppercase">No Login. <br/>Pure Learning.</h1>
                <p className="text-blue-100 text-xl font-medium max-w-lg opacity-80 mb-10 leading-relaxed italic">Access {batches.length} Premium Batches for Free.</p>
                <div className="bg-white/10 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 w-fit flex items-center gap-4">
                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]"></div>
                   <span className="font-black text-sm uppercase tracking-widest">System Online</span>
                </div>
             </div>
             <Sparkles className="absolute right-[-40px] top-[-40px] w-80 h-80 opacity-10 animate-float" />
          </div>

          <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[50px] p-12 flex flex-col justify-center">
             <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-blue-500 uppercase tracking-widest">Find Batch</h2>
             <div className="relative shadow-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-6 h-6" />
                <input
                    type="text"
                    placeholder="Search anything..."
                    className="w-full bg-slate-950/80 border border-white/5 rounded-[32px] py-7 px-16 focus:ring-4 focus:ring-blue-600/30 outline-none transition-all font-black text-xl text-white placeholder:text-slate-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
            {filteredBatches.map((batch: any) => (
              <Link 
                href={`/study/batches/${batch._id}`} 
                key={batch._id}
                className="group relative bg-[#0f172a]/60 border border-white/5 rounded-[60px] overflow-hidden transition-all duration-700 hover:scale-[1.03] hover:border-blue-500/30 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={batch.previewImage || "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/760dd986-5030-48dd-8ae3-3daeb0244b65.png"}
                    alt={batch.name}
                    fill
                    className="object-cover group-hover:scale-125 transition-transform duration-[1500ms]"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80"></div>
                </div>
                
                <div className="p-10">
                  <h3 className="text-2xl font-black mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors tracking-tight uppercase">{batch.name}</h3>
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                       <GraduationCap className="w-5 h-5 text-blue-500" /> ELITE FACULTY
                    </div>
                    <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-xl shadow-blue-600/30 group-hover:rotate-[360deg] transition-all duration-1000">
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
