import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Users,
  Sparkles,
  Target,
  Search,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-accent to-info flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-semibold text-lg">Prospect</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm">
              Features
            </Button>
            <Button variant="ghost" size="sm">
              Pricing
            </Button>
            <Button variant="ghost" size="sm">
              Company
            </Button>
            <Link to="/ui-kit">
              <Button variant="ghost" size="sm">
                UI Kit
              </Button>
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
            <Button size="sm">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-24 md:py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="accent" className="mb-6">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered Prospecting
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Find your ideal
                <span className="text-accent-gradient"> customers</span>
                <br />
                10x faster
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                AI-powered ICP generation and company discovery. Stop guessing,
                start closing. Build targeted prospect lists in minutes, not weeks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="xl" variant="outline">
                  Watch Demo
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-border/50 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "50M+", label: "Companies indexed" },
                { value: "500+", label: "Data points per company" },
                { value: "95%", label: "Email accuracy" },
                { value: "10x", label: "Faster prospecting" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Everything you need to find
                <br />
                and close your ideal customers
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From AI-powered ICP generation to real-time buying signals,
                we've got you covered.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Target}
                title="AI ICP Generation"
                description="Let AI analyze your best customers and automatically generate your ideal customer profile with firmographic and technographic criteria."
              />
              <FeatureCard
                icon={Search}
                title="Smart Company Search"
                description="Search through 50M+ companies with advanced filters. Find companies matching your ICP in seconds, not hours."
              />
              <FeatureCard
                icon={TrendingUp}
                title="Buying Signals"
                description="Track hiring, funding, technology changes, and more. Know exactly when prospects are ready to buy."
              />
              <FeatureCard
                icon={Users}
                title="Contact Discovery"
                description="Find decision-makers with verified email addresses. 95% email accuracy with real-time verification."
              />
              <FeatureCard
                icon={BarChart3}
                title="Prospect Scoring"
                description="AI-powered scoring ranks companies by fit and intent. Focus on the opportunities most likely to close."
              />
              <FeatureCard
                icon={Shield}
                title="Data Compliance"
                description="GDPR and CCPA compliant data sourcing. Enterprise-grade security for peace of mind."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <Card className="bg-gradient-to-br from-accent/5 via-background to-info/5 border-accent/20">
              <CardContent className="p-12 md:p-16 text-center">
                <Badge variant="accent" className="mb-6">
                  Ready to get started?
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Start finding your ideal customers today
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                  Join 1,000+ sales teams using Prospect to build pipeline faster
                  than ever before.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="xl" variant="accent">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button size="xl" variant="outline">
                    Talk to Sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-accent to-info flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="font-semibold">Prospect</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Security
              </a>
              <Link
                to="/ui-kit"
                className="hover:text-foreground transition-colors"
              >
                UI Kit
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Prospect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card className="group hover:shadow-lg hover:border-border transition-all duration-200">
      <CardHeader>
        <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
          <Icon className="h-6 w-6 text-accent" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default Index;
