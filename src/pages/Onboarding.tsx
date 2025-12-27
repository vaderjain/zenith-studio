import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { PageContainer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const steps = [
  { id: 1, title: "Product Info", description: "Tell us about your product" },
  { id: 2, title: "Target Market", description: "Define your ideal customers" },
  { id: 3, title: "Generate ICP", description: "AI creates your ICP" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate ICP
      setIsGenerating(true);
    }
  };

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => navigate("/find"), 500);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isGenerating, navigate]);

  return (
    <PageContainer className="max-w-3xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-colors ${
                  currentStep > step.id
                    ? "bg-accent border-accent text-accent-foreground"
                    : currentStep === step.id
                    ? "border-accent text-accent"
                    : "border-border text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block w-24 lg:w-32 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-accent" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-muted-foreground">
            {steps[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  placeholder="e.g., CloudSync Pro"
                  defaultValue="CloudSync Pro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your product does..."
                  rows={4}
                  defaultValue="Enterprise-grade file synchronization and collaboration platform for distributed teams"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  placeholder="https://yourproduct.com"
                  defaultValue="https://cloudsync.example.com"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Target Industries</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Finance"
                  defaultValue="Technology, Financial Services, Healthcare"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-size">Company Size</Label>
                <Input
                  id="company-size"
                  placeholder="e.g., 50-500 employees"
                  defaultValue="500-5000 employees"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pain-points">Key Pain Points You Solve</Label>
                <Textarea
                  id="pain-points"
                  placeholder="What problems does your product solve?"
                  rows={3}
                  defaultValue="Data silos across departments, security compliance requirements, slow file access for remote teams"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competitors">Competitors (optional)</Label>
                <Input
                  id="competitors"
                  placeholder="e.g., Competitor A, Competitor B"
                  defaultValue="Dropbox Business, Box, SharePoint"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && !isGenerating && (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Ready to Generate Your ICP
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Our AI will analyze your product and target market to create a
                detailed Ideal Customer Profile.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge variant="secondary">Firmographics</Badge>
                <Badge variant="secondary">Technographics</Badge>
                <Badge variant="secondary">Buyer Personas</Badge>
                <Badge variant="secondary">Buying Signals</Badge>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Generating Your ICP...
              </h3>
              <p className="text-muted-foreground mb-6">
                Please wait while our AI analyzes your input
              </p>
              <Progress value={progress} className="max-w-xs mx-auto" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1 || isGenerating}
        >
          Back
        </Button>
        <Button onClick={handleNext} disabled={isGenerating}>
          {currentStep < 3 ? (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Generate ICP
              <Sparkles className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </PageContainer>
  );
}
