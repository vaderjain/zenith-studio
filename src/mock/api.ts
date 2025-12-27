/**
 * Mock API Layer
 * Simulates async API calls with realistic delays
 */

import type {
  Workspace,
  Member,
  Plan,
  CreditLedger,
  ProductProfile,
  ICP,
  SearchRun,
  Company,
  Contact,
  Signal,
  ProspectList,
  SavedCompany,
  Watchlist,
  PaginatedResponse,
} from '@/types';

import {
  workspaces,
  members,
  plans,
  creditLedger,
  productProfiles,
  icps,
  searchRuns,
  companies,
  contacts,
  signals,
  prospectLists,
  savedCompanies,
  watchlists,
} from './data';

// ============================================
// HELPERS
// ============================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const randomDelay = (min = 200, max = 800) => delay(Math.random() * (max - min) + min);

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = items.slice(start, end);
  const totalPages = Math.ceil(items.length / pageSize);

  return {
    data,
    total: items.length,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
  };
}

// ============================================
// WORKSPACE APIs
// ============================================

export async function getWorkspace(id: string): Promise<Workspace | null> {
  await randomDelay();
  return workspaces.find(w => w.id === id) || null;
}

export async function getCurrentWorkspace(): Promise<Workspace> {
  await randomDelay();
  return workspaces[0];
}

export async function getWorkspaceMembers(workspaceId: string): Promise<Member[]> {
  await randomDelay();
  return members.filter(m => m.workspaceId === workspaceId);
}

export async function inviteMember(workspaceId: string, email: string, role: Member['role']): Promise<Member> {
  await randomDelay(500, 1000);
  const newMember: Member = {
    id: `member_${Date.now()}`,
    userId: `user_${Date.now()}`,
    workspaceId,
    email,
    name: email.split('@')[0],
    role,
    invitedAt: new Date(),
    status: 'pending',
  };
  members.push(newMember);
  return newMember;
}

// ============================================
// PLAN APIs
// ============================================

export async function getPlans(): Promise<Plan[]> {
  await randomDelay();
  return plans;
}

export async function getPlan(id: string): Promise<Plan | null> {
  await randomDelay();
  return plans.find(p => p.id === id) || null;
}

// ============================================
// CREDIT APIs
// ============================================

