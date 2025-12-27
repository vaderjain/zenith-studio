import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1 text-sm mb-4", className)}
    >
      <Link
        to="/"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          {item.href && index < items.length - 1 ? (
            <Link
              to={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}

// Auto-generate breadcrumbs from route
const routeLabels: Record<string, string> = {
  find: "Find Prospects",
  prospects: "My Prospects",
  lists: "Lists",
  watchlist: "Watchlist",
  signals: "Signals",
  workspace: "Workspace",
  billing: "Billing",
  settings: "Settings",
  company: "Company",
  onboarding: "Onboarding",
  "ui-kit": "UI Kit",
};

export function AutoBreadcrumbs({ customItems }: { customItems?: BreadcrumbItem[] }) {
  const location = useLocation();
  
  if (customItems) {
    return <Breadcrumbs items={customItems} />;
  }

  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  if (pathSegments.length === 0) {
    return null;
  }

  const items: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;
    
    // Check if it's an ID (for dynamic routes like /company/:id)
    const isId = /^[a-z0-9_-]+$/i.test(segment) && !routeLabels[segment];
    
    return {
      label: routeLabels[segment] || (isId ? segment : segment.charAt(0).toUpperCase() + segment.slice(1)),
      href: isLast ? undefined : href,
    };
  });

  return <Breadcrumbs items={items} />;
}
