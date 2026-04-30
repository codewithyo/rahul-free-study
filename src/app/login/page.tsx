"use client";

import { useState } from "react";
import { ArrowRight, Lock, Phone, ShieldCheck, Sparkles } from "lucide-react";
import axios from "axios";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) { setError("Enter 10 digit number"); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post("/api/auth/login", { phone });
      if (res.data.success) { setStep(2); } 
      else { setError(res.data.message || "Service Down"); }
    } catch (err) { setError("Server Error. Check logs."); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await axios.post("/api/auth/verify-otp", { phone, otp });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/study";
      } else { setError("Invalid OTP"); }
    } catch (err) { setError("Verification Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-premium min-h-screen flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full glass rounded-[40px] p-10 shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 blur-3xl rounded-full"></div>
        
        <div className="text-center mb-12 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl blue-glow animate-float">
            {step === 1 ? <Phone className="w-10 h-10 text-white" /> : <Lock className="w-10 h-10 text-white" />}
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">
            {step === 1 ? "Get Started" : "Verify Code"}
          </h2>
          <p className="text-slate-400 font-medium">
            {step === 1 ? "Connect your PW account to Rahul Study" : `Code sent to +91 ${phone}`}
          </p>
        </div>

        <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-6 relative z-10">
          {step === 1 ? (
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">+91</span>
              <input
                type="tel" maxLength={10} required
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-white font-bold text-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
                placeholder="Phone Number" value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          ) : (
            <input
              type="text" maxLength={6} required
              className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 px-6 text-center text-4xl font-black tracking-[0.6em] text-blue-500 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              placeholder="000000" value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-5 py-4 rounded-2xl text-sm font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-900/30 flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : step === 1 ? "SEND OTP" : "VERIFY NOW"}
            {!loading && <ArrowRight className="w-6 h-6" />}
          </button>
        </form>

        <div className="mt-12 flex items-center justify-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          Secured by Rahul Study Engine
        </div>
      </div>
    </div>
  );
}
