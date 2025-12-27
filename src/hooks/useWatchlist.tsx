import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "sonner";
import { companies } from "@/mock/data";
import type { Company, Signal } from "@/types";

const MAX_WATCHLIST_SIZE = 10;
const WATCHLIST_STORAGE_KEY = "watchlist_companies";

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
  addToWatchlist: (companyId: string) => Promise<boolean>;
  removeFromWatchlist: (companyId: string) => Promise<void>;
  isInWatchlist: (companyId: string) => boolean;
  canAdd: boolean;
  isLoading: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

// Simulate network delay
const delay = (min = 200, max = 600) =>
  new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));

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

function getStoredWatchlist(): WatchlistCompany[] {
  try {
    const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt),
        signals: item.signals.map((s: any) => ({
          ...s,
          detectedAt: new Date(s.detectedAt),
        })),
        company: {
          ...item.company,
          lastUpdated: new Date(item.company.lastUpdated),
        },
      }));
    }
  } catch (e) {
    console.error("Failed to parse watchlist:", e);
  }
  return [];
}

function persistWatchlist(watchlist: WatchlistCompany[]) {
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
}

// Initialize with some mock data
function initializeWatchlist(): WatchlistCompany[] {
  const stored = getStoredWatchlist();
  if (stored.length > 0) return stored;
  
  const initialCompanies = companies.slice(0, 3);
  const initial = initialCompanies.map(company => ({
    company,
    addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    signals: generateMockSignals(company.id),
    whyItMatters: generateWhyItMatters(company),
  }));
  
  persistWatchlist(initial);
  return initial;
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWatchlist(initializeWatchlist());
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Persist whenever watchlist changes
  useEffect(() => {
    if (!isLoading) {
      persistWatchlist(watchlist);
    }
  }, [watchlist, isLoading]);

  const addToWatchlist = useCallback(async (companyId: string): Promise<boolean> => {
    if (watchlist.length >= MAX_WATCHLIST_SIZE) {
      toast.error("Watchlist limit reached", {
        description: "Remove a company to add another.",
        action: {
          label: "Manage",
          onClick: () => (window.location.href = "/watchlist"),
        },
      });
      return false;
    }

    if (watchlist.some(w => w.company.id === companyId)) {
      toast.info("Already watching", {
        description: "This company is already in your watchlist.",
      });
      return false;
    }

    const company = companies.find(c => c.id === companyId);
    if (!company) return false;

    // Optimistic update
    const newItem: WatchlistCompany = {
      company,
      addedAt: new Date(),
      signals: generateMockSignals(companyId),
      whyItMatters: generateWhyItMatters(company),
    };

    setWatchlist(prev => [newItem, ...prev]);

    toast.success("Added to watchlist", {
      description: `${company.name} is now being monitored.`,
    });

    // Simulate API call
    await delay();

    return true;
  }, [watchlist]);

  const removeFromWatchlist = useCallback(async (companyId: string): Promise<void> => {
    const item = watchlist.find(w => w.company.id === companyId);
    
    // Optimistic update
    setWatchlist(prev => prev.filter(w => w.company.id !== companyId));

    if (item) {
      toast.success("Removed from watchlist", {
        description: item.company.name,
        action: {
          label: "Undo",
          onClick: () => {
            setWatchlist(prev => [item, ...prev]);
            toast.success("Restored", { description: item.company.name });
          },
        },
      });
    }

    // Simulate API call
    await delay();
  }, [watchlist]);

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
        isLoading,
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
