import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Search,
  Zap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";

import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardSkeleton } from "@/components/layout/PageSkeleton";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: React.ElementType;
}

function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-accent" />
          </div>
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        {change && (
          <div
            className={`flex items-center gap-1 text-sm ${
              trend === "up" ? "text-success" : "text-destructive"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Sarah. Here's what's happening with your prospects."
      />

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Companies"
          value="2,847"
          change="+12% from last month"
          trend="up"
          icon={Building2}
        />
        <StatCard
          title="Contacts Found"
          value="12,453"
          change="+8% from last month"
          trend="up"
          icon={Users}
        />
        <StatCard
          title="Search Runs"
          value="48"
          change="+24% from last month"
          trend="up"
          icon={Search}
        />
        <StatCard
          title="Active Signals"
          value="156"
          change="-3% from last month"
          trend="down"
          icon={Zap}
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Signals */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Signals</CardTitle>
            <Link to="/signals">
              <Button variant="ghost" size="sm" className="gap-1">
                View all
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {[
                {
                  company: "TechVenture Inc",
                  signal: "Series B Funding",
                  type: "funding",
                  time: "2 hours ago",
                },
                {
                  company: "CloudScale Labs",
                  signal: "Hiring 15+ Engineers",
                  type: "hiring",
                  time: "5 hours ago",
                },
                {
                  company: "HealthFlow Systems",
                  signal: "New Partnership",
                  type: "growth",
                  time: "1 day ago",
                },
                {
                  company: "FinServe Global",
                  signal: "Cloud Migration",
                  type: "technology",
                  time: "2 days ago",
                },
              ].map((item) => (
                <div
                  key={item.company}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{item.company}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.signal}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        item.type === "funding"
                          ? "success"
                          : item.type === "hiring"
                          ? "info"
                          : item.type === "growth"
                          ? "accent"
                          : "secondary"
                      }
                    >
                      {item.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/find" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Search className="h-4 w-4" />
                New Search
              </Button>
            </Link>
            <Link to="/lists" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <TrendingUp className="h-4 w-4" />
                View Lists
              </Button>
            </Link>
            <Link to="/prospects" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Building2 className="h-4 w-4" />
                My Prospects
              </Button>
            </Link>
            <Link to="/signals" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Zap className="h-4 w-4" />
                Signal Feed
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
