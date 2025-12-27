import { useState, createContext, useContext, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  ChevronDown,
  Plus,
  Menu,
  X,
  Sparkles,
  LogOut,
  User,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Sidebar context for collapse state
interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within AppLayout");
  }
  return context;
}

// Navigation items
const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Find Prospects", icon: Search, href: "/find" },
  { label: "My Prospects", icon: Building2, href: "/prospects" },
  { label: "Lists", icon: List, href: "/lists" },
  { label: "Watchlist", icon: Eye, href: "/watchlist" },
  { label: "Signals", icon: Zap, href: "/signals" },
];

const bottomNav = [
  { label: "Workspace", icon: Users, href: "/workspace" },
  { label: "Billing", icon: CreditCard, href: "/billing" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }}
    >
      <div className="min-h-screen bg-background flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col border-r border-border/50 bg-sidebar transition-all duration-300",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

function SidebarContent() {
  const location = useLocation();
  const { isCollapsed, setIsMobileOpen } = useSidebar();

  const handleNavClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-sidebar-border px-4",
          isCollapsed ? "justify-center" : "gap-3"
        )}
      >
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-accent to-info flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-4 w-4 text-accent-foreground" />
        </div>
        {!isCollapsed && (
          <span className="font-semibold text-lg text-sidebar-foreground">
            Prospect
          </span>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNav.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isActive={
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href)
            }
            isCollapsed={isCollapsed}
            onClick={handleNavClick}
          />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1 border-t border-sidebar-border">
        {bottomNav.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isActive={location.pathname.startsWith(item.href)}
            isCollapsed={isCollapsed}
            onClick={handleNavClick}
          />
        ))}
      </div>
    </div>
  );
}

interface NavItemProps {
  label: string;
  icon: React.ElementType;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

function NavItem({
  label,
  icon: Icon,
  href,
  isActive,
  isCollapsed,
  onClick,
}: NavItemProps) {
  return (
    <Link to={href} onClick={onClick}>
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="truncate">{label}</span>}
      </div>
    </Link>
  );
}

function TopBar() {
  const navigate = useNavigate();
  const { setIsMobileOpen, isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 gap-4">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden lg:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Workspace Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-3">
              <div className="h-6 w-6 rounded-lg bg-accent/10 flex items-center justify-center">
                <Building2 className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="font-medium hidden sm:inline">Acme Corp</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="h-6 w-6 rounded-lg bg-accent/10 flex items-center justify-center mr-2">
                <Building2 className="h-3.5 w-3.5 text-accent" />
              </div>
              Acme Corp
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center mr-2">
                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              Create Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Watchlist Counter */}
        <WatchlistCounter />

        {/* Credit Balance */}
        <Badge
          variant="outline"
          className="hidden sm:flex gap-1.5 px-3 py-1.5 font-medium"
        >
          <Zap className="h-3.5 w-3.5 text-accent" />
          <span>342 credits</span>
        </Badge>

        {/* New Search Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => navigate("/find")}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Search</span>
              <Badge variant="secondary" className="hidden lg:flex ml-0.5 bg-primary-foreground/20 gap-1 text-[10px] px-1.5">
                <Zap className="h-2.5 w-2.5" />
                25
              </Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Run a new search (25 credits)</p>
          </TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-accent rounded-full" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="h-4 w-4 text-accent" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Sarah Chen</span>
                <span className="text-xs font-normal text-muted-foreground">
                  sarah@acme.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/billing")}>
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function WatchlistCounter() {
  const navigate = useNavigate();
  const { count, maxSize } = useWatchlist();
  
  return (
    <Badge
      variant="outline"
      className="hidden sm:flex gap-1.5 px-3 py-1.5 font-medium cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => navigate("/watchlist")}
    >
      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
      <span>Watchlist {count}/{maxSize}</span>
    </Badge>
  );
}
