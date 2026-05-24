"use client";

import { useState } from "react";
import { ArrowRight, Lock, Phone } from "lucide-react";
import axios from "axios";
import { saveSession, getRandomId } from "../../lib/session";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [rawTokenInput, setRawTokenInput] = useState("");
  const [smsType, setSmsType] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [maskedPhone, setMaskedPhone] = useState("");

  const CLIENT_ID = process.env.NEXT_PUBLIC_PW_CLIENT_ID || "";

  const handleSendOtp = async (e: any) => {
    e.preventDefault();
    if (phone.length !== 10) { setError("Enter 10 digit number"); return; }
    setLoading(true); setError("");

    try {
      const res = await axios.post(`/api/auth/get-otp`, { phone });
      if (res.data.success) {
        const t = res.data.token || res.data.data?.data?.t || res.data.data?.t || null;
        if (t) setTokenId(t);
        setStep(2);
        setResendTimer(30);
        setMaskedPhone(phone.replace(/(\d{4})\d{3}(\d{3})/, "$1***$2"));
        const id = setInterval(() => {
          setResendTimer((prev: number) => {
            if (prev <= 1) { clearInterval(id); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(res.data.message || 'Failed to request OTP');
      }
    } catch (e: any) {
      console.error('get-otp error', e?.response?.data || e?.message || e);
      setError(e?.response?.data?.message || e?.message || 'Unable to request OTP at this time.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const payload: any = { otp };
      if (tokenId) payload.token = tokenId;
      else payload.username = phone;

      const res = await axios.post(`/api/auth/verify-otp`, payload);
      if (res.data.success) {
          try {
            // fetch user data from server (pw_token cookie should be set)
            const me = await axios.get('/api/auth/me', { withCredentials: true });
            const user = me.data?.data || null;
            saveSession(phone, user, getRandomId());
          } catch (e: any) {
            console.warn('Could not fetch user after verify', e?.response?.data || e?.message || e);
          }
          // redirect to study
          window.location.href = '/study';
      } else {
        console.error('verify-otp failed', res.data);
        setError(res.data.message || 'Invalid OTP');
      }
    } catch (e: any) {
      console.error('verify-otp error', e?.response?.data || e?.message || e);
      setError(e?.response?.data?.message || e?.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  const handleTokenLogin = async (e: any) => {
    e.preventDefault();
    if (!rawTokenInput) { setError('Paste access token'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/token-login', { token: rawTokenInput }, { withCredentials: true });
      if (res.data.success) {
          try {
        const me = await axios.get('/api/auth/me', { withCredentials: true });
            const user = me.data?.data || null;
            // preserve mobile if we have it
            saveSession(phone || null, user, getRandomId());
          } catch (e: any) {
            console.warn('Could not fetch user after token login', e?.response?.data || e?.message || e);
          }
          window.location.href = '/study';
      } else {
        setError(res.data.message || 'Token invalid');
      }
    } catch (err: any) {
      console.error('token-login error', err?.response?.data || err?.message || err);
      setError(err?.response?.data?.message || err?.message || 'Token verification failed');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/resend-otp', { phone, smsType });
      if (res.data.success) {
        setError('OTP resent');
        setResendTimer(30);
        const id = setInterval(() => {
          setResendTimer((prev: number) => {
            if (prev <= 1) { clearInterval(id); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else setError('Resend failed');
    } catch (e: any) { console.error('resend error', e?.response?.data || e?.message || e); setError(e?.response?.data?.message || e?.message || 'Resend failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-[#020617] min-h-screen flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#0f172a]/80 backdrop-blur-3xl rounded-[48px] p-12 shadow-2xl border border-white/10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/30">
            {step === 1 ? <Phone className="w-10 h-10 text-white" /> : <Lock className="w-10 h-10 text-white" />}
          </div>
          <h2 className="text-4xl font-black text-white mb-2">{step === 1 ? "Login" : "Verify & Secure"}</h2>
          <p className="text-slate-400 font-bold">Secure access using OTP — no password required</p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-3 h-3 rounded-full ${step===1? 'bg-blue-400':'bg-slate-700'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step===2? 'bg-blue-400':'bg-slate-700'}`}></div>
          </div>
        </div>

        <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-6">
          {step === 1 ? (
            <input
              type="tel" maxLength={10} required
              className="w-full bg-slate-950 border border-white/10 rounded-3xl py-5 px-8 text-white font-bold text-xl focus:ring-4 focus:ring-blue-600/20 outline-none transition-all"
              placeholder="10-digit number" value={phone}
              onChange={(e: any) => setPhone(e.target.value.replace(/\D/g, ""))}
              aria-label="Phone number"
            />
              ) : (
            <input
              type="text" maxLength={6} required
              className="w-full bg-slate-950 border border-white/10 rounded-3xl py-5 px-6 text-center text-4xl font-black tracking-[0.5em] text-blue-500 focus:ring-4 focus:ring-blue-600/20 outline-none transition-all"
              placeholder="000000" value={otp}
              onChange={(e: any) => setOtp(e.target.value.replace(/\D/g, ""))}
                  
            />
          )}
          {step === 2 && (
            <div className="text-center text-sm text-slate-400 mt-2">
              <div>OTP sent to <strong className="text-white">{maskedPhone || phone}</strong></div>
              <div className="mt-2 flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Resend via:</span>
                  <label className={`px-3 py-2 rounded-2xl cursor-pointer ${smsType===0? 'bg-slate-800/40 text-white':'hover:bg-white/5'}`}>
                    <input type="radio" name="smsType" checked={smsType===0} onChange={() => setSmsType(0)} className="hidden" /> SMS
                  </label>
                  <label className={`px-3 py-2 rounded-2xl cursor-pointer ${smsType===1? 'bg-slate-800/40 text-white':'hover:bg-white/5'}`}>
                    <input type="radio" name="smsType" checked={smsType===1} onChange={() => setSmsType(1)} className="hidden" /> WhatsApp
                  </label>
                </div>
                <button type="button" onClick={handleResend} disabled={resendTimer>0 || loading} className="text-blue-400 underline ml-2">{resendTimer>0 ? `Retry in ${resendTimer}s` : 'Resend'}</button>
              </div>
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
