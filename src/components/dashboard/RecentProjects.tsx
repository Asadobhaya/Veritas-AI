"use client";
import Link from "next/link";
import { Clock, CheckCircle2, AlertCircle, Loader2, Zap, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/types";
import { formatDuration, timeAgo } from "@/lib/utils";

interface RecentProjectsProps {
  projects: Project[];
}

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-emerald-400", label: "Completed", badge: "green" as const },
  processing: { icon: Loader2, color: "text-violet-400 animate-spin", label: "Processing", badge: "violet" as const },
  pending: { icon: Clock, color: "text-yellow-400", label: "Pending", badge: "yellow" as const },
  failed: { icon: AlertCircle, color: "text-red-400", label: "Failed", badge: "red" as const },
};

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03]">
      <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
        <h2 className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Recent Projects
        </h2>
        <Link href="/projects" className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {projects.slice(0, 4).map((project) => {
          const s = statusConfig[project.status];
          const Icon = s.icon;

          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-base-800">
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.viralMode && (
                  <div className="absolute top-1 left-1">
                    <span className="flex items-center gap-0.5 bg-coral-500/90 text-white text-[9px] font-bold px-1 py-0.5 rounded">
                      <Zap size={8} />AI
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {project.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-base-400">{formatDuration(project.duration)}</span>
                  {project.shortsCount > 0 && (
                    <span className="text-xs text-base-400">• {project.shortsCount} shorts</span>
                  )}
                  <span className="text-xs text-base-500">• {timeAgo(project.createdAt)}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={s.badge} size="sm">
                  <Icon size={10} className={s.color} />
                  {s.label}
                </Badge>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
