import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, iconRight, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-base-200 mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-400">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={cn(
              "input-field w-full px-4 py-2.5 text-sm",
              icon && "pl-10",
              iconRight && "pr-10",
              error && "border-red-500/60 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-base-400">
              {iconRight}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-base-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
