import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Zap, 
  Check, 
  ArrowRight, 
  Crown,
  Sparkles,
  Users,
  Search,
  Shield,
  BarChart3,
  Clock,
  Download,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { PageContainer, PageHeader, AutoBreadcrumbs } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { plans, creditLedger, workspaces } from "@/mock/data";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";

// Extended credit ledger for demo
const extendedLedger = [
  ...creditLedger,
  {
    id: 'ledger_5',
    workspaceId: 'ws_1',
    type: 'debit' as const,
    amount: -15,
    balance: 327,
    description: 'Bulk contact enrichment (15 contacts)',
    createdAt: subDays(new Date(), 2),
  },
  {
    id: 'ledger_6',
    workspaceId: 'ws_1',
    type: 'debit' as const,
    amount: -25,
    balance: 302,
    description: 'Search run: Healthcare SaaS',
    createdAt: subDays(new Date(), 3),
  },
  {
    id: 'ledger_7',
    workspaceId: 'ws_1',
    type: 'credit' as const,
    amount: 40,
    balance: 342,
    description: 'Referral bonus',
    createdAt: subDays(new Date(), 1),
  },
];

const planFeatures: Record<string, { icon: React.ElementType; included: boolean }[]> = {
  starter: [
    { icon: Search, included: true },
    { icon: Users, included: true },
    { icon: Download, included: true },
    { icon: BarChart3, included: false },
    { icon: Shield, included: false },
    { icon: Sparkles, included: false },
  ],
  pro: [
    { icon: Search, included: true },
    { icon: Users, included: true },
    { icon: Download, included: true },
    { icon: BarChart3, included: true },
    { icon: Shield, included: true },
    { icon: Sparkles, included: false },
  ],
  enterprise: [
    { icon: Search, included: true },
    { icon: Users, included: true },
    { icon: Download, included: true },
    { icon: BarChart3, included: true },
    { icon: Shield, included: true },
    { icon: Sparkles, included: true },
  ],
};

function BillingSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
        <div className="grid lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-32" />
                <div className="space-y-2">
                  {[...Array(6)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

export default function Billing() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <BillingSkeleton />;

  const workspace = workspaces[0];
  const currentPlan = plans[1]; // Pro plan
  const creditsUsed = currentPlan.monthlyCredits - workspace.creditBalance;
  const usagePercent = (creditsUsed / currentPlan.monthlyCredits) * 100;

  // Mock usage data for chart placeholder
  const weeklyUsage = [45, 32, 58, 41, 67, 52, 38];
  const maxUsage = Math.max(...weeklyUsage);

  return (
    <PageContainer>
      <AutoBreadcrumbs />
      <PageHeader 
        title="Billing" 
        description="Manage your subscription and credits"
      />

      {/* Current Plan Overview */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Credits Card */}
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-accent via-primary to-info" />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <span className="font-medium">Credit Balance</span>
              </div>
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                {currentPlan.displayName}
              </Badge>
            </div>

            <div className="text-4xl font-bold mb-1">{workspace.creditBalance}</div>
            <p className="text-sm text-muted-foreground mb-6">
              of {currentPlan.monthlyCredits} monthly credits
            </p>

            <Progress value={100 - usagePercent} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{creditsUsed} used</span>
              <span>{workspace.creditBalance} remaining</span>
            </div>

            <Separator className="my-6" />

            <Button className="w-full gap-2">
              <Zap className="h-4 w-4" />
              Buy More Credits
            </Button>
          </CardContent>
        </Card>

        {/* Usage Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Usage This Week</CardTitle>
                <CardDescription>Credit consumption over the last 7 days</CardDescription>
              </div>
              <Badge variant="outline" className="gap-1">
                <TrendingDown className="h-3 w-3 text-success" />
                12% less than last week
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Simple bar chart placeholder */}
            <div className="flex items-end justify-between gap-2 h-32 mb-4">
              {weeklyUsage.map((usage, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className={cn(
                          "w-full rounded-t-md transition-all cursor-pointer hover:opacity-80",
                          i === weeklyUsage.length - 1 
                            ? "bg-accent" 
                            : "bg-muted-foreground/20"
                        )}
                        style={{ height: `${(usage / maxUsage) * 100}%` }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{usage} credits</p>
                    <p className="text-xs text-muted-foreground">
                      {format(subDays(new Date(), 6 - i), "EEE, MMM d")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <span key={day} className="flex-1 text-center">{day}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan.id;
            const isEnterprise = plan.name === 'enterprise';

            return (
              <Card 
                key={plan.id} 
                className={cn(
                  "relative overflow-hidden transition-all",
                  isCurrentPlan && "ring-2 ring-accent shadow-lg",
                  !isCurrentPlan && "hover:shadow-md"
                )}
              >
                {isCurrentPlan && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-bl-lg">
                    Current Plan
                  </div>
                )}
                {isEnterprise && !isCurrentPlan && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-medium rounded-bl-lg">
                    Best Value
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {isEnterprise ? (
                      <Crown className="h-5 w-5 text-accent" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-muted-foreground" />
                    )}
                    <CardTitle className="text-xl">{plan.displayName}</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${plan.priceMonthly}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.monthlyCredits.toLocaleString()} credits/month
                  </p>
                </CardHeader>

                <CardContent className="pb-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Team members</span>
                    <span className="font-medium">
                      {plan.maxMembers === -1 ? 'Unlimited' : `Up to ${plan.maxMembers}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Search runs</span>
                    <span className="font-medium">
                      {plan.maxSearchRuns === -1 ? 'Unlimited' : `${plan.maxSearchRuns}/month`}
                    </span>
                  </div>
                </CardContent>

                <CardFooter>
                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : isEnterprise ? (
                    <Button className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      Contact Sales
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full gap-2">
                      {plan.priceMonthly < currentPlan.priceMonthly ? 'Downgrade' : 'Upgrade'}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Credit Ledger */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Credit History</CardTitle>
            <CardDescription>Recent credit transactions and usage</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extendedLedger
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        entry.type === 'credit' 
                          ? "bg-success/10" 
                          : entry.type === 'debit' 
                            ? "bg-muted" 
                            : "bg-info/10"
                      )}>
                        {entry.type === 'credit' ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : entry.type === 'debit' ? (
                          <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Minus className="h-4 w-4 text-info" />
                        )}
                      </div>
                      <span className="font-medium">{entry.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(entry.createdAt, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-medium",
                    entry.amount > 0 ? "text-success" : "text-muted-foreground"
                  )}>
                    {entry.amount > 0 ? '+' : ''}{entry.amount}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {entry.balance}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Credit Cost Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Credit Costs
          </CardTitle>
          <CardDescription>How credits are consumed across different actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { action: 'Run Search', cost: 25, description: 'Per search query execution' },
              { action: 'Enrich Contact', cost: 1, description: 'Per contact enriched with email/phone' },
              { action: 'Bulk Find Leads', cost: 15, description: 'Find ideal PoC for multiple companies' },
              { action: 'Export List', cost: 5, description: 'Export contacts to CSV' },
              { action: 'AI Analysis', cost: 10, description: 'AI-powered company insights' },
              { action: 'Signal Alert', cost: 2, description: 'Per alert notification sent' },
            ].map((item) => (
              <div 
                key={item.action}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
              >
                <div>
                  <p className="font-medium text-sm">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 gap-1">
                  <Zap className="h-3 w-3" />
                  {item.cost}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
