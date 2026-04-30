import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { BookOpen, Heart, BookMarked, Send, CircleHelp, Users, Menu, Home, Presentation } from "lucide-react";

export const metadata: Metadata = {
  title: "Rahul-free-study - Access PW Content for Free",
  description: "High-quality education portal by Rahul Maida",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#020617] text-gray-100 min-h-screen flex font-sans selection:bg-blue-500/30">
        {/* Sidebar */}
        <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 border-r border-white/5 bg-[#0f172a]/60 backdrop-blur-2xl">
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-2xl shadow-blue-500/40">
                <div className="w-full h-full rounded-[18px] bg-slate-900 flex items-center justify-center">
                   <BookOpen className="text-blue-500 w-7 h-7" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white">Rahul Study</h1>
                <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest opacity-70">Revolution 2026</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
            <Link href="/study" className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/30 group transition-all transform hover:scale-[1.02]">
              <div className="p-2 rounded-xl bg-white/20"><Presentation className="w-6 h-6 text-white" /></div>
              <span className="font-bold text-sm">Batches</span>
              <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></div>
            </Link>

            <Link href="/enrolled" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all border border-transparent hover:border-white/5">
              <div className="p-2 rounded-xl bg-slate-800/50"><Heart className="w-6 h-6" /></div>
              <span className="font-bold text-sm">Enrolled</span>
            </Link>

            <Link href="/library" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all border border-transparent hover:border-white/5">
              <div className="p-2 rounded-xl bg-slate-800/50"><BookMarked className="w-6 h-6" /></div>
              <span className="font-bold text-sm">Library</span>
            </Link>

            <div className="pt-10 pb-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Community</div>
            
            <a href="https://t.me/rahul_study" target="_blank" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group">
              <div className="p-2 rounded-xl bg-slate-800/50 group-hover:text-blue-400 transition-colors"><Send className="w-6 h-6" /></div>
              <span className="font-bold text-sm">Telegram</span>
            </a>

            <Link href="/help" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
              <div className="p-2 rounded-xl bg-slate-800/50"><CircleHelp className="w-6 h-6" /></div>
              <span className="font-bold text-sm">Help Center</span>
            </Link>
          </nav>

          <div className="p-8 border-t border-white/5 bg-[#0f172a]/40">
             <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-3xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-500 shadow-inner">
                   <Users className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-xs font-black text-white uppercase tracking-tighter">Student Portal</p>
                   <p className="text-[9px] text-green-500 font-black flex items-center gap-1 mt-0.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> SYSTEM LIVE</p>
                </div>
             </div>
          </div>
        </aside>

        {/* Header and Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <button className="xl:hidden p-3 rounded-2xl bg-slate-800/50 text-white"><Menu className="w-6 h-6" /></button>
                <Link href="/" className="flex items-center gap-3 bg-slate-800/40 hover:bg-slate-800 px-5 py-2.5 rounded-2xl border border-white/5 transition-all group">
                   <Home className="w-5 h-5 text-slate-400 group-hover:text-blue-500" /> 
                   <span className="text-sm font-bold text-slate-300">Dashboard</span>
                </Link>
             </div>

             <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col text-right mr-2">
                   <p className="text-xs font-black text-white uppercase tracking-widest">Rahul Maida</p>
                   <p className="text-[10px] text-slate-500 font-bold">Premium Student</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5">
                   <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-black text-blue-500">R</div>
                </div>
             </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
