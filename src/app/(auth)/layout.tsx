import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      <div className="fixed w-[500px] h-[500px] rounded-full bg-violet-500 top-[-200px] left-[-100px] opacity-[0.07] blur-[120px] pointer-events-none" />
      <div className="fixed w-[300px] h-[300px] rounded-full bg-coral-500 bottom-[10%] right-[-50px] opacity-[0.06] blur-[100px] pointer-events-none" />

      <nav className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ShortsAI</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        {children}
      </div>
    </div>
  );
}
