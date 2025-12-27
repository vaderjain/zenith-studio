import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit,
  ExternalLink,
} from "lucide-react";

import {
  PageContainer,
  PageHeader,
  AutoBreadcrumbs,
} from "@/components/layout";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";

import { getSavedCompanies } from "@/mock/api";
import type { SavedCompany } from "@/types";

const stageColors: Record<string, "default" | "secondary" | "success" | "warning" | "info" | "accent" | "destructive"> = {
  new: "secondary",
  researching: "info",
  qualified: "accent",
  outreach: "warning",
  meeting: "success",
  won: "success",
  lost: "destructive",
};

export default function MyProspects() {
  const [isLoading, setIsLoading] = useState(true);
  const [savedCompanies, setSavedCompanies] = useState<SavedCompany[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const result = await getSavedCompanies("ws_1");
      setSavedCompanies(result.data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return <PageSkeleton title table />;
  }

  const filteredCompanies = savedCompanies.filter((saved) =>
    saved.company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <AutoBreadcrumbs />

      <PageHeader
        title="My Prospects"
        description="Companies you've saved for follow-up"
        badge={
          <Badge variant="secondary">{savedCompanies.length} saved</Badge>
        }
      />

      {savedCompanies.length > 0 ? (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
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

          {/* List */}
          <div className="space-y-4">
            {filteredCompanies.map((saved) => (
              <Card
                key={saved.id}
                className="hover:shadow-lg hover:border-border transition-all duration-200 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
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

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link to={`/company/${saved.companyId}`}>
                            <h3 className="font-semibold text-lg hover:text-accent transition-colors">
                              {saved.company.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {saved.company.industry} • {saved.company.employeeRange}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={stageColors[saved.stage]}>
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
                            {saved.company.icpScore}%
                          </Badge>
                        </div>
                      </div>

                      {saved.notes && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {saved.notes}
                        </p>
                      )}

                      {saved.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {saved.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit notes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View company
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={Building2}
          title="No saved prospects yet"
          description="Start exploring companies and save the ones that match your ICP to track them here."
          action={
            <Link to="/find">
              <Button>
                <Search className="h-4 w-4" />
                Find Prospects
              </Button>
            </Link>
          }
        />
      )}
    </PageContainer>
  );
}
