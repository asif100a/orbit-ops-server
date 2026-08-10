import type { SchemaDefinitionProperty, Types } from "mongoose";
import type { CompanyIndustry } from "../../../../data";

export interface CompanyType {
  name: string;
  slug: string
  registrationNumber?: string;
  industryType: CompanyIndustry;
  size: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
  logo?: string;
  website?: string;
  email: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }
  timezone?: string;
  owner: Types.ObjectId;
  admins?: Types.ObjectId[];
  plan: SchemaDefinitionProperty<"FREE" | "PRO" | "ENTERPRISE">;
  isActive: boolean;
  isVerified: boolean;
  onboardingCompleted: boolean;
  settings?: {
    workingDays?: string[];
    workingHoursStart?: string;
    workingHoursEnd?: string;
    defaultCurrency?: string;
    allowSelfRegistration?: boolean;
  }
}

export interface CompanyResponseType {
  success: boolean;
  data?: CompanyType | CompanyType[];
  message: string;
}
