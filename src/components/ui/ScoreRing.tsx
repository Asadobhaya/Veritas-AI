"use client";
import { useEffect, useState } from "react";
import { getScoreColor, getScoreLabel, getScoreDashOffset } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  showScore?: boolean;
  className?: string;
  animate?: boolean;
}

export function ScoreRing({
  score,
  size = 80,
  strokeWidth = 6,
  showLabel = true,
  showScore = true,
  className,
  animate = true,
}: ScoreRingProps) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const targetOffset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? (animated ? targetOffset : circumference) : targetOffset}
          style={{
            transition: animate ? "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)" : undefined,
            filter: `drop-shadow(0 0 6px ${color}80)`,
          }}
        />
        {/* Glow ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? (animated ? targetOffset : circumference) : targetOffset}
          style={{
            transition: animate ? "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)" : undefined,
            opacity: 0.15,
          }}
        />
      </svg>

      {/* Center text */}
      {(showScore || showLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showScore && (
            <span
              className="font-bold leading-none"
              style={{ color, fontSize: size * 0.22, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {score}
            </span>
          )}
          {showLabel && (
            <span
              className="font-medium text-base-400 leading-none mt-0.5"
              style={{ fontSize: size * 0.13 }}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
