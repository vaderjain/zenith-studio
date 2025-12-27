import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Package,
  MessageSquareText,
  Target,
  CheckCircle2,
  Sparkles,
  Globe,
  Zap,
  Play,
  Check,
} from "lucide-react";

import { PageContainer } from "@/components/layout";
import { ICPSummary } from "@/components/icp";
import { getICPData } from "@/mock/icp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Step definitions
const steps = [
  { id: 1, title: "Workspace", icon: Building2, description: "Set up your workspace" },
  { id: 2, title: "Product", icon: Package, description: "Tell us about your product" },
  { id: 3, title: "Your Words", icon: MessageSquareText, description: "Describe your ideal customer" },
  { id: 4, title: "Preferences", icon: Target, description: "Fine-tune your targeting" },
  { id: 5, title: "Review", icon: CheckCircle2, description: "Confirm your details" },
];

// Form data interface
interface OnboardingData {
  // Step 1: Workspace
  workspaceName: string;
  domain: string;
  
  // Step 2: Product
  productName: string;
  category: string;
  targetBuyer: string;
  pricing: string;
  differentiators: string;
  region: string;
  competitors: string;
  
  // Step 3: Your Words
  idealCustomerDescription: string;
  
  // Step 4: Preferences
  segment: "startups" | "enterprise" | "both";
  startupWeight: number;
  enterpriseWeight: number;
  
  // Generated ICP
  icpGenerated: boolean;
}

const initialData: OnboardingData = {
  workspaceName: "",
  domain: "",
  productName: "",
  category: "",
  targetBuyer: "",
  pricing: "",
  differentiators: "",
  region: "",
  competitors: "",
  idealCustomerDescription: "",
  segment: "both",
  startupWeight: 50,
  enterpriseWeight: 50,
  icpGenerated: false,
};

const categoryOptions = [
  "SaaS / Software",
  "Developer Tools",
  "Marketing Tech",
  "Sales Tech",
  "HR Tech",
  "FinTech",
  "HealthTech",
  "E-commerce",
  "Cybersecurity",
  "Data & Analytics",
  "Other",
];

const buyerOptions = [
  "C-Suite (CEO, CTO, CFO)",
  "VP / Director",
  "Engineering / IT",
  "Marketing",
  "Sales",
  "Operations",
  "Product",
  "HR / People",
  "Finance",
];

const pricingOptions = [
  "Free / Freemium",
  "< $100/mo",
  "$100 - $500/mo",
  "$500 - $2,000/mo",
  "$2,000 - $10,000/mo",
  "$10,000+/mo",
  "Custom / Enterprise",
];

