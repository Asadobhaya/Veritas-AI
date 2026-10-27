"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderOpen, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/projects", icon: FolderOpen, label: "Projects" },
  { href: "/new", icon: PlusCircle, label: "Create", highlight: true },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const path = usePathname();

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D18]/95 backdrop-blur-xl border-t border-white/[0.06] px-2 pb-safe">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const active = path === item.href || path.startsWith(item.href + "/");
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 py-3 px-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)] -mt-5">
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-[10px] text-violet-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-3 px-4"
            >
              <Icon
                size={20}
                className={cn(active ? "text-violet-400" : "text-base-400")}
              />
              <span
                className={cn("text-[10px]", active ? "text-violet-400" : "text-base-500")}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
