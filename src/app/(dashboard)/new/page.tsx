"use client";
import { useState, useRef } from "react";
import { Link2, Zap, ChevronDown, ChevronUp, CheckCircle2, Loader2, Clock, AlertCircle, Play, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ProcessingVisualizer } from "@/components/ui/ProcessingVisualizer";
import { cn } from "@/lib/utils";
import { mockJob } from "@/lib/mock-data";
import type { Job } from "@/types";

// YouTube URL validation
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// Job progress step icons
function StepIcon({ status }: { status: string }) {
  if (status === "done") return <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />;
  if (status === "active") return <Loader2 size={16} className="text-violet-400 animate-spin shrink-0" />;
  if (status === "error") return <AlertCircle size={16} className="text-red-400 shrink-0" />;
  return <Clock size={16} className="text-base-500 shrink-0" />;
}

interface VideoPreview {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
}

export default function NewProjectPage() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [preview, setPreview] = useState<VideoPreview | null>(null);
  const [viralMode, setViralMode] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [advanced, setAdvanced] = useState({
    shortCount: 6,
    minDuration: 30,
    maxDuration: 60,
    captions: true,
    captionStyle: "tiktok",
    noiseReduction: true,
    colorEnhance: true,
    faceTrack: true,
    speedBoost: false,
    flipHorizontal: false,
  });

  const handleUrlChange = async (val: string) => {
    setUrl(val);
    setUrlError("");
    setPreview(null);

    if (!val) return;

    const id = extractYouTubeId(val);
    if (!id) {
      if (val.length > 10) setUrlError("Not a valid YouTube URL");
      return;
    }

    setLoadingPreview(true);
    // Simulate fetching video metadata
    await new Promise((r) => setTimeout(r, 800));
    setPreview({
      id,
      title: "How to Build a SaaS in 30 Days — Complete Guide",
      thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      duration: "54:12",
      channel: "Indie Hacker Academy",
    });
    setLoadingPreview(false);
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setJob({ ...mockJob, status: "downloading", progress: 0, steps: mockJob.steps.map((s) => ({ ...s, status: "pending" as const })) });
    setSubmitting(false);

    // Simulate job progress
    simulateJobProgress();
  };

  const simulateJobProgress = () => {
    let stepIdx = 0;
    const steps = mockJob.steps;

    const advance = () => {
      if (stepIdx >= steps.length) return;

      setJob((prev) => {
        if (!prev) return prev;
        const newSteps = prev.steps.map((s, i) => {
          if (i < stepIdx) return { ...s, status: "done" as const };
          if (i === stepIdx) return { ...s, status: "active" as const };
          return s;
        });
        const progress = Math.round((stepIdx / steps.length) * 95);
        return { ...prev, steps: newSteps, progress, currentStep: steps[stepIdx]?.label ?? "" };
      });

      stepIdx++;
      if (stepIdx <= steps.length) {
        setTimeout(advance, 1800 + Math.random() * 1200);
      }
    };

    setTimeout(advance, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-[fade-in_0.3s_ease-out]">

      {/* URL Input Card */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            YouTube Video URL
          </h2>
          <p className="text-sm text-base-400">Paste any YouTube video link to get started</p>
        </div>

        <div className="space-y-4">
          <Input
            ref={inputRef}
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            icon={<Link2 size={16} />}
            error={urlError}
            hint={!urlError ? "Supports youtube.com/watch, youtu.be, and YouTube Shorts URLs" : undefined}
          />

          {/* Loading preview skeleton */}
          {loadingPreview && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 flex gap-4">
              <div className="w-32 h-20 rounded-lg shimmer shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 shimmer rounded w-3/4" />
                <div className="h-3 shimmer rounded w-1/2" />
                <div className="h-3 shimmer rounded w-1/3" />
              </div>
            </div>
          )}

          {/* Video preview */}
          {preview && !loadingPreview && (
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 flex gap-4 animate-[fade-in_0.3s_ease-out]">
              <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0 bg-base-800">
                <img src={preview.thumbnail} alt={preview.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play size={14} fill="white" className="text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                  {preview.duration}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {preview.title}
                </p>
                <p className="text-xs text-base-400 mt-1">{preview.channel}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="violet" size="sm">✓ Valid URL</Badge>
                  <Badge variant="gray" size="sm">{preview.duration}</Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Viral Mode toggle */}
      <div className={cn(
        "rounded-2xl border p-5 transition-all cursor-pointer",
        viralMode
          ? "border-coral-500/30 bg-coral-500/5"
          : "border-white/[0.06] bg-white/[0.03]"
      )} onClick={() => setViralMode(!viralMode)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-xl transition-all",
              viralMode ? "bg-coral-500/20" : "bg-white/[0.06]"
            )}>
              <Zap size={20} className={viralMode ? "text-coral-400" : "text-base-400"} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Viral Shorts Mode
                </span>
                <Badge variant="coral" size="sm" pulse={viralMode}>PRO</Badge>
              </div>
              <p className="text-xs text-base-400 mt-0.5">
                AI finds hook moments, emotion peaks & viral patterns
              </p>
            </div>
          </div>
          {/* Toggle */}
          <div className={cn(
            "w-12 h-6 rounded-full transition-all relative",
            viralMode ? "bg-coral-500" : "bg-base-600"
          )}>
            <div className={cn(
              "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",
              viralMode ? "left-6" : "left-0.5"
            )} />
          </div>
        </div>

        {viralMode && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {[
              "🎯 Hook detection (first 3s)",
              "😊 Emotion analysis",
              "🔥 Viral moment scoring",
              "📊 Retention optimization",
              "🎤 Speaker emphasis",
              "✨ Auto metadata generation",
            ].map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-coral-300/80">
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced options */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
        <button
          className="flex items-center justify-between w-full p-5 hover:bg-white/[0.02] transition-all"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-base-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <Settings2 size={16} className="text-base-400" />
            Advanced Options
          </div>
          {showAdvanced ? <ChevronUp size={16} className="text-base-400" /> : <ChevronDown size={16} className="text-base-400" />}
        </button>

        {showAdvanced && (
          <div className="px-5 pb-5 space-y-5 border-t border-white/[0.06]">
            <div className="grid grid-cols-2 gap-4 pt-4">
              {/* Number of shorts */}
              <div>
                <label className="block text-xs font-medium text-base-300 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Number of Shorts
                </label>
                <div className="flex items-center gap-2">
                  {[5, 6, 7].map((n) => (
                    <button
                      key={n}
                      onClick={() => setAdvanced((p) => ({ ...p, shortCount: n }))}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all",
                        advanced.shortCount === n
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                          : "bg-base-700 text-base-400 hover:bg-base-600"
                      )}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration range */}
              <div>
                <label className="block text-xs font-medium text-base-300 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Clip Duration (seconds)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={advanced.minDuration}
                    onChange={(e) => setAdvanced((p) => ({ ...p, minDuration: +e.target.value }))}
                    className="input-field w-full px-3 py-1.5 text-sm text-center"
                    min={15} max={59}
                  />
                  <span className="text-base-500 text-xs">–</span>
                  <input
                    type="number"
                    value={advanced.maxDuration}
                    onChange={(e) => setAdvanced((p) => ({ ...p, maxDuration: +e.target.value }))}
                    className="input-field w-full px-3 py-1.5 text-sm text-center"
                    min={20} max={60}
                  />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "captions", label: "Burned-in Captions" },
                { key: "faceTrack", label: "Face Tracking" },
                { key: "noiseReduction", label: "Noise Reduction" },
                { key: "colorEnhance", label: "Color Enhancement" },
                { key: "speedBoost", label: "1.04× Speed Boost" },
                { key: "flipHorizontal", label: "Horizontal Flip" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setAdvanced((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all border",
                    advanced[key as keyof typeof advanced]
                      ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                      : "bg-base-800 text-base-400 border-white/[0.04] hover:border-white/[0.1]"
                  )}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <span>{label}</span>
                  <div className={cn(
                    "w-7 h-4 rounded-full transition-all relative",
                    advanced[key as keyof typeof advanced] ? "bg-violet-500" : "bg-base-600"
                  )}>
                    <div className={cn(
                      "w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all",
                      advanced[key as keyof typeof advanced] ? "left-3.5" : "left-0.5"
                    )} />
                  </div>
                </button>
              ))}
            </div>

            {/* Caption style */}
            {advanced.captions && (
              <div>
                <label className="block text-xs font-medium text-base-300 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Caption Style
                </label>
                <div className="flex gap-2">
                  {["tiktok", "youtube", "reels", "minimal"].map((style) => (
                    <button
                      key={style}
                      onClick={() => setAdvanced((p) => ({ ...p, captionStyle: style }))}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                        advanced.captionStyle === style
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                          : "bg-base-700 text-base-400 hover:bg-base-600"
                      )}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-base-500 bg-base-800/50 rounded-xl px-4 py-3 border border-white/[0.04]">
        <span className="font-semibold text-base-400">Copyright notice:</span> Only process videos you own or have explicit permission to use. Video transformations do not remove copyright obligations.
      </div>

      {/* Submit button */}
      {!job && (
        <Button
          size="xl"
          onClick={handleSubmit}
          disabled={!preview}
          loading={submitting}
          className="w-full"
          icon={<Zap size={18} />}
        >
          {viralMode ? "Generate Viral Shorts" : "Generate Shorts"}
        </Button>
      )}

      {/* Job progress */}
      {job && <JobProgress job={job} />}
    </div>
  );
}

function JobProgress({ job }: { job: Job }) {
  const isComplete = job.steps.every((s) => s.status === "done") || job.progress >= 95;

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 space-y-5 animate-[fade-in_0.3s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {isComplete ? "✅ Processing Complete!" : "⚡ Processing your video…"}
            </h3>
            {!isComplete && <ProcessingVisualizer active={!isComplete} barCount={8} height={20} />}
          </div>
          <p className="text-xs text-base-400">{job.currentStep}</p>
        </div>
        <div className="text-2xl font-bold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {job.progress}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar h-2">
        <div
          className="progress-fill h-full"
          style={{ width: `${job.progress}%`, transition: "width 0.5s ease" }}
        />
      </div>

      {/* Steps list */}
      <div className="space-y-2">
        {job.steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
              step.status === "active" && "bg-violet-500/10",
              step.status === "done" && "opacity-60"
            )}
          >
            <StepIcon status={step.status} />
            <span
              className={cn(
                "text-sm flex-1",
                step.status === "active" && "text-violet-300 font-medium",
                step.status === "done" && "text-base-400",
                step.status === "pending" && "text-base-500"
              )}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {step.label}
            </span>
            {step.duration && step.status === "done" && (
              <span className="text-xs text-base-500">{step.duration}s</span>
            )}
          </div>
        ))}
      </div>

      {isComplete && (
        <a href="/projects/p1">
          <Button size="lg" className="w-full" icon={<CheckCircle2 size={18} />}>
            View Your Shorts
          </Button>
        </a>
      )}
    </div>
  );
}
