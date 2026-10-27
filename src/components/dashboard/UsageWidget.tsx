"use client";
import { Zap, HardDrive, BarChart2 } from "lucide-react";
import type { DashboardStats } from "@/types";
import { formatFileSize } from "@/lib/utils";

interface UsageWidgetProps {
  stats: DashboardStats;
}

interface UsageBarProps {
  label: string;
  used: number;
  total: number;
  icon: React.ReactNode;
  formatValue: (n: number) => string;
  color: string;
}

function UsageBar({ label, used, total, icon, formatValue, color }: UsageBarProps) {
  const pct = Math.round((used / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-base-300">
          <div className="text-base-400">{icon}</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</span>
        </div>
        <span className="text-white font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {formatValue(used)} / {formatValue(total)}
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: pct > 80 ? "linear-gradient(90deg, #FF4D6D, #C02040)" : color }}
        />
      </div>
      <div className="text-xs text-base-500 text-right">{pct}% used</div>
    </div>
  );
}

export function UsageWidget({ stats }: UsageWidgetProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
      <h2 className="font-semibold text-white mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Usage
      </h2>

      <div className="space-y-5">
        <UsageBar
          label="Credits"
          used={stats.creditsUsed}
          total={stats.creditsTotal}
          icon={<Zap size={14} />}
          formatValue={(n) => String(n)}
          color="linear-gradient(90deg, #7C3AED, #00D4FF)"
        />
        <UsageBar
          label="Storage"
          used={stats.storageUsed}
          total={stats.storageTotal}
          icon={<HardDrive size={14} />}
          formatValue={(n) => formatFileSize(n)}
          color="linear-gradient(90deg, #7C3AED, #00D4FF)"
        />
        <UsageBar
          label="Projects"
          used={stats.totalProjects}
          total={50}
          icon={<BarChart2 size={14} />}
          formatValue={(n) => String(n)}
          color="linear-gradient(90deg, #7C3AED, #00D4FF)"
        />
      </div>
    </div>
  );
}