export async function getCreditLedger(
  workspaceId: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<CreditLedger>> {
  await randomDelay();
  const filtered = creditLedger.filter(c => c.workspaceId === workspaceId);
  return paginate(filtered, page, pageSize);
}

export async function getCreditBalance(workspaceId: string): Promise<number> {
  await randomDelay(100, 300);
  const workspace = workspaces.find(w => w.id === workspaceId);
  return workspace?.creditBalance || 0;
}

// ============================================
// PRODUCT PROFILE APIs
// ============================================

export async function getProductProfiles(workspaceId: string): Promise<ProductProfile[]> {
  await randomDelay();
  return productProfiles.filter(p => p.workspaceId === workspaceId);
}

export async function getProductProfile(id: string): Promise<ProductProfile | null> {
  await randomDelay();
  return productProfiles.find(p => p.id === id) || null;
}

export async function createProductProfile(data: Omit<ProductProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductProfile> {
  await randomDelay(800, 1500);
  const newProfile: ProductProfile = {
    ...data,
    id: `product_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  productProfiles.push(newProfile);
  return newProfile;
}

// ============================================
// ICP APIs
// ============================================

export async function getICPs(productProfileId: string): Promise<ICP[]> {
  await randomDelay();
  return icps.filter(i => i.productProfileId === productProfileId);
}

export async function getICP(id: string): Promise<ICP | null> {
  await randomDelay();
  return icps.find(i => i.id === id) || null;
}

export async function generateICP(productProfileId: string): Promise<ICP> {
  // Simulate AI generation delay
  await delay(3000);
  const newICP: ICP = {
    ...icps[0],
    id: `icp_${Date.now()}`,
    productProfileId,
    generatedAt: new Date(),
  };
  icps.push(newICP);
  return newICP;
}

// ============================================
// SEARCH APIs
// ============================================

export async function getSearchRuns(
  workspaceId: string,
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<SearchRun>> {
  await randomDelay();
  const filtered = searchRuns.filter(s => s.workspaceId === workspaceId);
  return paginate(filtered, page, pageSize);
}

export async function getSearchRun(id: string): Promise<SearchRun | null> {
  await randomDelay();
  return searchRuns.find(s => s.id === id) || null;
}

export async function createSearchRun(data: {
  workspaceId: string;
  icpId: string;
  name: string;
  filters: SearchRun['filters'];
}): Promise<SearchRun> {
  await randomDelay(500, 1000);
  const newSearch: SearchRun = {
    id: `search_${Date.now()}`,
    ...data,
    status: 'pending',
    progress: 0,
    totalCompanies: 0,
    matchedCompanies: 0,
    creditsUsed: 0,
    startedAt: new Date(),
  };
  searchRuns.push(newSearch);
  return newSearch;
}

// ============================================
// COMPANY APIs
// ============================================

export async function getCompanies(
  page = 1,
  pageSize = 20,
  filters?: {
    industry?: string;
    companySize?: string;
    minScore?: number;
  }
): Promise<PaginatedResponse<Company>> {
  await randomDelay();
  
  let filtered = [...companies];
  
  if (filters?.industry) {
    filtered = filtered.filter(c => c.industry === filters.industry);
  }
  if (filters?.companySize) {
    filtered = filtered.filter(c => c.employeeRange === filters.companySize);
  }
  if (filters?.minScore) {
    filtered = filtered.filter(c => c.icpScore >= filters.minScore);
  }
  
  return paginate(filtered, page, pageSize);
}

export async function getCompany(id: string): Promise<Company | null> {
  await randomDelay();
  return companies.find(c => c.id === id) || null;
}

export async function searchCompanies(query: string): Promise<Company[]> {
  await randomDelay(300, 600);
  const lowerQuery = query.toLowerCase();
  return companies.filter(
    c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.domain.toLowerCase().includes(lowerQuery) ||
      c.industry.toLowerCase().includes(lowerQuery)
  );
}

// ============================================
// CONTACT APIs
// ============================================

export async function getContacts(
  companyId?: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Contact>> {
  await randomDelay();
  let filtered = contacts;
  if (companyId) {
    filtered = contacts.filter(c => c.companyId === companyId);
  }
  return paginate(filtered, page, pageSize);
}

export async function getContact(id: string): Promise<Contact | null> {
  await randomDelay();
  return contacts.find(c => c.id === id) || null;
}

export async function enrichContact(id: string): Promise<Contact> {
  await delay(2000); // Simulate enrichment
  const contact = contacts.find(c => c.id === id);
  if (!contact) throw new Error('Contact not found');
  contact.emailStatus = 'verified';
  contact.lastUpdated = new Date();
  return contact;
}

// ============================================
// SIGNAL APIs
// ============================================

export async function getSignals(companyId: string): Promise<Signal[]> {
  await randomDelay();
  return signals.filter(s => s.companyId === companyId);
}

export async function getRecentSignals(
  workspaceId: string,
  limit = 10
): Promise<Signal[]> {
  await randomDelay();
  return signals
    .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
    .slice(0, limit);
}

// ============================================
// PROSPECT LIST APIs
// ============================================

export async function getProspectLists(workspaceId: string): Promise<ProspectList[]> {
  await randomDelay();
  return prospectLists.filter(l => l.workspaceId === workspaceId);
}

export async function getProspectList(id: string): Promise<ProspectList | null> {
  await randomDelay();
  return prospectLists.find(l => l.id === id) || null;
}

export async function createProspectList(data: {
  workspaceId: string;
  name: string;
  description?: string;
  type: 'static' | 'dynamic';
}): Promise<ProspectList> {
  await randomDelay(500, 1000);
  const newList: ProspectList = {
    id: `list_${Date.now()}`,
    ...data,
    companyCount: 0,
    contactCount: 0,
    companies: [],
    createdBy: 'member_1',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
  };
  prospectLists.push(newList);
  return newList;
}

// ============================================
// SAVED COMPANY APIs
// ============================================

export async function getSavedCompanies(
  workspaceId: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<SavedCompany>> {
  await randomDelay();
  const filtered = savedCompanies.filter(s => s.workspaceId === workspaceId);
  return paginate(filtered, page, pageSize);
}

export async function saveCompany(data: {
  workspaceId: string;
  companyId: string;
  notes?: string;
  tags?: string[];
}): Promise<SavedCompany> {
  await randomDelay(300, 600);
  const company = companies.find(c => c.id === data.companyId);
  if (!company) throw new Error('Company not found');
  
  const newSaved: SavedCompany = {
    id: `saved_${Date.now()}`,
    workspaceId: data.workspaceId,
    companyId: data.companyId,
    company,
    savedBy: 'member_1',
    savedAt: new Date(),
    notes: data.notes,
    tags: data.tags || [],
    stage: 'new',
  };
  savedCompanies.push(newSaved);
  return newSaved;
}

// ============================================
// WATCHLIST APIs
// ============================================

export async function getWatchlists(workspaceId: string): Promise<Watchlist[]> {
  await randomDelay();
  return watchlists.filter(w => w.workspaceId === workspaceId);
}

export async function getWatchlist(id: string): Promise<Watchlist | null> {
  await randomDelay();
  return watchlists.find(w => w.id === id) || null;
}

export async function createWatchlist(data: {
  workspaceId: string;
  name: string;
  description?: string;
}): Promise<Watchlist> {
  await randomDelay(500, 1000);
  const newWatchlist: Watchlist = {
    id: `watchlist_${Date.now()}`,
    ...data,
    companies: [],
    alertSettings: {
      emailAlerts: false,
      signalTypes: [],
      frequency: 'daily',
    },
    createdBy: 'member_1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  watchlists.push(newWatchlist);
  return newWatchlist;
}
