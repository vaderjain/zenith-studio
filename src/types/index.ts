/**
 * Core TypeScript Types for SaaS Platform
 */

// ============================================
// WORKSPACE & ORGANIZATION
// ============================================

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  plan: Plan;
  members: Member[];
  creditBalance: number;
}

export interface Member {
  id: string;
  userId: string;
  workspaceId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invitedAt: Date;
  joinedAt?: Date;
  status: 'pending' | 'active' | 'suspended';
}

export interface Plan {
  id: string;
  name: 'starter' | 'pro' | 'enterprise';
  displayName: string;
  monthlyCredits: number;
  maxMembers: number;
  maxSearchRuns: number;
  features: string[];
  priceMonthly: number;
  priceYearly: number;
}

export interface CreditLedger {
  id: string;
  workspaceId: string;
  type: 'credit' | 'debit' | 'adjustment' | 'refund';
  amount: number;
  balance: number;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ============================================
// PRODUCT & ICP
// ============================================

export interface ProductProfile {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  website?: string;
  industry: string;
  targetMarket: 'smb' | 'mid-market' | 'enterprise' | 'all';
  painPoints: string[];
  valueProposition: string;
  competitors: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICP {
  id: string;
  productProfileId: string;
  name: string;
  description: string;
  firmographics: {
    industries: string[];
    companySizes: ('1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+')[];
    regions: string[];
    revenue?: { min?: number; max?: number };
  };
  technographics: {
    mustHave: string[];
    niceToHave: string[];
    exclude: string[];
  };
  buyerPersonas: BuyerPersona[];
  signals: SignalDefinition[];
  score: number;
  confidence: 'low' | 'medium' | 'high';
  generatedAt: Date;
}

export interface BuyerPersona {
  id: string;
  title: string;
  seniority: 'c-level' | 'vp' | 'director' | 'manager' | 'individual';
  department: string;
  priorities: string[];
  challenges: string[];
}

export interface SignalDefinition {
  id: string;
  name: string;
  category: 'hiring' | 'funding' | 'technology' | 'growth' | 'intent' | 'engagement';
  weight: number;
  description: string;
}

// ============================================
// SEARCH & DISCOVERY
// ============================================

export interface SearchRun {
  id: string;
  workspaceId: string;
  icpId: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  totalCompanies: number;
  matchedCompanies: number;
  creditsUsed: number;
  filters: SearchFilters;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface SearchFilters {
  industries?: string[];
  companySizes?: string[];
  regions?: string[];
  technologies?: string[];
  fundingStages?: string[];
  signals?: string[];
  excludeExisting?: boolean;
}

// ============================================
// COMPANIES & CONTACTS
// ============================================

export interface Company {
  id: string;
  name: string;
  domain: string;
  logoUrl?: string;
  description?: string;
  industry: string;
  subIndustry?: string;
  employeeCount: number;
  employeeRange: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  revenue?: number;
  revenueRange?: string;
  foundedYear?: number;
  headquarters: {
    city?: string;
    state?: string;
    country: string;
  };
  type: 'startup' | 'scaleup' | 'enterprise' | 'agency' | 'other';
  funding?: {
    totalRaised?: number;
    lastRound?: string;
    lastRoundDate?: Date;
    investors?: string[];
  };
  technologies: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    crunchbase?: string;
  };
  signals: Signal[];
  icpScore: number;
  lastUpdated: Date;
}

export interface Contact {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  emailStatus: 'verified' | 'unverified' | 'invalid' | 'unknown';
  phone?: string;
  title: string;
  seniority: 'c-level' | 'vp' | 'director' | 'manager' | 'individual';
  department: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  location?: string;
  lastUpdated: Date;
}

export interface Signal {
  id: string;
  companyId: string;
  type: 'hiring' | 'funding' | 'technology' | 'growth' | 'intent' | 'news';
  title: string;
  description: string;
  strength: 'weak' | 'moderate' | 'strong';
  source: string;
  sourceUrl?: string;
  detectedAt: Date;
  expiresAt?: Date;
}

// ============================================
// LISTS & SAVED ITEMS
// ============================================

export interface ProspectList {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  type: 'static' | 'dynamic';
  companyCount: number;
  contactCount: number;
  companies: string[]; // Company IDs
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface SavedCompany {
  id: string;
  workspaceId: string;
  companyId: string;
  company: Company;
  savedBy: string;
  savedAt: Date;
  notes?: string;
  tags: string[];
  stage: 'new' | 'researching' | 'qualified' | 'outreach' | 'meeting' | 'won' | 'lost';
}

export interface Watchlist {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  companies: string[];
  alertSettings: {
    emailAlerts: boolean;
    signalTypes: Signal['type'][];
    frequency: 'realtime' | 'daily' | 'weekly';
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// UI HELPERS
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
