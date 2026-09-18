import type { Types } from "mongoose";

export type SubscriptionPlanType = 'STARTER' | 'GROWTH' | 'SCALE'

export interface PaymentType {
  userId: Types.ObjectId;
  stripeCheckoutSessionId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  plan: SubscriptionPlanType;
  status:
    | "pending"
    | "active"
    | "trialing"
    | "paused"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "incomplete"
    | "incomplete_expired"
    | "failed";
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentResponseType {
  success: boolean;
  data?: PaymentType | PaymentType[];
  message: string;
}
