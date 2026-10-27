import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "violet" | "coral" | "cyan" | false;
  hover?: boolean;
  gradient?: boolean;
}

export function Card({ children, className, glow, hover, gradient }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm",
        hover && "transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)] cursor-pointer",
        glow === "violet" && "shadow-[0_0_30px_rgba(124,58,237,0.15)] border-violet-500/20",
        glow === "coral" && "shadow-[0_0_30px_rgba(255,77,109,0.15)] border-coral-500/20",
        glow === "cyan" && "shadow-[0_0_20px_rgba(0,212,255,0.15)] border-cyan-500/20",
        gradient && "card-border",
        className
      )}
    >
      {children}
    </div>
  );
}
