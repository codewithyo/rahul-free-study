"use client";

import { useState } from "react";
import { ArrowRight, Lock, Phone, ShieldCheck } from "lucide-react";
import axios from "axios";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // API call to our proxy backend
      const res = await axios.post("/api/auth/login", { phone });
      if (res.data.success) {
        setStep(2);
      } else {
        setError(res.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/verify-otp", { phone, otp });
      if (res.data.success) {
        // Save token and redirect
        localStorage.setItem("token", res.data.token);
        window.location.href = "/study";
      } else {
        setError(res.data.message || "Invalid OTP.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full"></div>
        
        <div className="relative z-10 text-center mb-10">
          <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-500">
            {step === 1 ? <Phone className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {step === 1 ? "Welcome Back" : "Verify OTP"}
          </h2>
          <p className="text-slate-400">
            {step === 1 
              ? "Enter your phone number to continue" 
              : `Code sent to +91 ${phone}`}
          </p>
        </div>

        <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-6">
          {step === 1 ? (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">+91</span>
              <input
                type="tel"
                maxLength={10}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-14 pr-4 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium text-lg"
                placeholder="00000 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          ) : (
            <input
              type="text"
              maxLength={6}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-center text-3xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Please wait..." : step === 1 ? "Send OTP" : "Verify & Continue"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-sm">
          <ShieldCheck className="w-4 h-4" />
          Secure 256-bit encrypted login
        </div>
      </div>
    </div>
  );
}