const regionOptions = [
  "Global",
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East & Africa",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showICP, setShowICP] = useState(false);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.workspaceName.trim().length > 0;
      case 2:
        return data.productName.trim().length > 0 && data.category.length > 0;
      case 3:
        return data.idealCustomerDescription.trim().length > 20;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      generateICP();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateICP = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI generation
    const progressSteps = [
      { progress: 15, delay: 400 },
      { progress: 35, delay: 600 },
      { progress: 55, delay: 500 },
      { progress: 75, delay: 700 },
      { progress: 90, delay: 400 },
      { progress: 100, delay: 300 },
    ];

    for (const step of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      setGenerationProgress(step.progress);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsGenerating(false);
    setShowICP(true);
    updateData({ icpGenerated: true });
  };

  const handleRunSearch = () => {
    navigate("/find?relevant=true");
  };

  // Show ICP result screen
  if (showICP) {
    return <ICPResultScreen data={data} onRunSearch={handleRunSearch} />;
  }

  // Show generating screen
  if (isGenerating) {
    return <GeneratingScreen progress={generationProgress} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-info flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-semibold">Set up your workspace</h1>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              Skip for now
            </Button>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  disabled={step.id > currentStep}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300",
                    step.id === currentStep
                      ? "opacity-100"
                      : step.id < currentStep
                      ? "opacity-70 hover:opacity-100"
                      : "opacity-40"
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                      step.id === currentStep
                        ? "bg-accent text-accent-foreground scale-110"
                        : step.id < currentStep
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.id < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden sm:block text-sm transition-colors",
                      step.id === currentStep
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 transition-colors duration-300",
                      step.id < currentStep ? "bg-accent/50" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="animate-fade-in">
          {currentStep === 1 && (
            <Step1Workspace data={data} updateData={updateData} />
          )}
          {currentStep === 2 && (
            <Step2Product data={data} updateData={updateData} />
          )}
          {currentStep === 3 && (
            <Step3YourWords data={data} updateData={updateData} />
          )}
          {currentStep === 4 && (
            <Step4Preferences data={data} updateData={updateData} />
          )}
          {currentStep === 5 && <Step5Review data={data} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 min-w-[140px]"
            size="lg"
          >
            {currentStep === 5 ? (
              <>
                Generate ICP
                <Sparkles className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Step 1: Workspace Basics
function Step1Workspace({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Building2 className="h-8 w-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Let's set up your workspace
        </h2>
        <p className="text-muted-foreground">
          This is where your team will collaborate on prospecting
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="workspace-name" className="text-base">
            Workspace Name
          </Label>
          <Input
            id="workspace-name"
            placeholder="e.g., Acme Corp"
            value={data.workspaceName}
            onChange={(e) => updateData({ workspaceName: e.target.value })}
            className="h-12 text-base"
          />
          <p className="text-sm text-muted-foreground">
            Usually your company name
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain" className="text-base">
            Company Domain
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="domain"
              placeholder="acme.com"
              value={data.domain}
              onChange={(e) => updateData({ domain: e.target.value })}
              className="h-12 text-base pl-11"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            We'll use this to find your company info
          </p>
        </div>
      </div>
    </div>
  );
}

// Step 2: Product Input
function Step2Product({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Tell us about your product
        </h2>
        <p className="text-muted-foreground">
          This helps us understand who would be the best fit
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name *</Label>
            <Input
              id="product-name"
              placeholder="e.g., CloudSync Pro"
              value={data.productName}
              onChange={(e) => updateData({ productName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={data.category}
              onValueChange={(v) => updateData({ category: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Target Buyer</Label>
            <Select
              value={data.targetBuyer}
              onValueChange={(v) => updateData({ targetBuyer: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Who buys?" />
              </SelectTrigger>
              <SelectContent>
                {buyerOptions.map((buyer) => (
                  <SelectItem key={buyer} value={buyer}>
                    {buyer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Typical Pricing</Label>
            <Select
              value={data.pricing}
              onValueChange={(v) => updateData({ pricing: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Price range" />
              </SelectTrigger>
              <SelectContent>
                {pricingOptions.map((price) => (
                  <SelectItem key={price} value={price}>
                    {price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="differentiators">Key Differentiators</Label>
          <Textarea
            id="differentiators"
            placeholder="What makes your product unique? What problems do you solve better than anyone else?"
            value={data.differentiators}
            onChange={(e) => updateData({ differentiators: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Region</Label>
            <Select
              value={data.region}
              onValueChange={(v) => updateData({ region: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="competitors">Competitors</Label>
            <Input
              id="competitors"
              placeholder="e.g., Competitor A, Competitor B"
              value={data.competitors}
              onChange={(e) => updateData({ competitors: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 3: Your Words
function Step3YourWords({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}) {
  const charCount = data.idealCustomerDescription.length;
  const minChars = 20;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <MessageSquareText className="h-8 w-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Describe your ideal customer
        </h2>
        <p className="text-muted-foreground">
          Tell us in your own words — our AI will interpret this
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base">
            Who is your perfect customer?
          </Label>
          <Textarea
            id="description"
            placeholder="Example: We sell best to fast-growing B2B SaaS companies with 50-500 employees who have recently raised Series A or B funding. They typically have a VP of Engineering or CTO who cares about developer productivity and is frustrated with their current tooling. They're usually based in the US or Europe and are actively hiring engineers..."
            value={data.idealCustomerDescription}
            onChange={(e) =>
              updateData({ idealCustomerDescription: e.target.value })
            }
            rows={8}
            className="text-base leading-relaxed"
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Be as specific as possible — industry, size, tech stack, pain
              points, buying triggers
            </p>
            <span
              className={cn(
                "text-sm",
                charCount < minChars
                  ? "text-muted-foreground"
                  : "text-accent"
              )}
            >
              {charCount} characters
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Tips for better results
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Mention specific industries or verticals you target</li>
            <li>• Include company size ranges (employees, revenue)</li>
            <li>• Describe the typical buyer persona and their challenges</li>
            <li>• Note any technology stacks or tools they commonly use</li>
            <li>• Share what triggers typically lead to a purchase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Step 4: Segment Preferences
function Step4Preferences({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Fine-tune your targeting
        </h2>
        <p className="text-muted-foreground">
          Help us prioritize the right companies for you
        </p>
      </div>

      <div className="space-y-8">
        {/* Segment Selection */}
        <div className="space-y-4">
          <Label className="text-base">Which companies do you target?</Label>
          <RadioGroup
            value={data.segment}
            onValueChange={(v) =>
              updateData({ segment: v as "startups" | "enterprise" | "both" })
            }
            className="grid sm:grid-cols-3 gap-4"
          >
            {[
              {
                value: "startups",
                label: "Startups",
                description: "Seed to Series B, < 500 employees",
                icon: Zap,
              },
              {
                value: "enterprise",
                label: "Enterprise",
                description: "Large organizations, 500+ employees",
                icon: Building2,
              },
              {
                value: "both",
                label: "Both",
                description: "Target all company sizes",
                icon: Target,
              },
            ].map((option) => (
              <label
                key={option.value}
                className={cn(
                  "relative flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                  data.segment === option.value
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  className="sr-only"
                />
                <option.icon
                  className={cn(
                    "h-8 w-8 mb-3",
                    data.segment === option.value
                      ? "text-accent"
                      : "text-muted-foreground"
                  )}
                />
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground text-center mt-1">
                  {option.description}
                </span>
                {data.segment === option.value && (
                  <div className="absolute top-3 right-3">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                )}
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Weighting Sliders */}
        {data.segment === "both" && (
          <div className="space-y-6 p-6 rounded-2xl bg-muted/30 border border-border/50 animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base">Startup vs Enterprise Weight</Label>
                <span className="text-sm text-muted-foreground">
                  Adjust your preference
                </span>
              </div>
              <div className="space-y-4">
                <Slider
                  value={[data.startupWeight]}
                  onValueChange={([v]) =>
                    updateData({
                      startupWeight: v,
                      enterpriseWeight: 100 - v,
                    })
                  }
                  max={100}
                  step={5}
                  className="py-4"
                />
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span>Startups: {data.startupWeight}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Enterprise: {data.enterpriseWeight}%</span>
                    <Building2 className="h-4 w-4 text-info" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 5: Review
function Step5Review({ data }: { data: OnboardingData }) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Review your setup
        </h2>
        <p className="text-muted-foreground">
          Make sure everything looks good before we generate your ICP
        </p>
      </div>

      <div className="space-y-4">
        <ReviewSection
          title="Workspace"
          icon={Building2}
          items={[
            { label: "Name", value: data.workspaceName },
            { label: "Domain", value: data.domain || "Not set" },
          ]}
        />
        <ReviewSection
          title="Product"
          icon={Package}
          items={[
            { label: "Name", value: data.productName },
            { label: "Category", value: data.category },
            { label: "Target Buyer", value: data.targetBuyer || "Not set" },
            { label: "Pricing", value: data.pricing || "Not set" },
            { label: "Region", value: data.region || "Global" },
          ]}
        />
        <ReviewSection
          title="Target Segment"
          icon={Target}
          items={[
            {
              label: "Focus",
              value:
                data.segment === "both"
                  ? `Both (${data.startupWeight}% startups, ${data.enterpriseWeight}% enterprise)`
                  : data.segment.charAt(0).toUpperCase() + data.segment.slice(1),
            },
          ]}
        />
      </div>

      <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-accent mt-0.5" />
          <div>
            <h4 className="font-medium mb-1">Ready to generate your ICP</h4>
            <p className="text-sm text-muted-foreground">
              Our AI will analyze your inputs and create a detailed Ideal
              Customer Profile with firmographics, technographics, and buyer
              personas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ElementType;
  items: { label: string; value: string }[];
}) {
  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 pb-4">
        <div className="grid gap-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Generating Screen
function GeneratingScreen({ progress }: { progress: number }) {
  const stages = [
    { threshold: 0, label: "Analyzing your inputs..." },
    { threshold: 20, label: "Identifying ideal firmographics..." },
    { threshold: 40, label: "Mapping buyer personas..." },
    { threshold: 60, label: "Detecting technology signals..." },
    { threshold: 80, label: "Finalizing your ICP..." },
    { threshold: 95, label: "Almost there..." },
  ];

  const currentStage =
    stages.filter((s) => progress >= s.threshold).pop()?.label || stages[0].label;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-6 text-center">
        <div className="relative mb-8">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-accent to-info flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="h-12 w-12 text-accent-foreground" />
          </div>
          <div className="absolute inset-0 rounded-3xl bg-accent/20 blur-2xl -z-10" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Generating your ICP
        </h2>
        <p className="text-muted-foreground mb-8">{currentStage}</p>

        <div className="relative h-2 rounded-full bg-muted overflow-hidden mb-4">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-info rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
    </div>
  );
}

// ICP Result Screen
function ICPResultScreen({
  data,
  onRunSearch,
}: {
  data: OnboardingData;
  onRunSearch: () => void;
}) {
  const icpData = getICPData();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-success to-accent flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Your ICP is ready!
          </h1>
          <p className="text-lg text-muted-foreground">
            We've analyzed your inputs and created a detailed Ideal Customer
            Profile
          </p>
        </div>

        {/* ICP Summary Component */}
        <ICPSummary
          data={icpData}
          productName={data.productName || "Your Product"}
          showActions={false}
          className="mb-8"
        />

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="xl" onClick={onRunSearch} className="gap-2 min-w-[200px]">
            <Play className="h-5 w-5" />
            Run Search
          </Button>
          <Button size="xl" variant="outline">
            Save & Continue Later
          </Button>
        </div>
      </div>
    </div>
  );
}
