import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("p-6 lg:p-8 max-w-7xl mx-auto w-full", className)}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

export function PageHeader({
  title,
  description,
  action,
  badge,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface PageSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function PageSection({
  title,
  description,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={cn("mb-8", className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
