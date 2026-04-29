import { ArrowRight, GraduationCap, PlayCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-32 relative">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Education for <span className="text-blue-500">Everyone</span>, Everywhere.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Access high-quality study materials, live lectures, and DPPs from India's top educators. Start your journey to success with Rahul-free-study.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/study" className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full md:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all">
              <PlayCircle className="w-5 h-5" /> Watch Demo
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-blue-500">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Expert Teachers</h3>
            <p className="text-slate-400">Learn from the best educators in India with years of experience in competitive exams.</p>
          </div>
          
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-purple-500">
              <PlayCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Live & Recorded</h3>
            <p className="text-slate-400">Missed a class? Don't worry. Access recorded sessions anytime, anywhere on any device.</p>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <div className="bg-green-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-green-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Free Access</h3>
            <p className="text-slate-400">We believe in equal education. Access premium resources without any hidden charges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
