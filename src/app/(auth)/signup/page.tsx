"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check } from "lucide-react";

const plans = [
  { id: "free", label: "Free", sub: "5 credits/mo", price: "$0" },
  { id: "pro", label: "Pro", sub: "100 credits/mo", price: "$29/mo", featured: true },
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("free");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    window.location.href = "/dashboard";
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Create your account</h1>
          <p className="text-sm text-[#9898B0]">Start turning videos into viral Shorts — free</p>
        </div>

        {/* Plan picker */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {plans.map(p => (
            <button key={p.id} onClick={() => setPlan(p.id)}
              className={`rounded-xl border p-3 text-left transition-all ${plan === p.id ? "border-violet-500/40 bg-violet-500/10" : "border-white/[0.08] hover:border-white/[0.15]"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.label}</span>
                {plan === p.id && <Check size={14} className="text-violet-400" />}
              </div>
              <p className="text-xs text-[#9898B0]">{p.sub}</p>
              <p className="text-xs font-bold text-white mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.price}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {error && (
            <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">{error}</div>
          )}
          <div>
            <label className="block text-xs font-medium text-[#9898B0] mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Full name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A3A55]" />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                className="input-field w-full pl-9 pr-4 py-3 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#9898B0] mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A3A55]" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="input-field w-full pl-9 pr-4 py-3 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#9898B0] mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A3A55]" />
              <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                className="input-field w-full pl-9 pr-10 py-3 text-sm" />
              <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A3A55] hover:text-[#9898B0] transition-colors">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {loading ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75"/></svg> Creating account…</>
            ) : (<>Create account <ArrowRight size={15} /></>)}
          </button>
        </div>

        <p className="text-center text-xs text-[#606080] mt-4">
          By signing up you agree to our{" "}
          <a href="#" className="text-violet-400 hover:underline">Terms</a> and{" "}
          <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>.
        </p>
      </div>
      <p className="text-center text-sm text-[#606080] mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">Sign in</Link>
      </p>
    </div>
  );
}
