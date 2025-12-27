import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-8",
        "rounded-2xl border-2 border-dashed border-border/50 bg-muted/20",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-2xl bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

interface EmptyStateCompactProps {
  icon?: LucideIcon;
  message: string;
  className?: string;
}

export function EmptyStateCompact({
  icon: Icon,
  message,
  className,
}: EmptyStateCompactProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 py-8 text-muted-foreground",
        className
      )}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span className="text-sm">{message}</span>
    </div>
  );
}
