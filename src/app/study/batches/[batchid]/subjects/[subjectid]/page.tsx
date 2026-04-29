"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { FileText, Play, Download, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function SubjectContent({ params }: { params: Promise<{ batchid: string; subjectid: string }> }) {
  const { batchid, subjectid } = use(params);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lectures");

  useEffect(() => {
    const fetchContent = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`/api/v1/batches/${batchid}/subjects/${subjectid}/contents?type=${activeTab}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
      <div className="flex gap-4 mb-10 bg-slate-900 p-2 rounded-2xl border border-slate-800 w-fit mx-auto md:mx-0">
        {["lectures", "notes", "dpp"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setLoading(true); }}
            className={`px-8 py-3 rounded-xl font-bold capitalize transition-all ${
              activeTab === tab ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-900 rounded-2xl animate-pulse border border-slate-800"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {content.length === 0 ? (
            <div className="text-center py-20 text-slate-500">No {activeTab} available yet.</div>
          ) : (
            content.map((item: any) => (
              <div key={item._id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all">
                <div className="flex gap-5 items-start">
                  <div className={`p-4 rounded-xl ${activeTab === 'lectures' ? 'bg-blue-600/10 text-blue-500' : 'bg-green-600/10 text-green-500'}`}>
                    {activeTab === 'lectures' ? <Play className="w-6 h-6 fill-current" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-2">{item.topic || item.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(item.date).toLocaleDateString()}</span>
                      {item.duration && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {item.duration} mins</span>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {activeTab === 'lectures' ? (
                    <Link 
                      href={`/watch/${item._id}`}
                      className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/10"
                    >
                      Watch Now <Play className="w-4 h-4" />
                    </Link>
                  ) : (
                    <a 
                      href={item.url} 
                      target="_blank"
                      className="bg-slate-800 hover:bg-slate-700 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
                    >
                      View PDF <Download className="w-4 h-4" />
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
