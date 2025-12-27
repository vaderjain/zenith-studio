import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "sonner";
import { workspaces, members } from "@/mock/data";
import type { Workspace, Member } from "@/types";

const AUTH_STORAGE_KEY = "app_auth_state";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  workspace: Workspace | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchWorkspace: (workspaceId: string) => void;
}

const defaultAuthState: AuthState = {
  user: null,
  workspace: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | null>(null);

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user credentials (in real app, this would be backend auth)
const mockCredentials = [
  { email: "sarah@acme.com", password: "demo123", memberId: "member_1" },
  { email: "marcus@acme.com", password: "demo123", memberId: "member_2" },
  { email: "emily@acme.com", password: "demo123", memberId: "member_3" },
];

function getPersistedAuth(): { userId: string; workspaceId: string } | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse auth state:", e);
  }
  return null;
}

function persistAuth(userId: string, workspaceId: string) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ userId, workspaceId }));
}

function clearPersistedAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultAuthState);

  // Initialize from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      await delay(300); // Simulate checking session
      
      const persisted = getPersistedAuth();
      if (persisted) {
        const member = members.find((m) => m.userId === persisted.userId);
        const workspace = workspaces.find((w) => w.id === persisted.workspaceId);
        
        if (member && workspace) {
          setState({
            user: {
              id: member.userId,
              email: member.email,
              name: member.name,
              avatarUrl: member.avatarUrl,
              role: member.role,
            },
            workspace,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }
      
      // Default: Auto-login as Sarah for demo purposes
      const defaultMember = members[0];
      const defaultWorkspace = workspaces[0];
      
      setState({
        user: {
          id: defaultMember.userId,
          email: defaultMember.email,
          name: defaultMember.name,
          avatarUrl: defaultMember.avatarUrl,
          role: defaultMember.role,
        },
        workspace: defaultWorkspace,
        isAuthenticated: true,
        isLoading: false,
      });
      
      persistAuth(defaultMember.userId, defaultWorkspace.id);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    await delay(800 + Math.random() * 400); // Realistic latency
    
    const credential = mockCredentials.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    
    if (!credential) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error("Invalid credentials", {
        description: "Please check your email and password.",
      });
      return false;
    }
    
    const member = members.find((m) => m.id === credential.memberId);
    const workspace = workspaces[0];
    
    if (!member) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
    
    setState({
      user: {
        id: member.userId,
        email: member.email,
        name: member.name,
        avatarUrl: member.avatarUrl,
        role: member.role,
      },
      workspace,
      isAuthenticated: true,
      isLoading: false,
    });
    
    persistAuth(member.userId, workspace.id);
    
    toast.success(`Welcome back, ${member.name.split(" ")[0]}!`, {
      description: `Logged into ${workspace.name}`,
    });
    
    return true;
  }, []);

  const logout = useCallback(() => {
    clearPersistedAuth();
    setState({
      user: null,
      workspace: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.success("Logged out successfully");
  }, []);

  const switchWorkspace = useCallback((workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace && state.user) {
      setState((prev) => ({ ...prev, workspace }));
      persistAuth(state.user.id, workspaceId);
      toast.success(`Switched to ${workspace.name}`);
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        switchWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
