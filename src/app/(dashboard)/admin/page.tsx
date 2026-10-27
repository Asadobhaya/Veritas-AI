"use client";
import { useState } from "react";
import { Users, DollarSign, Video, TrendingUp, MoreVertical, Search, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { mockAdminUsers, mockRevenueData } from "@/lib/mock-data";
import { timeAgo, cn } from "@/lib/utils";

const planColors = { free: "gray", pro: "violet", agency: "cyan" } as const;

const summaryStats = [
  { label: "Total Users", value: "1,284", change: "+12%", icon: Users, accent: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Monthly Revenue", value: "$16,800", change: "+18%", icon: DollarSign, accent: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Videos Processed", value: "8,342", change: "+31%", icon: Video, accent: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "Conversion Rate", value: "12.4%", change: "+2.1%", icon: TrendingUp, accent: "text-coral-400", bg: "bg-coral-500/10" },
];

interface TooltipPayloadItem {
  name: string;
  value: number | string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-base-700 border border-white/10 rounded-xl p-3 text-sm shadow-xl">
      <p className="text-base-300 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.name === "revenue" ? `$${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = mockAdminUsers.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search)
  );

  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      {/* Admin badge */}
      <div className="flex items-center gap-2 text-xs text-coral-400 bg-coral-500/10 border border-coral-500/20 rounded-xl px-4 py-2.5 w-fit">
        <ShieldCheck size={14} />
        <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin Panel — Platform Overview</span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", s.bg)}>
                <Icon size={18} className={s.accent} />
              </div>
              <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {s.value}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-base-400">{s.label}</span>
                <span className="text-xs text-emerald-400 font-medium">{s.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
          <h3 className="font-semibold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Monthly Revenue</h3>
          <p className="text-xs text-base-400 mb-4">Total revenue over the last 9 months</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockRevenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area dataKey="revenue" stroke="#7C3AED" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Users chart */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
          <h3 className="font-semibold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>User Growth</h3>
          <p className="text-xs text-base-400 mb-4">New users per month</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mockRevenueData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="users" fill="#00D4FF" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User management table */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03]">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h3 className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>User Management</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users…"
              className="input-field pl-8 pr-4 py-1.5 text-sm w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["User", "Plan", "Credits", "Projects", "Joined", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-base-400 uppercase tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-coral-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{user.name}</p>
                        <p className="text-xs text-base-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={planColors[user.plan as keyof typeof planColors] ?? "gray"} size="sm">
                      {user.plan}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-base-300">{user.credits}</td>
                  <td className="px-4 py-3 text-sm text-base-300">{user.projects}</td>
                  <td className="px-4 py-3 text-xs text-base-500">{timeAgo(user.joinedAt)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.status === "active" ? "green" : "red"} size="sm">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                        className="p-1.5 rounded-lg text-base-500 hover:text-white hover:bg-white/[0.06] transition-all"
                      >
                        <MoreVertical size={14} />
                      </button>
                      {openMenu === user.id && (
                        <div className="absolute right-0 top-8 w-44 bg-base-700 border border-white/10 rounded-xl shadow-2xl z-10 overflow-hidden">
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-base-200 hover:bg-white/[0.06] transition-all">
                            {user.status === "active" ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                            {user.status === "active" ? "Suspend" : "Activate"}
                          </button>
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-950/30 transition-all">
                            <Trash2 size={14} />
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-white/[0.04] text-xs text-base-400">
          Showing {filtered.length} of {mockAdminUsers.length} users
        </div>
      </div>
    </div>
  );
}
