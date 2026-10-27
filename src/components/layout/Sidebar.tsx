"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, PlusCircle, Settings,
  ShieldCheck, Zap, ChevronRight, LogOut, CreditCard,
  BarChart2, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: FolderOpen, label: "Projects" },
  { href: "/new", icon: PlusCircle, label: "New Short", highlight: true },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/admin", icon: ShieldCheck, label: "Admin", admin: true },
];

export function Sidebar() {
  const path = usePathname();
  const user = mockUser;
  const creditPct = Math.round(((user.creditsTotal - user.creditsUsed) / user.creditsTotal) * 100);

  return (
    <aside className="sidebar fixed left-0 top-0 h-screen w-64 flex flex-col bg-[#0D0D18] border-r border-white/[0.06] z-40">
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ShortsAI
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = path === item.href || path.startsWith(item.href + "/");
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mt-2 mb-2 bg-gradient-to-r from-violet-500/20 to-violet-700/10 border border-violet-500/30 text-violet-300 hover:from-violet-500/30 hover:to-violet-700/20 transition-all group"
              >
                <Icon size={18} />
                <span className="text-sm font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {item.label}
                </span>
                <ChevronRight size={14} className="ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm",
                active
                  ? "bg-violet-500/15 text-violet-300 border-r-2 border-violet-500"
                  : "text-base-300 hover:bg-white/[0.04] hover:text-white"
              )}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <Icon size={18} className={active ? "text-violet-400" : ""} />
              <span className="font-medium">{item.label}</span>
              {item.admin && (
                <span className="ml-auto text-[10px] bg-coral-500/20 text-coral-400 px-1.5 py-0.5 rounded-full border border-coral-500/30">
                  Admin
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Credits widget */}
      <div className="p-3">
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 mb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-base-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <Zap size={12} className="text-yellow-400" />
              <span>Credits</span>
            </div>
            <span className="text-xs font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {user.creditsTotal - user.creditsUsed}/{user.creditsTotal}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${creditPct}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-base-400 uppercase tracking-wide">{user.plan} plan</span>
            <Link href="/settings?tab=billing" className="text-[10px] text-violet-400 hover:text-violet-300 flex items-center gap-0.5">
              <CreditCard size={10} />
              Upgrade
            </Link>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] cursor-pointer group transition-all">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-coral-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {user.name}
            </p>
            <p className="text-xs text-base-400 truncate">{user.email}</p>
          </div>
          <LogOut size={14} className="text-base-500 group-hover:text-red-400 transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  );
}
