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
  const [tokenId, setTokenId] = useState("");
  const [smsType, setSmsType] = useState(0);

  const CLIENT_ID = process.env.NEXT_PUBLIC_PW_CLIENT_ID || "";

  const handleSendOtp = async (e: any) => {
    e.preventDefault();
    if (phone.length !== 10) { setError("Enter 10 digit number"); return; }
    setLoading(true); setError("");

    try {
      const res = await axios.post(`/api/auth/get-otp`, { phone, smsType });
      if (res.data.success) {
        // prefer token field if provided
        const t = res.data.token || res.data.data?.data?.t || res.data.data?.t || null;
        if (t) setTokenId(t);
        setStep(2);
      } else {
        setError(res.data.message || 'Failed to request OTP');
      }
    } catch (e: any) {
      setError('Unable to request OTP at this time.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      // verify using tokenId if available
      const payload: any = { otp };
      if (tokenId) payload.token = tokenId;

      const res = await axios.post(`/api/auth/verify-otp`, payload);
      if (res.data.success) {
        // server sets cookie; redirect to study
        window.location.href = '/study';
      } else {
        setError(res.data.message || 'Invalid OTP');
      }
    } catch (e: any) {
      setError('Verification failed');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/resend-otp', { phone, smsType });
      if (res.data.success) setError('OTP resent');
      else setError('Resend failed');
    } catch (e) { setError('Resend failed'); }
    finally { setLoading(false); }
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
              onChange={(e: any) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
              ) : (
            <input
              type="text" maxLength={6} required
              className="w-full bg-slate-950 border border-white/10 rounded-3xl py-5 px-6 text-center text-4xl font-black tracking-[0.5em] text-blue-500 focus:ring-4 focus:ring-blue-600/20 outline-none transition-all"
              placeholder="000000" value={otp}
              onChange={(e: any) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          )}

          {step === 1 && (
            <div className="flex items-center gap-3 justify-center text-sm text-slate-400">
              <label className={`p-2 rounded-xl ${smsType===0? 'bg-slate-800/40 text-white':'hover:bg-white/5'}`}>
                <input type="radio" name="smsType" checked={smsType===0} onChange={() => setSmsType(0)} className="hidden" /> SMS
              </label>
              <label className={`p-2 rounded-xl ${smsType===1? 'bg-slate-800/40 text-white':'hover:bg-white/5'}`}>
                <input type="radio" name="smsType" checked={smsType===1} onChange={() => setSmsType(1)} className="hidden" /> WhatsApp
              </label>
            </div>
          )}

          {error && <div className="text-red-500 text-center font-black bg-red-500/10 py-3 rounded-2xl border border-red-500/20">{error}</div>}
          {step === 2 && (
            <div className="flex items-center justify-between text-sm text-slate-400">
              <button type="button" onClick={handleResend} className="text-blue-400 hover:underline">Resend OTP</button>
              <div className="text-slate-500">Channel: {smsType===0? 'SMS' : 'WhatsApp'}</div>
            </div>
          )}

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
