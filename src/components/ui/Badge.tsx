import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "violet" | "coral" | "cyan" | "green" | "yellow" | "red" | "gray";
  size?: "sm" | "md";
  pulse?: boolean;
  className?: string;
}

export function Badge({ children, variant = "violet", size = "sm", pulse, className }: BadgeProps) {
  const variants = {
    violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    coral: "bg-coral-500/15 text-coral-300 border-coral-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    gray: "bg-base-600/50 text-base-300 border-base-500/30",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        variants[variant],
        sizes[size],
        pulse && "viral-badge",
        className
      )}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {children}
    </span>
  );
}
