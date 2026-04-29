import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { BookOpen, Home, Layout, LogIn } from "lucide-react";

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
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen font-sans">
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight">Rahul-free-study</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link href="/study" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <Layout className="w-4 h-4" /> Study
              </Link>
              <Link href="/login" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full font-medium transition-all">
                <LogIn className="w-4 h-4" /> Login
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
