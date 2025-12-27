import { useState, useEffect } from "react";
import { CreditCard, Zap, Check, ArrowRight } from "lucide-react";
import { PageContainer, PageHeader, AutoBreadcrumbs } from "@/components/layout";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { plans, creditLedger } from "@/mock/data";

export default function Billing() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { setTimeout(() => setIsLoading(false), 500); }, []);
  if (isLoading) return <PageSkeleton title cards={3} />;

  const currentPlan = plans[1];
  const creditsUsed = 158;

  return (
    <PageContainer>
      <AutoBreadcrumbs />
      <PageHeader title="Billing" description="Manage your subscription and credits" />
      
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Current Plan</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold">{currentPlan.displayName}</div>
                <div className="text-muted-foreground">${currentPlan.priceMonthly}/month</div>
              </div>
              <Badge variant="accent">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span>Credits used</span><span>{creditsUsed} / {currentPlan.monthlyCredits}</span></div>
              <Progress value={(creditsUsed / currentPlan.monthlyCredits) * 100} />
            </div>
          </CardContent>
          <CardFooter><Button variant="outline">Manage Subscription</Button></CardFooter>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-accent" />Credits</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">342</div>
            <div className="text-sm text-muted-foreground mb-4">Credits remaining</div>
            <Button className="w-full">Buy More Credits</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Usage History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {creditLedger.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{entry.description}</div>
                  <div className="text-sm text-muted-foreground">{entry.createdAt.toLocaleDateString()}</div>
                </div>
                <div className={entry.amount > 0 ? "text-success font-medium" : "text-muted-foreground"}>
                  {entry.amount > 0 ? "+" : ""}{entry.amount}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
