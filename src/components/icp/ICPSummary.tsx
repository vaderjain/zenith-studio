import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Globe,
  Zap,
  XCircle,
  Tag,
  TrendingUp,
  HelpCircle,
  Edit3,
  Save,
  Search,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import type { ICPData } from "@/mock/icp";

interface ICPSummaryProps {
  data: ICPData;
  productName?: string;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
  onSave?: (data: ICPData) => void;
}

export function ICPSummary({
  data,
  productName = "Your Product",
  showActions = true,
  compact = false,
  className,
  onSave,
}: ICPSummaryProps) {
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<ICPData>(data);

  const handleSave = () => {
    onSave?.(editData);
    setEditDialogOpen(false);
    toast.success("ICP saved successfully");
  };

  const handleNewSearch = () => {
    navigate("/find?relevant=true");
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Card className={cn("overflow-hidden", className)}>
        {/* Header */}
        <div className="bg-gradient-to-br from-accent/5 via-background to-info/5 px-6 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">{productName} — ICP</h3>
                <p className="text-sm text-muted-foreground">
                  Ideal Customer Profile
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="accent" className="gap-1.5">
                <span className="font-semibold">{data.confidenceScore}%</span>
                <span className="text-xs opacity-80">confidence</span>
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className={cn("p-6", compact && "p-4")}>
          <div className={cn(
            "grid gap-6",
            compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}>
            {/* Industries */}
            <ICPSection
              icon={Building2}
              title="Ideal Industries"
              values={data.industries.values}
              reasoning={data.industries.reasoning}
              compact={compact}
            />

            {/* Company Sizes */}
            <ICPSection
              icon={Users}
              title="Company Size"
              values={data.companySizes.values}
              reasoning={data.companySizes.reasoning}
              suffix="employees"
              compact={compact}
            />

            {/* Regions */}
            <ICPSection
              icon={Globe}
              title="Regions"
              values={data.regions.values}
              reasoning={data.regions.reasoning}
              compact={compact}
            />

            {/* Tech Signals */}
            <ICPSection
              icon={Zap}
              title="Tech Signals"
              values={data.techSignals.values}
              reasoning={data.techSignals.reasoning}
              variant="info"
              compact={compact}
            />

            {/* Disqualifiers */}
            <ICPSection
              icon={XCircle}
              title="Disqualifiers"
              values={data.disqualifiers.values}
              reasoning={data.disqualifiers.reasoning}
              variant="destructive"
              compact={compact}
            />

            {/* Keywords */}
            <ICPSection
              icon={Tag}
              title="Keywords"
              values={data.keywords.values}
              reasoning={data.keywords.reasoning}
              compact={compact}
            />
          </div>

          {/* Buying Signals - Full width */}
          {!compact && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <ICPSection
                icon={TrendingUp}
                title="Buying Signals"
                values={data.buyingSignals.values}
                reasoning={data.buyingSignals.reasoning}
                variant="success"
                horizontal
              />
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border/50">
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit ICP
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Ideal Customer Profile</DialogTitle>
                    <DialogDescription>
                      Refine your ICP to improve prospect matching. Changes update in real-time.
                    </DialogDescription>
                  </DialogHeader>
                  <ICPEditForm
                    data={editData}
                    onChange={setEditData}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="gap-2" onClick={() => {
                toast.success("ICP saved to your workspace");
              }}>
                <Save className="h-4 w-4" />
                Save ICP
              </Button>

              <Button onClick={handleNewSearch} className="gap-2 ml-auto">
                <Search className="h-4 w-4" />
                New Search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

interface ICPSectionProps {
  icon: React.ElementType;
  title: string;
  values: string[];
  reasoning: string;
  suffix?: string;
  variant?: "default" | "info" | "success" | "destructive";
  horizontal?: boolean;
  compact?: boolean;
}

function ICPSection({
  icon: Icon,
  title,
  values,
  reasoning,
  suffix,
  variant = "default",
  horizontal = false,
  compact = false,
}: ICPSectionProps) {
  const variantStyles = {
    default: "bg-secondary text-secondary-foreground",
    info: "bg-info/10 text-info border-info/20",
    success: "bg-success/10 text-success border-success/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className={cn("space-y-2", horizontal && "flex items-start gap-4")}>
      <div className={cn(
        "flex items-center gap-2",
        horizontal && "flex-shrink-0 min-w-[140px]"
      )}>
        <Icon className={cn(
          "h-4 w-4",
          variant === "info" && "text-info",
          variant === "success" && "text-success",
          variant === "destructive" && "text-destructive",
          variant === "default" && "text-muted-foreground"
        )} />
        <span className="text-sm font-medium">{title}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="max-w-sm p-3 text-sm leading-relaxed"
          >
            <p className="font-medium mb-1.5 text-foreground">Why this?</p>
            <p className="text-muted-foreground">{reasoning}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className={cn(
        "flex flex-wrap gap-1.5",
        horizontal && "flex-1"
      )}>
        {values.map((value) => (
          <Badge
            key={value}
            variant="outline"
            className={cn(
              "text-xs font-normal",
              variantStyles[variant],
              compact && "text-[11px] px-1.5 py-0.5"
            )}
          >
            {value}
            {suffix && <span className="opacity-70 ml-1">{suffix}</span>}
          </Badge>
        ))}
      </div>
    </div>
  );
}

interface ICPEditFormProps {
  data: ICPData;
  onChange: (data: ICPData) => void;
}

function ICPEditForm({ data, onChange }: ICPEditFormProps) {
  const updateField = (
    field: keyof ICPData,
    values: string[]
  ) => {
    if (field === "confidenceScore") return;
    onChange({
      ...data,
      [field]: {
        ...(data[field] as { values: string[]; reasoning: string }),
        values,
      },
    });
  };

  const parseValues = (text: string): string[] => {
    return text
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  };

  return (
    <div className="grid gap-6 py-4">
      {/* Live Preview */}
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Live Preview
        </p>
        <div className="flex flex-wrap gap-2">
          {data.industries.values.slice(0, 2).map((v) => (
            <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>
          ))}
          {data.companySizes.values.slice(0, 1).map((v) => (
            <Badge key={v} variant="outline" className="text-xs">{v} employees</Badge>
          ))}
          {data.regions.values.slice(0, 1).map((v) => (
            <Badge key={v} variant="outline" className="text-xs">{v}</Badge>
          ))}
          <Badge variant="muted" className="text-xs">
            +{data.techSignals.values.length} tech signals
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Industries */}
        <div className="space-y-2">
          <Label htmlFor="industries" className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Industries
          </Label>
          <Textarea
            id="industries"
            placeholder="SaaS, FinTech, Developer Tools..."
            value={data.industries.values.join(", ")}
            onChange={(e) => updateField("industries", parseValues(e.target.value))}
            rows={2}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">Comma-separated list</p>
        </div>

        {/* Company Sizes */}
        <div className="space-y-2">
          <Label htmlFor="sizes" className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            Company Sizes
          </Label>
          <Textarea
            id="sizes"
            placeholder="51-200, 201-500..."
            value={data.companySizes.values.join(", ")}
            onChange={(e) => updateField("companySizes", parseValues(e.target.value))}
            rows={2}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">Employee count ranges</p>
        </div>

        {/* Regions */}
        <div className="space-y-2">
          <Label htmlFor="regions" className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            Regions
          </Label>
          <Textarea
            id="regions"
            placeholder="North America, Europe..."
            value={data.regions.values.join(", ")}
            onChange={(e) => updateField("regions", parseValues(e.target.value))}
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Tech Signals */}
        <div className="space-y-2">
          <Label htmlFor="tech" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            Tech Signals
          </Label>
          <Textarea
            id="tech"
            placeholder="AWS, React, Kubernetes..."
            value={data.techSignals.values.join(", ")}
            onChange={(e) => updateField("techSignals", parseValues(e.target.value))}
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Disqualifiers */}
        <div className="space-y-2">
          <Label htmlFor="disqualifiers" className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-muted-foreground" />
            Disqualifiers
          </Label>
          <Textarea
            id="disqualifiers"
            placeholder="Legacy systems, No engineering team..."
            value={data.disqualifiers.values.join(", ")}
            onChange={(e) => updateField("disqualifiers", parseValues(e.target.value))}
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label htmlFor="keywords" className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            Keywords
          </Label>
          <Textarea
            id="keywords"
            placeholder="digital transformation, DevOps..."
            value={data.keywords.values.join(", ")}
            onChange={(e) => updateField("keywords", parseValues(e.target.value))}
            rows={2}
            className="resize-none"
          />
        </div>
      </div>

      {/* Buying Signals - Full width */}
      <div className="space-y-2">
        <Label htmlFor="signals" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          Buying Signals
        </Label>
        <Textarea
          id="signals"
          placeholder="Recent funding, Hiring engineers, New CTO..."
          value={data.buyingSignals.values.join(", ")}
          onChange={(e) => updateField("buyingSignals", parseValues(e.target.value))}
          rows={2}
          className="resize-none"
        />
      </div>
    </div>
  );
}

export default ICPSummary;
