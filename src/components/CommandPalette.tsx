import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Building2,
  List,
  Eye,
  Zap,
  Users,
  CreditCard,
  Settings,
  Plus,
  ArrowRight,
  Command,
  FileText,
  TrendingUp,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { companies } from "@/mock/data";

// Navigation commands
const navigationCommands = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", shortcut: "D" },
  { icon: Search, label: "Find Prospects", href: "/find", shortcut: "F" },
  { icon: Building2, label: "My Prospects", href: "/prospects", shortcut: "P" },
  { icon: List, label: "Lists", href: "/lists", shortcut: "L" },
  { icon: Eye, label: "Watchlist", href: "/watchlist", shortcut: "W" },
  { icon: Zap, label: "Signals", href: "/signals", shortcut: "S" },
  { icon: Users, label: "Workspace", href: "/workspace" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

// Quick actions
const quickActions = [
  { icon: Plus, label: "New Search", href: "/find", description: "Start a new prospect search" },
  { icon: List, label: "Create List", href: "/lists", description: "Create a new prospect list" },
  { icon: Eye, label: "Add to Watchlist", href: "/watchlist", description: "Monitor a company" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Listen for keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((href: string) => {
    setOpen(false);
    setSearch("");
    navigate(href);
  }, [navigate]);

  // Filter companies based on search
  const filteredCompanies = search.length > 0
    ? companies.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.industry.toLowerCase().includes(search.toLowerCase()) ||
          c.domain.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search companies, navigate, or take action..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center">
            <Search className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No results found.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Try searching for a company, page, or action.
            </p>
          </div>
        </CommandEmpty>

        {/* Companies - only show when searching */}
        {filteredCompanies.length > 0 && (
          <CommandGroup heading="Companies">
            {filteredCompanies.map((company) => (
              <CommandItem
                key={company.id}
                value={`company-${company.name}`}
                onSelect={() => handleSelect(`/company/${company.id}`)}
                className="gap-3"
              >
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{company.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {company.industry} · {company.employeeRange}
                  </p>
                </div>
                <Badge 
                  variant={company.icpScore >= 85 ? "success" : "secondary"}
                  className="text-xs"
                >
                  {company.icpScore}%
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.label}
              value={action.label}
              onSelect={() => handleSelect(action.href)}
              className="gap-3"
            >
              <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <action.icon className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          {navigationCommands.map((cmd) => (
            <CommandItem
              key={cmd.href}
              value={cmd.label}
              onSelect={() => handleSelect(cmd.href)}
              className="gap-3"
            >
              <cmd.icon className="h-4 w-4 text-muted-foreground" />
              <span>{cmd.label}</span>
              {cmd.shortcut && (
                <CommandShortcut>⌘{cmd.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      
      {/* Footer hint */}
      <div className="border-t p-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium">↑↓</kbd>
          <span>Navigate</span>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium ml-2">↵</kbd>
          <span>Select</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium">Esc</kbd>
          <span>Close</span>
        </div>
      </div>
    </CommandDialog>
  );
}

// Keyboard shortcut hint component
export function CommandPaletteHint({ className }: { className?: string }) {
  return (
    <div className={className}>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span className="text-xs">⌘</span>K
      </kbd>
    </div>
  );
}
