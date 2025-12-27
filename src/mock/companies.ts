/**
 * Mock Company Generator - Simplified
 */

import type { Company, Signal } from "@/types";

export type SegmentType = "startups" | "enterprise" | "both";

// Generate mock companies on demand
function generateCompanies(): { startups: Company[]; enterprises: Company[] } {
  const startups: Company[] = [];
  const enterprises: Company[] = [];
  
  const industries = ["Technology", "Financial Services", "Healthcare", "Retail", "Manufacturing"];
  const cities = [
    { city: "San Francisco", state: "CA", country: "United States" },
    { city: "New York", state: "NY", country: "United States" },
    { city: "Boston", state: "MA", country: "United States" },
    { city: "Austin", state: "TX", country: "United States" },
    { city: "Seattle", state: "WA", country: "United States" },
    { city: "London", country: "United Kingdom" },
    { city: "Berlin", country: "Germany" },
  ];
  const signalTitles = ["Hiring GTM", "Raised Series B", "Uses Salesforce", "Cloud migration", "New CTO"];
  
  // Generate 300 startups
  for (let i = 0; i < 300; i++) {
    const industry = industries[i % industries.length];
    const location = cities[i % cities.length];
    const icpScore = 65 + Math.floor((i * 7) % 34);
    
    startups.push({
      id: `startup_${i}`,
      name: `Startup${i + 1} Labs`,
      domain: `startup${i + 1}.io`,
      description: `Innovative ${industry.toLowerCase()} solution for modern businesses`,
      industry,
      employeeCount: 20 + (i % 200),
      employeeRange: i % 4 === 0 ? "1-10" : i % 4 === 1 ? "11-50" : i % 4 === 2 ? "51-200" : "201-500",
      headquarters: location,
      type: i % 2 === 0 ? "startup" : "scaleup",
      funding: { totalRaised: 5000000 + i * 100000, lastRound: i % 2 === 0 ? "Seed" : "Series A" },
      technologies: ["AWS", "React", "Node.js"],
      signals: i % 3 === 0 ? [{
        id: `signal_s_${i}`,
        companyId: `startup_${i}`,
        type: "hiring" as const,
        title: signalTitles[i % signalTitles.length],
        description: "Recent activity detected",
        strength: "moderate" as const,
        source: "LinkedIn",
        detectedAt: new Date(),
      }] : [],
      icpScore,
      lastUpdated: new Date(),
    });
  }
  
  // Generate 300 enterprises
  for (let i = 0; i < 300; i++) {
    const industry = industries[i % industries.length];
    const location = cities[i % cities.length];
    const icpScore = 70 + Math.floor((i * 7) % 29);
    
    enterprises.push({
      id: `enterprise_${i}`,
      name: `Enterprise${i + 1} Corp`,
      domain: `enterprise${i + 1}.com`,
      description: `Enterprise-grade ${industry.toLowerCase()} platform`,
      industry,
      employeeCount: 600 + i * 50,
      employeeRange: i % 2 === 0 ? "501-1000" : "1000+",
      headquarters: location,
      type: "enterprise",
      funding: { totalRaised: 100000000 + i * 1000000, lastRound: "Series D" },
      technologies: ["Azure", "Java", "Salesforce"],
      signals: i % 2 === 0 ? [{
        id: `signal_e_${i}`,
        companyId: `enterprise_${i}`,
        type: "funding" as const,
        title: signalTitles[i % signalTitles.length],
        description: "Recent activity detected",
        strength: "strong" as const,
        source: "Crunchbase",
        detectedAt: new Date(),
      }] : [],
      icpScore,
      lastUpdated: new Date(),
    });
  }
  
  return { startups, enterprises };
}

let cachedData: { startups: Company[]; enterprises: Company[] } | null = null;

function getData() {
  if (!cachedData) {
    cachedData = generateCompanies();
  }
  return cachedData;
}

export interface GetCompaniesOptions {
  segment?: SegmentType;
  page?: number;
  pageSize?: number;
  maxTotal?: number;
  sortBy?: "score" | "name" | "size" | "funding";
  industry?: string;
  sizeFilter?: string;
  searchQuery?: string;
}

export function getSegmentedCompanies(options: GetCompaniesOptions = {}) {
  const { segment = "both", page = 1, pageSize = 25, maxTotal = 500, industry, sizeFilter, searchQuery } = options;
  const { startups, enterprises } = getData();
  
  let companies: Company[] = [];
  let startupCount = 0;
  let enterpriseCount = 0;
  
  if (segment === "startups") {
    companies = startups.slice(0, maxTotal);
    startupCount = companies.length;
  } else if (segment === "enterprise") {
    companies = enterprises.slice(0, maxTotal);
    enterpriseCount = companies.length;
  } else {
    const half = Math.floor(maxTotal / 2);
    companies = [...startups.slice(0, half), ...enterprises.slice(0, half)];
    startupCount = half;
    enterpriseCount = half;
  }
  
  // Filter
  if (industry && industry !== "all") {
    companies = companies.filter(c => c.industry.toLowerCase() === industry.toLowerCase());
  }
  if (sizeFilter && sizeFilter !== "all") {
    companies = companies.filter(c => c.employeeRange === sizeFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    companies = companies.filter(c => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
  }
  
  // Sort by score
  companies.sort((a, b) => b.icpScore - a.icpScore);
  
  const total = companies.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedCompanies = companies.slice(startIndex, startIndex + pageSize);
  
  return {
    companies: paginatedCompanies,
    total,
    startupCount,
    enterpriseCount,
    hasMore: startIndex + pageSize < total,
    page,
    pageSize,
  };
}
