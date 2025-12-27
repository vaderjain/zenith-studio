import { useState } from "react";
import { Eye, Plus, X, Building2, Zap, ExternalLink, MoreHorizontal, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader, AutoBreadcrumbs } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useWatchlist } from "@/hooks/useWatchlist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { companies } from "@/mock/data";
import { format, formatDistanceToNow } from "date-fns";

const signalTypeColors: Record<string, string> = {
  funding: "bg-success/10 text-success border-success/20",
  hiring: "bg-info/10 text-info border-info/20",
  technology: "bg-accent/10 text-accent border-accent/20",
  growth: "bg-warning/10 text-warning border-warning/20",
  intent: "bg-primary/10 text-primary border-primary/20",
  news: "bg-muted text-muted-foreground border-border",
};

export default function WatchlistPage() {
  const navigate = useNavigate();
  const { watchlist, count, maxSize, removeFromWatchlist, addToWatchlist, canAdd } = useWatchlist();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const availableCompanies = companies.filter(
    c => !watchlist.some(w => w.company.id === c.id)
  );

  const filteredAvailable = searchQuery
    ? availableCompanies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.domain.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableCompanies;

  const handleAddCompany = (companyId: string) => {
    const success = addToWatchlist(companyId);
    if (success) {
      setAddDialogOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <PageContainer>
      <AutoBreadcrumbs />
      <PageHeader 
        title="Watchlist" 
        description={`Monitor companies for buying signals (${count}/${maxSize})`}
        action={
          <Button onClick={() => setAddDialogOpen(true)} disabled={!canAdd}>
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        } 
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Companies Watched</div>
          <div className="text-2xl font-bold">{count}/{maxSize}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active Signals</div>
          <div className="text-2xl font-bold text-accent">
            {watchlist.reduce((acc, w) => acc + w.signals.length, 0)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Slots Available</div>
          <div className="text-2xl font-bold text-success">{maxSize - count}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg ICP Score</div>
          <div className="text-2xl font-bold">
            {watchlist.length > 0
              ? Math.round(watchlist.reduce((acc, w) => acc + w.company.icpScore, 0) / watchlist.length)
              : 0}%
          </div>
        </Card>
      </div>

      {watchlist.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
            .map((item) => (
            <Card key={item.company.id} className="group hover:shadow-lg transition-all overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.company.logoUrl ? (
                      <img
                        src={item.company.logoUrl}
                        alt={item.company.name}
                        className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <CardTitle 
                        className="text-base cursor-pointer hover:text-accent transition-colors truncate"
                        onClick={() => navigate(`/company/${item.company.id}`)}
                      >
                        {item.company.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.company.industry} · {item.company.employeeRange}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/company/${item.company.id}`)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Company
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => removeFromWatchlist(item.company.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove from Watchlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                {/* ICP Score */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ICP Score</span>
                  <Badge variant={item.company.icpScore >= 80 ? "default" : "secondary"}>
                    {item.company.icpScore}%
                  </Badge>
                </div>

                {/* Recent Signals */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Zap className="h-3.5 w-3.5" />
                    Recent Signals
                  </div>
                  <div className="space-y-1.5">
                    {item.signals.slice(0, 3).map((signal) => (
                      <div
                        key={signal.id}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs border",
                          signalTypeColors[signal.type] || signalTypeColors.news
                        )}
                      >
                        <span className="font-medium truncate">{signal.title}</span>
                        <span className="text-[10px] opacity-70 ml-2 flex-shrink-0">
                          {formatDistanceToNow(signal.detectedAt, { addSuffix: true })}
                        </span>
                      </div>
                    ))}
                    {item.signals.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">No recent signals</p>
                    )}
                  </div>
                </div>

                {/* Why It Matters */}
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Why it matters: </span>
                    {item.whyItMatters}
                  </p>
                </div>

                {/* Added Date */}
                <div className="text-xs text-muted-foreground pt-1">
                  Added {format(item.addedAt, "MMM d, yyyy")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Eye} 
          title="No companies in watchlist" 
          description="Add up to 10 companies to monitor for buying signals and activity."
          action={
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Company
            </Button>
          }
        />
      )}

      {/* Add Company Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Watchlist</DialogTitle>
            <DialogDescription>
              Select a company to monitor. You have {maxSize - count} slot{maxSize - count !== 1 ? 's' : ''} remaining.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search companies</Label>
              <Input
                id="search"
                placeholder="Search by name or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredAvailable.length > 0 ? (
                filteredAvailable.slice(0, 10).map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => handleAddCompany(company.id)}
                  >
                    <div className="flex items-center gap-3">
                      {company.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{company.name}</p>
                        <p className="text-xs text-muted-foreground">{company.industry}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {searchQuery ? "No companies found" : "All companies are already in your watchlist"}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
