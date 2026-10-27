"use client";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Welcome back, Malik 👋" },
  "/projects": { title: "Projects", subtitle: "All your converted videos" },
  "/new": { title: "New Project", subtitle: "Convert a YouTube video to Shorts" },
  "/settings": { title: "Settings", subtitle: "Manage your account" },
  "/admin": { title: "Admin Panel", subtitle: "Platform overview and management" },
};

export function Header() {
  const path = usePathname();
  const base = "/" + path.split("/")[1];
  const info = titles[base] ?? { title: "ShortsAI", subtitle: "" };

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {info.title}
          </h1>
          <p className="text-xs text-[#9898B0]">{info.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl text-[#606080] hover:text-white hover:bg-white/[0.06] transition-all">
            <Search size={18} />
          </button>
          <button className="relative p-2 rounded-xl text-[#606080] hover:text-white hover:bg-white/[0.06] transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full border border-[#0A0A0F]" />
          </button>
        </div>
      </div>
    </header>
  );
}
