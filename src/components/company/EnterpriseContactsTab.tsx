import { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  NodeProps,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Search,
  Linkedin,
  Mail,
  Info,
  Plus,
  Target,
  User,
  Filter,
  Sparkles,
  Check,
  List,
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckSquare,
  MapPin,
  Building2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import type { Contact, Company } from "@/types";
import { cn } from "@/lib/utils";

// Enterprise-specific scoring
interface EnterpriseScore {
  relevanceScore: number;
  pocLikelihood: number;
  reasoning: string;
}

const enterpriseFunctions = ["IT", "Security", "Data", "RevOps", "Engineering", "Product", "Finance", "Operations"];

const generateEnterpriseScore = (contact: Contact): EnterpriseScore => {
  const functionScores: Record<string, number> = {
    IT: 85,
    Security: 90,
    Data: 88,
    RevOps: 82,
    Engineering: 75,
    Product: 78,
    Finance: 60,
    Operations: 55,
    Sales: 70,
    Marketing: 65,
    "Human Resources": 40,
  };

  const seniorityMultiplier: Record<string, number> = {
    "c-level": 1.1,
    vp: 1.05,
    director: 1.0,
    manager: 0.9,
    individual: 0.75,
  };

  const baseRelevance = functionScores[contact.department] || 50;
  const multiplier = seniorityMultiplier[contact.seniority] || 0.8;
  const relevanceScore = Math.min(100, Math.round(baseRelevance * multiplier + Math.random() * 10 - 5));
  
  // PoC likelihood based on seniority and function alignment
  const seniorityPoc: Record<string, number> = {
    "c-level": 95,
    vp: 88,
    director: 80,
    manager: 65,
    individual: 45,
  };
  const pocLikelihood = Math.min(100, (seniorityPoc[contact.seniority] || 50) + Math.floor(Math.random() * 10) - 5);

  const reasoningTemplates = [
    `${contact.fullName} leads ${contact.department} initiatives and has decision-making authority for enterprise solutions. Their ${contact.seniority} position gives them direct influence over vendor selection.`,
    `As a ${contact.title}, ${contact.firstName} oversees key technology decisions in ${contact.department}. Their seniority and function alignment make them a strategic contact.`,
    `${contact.fullName}'s role in ${contact.department} positions them as a key stakeholder for solutions in your category. They likely have budget influence and evaluation authority.`,
  ];

  return {
    relevanceScore,
    pocLikelihood,
    reasoning: reasoningTemplates[Math.floor(Math.random() * reasoningTemplates.length)],
  };
};

interface EnrichedContact extends Contact {
  scores: EnterpriseScore;
  region: string;
  [key: string]: unknown;
}

// Mock regions
const regions = ["North America", "EMEA", "APAC", "LATAM"];

const enrichContact = (contact: Contact): EnrichedContact => ({
  ...contact,
  scores: generateEnterpriseScore(contact),
  region: regions[Math.floor(Math.random() * regions.length)],
});

// Mock lists
const mockLists = [
  { id: "list_1", name: "Hot Leads Q1", count: 24 },
  { id: "list_2", name: "Enterprise Targets", count: 156 },
  { id: "list_3", name: "IT Decision Makers", count: 89 },
];

interface EnterpriseContactsTabProps {
  contacts: Contact[];
  company: Company;
}

export function EnterpriseContactsTab({ contacts, company }: EnterpriseContactsTabProps) {
  const [activeView, setActiveView] = useState<"list" | "orgchart">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [functionFilter, setFunctionFilter] = useState<string>("all");
  const [seniorityFilter, setSeniorityFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [addToListDialog, setAddToListDialog] = useState<EnrichedContact | null>(null);
  const [bulkAddDialog, setBulkAddDialog] = useState(false);
  const [selectedList, setSelectedList] = useState<string>("");
  const [newListName, setNewListName] = useState("");
  const [isCreatingList, setIsCreatingList] = useState(false);

  // Enrich contacts
  const enrichedContacts: EnrichedContact[] = useMemo(() => {
    return contacts.map(enrichContact);
  }, [contacts]);

  // Get unique values for filters
  const departments = useMemo(() => {
    const depts = new Set(contacts.map((c) => c.department));
    return Array.from(depts).sort();
  }, [contacts]);

  const seniorities = ["c-level", "vp", "director", "manager", "individual"];

  // Filter and sort
  const filteredContacts = useMemo(() => {
    let filtered = [...enrichedContacts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.fullName.toLowerCase().includes(query) ||
          c.title.toLowerCase().includes(query) ||
          c.department.toLowerCase().includes(query)
      );
    }

    if (functionFilter !== "all") {
      filtered = filtered.filter((c) => c.department === functionFilter);
    }

    if (seniorityFilter !== "all") {
      filtered = filtered.filter((c) => c.seniority === seniorityFilter);
    }

    if (regionFilter !== "all") {
      filtered = filtered.filter((c) => c.region === regionFilter);
    }

    // Sort by relevance score descending
    return filtered.sort((a, b) => b.scores.relevanceScore - a.scores.relevanceScore);
  }, [enrichedContacts, searchQuery, functionFilter, seniorityFilter, regionFilter]);

  const toggleSelectContact = (id: string) => {
    setSelectedContacts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
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

  const handleAddToList = (isBulk = false) => {
    const count = isBulk ? selectedContacts.size : 1;
    if (isCreatingList && newListName) {
      toast.success(`Created list "${newListName}" and added ${count} contact${count > 1 ? "s" : ""}`);
    } else if (selectedList) {
      const list = mockLists.find((l) => l.id === selectedList);
      toast.success(`Added ${count} contact${count > 1 ? "s" : ""} to "${list?.name}"`);
    }
    setAddToListDialog(null);
    setBulkAddDialog(false);
    setSelectedList("");
    setNewListName("");
    setIsCreatingList(false);
    if (isBulk) setSelectedContacts(new Set());
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

  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <User className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No contacts found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We haven't discovered any contacts for {company.name} yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* View Toggle Tabs */}
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "list" | "orgchart")}>
          <TabsList>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Contact List
            </TabsTrigger>
            <TabsTrigger value="orgchart" className="gap-2">
              <Network className="h-4 w-4" />
              Org Chart
            </TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list" className="space-y-6 mt-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, title, or function..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={functionFilter} onValueChange={setFunctionFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Building2 className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Function" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Functions</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Seniority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        {seniorities.map((sen) => (
                          <SelectItem key={sen} value={sen} className="capitalize">
                            {sen === "c-level" ? "C-Level" : sen.charAt(0).toUpperCase() + sen.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                      <SelectTrigger className="w-[140px]">
                        <MapPin className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Header with Bulk Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedContacts.size === filteredContacts.length && filteredContacts.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <p className="text-sm text-muted-foreground">
                  {selectedContacts.size > 0 ? (
                    <span className="text-foreground font-medium">
                      {selectedContacts.size} selected
                    </span>
                  ) : (
                    <>
                      Showing {filteredContacts.length} of {enrichedContacts.length} contacts
                      <span className="text-foreground font-medium ml-1">
                        • Sorted by Relevance
                      </span>
                    </>
                  )}
                </p>
              </div>
              {selectedContacts.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setBulkAddDialog(true)}
                >
                  <CheckSquare className="h-4 w-4" />
                  Add {selectedContacts.size} to list
                </Button>
              )}
            </div>

            {/* Contact List */}
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Contacts at {company.name}
                </CardTitle>
                <CardDescription>
                  Enterprise contacts ranked by relevance and PoC likelihood
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <div className="divide-y divide-border/50">
                  {filteredContacts.map((contact) => (
                    <EnterpriseContactRow
                      key={contact.id}
                      contact={contact}
                      isSelected={selectedContacts.has(contact.id)}
                      onToggleSelect={() => toggleSelectContact(contact.id)}
                      onAddToList={() => setAddToListDialog(contact)}
                      getScoreColor={getScoreColor}
                      getScoreBgColor={getScoreBgColor}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Org Chart View */}
          <TabsContent value="orgchart" className="mt-6">
            <EnterpriseOrgChart contacts={enrichedContacts} company={company} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add to List Dialog (Single) */}
      <Dialog open={!!addToListDialog} onOpenChange={() => setAddToListDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to List</DialogTitle>
            <DialogDescription>
              Add {addToListDialog?.fullName} to an existing list or create a new one.
            </DialogDescription>
          </DialogHeader>
          <ListSelectorContent
            isCreatingList={isCreatingList}
            setIsCreatingList={setIsCreatingList}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            newListName={newListName}
            setNewListName={setNewListName}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddToListDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleAddToList(false)}
              disabled={isCreatingList ? !newListName : !selectedList}
            >
              {isCreatingList ? "Create & Add" : "Add to List"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Add Dialog */}
      <Dialog open={bulkAddDialog} onOpenChange={setBulkAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add {selectedContacts.size} Contacts to List</DialogTitle>
            <DialogDescription>
              Add all selected contacts to an existing list or create a new one.
            </DialogDescription>
          </DialogHeader>
          <ListSelectorContent
            isCreatingList={isCreatingList}
            setIsCreatingList={setIsCreatingList}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            newListName={newListName}
            setNewListName={setNewListName}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleAddToList(true)}
              disabled={isCreatingList ? !newListName : !selectedList}
            >
              {isCreatingList ? "Create & Add All" : `Add ${selectedContacts.size} to List`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

// List Selector Content (reusable in dialogs)
function ListSelectorContent({
  isCreatingList,
  setIsCreatingList,
  selectedList,
  setSelectedList,
  newListName,
  setNewListName,
}: {
  isCreatingList: boolean;
  setIsCreatingList: (v: boolean) => void;
  selectedList: string;
  setSelectedList: (v: string) => void;
  newListName: string;
  setNewListName: (v: string) => void;
}) {
  return (
    <div className="space-y-4 py-4">
      {!isCreatingList ? (
        <>
          <div className="space-y-3">
            <Label>Select a list</Label>
            {mockLists.map((list) => (
              <div
                key={list.id}
                onClick={() => setSelectedList(list.id)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedList === list.id
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                )}
              >
                <div>
                  <div className="font-medium">{list.name}</div>
                  <div className="text-xs text-muted-foreground">{list.count} contacts</div>
                </div>
                {selectedList === list.id && <Check className="h-4 w-4 text-accent" />}
              </div>
            ))}
          </div>
          <Separator />
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setIsCreatingList(true)}
          >
            <Plus className="h-4 w-4" />
            Create New List
          </Button>
        </>
      ) : (
        <div className="space-y-3">
          <Label htmlFor="newListName">New list name</Label>
          <Input
            id="newListName"
            placeholder="e.g., IT Decision Makers"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <Button variant="ghost" size="sm" onClick={() => setIsCreatingList(false)}>
            ← Back to existing lists
          </Button>
        </div>
      )}
    </div>
  );
}

// Enterprise Contact Row Component
function EnterpriseContactRow({
  contact,
  isSelected,
  onToggleSelect,
  onAddToList,
  getScoreColor,
  getScoreBgColor,
}: {
  contact: EnrichedContact;
  isSelected: boolean;
  onToggleSelect: () => void;
  onAddToList: () => void;
  getScoreColor: (score: number) => string;
  getScoreBgColor: (score: number) => string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
      {/* Checkbox */}
      <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />

      {/* Avatar & Basic Info */}
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={contact.avatarUrl} />
        <AvatarFallback className="text-sm">
          {contact.firstName[0]}
          {contact.lastName[0]}
        </AvatarFallback>
      </Avatar>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium truncate">{contact.fullName}</span>
          <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
            {contact.seniority === "c-level" ? "C-Level" : contact.seniority}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground truncate">{contact.title}</div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {contact.department}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {contact.region}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
        {contact.email ? (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span className="max-w-[120px] truncate">{contact.email}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/50">No email</span>
        )}
        {contact.linkedinUrl && (
          <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[#0077B5] hover:opacity-80">
            <Linkedin className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Scores */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Relevance Score */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("flex flex-col items-center px-2 py-1 rounded-lg cursor-help", getScoreBgColor(contact.scores.relevanceScore))}>
              <span className="text-[10px] text-muted-foreground uppercase">Relevance</span>
              <span className={cn("font-bold text-lg", getScoreColor(contact.scores.relevanceScore))}>
                {contact.scores.relevanceScore}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs p-3">
            <div className="text-xs font-medium mb-1">Relevance Score</div>
            <p className="text-xs text-muted-foreground">
              Based on function alignment, seniority, and typical buying influence for solutions in your category.
            </p>
          </TooltipContent>
        </Tooltip>

        {/* PoC Likelihood */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("flex flex-col items-center px-2 py-1 rounded-lg cursor-help", getScoreBgColor(contact.scores.pocLikelihood))}>
              <span className="text-[10px] text-muted-foreground uppercase">PoC</span>
              <div className="flex items-center gap-1">
                <Sparkles className={cn("h-3 w-3", getScoreColor(contact.scores.pocLikelihood))} />
                <span className={cn("font-bold text-lg", getScoreColor(contact.scores.pocLikelihood))}>
                  {contact.scores.pocLikelihood}
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-sm p-3">
            <div className="text-xs font-medium mb-1 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-accent" />
              PoC Likelihood Analysis
            </div>
            <p className="text-xs text-muted-foreground">{contact.scores.reasoning}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={onAddToList}>
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Add to list</span>
        </Button>
      </div>
    </div>
  );
}

// =========================================
// ENTERPRISE ORG CHART
// =========================================

function OrgChartNodeComponent({ data }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const contact = data as unknown as EnrichedContact & { isLeader: boolean; isTopPoC: boolean; teamSize?: number };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-accent";
    if (score >= 50) return "text-warning";
    return "text-muted-foreground";
  };

  const isLeader = contact.isLeader;
  const isTopPoC = contact.isTopPoC;
  const nodeSize = isLeader ? "min-w-[220px]" : "min-w-[180px]";
  const avatarSize = isLeader ? "h-14 w-14" : "h-10 w-10";

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Top} className="!bg-border" />

      <div
        className={cn(
          "px-4 py-3 rounded-xl bg-card border-2 shadow-md transition-all duration-200",
          nodeSize,
          isTopPoC
            ? "border-success shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            : isLeader
            ? "border-accent/50"
            : "border-border",
          isHovered && "scale-105 shadow-lg z-50"
        )}
      >
        <div className="flex items-center gap-3">
          <Avatar className={cn(avatarSize, "border-2 border-background")}>
            <AvatarImage src={contact.avatarUrl} />
            <AvatarFallback className={isLeader ? "text-sm" : "text-xs"}>
              {contact.firstName[0]}{contact.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className={cn("font-medium truncate", isLeader ? "text-base" : "text-sm")}>
              {contact.fullName}
            </div>
            <div className="text-xs text-muted-foreground truncate">{contact.title}</div>
            {isLeader && contact.teamSize && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <Users className="h-3 w-3" />
                <span>{contact.teamSize} reports</span>
              </div>
            )}
          </div>
          {isTopPoC && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10">
              <Sparkles className="h-3 w-3 text-success" />
              <span className="text-xs font-semibold text-success">{contact.scores.pocLikelihood}</span>
            </div>
          )}
        </div>

        {/* Function Badge */}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-[10px] py-0">
            {contact.department}
          </Badge>
          {isLeader && (
            <Badge variant="outline" className="text-[10px] py-0 border-accent/50 text-accent">
              Leader
            </Badge>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-border" />

      {/* Hover Card */}
      {isHovered && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[100] animate-in fade-in zoom-in-95 duration-150">
          <Card className="w-72 shadow-xl border-border/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatarUrl} />
                  <AvatarFallback>{contact.firstName[0]}{contact.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{contact.fullName}</div>
                  <div className="text-sm text-muted-foreground">{contact.title}</div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Relevance</div>
                  <div className={cn("font-bold text-lg", getScoreColor(contact.scores.relevanceScore))}>
                    {contact.scores.relevanceScore}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">PoC Likelihood</div>
                  <div className={cn("font-bold text-lg", getScoreColor(contact.scores.pocLikelihood))}>
                    {contact.scores.pocLikelihood}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-medium text-muted-foreground uppercase">Analysis</div>
                <p className="text-sm text-foreground/80 leading-relaxed">{contact.scores.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Team/Department header node
function DepartmentNodeComponent({ data }: NodeProps) {
  const dept = data as unknown as { name: string; count: number };

  return (
    <div className="px-6 py-3 rounded-xl bg-muted/80 border border-border shadow-sm min-w-[160px] text-center">
      <div className="font-semibold text-sm">{dept.name}</div>
      <div className="text-xs text-muted-foreground">{dept.count} contacts</div>
    </div>
  );
}

const orgChartNodeTypes = {
  contact: OrgChartNodeComponent,
  department: DepartmentNodeComponent,
};

interface EnterpriseOrgChartProps {
  contacts: EnrichedContact[];
  company: Company;
}

function EnterpriseOrgChartInner({ contacts, company }: EnterpriseOrgChartProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (contacts.length === 0) return { nodes: [], edges: [] };

    // Find top PoC candidates
    const sortedByPoC = [...contacts].sort((a, b) => b.scores.pocLikelihood - a.scores.pocLikelihood);
    const topPoCIds = new Set(sortedByPoC.slice(0, 3).map((c) => c.id));

    // Group by department
    const byDept = contacts.reduce((acc, c) => {
      if (!acc[c.department]) acc[c.department] = [];
      acc[c.department].push(c);
      return acc;
    }, {} as Record<string, EnrichedContact[]>);

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const deptWidth = 300;
    const nodeHeight = 100;
    const deptGap = 80;
    const departments = Object.keys(byDept);

    // Layout departments horizontally
    let xOffset = 0;

    departments.forEach((deptName) => {
      const deptContacts = byDept[deptName];
      const deptId = `dept_${deptName.replace(/\s+/g, "_")}`;

      // Find leader (highest seniority)
      const seniorityOrder = ["c-level", "vp", "director", "manager", "individual"];
      const sortedBySeniority = [...deptContacts].sort(
        (a, b) => seniorityOrder.indexOf(a.seniority) - seniorityOrder.indexOf(b.seniority)
      );
      const leader = sortedBySeniority[0];
      const others = sortedBySeniority.slice(1);

      // Department header node
      nodes.push({
        id: deptId,
        type: "department",
        position: { x: xOffset, y: 0 },
        data: { name: deptName, count: deptContacts.length } as unknown as Record<string, unknown>,
      });

      // Leader node
      if (leader) {
        const leaderId = leader.id;
        nodes.push({
          id: leaderId,
          type: "contact",
          position: { x: xOffset, y: nodeHeight + 30 },
          data: {
            ...leader,
            isLeader: true,
            isTopPoC: topPoCIds.has(leader.id),
            teamSize: others.length,
          } as unknown as Record<string, unknown>,
        });

        edges.push({
          id: `${deptId}-${leaderId}`,
          source: deptId,
          target: leaderId,
          type: "smoothstep",
          style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        });

        // Other team members
        const rowSize = 2;
        others.forEach((contact, idx) => {
          const row = Math.floor(idx / rowSize);
          const col = idx % rowSize;
          const nodeId = contact.id;

          nodes.push({
            id: nodeId,
            type: "contact",
            position: {
              x: xOffset - 100 + col * 220,
              y: nodeHeight * 2 + 60 + row * (nodeHeight + 20),
            },
            data: {
              ...contact,
              isLeader: false,
              isTopPoC: topPoCIds.has(contact.id),
            } as unknown as Record<string, unknown>,
          });

          edges.push({
            id: `${leaderId}-${nodeId}`,
            source: leaderId,
            target: nodeId,
            type: "smoothstep",
            style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
            animated: topPoCIds.has(contact.id),
          });
        });
      }

      xOffset += deptWidth + deptGap;
    });

    return { nodes, edges };
  }, [contacts]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handleRecenter = useCallback(() => {
    fitView({ padding: 0.2, duration: 300 });
  }, [fitView]);

  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Network className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No org chart data</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Organization structure data is not available for {company.name}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-[600px] bg-muted/20">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button variant="secondary" size="icon" onClick={() => zoomIn({ duration: 200 })} className="shadow-md">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={() => zoomOut({ duration: 200 })} className="shadow-md">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleRecenter} className="shadow-md">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-lg border border-border/50 p-3 shadow-md">
          <div className="text-xs font-medium text-muted-foreground mb-2">Legend</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded border-2 border-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span>Best PoC (Top 3)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded border-2 border-accent/50" />
              <span>Department Leader</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded border-2 border-border" />
              <span>Team Member</span>
            </div>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={orgChartNodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          className="bg-transparent"
        >
          <Background color="hsl(var(--border))" gap={20} size={1} />
        </ReactFlow>
      </div>
    </Card>
  );
}

function EnterpriseOrgChart({ contacts, company }: EnterpriseOrgChartProps) {
  return (
    <ReactFlowProvider>
      <EnterpriseOrgChartInner contacts={contacts} company={company} />
    </ReactFlowProvider>
  );
}

export default EnterpriseContactsTab;
