import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text" | "card";
}

function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  const variants = {
    default: "rounded-lg",
    circular: "rounded-full",
    text: "rounded-md h-4 w-3/4",
    card: "rounded-2xl h-48",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-soft">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-1/3" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
        <Skeleton variant="text" className="w-4/6" />
      </div>
    </div>
  );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 bg-muted/50 p-4 border-b border-border/50">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 flex-1" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-border/50 last:border-0">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonTable };
