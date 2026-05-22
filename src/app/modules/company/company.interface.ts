export default interface CompanyType {
  // Basic Info
  name: string;
  authorId: string;
  type: "LLC" | "PLC" | "Private" | "Public" | "NonProfit" | "Startup";
  size: "1-10" | "11-50" | "51-200" | "201-500";
  description?: string;
  foundedYear?: number;
  website?: string;
  email?: string;
  phone?: string;
  // Social & Media
  logo?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  // Status
  isVerified?: boolean;
  isActive?: boolean;
  status?: "pending" | "approved" | "rejected" | "suspended";
}
