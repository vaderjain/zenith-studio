import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "sonner";
import type { ProspectList } from "@/types";

const LISTS_STORAGE_KEY = "prospect_lists";

interface ListsContextType {
  lists: ProspectList[];
  count: number;
  isLoading: boolean;
  createList: (name: string, description?: string) => Promise<ProspectList>;
  deleteList: (listId: string) => Promise<void>;
  addCompaniesToList: (listId: string, companyIds: string[]) => Promise<void>;
  removeCompanyFromList: (listId: string, companyId: string) => Promise<void>;
  getList: (listId: string) => ProspectList | undefined;
}

const ListsContext = createContext<ListsContextType | null>(null);

const delay = (min = 200, max = 600) =>
  new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));

function getStoredLists(): ProspectList[] {
  try {
    const stored = localStorage.getItem(LISTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((l: any) => ({
        ...l,
        createdAt: new Date(l.createdAt),
        updatedAt: new Date(l.updatedAt),
      }));
    }
  } catch (e) {
    console.error("Failed to parse lists:", e);
  }
  return [];
}

function persistLists(lists: ProspectList[]) {
  localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists));
}

function initializeLists(): ProspectList[] {
  const stored = getStoredLists();
  if (stored.length > 0) return stored;

  // Create initial demo lists
  const initialLists: ProspectList[] = [
    {
      id: "list_1",
      workspaceId: "ws_1",
      name: "Q1 Outreach",
      description: "High-priority prospects for Q1 sales push",
      type: "static",
      companies: ["company_1", "company_2"],
      companyCount: 2,
      contactCount: 5,
      createdBy: "user_1",
      tags: ["priority", "q1"],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "list_2",
      workspaceId: "ws_1",
      name: "Enterprise Targets",
      description: "Large enterprise accounts for strategic outreach",
      type: "static",
      companies: ["company_3"],
      companyCount: 1,
      contactCount: 3,
      createdBy: "user_1",
      tags: ["enterprise"],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  persistLists(initialLists);
  return initialLists;
}

export function ListsProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<ProspectList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLists(initializeLists());
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      persistLists(lists);
    }
  }, [lists, isLoading]);

  const createList = useCallback(async (name: string, description = ""): Promise<ProspectList> => {
    const newList: ProspectList = {
      id: `list_${Date.now()}`,
      workspaceId: "ws_1",
      name,
      description,
      type: "static",
      companies: [],
      companyCount: 0,
      contactCount: 0,
      createdBy: "user_1",
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setLists((prev) => [newList, ...prev]);

    toast.success("List created", {
      description: name,
      action: {
        label: "View",
        onClick: () => (window.location.href = `/lists/${newList.id}`),
      },
    });

    await delay();

    return newList;
  }, []);

  const deleteList = useCallback(async (listId: string): Promise<void> => {
    const list = lists.find((l) => l.id === listId);

    setLists((prev) => prev.filter((l) => l.id !== listId));

    if (list) {
      toast.success("List deleted", {
        description: list.name,
        action: {
          label: "Undo",
          onClick: () => {
            setLists((prev) => [list, ...prev]);
            toast.success("Restored", { description: list.name });
          },
        },
      });
    }

    await delay();
  }, [lists]);

  const addCompaniesToList = useCallback(async (listId: string, companyIds: string[]): Promise<void> => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          const newCompanies = [...new Set([...list.companies, ...companyIds])];
          return {
            ...list,
            companies: newCompanies,
            companyCount: newCompanies.length,
            updatedAt: new Date(),
          };
        }
        return list;
      })
    );

    toast.success(`Added ${companyIds.length} ${companyIds.length > 1 ? "companies" : "company"} to list`);

    await delay();
  }, []);

  const removeCompanyFromList = useCallback(async (listId: string, companyId: string): Promise<void> => {
    const list = lists.find((l) => l.id === listId);

    setLists((prev) =>
      prev.map((l) => {
        if (l.id === listId) {
          const newCompanies = l.companies.filter((id) => id !== companyId);
          return {
            ...l,
            companies: newCompanies,
            companyCount: newCompanies.length,
            updatedAt: new Date(),
          };
        }
        return l;
      })
    );

    toast.success("Removed from list", {
      action: list
        ? {
            label: "Undo",
            onClick: () => {
              setLists((prev) =>
                prev.map((l) => {
                  if (l.id === listId) {
                    return {
                      ...l,
                      companies: [...l.companies, companyId],
                      companyCount: l.companyCount + 1,
                      updatedAt: new Date(),
                    };
                  }
                  return l;
                })
              );
            },
          }
        : undefined,
    });

    await delay();
  }, [lists]);

  const getList = useCallback(
    (listId: string): ProspectList | undefined => lists.find((l) => l.id === listId),
    [lists]
  );

  return (
    <ListsContext.Provider
      value={{
        lists,
        count: lists.length,
        isLoading,
        createList,
        deleteList,
        addCompaniesToList,
        removeCompanyFromList,
        getList,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error("useLists must be used within ListsProvider");
  }
  return context;
}
