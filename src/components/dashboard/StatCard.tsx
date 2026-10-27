"use client";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  accent?: "violet" | "coral" | "cyan" | "green";
  suffix?: string;
}

export function StatCard({ label, value, change, changeLabel, icon, accent = "violet", suffix }: StatCardProps) {
  const accents = {
    violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
    coral: { bg: "bg-coral-500/10", text: "text-coral-400", border: "border-coral-500/20" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
    green: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  };

  const a = accents[accent];
  const positive = change !== undefined && change >= 0;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 hover:bg-white/[0.05] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl border", a.bg, a.border)}>
          <div className={a.text}>{icon}</div>
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            positive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {value}{suffix && <span className="text-base text-base-400 ml-1">{suffix}</span>}
        </div>
        <div className="text-sm text-base-400">{label}</div>
        {changeLabel && (
          <div className="text-xs text-base-500">{changeLabel}</div>
        )}
      </div>
    </div>
  );
}
