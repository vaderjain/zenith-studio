import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  Building2,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Zap,
  UserPlus,
  Code,
  UserCog,
  ArrowRight,
  Info,
  X,
} from "lucide-react";

import { PageContainer } from "@/components/layout";
import { DashboardSkeleton } from "@/components/layout/PageSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

import { getCurrentUser } from "@/mock/user";
import { companies, signals } from "@/mock/data";

// Example search chips
const exampleSearches = [
  "Series A fintech in India hiring sales",
  "Enterprise SaaS in US with 500+ employees",
  "Healthcare startups using AWS",
  "B2B companies that raised funding in 2024",
];

// Filter options
const segmentOptions = [
  { value: "all", label: "All Companies" },
  { value: "startup", label: "Startups" },
  { value: "enterprise", label: "Enterprise" },
];

const geographyOptions = [
  { value: "all", label: "All Regions" },
  { value: "north-america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia Pacific" },
  { value: "latam", label: "Latin America" },
];

const industryOptions = [
  { value: "all", label: "All Industries" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Financial Services" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
];

const headcountOptions = [
  { value: "all", label: "Any Size" },
  { value: "1-50", label: "1-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-500", label: "201-500" },
  { value: "501-1000", label: "501-1000" },
  { value: "1000+", label: "1000+" },
];

const fundingOptions = [
  { value: "all", label: "Any Stage" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "series-b", label: "Series B" },
  { value: "series-c", label: "Series C+" },
  { value: "public", label: "Public" },
];

// Signal type icons
const signalIcons: Record<string, React.ElementType> = {
  funding: DollarSign,
  hiring: UserPlus,
  technology: Code,
  growth: TrendingUp,
  leadership: UserCog,
  news: Sparkles,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const user = getCurrentUser();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    segment: "all",
    geography: "all",
    industry: "all",
    headcount: "all",
    funding: "all",
  });
  const [relevanceBoost, setRelevanceBoost] = useState(user.preferences.relevanceBoost);
  const [showRelevanceInfo, setShowRelevanceInfo] = useState(false);

  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const cardsToShow = 3;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query?: string) => {
    const searchParams = new URLSearchParams();
    const q = query || searchQuery;
    if (q) searchParams.set("q", q);
    if (filters.segment !== "all") searchParams.set("segment", filters.segment);
    if (filters.geography !== "all") searchParams.set("geo", filters.geography);
    if (filters.industry !== "all") searchParams.set("industry", filters.industry);
    if (filters.headcount !== "all") searchParams.set("size", filters.headcount);
    if (filters.funding !== "all") searchParams.set("funding", filters.funding);
    if (relevanceBoost) searchParams.set("relevant", "true");

    navigate(`/find?${searchParams.toString()}`);
  };

  const handleExampleClick = (example: string) => {
    setSearchQuery(example);
    handleSearch(example);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <PageContainer>
      {/* Hero Search Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Find your next customers
          </h1>
          <p className="text-lg text-muted-foreground">
            Search companies in plain English and let AI do the rest
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <Input
              placeholder="Search companies in plain English…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-14 pl-12 pr-24 text-lg rounded-2xl border-2 border-border/50 focus-visible:border-accent focus-visible:ring-accent/20"
            />
            <Button
              onClick={() => handleSearch()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
              size="lg"
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Search</span>
            </Button>
          </div>
        </div>

        {/* Example Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <span className="text-sm text-muted-foreground mr-2">Try:</span>
          {exampleSearches.map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1.5 text-sm rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
            >
              {example}
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 justify-center mb-4">
            <Select
              value={filters.segment}
              onValueChange={(v) => setFilters({ ...filters, segment: v })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Segment" />
              </SelectTrigger>
              <SelectContent>
                {segmentOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.geography}
              onValueChange={(v) => setFilters({ ...filters, geography: v })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Geography" />
              </SelectTrigger>
              <SelectContent>
                {geographyOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.industry}
              onValueChange={(v) => setFilters({ ...filters, industry: v })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.headcount}
              onValueChange={(v) => setFilters({ ...filters, headcount: v })}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {headcountOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.funding}
              onValueChange={(v) => setFilters({ ...filters, funding: v })}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Funding" />
              </SelectTrigger>
              <SelectContent>
                {fundingOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Relevance Toggle */}
          <div className="flex justify-center">
            <div
              className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                relevanceBoost
                  ? "bg-accent/10 border border-accent/30"
                  : "bg-muted/50 border border-transparent"
              }`}
            >
              <Switch
                checked={relevanceBoost}
                onCheckedChange={(checked) => {
                  setRelevanceBoost(checked);
                  setShowRelevanceInfo(checked);
                }}
              />
              <span className="text-sm font-medium">
                Relevant to {user.companyName}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    When enabled, results are ranked by how likely they are to
                    need {user.companyName}'s solution based on their tech stack,
                    size, and industry signals.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Relevance Info Banner */}
          {showRelevanceInfo && (
            <div className="mt-4 flex items-center justify-center">
              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/5 border border-accent/20 text-sm animate-fade-in">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>
                  Results will be ranked by compatibility with {user.companyName}'s
                  ICP — companies using similar tech stacks and showing buying
                  signals get boosted.
                </span>
                <button
                  onClick={() => setShowRelevanceInfo(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Daily Report Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Daily Report</h2>
            <p className="text-sm text-muted-foreground">
              Your personalized prospect and signal digest
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Updated today at 9:00 AM
          </Badge>
        </div>

        {/* Possible Prospects Carousel */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Possible Prospects
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                disabled={carouselIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  setCarouselIndex(
                    Math.min(companies.length - cardsToShow, carouselIndex + 1)
                  )
                }
                disabled={carouselIndex >= companies.length - cardsToShow}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(-${carouselIndex * (100 / cardsToShow)}%)`,
              }}
            >
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex-none"
                  style={{ width: `calc(${100 / cardsToShow}% - 1rem)` }}
                >
                  <ProspectCard company={company} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signals List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Latest Signals
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/signals")}>
              View all
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-0 divide-y divide-border/50">
              {signals.map((signal) => (
                <SignalRow key={signal.id} signal={signal} />
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </PageContainer>
  );
}

// Prospect Card Component
function ProspectCard({ company }: { company: typeof companies[0] }) {
  const navigate = useNavigate();

  return (
    <Card
      className="h-full hover:shadow-lg hover:border-border transition-all cursor-pointer group"
      onClick={() => navigate(`/company/${company.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-7 w-7 rounded-lg object-cover"
              />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate group-hover:text-accent transition-colors">
              {company.name}
            </h4>
            <p className="text-sm text-muted-foreground truncate">
              {company.industry}
            </p>
          </div>
          <Badge
            variant={
              company.icpScore >= 90
                ? "success"
                : company.icpScore >= 80
                ? "accent"
                : "secondary"
            }
            className="flex-shrink-0"
          >
            {company.icpScore}%
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {company.headquarters.city}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {company.employeeRange}
          </span>
        </div>

        {company.signals.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {company.signals.slice(0, 2).map((signal) => (
              <Badge key={signal.id} variant="info" className="text-xs">
                {signal.type}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {company.funding?.lastRound || "—"}
          </span>
          <span className="text-accent flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            View details
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Signal Row Component
function SignalRow({ signal }: { signal: typeof signals[0] }) {
  const Icon = signalIcons[signal.type] || Zap;
  const navigate = useNavigate();

  // Get company name from mock data
  const company = companies.find((c) => c.id === signal.companyId);

  return (
    <div
      className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => navigate(`/company/${signal.companyId}`)}
    >
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          signal.type === "funding"
            ? "bg-success/10"
            : signal.type === "hiring"
            ? "bg-info/10"
            : signal.type === "technology"
            ? "bg-accent/10"
            : "bg-muted"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            signal.type === "funding"
              ? "text-success"
              : signal.type === "hiring"
              ? "text-info"
              : signal.type === "technology"
              ? "text-accent"
              : "text-muted-foreground"
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium">{company?.name || "Company"}</span>
          <Badge
            variant={
              signal.strength === "strong"
                ? "success"
                : signal.strength === "moderate"
                ? "warning"
                : "secondary"
            }
            className="text-xs"
          >
            {signal.type}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {signal.title}: {signal.description}
        </p>
      </div>

      <div className="flex-shrink-0 text-sm text-muted-foreground">
        {formatRelativeTime(signal.detectedAt)}
      </div>
    </div>
  );
}

// Helper to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
