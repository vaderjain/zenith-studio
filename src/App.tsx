import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { WatchlistProvider } from "@/hooks/useWatchlist";
import { ProspectsProvider } from "@/hooks/useProspects";
import { ListsProvider } from "@/hooks/useLists";
import { CommandPalette } from "@/components/CommandPalette";

import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import FindProspects from "./pages/FindProspects";
import CompanyDetail from "./pages/CompanyDetail";
import MyProspects from "./pages/MyProspects";
import Lists from "./pages/Lists";
import ListDetail from "./pages/ListDetail";
import WatchlistPage from "./pages/Watchlist";
import Signals from "./pages/Signals";
import Workspace from "./pages/Workspace";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import UIKit from "./pages/UIKit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout wrapper for app pages
function AppPages() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/find" element={<FindProspects />} />
        <Route path="/company/:id" element={<CompanyDetail />} />
        <Route path="/prospects" element={<MyProspects />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/lists/:id" element={<ListDetail />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/signals" element={<Signals />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={200}>
      <AuthProvider>
        <WatchlistProvider>
          <ProspectsProvider>
            <ListsProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <CommandPalette />
                <Routes>
                  <Route path="/landing" element={<Index />} />
                  <Route path="/ui-kit" element={<UIKit />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/*" element={<AppPages />} />
                </Routes>
              </BrowserRouter>
            </ListsProvider>
          </ProspectsProvider>
        </WatchlistProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
