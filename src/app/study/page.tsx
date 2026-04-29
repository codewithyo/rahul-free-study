"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Sparkles, LogOut, LayoutGrid, GraduationCap, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Study() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBatches = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      try {
        // Using PWSphere-style endpoint
        const res = await axios.get("/api/v1/AllBatches", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBatches(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch batches");
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const filteredBatches = batches.filter(batch => 
    batch.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        
        {/* Top Stats/Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
             <div className="relative z-10">
                <h1 className="text-4xl font-black mb-4">Welcome back, Explorer!</h1>
                <p className="text-blue-100 text-lg font-medium max-w-xl opacity-90">Access your personalized learning dashboard and continue where you left off.</p>
                <div className="mt-8 flex gap-4">
                   <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/10">
                      <LayoutGrid className="w-5 h-5" />
                      <span className="font-bold text-sm">{batches.length} Batches</span>
                   </div>
                   <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/10">
                      <Clock className="w-5 h-5" />
                      <span className="font-bold text-sm">24/7 Access</span>
                   </div>
                </div>
             </div>
             <Sparkles className="absolute right-[-20px] bottom-[-20px] w-64 h-64 opacity-10 rotate-12" />
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[32px] p-8 shadow-xl flex flex-col justify-between">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Quick Search</h2>
                <div className="bg-blue-600/10 p-2 rounded-xl text-blue-500"><Search className="w-5 h-5" /></div>
             </div>
             <input
                type="text"
                placeholder="Search batches..."
                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button 
                onClick={handleLogout}
                className="mt-6 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 py-3 rounded-2xl transition-all"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
          </div>
        </div>

        {/* Batches Grid */}
        <div className="flex items-center gap-4 mb-8 px-2">
           <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
           <h2 className="text-2xl font-black tracking-tight">Your Enrolled Courses</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-900 h-96 rounded-[40px] animate-pulse border border-gray-300 dark:border-gray-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {filteredBatches.map((batch: any) => (
              <Link 
                href={`/study/batches/${batch._id}`} 
                key={batch._id}
                className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[40px] overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] dark:hover:shadow-blue-900/20 hover:-translate-y-2"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={batch.previewImage || "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/760dd986-5030-48dd-8ae3-3daeb0244b65.png"}
                    alt={batch.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                     <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{batch.batchType}</span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-black mb-3 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {batch.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-bold line-clamp-2 leading-relaxed mb-8">
                    {batch.description || "Premium course with full features."}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-black text-[10px] uppercase tracking-widest">
                       <GraduationCap className="w-4 h-4" /> PW Faculty
                    </div>
                    <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-600/30 group-hover:rotate-[360deg] transition-all duration-700">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
