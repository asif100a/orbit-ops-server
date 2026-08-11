import { Types } from "mongoose";
import { z } from "zod";
import {
  COMPANY_INDUSTRIES,
  COMPANY_SIZE,
  SUBSCRIPTION_PLANS,
} from "../../../../data";

// Reusable validator for Mongoose ObjectId
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const CompanySchema = z.object({
  name: z.string().nonempty({ message: "Name is required." }),
  slug: z.string().nonempty({ message: "Slug is required." }),
  registrationNumber: z.string().optional(),
  industryType: z.enum([...COMPANY_INDUSTRIES]),
  size: z.enum([...COMPANY_SIZE], {
    error: () => ({ message: "Invalid company size." }),
  }),
  logo: z.url({ message: "Logo must be a valid URL" }).optional(),
  website: z.url({ message: "Website must be a valid URL" }).optional(),
  email: z.email({ message: "Invalid email address." }),
  phoneNumber: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
  timezone: z.string().optional(),
  owner: objectIdSchema,
  admins: z.array(objectIdSchema).optional(),
  plan: z.enum([...SUBSCRIPTION_PLANS]),
  isActive: z.boolean(),
  isVerified: z.boolean(),
  onboardingCompleted: z.boolean(),
  settings: z
    .object({
      workingDays: z.array(z.string()).optional(),
      workingHoursStart: z.string().optional(),
      workingHoursEnd: z.string().optional(),
      defaultCurrency: z.string().optional(),
      allowSelfRegistration: z.boolean().optional(),
    })
    .optional(),
});

export type Company = z.infer<typeof CompanySchema>;
