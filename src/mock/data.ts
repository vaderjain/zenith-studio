/**
 * Mock Data for Development
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
} from '@/types';

// ============================================
// PLANS
// ============================================

export const plans: Plan[] = [
  {
    id: 'plan_starter',
    name: 'starter',
    displayName: 'Starter',
    monthlyCredits: 100,
    maxMembers: 3,
    maxSearchRuns: 5,
    features: ['Basic ICP generation', 'Manual company search', 'Export to CSV'],
    priceMonthly: 49,
    priceYearly: 470,
  },
  {
    id: 'plan_pro',
    name: 'pro',
    displayName: 'Pro',
    monthlyCredits: 500,
    maxMembers: 10,
    maxSearchRuns: 25,
    features: [
      'Advanced ICP generation',
      'AI-powered search',
      'Signal tracking',
      'CRM integrations',
      'API access',
    ],
    priceMonthly: 149,
    priceYearly: 1430,
  },
  {
    id: 'plan_enterprise',
    name: 'enterprise',
    displayName: 'Enterprise',
    monthlyCredits: 5000,
    maxMembers: -1,
    maxSearchRuns: -1,
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'SSO/SAML',
    ],
    priceMonthly: 499,
    priceYearly: 4790,
  },
];

// ============================================
// MEMBERS
// ============================================

export const members: Member[] = [
  {
    id: 'member_1',
    userId: 'user_1',
    workspaceId: 'ws_1',
    email: 'sarah@acme.com',
    name: 'Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: 'owner',
    invitedAt: new Date('2024-01-15'),
    joinedAt: new Date('2024-01-15'),
    status: 'active',
  },
  {
    id: 'member_2',
    userId: 'user_2',
    workspaceId: 'ws_1',
    email: 'marcus@acme.com',
    name: 'Marcus Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: 'admin',
    invitedAt: new Date('2024-02-01'),
    joinedAt: new Date('2024-02-02'),
    status: 'active',
  },
  {
    id: 'member_3',
    userId: 'user_3',
    workspaceId: 'ws_1',
    email: 'emily@acme.com',
    name: 'Emily Watson',
    role: 'member',
    invitedAt: new Date('2024-03-10'),
    joinedAt: new Date('2024-03-11'),
    status: 'active',
  },
  {
    id: 'member_4',
    userId: 'user_4',
    workspaceId: 'ws_1',
    email: 'david@acme.com',
    name: 'David Park',
    role: 'viewer',
    invitedAt: new Date('2024-03-15'),
    status: 'pending',
  },
];

// ============================================
// WORKSPACES
// ============================================

export const workspaces: Workspace[] = [
  {
    id: 'ws_1',
    name: 'Acme Corp',
    slug: 'acme-corp',
    logoUrl: undefined,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-20'),
    plan: plans[1],
    members: members,
    creditBalance: 342,
  },
];

// ============================================
// CREDIT LEDGER
// ============================================

export const creditLedger: CreditLedger[] = [
  {
    id: 'ledger_1',
    workspaceId: 'ws_1',
    type: 'credit',
    amount: 500,
    balance: 500,
    description: 'Monthly credit allocation',
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'ledger_2',
    workspaceId: 'ws_1',
    type: 'debit',
    amount: -50,
    balance: 450,
    description: 'Search run: Tech Startups Q2',
    metadata: { searchRunId: 'search_1' },
    createdAt: new Date('2024-06-05'),
  },
  {
    id: 'ledger_3',
    workspaceId: 'ws_1',
    type: 'debit',
    amount: -75,
    balance: 375,
    description: 'Search run: Enterprise SaaS',
    metadata: { searchRunId: 'search_2' },
    createdAt: new Date('2024-06-10'),
  },
  {
    id: 'ledger_4',
    workspaceId: 'ws_1',
    type: 'debit',
    amount: -33,
    balance: 342,
    description: 'Contact enrichment (33 contacts)',
    createdAt: new Date('2024-06-15'),
  },
];

// ============================================
// PRODUCT PROFILES
// ============================================

export const productProfiles: ProductProfile[] = [
  {
    id: 'product_1',
    workspaceId: 'ws_1',
    name: 'CloudSync Pro',
    description: 'Enterprise-grade file synchronization and collaboration platform for distributed teams',
    website: 'https://cloudsync.example.com',
    industry: 'SaaS / Productivity',
    targetMarket: 'enterprise',
    painPoints: [
      'Data silos across departments',
      'Security compliance requirements',
      'Slow file access for remote teams',
    ],
    valueProposition: 'Secure, fast, and compliant file collaboration that scales with your enterprise',
    competitors: ['Dropbox Business', 'Box', 'SharePoint'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-06-15'),
  },
];

// ============================================
// ICPs
// ============================================

export const icps: ICP[] = [
  {
    id: 'icp_1',
    productProfileId: 'product_1',
    name: 'Enterprise IT Buyers',
    description: 'Large enterprises with complex IT infrastructure seeking secure collaboration solutions',
    firmographics: {
      industries: ['Technology', 'Financial Services', 'Healthcare', 'Manufacturing'],
      companySizes: ['501-1000', '1000+'],
      regions: ['North America', 'Europe'],
      revenue: { min: 50000000, max: undefined },
    },
    technographics: {
      mustHave: ['Active Directory', 'SSO/SAML'],
      niceToHave: ['Okta', 'Azure AD', 'Google Workspace'],
      exclude: ['Legacy on-premise only'],
    },
    buyerPersonas: [
      {
        id: 'persona_1',
        title: 'Chief Information Officer',
        seniority: 'c-level',
        department: 'IT',
        priorities: ['Security', 'Scalability', 'Cost optimization'],
        challenges: ['Shadow IT', 'Compliance', 'Integration complexity'],
      },
      {
        id: 'persona_2',
        title: 'VP of IT Operations',
        seniority: 'vp',
        department: 'IT',
        priorities: ['Reliability', 'User adoption', 'Support quality'],
        challenges: ['Team bandwidth', 'Training', 'Vendor management'],
      },
    ],
    signals: [
      {
        id: 'signal_def_1',
        name: 'Digital Transformation Initiative',
        category: 'intent',
        weight: 0.9,
        description: 'Company announcing digital transformation or modernization efforts',
      },
      {
        id: 'signal_def_2',
        name: 'Remote Work Expansion',
        category: 'hiring',
        weight: 0.7,
        description: 'Hiring for remote positions or announcing remote work policies',
      },
    ],
    score: 87,
    confidence: 'high',
    generatedAt: new Date('2024-03-01'),
  },
];

// ============================================
// COMPANIES
// ============================================

export const companies: Company[] = [
  {
    id: 'company_1',
    name: 'TechVenture Inc',
    domain: 'techventure.io',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop',
    description: 'AI-powered analytics platform for modern data teams',
    industry: 'Technology',
    subIndustry: 'Business Intelligence',
    employeeCount: 245,
    employeeRange: '201-500',
    revenue: 28000000,
    revenueRange: '$10M - $50M',
    foundedYear: 2019,
    headquarters: { city: 'San Francisco', state: 'CA', country: 'United States' },
    type: 'scaleup',
    funding: {
      totalRaised: 45000000,
      lastRound: 'Series B',
      lastRoundDate: new Date('2024-01-15'),
      investors: ['Sequoia Capital', 'Index Ventures'],
    },
    technologies: ['Snowflake', 'AWS', 'React', 'Python', 'Kubernetes'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techventure',
      twitter: 'https://twitter.com/techventure',
    },
    signals: [],
    icpScore: 92,
    lastUpdated: new Date('2024-06-20'),
  },
  {
    id: 'company_2',
    name: 'FinServe Global',
    domain: 'finserveglobal.com',
    description: 'Enterprise financial services and payment solutions',
    industry: 'Financial Services',
    subIndustry: 'Payments',
    employeeCount: 1250,
    employeeRange: '1000+',
    revenue: 180000000,
    revenueRange: '$100M - $500M',
    foundedYear: 2008,
    headquarters: { city: 'New York', state: 'NY', country: 'United States' },
    type: 'enterprise',
    funding: {
      totalRaised: 120000000,
      lastRound: 'Series D',
      lastRoundDate: new Date('2023-06-01'),
    },
    technologies: ['Azure', 'Oracle', 'Java', '.NET', 'Salesforce'],
    signals: [],
    icpScore: 88,
    lastUpdated: new Date('2024-06-18'),
  },
  {
    id: 'company_3',
    name: 'HealthFlow Systems',
    domain: 'healthflow.io',
    description: 'Patient engagement and telehealth platform',
    industry: 'Healthcare',
    subIndustry: 'Health Tech',
    employeeCount: 89,
    employeeRange: '51-200',
    foundedYear: 2021,
    headquarters: { city: 'Boston', state: 'MA', country: 'United States' },
    type: 'startup',
    funding: {
      totalRaised: 12000000,
      lastRound: 'Series A',
      lastRoundDate: new Date('2024-03-01'),
    },
    technologies: ['GCP', 'React Native', 'Node.js', 'PostgreSQL'],
    signals: [],
    icpScore: 76,
    lastUpdated: new Date('2024-06-19'),
  },
  {
    id: 'company_4',
    name: 'CloudScale Labs',
    domain: 'cloudscale.dev',
    description: 'Infrastructure automation for cloud-native teams',
    industry: 'Technology',
    subIndustry: 'DevOps',
    employeeCount: 42,
    employeeRange: '11-50',
    foundedYear: 2022,
    headquarters: { city: 'Austin', state: 'TX', country: 'United States' },
    type: 'startup',
    funding: {
      totalRaised: 5000000,
      lastRound: 'Seed',
      lastRoundDate: new Date('2023-09-15'),
    },
    technologies: ['Terraform', 'Kubernetes', 'Go', 'AWS', 'Pulumi'],
    signals: [],
    icpScore: 81,
    lastUpdated: new Date('2024-06-17'),
  },
  {
    id: 'company_5',
    name: 'RetailNext AI',
    domain: 'retailnextai.com',
    description: 'AI-driven retail analytics and customer insights',
    industry: 'Retail',
    subIndustry: 'Retail Tech',
    employeeCount: 156,
    employeeRange: '51-200',
    foundedYear: 2020,
    headquarters: { city: 'Seattle', state: 'WA', country: 'United States' },
    type: 'scaleup',
    funding: {
      totalRaised: 25000000,
      lastRound: 'Series A',
      lastRoundDate: new Date('2024-02-01'),
    },
    technologies: ['AWS', 'Python', 'TensorFlow', 'Databricks'],
    signals: [],
    icpScore: 72,
    lastUpdated: new Date('2024-06-16'),
  },
];

// ============================================
// SIGNALS
// ============================================

export const signals: Signal[] = [
  {
    id: 'signal_1',
    companyId: 'company_1',
    type: 'funding',
    title: 'Series B Funding',
    description: 'TechVenture raised $30M in Series B funding led by Sequoia Capital',
    strength: 'strong',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    detectedAt: new Date('2024-01-15'),
  },
  {
    id: 'signal_2',
    companyId: 'company_1',
    type: 'hiring',
    title: 'Rapid Engineering Growth',
    description: 'Posted 15+ engineering positions in the last 30 days',
    strength: 'strong',
    source: 'LinkedIn',
    detectedAt: new Date('2024-06-10'),
  },
  {
    id: 'signal_3',
    companyId: 'company_2',
    type: 'technology',
    title: 'Cloud Migration',
    description: 'Announced migration from on-premise to Azure cloud infrastructure',
    strength: 'moderate',
    source: 'Press Release',
    detectedAt: new Date('2024-05-20'),
  },
  {
    id: 'signal_4',
    companyId: 'company_3',
    type: 'growth',
    title: 'Customer Expansion',
    description: 'Announced partnership with 3 major hospital networks',
    strength: 'strong',
    source: 'Company Blog',
    detectedAt: new Date('2024-06-01'),
  },
];

// Attach signals to companies
companies[0].signals = signals.filter(s => s.companyId === 'company_1');
companies[1].signals = signals.filter(s => s.companyId === 'company_2');
companies[2].signals = signals.filter(s => s.companyId === 'company_3');

// ============================================
// CONTACTS
// ============================================

export const contacts: Contact[] = [
  {
    id: 'contact_1',
    companyId: 'company_1',
    firstName: 'Michael',
    lastName: 'Torres',
    fullName: 'Michael Torres',
    email: 'michael.torres@techventure.io',
    emailStatus: 'verified',
    title: 'Chief Technology Officer',
    seniority: 'c-level',
    department: 'Engineering',
    linkedinUrl: 'https://linkedin.com/in/michaeltorres',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    location: 'San Francisco, CA',
    lastUpdated: new Date('2024-06-15'),
  },
  {
    id: 'contact_2',
    companyId: 'company_1',
    firstName: 'Jennifer',
    lastName: 'Liu',
    fullName: 'Jennifer Liu',
    email: 'jennifer.liu@techventure.io',
    emailStatus: 'verified',
    title: 'VP of Engineering',
    seniority: 'vp',
    department: 'Engineering',
    linkedinUrl: 'https://linkedin.com/in/jenniferliu',
    location: 'San Francisco, CA',
    lastUpdated: new Date('2024-06-14'),
  },
  {
    id: 'contact_3',
    companyId: 'company_2',
    firstName: 'Robert',
    lastName: 'Anderson',
    fullName: 'Robert Anderson',
    email: 'randerson@finserveglobal.com',
    emailStatus: 'verified',
    title: 'Chief Information Officer',
    seniority: 'c-level',
    department: 'IT',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    location: 'New York, NY',
    lastUpdated: new Date('2024-06-12'),
  },
  {
    id: 'contact_4',
    companyId: 'company_3',
    firstName: 'Amanda',
    lastName: 'Chen',
    fullName: 'Amanda Chen',
    email: 'amanda@healthflow.io',
    emailStatus: 'verified',
    title: 'CEO & Co-Founder',
    seniority: 'c-level',
    department: 'Executive',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
    location: 'Boston, MA',
    lastUpdated: new Date('2024-06-18'),
  },
];

// ============================================
// SEARCH RUNS
// ============================================

export const searchRuns: SearchRun[] = [
  {
    id: 'search_1',
    workspaceId: 'ws_1',
    icpId: 'icp_1',
    name: 'Tech Startups Q2 2024',
    status: 'completed',
    progress: 100,
    totalCompanies: 1250,
    matchedCompanies: 48,
    creditsUsed: 50,
    filters: {
      industries: ['Technology'],
      companySizes: ['51-200', '201-500'],
      regions: ['North America'],
      fundingStages: ['Series A', 'Series B'],
    },
    startedAt: new Date('2024-06-05T10:00:00'),
    completedAt: new Date('2024-06-05T10:23:00'),
  },
  {
    id: 'search_2',
    workspaceId: 'ws_1',
    icpId: 'icp_1',
    name: 'Enterprise SaaS Companies',
    status: 'completed',
    progress: 100,
    totalCompanies: 3200,
    matchedCompanies: 156,
    creditsUsed: 75,
    filters: {
      industries: ['Technology', 'Financial Services'],
      companySizes: ['501-1000', '1000+'],
      regions: ['North America', 'Europe'],
    },
    startedAt: new Date('2024-06-10T14:30:00'),
    completedAt: new Date('2024-06-10T15:12:00'),
  },
  {
    id: 'search_3',
    workspaceId: 'ws_1',
    icpId: 'icp_1',
    name: 'Healthcare Tech Buyers',
    status: 'running',
    progress: 67,
    totalCompanies: 890,
    matchedCompanies: 23,
    creditsUsed: 0,
    filters: {
      industries: ['Healthcare'],
      companySizes: ['51-200', '201-500', '501-1000'],
      signals: ['hiring', 'funding'],
    },
    startedAt: new Date('2024-06-20T09:00:00'),
  },
];

// ============================================
// PROSPECT LISTS
// ============================================

export const prospectLists: ProspectList[] = [
  {
    id: 'list_1',
    workspaceId: 'ws_1',
    name: 'Q2 Outreach - Series B Companies',
    description: 'High-priority companies for Q2 outreach campaign',
    type: 'static',
    companyCount: 24,
    contactCount: 67,
    companies: ['company_1', 'company_4'],
    createdBy: 'member_1',
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-06-18'),
    tags: ['q2-2024', 'high-priority'],
  },
  {
    id: 'list_2',
    workspaceId: 'ws_1',
    name: 'Enterprise Prospects',
    description: 'Large enterprise companies matching our ICP',
    type: 'dynamic',
    companyCount: 156,
    contactCount: 423,
    companies: ['company_2'],
    createdBy: 'member_2',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-06-20'),
    tags: ['enterprise', 'auto-updated'],
  },
];

// ============================================
// SAVED COMPANIES
// ============================================

export const savedCompanies: SavedCompany[] = [
  {
    id: 'saved_1',
    workspaceId: 'ws_1',
    companyId: 'company_1',
    company: companies[0],
    savedBy: 'member_1',
    savedAt: new Date('2024-06-10'),
    notes: 'Great fit for our enterprise solution. CTO is active on LinkedIn.',
    tags: ['high-priority', 'enterprise'],
    stage: 'qualified',
  },
  {
    id: 'saved_2',
    workspaceId: 'ws_1',
    companyId: 'company_3',
    company: companies[2],
    savedBy: 'member_2',
    savedAt: new Date('2024-06-15'),
    notes: 'Recently raised Series A, likely expanding tech stack',
    tags: ['healthcare', 'startup'],
    stage: 'researching',
  },
];

// ============================================
// WATCHLISTS
// ============================================

export const watchlists: Watchlist[] = [
  {
    id: 'watchlist_1',
    workspaceId: 'ws_1',
    name: 'Funding Alerts',
    description: 'Track companies for funding announcements',
    companies: ['company_3', 'company_4', 'company_5'],
    alertSettings: {
      emailAlerts: true,
      signalTypes: ['funding', 'growth'],
      frequency: 'daily',
    },
    createdBy: 'member_1',
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: 'watchlist_2',
    workspaceId: 'ws_1',
    name: 'Competitor Tracking',
    description: 'Monitor competitor customer movements',
    companies: ['company_1', 'company_2'],
    alertSettings: {
      emailAlerts: true,
      signalTypes: ['technology', 'hiring', 'news'],
      frequency: 'weekly',
    },
    createdBy: 'member_1',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-06-10'),
  },
];
