"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { FileText, Play, Download, Clock, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SubjectContent({ params }: { params: Promise<{ batchid: string; subjectid: string }> }) {
  const { batchid, subjectid } = use(params);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lectures");

  useEffect(() => {
    const fetchContent = async () => {
      const token = localStorage.getItem("token");
      const contentTypeMap: any = { "lectures": "video", "notes": "notes", "dpp": "dpp" };
      
      try {
        // Updated to use universal proxy with full PW path
        const res = await axios.get(
          `/api/v1/v2/batches/${batchid}/subjects/${subjectid}/contents?contentType=${contentTypeMap[activeTab]}&tag=all`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setContent(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch content");
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [batchid, subjectid, activeTab]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href={`/study/batches/${batchid}`} className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-all w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Subjects
      </Link>

      <div className="flex gap-4 mb-12 bg-slate-900/60 p-2 rounded-2xl border border-white/5 w-fit mx-auto md:mx-0 backdrop-blur-md">
        {["lectures", "notes", "dpp"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setLoading(true); }}
            className={`px-10 py-3.5 rounded-xl font-black capitalize transition-all duration-300 ${
              activeTab === tab ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-900/40 rounded-3xl animate-pulse border border-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {content.length === 0 ? (
            <div className="text-center py-32 bg-slate-900/20 rounded-[40px] border border-dashed border-white/10">
              <p className="text-slate-500 text-xl font-bold italic">This section is currently empty.</p>
            </div>
          ) : (
            content.map((item: any) => (
              <div key={item._id} className="group bg-slate-900/40 border border-white/5 p-6 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-slate-800/40 hover:border-blue-500/20 transition-all duration-500 shadow-xl">
                <div className="flex gap-6 items-center">
                  <div className={`p-5 rounded-2xl transition-all duration-500 ${activeTab === 'lectures' ? 'bg-blue-600/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white' : 'bg-green-600/10 text-green-500 group-hover:bg-green-600 group-hover:text-white'}`}>
                    {activeTab === 'lectures' ? <Play className="w-8 h-8 fill-current" /> : <FileText className="w-8 h-8" />}
                  </div>
                  <div>
                    <h3 className="font-black text-xl mb-2 group-hover:text-white transition-colors">{item.topic || item.name}</h3>
                    <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-bold tracking-tight">
                      <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(item.date).toLocaleDateString()}</span>
                      {item.duration && <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {item.duration} mins</span>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  {activeTab === 'lectures' ? (
                    <Link 
                      href={`/watch/${item._id}`}
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 transition-all shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95"
                    >
                      WATCH <Play className="w-5 h-5 fill-current" />
                    </Link>
                  ) : (
                    <a 
                      href={item.url} 
                      target="_blank"
                      className="bg-slate-800 hover:bg-slate-700 px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 transition-all border border-white/5 hover:border-white/20"
                    >
                      OPEN PDF <Download className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
