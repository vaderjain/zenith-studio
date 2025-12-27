import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Linkedin,
  Twitter,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Plus,
  Mail,
  Phone,
  Zap,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";

import {
  PageContainer,
  PageHeader,
  PageSection,
  AutoBreadcrumbs,
  Breadcrumbs,
} from "@/components/layout";
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

import { getCompany, getContacts, getSignals } from "@/mock/api";
import type { Company, Contact, Signal } from "@/types";

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isSaved, setIsSaved] = useState(false);

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

  if (isLoading || !company) {
    return <PageSkeleton title cards={3} />;
  }

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Find Prospects", href: "/find" },
          { label: company.name },
        ]}
      />

      {/* Company Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-12 w-12 rounded-xl object-cover"
              />
            ) : (
              <Building2 className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl lg:text-3xl font-bold">{company.name}</h1>
              <Badge
                variant={
                  company.icpScore >= 90
                    ? "success"
                    : company.icpScore >= 80
                    ? "accent"
                    : "secondary"
                }
              >
                {company.icpScore}% ICP match
              </Badge>
            </div>
            <p className="text-muted-foreground mb-3">
              {company.description || company.industry}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {company.headquarters.city}, {company.headquarters.country}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {company.employeeCount.toLocaleString()} employees
              </div>
              <a
                href={`https://${company.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Globe className="h-4 w-4" />
                {company.domain}
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isSaved ? "secondary" : "outline"}
            onClick={() => setIsSaved(!isSaved)}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Add to List
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Type</div>
                <div className="font-semibold capitalize">{company.type}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-info" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Funding</div>
                <div className="font-semibold">
                  {company.funding?.totalRaised
                    ? `$${(company.funding.totalRaised / 1000000).toFixed(0)}M`
                    : "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Founded</div>
                <div className="font-semibold">
                  {company.foundedYear || "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Signals</div>
                <div className="font-semibold">{signals.length} active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">
            Contacts ({contacts.length})
          </TabsTrigger>
          <TabsTrigger value="signals">Signals ({signals.length})</TabsTrigger>
          <TabsTrigger value="tech">Technology</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">{company.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sub-Industry</span>
                  <span className="font-medium">
                    {company.subIndustry || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee Range</span>
                  <span className="font-medium">{company.employeeRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-medium">
                    {company.revenueRange || "—"}
                  </span>
                </div>
                {company.funding?.lastRound && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Round</span>
                    <span className="font-medium">
                      {company.funding.lastRound}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.socialLinks?.linkedin && (
                  <a
                    href={company.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-[#0077B5]" />
                    <span>LinkedIn</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                  </a>
                )}
                {company.socialLinks?.twitter && (
                  <a
                    href={company.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                    <span>Twitter</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                  </a>
                )}
                <a
                  href={`https://${company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <span>{company.domain}</span>
                  <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                </a>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={contact.avatarUrl} />
                        <AvatarFallback>
                          {contact.firstName[0]}
                          {contact.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{contact.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {contact.title}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{contact.seniority}</Badge>
                      {contact.email && (
                        <Button variant="ghost" size="icon-sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      {contact.linkedinUrl && (
                        <a
                          href={contact.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="icon-sm">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {signals.length > 0 ? (
                  signals.map((signal) => (
                    <div key={signal.id} className="p-4">
                      <div className="flex items-start justify-between">
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
                            >
                              {signal.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {signal.detectedAt.toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-medium">{signal.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {signal.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No signals detected for this company
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tech">
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
              <CardDescription>
                Technologies used by {company.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {company.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
