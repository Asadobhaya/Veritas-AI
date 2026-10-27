"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    window.location.href = "/dashboard";
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Welcome back</h1>
          <p className="text-sm text-[#9898B0]">Sign in to your ShortsAI account</p>
        </div>

        <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/[0.1] text-sm text-[#C8C8DA] hover:bg-white/[0.04] hover:border-white/[0.2] transition-all mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-xs text-[#606080]">or email</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        <div className="space-y-4">
          {error && (
            <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">{error}</div>
          )}
          <div>
            <label className="block text-xs font-medium text-[#9898B0] mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A3A55]" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="input-field w-full pl-9 pr-4 py-3 text-sm" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#9898B0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Password</label>
              <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Forgot?</a>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A3A55]" />
              <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="input-field w-full pl-9 pr-10 py-3 text-sm" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A3A55] hover:text-[#9898B0] transition-colors">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {loading ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75"/></svg> Signing in…</>
            ) : (<>Sign in <ArrowRight size={15} /></>)}
          </button>
        </div>
      </div>
      <p className="text-center text-sm text-[#606080] mt-6">
        No account yet?{" "}
        <Link href="/signup" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">Create one free</Link>
      </p>
    </div>
  );
}
