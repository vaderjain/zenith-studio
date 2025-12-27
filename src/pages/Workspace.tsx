import { useState, useEffect } from "react";
import { Users, Plus, Mail, Shield } from "lucide-react";
import { PageContainer, PageHeader, AutoBreadcrumbs } from "@/components/layout";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { members } from "@/mock/data";

export default function Workspace() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { setTimeout(() => setIsLoading(false), 500); }, []);

  if (isLoading) return <PageSkeleton title cards={4} />;

  return (
    <PageContainer>
      <AutoBreadcrumbs />
      <PageHeader title="Workspace" description="Manage your team and workspace settings" action={<Button><Plus className="h-4 w-4" />Invite Member</Button>} />
      <Card>
        <CardHeader><CardTitle>Team Members</CardTitle><CardDescription>{members.length} members</CardDescription></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar><AvatarImage src={member.avatarUrl} /><AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.status === "active" ? "success" : "warning"}>{member.status}</Badge>
                  <Badge variant="outline">{member.role}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
