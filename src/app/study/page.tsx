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
    const fetchBatchesLocally = async () => {
      try {
        // 2026 Strategy: Fetching direct from Browser (Bypasses Vercel IP block)
        // We try 3 different sources until one works
        const sources = [
          "https://apiserver-henna.vercel.app/api/pw/batches",
          "https://pw.studyparcham.qzz.io/proxy.php?url=https://api.penpencil.co/v3/batches/my-batches?mode=1%26amount=all",
          "https://raw.githubusercontent.com/devrahulmaida-sketch/pw-data/main/batches.json"
        ];

        let dataFound = false;
        for (const url of sources) {
          try {
            const res = await axios.get(url, { timeout: 8000 });
            const data = res.data.data?.data || res.data.data || res.data;
            if (Array.isArray(data) && data.length > 0) {
              setBatches(data);
              dataFound = true;
              break;
            }
          } catch (e) { continue; }
        }

        if (!dataFound) {
           setError("PW Engine is slow today. Retrying...");
           setTimeout(fetchBatchesLocally, 5000);
        }
      } catch (err) {
        console.error("Critical Sync Error");
      } finally {
        setLoading(false);
      }
    };
    fetchBatchesLocally();
  }, []);

  const filteredBatches = batches.filter(batch => 
    batch.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="bg-[#020617] min-h-screen flex items-center justify-center font-sans">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6 shadow-[0_0_40px_rgba(59,130,246,0.3)]" />
        <h2 className="text-xl font-black text-white tracking-[0.2em] animate-pulse uppercase">Connecting to Indian Node...</h2>
      </div>
    </div>
  );

  return (
    <div className="bg-[#020617] min-h-screen pb-20 selection:bg-blue-600/30">
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
             <div className="relative z-10">
                <h1 className="text-6xl font-black mb-6 tracking-tighter uppercase">Unlimited <br/>Access.</h1>
                <p className="text-blue-100 text-xl font-medium max-w-xl opacity-80 leading-relaxed mb-10">Synced directly with PWSphere VIP Engine. No login required.</p>
                <div className="flex gap-4">
                   <div className="bg-white/10 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-3">
                      <LayoutGrid className="w-6 h-6 text-blue-300" />
                      <span className="font-black text-lg tracking-widest uppercase">{batches.length} Batches Live</span>
                   </div>
                </div>
             </div>
             <Sparkles className="absolute right-[-40px] top-[-40px] w-80 h-80 opacity-10 animate-float" />
          </div>

          <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 flex flex-col justify-center">
             <h2 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-blue-500">Search Box</h2>
             <input
                type="text"
                placeholder="Find your course..."
                className="w-full bg-slate-950 border border-white/5 rounded-[32px] py-6 px-10 focus:ring-4 focus:ring-blue-600/30 outline-none transition-all font-black text-xl text-white placeholder:text-slate-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          </div>
        </div>

        {error && (
            <div className="mb-12 bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex items-center gap-4 text-blue-400 font-black justify-center animate-pulse tracking-widest uppercase">
                <AlertCircle className="w-6 h-6" /> {error}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 px-2">
            {filteredBatches.map((batch: any) => (
              <Link 
                href={`/study/batches/${batch._id}`} 
                key={batch._id}
                className="group relative bg-[#0f172a]/60 border border-white/5 rounded-[56px] overflow-hidden transition-all duration-700 hover:scale-[1.03] hover:border-blue-500/30 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
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
                </div>
                
                <div className="p-10 text-center md:text-left">
                  <h3 className="text-xl font-black mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{batch.name}</h3>
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                       <GraduationCap className="w-5 h-5 text-blue-500" /> PREMIUM
                    </div>
                    <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-xl group-hover:rotate-[360deg] transition-all duration-700">
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
