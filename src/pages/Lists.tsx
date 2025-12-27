import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { List, Plus, MoreHorizontal, Users, Building2 } from "lucide-react";
import { PageContainer, PageHeader, AutoBreadcrumbs } from "@/components/layout";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getProspectLists } from "@/mock/api";
import type { ProspectList } from "@/types";

export default function Lists() {
  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState<ProspectList[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getProspectLists("ws_1");
      setLists(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) return <PageSkeleton title cards={4} />;

  return (
    <PageContainer>
      <AutoBreadcrumbs />
      <PageHeader
        title="Lists"
        description="Organize prospects into targeted lists"
        action={<Button><Plus className="h-4 w-4" />New List</Button>}
      />
      {lists.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <Link key={list.id} to={`/lists/${list.id}`}>
              <Card className="hover:shadow-lg hover:border-border transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{list.name}</CardTitle>
                    <Badge variant={list.type === "dynamic" ? "accent" : "secondary"}>{list.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{list.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{list.companyCount}</span>
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" />{list.contactCount}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon={List} title="No lists yet" description="Create lists to organize your prospects." action={<Button><Plus className="h-4 w-4" />Create List</Button>} />
      )}
    </PageContainer>
  );
}
