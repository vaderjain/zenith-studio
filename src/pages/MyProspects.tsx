import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  ExternalLink,
  Users,
  Zap,
  Target,
  Sparkles,
  LayoutGrid,
  List,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Rocket,
  Building,
  MapPin,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Activity,
} from "lucide-react";

import { PageContainer } from "@/components/layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { getSavedCompanies } from "@/mock/api";
import type { SavedCompany, Signal } from "@/types";
import { cn } from "@/lib/utils";

const stageColors: Record<string, "default" | "secondary" | "success" | "warning" | "info" | "accent" | "destructive"> = {
  new: "secondary",
  researching: "info",
  qualified: "accent",
  outreach: "warning",
  meeting: "success",
  won: "success",
  lost: "destructive",
};

// Mock signals for companies
const mockSignals: Record<string, Signal> = {
  company_1: {
    id: "sig_1",
    companyId: "company_1",
    type: "funding",
    title: "Series B Funding",
    description: "Raised $45M in Series B",
    strength: "strong",
    source: "Crunchbase",
    detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  company_3: {
    id: "sig_2",
    companyId: "company_3",
    type: "hiring",
    title: "Hiring VP Engineering",
    description: "Posted VP Engineering role",
    strength: "moderate",
    source: "LinkedIn",
    detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
};

// Activity log items
interface ActivityItem {
  id: string;
  type: "added" | "removed" | "stage_change" | "poc_found" | "list_created";
  message: string;
  timestamp: Date;
}

const mockActivities: ActivityItem[] = [
  {
    id: "act_1",
    type: "added",
    message: "Added TechVenture Inc to prospects",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "act_2",
    type: "stage_change",
    message: "Moved HealthFlow Systems to Researching",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "act_3",
    type: "poc_found",
    message: "Found 12 ideal PoCs for Q2 Outreach list",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "act_4",
    type: "list_created",
    message: "Created list 'Enterprise Targets'",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

export default function MyProspects() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [savedCompanies, setSavedCompanies] = useState<SavedCompany[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  
  // Find PoC modal state
  const [findPocDialogOpen, setFindPocDialogOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStep, setProcessStep] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const result = await getSavedCompanies("ws_1");
      setSavedCompanies(result.data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredCompanies = useMemo(() => {
    let filtered = savedCompanies;
    
    if (searchQuery) {
      filtered = filtered.filter((saved) =>
        saved.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        saved.company.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (stageFilter !== "all") {
      filtered = filtered.filter((saved) => saved.stage === stageFilter);
    }
    
    return filtered;
  }, [savedCompanies, searchQuery, stageFilter]);

  const toggleSelectCompany = (id: string) => {
    setSelectedCompanies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCompanies.size === filteredCompanies.length) {
      setSelectedCompanies(new Set());
    } else {
      setSelectedCompanies(new Set(filteredCompanies.map((c) => c.id)));
    }
  };

  const handleRemoveSelected = () => {
    const count = selectedCompanies.size;
    setSavedCompanies(savedCompanies.filter((c) => !selectedCompanies.has(c.id)));
    setSelectedCompanies(new Set());
    toast.success(`Removed ${count} company${count > 1 ? "ies" : ""}`);
  };

  const creditCost = selectedCompanies.size * 3;

  const handleFindIdealPoC = async () => {
    if (!listName.trim()) return;
    
    setIsProcessing(true);
    setProcessProgress(0);
    
    const steps = [
      "Analyzing company profiles...",
      "Identifying decision makers...",
      "Scoring PoC candidates...",
      "Ranking by relevance...",
      "Creating contact list...",
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setProcessStep(steps[i]);
      setProcessProgress((i + 1) * 20);
      await new Promise((r) => setTimeout(r, 800));
    }
    
    setProcessProgress(100);
    setProcessStep("Complete!");
    
    await new Promise((r) => setTimeout(r, 500));
    
    setIsProcessing(false);
    setFindPocDialogOpen(false);
    setListName("");
    setSelectedCompanies(new Set());
    
    toast.success(`Created list "${listName}" with ${selectedCompanies.size * 3} ideal contacts`);
    navigate("/lists");
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getSignalIcon = (type: Signal["type"]) => {
    const icons = {
      funding: DollarSign,
      hiring: Users,
      technology: Zap,
      growth: TrendingUp,
      intent: Sparkles,
      news: AlertCircle,
    };
    return icons[type] || AlertCircle;
  };

  const getActivityIcon = (type: ActivityItem["type"]) => {
    const icons = {
      added: Plus,
      removed: Trash2,
      stage_change: TrendingUp,
      poc_found: Target,
      list_created: List,
    };
    return icons[type] || Activity;
  };

  if (isLoading) return <PageSkeleton title table />;

  return (
    <TooltipProvider>
      <PageContainer>
        <Breadcrumbs items={[{ label: "My Prospects" }]} />

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                My Prospects
              </h1>
              <Badge variant="secondary">{savedCompanies.length} saved</Badge>
            </div>
            <p className="text-muted-foreground">
              Companies you've saved for follow-up and outreach
            </p>
          </div>

          {/* Primary Bulk Action */}
          {selectedCompanies.size > 0 && (
            <Button
              onClick={() => setFindPocDialogOpen(true)}
              className="gap-2"
            >
              <Target className="h-4 w-4" />
              Find Ideal PoC & Save as List
              <Badge variant="secondary" className="ml-1 bg-primary-foreground/20">
                <Sparkles className="h-3 w-3 mr-1" />
                {creditCost} credits
              </Badge>
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {savedCompanies.length > 0 ? (
              <>
                {/* Toolbar */}
                <Card>
                  <CardContent className="py-3">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex flex-col sm:flex-row gap-3 flex-1">
                        <div className="relative flex-1 max-w-md">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Select value={stageFilter} onValueChange={setStageFilter}>
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Stages</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="researching">Researching</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="outreach">Outreach</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* View Toggle */}
                        <div className="flex items-center border border-border rounded-lg p-1">
                          <Button
                            variant={viewMode === "cards" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setViewMode("cards")}
                          >
                            <LayoutGrid className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={viewMode === "table" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setViewMode("table")}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Selection Toolbar */}
                {selectedCompanies.size > 0 && (
                  <Card className="border-accent/50 bg-accent/5">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedCompanies.size === filteredCompanies.length}
                            onCheckedChange={toggleSelectAll}
                          />
                          <span className="text-sm font-medium">
                            {selectedCompanies.size} selected
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleRemoveSelected}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Cards View */}
                {viewMode === "cards" && (
                  <div className="space-y-3">
                    {filteredCompanies.map((saved) => {
                      const signal = mockSignals[saved.companyId];
                      const SignalIcon = signal ? getSignalIcon(signal.type) : null;
                      const isEnterprise = saved.company.type === "enterprise" || (saved.company.employeeCount || 0) >= 500;

                      return (
                        <Card
                          key={saved.id}
                          className={cn(
                            "hover:shadow-md transition-all group",
                            selectedCompanies.has(saved.id) && "border-accent/50 bg-accent/5"
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              {/* Checkbox */}
                              <Checkbox
                                checked={selectedCompanies.has(saved.id)}
                                onCheckedChange={() => toggleSelectCompany(saved.id)}
                                className="mt-1"
                              />

                              {/* Logo */}
                              <div className="h-12 w-12 rounded-xl bg-muted border border-border/50 flex items-center justify-center flex-shrink-0">
                                {saved.company.logoUrl ? (
                                  <img
                                    src={saved.company.logoUrl}
                                    alt={saved.company.name}
                                    className="h-8 w-8 rounded-lg object-cover"
                                  />
                                ) : (
                                  <Building2 className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Link to={`/company/${saved.companyId}`}>
                                        <h3 className="font-semibold hover:text-accent transition-colors">
                                          {saved.company.name}
                                        </h3>
                                      </Link>
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-xs",
                                          isEnterprise ? "border-info/50 text-info" : "border-accent/50 text-accent"
                                        )}
                                      >
                                        {isEnterprise ? (
                                          <><Building className="h-3 w-3 mr-1" />Enterprise</>
                                        ) : (
                                          <><Rocket className="h-3 w-3 mr-1" />Startup</>
                                        )}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <span>{saved.company.industry}</span>
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {saved.company.headquarters.city}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {saved.company.employeeRange}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Badges */}
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge variant={stageColors[saved.stage]} className="capitalize">
                                      {saved.stage}
                                    </Badge>
                                    <Badge
                                      variant={
                                        saved.company.icpScore >= 90
                                          ? "success"
                                          : saved.company.icpScore >= 80
                                          ? "accent"
                                          : "secondary"
                                      }
                                    >
                                      {saved.company.icpScore}% match
                                    </Badge>
                                  </div>
                                </div>

                                {/* Signal */}
                                {signal && SignalIcon && (
                                  <div className="flex items-center gap-2 mt-2 text-sm">
                                    <Badge variant="outline" className="gap-1">
                                      <SignalIcon className="h-3 w-3" />
                                      {signal.title}
                                    </Badge>
                                    <span className="text-muted-foreground text-xs">
                                      {formatRelativeTime(signal.detectedAt)}
                                    </span>
                                  </div>
                                )}

                                {saved.notes && (
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                                    {saved.notes}
                                  </p>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => navigate(`/company/${saved.companyId}`)}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View company</TooltipContent>
                                </Tooltip>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon-sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => toast.info("Edit notes coming soon")}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit notes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate(`/company/${saved.companyId}`)}>
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View company
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => {
                                        setSavedCompanies(savedCompanies.filter((c) => c.id !== saved.id));
                                        toast.success("Company removed");
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Table View */}
                {viewMode === "table" && (
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedCompanies.size === filteredCompanies.length}
                              onCheckedChange={toggleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Segment</TableHead>
                          <TableHead>Industry</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Last Signal</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCompanies.map((saved) => {
                          const signal = mockSignals[saved.companyId];
                          const isEnterprise = saved.company.type === "enterprise" || (saved.company.employeeCount || 0) >= 500;

                          return (
                            <TableRow
                              key={saved.id}
                              className={cn(selectedCompanies.has(saved.id) && "bg-accent/5")}
                            >
                              <TableCell>
                                <Checkbox
                                  checked={selectedCompanies.has(saved.id)}
                                  onCheckedChange={() => toggleSelectCompany(saved.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <Link
                                  to={`/company/${saved.companyId}`}
                                  className="font-medium hover:text-accent"
                                >
                                  {saved.company.name}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    isEnterprise ? "border-info/50 text-info" : "border-accent/50 text-accent"
                                  )}
                                >
                                  {isEnterprise ? "Enterprise" : "Startup"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {saved.company.industry}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {saved.company.employeeRange}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    saved.company.icpScore >= 90
                                      ? "success"
                                      : saved.company.icpScore >= 80
                                      ? "accent"
                                      : "secondary"
                                  }
                                >
                                  {saved.company.icpScore}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {signal ? (
                                  <span className="text-sm text-muted-foreground">
                                    {signal.title}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground/50">—</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={stageColors[saved.stage]} className="capitalize">
                                  {saved.stage}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon-sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate(`/company/${saved.companyId}`)}>
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Card>
                )}
              </>
            ) : (
              <EmptyState
                icon={Building2}
                title="No saved prospects yet"
                description="Start exploring companies and save the ones that match your ICP to track them here."
                action={
                  <Link to="/find">
                    <Button className="gap-2">
                      <Search className="h-4 w-4" />
                      Find Prospects
                    </Button>
                  </Link>
                }
              />
            )}
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Prospects</span>
                  <span className="font-semibold">{savedCompanies.length}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">In Outreach</span>
                  <span className="font-semibold">
                    {savedCompanies.filter((c) => c.stage === "outreach").length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. ICP Score</span>
                  <span className="font-semibold">
                    {savedCompanies.length > 0
                      ? Math.round(
                          savedCompanies.reduce((sum, c) => sum + c.company.icpScore, 0) /
                            savedCompanies.length
                        )
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Find Ideal PoC Dialog */}
        <Dialog open={findPocDialogOpen} onOpenChange={setFindPocDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Find Ideal Point of Contact
              </DialogTitle>
              <DialogDescription>
                We'll analyze {selectedCompanies.size} companies and find the best contacts to reach out to.
              </DialogDescription>
            </DialogHeader>

            {!isProcessing ? (
              <>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="listName">Save contacts to list *</Label>
                    <Input
                      id="listName"
                      placeholder="e.g., Q1 Outreach Contacts"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                    />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Companies to analyze</span>
                      <span className="font-medium">{selectedCompanies.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated contacts</span>
                      <span className="font-medium">{selectedCompanies.size * 3}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" />
                        Credit cost
                      </span>
                      <Badge variant="secondary" className="text-sm">
                        {creditCost} credits
                      </Badge>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setFindPocDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleFindIdealPoC} disabled={!listName.trim()}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Find Contacts
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="py-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto animate-pulse">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-semibold">Finding Ideal Contacts...</h3>
                  <p className="text-sm text-muted-foreground">{processStep}</p>
                </div>

                <div className="space-y-2">
                  <Progress value={processProgress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    {processProgress}% complete
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageContainer>
    </TooltipProvider>
  );
}
