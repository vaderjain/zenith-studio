import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Linkedin,
  Twitter,
  ExternalLink,
  Plus,
  Mail,
  Zap,
  TrendingUp,
  Calendar,
  DollarSign,
  Search,
  Binoculars,
  Rocket,
  Building,
  Briefcase,
  Clock,
  ChevronRight,
  Network,
  FileText,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { PageContainer, Breadcrumbs } from "@/components/layout";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { getCompany, getContacts, getSignals } from "@/mock/api";
import type { Company, Contact, Signal } from "@/types";
import { cn } from "@/lib/utils";

// Mock watchlist count
const WATCHLIST_COUNT = 8;
const WATCHLIST_LIMIT = 10;

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isProspect, setIsProspect] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      const [companyData, contactsData, signalsData] = await Promise.all([
        getCompany(id),
        getContacts(id),
        getSignals(id),
      ]);
      setCompany(companyData);
      setContacts(contactsData.data);
      setSignals(signalsData);
      setIsLoading(false);
    };
    loadData();
  }, [id]);

  const isEnterprise = company?.type === "enterprise" || (company?.employeeCount || 0) >= 500;
  const watchlistFull = WATCHLIST_COUNT >= WATCHLIST_LIMIT && !isWatching;

  const handleSearchProspects = () => {
    navigate(`/find?company=${company?.id}&relevant=true`);
    toast.success("Searching for similar prospects...");
  };

  const handleAddToProspects = () => {
    setIsProspect(true);
    toast.success(`${company?.name} added to My Prospects`);
  };

  const handleToggleWatchlist = () => {
    if (watchlistFull) return;
    setIsWatching(!isWatching);
    toast.success(isWatching ? "Removed from watchlist" : "Added to watchlist");
  };

  if (isLoading || !company) {
    return <PageSkeleton title cards={3} />;
  }

  return (
    <TooltipProvider>
      <PageContainer>
        <Breadcrumbs
          items={[
            { label: "Find Prospects", href: "/find" },
            { label: company.name },
          ]}
        />

        {/* Premium Header Section */}
        <div className="relative mb-8">
          {/* Background Gradient */}
          <div className="absolute inset-0 -top-6 -mx-6 lg:-mx-8 h-48 bg-gradient-to-br from-accent/5 via-background to-info/5 rounded-b-3xl" />
          
          <div className="relative pt-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              {/* Company Identity */}
              <div className="flex items-start gap-5">
                {/* Logo */}
                <div className="h-20 w-20 rounded-2xl bg-card border border-border/50 shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                
                <div>
                  {/* Name & Badges */}
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                      {company.name}
                    </h1>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1.5 py-1",
                        isEnterprise 
                          ? "border-info/50 text-info" 
                          : "border-accent/50 text-accent"
                      )}
                    >
                      {isEnterprise ? (
                        <>
                          <Building className="h-3.5 w-3.5" />
                          Enterprise
                        </>
                      ) : (
                        <>
                          <Rocket className="h-3.5 w-3.5" />
                          Startup
                        </>
                      )}
                    </Badge>
                    <Badge
                      variant={
                        company.icpScore >= 90
                          ? "success"
                          : company.icpScore >= 80
                          ? "accent"
                          : "secondary"
                      }
                    >
                      {company.icpScore}% match
                    </Badge>
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground mb-4 max-w-xl">
                    {company.description || `Leading ${company.industry.toLowerCase()} company`}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{company.industry}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{company.headquarters.city}, {company.headquarters.country}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{company.employeeCount.toLocaleString()} employees</span>
                    </div>
                    {company.funding?.lastRound && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>{company.funding.lastRound}</span>
                      </div>
                    )}
                    <a
                      href={`https://${company.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-accent hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      <span>{company.domain}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
                {/* Watchlist Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isWatching ? "secondary" : "outline"}
                      size="icon"
                      onClick={handleToggleWatchlist}
                      disabled={watchlistFull}
                      className={cn(
                        "h-10 w-10",
                        isWatching && "bg-accent/10 border-accent/50"
                      )}
                    >
                      <Binoculars className={cn(
                        "h-5 w-5",
                        isWatching && "text-accent"
                      )} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {watchlistFull ? (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-warning" />
                        <span>Watchlist full (10/10)</span>
                      </div>
                    ) : isWatching ? (
                      "Remove from watchlist"
                    ) : (
                      "Add to watchlist"
                    )}
                  </TooltipContent>
                </Tooltip>

                {/* Add to Prospects */}
                <Button
                  variant={isProspect ? "secondary" : "outline"}
                  onClick={handleAddToProspects}
                  disabled={isProspect}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {isProspect ? "Added" : "Add to My Prospects"}
                </Button>

                {/* Primary CTA */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSearchProspects}
                      className="gap-2"
                    >
                      <Search className="h-4 w-4" />
                      Search Prospects
                      <Badge variant="secondary" className="ml-1 text-xs bg-primary-foreground/20">
                        <Sparkles className="h-3 w-3 mr-1" />
                        5 credits
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Find companies similar to {company.name}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={TrendingUp}
            label="Company Type"
            value={company.type}
            iconColor="text-accent"
            bgColor="bg-accent/10"
          />
          <StatCard
            icon={DollarSign}
            label="Total Funding"
            value={company.funding?.totalRaised
              ? `$${(company.funding.totalRaised / 1000000).toFixed(0)}M`
              : "N/A"
            }
            iconColor="text-info"
            bgColor="bg-info/10"
          />
          <StatCard
            icon={Calendar}
            label="Founded"
            value={company.foundedYear?.toString() || "N/A"}
            iconColor="text-success"
            bgColor="bg-success/10"
          />
          <StatCard
            icon={Zap}
            label="Active Signals"
            value={`${signals.length} detected`}
            iconColor="text-warning"
            bgColor="bg-warning/10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="gap-2">
              <FileText className="h-4 w-4" />
              Overview
            </TabsTrigger>
            {!isEnterprise && (
              <TabsTrigger value="team" className="gap-2">
                <Users className="h-4 w-4" />
                Team
              </TabsTrigger>
            )}
            {isEnterprise && (
              <TabsTrigger value="contacts" className="gap-2">
                <Users className="h-4 w-4" />
                Contacts ({contacts.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="signals" className="gap-2">
              <Zap className="h-4 w-4" />
              Signals ({signals.length})
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About {company.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {company.description || `${company.name} is a ${company.type} company in the ${company.industry} industry, headquartered in ${company.headquarters.city}, ${company.headquarters.country}. The company has approximately ${company.employeeCount.toLocaleString()} employees.`}
                    </p>
                  </CardContent>
                </Card>

                {/* Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <HighlightItem
                        icon={Briefcase}
                        label="Industry"
                        value={company.industry}
                        subValue={company.subIndustry}
                      />
                      <HighlightItem
                        icon={Users}
                        label="Employees"
                        value={company.employeeRange}
                        subValue={`${company.employeeCount.toLocaleString()} total`}
                      />
                      <HighlightItem
                        icon={DollarSign}
                        label="Revenue"
                        value={company.revenueRange || "Not disclosed"}
                      />
                      <HighlightItem
                        icon={TrendingUp}
                        label="Last Round"
                        value={company.funding?.lastRound || "N/A"}
                        subValue={company.funding?.lastRoundDate 
                          ? new Date(company.funding.lastRoundDate).toLocaleDateString()
                          : undefined
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Technology Stack */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Technology Stack</CardTitle>
                    <CardDescription>
                      Technologies detected at {company.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {company.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="px-3 py-1.5">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Signals */}
                {signals.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-4 w-4 text-warning" />
                        Recent Signals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {signals.slice(0, 3).map((signal) => (
                        <SignalItem key={signal.id} signal={signal} />
                      ))}
                      {signals.length > 3 && (
                        <Button variant="ghost" className="w-full gap-2">
                          View all {signals.length} signals
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Social Links */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {company.socialLinks?.linkedin && (
                      <SocialLink
                        icon={Linkedin}
                        label="LinkedIn"
                        href={company.socialLinks.linkedin}
                        iconColor="text-[#0077B5]"
                      />
                    )}
                    {company.socialLinks?.twitter && (
                      <SocialLink
                        icon={Twitter}
                        label="Twitter"
                        href={company.socialLinks.twitter}
                        iconColor="text-[#1DA1F2]"
                      />
                    )}
                    <SocialLink
                      icon={Globe}
                      label={company.domain}
                      href={`https://${company.domain}`}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Team Tab (Startup) */}
          <TabsContent value="team">
            <TeamTab contacts={contacts} company={company} />
          </TabsContent>

          {/* Contacts Tab (Enterprise) */}
          <TabsContent value="contacts">
            <ContactsTab contacts={contacts} />
          </TabsContent>

          {/* Signals Tab */}
          <TabsContent value="signals">
            <SignalsTab signals={signals} />
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <NotesTab notes={notes} setNotes={setNotes} companyName={company.name} />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </TooltipProvider>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
  bgColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", bgColor)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
            <div className="font-semibold capitalize">{value}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Highlight Item
function HighlightItem({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="font-medium">{value}</div>
        {subValue && <div className="text-xs text-muted-foreground">{subValue}</div>}
      </div>
    </div>
  );
}

// Signal Item
function SignalItem({ signal }: { signal: Signal }) {
  const signalConfig = {
    hiring: { icon: Users, color: "text-info" },
    funding: { icon: DollarSign, color: "text-success" },
    technology: { icon: Zap, color: "text-accent" },
    growth: { icon: TrendingUp, color: "text-success" },
    intent: { icon: Sparkles, color: "text-warning" },
    news: { icon: FileText, color: "text-muted-foreground" },
  };
  
  const config = signalConfig[signal.type] || signalConfig.news;
  const Icon = config.icon;
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
      <Icon className={cn("h-4 w-4 mt-0.5", config.color)} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{signal.title}</div>
        <div className="text-xs text-muted-foreground">
          {new Date(signal.detectedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

// Social Link
function SocialLink({
  icon: Icon,
  label,
  href,
  iconColor = "text-muted-foreground",
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  iconColor?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
    >
      <Icon className={cn("h-5 w-5", iconColor)} />
      <span className="flex-1 text-sm truncate">{label}</span>
      <ExternalLink className="h-4 w-4 text-muted-foreground" />
    </a>
  );
}

// Team Tab (for Startups)
function TeamTab({ contacts, company }: { contacts: Contact[]; company: Company }) {
  // Group by seniority for tree view
  const executives = contacts.filter(c => c.seniority === "c-level" || c.seniority === "vp");
  const managers = contacts.filter(c => c.seniority === "director" || c.seniority === "manager");
  const others = contacts.filter(c => c.seniority === "individual");

  return (
    <div className="space-y-6">
      {/* Team Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-muted-foreground" />
            Organization Structure
          </CardTitle>
          <CardDescription>
            Key team members at {company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Executives */}
            {executives.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  Leadership
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {executives.map(contact => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Managers */}
            {managers.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  Management
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {managers.map(contact => (
                    <ContactCard key={contact.id} contact={contact} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Full Team List */}
      <Card>
        <CardHeader>
          <CardTitle>All Team Members ({contacts.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {contacts.map(contact => (
              <ContactRow key={contact.id} contact={contact} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Contacts Tab (for Enterprise)
function ContactsTab({ contacts }: { contacts: Contact[] }) {
  // Group by department for org chart feel
  const byDepartment = contacts.reduce((acc, contact) => {
    const dept = contact.department || "Other";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(contact);
    return acc;
  }, {} as Record<string, Contact[]>);

  return (
    <div className="space-y-6">
      {/* Org Chart Style */}
      <div className="grid lg:grid-cols-2 gap-6">
        {Object.entries(byDepartment).map(([dept, deptContacts]) => (
          <Card key={dept}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                {dept}
                <Badge variant="secondary">{deptContacts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {deptContacts.map(contact => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Contact Card
function ContactCard({ contact, compact = false }: { contact: Contact; compact?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors",
      compact && "p-2"
    )}>
      <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
        <AvatarImage src={contact.avatarUrl} />
        <AvatarFallback className="text-xs">
          {contact.firstName[0]}{contact.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className={cn("font-medium truncate", compact && "text-sm")}>
          {contact.fullName}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {contact.title}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {contact.email && (
          <Button variant="ghost" size="icon-sm">
            <Mail className="h-4 w-4" />
          </Button>
        )}
        {contact.linkedinUrl && (
          <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon-sm">
              <Linkedin className="h-4 w-4" />
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}

// Contact Row
function ContactRow({ contact }: { contact: Contact }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={contact.avatarUrl} />
          <AvatarFallback>
            {contact.firstName[0]}{contact.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{contact.fullName}</div>
          <div className="text-sm text-muted-foreground">{contact.title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="capitalize">{contact.seniority}</Badge>
        <Badge variant="secondary">{contact.department}</Badge>
        {contact.email && (
          <Button variant="ghost" size="icon-sm">
            <Mail className="h-4 w-4" />
          </Button>
        )}
        {contact.linkedinUrl && (
          <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon-sm">
              <Linkedin className="h-4 w-4" />
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}

// Signals Tab
function SignalsTab({ signals }: { signals: Signal[] }) {
  if (signals.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Zap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No signals detected</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We haven't detected any signals for this company yet. Check back later for updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signal Timeline</CardTitle>
        <CardDescription>
          Recent activity and buying signals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {signals.map((signal, index) => (
              <div key={signal.id} className="relative flex gap-4">
                {/* Timeline Dot */}
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 z-10",
                  signal.strength === "strong" 
                    ? "bg-success/10" 
                    : signal.strength === "moderate"
                    ? "bg-warning/10"
                    : "bg-muted"
                )}>
                  <SignalIcon type={signal.type} strength={signal.strength} />
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            signal.strength === "strong"
                              ? "success"
                              : signal.strength === "moderate"
                              ? "warning"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {signal.type}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {signal.strength}
                        </Badge>
                      </div>
                      <h4 className="font-medium">{signal.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {signal.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(signal.detectedAt).toLocaleDateString()}
                        </span>
                        <span>Source: {signal.source}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SignalIcon({ type, strength }: { type: Signal["type"]; strength: Signal["strength"] }) {
  const icons = {
    hiring: Briefcase,
    funding: DollarSign,
    technology: Zap,
    growth: TrendingUp,
    intent: Sparkles,
    news: FileText,
  };
  
  const Icon = icons[type] || FileText;
  
  return (
    <Icon className={cn(
      "h-5 w-5",
      strength === "strong" 
        ? "text-success" 
        : strength === "moderate"
        ? "text-warning"
        : "text-muted-foreground"
    )} />
  );
}

// Notes Tab
function NotesTab({ 
  notes, 
  setNotes, 
  companyName 
}: { 
  notes: string; 
  setNotes: (notes: string) => void;
  companyName: string;
}) {
  const handleSave = () => {
    toast.success("Notes saved");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>
          Private notes about {companyName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Add your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={8}
          className="resize-none"
        />
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <FileText className="h-4 w-4" />
            Save Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
