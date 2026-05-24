import { ArrowRight, GraduationCap, PlayCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import axios from 'axios';
import { useState } from 'react';
import { saveSession, getRandomId } from '../lib/session';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-32 relative">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
            Education for <span className="text-blue-500">Everyone</span>, Everywhere.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Access high-quality study materials, live lectures, and DPPs from India top educators. Start your journey to success with Rahul-free-study.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full md:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all">
              <PlayCircle className="w-5 h-5" /> Watch Demo
            </button>
          </div>

          <div className="mt-8 w-full max-w-md mx-auto">
            <OTPWidget />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl">
            <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-blue-500">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Expert Teachers</h3>
            <p className="text-slate-400">Learn from the best educators in India with years of experience in competitive exams.</p>
          </div>
          
          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl">
            <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-purple-500">
              <PlayCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Live & Recorded</h3>
            <p className="text-slate-400">Missed a class? No problem. Access recorded sessions anytime, anywhere on any device.</p>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl">
            <div className="bg-green-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-green-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Free Access</h3>
            <p className="text-slate-400">We believe in equal education. Access premium resources without any hidden charges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OTPWidget() {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenId, setTokenId] = useState('');

  const send = async (e?: any) => {
    e?.preventDefault();
    if (phone.replace(/\D/g, '').length < 6) { setError('Enter phone'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/get-otp', { phone });
      if (res.data?.success) {
        const t = res.data.token || res.data.data?.data?.t || res.data.data?.t || null;
        if (t) setTokenId(t);
        setStep(2);
      } else setError(res.data?.message || 'Failed');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const verify = async (e?: any) => {
    e?.preventDefault();
    setLoading(true); setError('');
    try {
      const payload: any = { otp };
      if (tokenId) payload.token = tokenId; else payload.username = phone;
      const res = await axios.post('/api/auth/verify-otp', payload, { withCredentials: true });
      if (res.data?.success) {
        try {
          const me = await axios.get('/api/auth/me', { withCredentials: true });
          const user = me.data?.data || null;
          saveSession(phone, user, getRandomId());
        } catch {}
        window.location.href = '/study';
      } else setError(res.data?.message || 'Invalid OTP');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
      {step === 1 ? (
        <form onSubmit={send} className="flex gap-2">
          <input value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="Phone" className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700" />
          <button className="px-4 py-3 bg-blue-600 rounded-lg" disabled={loading}>{loading ? '...' : 'Send'}</button>
        </form>
      ) : (
        <form onSubmit={verify} className="flex gap-2">
          <input value={otp} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="OTP" className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700" />
          <button className="px-4 py-3 bg-green-600 rounded-lg" disabled={loading}>{loading ? '...' : 'Verify'}</button>
        </form>
      )}
      {error && <div className="mt-3 text-red-400">{error}</div>}
    </div>
  );
}
