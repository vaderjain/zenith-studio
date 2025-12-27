import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { companies } from "@/mock/data";
import type { Company, Signal } from "@/types";

const MAX_WATCHLIST_SIZE = 10;

interface WatchlistCompany {
  company: Company;
  addedAt: Date;
  signals: Signal[];
  whyItMatters: string;
}

interface WatchlistContextType {
  watchlist: WatchlistCompany[];
  count: number;
  maxSize: number;
  addToWatchlist: (companyId: string) => boolean;
  removeFromWatchlist: (companyId: string) => void;
  isInWatchlist: (companyId: string) => boolean;
  canAdd: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

// Generate mock signals for demo
const generateMockSignals = (companyId: string): Signal[] => {
  const signalTypes: Signal['type'][] = ['funding', 'hiring', 'technology', 'growth', 'intent', 'news'];
  const signalTitles: Record<Signal['type'], string[]> = {
    funding: ['New funding round announced', 'Series B closed', 'Raised capital'],
    hiring: ['Hiring surge detected', 'VP Engineering role posted', 'Team expansion'],
    technology: ['Tech stack change', 'New integration added', 'Cloud migration'],
    growth: ['Revenue milestone', 'New market expansion', 'Customer growth'],
    intent: ['Website traffic spike', 'Demo requests up', 'Content engagement'],
    news: ['Press coverage', 'Industry mention', 'Partnership announced'],
  };

  const numSignals = Math.floor(Math.random() * 3) + 1;
  const signals: Signal[] = [];

  for (let i = 0; i < numSignals; i++) {
    const type = signalTypes[Math.floor(Math.random() * signalTypes.length)];
    const titles = signalTitles[type];
    signals.push({
      id: `signal_${companyId}_${i}`,
      companyId,
      type,
      title: titles[Math.floor(Math.random() * titles.length)],
      description: 'Recent activity detected based on your configured alert settings.',
      strength: ['weak', 'moderate', 'strong'][Math.floor(Math.random() * 3)] as Signal['strength'],
      source: ['LinkedIn', 'TechCrunch', 'Press Release', 'Company Blog'][Math.floor(Math.random() * 4)],
      detectedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    });
  }

  return signals;
};

const generateWhyItMatters = (company: Company): string => {
  const reasons = [
    `High ICP score of ${company.icpScore}% indicates strong fit.`,
    `Recent ${company.type === 'startup' ? 'funding activity' : 'growth signals'} suggest buying intent.`,
    `Technology stack aligns with your offering.`,
    `${company.employeeRange} employees in target market segment.`,
    `Active hiring indicates expansion budget.`,
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
};

// Initialize with some mock data
const initializeWatchlist = (): WatchlistCompany[] => {
  const initialCompanies = companies.slice(0, 7);
  return initialCompanies.map(company => ({
    company,
    addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    signals: generateMockSignals(company.id),
    whyItMatters: generateWhyItMatters(company),
  }));
};

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistCompany[]>(initializeWatchlist);

  const addToWatchlist = useCallback((companyId: string): boolean => {
    if (watchlist.length >= MAX_WATCHLIST_SIZE) {
      toast({
        title: "Watchlist limit reached (10)",
        description: "Remove a company to add another.",
        variant: "destructive",
        action: (
          <a href="/watchlist" className="underline text-sm font-medium">
            Manage watchlist
          </a>
        ),
      });
      return false;
    }

    if (watchlist.some(w => w.company.id === companyId)) {
      toast({
        title: "Already in watchlist",
        description: "This company is already being watched.",
      });
      return false;
    }

    const company = companies.find(c => c.id === companyId);
    if (!company) return false;

    setWatchlist(prev => [
      ...prev,
      {
        company,
        addedAt: new Date(),
        signals: generateMockSignals(companyId),
        whyItMatters: generateWhyItMatters(company),
      },
    ]);

    toast({
      title: "Added to watchlist",
      description: `${company.name} is now being monitored for signals.`,
    });
    return true;
  }, [watchlist]);

  const removeFromWatchlist = useCallback((companyId: string) => {
    setWatchlist(prev => {
      const company = prev.find(w => w.company.id === companyId);
      if (company) {
        toast({
          title: "Removed from watchlist",
          description: `${company.company.name} has been removed.`,
        });
      }
      return prev.filter(w => w.company.id !== companyId);
    });
  }, []);

  const isInWatchlist = useCallback((companyId: string): boolean => {
    return watchlist.some(w => w.company.id === companyId);
  }, [watchlist]);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        count: watchlist.length,
        maxSize: MAX_WATCHLIST_SIZE,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        canAdd: watchlist.length < MAX_WATCHLIST_SIZE,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }
  return context;
}
