import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Mail,
  Bell,
  Settings,
  User,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Info,
  Zap,
  Building2,
  Users,
  Sparkles,
  ArrowRight,
  Download,
  Upload,
  Trash2,
  Edit,
  MoreHorizontal,
  Copy,
  ExternalLink,
  Inbox,
  FolderOpen,
} from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateCompact } from "@/components/ui/empty-state";
import { toast } from "@/hooks/use-toast";

export default function UIKit() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleToast = (variant: "default" | "destructive") => {
    if (variant === "destructive") {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "There was a problem with your request.",
      });
    } else {
      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-accent to-info flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="font-semibold text-lg">UI Kit</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Components
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-16 text-center">
          <Badge variant="accent" className="mb-4">
            Design System
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Premium SaaS UI Kit
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Modern, calm, spacious components with high-contrast typography,
            subtle gradients, and tasteful motion.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-20">
          {/* Buttons */}
          <Section title="Buttons" description="Primary actions and interactions">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="accent">Accent</Button>
                <Button variant="success">Success</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="glass">Glass</Button>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Plus className="h-4 w-4" />
                  With Icon
                </Button>
                <Button variant="outline">
                  Download
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="icon">
                  <Settings />
                </Button>
                <Button size="icon-sm" variant="ghost">
                  <Bell />
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </Section>

          {/* Cards */}
          <Section title="Cards" description="Content containers with various styles">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>
                    A simple card with header and content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cards are used to group related content and actions. They
                    provide a consistent container for information.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:border-border cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Interactive Card</CardTitle>
                      <CardDescription>Click to explore</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="success">Active</Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/5 to-info/5 border-accent/20">
                <CardHeader>
                  <CardTitle>Gradient Card</CardTitle>
                  <CardDescription>
                    With subtle background gradient
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Perfect for highlighting important content or features.
                  </p>
                  <Button variant="accent" size="sm">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Card with Footer</CardTitle>
                      <CardDescription>
                        Including action buttons
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This card demonstrates a complete layout with header actions
                    and footer buttons.
                  </p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button size="sm">Save Changes</Button>
                </CardFooter>
              </Card>
            </div>
          </Section>

          {/* Inputs */}
          <Section title="Inputs" description="Form controls and text fields">
            <div className="max-w-md space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search companies..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="disabled">Disabled</Label>
                <Input
                  id="disabled"
                  placeholder="This input is disabled"
                  disabled
                />
              </div>

              <div className="flex gap-3">
                <Input placeholder="Combined with button" />
                <Button>Submit</Button>
              </div>
            </div>
          </Section>

          {/* Badges */}
          <Section title="Badges" description="Status indicators and labels">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="muted">Muted</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="accent">Accent</Badge>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="success">
                  <Check className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
                <Badge variant="warning">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
                <Badge variant="info">
                  <Info className="h-3 w-3 mr-1" />
                  New
                </Badge>
              </div>
            </div>
          </Section>

          {/* Tabs */}
          <Section title="Tabs" description="Content organization and navigation">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                      A high-level summary of your data and metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-xl bg-muted/50">
                        <div className="text-2xl font-bold">2,847</div>
                        <div className="text-sm text-muted-foreground">
                          Companies
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-muted/50">
                        <div className="text-2xl font-bold">12,453</div>
                        <div className="text-sm text-muted-foreground">
                          Contacts
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-muted/50">
                        <div className="text-2xl font-bold">342</div>
                        <div className="text-sm text-muted-foreground">
                          Credits
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>
                      Detailed analytics and performance data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Analytics content would go here...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>
                      Configure your preferences and integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Settings content would go here...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </Section>

          {/* Tables */}
          <Section title="Tables" description="Data display and management">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Companies</CardTitle>
                    <CardDescription>
                      Manage your company prospects
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                    Add Company
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        name: "TechVenture Inc",
                        industry: "Technology",
                        size: "201-500",
                        score: 92,
                      },
                      {
                        name: "FinServe Global",
                        industry: "Financial Services",
                        size: "1000+",
                        score: 88,
                      },
                      {
                        name: "HealthFlow Systems",
                        industry: "Healthcare",
                        size: "51-200",
                        score: 76,
                      },
                    ].map((company) => (
                      <TableRow key={company.name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                            {company.name}
                          </div>
                        </TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{company.size}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              company.score >= 90
                                ? "success"
                                : company.score >= 80
                                ? "accent"
                                : "secondary"
                            }
                          >
                            {company.score}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Section>

          {/* Dialogs */}
          <Section title="Dialogs" description="Modal windows and confirmations">
            <div className="flex gap-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Add a new project to your workspace. Fill in the details
                      below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Project Name</Label>
                      <Input id="name" placeholder="Enter project name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Brief description..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>
                      Create Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                onClick={() => handleToast("default")}
              >
                Show Toast
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleToast("destructive")}
              >
                Show Error Toast
              </Button>
            </div>
          </Section>

          {/* Skeleton Loaders */}
          <Section
            title="Skeleton Loaders"
            description="Loading state placeholders"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Card Skeleton
                </h4>
                <SkeletonCard />
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Basic Skeletons
                </h4>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <div className="flex gap-3">
                    <Skeleton variant="circular" className="h-10 w-10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium text-sm text-muted-foreground mb-4">
                Table Skeleton
              </h4>
              <SkeletonTable rows={3} />
            </div>
          </Section>

          {/* Empty States */}
          <Section
            title="Empty States"
            description="Placeholder content for empty data"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <EmptyState
                icon={Inbox}
                title="No messages yet"
                description="When you receive messages, they'll appear here. Start a conversation to get going."
                action={
                  <Button>
                    <Mail className="h-4 w-4" />
                    Compose Message
                  </Button>
                }
              />

              <EmptyState
                icon={FolderOpen}
                title="No projects found"
                description="Create your first project to start organizing your work and collaborating with your team."
                action={
                  <Button variant="outline">
                    <Plus className="h-4 w-4" />
                    New Project
                  </Button>
                }
              />
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyStateCompact
                    icon={Search}
                    message="No results found for your search"
                  />
                </CardContent>
              </Card>
            </div>
          </Section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          Premium SaaS UI Kit • Built with React, Tailwind CSS & shadcn/ui
        </div>
      </footer>
    </div>
  );
}

// Section component
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
