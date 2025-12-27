import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "sonner";
import { companies } from "@/mock/data";
import type { Company, SavedCompany } from "@/types";

const PROSPECTS_STORAGE_KEY = "saved_prospects";

interface ProspectsContextType {
  prospects: SavedCompany[];
  count: number;
  isLoading: boolean;
  addProspect: (companyId: string, notes?: string) => Promise<boolean>;
  removeProspect: (prospectId: string) => Promise<void>;
  updateProspectStage: (prospectId: string, stage: SavedCompany["stage"]) => Promise<void>;
  isProspect: (companyId: string) => boolean;
  getProspect: (companyId: string) => SavedCompany | undefined;
}

const ProspectsContext = createContext<ProspectsContextType | null>(null);

// Simulate network delay
const delay = (min = 200, max = 600) => 
  new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));

function getStoredProspects(): SavedCompany[] {
  try {
    const stored = localStorage.getItem(PROSPECTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Restore Date objects
      return parsed.map((p: any) => ({
        ...p,
        savedAt: new Date(p.savedAt),
        company: {
          ...p.company,
          lastUpdated: new Date(p.company.lastUpdated),
          funding: p.company.funding
            ? { ...p.company.funding, lastRoundDate: p.company.funding.lastRoundDate ? new Date(p.company.funding.lastRoundDate) : undefined }
            : undefined,
        },
      }));
    }
  } catch (e) {
    console.error("Failed to parse prospects:", e);
  }
  return [];
}

function persistProspects(prospects: SavedCompany[]) {
  localStorage.setItem(PROSPECTS_STORAGE_KEY, JSON.stringify(prospects));
}

// Initialize with some demo data if empty
function initializeProspects(): SavedCompany[] {
  const stored = getStoredProspects();
  if (stored.length > 0) return stored;

  // Create initial demo prospects
  const initialProspects: SavedCompany[] = companies.slice(0, 3).map((company, index) => ({
    id: `prospect_${company.id}`,
    workspaceId: "ws_1",
    companyId: company.id,
    company,
    savedBy: "user_1",
    stage: (["new", "researching", "qualified"] as const)[index],
    tags: [],
    savedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    notes: "",
  }));

  persistProspects(initialProspects);
  return initialProspects;
}

export function ProspectsProvider({ children }: { children: ReactNode }) {
  const [prospects, setProspects] = useState<SavedCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setProspects(initializeProspects());
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Persist whenever prospects change
  useEffect(() => {
    if (!isLoading) {
      persistProspects(prospects);
    }
  }, [prospects, isLoading]);

  const addProspect = useCallback(async (companyId: string, notes = ""): Promise<boolean> => {
    // Check if already a prospect
    if (prospects.some((p) => p.companyId === companyId)) {
      toast.info("Already in prospects", {
        description: "This company is already saved.",
      });
      return false;
    }

    const company = companies.find((c) => c.id === companyId);
    if (!company) return false;

    // Optimistic update
    const newProspect: SavedCompany = {
      id: `prospect_${companyId}_${Date.now()}`,
      workspaceId: "ws_1",
      companyId,
      company,
      savedBy: "user_1",
      stage: "new",
      savedAt: new Date(),
      notes,
      tags: [],
    };

    setProspects((prev) => [newProspect, ...prev]);

    toast.success(`Added to prospects`, {
      description: company.name,
      action: {
        label: "View",
        onClick: () => window.location.href = "/prospects",
      },
    });

    // Simulate API call
    await delay();

    return true;
  }, [prospects]);

  const removeProspect = useCallback(async (prospectId: string): Promise<void> => {
    const prospect = prospects.find((p) => p.id === prospectId);
    
    // Optimistic update
    setProspects((prev) => prev.filter((p) => p.id !== prospectId));

    if (prospect) {
      toast.success("Removed from prospects", {
        description: prospect.company.name,
        action: {
          label: "Undo",
          onClick: () => {
            setProspects((prev) => [prospect, ...prev]);
            toast.success("Restored", { description: prospect.company.name });
          },
        },
      });
    }

    // Simulate API call
    await delay();
  }, [prospects]);

  const updateProspectStage = useCallback(async (
    prospectId: string,
    stage: SavedCompany["stage"]
  ): Promise<void> => {
    const prospect = prospects.find((p) => p.id === prospectId);
    const previousStage = prospect?.stage;

    // Optimistic update
    setProspects((prev) =>
      prev.map((p) => (p.id === prospectId ? { ...p, stage } : p))
    );

    if (prospect) {
      toast.success(`Moved to ${stage}`, {
        description: prospect.company.name,
        action: previousStage
          ? {
              label: "Undo",
              onClick: () => {
                setProspects((prev) =>
                  prev.map((p) =>
                    p.id === prospectId ? { ...p, stage: previousStage } : p
                  )
                );
              },
            }
          : undefined,
      });
    }

    // Simulate API call
    await delay();
  }, [prospects]);

  const isProspect = useCallback(
    (companyId: string): boolean => prospects.some((p) => p.companyId === companyId),
    [prospects]
  );

  const getProspect = useCallback(
    (companyId: string): SavedCompany | undefined =>
      prospects.find((p) => p.companyId === companyId),
    [prospects]
  );

  return (
    <ProspectsContext.Provider
      value={{
        prospects,
        count: prospects.length,
        isLoading,
        addProspect,
        removeProspect,
        updateProspectStage,
        isProspect,
        getProspect,
      }}
    >
      {children}
    </ProspectsContext.Provider>
  );
}

export function useProspects() {
  const context = useContext(ProspectsContext);
  if (!context) {
    throw new Error("useProspects must be used within ProspectsProvider");
  }
  return context;
}
