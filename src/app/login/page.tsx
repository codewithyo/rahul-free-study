"use client";

import { useState } from "react";
import { ArrowRight, Lock, Phone, ShieldCheck } from "lucide-react";
import axios from "axios";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const CLIENT_ID = "5eb393ee95fab7468a79d189";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) { setError("Enter 10 digit number"); return; }
    setLoading(true); setError("");
    
    try {
      // 2026 Strategy: Direct fetch from user's IP (Bypasses Vercel Server Block)
      const res = await axios.post(`https://api.penpencil.co/v2/users/login-otp`, {
        phone: phone,
        countryCode: "+91",
        clientId: CLIENT_ID,
        mode: "login"
      }, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
          "client-id": CLIENT_ID,
          "version": "54"
        }
      });

      if (res.data.success) { setStep(2); } 
      else { setError(res.data.message || "Try again later"); }
    } catch (err: any) {
      console.log("Direct failed, trying proxy fallback...");
      try {
        const proxyRes = await axios.post(`/api/auth/login`, { phone });
        if (proxyRes.data.success) { setStep(2); }
        else { setError("Server busy. Use different number."); }
      } catch (e) {
        setError("PW Server Blocked. Try after 10 mins.");
      }
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await axios.post(`https://api.penpencil.co/v2/users/verify-otp`, {
        phone: phone,
        otp: otp,
        countryCode: "+91",
        clientId: CLIENT_ID,
        mode: "login"
      }, {
        headers: {
          "Content-Type": "application/json",
          "client-id": CLIENT_ID,
          "version": "54"
        }
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        window.location.href = "/study";
      } else { setError("Wrong OTP"); }
    } catch (err) {
      try {
        const proxyRes = await axios.post(`/api/auth/verify-otp`, { phone, otp });
        if (proxyRes.data.success) {
          localStorage.setItem("token", proxyRes.data.token);
          window.location.href = "/study";
        } else { setError("Invalid OTP code"); }
      } catch (e) {
        setError("Verification Failed");
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-[#020617] min-h-screen flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#0f172a]/80 backdrop-blur-3xl rounded-[48px] p-12 shadow-2xl border border-white/10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/30">
            {step === 1 ? <Phone className="w-10 h-10 text-white" /> : <Lock className="w-10 h-10 text-white" />}
          </div>
          <h2 className="text-4xl font-black text-white mb-2">{step === 1 ? "Login" : "Verify"}</h2>
          <p className="text-slate-400 font-bold">Connect your account</p>
        </div>

        <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-6">
          {step === 1 ? (
            <input
              type="tel" maxLength={10} required
              className="w-full bg-slate-950 border border-white/10 rounded-3xl py-5 px-8 text-white font-bold text-xl focus:ring-4 focus:ring-blue-600/20 outline-none transition-all"
              placeholder="10-digit number" value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
          ) : (
            <input
              type="text" maxLength={6} required
              className="w-full bg-slate-950 border border-white/10 rounded-3xl py-5 px-6 text-center text-4xl font-black tracking-[0.5em] text-blue-500 focus:ring-4 focus:ring-blue-600/20 outline-none transition-all"
              placeholder="000000" value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          )}

          {error && <div className="text-red-500 text-center font-black bg-red-500/10 py-3 rounded-2xl border border-red-500/20">{error}</div>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-3xl font-black text-xl shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "PLEASE WAIT..." : step === 1 ? "SEND CODE" : "VERIFY"}
            {!loading && <ArrowRight className="w-6 h-6" />}
          </button>
        </form>
      </div>
    </div>
  );
}
