import { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Mail, 
  Shield, 
  Building2, 
  Globe, 
  CreditCard, 
  Zap, 
  Crown,
  Settings,
  MoreHorizontal,
  Trash2,
  UserCog,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink
} from "lucide-react";
import { PageContainer, PageHeader, AutoBreadcrumbs } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { members as mockMembers, workspaces, plans } from "@/mock/data";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Member } from "@/types";

const rolePermissions: Record<Member['role'], string[]> = {
  owner: ['Full workspace control', 'Manage billing', 'Manage members', 'Delete workspace'],
  admin: ['Manage members', 'Create & edit projects', 'View billing', 'Manage integrations'],
  member: ['Create & edit projects', 'Use credits', 'View workspace settings'],
  viewer: ['View projects', 'View workspace settings'],
};

const roleColors: Record<Member['role'], string> = {
  owner: 'bg-accent/10 text-accent border-accent/20',
  admin: 'bg-primary/10 text-primary border-primary/20',
  member: 'bg-info/10 text-info border-info/20',
  viewer: 'bg-muted text-muted-foreground border-border',
};

const statusConfig: Record<Member['status'], { icon: React.ElementType; color: string; label: string }> = {
  active: { icon: CheckCircle2, color: 'text-success', label: 'Active' },
  pending: { icon: Clock, color: 'text-warning', label: 'Pending' },
  suspended: { icon: XCircle, color: 'text-destructive', label: 'Suspended' },
};

function WorkspaceSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-16 w-16 rounded-xl" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default function Workspace() {
  const [isLoading, setIsLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Member['role']>("member");
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [isInviting, setIsInviting] = useState(false);

  const workspace = workspaces[0];
  const plan = plans.find(p => p.id === workspace.plan.id) || plans[1];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllMembers(mockMembers);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({ title: "Email required", description: "Please enter an email address.", variant: "destructive" });
      return;
    }

    if (allMembers.some(m => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
      toast({ title: "Already a member", description: "This email is already in your workspace.", variant: "destructive" });
      return;
    }

    setIsInviting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newMember: Member = {
      id: `member_${Date.now()}`,
      userId: `user_${Date.now()}`,
      workspaceId: workspace.id,
      email: inviteEmail,
      name: inviteEmail.split('@')[0],
      role: inviteRole,
      invitedAt: new Date(),
      status: 'pending',
    };

    setAllMembers(prev => [...prev, newMember]);
    setIsInviting(false);
    setInviteDialogOpen(false);
    setInviteEmail("");
    setInviteRole("member");

    toast({
      title: "Invitation sent",
      description: `An invite has been sent to ${inviteEmail}.`,
    });
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`https://app.prospect.io/invite/${workspace.id}`);
    toast({ title: "Link copied", description: "Invite link copied to clipboard." });
  };

  const activeMembers = allMembers.filter(m => m.status === 'active');
  const pendingMembers = allMembers.filter(m => m.status === 'pending');

  if (isLoading) return <WorkspaceSkeleton />;

  return (
    <PageContainer>
      <AutoBreadcrumbs />
      <PageHeader 
        title="Workspace" 
        description="Manage your team and workspace settings"
        action={
          <Button onClick={() => setInviteDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Invite Member
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Workspace Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-20 bg-gradient-to-br from-accent/20 via-primary/10 to-info/20" />
            <CardContent className="pt-0 -mt-8">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-xl bg-background border-4 border-background shadow-lg flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-xl font-semibold">{workspace.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Globe className="h-3.5 w-3.5" />
                  {workspace.slug}.prospect.io
                </p>
              </div>

              <Separator className="my-6" />

              {/* Plan & Credits */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Crown className="h-4 w-4" />
                    <span>Plan</span>
                  </div>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 font-medium">
                    {plan.displayName}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    <span>Credits</span>
                  </div>
                  <span className="font-semibold">{workspace.creditBalance.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                  </div>
                  <span className="font-semibold">
                    {activeMembers.length}
                    {plan.maxMembers > 0 && ` / ${plan.maxMembers}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>Monthly</span>
                  </div>
                  <span className="font-semibold">${plan.priceMonthly}/mo</span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Settings className="h-4 w-4" />
                  Workspace Settings
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <CreditCard className="h-4 w-4" />
                  Manage Billing
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Object.entries(rolePermissions) as [Member['role'], string[]][]).map(([role, permissions]) => (
                <div key={role}>
                  <Badge variant="outline" className={cn("mb-2 capitalize", roleColors[role])}>
                    {role}
                  </Badge>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-1">
                    {permissions.map((perm, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                        {perm}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Members Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Members */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Team Members</CardTitle>
                <CardDescription>{activeMembers.length} active member{activeMembers.length !== 1 ? 's' : ''}</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyInviteLink} className="gap-2">
                <Copy className="h-3.5 w-3.5" />
                Copy Invite Link
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeMembers.map((member) => {
                    const StatusIcon = statusConfig[member.status].icon;
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="outline" className={cn("capitalize", roleColors[member.role])}>
                                {member.role}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-[200px]">
                              <p className="font-medium mb-1 capitalize">{member.role} permissions:</p>
                              <ul className="text-xs space-y-0.5">
                                {rolePermissions[member.role].slice(0, 3).map((p, i) => (
                                  <li key={i}>• {p}</li>
                                ))}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <div className={cn("flex items-center gap-1.5 text-sm", statusConfig[member.status].color)}>
                            <StatusIcon className="h-4 w-4" />
                            {statusConfig[member.status].label}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <UserCog className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" disabled={member.role === 'owner'}>
                                <Trash2 className="h-4 w-4 mr-2" />
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
            </CardContent>
          </Card>

          {/* Pending Invites */}
          {pendingMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  Pending Invitations
                </CardTitle>
                <CardDescription>
                  {pendingMembers.length} pending invite{pendingMembers.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="text-xs bg-warning/10 text-warning">
                                <Mail className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.email}</div>
                              <div className="text-sm text-muted-foreground">Invitation pending</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("capitalize", roleColors[member.role])}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(member.invitedAt, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <Mail className="h-3.5 w-3.5" />
                              Resend
                            </Button>
                            <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace. They'll receive an email with instructions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={(val) => setInviteRole(val as Member['role'])}>
                <SelectTrigger id="invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-xs", roleColors.viewer)}>Viewer</Badge>
                      <span className="text-muted-foreground">View only access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="member">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-xs", roleColors.member)}>Member</Badge>
                      <span className="text-muted-foreground">Can create & edit</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-xs", roleColors.admin)}>Admin</Badge>
                      <span className="text-muted-foreground">Full management</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Permission Preview */}
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {inviteRole.charAt(0).toUpperCase() + inviteRole.slice(1)} permissions:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {rolePermissions[inviteRole].map((perm, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-success" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={isInviting}>
              {isInviting ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
