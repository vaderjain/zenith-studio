import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  Building2, 
  Filter, 
  DollarSign, 
  Users, 
  Cpu, 
  TrendingUp, 
  Target, 
  Newspaper,
  ChevronDown,
  ExternalLink,
  X,
  Eye,
  Bookmark
} from "lucide-react";
import { PageContainer, PageHeader, AutoBreadcrumbs } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companies } from "@/mock/data";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday, isThisWeek, isThisMonth, subDays } from "date-fns";
import type { Signal, Company } from "@/types";

// Generate more comprehensive mock signals
const generateMockSignals = (): (Signal & { company: Company })[] => {
  const signalTypes: Signal['type'][] = ['funding', 'hiring', 'technology', 'growth', 'intent', 'news'];
  const strengths: Signal['strength'][] = ['weak', 'moderate', 'strong'];
  
  const signalData: Record<Signal['type'], { titles: string[], descriptions: string[] }> = {
    funding: {
      titles: ['Series B Funding Announced', 'Raised Capital', 'Funding Round Closed', 'Investment Secured'],
      descriptions: ['Company raised significant funding from top-tier investors.', 'New capital injection to fuel growth.', 'Funding round closed with strategic investors.'],
    },
    hiring: {
      titles: ['Hiring Surge Detected', 'VP Engineering Posted', 'Sales Team Expansion', 'Executive Hire'],
      descriptions: ['Multiple engineering positions posted.', 'Leadership expansion indicates growth phase.', 'Sales team growing rapidly.'],
    },
    technology: {
      titles: ['Tech Stack Change', 'Cloud Migration', 'New Integration Added', 'Platform Upgrade'],
      descriptions: ['Migrating to modern cloud infrastructure.', 'Added new technology to their stack.', 'Upgrading core platform systems.'],
    },
    growth: {
      titles: ['Revenue Milestone', 'Customer Expansion', 'New Market Entry', 'Partnership Announced'],
      descriptions: ['Reached significant revenue milestone.', 'Expanded customer base significantly.', 'Entering new geographic markets.'],
    },
    intent: {
      titles: ['Website Traffic Spike', 'Demo Requests Up', 'Content Engagement', 'Pricing Page Visits'],
      descriptions: ['Significant increase in website activity.', 'Multiple demo requests this week.', 'High engagement with product content.'],
    },
    news: {
      titles: ['Press Coverage', 'Industry Recognition', 'Award Winner', 'Conference Speaker'],
      descriptions: ['Featured in major publication.', 'Recognized as industry leader.', 'Won prestigious industry award.'],
    },
  };

  const signals: (Signal & { company: Company })[] = [];

  companies.forEach((company) => {
    const numSignals = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < numSignals; i++) {
      const type = signalTypes[Math.floor(Math.random() * signalTypes.length)];
      const data = signalData[type];
      const daysAgo = Math.floor(Math.random() * 30);
      
      signals.push({
        id: `signal_${company.id}_${i}`,
        companyId: company.id,
        company,
        type,
        title: data.titles[Math.floor(Math.random() * data.titles.length)],
        description: data.descriptions[Math.floor(Math.random() * data.descriptions.length)],
        strength: strengths[Math.floor(Math.random() * strengths.length)],
        source: ['LinkedIn', 'TechCrunch', 'Press Release', 'Company Blog', 'Crunchbase'][Math.floor(Math.random() * 5)],
        detectedAt: subDays(new Date(), daysAgo),
      });
    }
  });

  return signals.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
};

const signalTypeIcons: Record<Signal['type'], React.ElementType> = {
  funding: DollarSign,
  hiring: Users,
  technology: Cpu,
  growth: TrendingUp,
  intent: Target,
  news: Newspaper,
};

const signalTypeColors: Record<Signal['type'], string> = {
  funding: "bg-success/10 text-success border-success/20",
  hiring: "bg-info/10 text-info border-info/20",
  technology: "bg-accent/10 text-accent border-accent/20",
  growth: "bg-warning/10 text-warning border-warning/20",
  intent: "bg-primary/10 text-primary border-primary/20",
  news: "bg-muted text-muted-foreground border-border",
};

