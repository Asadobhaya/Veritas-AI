"use client";

interface ProcessingVisualizerProps {
  active?: boolean;
  barCount?: number;
  height?: number;
}

/**
 * Animated waveform bars — the signature element for processing states.
 * When active=true the bars animate; when false they sit flat.
 */
export function ProcessingVisualizer({ active = true, barCount = 12, height = 40 }: ProcessingVisualizerProps) {
  return (
    <div className="flex items-center gap-[3px]" style={{ height }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 3,
            background: "linear-gradient(180deg, #7C3AED, #00D4FF)",
            height: active ? "100%" : "20%",
            transform: `scaleY(${active ? 1 : 0.2})`,
            transformOrigin: "center",
            transition: "transform 0.3s ease",
            animation: active
              ? `waveBar 1.2s ease-in-out ${(i * 0.08).toFixed(2)}s infinite`
              : "none",
          }}
        />
      ))}
      <style>{`
        @keyframes waveBar {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
