import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  List,
  Plus,
  MoreHorizontal,
  Users,
  Building2,
  Calendar,
  Clock,
  Trash2,
  Pencil,
  ExternalLink,
  Sparkles,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { getProspectLists } from "@/mock/api";
import type { ProspectList } from "@/types";
import { cn } from "@/lib/utils";

export default function Lists() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState<ProspectList[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const data = await getProspectLists("ws_1");
      setLists(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleCreateList = () => {
    if (!newListName.trim()) return;

    const newList: ProspectList = {
      id: `list_${Date.now()}`,
      workspaceId: "ws_1",
      name: newListName.trim(),
      description: newListDescription.trim() || undefined,
      type: "static",
      companyCount: 0,
      contactCount: 0,
      companies: [],
      createdBy: "member_1",
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };

    setLists([newList, ...lists]);
    setCreateDialogOpen(false);
    setNewListName("");
    setNewListDescription("");
    toast.success(`List "${newListName}" created`);
    navigate(`/lists/${newList.id}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(date);
  };

  if (isLoading) return <PageSkeleton title cards={4} />;

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Lists" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Lists</h1>
          <p className="text-muted-foreground mt-1">
            Organize prospects into targeted lists for outreach
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New List
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <List className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Total Lists
                </div>
                <div className="font-semibold text-lg">{lists.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-info" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Companies
                </div>
                <div className="font-semibold text-lg">
                  {lists.reduce((sum, l) => sum + l.companyCount, 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Contacts
                </div>
                <div className="font-semibold text-lg">
                  {lists.reduce((sum, l) => sum + l.contactCount, 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Dynamic
                </div>
                <div className="font-semibold text-lg">
                  {lists.filter((l) => l.type === "dynamic").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists Grid */}
      {lists.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <Card
              key={list.id}
              className="group hover:shadow-lg hover:border-accent/30 transition-all cursor-pointer h-full relative"
            >
              <Link to={`/lists/${list.id}`} className="block h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate group-hover:text-accent transition-colors">
                        {list.name}
                      </CardTitle>
                      {list.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {list.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge
                      variant={list.type === "dynamic" ? "accent" : "secondary"}
                      className="flex-shrink-0"
                    >
                      {list.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Counts */}
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium text-foreground">{list.companyCount}</span>
                      <span>companies</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="font-medium text-foreground">{list.contactCount}</span>
                      <span>contacts</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Created {formatDate(list.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Updated {formatRelativeDate(list.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {list.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {list.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Link>

              {/* Quick Actions Menu */}
              <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/lists/${list.id}`)}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Rename coming soon")}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => toast.info("Delete coming soon")}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={List}
          title="No lists yet"
          description="Create lists to organize your prospects for targeted outreach campaigns."
          action={
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First List
            </Button>
          }
        />
      )}

      {/* Create List Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
            <DialogDescription>
              Create a list to organize prospects for outreach campaigns.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="listName">List name *</Label>
              <Input
                id="listName"
                placeholder="e.g., Q1 Enterprise Outreach"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="listDescription">Description (optional)</Label>
              <Textarea
                id="listDescription"
                placeholder="Describe the purpose of this list..."
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateList} disabled={!newListName.trim()}>
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
