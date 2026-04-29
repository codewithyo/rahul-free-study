"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { Book, ChevronRight, PlayCircle, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BatchDetails({ params }: { params: Promise<{ batchid: string }> }) {
  const { batchid } = use(params);
  const [batchData, setBatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`/api/v1/batches/${batchid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBatchData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch batch details");
      } finally {
        setLoading(false);
      }
    };
    fetchBatchDetails();
  }, [batchid]);

  if (loading) return <div className="p-20 text-center animate-pulse text-2xl font-bold">Loading Batch Details...</div>;
  if (!batchData) return <div className="p-20 text-center text-red-500">Batch not found or expired.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row gap-8 items-center mb-12">
        <div className="relative w-64 h-36 rounded-2xl overflow-hidden shadow-2xl">
          <Image src={batchData.previewImage || "https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/760dd986-5030-48dd-8ae3-3daeb0244b65.png"} alt={batchData.name} fill className="object-cover" unoptimized />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{batchData.name}</h1>
          <p className="text-slate-400 max-w-2xl mb-4">{batchData.description}</p>
          <div className="flex items-center gap-4">
            <span className="bg-blue-600/20 text-blue-500 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
              {batchData.batchType}
            </span>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <Users className="w-4 h-4" /> 10k+ Students
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Book className="w-6 h-6 text-blue-500" /> Explore Subjects
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batchData.subjects?.map((subject: any) => (
          <Link 
            href={`/study/batches/${batchid}/subjects/${subject._id}`}
            key={subject._id}
            className="group bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 group-hover:bg-blue-600/20 p-3 rounded-xl text-blue-500 transition-colors">
                <PlayCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{subject.subjectName}</h3>
                <p className="text-slate-500 text-sm">{subject.instructorName || "Top Faculty"}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
