import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  const radii = { sm: "rounded", md: "rounded-lg", lg: "rounded-xl", full: "rounded-full" };
  return (
    <div
      className={cn(
        "shimmer",
        radii[rounded],
        className
      )}
    />
  );
}

export function ShortCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-[9/16]" rounded="lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <Skeleton className="w-full h-40 mb-3" rounded="lg" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