const strengthColors: Record<Signal['strength'], string> = {
  strong: "bg-success/10 text-success",
  moderate: "bg-warning/10 text-warning",
  weak: "bg-muted text-muted-foreground",
};

const companySegments = ['startup', 'scaleup', 'enterprise', 'agency', 'other'] as const;

function SignalSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, groupIdx) => (
        <div key={groupIdx} className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            {[...Array(3)].map((_, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupSignalsByDate(signals: (Signal & { company: Company })[]) {
  const groups: { label: string; signals: (Signal & { company: Company })[] }[] = [];
  
  const today: (Signal & { company: Company })[] = [];
  const yesterday: (Signal & { company: Company })[] = [];
  const thisWeek: (Signal & { company: Company })[] = [];
  const thisMonth: (Signal & { company: Company })[] = [];
  const older: (Signal & { company: Company })[] = [];

  signals.forEach(signal => {
    if (isToday(signal.detectedAt)) {
      today.push(signal);
    } else if (isYesterday(signal.detectedAt)) {
      yesterday.push(signal);
    } else if (isThisWeek(signal.detectedAt)) {
      thisWeek.push(signal);
    } else if (isThisMonth(signal.detectedAt)) {
      thisMonth.push(signal);
    } else {
      older.push(signal);
    }
  });

  if (today.length > 0) groups.push({ label: 'Today', signals: today });
  if (yesterday.length > 0) groups.push({ label: 'Yesterday', signals: yesterday });
  if (thisWeek.length > 0) groups.push({ label: 'This Week', signals: thisWeek });
  if (thisMonth.length > 0) groups.push({ label: 'This Month', signals: thisMonth });
  if (older.length > 0) groups.push({ label: 'Older', signals: older });

  return groups;
}

export default function Signals() {
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();
  const [isLoading, setIsLoading] = useState(true);
  const [allSignals, setAllSignals] = useState<(Signal & { company: Company })[]>([]);
  
  // Filters
  const [selectedTypes, setSelectedTypes] = useState<Signal['type'][]>([]);
  const [selectedSegments, setSelectedSegments] = useState<Company['type'][]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [watchlistOnly, setWatchlistOnly] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllSignals(generateMockSignals());
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredSignals = useMemo(() => {
    let filtered = [...allSignals];

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(s => selectedTypes.includes(s.type));
    }

    if (selectedSegments.length > 0) {
      filtered = filtered.filter(s => selectedSegments.includes(s.company.type));
    }

    if (watchlistOnly) {
      const watchlistCompanyIds = watchlist.map(w => w.company.id);
      filtered = filtered.filter(s => watchlistCompanyIds.includes(s.companyId));
    }

    // For saved-only, we'd need a saved companies context - using a mock filter for now
    if (savedOnly) {
      filtered = filtered.slice(0, Math.ceil(filtered.length / 2));
    }

    return filtered;
  }, [allSignals, selectedTypes, selectedSegments, savedOnly, watchlistOnly, watchlist]);

  const groupedSignals = useMemo(() => groupSignalsByDate(filteredSignals), [filteredSignals]);

  const activeFilterCount = 
    selectedTypes.length + 
    selectedSegments.length + 
    (savedOnly ? 1 : 0) + 
    (watchlistOnly ? 1 : 0);

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedSegments([]);
    setSavedOnly(false);
    setWatchlistOnly(false);
  };

  const toggleType = (type: Signal['type']) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSegment = (segment: Company['type']) => {
    setSelectedSegments(prev => 
      prev.includes(segment) ? prev.filter(s => s !== segment) : [...prev, segment]
    );
  };

  return (
    <PageContainer>
      <AutoBreadcrumbs />
      <PageHeader 
        title="Signals" 
        description="Real-time buying signals from your tracked companies" 
        badge={<Badge variant="accent">{filteredSignals.length} active</Badge>}
      />

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Signal Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Zap className="h-4 w-4" />
              Signal Type
              {selectedTypes.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {selectedTypes.length}
                </Badge>
              )}
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Signal Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(['funding', 'hiring', 'technology', 'growth', 'intent', 'news'] as Signal['type'][]).map(type => {
              const Icon = signalTypeIcons[type];
              return (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Segment Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Building2 className="h-4 w-4" />
              Segment
              {selectedSegments.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {selectedSegments.length}
                </Badge>
              )}
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuLabel>Company Segment</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {companySegments.map(segment => (
              <DropdownMenuCheckboxItem
                key={segment}
                checked={selectedSegments.includes(segment)}
                onCheckedChange={() => toggleSegment(segment)}
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Filters */}
        <div className="flex items-center gap-4 ml-2">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="saved-only" 
              checked={savedOnly} 
              onCheckedChange={(checked) => setSavedOnly(checked === true)}
            />
            <Label htmlFor="saved-only" className="text-sm cursor-pointer flex items-center gap-1.5">
              <Bookmark className="h-3.5 w-3.5" />
              Saved only
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="watchlist-only" 
              checked={watchlistOnly} 
              onCheckedChange={(checked) => setWatchlistOnly(checked === true)}
            />
            <Label htmlFor="watchlist-only" className="text-sm cursor-pointer flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              Watchlist only
            </Label>
          </div>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-muted-foreground">
            <X className="h-3.5 w-3.5" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <SignalSkeleton />
      ) : filteredSignals.length > 0 ? (
        <div className="space-y-8">
          {groupedSignals.map((group) => (
            <div key={group.label} className="space-y-3">
              {/* Date Group Header */}
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium text-muted-foreground">{group.label}</h3>
                <div className="flex-1 h-px bg-border" />
                <Badge variant="outline" className="text-xs">
                  {group.signals.length} signal{group.signals.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Signals Timeline */}
              <div className="relative pl-6 space-y-3">
                {/* Timeline line */}
                <div className="absolute left-[11px] top-4 bottom-4 w-px bg-border" />

                {group.signals.map((signal) => {
                  const TypeIcon = signalTypeIcons[signal.type];
                  return (
                    <div key={signal.id} className="relative">
                      {/* Timeline dot */}
                      <div className={cn(
                        "absolute -left-6 top-4 h-[22px] w-[22px] rounded-full border-2 border-background flex items-center justify-center",
                        signalTypeColors[signal.type]
                      )}>
                        <TypeIcon className="h-3 w-3" />
                      </div>

                      <Card 
                        className="hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => navigate(`/company/${signal.companyId}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Company Logo */}
                            {signal.company.logoUrl ? (
                              <img
                                src={signal.company.logoUrl}
                                alt={signal.company.name}
                                className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              {/* Header Row */}
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-medium text-sm group-hover:text-accent transition-colors">
                                  {signal.company.name}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {signal.company.type}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs capitalize border", signalTypeColors[signal.type])}
                                >
                                  {signal.type}
                                </Badge>
                                <Badge className={cn("text-xs capitalize", strengthColors[signal.strength])}>
                                  {signal.strength}
                                </Badge>
                              </div>

                              {/* Signal Title */}
                              <h4 className="font-medium mb-1">{signal.title}</h4>
                              
                              {/* Description */}
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {signal.description}
                              </p>

                              {/* Footer */}
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span>{format(signal.detectedAt, "MMM d, h:mm a")}</span>
                                <span>·</span>
                                <span>{signal.source}</span>
                                <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Zap} 
          title="No signals yet" 
          description={activeFilterCount > 0 
            ? "No signals match your current filters. Try adjusting your criteria."
            : "Signals will appear when tracked companies show buying intent."
          }
          action={activeFilterCount > 0 ? (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          ) : undefined}
        />
      )}
    </PageContainer>
  );
}
