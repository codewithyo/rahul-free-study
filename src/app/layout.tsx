import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { BookOpen, Home, Layout, LogIn, Heart, BookMarked, Send, CircleHelp, Users, Menu, ChevronLeft, Presentation } from "lucide-react";

export const metadata: Metadata = {
  title: "Rahul-free-study - Access PW Content for Free",
  description: "High-quality education portal by Rahul Maida",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex font-sans">
        {/* Sidebar - Desktop */}
        <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                   <BookOpen className="text-blue-500 w-7 h-7" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Rahul Study</h1>
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Premium Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto space-y-2">
            <Link href="/study" className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/20 group transition-all">
              <div className="p-2 rounded-lg bg-white/20"><Presentation className="w-6 h-6" /></div>
              <div className="flex-1">
                <span className="font-bold">Batches</span>
                <p className="text-[10px] text-blue-100 opacity-80 uppercase font-bold tracking-tighter">Available Batches</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            </Link>

            <Link href="/enrolled" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all border border-transparent hover:border-gray-700">
              <div className="p-2 rounded-lg bg-gray-800"><Heart className="w-6 h-6" /></div>
              <span className="font-bold">Enrolled</span>
            </Link>

            <Link href="/library" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all border border-transparent hover:border-gray-700">
              <div className="p-2 rounded-lg bg-gray-800"><BookMarked className="w-6 h-6" /></div>
              <span className="font-bold">Library</span>
            </Link>

            <div className="pt-8 pb-4 px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Community</div>
            
            <a href="https://t.me/rahulstudy" target="_blank" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all">
              <div className="p-2 rounded-lg bg-gray-800 text-blue-400"><Send className="w-6 h-6" /></div>
              <span className="font-bold">Telegram</span>
            </a>

            <Link href="/help" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all">
              <div className="p-2 rounded-lg bg-gray-800"><CircleHelp className="w-6 h-6" /></div>
              <span className="font-bold">Help</span>
            </Link>
          </nav>

          <div className="p-6 border-t border-gray-800 bg-gray-900/80">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                      <Users className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-sm font-bold">Student Portal</p>
                      <p className="text-[10px] text-green-500 font-black flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> ONLINE</p>
                   </div>
                </div>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-4">
                <button className="xl:hidden p-2 rounded-lg bg-gray-800"><Menu className="w-6 h-6" /></button>
                <Link href="/" className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all">
                   <Home className="w-4 h-4" /> <span className="text-sm font-bold hidden sm:inline">Home</span>
                </Link>
             </div>

             <div className="flex items-center gap-4">
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20">
                   Sign In
                </Link>
             </div>
          </header>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
