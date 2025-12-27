import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Building2,
  Calendar,
  Pencil,
  Trash2,
  Download,
  Mail,
  Linkedin,
  CheckCircle2,
  MoreHorizontal,
  Search,
  X,
  Target,
  Sparkles,
  Clock,
} from "lucide-react";

import { PageContainer } from "@/components/layout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
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
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { getProspectList, getContacts } from "@/mock/api";
import type { ProspectList, Contact } from "@/types";
import { cn } from "@/lib/utils";

// Extended contact with list metadata
interface ListContact extends Contact {
  companyName: string;
  pocScore: number;
  addedAt: Date;
  contacted: boolean;
}

// Mock data generator for list contacts
const generateListContacts = (count: number): ListContact[] => {
  const companies = [
    "TechVenture Inc",
    "FinServe Global",
    "HealthFlow Systems",
    "DataSync Corp",
    "CloudNine Solutions",
  ];
  const departments = ["Engineering", "Sales", "Marketing", "Product", "IT", "Security"];
  const seniorities: Contact["seniority"][] = ["c-level", "vp", "director", "manager", "individual"];

  return Array.from({ length: count }, (_, i) => ({
    id: `contact_list_${i + 1}`,
    companyId: `company_${(i % 5) + 1}`,
    firstName: ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Drew", "Quinn"][i % 8],
    lastName: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"][i % 8],
    fullName: "",
    email: `contact${i + 1}@company.com`,
    emailStatus: (["verified", "unverified", "unknown"] as const)[i % 3],
    title: ["VP of Engineering", "Sales Director", "Marketing Lead", "Product Manager", "IT Manager", "Security Lead"][i % 6],
    seniority: seniorities[i % 5],
    department: departments[i % 6],
    linkedinUrl: `https://linkedin.com/in/contact${i + 1}`,
    lastUpdated: new Date(),
    companyName: companies[i % 5],
    pocScore: Math.floor(Math.random() * 40) + 60,
    addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    contacted: Math.random() > 0.7,
  })).map((c) => ({ ...c, fullName: `${c.firstName} ${c.lastName}` }));
};

export default function ListDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<ProspectList | null>(null);
  const [contacts, setContacts] = useState<ListContact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      const listData = await getProspectList(id);
      if (listData) {
        setList(listData);
        // Generate mock contacts based on contactCount
        setContacts(generateListContacts(listData.contactCount));
      }
      setIsLoading(false);
    };
    loadData();
  }, [id]);

  // Filter contacts
  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    const query = searchQuery.toLowerCase();
    return contacts.filter(
      (c) =>
        c.fullName.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.companyName.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  const toggleSelectContact = (id: string) => {
    setSelectedContacts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const handleRemoveSelected = () => {
    const count = selectedContacts.size;
    setContacts(contacts.filter((c) => !selectedContacts.has(c.id)));
    setSelectedContacts(new Set());
    toast.success(`Removed ${count} contact${count > 1 ? "s" : ""} from list`);
  };

  const handleMarkContacted = () => {
    const count = selectedContacts.size;
    setContacts(
      contacts.map((c) =>
        selectedContacts.has(c.id) ? { ...c, contacted: true } : c
      )
    );
    setSelectedContacts(new Set());
    toast.success(`Marked ${count} contact${count > 1 ? "s" : ""} as contacted`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-accent";
    if (score >= 50) return "text-warning";
    return "text-muted-foreground";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-success/10";
    if (score >= 70) return "bg-accent/10";
    if (score >= 50) return "bg-warning/10";
    return "bg-muted";
  };

  if (isLoading) return <PageSkeleton title />;

  if (!list) {
    return (
      <PageContainer>
        <EmptyState
          icon={Users}
          title="List not found"
          description="This list doesn't exist or has been deleted."
          action={
            <Button onClick={() => navigate("/lists")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Lists
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <TooltipProvider>
      <PageContainer>
        <Breadcrumbs
          items={[
            { label: "Lists", href: "/lists" },
            { label: list.name },
          ]}
        />

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                {list.name}
              </h1>
              <Badge variant={list.type === "dynamic" ? "accent" : "secondary"}>
                {list.type}
              </Badge>
            </div>
            {list.description && (
              <p className="text-muted-foreground mb-3">{list.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                <span>{list.companyCount} companies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{contacts.length} contacts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDate(list.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>Updated {formatDate(list.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => toast.info("Rename coming soon")}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rename list</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" disabled>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete disabled</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedContacts.size > 0 && (
          <Card className="mb-4 border-accent/50 bg-accent/5">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedContacts(new Set())}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <span className="text-sm font-medium">
                    {selectedContacts.size} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleMarkContacted}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Contacted
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2" disabled>
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export coming soon</TooltipContent>
                  </Tooltip>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={handleRemoveSelected}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Contacts Table */}
        {contacts.length > 0 ? (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedContacts.size === filteredContacts.length &&
                          filteredContacts.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>LinkedIn</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className={cn(
                        selectedContacts.has(contact.id) && "bg-accent/5"
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedContacts.has(contact.id)}
                          onCheckedChange={() => toggleSelectContact(contact.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={contact.avatarUrl} />
                            <AvatarFallback className="text-xs">
                              {contact.firstName[0]}
                              {contact.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{contact.fullName}</div>
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 capitalize"
                            >
                              {contact.seniority === "c-level"
                                ? "C-Level"
                                : contact.seniority}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/company/${contact.companyId}`}
                          className="text-accent hover:underline"
                        >
                          {contact.companyName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {contact.title}
                      </TableCell>
                      <TableCell>
                        {contact.email ? (
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span className="max-w-[140px] truncate">
                              {contact.email}
                            </span>
                          </a>
                        ) : (
                          <span className="text-muted-foreground/50 text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {contact.linkedinUrl ? (
                          <a
                            href={contact.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0077B5] hover:opacity-80"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground/50 text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-semibold",
                            getScoreBgColor(contact.pocScore),
                            getScoreColor(contact.pocScore)
                          )}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {contact.pocScore}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(contact.addedAt)}
                      </TableCell>
                      <TableCell>
                        {contact.contacted ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Contacted
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/company/${contact.companyId}`)
                              }
                            >
                              View Company
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setContacts(
                                  contacts.map((c) =>
                                    c.id === contact.id
                                      ? { ...c, contacted: !c.contacted }
                                      : c
                                  )
                                );
                              }}
                            >
                              Toggle Contacted
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setContacts(
                                  contacts.filter((c) => c.id !== contact.id)
                                );
                                toast.success("Contact removed from list");
                              }}
                            >
                              Remove from List
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <EmptyState
            icon={Users}
            title="No contacts in this list"
            description="Add contacts from company pages or search results."
            action={
              <Button onClick={() => navigate("/find")} className="gap-2">
                <Target className="h-4 w-4" />
                Find Prospects
              </Button>
            }
          />
        )}
      </PageContainer>
    </TooltipProvider>
  );
}
