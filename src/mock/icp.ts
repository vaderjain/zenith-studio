/**
 * Mock ICP Data with LLM Reasoning
 */

export interface ICPData {
  industries: {
    values: string[];
    reasoning: string;
  };
  companySizes: {
    values: string[];
    reasoning: string;
  };
  regions: {
    values: string[];
    reasoning: string;
  };
  techSignals: {
    values: string[];
    reasoning: string;
  };
  disqualifiers: {
    values: string[];
    reasoning: string;
  };
  keywords: {
    values: string[];
    reasoning: string;
  };
  buyingSignals: {
    values: string[];
    reasoning: string;
  };
  confidenceScore: number;
}

export const mockICPData: ICPData = {
  industries: {
    values: ["SaaS / Software", "FinTech", "Developer Tools", "Data & Analytics"],
    reasoning: "Based on your product category (SaaS/Software) and target buyer (Engineering/IT), companies in these industries typically have the technical sophistication and budget for developer-focused tools. FinTech companies especially have high compliance and security needs that align with your value proposition.",
  },
  companySizes: {
    values: ["51-200", "201-500", "501-1000"],
    reasoning: "Your pricing tier ($500-$2,000/mo) suggests mid-market focus. Companies in this range have dedicated IT/engineering teams but aren't so large that procurement becomes a 6+ month cycle. They're often scaling rapidly and need solutions that grow with them.",
  },
  regions: {
    values: ["North America", "Europe", "Asia Pacific"],
    reasoning: "Based on your target region selection and typical buying patterns for your product category. North America leads in SaaS adoption, followed by Europe (especially UK, Germany, Nordics) and growing markets in APAC (Australia, Singapore, Japan).",
  },
  techSignals: {
    values: ["AWS", "React", "Node.js", "Kubernetes", "Terraform", "PostgreSQL"],
    reasoning: "Companies using these technologies indicate modern cloud-native architecture and engineering practices. They're likely to value developer productivity tools and have technical decision-makers who can evaluate and champion your solution.",
  },
  disqualifiers: {
    values: ["Legacy on-premise only", "No engineering team", "Government/Public Sector", "Pre-revenue startups"],
    reasoning: "These segments either lack the technical infrastructure to benefit from your product, have prohibitive procurement processes, or don't have the budget for a solution at your price point. Excluding them improves conversion rates significantly.",
  },
  keywords: {
    values: ["digital transformation", "developer experience", "DevOps", "cloud migration", "engineering velocity", "platform team"],
    reasoning: "These keywords appear frequently in job postings and content from companies that successfully adopt products like yours. They indicate priority alignment with your value proposition and active investment in the problem space you solve.",
  },
  buyingSignals: {
    values: ["Recent Series A/B funding", "Hiring engineers", "New CTO/VP Engineering", "Tech stack migration", "Expansion announced"],
    reasoning: "These events correlate strongly with technology purchasing decisions. Funded companies have budget, hiring indicates growth, new leadership often triggers tool evaluation, and migrations create natural buying windows.",
  },
  confidenceScore: 87,
};

export function getICPData(): ICPData {
  return mockICPData;
}
