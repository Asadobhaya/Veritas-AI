"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "coral" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, iconRight, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variants = {
      primary: "bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_25px_rgba(124,58,237,0.5)] hover:-translate-y-px active:translate-y-0",
      coral: "bg-gradient-to-br from-coral-500 to-coral-700 text-white shadow-[0_4px_15px_rgba(255,77,109,0.3)] hover:shadow-[0_6px_25px_rgba(255,77,109,0.5)] hover:-translate-y-px active:translate-y-0",
      ghost: "bg-transparent text-base-300 hover:bg-base-700 hover:text-white",
      outline: "bg-transparent border border-base-500 text-base-200 hover:border-violet-500 hover:text-violet-300",
      danger: "bg-transparent border border-red-800 text-red-400 hover:bg-red-900/20 hover:border-red-600",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
      xl: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon}
        {children}
        {iconRight}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
