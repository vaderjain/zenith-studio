import { useState, useEffect } from "react";
import { Zap, Building2, Filter } from "lucide-react";
import { PageContainer, PageHeader, AutoBreadcrumbs } from "@/components/layout";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { signals as mockSignals } from "@/mock/data";
import type { Signal } from "@/types";

export default function Signals() {
  const [isLoading, setIsLoading] = useState(true);
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    setTimeout(() => { setSignals(mockSignals); setIsLoading(false); }, 500);
  }, []);

  if (isLoading) return <PageSkeleton title table />;

  return (
    <PageContainer>
      <AutoBreadcrumbs />
      <PageHeader title="Signals" description="Real-time buying signals from your tracked companies" badge={<Badge variant="accent">{signals.length} active</Badge>} action={<Button variant="outline"><Filter className="h-4 w-4" />Filter</Button>} />
      {signals.length > 0 ? (
        <div className="space-y-4">
          {signals.map((signal) => (
            <Card key={signal.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center"><Building2 className="h-5 w-5 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={signal.strength === "strong" ? "success" : signal.strength === "moderate" ? "warning" : "secondary"}>{signal.type}</Badge>
                      <span className="text-sm text-muted-foreground">{signal.detectedAt.toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-medium">{signal.title}</h4>
                    <p className="text-sm text-muted-foreground">{signal.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={Zap} title="No signals yet" description="Signals will appear when tracked companies show buying intent." />
      )}
    </PageContainer>
  );
}
