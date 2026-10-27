import { Video, Scissors, Zap, TrendingUp, PlusCircle, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { UsageWidget } from "@/components/dashboard/UsageWidget";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import Link from "next/link";
import { mockProjects, mockStats, mockShorts } from "@/lib/mock-data";

export default function DashboardPage() {
  const topShorts = mockShorts.sort((a, b) => b.viralScore - a.viralScore).slice(0, 3);

  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      {/* Quick action hero */}
      <div className="relative rounded-3xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-900/20 via-base-800/50 to-coral-900/10 p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.15),transparent_60%)]" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                AI Ready
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Turn any video into<br />
              <span className="gradient-text">viral Shorts</span>
            </h2>
            <p className="text-base-300 text-sm max-w-md">
              Paste a YouTube URL and our AI finds the most engaging moments, generates captions, titles, and metadata automatically.
            </p>
          </div>
          <Link href="/new">
            <Button size="lg" className="shrink-0 gap-2">
              <PlusCircle size={18} />
              Create New Short
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Projects"
          value={mockStats.totalProjects}
          change={12}
          changeLabel="vs last month"
          icon={<Video size={18} />}
          accent="violet"
        />
        <StatCard
          label="Shorts Created"
          value={mockStats.totalShorts}
          change={23}
          changeLabel="vs last month"
          icon={<Scissors size={18} />}
          accent="coral"
        />
        <StatCard
          label="Credits Left"
          value={mockStats.creditsTotal - mockStats.creditsUsed}
          icon={<Zap size={18} />}
          accent="cyan"
        />
        <StatCard
          label="Avg Viral Score"
          value={mockStats.avgViralScore}
          change={5}
          changeLabel="vs last month"
          icon={<TrendingUp size={18} />}
          accent="green"
          suffix="%"
        />
      </div>

      {/* Main 2-col grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentProjects projects={mockProjects} />
        </div>

        <div className="space-y-6">
          <UsageWidget stats={mockStats} />

          {/* Top viral shorts */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
            <h2 className="font-semibold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Top Viral Scores
            </h2>
            <div className="space-y-3">
              {topShorts.map((short, i) => (
                <Link key={short.id} href={`/projects/${short.projectId}`}>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all group">
                    <span className="text-xs font-bold text-base-500 w-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      #{i + 1}
                    </span>
                    <ScoreRing score={short.viralScore} size={44} strokeWidth={4} showLabel={false} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white group-hover:text-violet-300 transition-colors truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {short.title}
                      </p>
                      <p className="text-[10px] text-base-500 mt-0.5">{short.duration}s clip</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
