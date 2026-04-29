"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Search, Sparkles } from "lucide-react";
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
        const res = await axios.get("/api/v1/batches", {
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

  const filteredBatches = batches.filter(batch => 
    batch.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            My Batches <Sparkles className="w-8 h-8 text-yellow-500" />
          </h1>
          <p className="text-slate-400 mt-2">Continue your learning journey</p>
        </div>

        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your batch..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-900 h-80 rounded-3xl animate-pulse border border-slate-800"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBatches.map((batch: any) => (
            <Link 
              href={`/study/batches/${batch._id}`} 
              key={batch._id}
              className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={batch.previewImage || "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/760dd986-5030-48dd-8ae3-3daeb0244b65.png"}
                  alt={batch.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors">
                  {batch.name}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6">
                  {batch.description || "Start your preparation with India's best faculty."}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                  <span className="text-xs font-medium bg-blue-600/20 text-blue-500 px-3 py-1 rounded-full uppercase tracking-wider">
                    {batch.batchType || "LIVE"}
                  </span>
                  <div className="flex items-center gap-1 text-blue-500 font-bold group-hover:gap-2 transition-all">
                    View Details <BookOpen className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
