import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Building2,
  MapPin,
  Users,
  ChevronRight,
  Plus,
  Download,
  SlidersHorizontal,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingUp,
  Briefcase,
  DollarSign,
  ArrowUpDown,
  Loader2,
  FileSearch,
  Edit3,
  Rocket,
  Building,
  ArrowDownUp,
} from "lucide-react";

import {
  PageContainer,
  AutoBreadcrumbs,
} from "@/components/layout";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { ICPSummary } from "@/components/icp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { getCurrentUser } from "@/mock/user";
import { getICPData } from "@/mock/icp";
import { getSegmentedCompanies, type SegmentType, type GetCompaniesOptions } from "@/mock/companies";
import type { Company, Signal } from "@/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;
const MAX_COMPANIES = 500;

export default function FindProspects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [icpExpanded, setIcpExpanded] = useState(false);
  
  // State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [startupCount, setStartupCount] = useState(0);
  const [enterpriseCount, setEnterpriseCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  // Read from URL params
  const initialQuery = searchParams.get("q") || "";
  const initialRelevant = searchParams.get("relevant") === "true";
  const segmentParam = (searchParams.get("segment") || "both") as SegmentType;
  const industryParam = searchParams.get("industry") || "all";
  const sizeParam = searchParams.get("size") || "all";
  const sortParam = searchParams.get("sort") || "score";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [segment, setSegment] = useState<SegmentType>(segmentParam);
  const [industry, setIndustry] = useState(industryParam);
  const [sizeFilter, setSizeFilter] = useState(sizeParam);
  const [sortBy, setSortBy] = useState<"score" | "name" | "size" | "funding">(sortParam as "score");
  
  const user = getCurrentUser();
  const icpData = getICPData();

  // Load companies
  const loadCompanies = (reset = false) => {
    const currentPage = reset ? 1 : page;
    if (reset) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    // Simulate API delay
    setTimeout(() => {
      const result = getSegmentedCompanies({
        segment,
        page: currentPage,
        pageSize: PAGE_SIZE,
        maxTotal: MAX_COMPANIES,
        sortBy,
        industry,
        sizeFilter,
        searchQuery,
      });
      
      if (reset) {
        setCompanies(result.companies);
        setPage(1);
      } else {
        setCompanies(prev => [...prev, ...result.companies]);
      }
      
      setTotalResults(result.total);
      setStartupCount(result.startupCount);
      setEnterpriseCount(result.enterpriseCount);
      setHasMore(result.hasMore);
      setIsLoading(false);
      setIsLoadingMore(false);
    }, 500);
  };

  useEffect(() => {
    loadCompanies(true);
  }, [segment, industry, sizeFilter, sortBy, searchQuery]);

  const handleLoadMore = () => {
    if (!hasMore || isLoadingMore) return;
    setPage(prev => prev + 1);
    
    setTimeout(() => {
      const result = getSegmentedCompanies({
        segment,
        page: page + 1,
        pageSize: PAGE_SIZE,
        maxTotal: MAX_COMPANIES,
        sortBy,
        industry,
        sizeFilter,
        searchQuery,
      });
      
      setCompanies(prev => [...prev, ...result.companies]);
      setHasMore(result.hasMore);
      setIsLoadingMore(false);
    }, 500);
    
    setIsLoadingMore(true);
  };

  const handleSegmentChange = (newSegment: SegmentType) => {
    setSegment(newSegment);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("segment", newSegment);
    setSearchParams(newParams);
  };

  const handleAddToProspects = (company: Company) => {
    toast.success(`${company.name} added to My Prospects`, {
      action: {
        label: "View",
        onClick: () => navigate("/prospects"),
      },
    });
  };

  const creditCost = useMemo(() => {
    // Mock credit cost calculation
    return Math.ceil(totalResults * 0.1);
  }, [totalResults]);

  if (isLoading) {
    return <PageSkeleton title cards={0} table />;
  }

  return (
    <TooltipProvider>
      <PageContainer>
        <AutoBreadcrumbs />

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">
                Find Prospects
              </h1>
              <p className="text-muted-foreground">
                {initialQuery 
                  ? `Results for "${initialQuery}"`
                  : "Search and discover companies matching your ICP"
                }
              </p>
            </div>
            
            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {initialRelevant && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      ICP Active
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Ideal Customer Profile</DialogTitle>
                      <DialogDescription>
                        Your ICP is being used to rank and filter results.
                      </DialogDescription>
                    </DialogHeader>
                    <ICPSummary data={icpData} showActions />
                  </DialogContent>
                </Dialog>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2" disabled>
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export coming soon</p>
                </TooltipContent>
              </Tooltip>
              
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Search
                <Badge variant="secondary" className="ml-1 text-xs">
                  ~{creditCost} credits
                </Badge>
              </Button>
            </div>
          </div>
        </div>

        {/* AI Search Banner */}
        {initialQuery && (
          <div className="mb-6 p-4 rounded-2xl bg-accent/5 border border-accent/20">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">AI Search</span>
                  {initialRelevant && (
                    <Badge variant="accent" className="text-xs">
                      Relevant to {user.companyName}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Showing companies matching: <strong>"{initialQuery}"</strong>
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSearchParams({})}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ICP Summary - Collapsible */}
        {initialRelevant && (
          <Collapsible open={icpExpanded} onOpenChange={setIcpExpanded} className="mb-6">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-accent/5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <span className="font-medium text-sm">ICP Active</span>
                  <p className="text-xs text-muted-foreground">
                    Results ranked by your Ideal Customer Profile
                  </p>
                </div>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  {icpExpanded ? (
                    <>
                      Hide ICP
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      View ICP
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="pt-4">
              <ICPSummary data={icpData} compact showActions />
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Controls Row */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Segment Split Indicator */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 border border-border/50">
            <span className="text-sm font-medium">Segment Mix:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSegmentChange("startups")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
                  segment === "startups" 
                    ? "bg-accent text-accent-foreground shadow-sm" 
                    : "hover:bg-muted"
                )}
              >
                <Rocket className="h-4 w-4" />
                Startups
                {segment !== "enterprise" && (
                  <Badge variant="secondary" className="text-xs">
                    {segment === "startups" ? 500 : 250}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => handleSegmentChange("both")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
                  segment === "both" 
                    ? "bg-accent text-accent-foreground shadow-sm" 
                    : "hover:bg-muted"
                )}
              >
                <ArrowDownUp className="h-4 w-4" />
                Both
              </button>
              <button
                onClick={() => handleSegmentChange("enterprise")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
                  segment === "enterprise" 
                    ? "bg-accent text-accent-foreground shadow-sm" 
                    : "hover:bg-muted"
                )}
              >
                <Building className="h-4 w-4" />
                Enterprise
                {segment !== "startups" && (
                  <Badge variant="secondary" className="text-xs">
                    {segment === "enterprise" ? 500 : 250}
                  </Badge>
                )}
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="financial services">Financial Services</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-500">201-500</SelectItem>
                <SelectItem value="501-1000">501-1000</SelectItem>
                <SelectItem value="1000+">1000+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-full sm:w-36">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">ICP Score</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="funding">Funding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <strong>{companies.length}</strong> of <strong>{totalResults}</strong> companies
            </p>
            {segment === "both" && (
              <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Rocket className="h-3.5 w-3.5" />
                  {startupCount} startups
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5" />
                  {enterpriseCount} enterprise
                </span>
              </div>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            Max {MAX_COMPANIES} results
          </Badge>
        </div>

        {/* Company Grid */}
        {companies.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onAddToProspects={handleAddToProspects}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="gap-2 min-w-[200px]"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <Badge variant="secondary" className="ml-1">
                        {Math.min(PAGE_SIZE, totalResults - companies.length)} more
                      </Badge>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && companies.length > 0 && (
              <div className="text-center mt-8 py-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  You've reached the end • {companies.length} companies shown
                </p>
              </div>
            )}
          </>
        )}
      </PageContainer>
    </TooltipProvider>
  );
}

// Company Card Component
function CompanyCard({ 
  company, 
  onAddToProspects 
}: { 
  company: Company; 
  onAddToProspects: (company: Company) => void;
}) {
  const segmentBadge = company.type === "enterprise" || company.employeeCount >= 500 
    ? { label: "Enterprise", icon: Building, variant: "info" as const }
    : { label: "Startup", icon: Rocket, variant: "accent" as const };

  return (
    <Card className="group hover:shadow-lg hover:border-border transition-all duration-200 flex flex-col">
      <CardContent className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Logo */}
          <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link to={`/company/${company.id}`} className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate hover:text-accent transition-colors">
                  {company.name}
                </h3>
              </Link>
              <Badge
                variant={
                  company.icpScore >= 90
                    ? "success"
                    : company.icpScore >= 80
                    ? "accent"
                    : "secondary"
                }
                className="flex-shrink-0 text-xs"
              >
                {company.icpScore}%
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-xs py-0 h-5 gap-1">
                <segmentBadge.icon className="h-3 w-3" />
                {segmentBadge.label}
              </Badge>
              <span className="text-xs text-muted-foreground truncate">
                {company.industry}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
          {company.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {company.headquarters.city}, {company.headquarters.country}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {company.employeeRange}
          </span>
          {company.funding?.lastRound && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              {company.funding.lastRound}
            </span>
          )}
        </div>

        {/* Signals */}
        {company.signals.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {company.signals.slice(0, 3).map((signal) => (
              <SignalBadge key={signal.id} signal={signal} />
            ))}
            {company.signals.length > 3 && (
              <Badge variant="muted" className="text-xs">
                +{company.signals.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/50">
          <Link to={`/company/${company.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2">
              Open
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            size="sm" 
            className="flex-1 gap-2"
            onClick={() => onAddToProspects(company)}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Signal Badge Component
function SignalBadge({ signal }: { signal: Signal }) {
  const config = {
    hiring: { icon: Briefcase, variant: "info" as const },
    funding: { icon: DollarSign, variant: "success" as const },
    technology: { icon: Zap, variant: "accent" as const },
    growth: { icon: TrendingUp, variant: "success" as const },
    intent: { icon: Sparkles, variant: "warning" as const },
    news: { icon: TrendingUp, variant: "secondary" as const },
  };

  const { icon: Icon, variant } = config[signal.type] || config.news;

  return (
    <Badge variant={variant} className="text-xs gap-1 py-0.5">
      <Icon className="h-3 w-3" />
      {signal.title}
    </Badge>
  );
}

// Empty State Component
function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="h-20 w-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
        <FileSearch className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No companies found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {searchQuery
          ? `We couldn't find any companies matching "${searchQuery}". Try adjusting your search or filters.`
          : "No companies match your current filters. Try broadening your search criteria."
        }
      </p>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset Filters
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Search
        </Button>
      </div>
    </div>
  );
}
