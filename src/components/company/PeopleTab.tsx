import { useState, useMemo } from "react";
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
import { toast } from "sonner";

import type { Contact, Company } from "@/types";
import { cn } from "@/lib/utils";

// Mock PoC scoring data
interface PoCScore {
  score: number;
  reasoning: string;
  factors: {
    label: string;
    impact: "positive" | "negative" | "neutral";
    weight: number;
  }[];
}

const generatePoCScore = (contact: Contact): PoCScore => {
  // Mock scoring logic based on seniority and department
  const seniorityScores: Record<string, number> = {
    "c-level": 95,
    vp: 88,
    director: 75,
    manager: 60,
    individual: 40,
  };

  const departmentBonus: Record<string, number> = {
    Sales: 10,
    Marketing: 8,
    "Product Management": 12,
    Engineering: 5,
    Operations: 3,
    Finance: 2,
    "Human Resources": 0,
  };

  const baseScore = seniorityScores[contact.seniority] || 50;
  const deptBonus = departmentBonus[contact.department] || 0;
  const score = Math.min(100, baseScore + deptBonus + Math.floor(Math.random() * 10) - 5);

  const reasoningTemplates = [
    `${contact.fullName} is a strong PoC candidate due to their ${contact.seniority} position in ${contact.department}. Their decision-making authority and department alignment with your ICP makes them highly likely to engage with your solution.`,
    `Based on their role as ${contact.title}, ${contact.firstName} has direct influence over purchasing decisions in their domain. The ${contact.department} department typically drives initiatives related to your product category.`,
    `${contact.fullName}'s seniority level (${contact.seniority}) indicates budget authority and strategic vision. Combined with their ${contact.department} focus, they represent an ideal entry point for your sales motion.`,
  ];

  return {
    score,
    reasoning: reasoningTemplates[Math.floor(Math.random() * reasoningTemplates.length)],
    factors: [
      {
        label: `${contact.seniority.toUpperCase()} seniority level`,
        impact: contact.seniority === "c-level" || contact.seniority === "vp" ? "positive" : "neutral",
        weight: 40,
      },
      {
        label: `${contact.department} department alignment`,
        impact: ["Sales", "Marketing", "Product Management"].includes(contact.department) ? "positive" : "neutral",
        weight: 25,
      },
      {
        label: contact.email ? "Email verified" : "Email not available",
        impact: contact.email ? "positive" : "negative",
        weight: 15,
      },
      {
        label: contact.linkedinUrl ? "LinkedIn profile available" : "No LinkedIn profile",
        impact: contact.linkedinUrl ? "positive" : "negative",
        weight: 10,
      },
      {
        label: "Recent activity signals",
        impact: Math.random() > 0.5 ? "positive" : "neutral",
        weight: 10,
      },
    ],
  };
};

// Mock lists
const mockLists = [
  { id: "list_1", name: "Hot Leads Q1", count: 24 },
  { id: "list_2", name: "Enterprise Targets", count: 156 },
  { id: "list_3", name: "Product-Led Growth", count: 89 },
];

// Mock about text
const generateAbout = (contact: Contact): string => {
  const aboutTemplates = [
    `Experienced ${contact.title} with a focus on driving growth and innovation in ${contact.department}.`,
    `Seasoned professional leading ${contact.department} initiatives. Passionate about building high-performing teams.`,
    `${contact.seniority === "c-level" ? "Executive" : "Leader"} in ${contact.department} with track record of delivering results.`,
    `Dedicated to transforming ${contact.department} operations through data-driven strategies and modern tooling.`,
  ];
  return aboutTemplates[Math.floor(Math.random() * aboutTemplates.length)];
};

interface EmployeeWithScore extends Contact {
  pocScore: PoCScore;
  about: string;
}

interface PeopleTabProps {
  contacts: Contact[];
  company: Company;
}

