import mongoose, { Schema, Document } from "mongoose";
import type { CompanyType } from "./company.interface";
import { COMPANY_SIZE, SUBSCRIPTION_PLANS } from "../../../../data";

export interface CompanyDocumentType extends CompanyType, Document {}

const CompanySchema: Schema = new Schema<CompanyDocumentType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    registrationNumber: { type: String },
    industryType: { type: String },
    size: {
      type: String,
      enum: COMPANY_SIZE,
    },
    logo: { type: String },
    website: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    timezone: { type: String, default: "UTC" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
    plan: { type: String, enum: SUBSCRIPTION_PLANS, default: "free" },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    onboardingCompleted: { type: Boolean, default: false },
    settings: {
      workingDays: [String],
      workingHoursStart: String,
      workingHoursEnd: String,
      defaultCurrency: { type: String, default: "USD" },
      allowSelfRegistration: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CompanyModel = mongoose.model<CompanyDocumentType>(
  "Company",
  CompanySchema,
);
