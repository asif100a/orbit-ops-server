// -------------------
export const COMPANY_INDUSTRIES = [
  "Technology / Software",
  "IT Services",
  "Finance & Banking",
  "Healthcare & Medical",
  "Education & E-Learning",
  "Manufacturing",
  "Retail & E-Commerce",
  "Real Estate",
  "Construction",
  "Hospitality & Tourism",
  "Food & Beverage",
  "Media & Entertainment",
  "Telecommunications",
  "Transportation & Logistics",
  "Energy & Utilities",
  "Agriculture",
  "Legal Services",
  "Marketing & Advertising",
  "Consulting",
  "Non-Profit / NGO",
  "Government",
  "Insurance",
  "Automotive",
  "Fashion & Apparel",
  "Pharmaceuticals",
  "Aerospace & Defense",
  "Human Resources / Staffing",
  "Sports & Fitness",
  "Other",
] as const;

export type CompanyIndustry = typeof COMPANY_INDUSTRIES[number];

// -------------------
export const COMPANY_SIZE = ["1-10" , "11-50" , "51-200" , "201-500" , "500+"];

export type CompanySize = typeof COMPANY_SIZE[number]

// -------------------
export const SUBSCRIPTION_PLANS = ["FREE" , "PRO" , "ENTERPRISE"]
export type SubscriptionPlans = typeof SUBSCRIPTION_PLANS[number]