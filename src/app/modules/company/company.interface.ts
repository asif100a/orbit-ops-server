import type { SchemaDefinitionProperty, Types } from "mongoose";
import type { CompanyIndustry, CompanySize, SubscriptionPlans } from "../../../../data";

export interface CompanyType {
  name: string;
  slug: string
  registrationNumber?: string;
  industryType: CompanyIndustry;
  size: CompanySize;
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
  plan: SchemaDefinitionProperty<SubscriptionPlans>;
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
