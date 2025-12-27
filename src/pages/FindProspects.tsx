import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Users,
  ChevronRight,
  Bookmark,
  MoreHorizontal,
  SlidersHorizontal,
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

import { getCompanies } from "@/mock/api";
import type { Company } from "@/types";

export default function FindProspects() {
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const result = await getCompanies();
      setCompanies(result.data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return <PageSkeleton title cards={0} table />;
  }

  return (
    <PageContainer>
      <AutoBreadcrumbs />

      <PageHeader
        title="Find Prospects"
        description="Search and discover companies matching your ICP"
        action={
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        }
      />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="finance">Financial Services</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            <SelectItem value="1-50">1-50</SelectItem>
            <SelectItem value="51-200">51-200</SelectItem>
            <SelectItem value="201-500">201-500</SelectItem>
            <SelectItem value="500+">500+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing <strong>{companies.length}</strong> companies
        </p>
        <Select defaultValue="score">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score">ICP Score</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="size">Size</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Company List */}
      <div className="space-y-4">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </PageContainer>
  );
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <Card className="hover:shadow-lg hover:border-border transition-all duration-200 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link to={`/company/${company.id}`}>
                  <h3 className="font-semibold text-lg hover:text-accent transition-colors">
                    {company.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {company.description || company.industry}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
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
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {company.headquarters.city}, {company.headquarters.country}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {company.employeeRange} employees
              </div>
              <Badge variant="outline">{company.industry}</Badge>
              <Badge variant="outline">{company.type}</Badge>
            </div>

            {/* Signals */}
            {company.signals.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {company.signals.slice(0, 2).map((signal) => (
                  <Badge key={signal.id} variant="info" className="text-xs">
                    {signal.title}
                  </Badge>
                ))}
                {company.signals.length > 2 && (
                  <Badge variant="muted" className="text-xs">
                    +{company.signals.length - 2} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon-sm">
              <Bookmark className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Add to list</DropdownMenuItem>
                <DropdownMenuItem>Add to watchlist</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to={`/company/${company.id}`}>
              <Button variant="ghost" size="icon-sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
