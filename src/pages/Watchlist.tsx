import { useState, useEffect } from "react";
import { Eye, Plus, Building2 } from "lucide-react";
import { PageContainer, PageHeader, AutoBreadcrumbs } from "@/components/layout";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getWatchlists } from "@/mock/api";
import type { Watchlist } from "@/types";

export default function WatchlistPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getWatchlists("ws_1");
      setWatchlists(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) return <PageSkeleton title cards={3} />;

  return (
    <PageContainer>
      <AutoBreadcrumbs />
      <PageHeader title="Watchlist" description="Monitor companies for buying signals" action={<Button><Plus className="h-4 w-4" />New Watchlist</Button>} />
      {watchlists.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlists.map((wl) => (
            <Card key={wl.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg">{wl.name}</CardTitle>
                <CardDescription>{wl.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3"><Building2 className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{wl.companies.length} companies</span></div>
                <div className="flex flex-wrap gap-1">{wl.alertSettings.signalTypes.map((t) => (<Badge key={t} variant="outline" className="text-xs">{t}</Badge>))}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={Eye} title="No watchlists yet" description="Create watchlists to track companies for signals." action={<Button><Plus className="h-4 w-4" />Create Watchlist</Button>} />
      )}
    </PageContainer>
  );
}
