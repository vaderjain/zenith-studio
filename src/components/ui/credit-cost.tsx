import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CreditCostProps {
  cost: number;
  description?: string;
  variant?: "badge" | "inline" | "compact";
  className?: string;
}

export function CreditCost({ 
  cost, 
  description, 
  variant = "badge",
  className 
}: CreditCostProps) {
  const content = (
    <div className={cn(
      "flex items-center gap-1",
      variant === "badge" && "px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium",
      variant === "inline" && "text-xs text-muted-foreground",
      variant === "compact" && "text-xs text-accent",
      className
    )}>
      <Zap className={cn(
        "flex-shrink-0",
        variant === "compact" ? "h-3 w-3" : "h-3.5 w-3.5"
      )} />
      <span>{cost} credit{cost !== 1 ? 's' : ''}</span>
    </div>
  );

  if (!description) {
    return content;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {content}
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px]">
        <p className="text-xs">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Credit costs for various actions (mock values)
export const CREDIT_COSTS = {
  runSearch: 25,
  enrichContact: 1,
  bulkEnrich: 0.5, // per contact
  findLeads: 15,
  exportList: 5,
  aiAnalysis: 10,
  signalAlert: 2,
} as const;
