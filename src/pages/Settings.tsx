import { useState, useEffect } from "react";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { PageContainer, PageHeader, AutoBreadcrumbs } from "@/components/layout";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { setTimeout(() => setIsLoading(false), 400); }, []);
  if (isLoading) return <PageSkeleton title cards={2} />;

  return (
    <PageContainer>
      <AutoBreadcrumbs />
      <PageHeader title="Settings" description="Manage your account and preferences" />
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile Settings</CardTitle><CardDescription>Update your personal information</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>First Name</Label><Input defaultValue="Sarah" /></div>
                <div className="space-y-2"><Label>Last Name</Label><Input defaultValue="Chen" /></div>
              </div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue="sarah@acme.com" type="email" /></div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div><div className="font-medium">Email notifications</div><div className="text-sm text-muted-foreground">Receive updates via email</div></div><Switch defaultChecked /></div>
              <div className="flex items-center justify-between"><div><div className="font-medium">Signal alerts</div><div className="text-sm text-muted-foreground">Get notified about new signals</div></div><Switch defaultChecked /></div>
              <div className="flex items-center justify-between"><div><div className="font-medium">Weekly digest</div><div className="text-sm text-muted-foreground">Summary of weekly activity</div></div><Switch /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