export function PeopleTab({ contacts, company }: PeopleTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [seniorityFilter, setSeniorityFilter] = useState<string>("all");
  const [addToListDialog, setAddToListDialog] = useState<EmployeeWithScore | null>(null);
  const [selectedList, setSelectedList] = useState<string>("");
  const [newListName, setNewListName] = useState("");
  const [isCreatingList, setIsCreatingList] = useState(false);

  // Enrich contacts with PoC scores
  const employeesWithScores: EmployeeWithScore[] = useMemo(() => {
    return contacts.map((contact) => ({
      ...contact,
      pocScore: generatePoCScore(contact),
      about: generateAbout(contact),
    }));
  }, [contacts]);

  // Get unique departments and seniorities for filters
  const departments = useMemo(() => {
    const depts = new Set(contacts.map((c) => c.department));
    return Array.from(depts).sort();
  }, [contacts]);

  const seniorities = ["c-level", "vp", "director", "manager", "individual"];

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let filtered = [...employeesWithScores];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.fullName.toLowerCase().includes(query) ||
          e.title.toLowerCase().includes(query) ||
          e.department.toLowerCase().includes(query)
      );
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((e) => e.department === departmentFilter);
    }

    if (seniorityFilter !== "all") {
      filtered = filtered.filter((e) => e.seniority === seniorityFilter);
    }

    // Sort by PoC score descending
    return filtered.sort((a, b) => b.pocScore.score - a.pocScore.score);
  }, [employeesWithScores, searchQuery, departmentFilter, seniorityFilter]);

  const handleAddToList = () => {
    if (isCreatingList && newListName) {
      toast.success(`Created list "${newListName}" and added ${addToListDialog?.fullName}`);
    } else if (selectedList) {
      const list = mockLists.find((l) => l.id === selectedList);
      toast.success(`Added ${addToListDialog?.fullName} to "${list?.name}"`);
    }
    setAddToListDialog(null);
    setSelectedList("");
    setNewListName("");
    setIsCreatingList(false);
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
          <h3 className="text-lg font-medium mb-2">No people found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We haven't discovered any employees for {company.name} yet. Check back later for updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, title, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
                  <SelectTrigger className="w-[140px]">
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEmployees.length} of {employeesWithScores.length} people
            <span className="text-foreground font-medium ml-1">
              • Sorted by Ideal PoC Score
            </span>
          </p>
        </div>

        {/* Employee List */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              People at {company.name}
            </CardTitle>
            <CardDescription>
              Employees ranked by Ideal Point of Contact score
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <div className="divide-y divide-border/50">
              {filteredEmployees.map((employee) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  onAddToList={() => setAddToListDialog(employee)}
                  getScoreColor={getScoreColor}
                  getScoreBgColor={getScoreBgColor}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add to List Dialog */}
      <Dialog open={!!addToListDialog} onOpenChange={() => setAddToListDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to List</DialogTitle>
            <DialogDescription>
              Add {addToListDialog?.fullName} to an existing list or create a new one.
            </DialogDescription>
          </DialogHeader>

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
                        <div className="text-xs text-muted-foreground">
                          {list.count} contacts
                        </div>
                      </div>
                      {selectedList === list.id && (
                        <Check className="h-4 w-4 text-accent" />
                      )}
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
                  placeholder="e.g., High Priority Leads"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreatingList(false)}
                >
                  ← Back to existing lists
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddToListDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddToList}
              disabled={isCreatingList ? !newListName : !selectedList}
            >
              {isCreatingList ? "Create & Add" : "Add to List"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

// Employee Row Component
function EmployeeRow({
  employee,
  onAddToList,
  getScoreColor,
  getScoreBgColor,
}: {
  employee: EmployeeWithScore;
  onAddToList: () => void;
  getScoreColor: (score: number) => string;
  getScoreBgColor: (score: number) => string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
      {/* Avatar & Basic Info */}
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={employee.avatarUrl} />
        <AvatarFallback className="text-sm">
          {employee.firstName[0]}
          {employee.lastName[0]}
        </AvatarFallback>
      </Avatar>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium truncate">{employee.fullName}</span>
          <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
            {employee.seniority === "c-level" ? "C-Level" : employee.seniority}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground truncate">{employee.title}</div>
        <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-1">{employee.about}</p>
      </div>

      {/* Contact Info */}
      <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
        {employee.email ? (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span className="max-w-[140px] truncate">{employee.email}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/50">No email</span>
        )}
        {employee.linkedinUrl && (
          <a
            href={employee.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0077B5] hover:opacity-80"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* PoC Score */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-help",
                getScoreBgColor(employee.pocScore.score)
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className={cn("h-4 w-4", getScoreColor(employee.pocScore.score))} />
                  <span className={cn("font-semibold text-lg", getScoreColor(employee.pocScore.score))}>
                    {employee.pocScore.score}
                  </span>
                </div>
                <Progress
                  value={employee.pocScore.score}
                  className="h-1 w-16"
                />
              </div>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="max-w-sm p-4 space-y-3"
          >
            <div className="font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              Ideal PoC Scoring
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {employee.pocScore.reasoning}
            </p>
            <Separator />
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase">
                Scoring Factors
              </div>
              {employee.pocScore.factors.map((factor, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        factor.impact === "positive"
                          ? "bg-success"
                          : factor.impact === "negative"
                          ? "bg-destructive"
                          : "bg-muted-foreground"
                      )}
                    />
                    {factor.label}
                  </span>
                  <span className="text-muted-foreground">{factor.weight}%</span>
                </div>
              ))}
            </div>
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

export default PeopleTab;
