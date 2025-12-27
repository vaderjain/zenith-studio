import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  NodeProps,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Target,
  User,
  Sparkles,
  Network,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import type { Contact, Company } from "@/types";
import { cn } from "@/lib/utils";

// Scoring logic (same as PeopleTab)
interface PoCScore {
  score: number;
  reasoning: string;
}

const generatePoCScore = (contact: Contact): PoCScore => {
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
  };

  const baseScore = seniorityScores[contact.seniority] || 50;
  const deptBonus = departmentBonus[contact.department] || 0;
  const score = Math.min(100, baseScore + deptBonus + Math.floor(Math.random() * 10) - 5);

  const reasoningTemplates = [
    `${contact.fullName} is a strong PoC candidate due to their ${contact.seniority} position in ${contact.department}. Their decision-making authority makes them highly likely to engage.`,
    `Based on their role as ${contact.title}, ${contact.firstName} has direct influence over purchasing decisions in their domain.`,
    `${contact.fullName}'s seniority level indicates budget authority and strategic vision, ideal for your sales motion.`,
  ];

  return {
    score,
    reasoning: reasoningTemplates[Math.floor(Math.random() * reasoningTemplates.length)],
  };
};

interface TeamMemberNode extends Contact {
  pocScore: PoCScore;
  isIdealPoC: boolean;
  [key: string]: unknown; // Index signature for React Flow compatibility
}

// Custom Node Component
function TeamMemberNodeComponent({ data }: NodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const member = data as unknown as TeamMemberNode;
  const isIdealPoC = member.isIdealPoC;

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-accent";
    if (score >= 50) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Top} className="!bg-border" />
      
      <div
        className={cn(
          "px-4 py-3 rounded-xl bg-card border-2 shadow-md transition-all duration-200 min-w-[180px]",
          isIdealPoC
            ? "border-success shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            : "border-border",
          isHovered && "scale-105 shadow-lg z-50"
        )}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-background">
            <AvatarImage src={member.avatarUrl} />
            <AvatarFallback className="text-xs bg-muted">
              {member.firstName[0]}{member.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{member.fullName}</div>
            <div className="text-xs text-muted-foreground truncate">{member.title}</div>
          </div>
          {isIdealPoC && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10">
              <Sparkles className="h-3 w-3 text-success" />
              <span className="text-xs font-semibold text-success">
                {member.pocScore.score}
              </span>
            </div>
          )}
        </div>

        {/* Badge row */}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-[10px] py-0 capitalize">
            {member.seniority === "c-level" ? "C-Level" : member.seniority}
          </Badge>
          <Badge variant="secondary" className="text-[10px] py-0">
            {member.department}
          </Badge>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-border" />

      {/* Hover Card */}
      {isHovered && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[100] animate-in fade-in zoom-in-95 duration-150">
          <Card className="w-72 shadow-xl border-border/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback>
                    {member.firstName[0]}{member.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{member.fullName}</div>
                  <div className="text-sm text-muted-foreground">{member.title}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Target className="h-4 w-4" />
                    Ideal PoC Score
                  </span>
                  <span className={cn("font-bold text-lg", getScoreColor(member.pocScore.score))}>
                    {member.pocScore.score}
                  </span>
                </div>
                <Progress value={member.pocScore.score} className="h-2" />
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-medium text-muted-foreground uppercase">
                  Why this score?
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {member.pocScore.reasoning}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

const nodeTypes = {
  teamMember: TeamMemberNodeComponent,
};

interface TeamTreeProps {
  contacts: Contact[];
  company: Company;
}

// Inner component that uses React Flow hooks
function TeamTreeInner({ contacts, company }: TeamTreeProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  // Build hierarchy and nodes
  const { nodes: initialNodes, edges: initialEdges, hasHierarchy } = useMemo(() => {
    if (contacts.length === 0) {
      return { nodes: [], edges: [], hasHierarchy: false };
    }

    // Enrich with scores
    const enrichedContacts: TeamMemberNode[] = contacts.map((c) => ({
      ...c,
      pocScore: generatePoCScore(c),
      isIdealPoC: false,
    }));

    // Sort by score to find top PoCs
    const sortedByScore = [...enrichedContacts].sort((a, b) => b.pocScore.score - a.pocScore.score);
    const topPoCIds = new Set(sortedByScore.slice(0, 3).map((c) => c.id));

    // Mark ideal PoCs
    enrichedContacts.forEach((c) => {
      c.isIdealPoC = topPoCIds.has(c.id);
    });

    // Create hierarchy based on seniority
    const seniorityOrder = ["c-level", "vp", "director", "manager", "individual"];
    const grouped = seniorityOrder.reduce((acc, level) => {
      acc[level] = enrichedContacts.filter((c) => c.seniority === level);
      return acc;
    }, {} as Record<string, TeamMemberNode[]>);

    // Calculate positions
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeWidth = 220;
    const nodeHeight = 120;
    const levelGap = 150;
    
    let yOffset = 0;
    let prevLevelNodeIds: string[] = [];

    seniorityOrder.forEach((level) => {
      const levelContacts = grouped[level];
      if (levelContacts.length === 0) return;

      const totalWidth = levelContacts.length * nodeWidth + (levelContacts.length - 1) * 40;
      const startX = -totalWidth / 2;

      const currentLevelNodeIds: string[] = [];

      levelContacts.forEach((contact, index) => {
        const nodeId = contact.id;
        currentLevelNodeIds.push(nodeId);

        nodes.push({
          id: nodeId,
          type: "teamMember",
          position: {
            x: startX + index * (nodeWidth + 40),
            y: yOffset,
          },
          data: contact as unknown as Record<string, unknown>,
        });

        // Create edges from previous level
        if (prevLevelNodeIds.length > 0) {
          // Connect to a "parent" from previous level
          // For simplicity, distribute children among parents
          const parentIndex = index % prevLevelNodeIds.length;
          edges.push({
            id: `${prevLevelNodeIds[parentIndex]}-${nodeId}`,
            source: prevLevelNodeIds[parentIndex],
            target: nodeId,
            type: "smoothstep",
            style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
            animated: contact.isIdealPoC,
          });
        }
      });

      prevLevelNodeIds = currentLevelNodeIds;
      yOffset += levelGap;
    });

    const hasHierarchy = nodes.length > 0 && edges.length > 0;

    return { nodes, edges, hasHierarchy };
  }, [contacts]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleRecenter = useCallback(() => {
    fitView({ padding: 0.2, duration: 300 });
  }, [fitView]);

  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Network className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No team data available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We haven't discovered team members for {company.name} yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!hasHierarchy) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <User className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Hierarchy not available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Reporting structure data is missing for this company. 
            Use the list view to see all team members.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-[600px] bg-muted/20">
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => zoomIn({ duration: 200 })}
            className="shadow-md"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => zoomOut({ duration: 200 })}
            className="shadow-md"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleRecenter}
            className="shadow-md"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-lg border border-border/50 p-3 shadow-md">
          <div className="text-xs font-medium text-muted-foreground mb-2">Legend</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded border-2 border-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span>Ideal PoC (Top 3)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded border-2 border-border" />
              <span>Team Member</span>
            </div>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          className="bg-transparent"
        >
          <Background color="hsl(var(--border))" gap={20} size={1} />
        </ReactFlow>
      </div>
    </Card>
  );
}

// Wrapper with Provider
export function TeamTree({ contacts, company }: TeamTreeProps) {
  return (
    <ReactFlowProvider>
      <TeamTreeInner contacts={contacts} company={company} />
    </ReactFlowProvider>
  );
}

export default TeamTree;
